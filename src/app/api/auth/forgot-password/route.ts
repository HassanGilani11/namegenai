import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mail";

/**
 * Forgot Password API Route
 * 
 * Generates a reset token and sends it via email.
 */
export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        }

        // 1. Check if user exists
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // We return 200 even if user doesn't exist for security (avoid email enumeration)
            // But we don't send an email.
            return NextResponse.json(
                { message: "If an account exists with that email, a reset link has been sent." },
                { status: 200 }
            );
        }

        // 2. Generate token
        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 3600000); // 1 hour from now

        // 3. Store token (upsert to handle multiple requests)
        await prisma.passwordResetToken.upsert({
            where: {
                email_token: {
                    email,
                    token
                }
            },
            update: {
                token,
                expires
            },
            create: {
                email,
                token,
                expires
            }
        });

        // 4. Send email
        await sendPasswordResetEmail(email, token);

        return NextResponse.json(
            { message: "If an account exists with that email, a reset link has been sent." },
            { status: 200 }
        );

    } catch (error) {
        console.error("[Forgot Password] Error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
