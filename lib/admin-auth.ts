import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * Use in admin Server Component pages. Redirects to /login (not logged in)
 * or / (logged in but not an admin) — never renders the page otherwise.
 * Returns the session so pages don't need a second `auth()` call.
 */
export async function requireAdminPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/");
  }
  return session;
}

/**
 * Use at the top of every app/api/admin/** route handler. Returns null if
 * the request is from a logged-in admin (safe to proceed); otherwise
 * returns a NextResponse the caller should return immediately.
 */
export async function requireAdminApi() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }
  return null;
}
