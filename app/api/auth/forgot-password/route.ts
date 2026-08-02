import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { validateEmail } from "@/lib/authValidation";
import { sendPasswordResetEmail } from "@/lib/email";

const RATE_LIMIT = 5;
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

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const emailError = validateEmail(body.email ?? "");
  if (emailError) {
    return NextResponse.json(
      { error: "Validation failed.", fieldErrors: { email: emailError } },
      { status: 400 },
    );
  }

  const email = body.email!.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  // Always respond with success, whether or not the account exists — this
  // is standard practice so the endpoint can't be used to check which
  // emails are registered.
  if (user && user.passwordHash) {
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.verificationToken.create({
      data: {
        email,
        token,
        type: "PASSWORD_RESET",
        expires: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
    const { error } = await sendPasswordResetEmail(email, token);
    if (error) console.error("forgot-password: send failed:", error);
  }

  return NextResponse.json({ success: true });
}
