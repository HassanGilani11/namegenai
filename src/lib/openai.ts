import OpenAI from "openai";

/**
 * OpenAI Client Singleton
 * Prevents multiple client instantiations in development and optimizes reuse in production.
 */

const openaiClientSingleton = () => {
    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
};

type OpenAIClientSingleton = ReturnType<typeof openaiClientSingleton>;

const globalForOpenAI = globalThis as unknown as {
    openai: OpenAIClientSingleton | undefined;
};

const openai = globalForOpenAI.openai ?? openaiClientSingleton();

export default openai;

if (process.env.NODE_ENV !== "production") globalForOpenAI.openai = openai;
