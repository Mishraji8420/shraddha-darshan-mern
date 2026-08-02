import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const id = Number((await params).id);
  if (Number.isNaN(id)) notFound();

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ select: { id: true, title: true }, orderBy: { title: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="p-6 lg:p-8">
      <Link
        href="/admin/products"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 transition hover:text-white"
      >
        <ChevronLeft size={15} />
        Back to Products
      </Link>
      <h1 className="text-2xl font-bold text-white">Edit Product</h1>
      <p className="mt-1 text-sm text-gray-500">{product.name}</p>

      <div className="mt-6">
        <ProductForm categories={categories} initialProduct={product} />
      </div>
    </div>
  );
}
