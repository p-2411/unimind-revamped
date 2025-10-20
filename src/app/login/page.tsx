'use client'
import React from "react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Sign In</h1>
        <a href="/api/auth/signin/google"
          className="w-full rounded-full bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
        >
          Sign in with Google
        </a>
      </div>
    </div>
  );
}