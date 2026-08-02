import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

// Categories + "Best Seller"/"New" badge counts are read on almost every
// page (CategoryStrip is on the homepage, the categories page, and the
// collections filter dropdown all need them) but change rarely — new
// categories or products aren't added minute-to-minute. Every uncached
// Prisma call is a real round-trip to Supabase (Tokyo region), so caching
// these specifically is the highest-value place to cut down page load time
// without risking showing stale prices/stock (which are NOT cached here —
// only category data and simple counts).
//
// Cache is invalidated automatically after 5 minutes, or immediately via
// `revalidateTag("categories")` / `revalidateTag("products")` once the
// admin dashboard (Phase 2.5) can actually change this data.

export const getCachedCategories = unstable_cache(
  async () => prisma.category.findMany({ orderBy: { id: "asc" } }),
  ["categories-list"],
  { revalidate: 300, tags: ["categories"] },
);

export const getCachedBadgeCounts = unstable_cache(
  async () => {
    const [bestSellerCount, newCount] = await Promise.all([
      prisma.product.count({ where: { badge: "Best Seller" } }),
      prisma.product.count({ where: { badge: "New" } }),
    ]);
    return { bestSellerCount, newCount };
  },
  ["badge-counts"],
  { revalidate: 300, tags: ["products"] },
);

export const getCachedCategoriesWithProductCounts = unstable_cache(
  async () =>
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { id: "asc" },
    }),
  ["categories-with-product-counts"],
  { revalidate: 300, tags: ["categories", "products"] },
);

// Shorter revalidate window than categories (60s, not 300s) since product
// price/stock can change more often — still cuts the homepage's DB
// round-trips without risking noticeably stale prices.
export const getCachedFeaturedProducts = unstable_cache(
  async () =>
    prisma.product.findMany({
      where: { featured: true },
      orderBy: { rating: "desc" },
      take: 8,
      include: { category: true },
    }),
  ["featured-products"],
  { revalidate: 60, tags: ["products"] },
);
