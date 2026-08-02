import Link from "next/link";
import SectionContainer from "../common/SectionContainer";
import { getCachedCategories, getCachedBadgeCounts } from "@/lib/cached-queries";
import { categoryIconMap } from "@/lib/icon-map";

// Server Component — no client state here, so it fetches categories +
// live badge counts directly via Prisma instead of the old hardcoded
// `categoryList` import from constants/categories.ts. Both queries are
// cached (see lib/cached-queries.ts) since this renders on every homepage
// load.
export default async function CategoryStrip() {
  const [categories, { bestSellerCount, newCount }] = await Promise.all([
    getCachedCategories(),
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
      count: undefined as number | undefined,
    })),
    {
      title: "New",
      href: `/collections?category=${encodeURIComponent("New")}`,
      icon: "Sparkles",
      count: newCount,
    },
  ];

  return (
    <SectionContainer className="!py-8 sm:!py-10">
      <div className="container">
        <div className="mb-6 flex items-center gap-3 sm:mb-8">
          <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-yellow-500/60 sm:w-8" />

          <span className="text-[10px] font-semibold uppercase tracking-[2px] text-yellow-500/80 sm:text-[11px] sm:tracking-[3px]">
            Shop by category
          </span>

          <span className="h-[1px] flex-1 bg-gradient-to-r from-yellow-500/40 to-transparent" />
        </div>

        <div className="flex gap-5 overflow-x-auto pb-3 scrollbar-hide sm:gap-8">
          {items.map((item) => {
            const Icon = categoryIconMap[item.icon];

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group relative flex min-w-[88px] flex-col items-center sm:min-w-[100px]"
              >
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 group-hover:-translate-y-1 sm:h-[72px] sm:w-[72px]">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/40 via-white/5 to-transparent p-[1.5px] transition-all duration-300 group-hover:from-yellow-400 group-hover:via-yellow-500/40 group-hover:to-yellow-600/20">
                    <div className="h-full w-full rounded-full bg-[#111111]" />
                  </div>

                  <div
                    className="absolute inset-0 rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-40"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(212,175,55,0.5), transparent 70%)",
                    }}
                  />

                  {Icon && (
                    <Icon
                      size={24}
                      strokeWidth={1.6}
                      className="relative z-10 text-gray-300 transition-colors duration-300 group-hover:text-yellow-400 sm:text-[26px]"
                    />
                  )}
                </div>

                <span className="mt-3 text-center text-[11px] font-medium tracking-[0.3px] text-gray-400 transition-colors duration-300 group-hover:text-yellow-400 sm:text-[12.5px]">
                  {item.title}
                </span>

                <span className="mt-1 h-[2px] w-0 rounded-full bg-yellow-500 transition-all duration-300 group-hover:w-5" />
              </Link>
            );
          })}
        </div>
      </div>
    </SectionContainer>
  );
}
