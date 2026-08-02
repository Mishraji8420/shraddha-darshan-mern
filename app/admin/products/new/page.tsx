import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    select: { id: true, title: true },
    orderBy: { title: "asc" },
  });

  return (
    <div className="p-6 lg:p-8">
      <Link
        href="/admin/products"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 transition hover:text-white"
      >
        <ChevronLeft size={15} />
        Back to Products
      </Link>
      <h1 className="text-2xl font-bold text-white">Add Product</h1>
      <p className="mt-1 text-sm text-gray-500">Create a new product listing</p>

      <div className="mt-6">
        {categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-yellow-400/30 bg-yellow-400/5 p-6 text-sm text-yellow-400">
            You need at least one category before adding a product.{" "}
            <Link href="/admin/categories" className="underline">
              Create one first →
            </Link>
          </div>
        ) : (
          <ProductForm categories={categories} />
        )}
      </div>
    </div>
  );
}
