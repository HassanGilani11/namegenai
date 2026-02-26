
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const organizationId = (session.user as any).organizationId;

        if (!organizationId) {
            return NextResponse.json({ message: "Organization not found" }, { status: 404 });
        }

        let billingRecords: any[] = [];
        if ((prisma as any).billingRecord) {
            billingRecords = await (prisma as any).billingRecord.findMany({
                where: { organizationId },
                orderBy: { createdAt: "desc" },
            });
        }

        return NextResponse.json(billingRecords);
    } catch (error) {
        console.error("Failed to fetch billing history:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
