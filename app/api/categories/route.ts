import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/categories
// Returns every real shop category with its live product count, so
// app/categories/page.tsx no longer needs to recompute counts client-side
// from the full products array (and no longer needs constants/categories.ts
// as a second, hand-maintained source of truth).
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { title: "asc" },
    });

    const withCounts = categories.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      icon: c.icon,
      productCount: c._count.products,
    }));

    return NextResponse.json({ categories: withCounts });
  } catch (err) {
    console.error("GET /api/categories failed:", err);
    return NextResponse.json(
      { error: "Could not load categories. Please try again." },
      { status: 500 },
    );
  }
}
