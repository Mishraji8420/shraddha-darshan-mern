import type { Metadata } from "next";
import type { ReactNode } from "react";

// page.tsx here is a client component ("use client"), so it can't export
// `metadata` itself — a layout.tsx alongside it can. Cart contents are
// per-browser (localStorage) and not something search should ever surface,
// so this stays noindex permanently, not just for launch.
export const metadata: Metadata = {
  title: "Your Cart",
  robots: { index: false, follow: true },
};

export default function CartLayout({ children }: { children: ReactNode }) {
  return children;
}
