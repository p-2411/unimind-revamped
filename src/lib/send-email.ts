import { Resend } from 'resend';
import { generateVerificationEmailHTML } from './email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendVerificationEmailParams {
  email: string;
  name?: string;
  verificationToken: string;
}

export async function sendVerificationEmail({
  email,
  name,
  verificationToken,
}: SendVerificationEmailParams) {
  // Validate environment variables
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set in environment variables');
    return { success: false, error: 'Missing RESEND_API_KEY' };
  }

  if (!process.env.NEXTAUTH_URL) {
    console.error('NEXTAUTH_URL is not set in environment variables');
    return { success: false, error: 'Missing NEXTAUTH_URL' };
  }

  const verificationLink = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${verificationToken}`;
  const fromEmail = process.env.EMAIL_FROM || 'UniMind <onboarding@resend.dev>';

  console.log('Sending verification email to:', email);
  console.log('From:', fromEmail);
  console.log('Verification link:', verificationLink);

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: 'Verify your email address',
      html: generateVerificationEmailHTML(verificationLink, name),
    });

    if (error) {
      console.error('Error sending verification email:', error);
      return { success: false, error };
    }

    console.log('Verification email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return { success: false, error };
  }
}
