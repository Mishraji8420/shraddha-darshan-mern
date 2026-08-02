"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import ImageUploader from "./ImageUploader";
import { useAdminToast } from "./AdminToastProvider";
import {
  validateProductForm,
  slugify,
  type ProductFormValues,
  type ProductFieldErrors,
} from "@/lib/productValidation";

interface CategoryOption {
  id: number;
  title: string;
}

interface ExistingProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  images: string[];
  price: number;
  oldPrice: number | null;
  categoryId: number;
  badge: string | null;
  stockQuantity: number;
  inStock: boolean;
  featured: boolean;
}

interface ProductFormProps {
  categories: CategoryOption[];
  initialProduct?: ExistingProduct;
}

const BADGE_OPTIONS = [
  "",
  "Best Seller",
  "New",
  "Trending",
  "Premium",
  "Limited",
  "Exclusive",
  "Luxury",
  "Popular",
];

export default function ProductForm({ categories, initialProduct }: ProductFormProps) {
  const isEditMode = Boolean(initialProduct);
  const router = useRouter();
  const { showToast } = useAdminToast();

  const [values, setValues] = useState<ProductFormValues>({
    name: initialProduct?.name ?? "",
    slug: initialProduct?.slug ?? "",
    description: initialProduct?.description ?? "",
    images: initialProduct?.images ?? [],
    price: initialProduct ? String(initialProduct.price) : "",
    oldPrice: initialProduct?.oldPrice ? String(initialProduct.oldPrice) : "",
    categoryId: initialProduct ? String(initialProduct.categoryId) : "",
    badge: initialProduct?.badge ?? "",
    stockQuantity: initialProduct ? String(initialProduct.stockQuantity) : "",
    inStock: initialProduct?.inStock ?? true,
    featured: initialProduct?.featured ?? false,
  });
  const [slugTouched, setSlugTouched] = useState(isEditMode);
  const [errors, setErrors] = useState<ProductFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleNameChange(name: string) {
    update("name", name);
    if (!slugTouched) {
      update("slug", slugify(name));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const fieldErrors = validateProductForm(values);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      showToast("error", "Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    const payload = {
      name: values.name.trim(),
      slug: values.slug.trim(),
      description: values.description.trim(),
      images: values.images,
      price: Number(values.price),
      oldPrice: values.oldPrice ? Number(values.oldPrice) : null,
      categoryId: Number(values.categoryId),
      badge: values.badge || null,
      stockQuantity: Number(values.stockQuantity),
      inStock: values.inStock,
      featured: values.featured,
    };

    try {
      const url = isEditMode
        ? `/api/admin/products/${initialProduct!.id}`
        : "/api/admin/products";
      const res = await fetch(url, {
        method: isEditMode ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        showToast("error", data.error || "Something went wrong.");
        setSubmitting(false);
        return;
      }

      showToast("success", isEditMode ? "Product updated." : "Product created.");
      router.push("/admin/products");
      router.refresh();
    } catch {
      showToast("error", "Network error. Please try again.");
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-[#0a0a0a] px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-yellow-400";
  const labelClass = "mb-1.5 block text-sm font-medium text-gray-300";
  const errorClass = "mt-1 text-xs text-red-400";

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <div className="rounded-2xl border border-white/10 bg-[#0f0f0f] p-5">
          <div>
            <label className={labelClass}>Product Name</label>
            <input
              value={values.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={inputClass}
              placeholder="e.g. Royal Silver Elephant"
            />
            {errors.name && <p className={errorClass}>{errors.name}</p>}
          </div>

          <div className="mt-4">
            <label className={labelClass}>Slug (URL)</label>
            <input
              value={values.slug}
              onChange={(e) => {
                setSlugTouched(true);
                update("slug", e.target.value);
              }}
              className={inputClass}
              placeholder="royal-silver-elephant"
            />
            {errors.slug && <p className={errorClass}>{errors.slug}</p>}
            <p className="mt-1 text-xs text-gray-600">
              /collections/{values.slug || "..."}
            </p>
          </div>

          <div className="mt-4">
            <label className={labelClass}>Description</label>
            <textarea
              value={values.description}
              onChange={(e) => update("description", e.target.value)}
              rows={4}
              className={`${inputClass} resize-none`}
              placeholder="A short, unique description shown on the product page."
            />
            {errors.description && <p className={errorClass}>{errors.description}</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0f0f0f] p-5">
          <label className={labelClass}>Images</label>
          <ImageUploader images={values.images} onChange={(imgs) => update("images", imgs)} />
          {errors.images && <p className={errorClass}>{errors.images}</p>}
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl border border-white/10 bg-[#0f0f0f] p-5">
          <div>
            <label className={labelClass}>Price (₹)</label>
            <input
              type="number"
              value={values.price}
              onChange={(e) => update("price", e.target.value)}
              className={inputClass}
              placeholder="2999"
            />
            {errors.price && <p className={errorClass}>{errors.price}</p>}
          </div>

          <div className="mt-4">
            <label className={labelClass}>Compare-at Price (₹) — optional</label>
            <input
              type="number"
              value={values.oldPrice}
              onChange={(e) => update("oldPrice", e.target.value)}
              className={inputClass}
              placeholder="3999"
            />
            {errors.oldPrice && <p className={errorClass}>{errors.oldPrice}</p>}
          </div>

          <div className="mt-4">
            <label className={labelClass}>Stock Quantity</label>
            <input
              type="number"
              value={values.stockQuantity}
              onChange={(e) => update("stockQuantity", e.target.value)}
              className={inputClass}
              placeholder="40"
            />
            {errors.stockQuantity && <p className={errorClass}>{errors.stockQuantity}</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0f0f0f] p-5">
          <div>
            <label className={labelClass}>Category</label>
            <select
              value={values.categoryId}
              onChange={(e) => update("categoryId", e.target.value)}
              className={inputClass}
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className={errorClass}>{errors.categoryId}</p>}
          </div>

          <div className="mt-4">
            <label className={labelClass}>Badge — optional</label>
            <select
              value={values.badge}
              onChange={(e) => update("badge", e.target.value)}
              className={inputClass}
            >
              {BADGE_OPTIONS.map((b) => (
                <option key={b} value={b}>
                  {b || "None"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-white/10 bg-[#0f0f0f] p-5">
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-sm font-medium text-gray-300">In Stock</span>
            <input
              type="checkbox"
              checked={values.inStock}
              onChange={(e) => update("inStock", e.target.checked)}
              className="h-5 w-5 accent-yellow-400"
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-sm font-medium text-gray-300">Featured (homepage)</span>
            <input
              type="checkbox"
              checked={values.featured}
              onChange={(e) => update("featured", e.target.checked)}
              className="h-5 w-5 accent-yellow-400"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-400 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300 disabled:opacity-60"
        >
          {submitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {isEditMode ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
