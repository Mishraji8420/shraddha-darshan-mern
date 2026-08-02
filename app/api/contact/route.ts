import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  validateContactForm,
  type ContactFormValues,
} from "@/lib/contactValidation";
 
// ---------------------------------------------------------------------------
// Very lightweight in-memory rate limiter: max 5 submissions per IP per hour.
//
// IMPORTANT CAVEAT: this Map lives in a single server process's memory. On
// serverless platforms (Vercel, etc.) each invocation can run on a different
// instance, so this is only a soft speed-bump against basic spam — not a
// hard guarantee. For real production-scale rate limiting, swap this for a
// shared store like Upstash Redis (@upstash/ratelimit).
// ---------------------------------------------------------------------------
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const submissionLog = new Map<string, number[]>();
 
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissionLog.get(ip) ?? []).filter(
    (t) => now - t < RATE_WINDOW_MS,
  );
 
  if (timestamps.length >= RATE_LIMIT) {
    submissionLog.set(ip, timestamps);
    return true;
  }
 
  timestamps.push(now);
  submissionLog.set(ip, timestamps);
  return false;
}
 
interface ContactRequestBody extends ContactFormValues {
  // Honeypot field: real users never see or fill this (hidden via CSS).
  // If it arrives with a value, the submission is almost certainly a bot.
  company?: string;
}
 
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown";
 
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }
 
  let body: ContactRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }
 
  // Honeypot check — silently pretend success so bots don't learn to adapt.
  if (body.company) {
    return NextResponse.json({ success: true });
  }
 
  // Never trust client-side validation — re-run the exact same rules here.
  const errors = validateContactForm(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "Validation failed.", fieldErrors: errors },
      { status: 400 },
    );
  }
 
  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
 
  if (!resendApiKey || !toEmail) {
    console.error(
      "Contact form: missing RESEND_API_KEY or CONTACT_TO_EMAIL env vars.",
    );
    return NextResponse.json(
      { error: "Server is not configured to send email yet." },
      { status: 500 },
    );
  }
 
  const resend = new Resend(resendApiKey);
  const { name, email, phone, subject, message } = body;
 
  try {
    const { error } = await resend.emails.send({
      // "onboarding@resend.dev" works out of the box for testing.
      // In production, verify your own domain in the Resend dashboard and
      // send from something like "enquiries@shraddhadarshan.com".
      from: process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev",
      to: toEmail,
      replyTo: email,
      subject: `New enquiry: ${subject} — ${name}`,
      html: `
        <div style="font-family: sans-serif; font-size: 14px; color: #1a1a1a;">
          <h2 style="margin-bottom: 16px;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Phone:</strong> ${phone ? escapeHtml(phone) : "—"}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>
      `,
    });
 
    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 },
      );
    }
 
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form send error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}
 
// Basic HTML-escaping so submitted text can't inject markup into the email.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
 