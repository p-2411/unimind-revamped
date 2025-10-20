import { db } from "~/server/db";
import bcrypt from "bcrypt";
//import { sendVerificationRequest } from "./lib/authSendRequest"

export async function signupUser(
   formData: FormData
) {
   const email = formData.get("email") as string;
   const password = formData.get("password") as string;
   const validation = validateCredentials(email, password);

   if ('error' in validation) {
       return { error: validation.error };
   }

   const hashedPassword = await bcrypt.hash(password, 10);

   const emailVerification = await verifyEmail(email, password);
   if ('error' in emailVerification) {
       return { error: emailVerification.error };
   }

    // Create the user
    const newUser = await db.user.create({
        data: {
            name: formData.get("name") as string,

            email,
            password: hashedPassword,
        }
    });
}

async function validateCredentials(
    email: string,
    password: string
) {
    

    const response = await db.user.findUnique({ where: { email } });
    if (!response || !response.password) {
        return { error: "Invalid email or password" };
    }
    
    const user = checkEmail(email, password);
    if ('error' in user) {
        return { error: user.error };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { error: "Invalid email format" };
    }

    const passwordValidation = isPasswordStrong(password);
    if (!passwordValidation.isValid) {
        return { error: passwordValidation.message };
    }

    return { success: true };
}



async function checkEmail(email: string, password: string) {
    const user = await db.user.findUnique({ where: { email } });
    if (user) {
        return { error: "Email already in use" };
    }
    
    return user;
}

function isPasswordStrong(password: string): { isValid: boolean; message: string } {
    if (password.length < 8) {
        return {
            isValid: false,
            message: "Password must be at least 8 characters long"
        };
    }

    if (password.length > 72) {
        return {
            isValid: false,
            message: "Password must be less than 72 characters"
        };
    }

    if (!/[A-Z]/.test(password)) {
        return {
            isValid: false,
            message: "Password must contain at least one uppercase letter"
        };
    }

    if (!/[a-z]/.test(password)) {
        return {
            isValid: false,
            message: "Password must contain at least one lowercase letter"
        };
    }

    if (!/[0-9]/.test(password)) {
        return {
            isValid: false,
            message: "Password must contain at least one number"
        };
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return {
            isValid: false,
            message: "Password must contain at least one special character"
        };
    }

    return {
        isValid: true,
        message: "Password is strong"
    };
}

function verifyEmail(email: string, password: string) {
    // implement email verification logic here

    return { success: true };
}

