import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-auth";
import { slugify } from "@/lib/productValidation";

export async function GET() {
  const authError = await requireAdminApi();
  if (authError) return authError;

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { id: "asc" },
  });
  return NextResponse.json({ categories });
}

interface CreateCategoryBody {
  title: string;
  slug?: string;
  icon: string;
}

export async function POST(request: NextRequest) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  let body: CreateCategoryBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const title = body.title?.trim();
  const icon = body.icon?.trim();
  const slug = slugify(body.slug?.trim() || title || "");

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
  if (!slug) {
    return NextResponse.json(
      { error: "Validation failed.", fieldErrors: { title: "Could not generate a valid slug from this name." } },
      { status: 400 },
    );
  }

  try {
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Validation failed.", fieldErrors: { title: "A category with this name/slug already exists." } },
        { status: 400 },
      );
    }

    const category = await prisma.category.create({ data: { title, slug, icon } });
    revalidateTag("categories");
    return NextResponse.json({ category }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/categories failed:", err);
    return NextResponse.json({ error: "Could not create category." }, { status: 500 });
  }
}
