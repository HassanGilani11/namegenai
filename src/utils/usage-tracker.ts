import prisma from "@/lib/prisma";

/**
 * Daily Usage Tracking Utility
 * 
 * Provides atomic operations for tracking usage per user per day.
 * Optimized for Neon PostgreSQL / Serverless to prevent race conditions.
 */

/**
 * Increment usage count for a user for the current day.
 * Uses Prisma's upsert to handle first-time record creation and atomic increments.
 */
export async function incrementDailyUsage(userId: string) {
    const today = new Date();
    // Normalize to 00:00:00 to ensure consistent date matching if DB driver requires it
    // Though @db.Date in Prisma usually handles this.
    today.setHours(0, 0, 0, 0);

    try {
        const usage = await prisma.usage.upsert({
            where: {
                userId_date: {
                    userId,
                    date: today,
                },
            },
            create: {
                userId,
                date: today,
                count: 1,
            },
            update: {
                count: {
                    increment: 1,
                },
            },
        });

        return usage;
    } catch (error) {
        console.error("Failed to increment daily usage:", error);
        throw new Error("USAGE_TRACKING_FAILED");
    }
}

/**
 * Get current daily usage for a user by counting generations.
 * This acts as the source of truth for synchronization.
 */
export async function getDailyUsage(userId: string) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const count = await prisma.generation.count({
        where: {
            userId,
            createdAt: {
                gte: today,
            },
        },
    });

    return count;
}
