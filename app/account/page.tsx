import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { User, Mail, ShieldCheck, ShieldAlert, Package, Heart, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import SignOutButton from "@/components/auth/SignOutButton";

export const metadata: Metadata = {
  title: "My Account | Shraddha Darshan",
};

// Server Component — checks the session directly rather than relying only
// on proxy.ts. This matters: Next.js middleware alone can be bypassed (see
// CVE-2025-29927), so every protected page re-checks auth() itself too.
export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, emailVerified: true, createdAt: true },
  });

  if (!user) {
    redirect("/login?callbackUrl=/account");
  }

  return (
    <main className="min-h-screen bg-black px-4 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="badge-text text-yellow-400">Shraddha Darshan</p>
        <h1 className="mt-2 text-3xl font-bold">My Account</h1>

        <div className="mt-8 rounded-2xl border border-white/10 bg-[#0d0d0d] p-6 sm:p-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-400/10 text-yellow-400">
                <User size={24} />
              </div>
              <div>
                <p className="text-lg font-semibold">{user.name || "—"}</p>
                <p className="flex items-center gap-1.5 text-sm text-gray-400">
                  <Mail size={13} />
                  {user.email}
                </p>
              </div>
            </div>
            <SignOutButton />
          </div>

          <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-6 text-sm">
            {user.emailVerified ? (
              <span className="flex items-center gap-1.5 text-green-400">
                <ShieldCheck size={15} />
                Email verified
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-yellow-400">
                <ShieldAlert size={15} />
                Email not verified yet — check your inbox
              </span>
            )}
          </div>
        </div>

        {session.user.role === "ADMIN" && (
          <Link
            href="/admin"
            className="mt-6 flex items-center gap-3 rounded-2xl border border-yellow-400/30 bg-yellow-400/5 p-5 transition hover:border-yellow-400/60"
          >
            <LayoutDashboard size={20} className="text-yellow-400" />
            <div>
              <p className="font-medium text-yellow-400">Admin Dashboard</p>
              <p className="text-xs text-gray-400">Manage products, categories, and stock</p>
            </div>
          </Link>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            href="/collections"
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0d0d0d] p-5 transition hover:border-yellow-400/40"
          >
            <Package size={20} className="text-yellow-400" />
            <div>
              <p className="font-medium">My Orders</p>
              <p className="text-xs text-gray-500">
                Order history is coming soon — check back after checkout launches.
              </p>
            </div>
          </Link>

          <Link
            href="/wishlist"
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0d0d0d] p-5 transition hover:border-yellow-400/40"
          >
            <Heart size={20} className="text-yellow-400" />
            <div>
              <p className="font-medium">My Wishlist</p>
              <p className="text-xs text-gray-500">View items you&apos;ve saved</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
