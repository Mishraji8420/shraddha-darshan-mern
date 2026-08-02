"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/product/ProductCard";

export default function WishlistPage() {
  const { items, isHydrated } = useWishlist();

  return (
    <main>
      <section className="border-b border-white/10 bg-[#0b0b0b] py-16">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-yellow-400">
            Shraddha Darshan
          </p>
          <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
            My Wishlist
          </h1>
          <p className="mt-4 text-gray-400">Home / Wishlist</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        {!isHydrated ? (
          // Avoid flashing an "empty" state for a split second while
          // localStorage is being read on the client.
          <div className="h-64" aria-hidden="true" />
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 py-24 text-center">
            <Heart className="mx-auto mb-4 text-gray-600" size={40} />
            <h2 className="text-2xl font-bold text-white">
              Your wishlist is empty
            </h2>
            <p className="mx-auto mt-2 max-w-md text-gray-400">
              Tap the heart icon on any product to save it here and shop it
              later.
            </p>
            <Link href="/collections" className="btn-primary mt-6 inline-flex">
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
