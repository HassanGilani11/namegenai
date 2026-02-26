"use client";



interface ErrorCardProps {
    title?: string;
    description?: string;
    onReset?: () => void;
}

/**
 * Reusable Error Card component for consistent error UI.
 */
export default function ErrorCard({
    title = "Error",
    description = "Something went wrong. Please try again.",
    onReset,
}: ErrorCardProps) {
    return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center shadow-sm dark:border-red-900/50 dark:bg-red-950/20">
            <h2 className="mb-2 text-2xl font-bold text-red-800 dark:text-red-400">
                {title}
            </h2>
            <p className="mb-6 text-red-600 dark:text-red-300">
                {description}
            </p>
            {onReset && (
                <button
                    onClick={onReset}
                    className="rounded-md bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    Try Again
                </button>
            )}
        </div>
    );
}
