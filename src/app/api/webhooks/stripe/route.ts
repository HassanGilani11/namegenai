import { headers } from "next/headers";
import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import prisma from "@/lib/prisma";
import Stripe from "stripe";
import { Prisma } from "@prisma/client";

/**
 * Stripe Webhook Route
 * Handles subscription events, credit resets, and plan updates.
 * Includes idempotency check to prevent duplicate event processing.
 */
export async function POST(req: Request) {
    console.log("[Stripe Webhook] Received request");
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature") as string;

    if (!signature) {
        console.error("[Stripe Webhook] Error: No Stripe-Signature header");
        return new NextResponse("No signature", { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        console.error(`[Stripe Webhook] Error: Signature verification failed. Check STRIPE_WEBHOOK_SECRET. ${error.message}`);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const eventId = event.id;

    // 1. Idempotency Check: Prevent duplicate processing
    const existingEvent = await prisma.webhookEvent.findUnique({
        where: { id: eventId },
    });

    if (existingEvent?.processed) {
        console.log(`[Stripe Webhook] Event ${eventId} already processed, skipping.`);
        return new NextResponse("Event already processed", { status: 200 });
    }

    // 2. Transcations for Subscription Logic
    try {
        console.log(`[Stripe Webhook] Processing event: ${event.type} (${eventId})`);

        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                const organizationId = session.metadata?.organizationId;
                const userId = session.metadata?.userId;
                const type = session.metadata?.type;

                console.log(`[Stripe Webhook] Checkout completed. Org: ${organizationId}, User: ${userId}, Type: ${type}`);

                if (!organizationId || !userId) {
                    console.error("[Stripe Webhook] Missing metadata in checkout session", { organizationId, userId });
                    break;
                }

                await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
                    // Log event
                    await tx.webhookEvent.upsert({
                        where: { id: eventId },
                        create: { id: eventId, processed: true },
                        update: { processed: true },
                    });

                    // Update Organization with Stripe Customer ID
                    await tx.organization.update({
                        where: { id: organizationId },
                        data: { stripeCustomerId: session.customer as string },
                    });

                    // Create Billing Record
                    await tx.billingRecord.create({
                        data: {
                            organizationId,
                            userId,
                            amount: session.amount_total || 0,
                            currency: session.currency || "usd",
                            status: "SUCCESS",
                            type: type?.toUpperCase() || "UNKNOWN",
                            stripeSessionId: session.id,
                        }
                    });

                    // Provision credits based on type (20 for top-up, 100 for first subscription)
                    const creditsToProvision = type === "subscription" ? 100 : 20;
                    const isSubscription = type === "subscription";

                    console.log(`[Stripe Webhook] Provisioning ${creditsToProvision} credits to user ${userId}`);

                    await tx.user.update({
                        where: { id: userId },
                        data: {
                            credits: { increment: creditsToProvision },
                            ...(isSubscription ? { plan: "PRO" } : {})
                        }
                    });
                });
                break;
            }

            case "invoice.payment_succeeded": {
                const invoice = event.data.object as Stripe.Invoice;
                const stripeCustomerId = invoice.customer as string;

                console.log(`[Stripe Webhook] Invoice payment succeeded for customer: ${stripeCustomerId}`);

                const organization = await prisma.organization.findUnique({
                    where: { stripeCustomerId },
                    include: { users: { select: { id: true }, take: 1 } }
                });

                if (!organization) {
                    console.error(`[Stripe Webhook] No organization found for customer ${stripeCustomerId}`);
                    break;
                }

                await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
                    // Log event
                    await tx.webhookEvent.upsert({
                        where: { id: eventId },
                        create: { id: eventId, processed: true },
                        update: { processed: true },
                    });

                    const organizationId = organization.id;
                    const userId = organization.users?.[0]?.id;

                    // Create Billing Record
                    await tx.billingRecord.create({
                        data: {
                            organizationId,
                            userId: userId || "SYSTEM",
                            amount: invoice.amount_paid,
                            currency: invoice.currency,
                            status: "SUCCESS",
                            type: "SUBSCRIPTION_RENEWAL",
                            stripeSessionId: (invoice as any).subscription as string,
                        }
                    });

                    // Reset/Add credits on successful payment
                    if (userId) {
                        console.log(`[Stripe Webhook] Incrementing credits for subscription renewal. User: ${userId}`);
                        await tx.user.update({
                            where: { id: userId },
                            data: { credits: { increment: 100 } }
                        });
                    }
                });
                break;
            }

            default:
                // Log unhandled event type as processed to avoid re-runs
                await prisma.webhookEvent.upsert({
                    where: { id: eventId },
                    create: { id: eventId, processed: true },
                    update: { processed: true },
                });
                console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        }

        return new NextResponse(null, { status: 200 });
    } catch (error: any) {
        console.error("[Stripe Webhook] Processing failed:", error);
        return new NextResponse("Webhook handler failed", { status: 500 });
    }
}
