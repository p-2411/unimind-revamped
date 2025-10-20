import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { randomBytes } from "crypto";
import { sendVerificationEmail } from "~/lib/send-email";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Find user
        const user = await db.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Don't reveal if user exists or not
            return NextResponse.json({
                message: "If an account with that email exists, a verification email has been sent.",
            });
        }

        // Check if already verified
        if (user.emailVerified) {
            return NextResponse.json(
                { error: "Email is already verified" },
                { status: 400 }
            );
        }

        // Generate new verification token
        const verificationToken = randomBytes(32).toString("hex");
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Update user with new token
        await db.user.update({
            where: { id: user.id },
            data: {
                verificationToken,
                verificationTokenExpiry,
            },
        });

        // Send verification email
        const emailResult = await sendVerificationEmail({
            email: user.email,
            name: user.name || undefined,
            verificationToken,
        });

        if (!emailResult.success) {
            console.error('Failed to send verification email');
            // Log the verification link as fallback
            console.log(`Verification link (email failed): ${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${verificationToken}`);

            return NextResponse.json(
                { error: "Failed to send verification email. Please try again later." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: "Verification email sent. Please check your inbox.",
        });
    } catch (error) {
        console.error("Resend verification error:", error);
        return NextResponse.json(
            { error: "Failed to send verification email" },
            { status: 500 }
        );
    }
}
