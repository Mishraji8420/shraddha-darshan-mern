import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

// GET /api/products
// GET /api/products?category=vastu
// GET /api/products?q=elephant
// GET /api/products?sort=low | high | rating | featured (default)
//
// Mirrors the filter/sort logic that used to live entirely inside
// app/collections/page.tsx (CollectionsPageContent) against the static
// `products` array. That client-side logic can now be deleted once this
// route is wired up — see the Phase 1 migration note in the README.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("category");
  const query = searchParams.get("q")?.trim();
  const sort = searchParams.get("sort") ?? "featured";

  const where: Prisma.ProductWhereInput = {};

  if (categorySlug && categorySlug !== "All") {
    where.category = { slug: categorySlug };
  }

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { category: { title: { contains: query, mode: "insensitive" } } },
    ];
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "low"
      ? { price: "asc" }
      : sort === "high"
        ? { price: "desc" }
        : sort === "rating"
          ? { rating: "desc" }
          : { featured: "desc" }; // "featured" (default)

  try {
    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: { category: true },
    });

    return NextResponse.json({ products });
  } catch (err) {
    console.error("GET /api/products failed:", err);
    return NextResponse.json(
      { error: "Could not load products. Please try again." },
      { status: 500 },
    );
  }
}
