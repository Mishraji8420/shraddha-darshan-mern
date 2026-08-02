import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Package, FolderTree, AlertTriangle, Mail, ArrowRight } from "lucide-react";

async function getStats() {
  const [totalProducts, totalCategories, outOfStock, subscribers, lowStock] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.product.count({ where: { inStock: false } }),
      prisma.subscriber.count(),
      prisma.product.findMany({
        where: { stockQuantity: { lte: 5 }, inStock: true },
        select: { id: true, name: true, stockQuantity: true, images: true },
        orderBy: { stockQuantity: "asc" },
        take: 5,
      }),
    ]);

  return { totalProducts, totalCategories, outOfStock, subscribers, lowStock };
}

export default async function AdminDashboardPage() {
  const { totalProducts, totalCategories, outOfStock, subscribers, lowStock } =
    await getStats();

  const cards = [
    { label: "Total Products", value: totalProducts, icon: Package, href: "/admin/products" },
    { label: "Categories", value: totalCategories, icon: FolderTree, href: "/admin/categories" },
    {
      label: "Out of Stock",
      value: outOfStock,
      icon: AlertTriangle,
      href: "/admin/products?filter=out-of-stock",
      warn: outOfStock > 0,
    },
    { label: "Newsletter Subscribers", value: subscribers, icon: Mail, href: null },
  ];

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">Overview of your store</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          const content = (
            <div className="rounded-2xl border border-white/10 bg-[#0f0f0f] p-5 transition hover:border-white/20">
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    card.warn ? "bg-red-500/10 text-red-400" : "bg-yellow-400/10 text-yellow-400"
                  }`}
                >
                  <Icon size={18} />
                </div>
                {card.href && <ArrowRight size={14} className="text-gray-600" />}
              </div>
              <p className="mt-4 text-2xl font-bold text-white">{card.value}</p>
              <p className="mt-1 text-sm text-gray-500">{card.label}</p>
            </div>
          );
          return card.href ? (
            <Link key={card.label} href={card.href}>
              {content}
            </Link>
          ) : (
            <div key={card.label}>{content}</div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#0f0f0f] p-5">
          <h2 className="text-sm font-semibold text-white">Low Stock Alert</h2>
          <p className="mt-0.5 text-xs text-gray-500">Products with 5 or fewer units left</p>

          {lowStock.length === 0 ? (
            <p className="mt-6 text-sm text-gray-600">
              Nothing low on stock right now. 🎉
            </p>
          ) : (
            <div className="mt-4 space-y-1">
              {lowStock.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}/edit`}
                  className="flex items-center justify-between rounded-lg px-2 py-2.5 text-sm transition hover:bg-white/5"
                >
                  <span className="text-gray-300">{product.name}</span>
                  <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400">
                    {product.stockQuantity} left
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0f0f0f] p-5">
          <h2 className="text-sm font-semibold text-white">Quick Actions</h2>
          <div className="mt-4 space-y-2">
            <Link
              href="/admin/products/new"
              className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3 text-sm text-gray-300 transition hover:border-yellow-400/40 hover:text-yellow-400"
            >
              Add a new product
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3 text-sm text-gray-300 transition hover:border-yellow-400/40 hover:text-yellow-400"
            >
              Manage categories
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
