"use client";

import { SessionProvider } from "next-auth/react";

/**
 * NextAuth Session Provider Wrapper
 * 
 * Required for client-side authentication hooks like useSession,
 * signIn, and signOut.
 */
export function Providers({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
}
