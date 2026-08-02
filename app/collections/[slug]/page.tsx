import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { toLegacyProduct } from "@/lib/adapters";
import { SITE_URL } from "@/lib/seo";
import ProductDetailsClient from "./ProductDetailsClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Server Component — fetches the product (+ its category) and up to 4
// related products (same category) from Postgres, adapts them to the
// existing frontend Product shape, and hands everything to the client
// component that owns all the interactive gallery/size/qty/accordion state.
export default async function ProductDetailsPage({ params }: PageProps) {
  const { slug } = await params;

  const dbProduct = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!dbProduct) {
    notFound();
  }

  const relatedDb = await prisma.product.findMany({
    where: { categoryId: dbProduct.categoryId, NOT: { id: dbProduct.id } },
    take: 4,
    include: { category: true },
  });

  const product = toLegacyProduct(dbProduct);
  const relatedProducts = relatedDb.map(toLegacyProduct);

  // Real Product structured data only — deliberately NOT including
  // aggregateRating/review markup. The rating breakdown + sample reviews
  // shown in ProductDetailsClient are still hardcoded placeholder data
  // (see the NOTE at the top of that file), and shipping fake review rich
  // snippets to Google is a manual-action risk (structured-data
  // guidelines require the marked-up data to be real). Wire this back in
  // once Phase 5 (real reviews) lands and reviewsCount/rating reflect
  // actual submitted reviews.
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: dbProduct.name,
    description: dbProduct.description,
    image: dbProduct.images.map((img) => `${SITE_URL}${img}`),
    sku: String(dbProduct.id),
    brand: { "@type": "Brand", name: "Shraddha Darshan" },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/collections/${dbProduct.slug}`,
      priceCurrency: "INR",
      price: dbProduct.price,
      availability: dbProduct.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetailsClient
        product={product}
        images={dbProduct.images}
        description={dbProduct.description}
        relatedProducts={relatedProducts}
      />
    </>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });

  if (!product) return {};

  const url = `/collections/${product.slug}`;
  const image = product.images[0] ? `${SITE_URL}${product.images[0]}` : undefined;

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: product.name,
      description: product.description,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: image ? [image] : undefined,
    },
  };
}
