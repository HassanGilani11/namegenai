import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Gemini AI Client Singleton
 */

const geminiClientSingleton = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is missing from environment variables");
    }
    return new GoogleGenerativeAI(apiKey);
};

type GeminiClientSingleton = ReturnType<typeof geminiClientSingleton>;

const globalForGemini = globalThis as unknown as {
    gemini: GeminiClientSingleton | undefined;
};

const gemini = globalForGemini.gemini ?? geminiClientSingleton();

export default gemini;

if (process.env.NODE_ENV !== "production") globalForGemini.gemini = gemini;
