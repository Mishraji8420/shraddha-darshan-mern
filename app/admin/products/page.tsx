import ProductsTable from "@/components/admin/ProductsTable";

export default function AdminProductsPage() {
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-white">Products</h1>
      <p className="mt-1 text-sm text-gray-500">Manage your product catalog</p>

      <div className="mt-6">
        <ProductsTable />
      </div>
    </div>
  );
}
