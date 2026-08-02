/**
 * "Best Seller" and "New" aren't real product categories — they match a
 * product's `badge` field instead of a real Category row. Everything else
 * (the real shop-by-category list) now lives in the database (see
 * prisma/schema.prisma's Category model + prisma/seed.ts) and is fetched
 * live via Prisma in app/categories/page.tsx and CategoryStrip.tsx, instead
 * of being hand-maintained here. This used to also export a hardcoded
 * `categoryList` that duplicated (and drifted out of sync with) the real
 * category data — removed as part of the Phase 1 backend wiring.
 */
export const virtualBadgeCategories = ["Best Seller", "New"];
