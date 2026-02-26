/**
 * Error Handling Utility
 * Centralizes error formatting and logging.
 */

export interface ApiErrorResponse {
    success: false;
    error: string;
    code?: string;
    details?: any;
}

export function handleApiError(error: unknown): { message: string; statusCode: number } {
    console.error("API Error Details:", JSON.stringify(error, null, 2));

    if (error instanceof Error) {
        // Handle specific error types
        if (error.name === "PrismaClientKnownRequestError") {
            return { message: "Database request failed", statusCode: 400 };
        }

        // OpenAI Quota Error Handling
        if ((error as any).code === "insufficient_quota" || (error as any).type === "insufficient_quota") {
            return {
                message: "OpenAI API Quota Exceeded. Please check your billing settings or wait for usage limits to reset.",
                statusCode: 402
            };
        }

        // Gemini Safety/Quota Error Handling
        const msg = error.message.toLowerCase();
        if (msg.includes("quota") || msg.includes("limit")) {
            return {
                message: "Gemini API Quota Exceeded. Please try again later.",
                statusCode: 429
            };
        }
        if (msg.includes("safety") || msg.includes("blocked")) {
            return {
                message: "Generation was blocked by AI safety filters. Please try a different prompt.",
                statusCode: 400
            };
        }
        if (msg.includes("not found") || (error as any).status === 404) {
            return {
                message: "Selected AI engine is currently unavailable. Please try a different model.",
                statusCode: 404
            };
        }

        return { message: error.message, statusCode: 500 };
    }

    // Fallback for non-Error objects (like OpenAI direct response errors)
    const errObj = error as any;
    if (errObj?.code === "insufficient_quota") {
        return {
            message: "OpenAI API Quota Exceeded. Please check your billing settings.",
            statusCode: 402
        };
    }

    return { message: "An unexpected error occurred", statusCode: 500 };
}

export function createErrorResponse(message: string, statusCode: number = 400) {
    return Response.json(
        {
            success: false,
            error: message,
            message: message // Compatibility fallback
        },
        { status: statusCode }
    );
}
