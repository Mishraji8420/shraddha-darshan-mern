import type { Metadata } from "next";
import type { ReactNode } from "react";

// See app/cart/layout.tsx — same reasoning, permanent noindex.
export const metadata: Metadata = {
  title: "Your Wishlist",
  robots: { index: false, follow: true },
};

export default function WishlistLayout({ children }: { children: ReactNode }) {
  return children;
}
