"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Loader2 } from "lucide-react";
import type { Product as DbProduct, Category as DbCategory } from "@/generated/prisma/client";
import { toLegacyProduct } from "@/lib/adapters";
import type { Product } from "@/types/products";

interface SearchOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// This used to filter the static `products` array entirely client-side
// (instant, but obviously doesn't scale past a few dozen SKUs). It now
// debounces keystrokes and calls GET /api/products?q=... — same UX, but
// backed by a real, scalable DB query, with a loading state for the
// network latency that introduces.
export default function SearchOverlay({ open, onOpenChange }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const trimmedQuery = query.trim();
  // Derived, not stored: avoids needing to reset a "loading" flag the
  // instant the query is cleared (see the effect below).
  const loading = trimmedQuery.length > 0 && pending;

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      setQuery("");
      setResults([]);
    }
  };

  // Load "popular categories" once, the first time the dialog is opened.
  useEffect(() => {
    if (!open || categories.length > 0) return;
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data: { categories?: { title: string }[] }) =>
        setCategories((data.categories ?? []).map((c) => c.title)),
      )
      .catch(() => {
        // Non-critical UI — fail silently, the search box itself still works.
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only load once per open
  }, [open]);

  // Debounced live search, with request cancellation so a slow earlier
  // keystroke's response can't overwrite a newer one's results. When the
  // query is empty there's nothing to fetch, so the effect does nothing —
  // `results` is simply not rendered while `trimmedQuery` is empty (see JSX
  // below), so stale results never flash on screen.
  useEffect(() => {
    if (!trimmedQuery) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- marks the start of an in-flight fetch, not derived UI state
    setPending(true);
    const controller = new AbortController();
    const handle = setTimeout(() => {
      fetch(`/api/products?q=${encodeURIComponent(trimmedQuery)}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data: { products?: (DbProduct & { category: DbCategory })[] }) => {
          setResults((data.products ?? []).slice(0, 6).map(toLegacyProduct));
        })
        .catch((err: unknown) => {
          if (err instanceof Error && err.name === "AbortError") return;
          setResults([]);
        })
        .finally(() => setPending(false));
    }, 300);

    return () => {
      clearTimeout(handle);
      controller.abort();
    };
  }, [trimmedQuery]);

  const handleViewAll = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    handleOpenChange(false);
    router.push(`/collections?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-1/2 top-20 z-[71] w-[92%] max-w-xl -translate-x-1/2 rounded-2xl border border-white/10 bg-[#0e0e0e] p-4 shadow-2xl sm:top-24 sm:p-5"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">Search products</Dialog.Title>

          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#151515] px-4 py-3">
            <Search size={18} className="shrink-0 text-yellow-400" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleViewAll();
              }}
              placeholder="Search idols, décor, gifting collections..."
              className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 outline-none sm:text-base"
            />
            {loading && (
              <Loader2 size={16} className="shrink-0 animate-spin text-gray-500" />
            )}
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close search"
                className="shrink-0 text-gray-500 transition hover:text-yellow-400"
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            {trimmedQuery.length > 0 && !loading && results.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-500">
                No products found for &quot;{query}&quot;
              </p>
            )}

            {trimmedQuery.length > 0 && results.map((product) => (
              <Link
                key={product.id}
                href={`/collections/${product.slug}`}
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-4 rounded-xl p-2.5 transition hover:bg-white/5"
              >
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
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-yellow-400">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              </Link>
            ))}

            {trimmedQuery.length > 0 && results.length > 0 && (
              <button
                type="button"
                onClick={handleViewAll}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-medium text-gray-300 transition hover:border-yellow-400 hover:text-yellow-400"
              >
                View all results for &quot;{query}&quot;
                <ArrowRight size={14} />
              </button>
            )}

            {trimmedQuery.length === 0 && (
              <div className="py-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Popular categories
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      type="button"
                      key={category}
                      onClick={() => setQuery(category)}
                      className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-gray-300 transition hover:border-yellow-400 hover:text-yellow-400"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
