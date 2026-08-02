import type { ReactNode } from "react";
import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/admin-auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminToastProvider from "@/components/admin/AdminToastProvider";

export const metadata: Metadata = {
  title: "Admin | Shraddha Darshan",
  robots: { index: false, follow: false },
};

// Server-side guard, in addition to proxy.ts — see lib/admin-auth.ts for
// why both layers exist (CVE-2025-29927).
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdminPage();

  return (
    <div className="flex min-h-screen bg-black text-white">
      <AdminSidebar
        adminName={session.user.name || "Admin"}
        adminEmail={session.user.email || ""}
      />
      <AdminToastProvider>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </AdminToastProvider>
    </div>
  );
}
