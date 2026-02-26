import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Sends a password reset email to the user.
 */
export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${domain}/reset-password?token=${token}`;

    console.log(`[Mail] Sending password reset link to ${email}: ${resetLink}`);

    // If no API key is set, we just log it (useful for local dev)
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "your-resend-api-key") {
        console.warn("[Mail] RESEND_API_KEY is not set. Email was not sent, but the link is logged above.");
        return { success: true, warning: "API key missing" };
    }

    try {
        await resend.emails.send({
            from: "NameGen AI <onboarding@resend.dev>",
            to: email,
            subject: "Reset your password",
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                    <h2 style="color: #4f46e5;">Reset Your Password</h2>
                    <p>We received a request to reset the password for your NameGen AI account.</p>
                    <p>Click the button below to set a new password. This link will expire in 1 hour.</p>
                    <div style="margin: 30px 0;">
                        <a href="${resetLink}" 
                           style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                           Reset Password
                        </a>
                    </div>
                    <p style="font-size: 14px; color: #666;">If you didn't request this, you can safely ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #999;">&copy; 2026 NameGen AI. All rights reserved.</p>
                </div>
            `,
        });
        return { success: true };
    } catch (error) {
        console.error("[Mail] Error sending email:", error);
        return { success: false, error };
    }
};
