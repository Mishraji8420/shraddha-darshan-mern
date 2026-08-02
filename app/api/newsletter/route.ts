import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateEmail } from "@/lib/authValidation";
import { sendNewsletterConfirmation } from "@/lib/email";

// Same lightweight in-memory rate limiter pattern as app/api/contact/route.ts
// and app/api/auth/signup/route.ts — soft protection against spam, not a
// hard guarantee across serverless instances.
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

interface NewsletterRequestBody {
  email?: string;
  // Honeypot field — real users never see or fill this. See ContactForm's
  // hidden "company" field for the same pattern.
  website?: string;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429 },
    );
  }

  let body: NewsletterRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot tripped — pretend success, do nothing.
  if (body.website) {
    return NextResponse.json({ success: true });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const emailError = validateEmail(email);
  if (emailError) {
    return NextResponse.json({ error: emailError }, { status: 400 });
  }

  try {
    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (!existing) {
      await prisma.subscriber.create({ data: { email } });
      // Don't let a flaky email provider fail the signup itself — the
      // subscriber is already saved either way.
      sendNewsletterConfirmation(email).catch((err) =>
        console.error("Newsletter confirmation email failed:", err),
      );
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Newsletter signup failed:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
