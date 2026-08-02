import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-auth";
import { validateProductForm, type ProductFormValues } from "@/lib/productValidation";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  const id = Number((await params).id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid product id." }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
  return NextResponse.json({ product });
}

interface UpdateProductBody {
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

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  const id = Number((await params).id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid product id." }, { status: 400 });
  }

  let body: UpdateProductBody;
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
    const existingSlug = await prisma.product.findFirst({
      where: { slug: body.slug, NOT: { id } },
    });
    if (existingSlug) {
      return NextResponse.json(
        { error: "Validation failed.", fieldErrors: { slug: "This slug is already in use." } },
        { status: 400 },
      );
    }

    const product = await prisma.product.update({
      where: { id },
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

    revalidateTag("products");
    revalidateTag("categories");

    return NextResponse.json({ product });
  } catch (err) {
    console.error(`PATCH /api/admin/products/${id} failed:`, err);
    return NextResponse.json({ error: "Could not update product." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  const id = Number((await params).id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid product id." }, { status: 400 });
  }

  try {
    await prisma.product.delete({ where: { id } });
    revalidateTag("products");
    revalidateTag("categories");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`DELETE /api/admin/products/${id} failed:`, err);
    return NextResponse.json(
      {
        error:
          "Could not delete product. It may still be referenced by an existing order or cart.",
      },
      { status: 500 },
    );
  }
}
