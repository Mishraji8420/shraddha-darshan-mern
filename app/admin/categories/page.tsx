import CategoriesManager from "@/components/admin/CategoriesManager";

export default function AdminCategoriesPage() {
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-white">Categories</h1>
      <p className="mt-1 text-sm text-gray-500">Manage your shop-by-category taxonomy</p>

      <div className="mt-6">
        <CategoriesManager />
      </div>
    </div>
  );
}
