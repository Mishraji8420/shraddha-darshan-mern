import { Resend } from "resend";

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Auth email: missing RESEND_API_KEY env var.");
    return null;
  }
  return new Resend(apiKey);
}

const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

const wrapper = (title: string, bodyHtml: string) => `
  <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #0d0d0d; color: #f5f5f5;">
    <p style="color: #eab308; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 16px;">Shraddha Darshan</p>
    <h1 style="font-size: 20px; margin: 0 0 16px; color: #ffffff;">${title}</h1>
    ${bodyHtml}
    <p style="margin-top: 32px; font-size: 12px; color: #8a8a8a;">
      If you didn't request this, you can safely ignore this email.
    </p>
  </div>
`;

export async function sendVerificationEmail(email: string, token: string) {
  const resend = getResend();
  if (!resend) return { error: "Email service not configured." };

  const verifyUrl = `${getSiteUrl()}/verify-email?token=${token}`;

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Verify your email — Shraddha Darshan",
    html: wrapper(
      "Verify your email address",
      `
        <p style="font-size: 14px; line-height: 1.6; color: #d4d4d4;">
          Thanks for creating an account. Click the button below to verify
          your email — this link expires in 24 hours.
        </p>
        <a href="${verifyUrl}" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #eab308; color: #0d0d0d; font-weight: 600; text-decoration: none; border-radius: 8px;">
          Verify Email
        </a>
      `,
    ),
  });

  if (error) console.error("sendVerificationEmail error:", error);
  return { error };
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resend = getResend();
  if (!resend) return { error: "Email service not configured." };

  const resetUrl = `${getSiteUrl()}/reset-password?token=${token}`;

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Reset your password — Shraddha Darshan",
    html: wrapper(
      "Reset your password",
      `
        <p style="font-size: 14px; line-height: 1.6; color: #d4d4d4;">
          We received a request to reset your password. Click the button
          below to choose a new one — this link expires in 1 hour.
        </p>
        <a href="${resetUrl}" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #eab308; color: #0d0d0d; font-weight: 600; text-decoration: none; border-radius: 8px;">
          Reset Password
        </a>
      `,
    ),
  });

  if (error) console.error("sendPasswordResetEmail error:", error);
  return { error };
}

export async function sendNewsletterConfirmation(email: string) {
  const resend = getResend();
  if (!resend) return { error: "Email service not configured." };

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "You're on the list — Shraddha Darshan",
    html: wrapper(
      "Welcome to the inner circle",
      `
        <p style="font-size: 14px; line-height: 1.6; color: #d4d4d4;">
          You'll be the first to know about new collections, festive offers
          and exclusive gifting ideas from Shraddha Darshan.
        </p>
      `,
    ),
  });

  if (error) console.error("sendNewsletterConfirmation error:", error);
  return { error };
}
