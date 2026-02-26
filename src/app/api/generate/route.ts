import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import openai from "@/lib/openai";
import prisma from "@/lib/prisma";
import gemini from "@/lib/gemini";
import { deductCredits } from "@/lib/credits";
import { getDailyUsage, incrementDailyUsage } from "@/utils/usage-tracker";
import { createErrorResponse, handleApiError } from "@/utils/error-handler";

/**
 * Session-Safe AI Generation API Route
 * 
 * Demonstrates:
 * 1. Session validation with getServerSession
 * 2. Middleware protection (enforced in middleware.ts)
 * 3. Atomic credit deduction using User-level credits
 */
export async function POST(req: Request) {
    try {
        // 1. Validate Session
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return createErrorResponse("Unauthorized. Please sign in.", 401);
        }

        const { prompt, model } = await req.json();
        const selectedModel = model || "gpt-4o-mini";

        if (!prompt) {
            return createErrorResponse("Prompt is required", 400);
        }

        const userId = session.user.id;
        let organizationId = (session.user as any).organizationId;

        console.log(`[Generate API] UserId: ${userId}, Session OrgId: ${organizationId}`);

        // Ensure we have a valid organization ID (required by foreign key constraint)
        if (!organizationId) {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { organizationId: true, email: true, name: true }
            });
            organizationId = user?.organizationId;

            // AUTO-REPAIR: If user somehow has no organization, create one now
            if (!organizationId && user) {
                console.log(`[Generate API] Auto-repairing missing organization for user ${userId}`);
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
            console.log(`[Generate API] Resolved OrgId: ${organizationId}`);
        }

        if (!organizationId) {
            console.error(`[Generate API] Fatal: No organization found or created for user ${userId}`);
            return createErrorResponse("Authentication error: No workspace found.", 401);
        }

        // 2. Check Daily Usage Limit (Plan-based)
        const userWithPlan = await prisma.user.findUnique({
            where: { id: userId },
            select: { plan: true }
        } as any);
        const limit = (userWithPlan as any)?.plan === "FREE" ? 3 : 20;

        const dailyCount = await getDailyUsage(userId);
        if (dailyCount >= limit) {
            return createErrorResponse(`Daily limit reached (${limit}/${limit}). Please upgrade your plan for higher limits.`, 429);
        }

        // 3. Transact Credit Deduction (Atomic)
        try {
            await deductCredits(userId, 1);
            // No need to incrementDailyUsage manually anymore as we count from Generation table
        } catch (error: any) {
            if (error.message === "INSUFFICIENT_CREDITS") {
                return createErrorResponse("Insufficient credits. Please upgrade.", 402);
            }
            throw error;
        }

        console.log(`[Generate API] Starting AI call with model: ${selectedModel}`);

        // 3. AI Generation
        let aiResult = "";
        let tokensUsed = 0;

        try {
            if (selectedModel.startsWith("gemini-") || selectedModel.startsWith("gemma-")) {
                const model = gemini.getGenerativeModel({
                    model: selectedModel
                });
                const result = await model.generateContent(prompt);
                const response = result.response;
                aiResult = response.text();
                tokensUsed = response.usageMetadata?.totalTokenCount || 0;
            } else {
                const response = await openai.chat.completions.create({
                    model: selectedModel,
                    messages: [{ role: "user", content: prompt }],
                });
                aiResult = response.choices[0].message.content || "";
                tokensUsed = response.usage?.total_tokens || 0;
            }
        } catch (error) {
            console.error("AI Generation Error:", error);
            throw error;
        }

        // 4. Save Record
        const record = await prisma.generation.create({
            data: {
                userId,
                organizationId,
                prompt,
                result: aiResult,
                model: selectedModel,
                tokensUsed: tokensUsed,
            },
        });

        return NextResponse.json({
            success: true,
            data: record,
        });

    } catch (error) {
        const { message, statusCode } = handleApiError(error);
        return createErrorResponse(message, statusCode);
    }
}
