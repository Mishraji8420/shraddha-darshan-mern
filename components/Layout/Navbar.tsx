"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
  LogOut,
  Package,
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import SearchOverlay from "./SearchOverlay";
import CartDropdown from "./CartDropdown";

const menu = [
  { name: "Home", href: "/" },
  { name: "Collections", href: "/collections" },
  { name: "Categories", href: "/categories" },
  { name: "Wholesale", href: "/wholesale" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { status } = useSession();

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  // "Sticky scroll effect" — the header itself stays sticky via CSS
  // (see the `sticky top-0` classes below); this just tracks scroll
  // position so we can make it visually "compact + solid" once the
  // page has scrolled past the announcement bar.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-white/10 bg-[#060606]/95 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          : "border-white/5 bg-[#090909]/85 backdrop-blur-xl"
      }`}
    >
      <div
        className={`mx-auto flex w-full max-w-7xl items-center justify-between px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
          scrolled ? "h-[60px] sm:h-[68px]" : "h-[68px] sm:h-[76px]"
        }`}
      >
        <Link href="/" onClick={() => setIsCartOpen(false)} className="flex items-center">
          <Image
            src="/img/logo/logo.png"
            alt="Shraddha Darshan"
            width={62}
            height={62}
            priority
            className="h-10 w-auto object-contain sm:h-12 lg:h-[62px]"
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
          {menu.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsCartOpen(false)}
              className={`group relative text-[13px] font-medium tracking-[0.2px] transition-all duration-300 ${
                pathname === item.href
                  ? "text-yellow-400"
                  : "text-gray-300 hover:text-yellow-400"
              }`}
            >
              {item.name}

              <span
                className={`absolute -bottom-[28px] left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-yellow-400 transition-all duration-300 ${
                  pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search — mobile + desktop */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search products"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#141414] text-gray-300 transition-all duration-300 hover:border-yellow-400 hover:text-yellow-400"
          >
            <Search size={17} />
          </button>

          {/* Wishlist — desktop only (also reachable from the mobile drawer) */}
          <button
            type="button"
            onClick={() => router.push("/wishlist")}
            aria-label={`Wishlist${wishlistCount > 0 ? ` (${wishlistCount} items)` : ""}`}
            className="relative hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#141414] text-gray-300 transition-all duration-300 hover:border-yellow-400 hover:text-yellow-400 lg:flex"
          >
            <Heart size={17} />
            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-[9px] font-semibold text-black">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
          </button>

          {/* Cart — mobile + desktop, opens a mini-cart dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCartOpen((prev) => !prev)}
              aria-label={`Cart${cartCount > 0 ? ` (${cartCount} items)` : ""}`}
              aria-expanded={isCartOpen}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#141414] text-gray-300 transition-all duration-300 hover:border-yellow-400 hover:text-yellow-400"
            >
              <ShoppingCart size={17} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-[9px] font-semibold text-black">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            <CartDropdown open={isCartOpen} onClose={() => setIsCartOpen(false)} />
          </div>

          {/* Account */}
          <div className="relative hidden lg:block">
            {status === "authenticated" ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsAccountOpen((v) => !v)}
                  aria-expanded={isAccountOpen}
                  aria-label="Account menu"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#141414] text-gray-300 transition-all duration-300 hover:border-yellow-400 hover:text-yellow-400"
                >
                  <User size={17} />
                </button>

                {isAccountOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsAccountOpen(false)}
                    />
                    <div className="absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-xl border border-white/10 bg-[#141414] py-2 shadow-2xl">
                      <Link
                        href="/account"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/5 hover:text-yellow-400"
                      >
                        <Package size={15} />
                        My Account
                      </Link>
                      <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-300 transition hover:bg-white/5 hover:text-red-400"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <Link
                href="/login"
                aria-label="Sign in"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#141414] text-gray-300 transition-all duration-300 hover:border-yellow-400 hover:text-yellow-400"
              >
                <User size={17} />
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white transition hover:border-yellow-400 lg:hidden"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Mobile Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isMenuOpen ? 0 : "100%" }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 right-0 z-50 h-screen w-72 border-l border-white/10 bg-[#111] shadow-2xl lg:hidden"
      >
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <h3 className="text-lg font-semibold text-white">Menu</h3>

          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
            className="text-2xl text-white"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col p-5">
          {menu.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={`border-b border-white/10 py-4 ${
                pathname === item.href
                  ? "text-yellow-400"
                  : "text-gray-300 hover:text-yellow-400"
              }`}
            >
              {item.name}
            </Link>
          ))}

          <Link
            href="/wishlist"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-between border-b border-white/10 py-4 text-gray-300 hover:text-yellow-400"
          >
            <span className="flex items-center gap-2">
              <Heart size={16} />
              Wishlist
            </span>
            {wishlistCount > 0 && (
              <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-[11px] font-semibold text-black">
                {wishlistCount}
              </span>
            )}
          </Link>

          {status === "authenticated" ? (
            <>
              <Link
                href="/account"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 border-b border-white/10 py-4 text-gray-300 hover:text-yellow-400"
              >
                <User size={16} />
                My Account
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="flex items-center gap-2 border-b border-white/10 py-4 text-left text-gray-300 hover:text-red-400"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 border-b border-white/10 py-4 text-gray-300 hover:text-yellow-400"
            >
              <User size={16} />
              Sign In / Register
            </Link>
          )}
        </nav>
      </motion.div>

      {/* Search overlay (Cmd/Ctrl+K style modal) */}
      <SearchOverlay open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </header>
  );
}
