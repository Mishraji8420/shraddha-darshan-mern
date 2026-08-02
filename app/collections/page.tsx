import Link from "next/link";
import type { Metadata } from "next";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getCachedCategories } from "@/lib/cached-queries";
import { toLegacyProduct } from "@/lib/adapters";
import { virtualBadgeCategories } from "@/constants/categories";
import ProductCard from "@/components/product/ProductCard";
import CollectionsFilters from "@/components/product/CollectionsFilters";

type CollectionsSearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

// Dynamic per-category metadata: /collections?category=ganesha gets its own
// title/description/canonical instead of every filtered view sharing one
// generic "Collections" title (which was previously the case — bad for
// SEO since Google saw dozens of URLs with identical <title>). Search
// (?q=) result pages are marked noindex since they're thin/duplicate
// content that shouldn't compete with the real category pages.
export async function generateMetadata({
  searchParams,
}: {
  searchParams: CollectionsSearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  const category = typeof sp.category === "string" ? sp.category : "All";
  const search = typeof sp.q === "string" ? sp.q : "";

  if (search.trim()) {
    return {
      title: "Search Results",
      robots: { index: false, follow: true },
    };
  }

  if (virtualBadgeCategories.includes(category)) {
    return {
      title: `${category} Silver Collection`,
      description: `Explore our ${category.toLowerCase()} handcrafted silver idols, décor and gifting pieces — Shraddha Darshan. Pan-India delivery, 100% authentic silver.`,
      alternates: { canonical: `/collections?category=${encodeURIComponent(category)}` },
    };
  }

  if (category !== "All") {
    const dbCategory = await prisma.category.findUnique({ where: { slug: category } });
    if (dbCategory) {
      return {
        title: `${dbCategory.title} Collection`,
        description: `Shop handcrafted silver ${dbCategory.title.toLowerCase()} online — Shraddha Darshan. Pan-India delivery, 100% authentic silver.`,
        alternates: { canonical: `/collections?category=${dbCategory.slug}` },
      };
    }
  }

  return {
    title: "Shop All Collections",
    description:
      "Browse the full Shraddha Darshan collection — handcrafted silver idols, décor and gifting pieces. Filter by category, search, and sort by price or rating.",
    alternates: { canonical: "/collections" },
  };
}

// Server Component — reads filters straight from the URL's searchParams and
// queries Postgres directly (no client-side array filtering anymore, which
// doesn't scale past a few dozen products anyway). The interactive
// search/category/sort controls live in <CollectionsFilters>, a small
// client component that just updates the URL; this page re-runs on the
// server every time those params change.
export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const category = typeof sp.category === "string" ? sp.category : "All";
  const search = typeof sp.q === "string" ? sp.q : "";
  const sortBy = typeof sp.sort === "string" ? sp.sort : "featured";

  const dbCategories = await getCachedCategories();

  const categoryOptions = [
    { label: "All", value: "All" },
    ...dbCategories.map((c) => ({ label: c.title, value: c.slug })),
    ...virtualBadgeCategories.map((b) => ({ label: b, value: b })),
  ];

  const where: Prisma.ProductWhereInput = {};

  if (virtualBadgeCategories.includes(category)) {
    where.badge = category;
  } else if (category !== "All") {
    where.category = { slug: category };
  }

  if (search.trim()) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { category: { title: { contains: search, mode: "insensitive" } } },
    ];
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sortBy === "low"
      ? { price: "asc" }
      : sortBy === "high"
        ? { price: "desc" }
        : sortBy === "rating"
          ? { rating: "desc" }
          : { featured: "desc" };

  const dbProducts = await prisma.product.findMany({
    where,
    orderBy,
    include: { category: true },
  });
  const products = dbProducts.map(toLegacyProduct);

  // Human-readable label for the "Coming Soon" empty state (category is a
  // slug/badge value in the URL, not the display title).
  const categoryLabel =
    categoryOptions.find((c) => c.value === category)?.label ?? category;

  return (
    <main>
      <section className="border-b border-white/10 bg-[#0b0b0b] py-20">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-sm uppercase tracking-[0.3em] text-yellow-400">
            Shraddha Darshan
          </p>
          <h1 className="mt-4 text-5xl font-bold text-white">Collections</h1>
          <p className="mt-4 max-w-2xl text-gray-400">
            Explore our premium handcrafted spiritual collection.
          </p>
          <p className="mt-8 text-sm text-gray-500">Home / Collections</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <CollectionsFilters
          categoryOptions={categoryOptions}
          category={category}
          search={search}
          sortBy={sortBy}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.length === 0 && category !== "All" && !search.trim() ? (
            <div className="col-span-full rounded-2xl border border-dashed border-yellow-400/20 bg-yellow-400/5 py-20 text-center">
              <span className="badge-text text-yellow-400">Coming Soon</span>
              <h2 className="mt-4 text-3xl font-bold text-white">
                {categoryLabel} products are on the way
              </h2>
              <p className="mx-auto mt-3 max-w-md text-gray-400">
                We&apos;re adding new handcrafted pieces to this category soon.
                Check back shortly, or explore our full collection below.
              </p>
              <Link href="/collections" className="btn-primary mt-6 inline-flex">
                View All Products
              </Link>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-white/10 py-20 text-center">
              <h2 className="text-3xl font-bold text-white">No Products Found</h2>
              <p className="mt-3 text-gray-400">
                Try another search or category.
              </p>
            </div>
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
