"use client";

import { useEffect } from "react";
import ErrorCard from "@/components/shared/error-card";

/**
 * Global Error Boundary for the SaaS application.
 * This is a client component that catches errors in its subtree and displays a fallback UI.
 */
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service like Sentry or Logtail
        console.error("Uncaught application error:", error);
    }, [error]);

    return (
        <div className="flex h-screen w-full items-center justify-center p-4">
            <ErrorCard
                title="Something went wrong!"
                description="An unexpected error occurred. Our team has been notified."
                onReset={reset}
            />
        </div>
    );
}
