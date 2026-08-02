"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  LogOut,
  ExternalLink,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
];

interface AdminSidebarProps {
  adminName: string;
  adminEmail: string;
}

export default function AdminSidebar({ adminName, adminEmail }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-[#0d0d0d]">
      <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-5">
        <Image
          src="/img/logo/logo.png"
          alt="Shraddha Darshan"
          width={32}
          height={32}
          className="rounded-full"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">Shraddha Darshan</p>
          <p className="text-[11px] text-gray-500">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-yellow-400/10 text-yellow-400"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}

        <div className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600">
          <ShoppingBag size={17} />
          Orders
          <span className="ml-auto rounded-full bg-white/5 px-2 py-0.5 text-[10px]">
            Soon
          </span>
        </div>
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
        >
          <ExternalLink size={17} />
          View Store
        </Link>

        <div className="mt-2 flex items-center gap-2.5 rounded-lg px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-400/15 text-xs font-semibold text-yellow-400">
            {adminName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-white">{adminName}</p>
            <p className="truncate text-[11px] text-gray-500">{adminEmail}</p>
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            aria-label="Sign out"
            className="shrink-0 text-gray-500 transition hover:text-red-400"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
