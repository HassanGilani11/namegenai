import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

/**
 * Registration API Route
 * 
 * Handles new user creation with hashed passwords.
 * Also provisions initial credits for trial users.
 */
export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with default trial credits and their own personal organization
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                credits: 3, // Provision 3 free credits (Free Tier)
                plan: "FREE",
                role: "MEMBER",
                organization: {
                    create: {
                        name: `${name || email.split("@")[0]}'s Org`,
                        slug: `${email.split("@")[0]}-${Math.random().toString(36).substring(2, 7)}`,
                    }
                }
            },
            include: {
                organization: true
            }
        }) as any;

        return NextResponse.json(
            { message: "User registered successfully", userId: user.id },
            { status: 201 }
        );

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
