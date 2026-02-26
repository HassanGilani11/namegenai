import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Health Check API Route
 * Verifies that the API is up and can connect to the database.
 */
export async function GET() {
    try {
        // Simple query to verify DB connection
        await prisma.$queryRaw`SELECT 1`;

        return NextResponse.json(
            {
                status: "ok",
                timestamp: new Date().toISOString(),
                database: "connected"
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Health check failed:", error);

        return NextResponse.json(
            {
                status: "error",
                database: "disconnected",
                message: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}
