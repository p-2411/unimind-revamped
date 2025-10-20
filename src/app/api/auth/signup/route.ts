import { NextResponse } from "next/server";
import { db } from "~/server/db";
import * as bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { sendVerificationEmail } from "~/lib/send-email";

export async function POST(request: Request) {
    try {
        const { email, password, name } = await request.json();

        // Validate inputs
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters long" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = randomBytes(32).toString("hex");
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create user
        const user = await db.user.create({
            data: {
                email,
                name: name || null,
                password: hashedPassword,
                emailVerified: null,
                verificationToken,
                verificationTokenExpiry,
            },
        });

        // Always log verification link for development
        const verificationLink = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${verificationToken}`;
        console.log('\n================================');
        console.log('📧 EMAIL VERIFICATION LINK:');
        console.log(verificationLink);
        console.log('================================\n');

        // Send verification email
        const emailResult = await sendVerificationEmail({
            email: user.email,
            name: user.name || undefined,
            verificationToken,
        });

        if (!emailResult.success) {
            console.error('Failed to send verification email, but user was created');
            console.log('You can still verify using the link above ☝️');
        }

        return NextResponse.json({
            message: "Account created successfully. Please check your email to verify your account.",
            userId: user.id,
        });
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Failed to create account" },
            { status: 500 }
        );
    }
}
