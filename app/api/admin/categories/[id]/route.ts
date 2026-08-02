import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

interface UpdateCategoryBody {
  title: string;
  icon: string;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  const id = Number((await params).id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid category id." }, { status: 400 });
  }

  let body: UpdateCategoryBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const title = body.title?.trim();
  const icon = body.icon?.trim();
  if (!title || title.length < 2) {
    return NextResponse.json(
      { error: "Validation failed.", fieldErrors: { title: "Category name is required." } },
      { status: 400 },
    );
  }
  if (!icon) {
    return NextResponse.json(
      { error: "Validation failed.", fieldErrors: { icon: "Pick an icon." } },
      { status: 400 },
    );
  }

  try {
    // Slug is intentionally NOT editable after creation — it's baked into
    // every /collections?category=<slug> link across the storefront.
    const category = await prisma.category.update({
      where: { id },
      data: { title, icon },
    });
    revalidateTag("categories");
    return NextResponse.json({ category });
  } catch (err) {
    console.error(`PATCH /api/admin/categories/${id} failed:`, err);
    return NextResponse.json({ error: "Could not update category." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  const id = Number((await params).id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid category id." }, { status: 400 });
  }

  try {
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      return NextResponse.json(
        {
          error: `Can't delete — ${productCount} product${productCount === 1 ? "" : "s"} still use this category. Move or delete them first.`,
        },
        { status: 400 },
      );
    }

    await prisma.category.delete({ where: { id } });
    revalidateTag("categories");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`DELETE /api/admin/categories/${id} failed:`, err);
    return NextResponse.json({ error: "Could not delete category." }, { status: 500 });
  }
}
