export interface ProductFormValues {
  name: string;
  slug: string;
  description: string;
  images: string[];
  price: string;
  oldPrice: string;
  categoryId: string;
  badge: string;
  stockQuantity: string;
  inStock: boolean;
  featured: boolean;
}

export type ProductFieldErrors = Partial<Record<keyof ProductFormValues, string>>;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function validateProductForm(values: ProductFormValues): ProductFieldErrors {
  const errors: ProductFieldErrors = {};

  if (!values.name.trim() || values.name.trim().length < 3) {
    errors.name = "Product name must be at least 3 characters.";
  }

  const slug = values.slug.trim();
  if (!slug) {
    errors.slug = "Slug is required.";
  } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    errors.slug = "Slug can only contain lowercase letters, numbers, and hyphens.";
  }

  if (!values.description.trim() || values.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters.";
  }

  if (!values.images.length) {
    errors.images = "At least one image is required.";
  }

  const price = Number(values.price);
  if (!values.price || Number.isNaN(price) || price <= 0) {
    errors.price = "Enter a valid price.";
  }

  if (values.oldPrice) {
    const oldPrice = Number(values.oldPrice);
    if (Number.isNaN(oldPrice) || oldPrice <= 0) {
      errors.oldPrice = "Enter a valid compare-at price, or leave it blank.";
    } else if (!Number.isNaN(price) && oldPrice < price) {
      errors.oldPrice = "Compare-at price should be higher than the actual price.";
    }
  }

  if (!values.categoryId) {
    errors.categoryId = "Select a category.";
  }

  const stockQuantity = Number(values.stockQuantity);
  if (values.stockQuantity === "" || Number.isNaN(stockQuantity) || stockQuantity < 0) {
    errors.stockQuantity = "Enter a valid stock quantity (0 or more).";
  }

  return errors;
}
