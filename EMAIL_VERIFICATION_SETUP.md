# Email Verification System - Setup Guide

## Overview

Your authentication system now includes a complete email verification flow using **Resend** for sending emails.

## Features Implemented

✅ **Beautiful HTML Email Templates**
- Professional, responsive email design
- Clear call-to-action button
- Fallback link for email clients that don't support buttons
- 24-hour expiration notice

✅ **Email Sending on Signup**
- Automatic verification email sent when users register
- Includes personalized greeting with user's name
- Graceful error handling (user creation succeeds even if email fails)

✅ **Resend Verification Email**
- Users can request a new verification email
- Generates fresh 24-hour token
- Prevents spam by checking if already verified

✅ **Email Verification Route**
- Validates tokens and expiration
- Beautiful HTML success/error pages
- Updates user status in database
- Clears verification token after use

## Environment Variables

Your `.env` file has been configured with:

```bash
# Resend API Key (already set)
RESEND_API_KEY="re_2PQAfuHb_KSCDfNqPTfnmtn7cK5e4dPGH"

# Email "From" address
EMAIL_FROM="UniMind <onboarding@resend.dev>"

# App URL for verification links
NEXTAUTH_URL="http://localhost:3000"
```

### Important Notes:

1. **EMAIL_FROM**:
   - Currently set to `onboarding@resend.dev` (Resend's test email)
   - Works for testing purposes
   - To use your own domain, verify it in Resend dashboard first

2. **NEXTAUTH_URL**:
   - Must use `http://` for local development
   - Change to `https://` in production

## Testing the Email Flow

### 1. Sign Up
```
1. Go to http://localhost:3000/signup
2. Fill in name, email, and password
3. Submit the form
```

### 2. Check Your Email
```
- Check the email inbox for the address you provided
- Look for an email from "UniMind <onboarding@resend.dev>"
- Subject: "Verify your email address"
```

### 3. Verify Email
```
- Click the "Verify Email Address" button in the email
- Or copy/paste the link at the bottom
- You'll see a success page
```

### 4. Sign In
```
- Go to http://localhost:3000/login
- Sign in with your verified credentials
- You'll be redirected to /dashboard
```

## Email Template Preview

The verification email includes:

- **Header**: "Welcome to UniMind!"
- **Greeting**: "Hi [Your Name]," (if name provided)
- **Message**: Thank you message and instructions
- **CTA Button**: Blue "Verify Email Address" button
- **Expiration Notice**: "This verification link will expire in 24 hours"
- **Fallback Link**: Copy-pasteable URL at the bottom

## Error Handling

### Email Fails to Send
- User account is still created successfully
- Verification link is logged to console as fallback
- User can request resend from login page

### Token Expired
- User sees error page with instructions
- Can request new verification email from login page

### Already Verified
- Attempting to resend shows "Email is already verified" error

## Files Created/Modified

### New Files:
- `src/lib/email-templates.tsx` - Beautiful HTML email template
- `src/lib/send-email.ts` - Email sending utility using Resend
- `EMAIL_VERIFICATION_SETUP.md` - This guide

### Modified Files:
- `src/app/api/auth/signup/route.ts` - Now sends verification emails
- `src/app/api/auth/resend-verification/route.ts` - Now sends emails
- `.env` - Updated with proper email configuration

## Resend Dashboard

To monitor your emails:

1. Go to https://resend.com/
2. Log in with your account
3. Navigate to "Emails" to see sent emails and their status
4. Check "Logs" for any delivery issues

## Production Setup

Before deploying to production:

1. **Verify Your Domain** in Resend:
   - Go to Resend dashboard → Domains
   - Add your domain (e.g., unimind.com)
   - Add the provided DNS records
   - Update `EMAIL_FROM` to use your domain

2. **Update Environment Variables**:
   ```bash
   EMAIL_FROM="UniMind <noreply@yourdomain.com>"
   NEXTAUTH_URL="https://yourdomain.com"
   ```

3. **Test Thoroughly**:
   - Test signup flow
   - Verify emails are delivered
   - Check spam folders
   - Test resend functionality
   - Verify token expiration

## Troubleshooting

### Emails Not Sending
- Check Resend API key is valid
- Verify API key has send permissions
- Check Resend dashboard for errors
- Ensure `EMAIL_FROM` uses verified domain (or resend.dev for testing)

### Verification Link Not Working
- Ensure `NEXTAUTH_URL` matches your app URL exactly
- Check for `http://` vs `https://` mismatch
- Verify token hasn't expired (24 hours)

### Email Goes to Spam
- Use a verified domain instead of resend.dev
- Add SPF, DKIM, and DMARC records (Resend provides these)
- Avoid spam trigger words in email content

## Support

For issues with Resend:
- Documentation: https://resend.com/docs
- Support: https://resend.com/support

For NextAuth issues:
- Documentation: https://next-auth.js.org
- Discord: https://discord.gg/nextauth
