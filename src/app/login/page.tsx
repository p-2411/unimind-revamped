'use client'
import { error } from "console";
import React from "react";
import { db } from "~/server/db";

export default function LoginPage() {
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

    }

    async function checkEmail(email: string, password: string) {
        // Add your email checking logic here
    }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <form onSubmit={handleSubmit}>
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
              <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Sign In</h1>
            </div>
            <div className="mt-4">
                <label className="mb-2 block text-gray-700">Email</label>
                <input
                    type="email"
                    name="email"    
                    className="w-full rounded-full border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter your email"
                />
            </div>
            <div className="mt-4">
                <label className="mb-2 block text-gray-700">Password</label>
                <input
                    type="password"
                    name="password"
                    className="w-full rounded-full border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter your password"
                />
            </div>
            <button
                type="submit"
                className="mt-6 w-full rounded-full bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
            >
                Sign In
            </button>
        </form>

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