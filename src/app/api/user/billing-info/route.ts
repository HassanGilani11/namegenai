import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * Billing Info API Route
 * Provides current user credits and plan details for the billing dashboard.
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { credits: true, plan: true },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("Billing info fetch error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
