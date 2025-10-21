import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get("token");

        if (!token) {
            return new NextResponse(
                `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Verification Failed</title>
                    <style>
                        body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background-color: #f3f4f6; }
                        .container { background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center; max-width: 500px; }
                        h1 { color: #ef4444; }
                        a { color: #2563eb; text-decoration: none; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Invalid Verification Link</h1>
                        <p>The verification link is invalid or missing.</p>
                        <p><a href="/login">Go to Login</a></p>
                    </div>
                </body>
                </html>
                `,
                { headers: { "Content-Type": "text/html" }, status: 400 }
            );
        }

        // Find user with this verification token
        const user = await db.user.findFirst({
            where: {
                verificationToken: token,
                verificationTokenExpiry: {
                    gt: new Date(), // Token not expired
                },
            },
        });

        if (!user) {
            return new NextResponse(
                `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Verification Failed</title>
                    <style>
                        body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background-color: #f3f4f6; }
                        .container { background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center; max-width: 500px; }
                        h1 { color: #ef4444; }
                        a { color: #2563eb; text-decoration: none; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Verification Failed</h1>
                        <p>This verification link has expired or is invalid.</p>
                        <p>Please request a new verification email.</p>
                        <p><a href="/login">Go to Login</a></p>
                    </div>
                </body>
                </html>
                `,
                { headers: { "Content-Type": "text/html" }, status: 400 }
            );
        }

        // Update user to verified
        await db.user.update({
            where: { id: user.id },
            data: {
                emailVerified: new Date(),
                verificationToken: null,
                verificationTokenExpiry: null,
            },
        });

        return new NextResponse(
            `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Email Verified</title>
                <style>
                    body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background-color: #f3f4f6; }
                    .container { background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center; max-width: 500px; }
                    h1 { color: #10b981; }
                    a { display: inline-block; margin-top: 1rem; padding: 0.5rem 1rem; background-color: #2563eb; color: white; text-decoration: none; border-radius: 0.25rem; }
                    a:hover { background-color: #1d4ed8; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Email Verified Successfully!</h1>
                    <p>Your email has been verified. You can now sign in to your account.</p>
                    <a href="/login">Go to Login</a>
                </div>
            </body>
            </html>
            `,
            { headers: { "Content-Type": "text/html" } }
        );
    } catch (error) {
        console.error("Email verification error:", error);
        return new NextResponse(
            `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Verification Error</title>
                <style>
                    body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background-color: #f3f4f6; }
                    .container { background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center; max-width: 500px; }
                    h1 { color: #ef4444; }
                    a { color: #2563eb; text-decoration: none; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Verification Error</h1>
                    <p>An error occurred while verifying your email. Please try again later.</p>
                    <p><a href="/login">Go to Login</a></p>
                </div>
            </body>
            </html>
            `,
            { headers: { "Content-Type": "text/html" }, status: 500 }
        );
    }
}
