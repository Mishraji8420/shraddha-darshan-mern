"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface CartDropdownProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDropdown({ open, onClose }: CartDropdownProps) {
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (!open) return null;

  return (
    <>
      {/* Click-outside backdrop (invisible, same pattern as the mobile menu) */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40"
        aria-hidden="true"
      />

      <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[92vw] max-w-sm rounded-2xl border border-white/10 bg-[#111] p-4 shadow-2xl sm:w-96">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Your Cart</h3>
          <span className="text-xs text-gray-500">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <ShoppingBag size={28} className="text-gray-600" />
            <p className="text-sm text-gray-400">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#1a1a1a]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {product.name}
                    </p>
                    <p className="text-xs text-yellow-400">
                      ₹{product.price.toLocaleString("en-IN")}
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        aria-label={`Decrease quantity of ${product.name}`}
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 text-gray-300 transition hover:border-yellow-400 hover:text-yellow-400"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-5 text-center text-xs text-gray-300">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        aria-label={`Increase quantity of ${product.name}`}
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 text-gray-300 transition hover:border-yellow-400 hover:text-yellow-400"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    aria-label={`Remove ${product.name} from cart`}
                    className="shrink-0 text-gray-500 transition hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
              <span className="text-sm text-gray-400">Subtotal</span>
              <span className="text-base font-semibold text-yellow-400">
                ₹{cartTotal.toLocaleString("en-IN")}
              </span>
            </div>

            <Link
              href="/cart"
              onClick={onClose}
              className="mt-4 block w-full rounded-xl bg-yellow-400 py-3 text-center text-sm font-semibold text-black transition hover:bg-yellow-300"
            >
              View Cart
            </Link>
          </>
        )}
      </div>
    </>
  );
}
