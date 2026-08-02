"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, cartTotal, isHydrated } =
    useCart();

  return (
    <main>
      <section className="border-b border-white/10 bg-[#0b0b0b] py-16">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-yellow-400">
            Shraddha Darshan
          </p>
          <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
            My Cart
          </h1>
          <p className="mt-4 text-gray-400">Home / Cart</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        {!isHydrated ? (
          <div className="h-64" aria-hidden="true" />
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 py-24 text-center">
            <ShoppingBag className="mx-auto mb-4 text-gray-600" size={40} />
            <h2 className="text-2xl font-bold text-white">
              Your cart is empty
            </h2>
            <p className="mx-auto mt-2 max-w-md text-gray-400">
              Add some premium silver pieces to get started.
            </p>
            <Link href="/collections" className="btn-primary mt-6 inline-flex">
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart items */}
            <div className="space-y-4 lg:col-span-2">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#111] p-4"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#1a1a1a] sm:h-24 sm:w-24">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-white">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <p className="mt-1 font-semibold text-yellow-400">
                      ₹{product.price.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1 rounded-lg border border-white/10">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      aria-label={`Decrease quantity of ${product.name}`}
                      className="p-2 text-gray-300 transition hover:text-yellow-400"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm text-white">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      aria-label={`Increase quantity of ${product.name}`}
                      className="p-2 text-gray-300 transition hover:text-yellow-400"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    aria-label={`Remove ${product.name} from cart`}
                    className="shrink-0 text-gray-500 transition hover:text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="h-fit rounded-2xl border border-white/10 bg-[#111] p-6">
              <h3 className="text-lg font-semibold text-white">
                Order Summary
              </h3>

              <div className="mt-4 flex justify-between text-sm text-gray-400">
                <span>Subtotal</span>
                <span className="text-white">
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="mt-2 flex justify-between text-sm text-gray-400">
                <span>Shipping</span>
                <span className="text-white">Calculated at checkout</span>
              </div>
              <div className="mt-4 flex justify-between border-t border-white/10 pt-4 text-base font-semibold">
                <span className="text-white">Total</span>
                <span className="text-yellow-400">
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>
              </div>

              <Link
  href="/checkout"
  className="btn-primary mt-6 block w-full rounded-xl py-3 text-center font-semibold"
>
  Proceed to Checkout
</Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
