import { withAuth } from "next-auth/middleware";

/**
 * Global Middleware for Dashboard Protection
 * 
 * Protects all routes under /dashboard and ensures the user
 * is authenticated before allowing access.
 */
export default withAuth({
    pages: {
        signIn: "/login",
    },
});

export const config = {
    matcher: ["/dashboard/:path*", "/api/generate/:path*"],
};
