"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface CollectionsFiltersProps {
  categoryOptions: { label: string; value: string }[];
  category: string;
  search: string;
  sortBy: string;
}

export default function CollectionsFilters({
  categoryOptions,
  category,
  search,
  sortBy,
}: CollectionsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state just for the text input, so typing feels instant. The URL
  // (and therefore the server-side DB query) only updates after a short
  // pause, so we're not re-querying Postgres on every keystroke.
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    const handle = setTimeout(() => {
      if (searchInput !== search) {
        updateParam("q", searchInput);
      }
    }, 400);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run when the debounced value itself changes
  }, [searchInput]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "All") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-3">
      <input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search products..."
        className="rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-white outline-none focus:border-yellow-400"
      />

      <select
        value={category}
        onChange={(e) => updateParam("category", e.target.value)}
        className="rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-white"
      >
        {categoryOptions.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={(e) => updateParam("sort", e.target.value)}
        className="rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-white"
      >
        <option value="featured">Featured</option>
        <option value="low">Price Low → High</option>
        <option value="high">Price High → Low</option>
        <option value="rating">Highest Rated</option>
      </select>
    </div>
  );
}
