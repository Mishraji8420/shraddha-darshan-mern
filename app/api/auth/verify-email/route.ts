import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  let body: { token?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const token = body.token;
  if (!token) {
    return NextResponse.json({ error: "Missing verification token." }, { status: 400 });
  }

  const record = await prisma.verificationToken.findUnique({ where: { token } });

  if (!record || record.type !== "EMAIL_VERIFY") {
    return NextResponse.json(
      { error: "This verification link is invalid." },
      { status: 400 },
    );
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return NextResponse.json(
      { error: "This verification link has expired. Please request a new one." },
      { status: 400 },
    );
  }

  await prisma.user.update({
    where: { email: record.email },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({ where: { token } });

  return NextResponse.json({ success: true });
}
