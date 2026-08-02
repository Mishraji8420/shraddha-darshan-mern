import {
  ShoppingBag,
  Handshake,
  Home,
  Heart,
  Truck,
  ShieldCheck,
  BadgeCheck,
  PackageCheck,
  Phone,
  type LucideIcon,
} from "lucide-react";

/**
 * Every one of these names is already imported successfully elsewhere in
 * this codebase (ProductCard, WishlistContext, Footer, WhyChooseUs, etc.)
 * — deliberately not introducing any new/unverified lucide-react icon
 * names here, since this project's lucide-react version (see AGENTS.md's
 * warning about this Next.js/deps setup not matching typical training
 * data) has had real icon-renaming breaking changes between versions.
 */
export const wholesaleIconMap: Record<string, LucideIcon> = {
  ShoppingBag,
  Handshake,
  Home,
  Heart,
  Truck,
  ShieldCheck,
  BadgeCheck,
  PackageCheck,
  Phone,
};
