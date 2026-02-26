import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import stripe from "@/lib/stripe";
import prisma from "@/lib/prisma";

/**
 * Checkout API Route
 * Handles Stripe Checkout Session creation for top-ups and subscriptions.
 */
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { type } = await req.json();

        const userId = session.user.id;

        // Always fetch fresh from DB to avoid session sync issues
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { organizationId: true, email: true, name: true }
        });

        let organizationId = user?.organizationId;

        // If user has no organization, create one
        if (!organizationId && user) {
            console.log(`[Checkout API] Creating missing organization for user ${userId}`);
            const newOrg = await prisma.organization.create({
                data: {
                    name: `${user.name || user.email.split("@")[0]}'s Org`,
                    slug: `${user.email.split("@")[0]}-${Math.random().toString(36).substring(2, 7)}`,
                    users: {
                        connect: { id: userId }
                    }
                }
            });
            organizationId = newOrg.id;
        }

        if (!organizationId) {
            return NextResponse.json({ message: "No organization found or created" }, { status: 400 });
        }

        console.log(`[Checkout API] Starting checkout for User: ${userId}, Org: ${organizationId}, Type: ${type}`);

        // Define checkout parameters
        let line_items: any[] = [];
        let mode: "payment" | "subscription" = "payment";

        if (type === "credits") {
            // Credits Top-up (One-time)
            line_items = [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "20 AI Credits",
                            description: "Add 20 credits to your account",
                        },
                        unit_amount: 1000, // $10.00
                    },
                    quantity: 1,
                },
            ];
            mode = "payment";
        } else if (type === "subscription") {
            // Pro Subscription (Monthly)
            line_items = [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Pro Plan",
                            description: "Unlimited daily generations (up to 20/day) & 100 monthly base credits",
                        },
                        unit_amount: 2900, // $29.00
                        recurring: { interval: "month" },
                    },
                    quantity: 1,
                },
            ];
            mode = "subscription";
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode,
            success_url: `${process.env.NEXTAUTH_URL}/dashboard?status=success`,
            cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?status=cancel`,
            metadata: {
                userId,
                organizationId,
                type,
            },
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error: any) {
        console.error("Checkout error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
