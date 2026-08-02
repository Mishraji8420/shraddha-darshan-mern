"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Pencil, Trash2, Plus, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useAdminToast } from "./AdminToastProvider";

interface AdminProduct {
  id: number;
  name: string;
  slug: string;
  images: string[];
  price: number;
  stockQuantity: number;
  inStock: boolean;
  featured: boolean;
  category: { title: string };
}

export default function ProductsTable() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { showToast } = useAdminToast();

  useEffect(() => {
    const trimmed = query.trim();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- marks the start of an in-flight fetch, not derived UI state
    setLoading(true);
    const handle = setTimeout(() => {
      fetch(`/api/admin/products?q=${encodeURIComponent(trimmed)}&page=${page}`)
        .then((res) => res.json())
        .then((data) => {
          setProducts(data.products ?? []);
          setTotalPages(data.totalPages ?? 1);
          setTotal(data.total ?? 0);
        })
        .catch(() => showToast("error", "Could not load products."))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- showToast is stable from context, omitting to avoid re-triggering the fetch
  }, [query, page]);

  async function handleDelete(id: number, name: string) {
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        showToast("error", data.error || "Could not delete product.");
        return;
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast("success", "Product deleted.");
    } catch {
      showToast("error", "Network error. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search products..."
            className="w-full rounded-lg border border-white/10 bg-[#0f0f0f] py-2.5 pl-9 pr-3 text-sm text-white outline-none transition focus:border-yellow-400"
          />
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-300"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#0f0f0f] text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-[#0a0a0a]">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                  <Loader2 size={18} className="mx-auto animate-spin" />
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="transition hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-[#151515]">
                        {product.images[0] && (
                          <Image
                            src={product.images[0]}
                            alt=""
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">{product.name}</p>
                        {product.featured && (
                          <span className="text-[11px] text-yellow-400">Featured</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{product.category.title}</td>
                  <td className="px-4 py-3 text-gray-300">₹{product.price.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 text-gray-400">{product.stockQuantity}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        product.inStock
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        aria-label="Edit product"
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-yellow-400"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={deletingId === product.id}
                        aria-label="Delete product"
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-red-400 disabled:opacity-50"
                      >
                        {deletingId === product.id ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>{total} products total</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 transition hover:border-white/30 disabled:opacity-40"
            >
              <ChevronLeft size={15} />
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 transition hover:border-white/30 disabled:opacity-40"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
