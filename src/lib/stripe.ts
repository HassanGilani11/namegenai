import Stripe from "stripe";

/**
 * Stripe Client Singleton
 * Prevents multiple client instantiations and handles initialization with API key.
 */

const stripeClientSingleton = () => {
    return new Stripe(process.env.STRIPE_API_KEY!, {
        apiVersion: "2023-10-16" as any, // Use stable or latest version
        typescript: true,
    });
};

type StripeClientSingleton = ReturnType<typeof stripeClientSingleton>;

const globalForStripe = globalThis as unknown as {
    stripe: StripeClientSingleton | undefined;
};

const stripe = globalForStripe.stripe ?? stripeClientSingleton();

export default stripe;

if (process.env.NODE_ENV !== "production") globalForStripe.stripe = stripe;
