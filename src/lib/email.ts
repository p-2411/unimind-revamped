import { Resend } from 'resend';

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send verification email to user
 * @param email - User's email address
 * @param token - Verification token
 * @returns Promise with result of email send operation
 */
export async function sendVerificationEmail(email: string, token: string) {
    try {
        // Construct verification URL
        const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/verify-email?token=${token}`;

        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: email,
            subject: 'Verify your email address',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Verify Your Email</title>
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(to right, #4F46E5, #7C3AED); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0;">Welcome to UniMind!</h1>
                    </div>

                    <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #1f2937; margin-top: 0;">Verify Your Email Address</h2>

                        <p style="color: #4b5563; font-size: 16px;">
                            Thanks for signing up! Please verify your email address by clicking the button below:
                        </p>

                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${verificationUrl}"
                               style="background-color: #4F46E5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                                Verify Email Address
                            </a>
                        </div>

                        <p style="color: #6b7280; font-size: 14px;">
                            Or copy and paste this link into your browser:
                        </p>
                        <p style="color: #4F46E5; font-size: 14px; word-break: break-all;">
                            ${verificationUrl}
                        </p>

                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

                        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                            This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
                        </p>
                    </div>
                </body>
                </html>
            `,
        });

        if (error) {
            console.error('Error sending verification email:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Unexpected error sending verification email:', error);
        return { success: false, error: 'Failed to send verification email' };
    }
}

/**
 * Resend verification email to user
 * Reuses the same sendVerificationEmail function
 */
export async function resendVerificationEmail(email: string, token: string) {
    return sendVerificationEmail(email, token);
}
