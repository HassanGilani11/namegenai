import "next-auth";

declare module "next-auth" {
    export interface Session {
        user: {
            id: string;
            email: string;
            name?: string | null;
            role: string;
            credits: number;
            plan: string;
        };
    }

    export interface User {
        id: string;
        role: string;
        credits: number;
        plan: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
        credits: number;
        plan: string;
    }
}
