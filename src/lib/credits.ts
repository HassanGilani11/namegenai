import prisma from "./prisma";

/**
 * Credit Usage Helper
 * 
 * Provides atomic credit deduction logic within a Prisma transaction
 * to prevent race conditions and ensure session safety.
 */
export async function deductCredits(userId: string, amount: number = 1) {
    try {
        return await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: { id: userId },
                select: { credits: true },
            });

            if (!user) {
                throw new Error("User not found");
            }

            if (user.credits < amount) {
                throw new Error("INSUFFICIENT_CREDITS");
            }

            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: {
                    credits: {
                        decrement: amount,
                    },
                },
            });

            return updatedUser.credits;
        });
    } catch (error) {
        console.error("Credit deduction failed:", error);
        throw error;
    }
}

/**
 * Check if the user has enough credits.
 */
export async function hasEnoughCredits(userId: string, amount: number = 1) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { credits: true },
    });

    return (user?.credits ?? 0) >= amount;
}
