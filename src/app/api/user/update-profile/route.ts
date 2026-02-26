import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * Update Profile API Route
 * 
 * Handles updating the user's name and other profile information.
 */
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { name } = await req.json();

        if (!name) {
            return NextResponse.json(
                { message: "Name is required" },
                { status: 400 }
            );
        }

        // Update user in database
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: { name },
        });

        return NextResponse.json(
            {
                message: "Profile updated successfully",
                user: { name: updatedUser.name }
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Update profile error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
