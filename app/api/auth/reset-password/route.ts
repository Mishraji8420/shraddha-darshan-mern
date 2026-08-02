import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { validatePassword } from "@/lib/authValidation";

export async function POST(request: NextRequest) {
  let body: { token?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { token, password } = body;
  if (!token || !password) {
    return NextResponse.json({ error: "Missing token or password." }, { status: 400 });
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return NextResponse.json(
      { error: "Validation failed.", fieldErrors: { password: passwordError } },
      { status: 400 },
    );
  }

  const record = await prisma.verificationToken.findUnique({ where: { token } });

  if (!record || record.type !== "PASSWORD_RESET") {
    return NextResponse.json({ error: "This reset link is invalid." }, { status: 400 });
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return NextResponse.json(
      { error: "This reset link has expired. Please request a new one." },
      { status: 400 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { email: record.email },
    data: { passwordHash },
  });

  await prisma.verificationToken.delete({ where: { token } });

  return NextResponse.json({ success: true });
}
