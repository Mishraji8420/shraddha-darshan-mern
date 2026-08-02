import Link from "next/link";
import type { Metadata } from "next";
import { getCachedCategoriesWithProductCounts, getCachedBadgeCounts } from "@/lib/cached-queries";
import { categoryIconMap } from "@/lib/icon-map";
import GlassCard from "@/components/common/GlassCard";

export const metadata: Metadata = {
  title: "Shop by Category",
  description:
    "Browse Shraddha Darshan's handcrafted silver collection by category — idols, décor, Vastu items and gifting pieces, all pan-India delivered.",
  alternates: { canonical: "/categories" },
};

// Server Component — fetches real categories + live product counts
// directly via Prisma (cached, see lib/cached-queries.ts). Replaces the old client-side
// `getProductCount()` that filtered the static `products` array against
// constants/categories.ts's hand-maintained `categoryList` (which is what
// caused "Gifting"/"Vastu"/"God Idols"/etc. to always show "Coming Soon"
// even when matching products existed — see BACKEND_SETUP.md).
export default async function CategoriesPage() {
  const [categories, { bestSellerCount, newCount }] = await Promise.all([
    getCachedCategoriesWithProductCounts(),
    getCachedBadgeCounts(),
  ]);

  const items = [
    {
      title: "Best Seller",
      href: `/collections?category=${encodeURIComponent("Best Seller")}`,
      icon: "Trophy",
      count: bestSellerCount,
    },
    ...categories.map((c) => ({
      title: c.title,
      href: `/collections?category=${c.slug}`,
      icon: c.icon,
      count: c._count.products,
    })),
    {
      title: "New",
      href: `/collections?category=${encodeURIComponent("New")}`,
      icon: "Sparkles",
      count: newCount,
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10 px-6 py-16 sm:px-10 lg:px-16">
        <span className="badge-text text-yellow-400">Shraddha Darshan</span>
        <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
          Shop by Category
        </h1>
        <p className="mt-3 max-w-xl text-gray-400">
          Explore our handcrafted silver collection organized by category.
        </p>
        <p className="mt-6 text-sm text-gray-500">Home / Categories</p>
      </section>

      <section className="px-6 py-12 sm:px-10 lg:px-16">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => {
            const Icon = categoryIconMap[item.icon];
            const isComingSoon = item.count === 0;

            return (
              <Link key={item.title} href={item.href}>
                <GlassCard className="items-center text-center transition-transform duration-300 hover:-translate-y-1">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-yellow-400/20 bg-yellow-400/5">
                    {Icon && (
                      <Icon size={26} strokeWidth={1.6} className="text-yellow-400" />
                    )}
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-white">
                    {item.title}
                  </h3>

                  {isComingSoon ? (
                    <span className="mt-2 inline-block rounded-full border border-yellow-400/20 bg-yellow-400/5 px-3 py-1 text-[11px] font-medium text-yellow-400">
                      Coming Soon
                    </span>
                  ) : (
                    <span className="mt-2 text-sm text-gray-400">
                      {item.count} {item.count === 1 ? "Product" : "Products"}
                    </span>
                  )}
                </GlassCard>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
