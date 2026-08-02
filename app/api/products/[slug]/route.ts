import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/products/[slug]
// Powers app/collections/[slug]/page.tsx once it's switched over from the
// static `products.find(p => p.slug === slug)` lookup.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 },
      );
    }

    // Related products: same category, excluding itself — same intent as
    // the `relatedProducts` slice(0, 4) on the current PDP, just sourced
    // from the DB instead of the whole static array.
    const related = await prisma.product.findMany({
      where: { categoryId: product.categoryId, NOT: { id: product.id } },
      take: 4,
      include: { category: true },
    });

    return NextResponse.json({ product, related });
  } catch (err) {
    console.error(`GET /api/products/${slug} failed:`, err);
    return NextResponse.json(
      { error: "Could not load this product. Please try again." },
      { status: 500 },
    );
  }
}
