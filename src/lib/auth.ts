import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "./prisma";

/**
 * NextAuth Configuration
 * 
 * Uses Prisma Adapter for session management and Credentials Provider
 * for Email/Password authentication.
 */
export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as any,
    session: {
        strategy: "jwt", // Using JWT for session strategy with credentials
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("[NextAuth] Authorize called with email:", credentials?.email);
                if (!credentials?.email || !credentials?.password) {
                    console.error("[NextAuth] Missing credentials");
                    throw new Error("Invalid credentials");
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email,
                        },
                    }) as any;

                    if (!user) {
                        console.error("[NextAuth] User not found:", credentials.email);
                        throw new Error("Invalid credentials");
                    }

                    if (!user.password) {
                        console.error("[NextAuth] User has no password (OAuth?):", credentials.email);
                        throw new Error("Invalid credentials");
                    }

                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordCorrect) {
                        console.error("[NextAuth] Password incorrect for:", credentials.email);
                        throw new Error("Invalid credentials");
                    }

                    console.log("[NextAuth] Login successful for:", credentials.email);
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        credits: user.credits,
                        plan: user.plan,
                        organizationId: user.organizationId,
                    } as any;
                } catch (error: any) {
                    console.error("[NextAuth] Authorize error:", error.message);
                    throw error;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
                token.credits = (user as any).credits;
                token.plan = (user as any).plan;
                token.organizationId = (user as any).organizationId;
            }

            // Allow syncing user data in session if updated
            if (trigger === "update") {
                if (session?.credits !== undefined) token.credits = session.credits;
                if (session?.name !== undefined) token.name = session.name;
            }

            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).id = token.id as string;
                (session.user as any).role = token.role as any;
                (session.user as any).credits = token.credits as number;
                (session.user as any).plan = token.plan as string;
                (session.user as any).organizationId = token.organizationId as string;
            }
            return session;
        },
    },
};
