import type { Product as DbProduct, Category as DbCategory } from "../generated/prisma/client";
import type { Product } from "@/types/products";

type DbProductWithCategory = DbProduct & { category: DbCategory };

/**
 * Converts a Prisma Product (relational, multi-image, `reviewsCount`,
 * category as a relation) into the flat shape `types/products.ts` already
 * defines and every existing component (ProductCard, CartContext,
 * WishlistContext, SearchOverlay...) was built against.
 *
 * This is a deliberate compatibility shim: it lets the DB become the real
 * source of truth without having to touch every component that consumes a
 * `Product` on day one. Components that need the richer data (full image
 * gallery, long description) should read those fields straight off the DB
 * result instead of through this adapter — see
 * app/collections/[slug]/page.tsx for an example.
 */
export function toLegacyProduct(p: DbProductWithCategory): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    image: p.images[0] ?? "",
    category: p.category.title,
    price: p.price,
    oldPrice: p.oldPrice ?? p.price,
    rating: p.rating,
    reviews: p.reviewsCount,
    badge: p.badge ?? "",
    inStock: p.inStock,
    featured: p.featured,
  };
}
