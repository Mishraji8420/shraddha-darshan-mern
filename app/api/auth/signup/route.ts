import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { validateSignupForm, type SignupFormValues } from "@/lib/authValidation";
import { sendVerificationEmail } from "@/lib/email";

// Very lightweight in-memory rate limiter — same pattern as the contact
// form. Good enough to slow down basic abuse; swap for Upstash/Redis if
// this needs to hold up under real scale.
const RATE_LIMIT = 8;
const RATE_WINDOW_MS = 60 * 60 * 1000;
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

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let body: SignupFormValues;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const fieldErrors = validateSignupForm(body);
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { error: "Validation failed.", fieldErrors },
      { status: 400 },
    );
  }

  const email = body.email.trim().toLowerCase();
  const name = body.name.trim();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      {
        error: "Validation failed.",
        fieldErrors: { email: "This email is already registered." },
      },
      { status: 400 },
    );
  }

  const passwordHash = await bcrypt.hash(body.password, 10);

  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });

  const token = crypto.randomBytes(32).toString("hex");
  await prisma.verificationToken.create({
    data: {
      email,
      token,
      type: "EMAIL_VERIFY",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  const { error } = await sendVerificationEmail(email, token);
  if (error) {
    // Account is still created — verification email can be re-requested
    // later. Don't fail signup just because the email send hiccuped.
    console.error("Signup: failed to send verification email:", error);
  }

  return NextResponse.json({ success: true, userId: user.id });
}
