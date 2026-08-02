import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-auth";
import { validateProductForm, type ProductFormValues } from "@/lib/productValidation";
import type { Prisma } from "@/generated/prisma/client";

const PAGE_SIZE = 20;

// GET /api/admin/products?q=&page=1 — unlike the public /api/products
// route, this returns every product regardless of stock/featured status,
// since the admin needs to see (and fix) out-of-stock items too.
export async function GET(request: NextRequest) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const where: Prisma.ProductWhereInput = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      total,
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    });
  } catch (err) {
    console.error("GET /api/admin/products failed:", err);
    return NextResponse.json({ error: "Could not load products." }, { status: 500 });
  }
}

interface CreateProductBody {
  name: string;
  slug: string;
  description: string;
  images: string[];
  price: number;
  oldPrice: number | null;
  categoryId: number;
  badge: string;
  stockQuantity: number;
  inStock: boolean;
  featured: boolean;
}

export async function POST(request: NextRequest) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  let body: CreateProductBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const formValues: ProductFormValues = {
    name: body.name ?? "",
    slug: body.slug ?? "",
    description: body.description ?? "",
    images: body.images ?? [],
    price: String(body.price ?? ""),
    oldPrice: body.oldPrice ? String(body.oldPrice) : "",
    categoryId: body.categoryId ? String(body.categoryId) : "",
    badge: body.badge ?? "",
    stockQuantity: String(body.stockQuantity ?? ""),
    inStock: body.inStock ?? true,
    featured: body.featured ?? false,
  };

  const fieldErrors = validateProductForm(formValues);
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json({ error: "Validation failed.", fieldErrors }, { status: 400 });
  }

  try {
    const existingSlug = await prisma.product.findUnique({ where: { slug: body.slug } });
    if (existingSlug) {
      return NextResponse.json(
        { error: "Validation failed.", fieldErrors: { slug: "This slug is already in use." } },
        { status: 400 },
      );
    }

    const product = await prisma.product.create({
      data: {
        name: body.name.trim(),
        slug: body.slug.trim(),
        description: body.description.trim(),
        images: body.images,
        price: body.price,
        oldPrice: body.oldPrice || null,
        categoryId: body.categoryId,
        badge: body.badge?.trim() || null,
        stockQuantity: body.stockQuantity,
        inStock: body.inStock,
        featured: body.featured,
      },
    });

    // The storefront caches category/product listings (see
    // lib/cached-queries.ts) — without this, a newly created product
    // wouldn't show up on the live site for up to 5 minutes.
    revalidateTag("products");
    revalidateTag("categories");

    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/products failed:", err);
    return NextResponse.json({ error: "Could not create product." }, { status: 500 });
  }
}
