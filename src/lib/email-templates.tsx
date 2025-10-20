import * as React from 'react';

interface EmailTemplateProps {
  verificationLink: string;
  userName?: string;
}

export const VerificationEmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  verificationLink,
  userName,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
    <div style={{ backgroundColor: '#f3f4f6', padding: '40px 20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '40px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#1f2937', marginBottom: '24px', fontSize: '24px', fontWeight: 'bold' }}>
          Welcome to UniMind!
        </h1>

        {userName && (
          <p style={{ color: '#4b5563', fontSize: '16px', lineHeight: '24px', marginBottom: '16px' }}>
            Hi {userName},
          </p>
        )}

        <p style={{ color: '#4b5563', fontSize: '16px', lineHeight: '24px', marginBottom: '24px' }}>
          Thank you for signing up! Please verify your email address to get started.
        </p>

        <div style={{ textAlign: 'center', margin: '32px 0' }}>
          <a
            href={verificationLink}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '12px 32px',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              display: 'inline-block',
            }}
          >
            Verify Email Address
          </a>
        </div>

        <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '20px', marginTop: '24px' }}>
          If you didn't create an account, you can safely ignore this email.
        </p>

        <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '20px', marginTop: '16px' }}>
          This verification link will expire in 24 hours.
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '32px 0' }} />

        <p style={{ color: '#9ca3af', fontSize: '12px', textAlign: 'center' }}>
          If the button doesn't work, copy and paste this link into your browser:
        </p>
        <p style={{ color: '#9ca3af', fontSize: '12px', textAlign: 'center', wordBreak: 'break-all' }}>
          {verificationLink}
        </p>
      </div>
    </div>
  </div>
);

export const generateVerificationEmailHTML = (verificationLink: string, userName?: string): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto;">
    <div style="background-color: #f3f4f6; padding: 40px 20px;">
      <div style="background-color: white; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h1 style="color: #1f2937; margin-bottom: 24px; font-size: 24px; font-weight: bold; margin-top: 0;">
          Welcome to UniMind!
        </h1>

        ${userName ? `
        <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 16px;">
          Hi ${userName},
        </p>
        ` : ''}

        <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
          Thank you for signing up! Please verify your email address to get started.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${verificationLink}" style="background-color: #2563eb; color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
            Verify Email Address
          </a>
        </div>

        <p style="color: #6b7280; font-size: 14px; line-height: 20px; margin-top: 24px;">
          If you didn't create an account, you can safely ignore this email.
        </p>

        <p style="color: #6b7280; font-size: 14px; line-height: 20px; margin-top: 16px;">
          This verification link will expire in 24 hours.
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />

        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-bottom: 8px;">
          If the button doesn't work, copy and paste this link into your browser:
        </p>
        <p style="color: #9ca3af; font-size: 12px; text-align: center; word-break: break-all; margin-top: 0;">
          ${verificationLink}
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
};
