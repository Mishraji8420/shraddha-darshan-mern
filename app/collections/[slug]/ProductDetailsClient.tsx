"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Heart,
  Check,
  Share2,
  Minus,
  Plus,
  Truck,
  RefreshCw,
  Gift,
  BadgeCheck,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Wallet,
  Compass,
  Home as HomeIcon,
  type LucideIcon,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import type { Product } from "@/types/products";

const sizes = ["4 Inch", "6 Inch", "8 Inch"];

type Tag = { icon: LucideIcon; label: string };
const tags: Tag[] = [
  { icon: Compass, label: "Vastu" },
  { icon: Gift, label: "Gifting" },
  { icon: HomeIcon, label: "Home Decor" },
];

type TrustItem = { icon: LucideIcon; title: string };
const trustItems: TrustItem[] = [
  { icon: Truck, title: "Free Shipping" },
  { icon: RefreshCw, title: "Easy Returns" },
  { icon: Gift, title: "Premium Gift Box" },
];

type PromiseCard = { image: string; badge: string; title: string; body: string };

function getPromiseCards(productImage: string): PromiseCard[] {
  return [
    {
      image: productImage,
      badge: "Artisan Craftsmanship",
      title: "Artisan Craftsmanship",
      body: "Each piece is hand-finished by skilled artisans with 20+ years of experience in silver plating.",
    },
    {
      image: productImage,
      badge: "999 Silver Purity",
      title: "999 Silver Purity",
      body: "We use only 999 grade silver to ensure the highest purity standard for lasting brilliance.",
    },
    {
      image: productImage,
      badge: "Trusted Quality",
      title: "Trusted Quality",
      body: "Every piece undergoes strict quality checks to ensure durability, shine and perfection in every detail.",
    },
    {
      image: productImage,
      badge: "Premium Velvet Box",
      title: "Safe Packaging",
      body: "Your product is securely packed with premium materials so it reaches you safely, without damage.",
    },
  ];
}

// NOTE: rating breakdown + written reviews below are still illustrative
// placeholders, same as before this migration — a real Review model
// already exists in prisma/schema.prisma, wiring it up is Phase 5.
// Left untouched here to keep this pass scoped to product data + images.
const ratingBreakdown = [
  { stars: 5, count: 97 },
  { stars: 4, count: 3 },
  { stars: 3, count: 2 },
  { stars: 2, count: 0 },
  { stars: 1, count: 0 },
];
const totalReviews = ratingBreakdown.reduce((sum, r) => sum + r.count, 0);

const reviews = [
  { name: "Sudha Bhardwaj", title: "Quality", body: "Very pretty. As described.", date: "21/06/26" },
  { name: "Sourabh", title: "Beautiful piece", body: "Looks even better in person. Great finish and packaging.", date: "31/05/26" },
];

interface ProductDetailsClientProps {
  product: Product;
  images: string[];
  description: string;
  relatedProducts: Product[];
}

export default function ProductDetailsClient({
  product,
  images: dbImages,
  description,
  relatedProducts,
}: ProductDetailsClientProps) {
  // Guard against a product with no images at all (shouldn't happen once
  // seeded correctly, but keeps the gallery from crashing if it does).
  const images = dbImages.length > 0 ? dbImages : [product.image];
  const promiseCards = getPromiseCards(images[0]);

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [qty, setQty] = useState(1);
  const [descOpen, setDescOpen] = useState(true);
  const [shippingOpen, setShippingOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    router.push("/cart");
  };

  return (
    <main className="min-h-screen bg-white pb-28 text-[#151A33] md:pb-0">
      {/* ============ PART 1 — PRODUCT DETAILS ============ */}
      <section className="bg-white pb-16 pt-10">
        <div className="mx-auto max-w-7xl px-4">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-1.5 text-sm text-[#6B7280]">
            <Link href="/" className="hover:text-[#151A33]">
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="text-[#151A33]">{product.name}</span>
          </div>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            {/* LEFT — Gallery */}
            <div>
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[#EEF0F4] bg-[#FAFAFB]">
                <Image
                  src={selectedImage}
                  alt={product.name}
                  width={800}
                  height={800}
                  priority
                  className="h-full w-full object-contain p-8"
                />
              </div>

              {images.length > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                  {images.map((img) => (
                    <button
                      key={img}
                      onClick={() => setSelectedImage(img)}
                      aria-label="Select image"
                      className={`h-2 w-2 rounded-full transition ${
                        selectedImage === img ? "bg-[#151A33]" : "bg-[#D8DCE3]"
                      }`}
                    />
                  ))}
                </div>
              )}

              {images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {images.map((img) => (
                    <button
                      key={img}
                      onClick={() => setSelectedImage(img)}
                      className={`overflow-hidden rounded-xl border transition ${
                        selectedImage === img
                          ? "border-[#151A33]"
                          : "border-[#EEF0F4] hover:border-[#C7CCD6]"
                      }`}
                    >
                      <div className="relative aspect-square bg-[#FAFAFB]">
                        <Image src={img} alt="" fill className="object-cover" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT — Details */}
            <div>
              <div className="flex flex-wrap gap-2">
                {tags.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#EEF0F4] bg-[#FAFAFB] px-3 py-1.5 text-xs font-medium text-[#4A5063]"
                  >
                    <Icon size={13} />
                    {label}
                  </span>
                ))}
              </div>

              <h1 className="mt-4 text-[1.75rem] font-bold leading-snug text-[#151A33] sm:text-3xl">
                {product.name}
              </h1>

              <div className="mt-3 flex items-center gap-2">
                <div className="flex text-[#F4B400]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < Math.round(product.rating) ? "currentColor" : "none"}
                      strokeWidth={i < Math.round(product.rating) ? 0 : 1.5}
                    />
                  ))}
                </div>
                <span className="text-sm text-[#6B7280]">
                  {product.rating.toFixed(1)} ({product.reviews} reviews)
                </span>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <span className="text-3xl font-bold text-[#151A33]">₹{product.price}</span>
                <span className="text-lg text-[#9AA0AC] line-through">₹{product.oldPrice}</span>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#E8F7EE] px-4 py-3 text-sm text-[#1F7A4D]">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#1F7A4D]" />
                5% extra off on prepaid orders (UPI / Cards / Net Banking)
              </div>

              <div className="mt-6">
                <p className="text-sm text-[#4A5063]">
                  Size: <span className="font-semibold text-[#151A33]">{selectedSize}</span>
                </p>
                <div className="mt-2 flex gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                        selectedSize === size
                          ? "border-[#151A33] text-[#151A33]"
                          : "border-[#EEF0F4] text-[#6B7280] hover:border-[#C7CCD6]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <div className="flex items-center rounded-lg border border-[#EEF0F4]">
                  <button
                    onClick={() => qty > 1 && setQty(qty - 1)}
                    className="px-3.5 py-2.5 text-[#4A5063] transition hover:bg-[#FAFAFB]"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={15} />
                  </button>
                  <div className="w-9 text-center text-sm font-medium">{qty}</div>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="px-3.5 py-2.5 text-[#4A5063] transition hover:bg-[#FAFAFB]"
                    aria-label="Increase quantity"
                  >
                    <Plus size={15} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#F3C9C9] bg-[#FCE7E7] py-3 text-sm font-semibold text-[#151A33] transition hover:bg-[#F9D6D6]"
                >
                  {justAdded ? (
                    <>
                      <Check size={16} />
                      Added to Cart
                    </>
                  ) : (
                    "Add to cart"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  aria-label={
                    wishlisted ? "Remove from wishlist" : "Save to wishlist"
                  }
                  aria-pressed={wishlisted}
                  className={`rounded-lg border p-3 transition ${
                    wishlisted
                      ? "border-[#151A33] bg-[#151A33] text-white"
                      : "border-[#EEF0F4] text-[#4A5063] hover:border-[#C7CCD6]"
                  }`}
                >
                  <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
                </button>
                <button
                  aria-label="Share"
                  className="rounded-lg border border-[#EEF0F4] p-3 text-[#4A5063] transition hover:border-[#C7CCD6]"
                >
                  <Share2 size={18} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                className="mt-3 flex w-full items-center justify-center gap-3 rounded-lg bg-[#151A33] py-3.5 text-sm font-semibold text-white transition hover:bg-[#1F2547]"
              >
                Buy It Now
                <span className="flex items-center gap-1 opacity-80">
                  <CreditCard size={15} />
                  <Wallet size={15} />
                </span>
              </button>

              <div className="mt-8 grid grid-cols-3 gap-3">
                {trustItems.map(({ icon: Icon, title }) => (
                  <div key={title} className="flex flex-col items-center text-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#151A33] text-white">
                      <Icon size={18} />
                    </div>
                    <p className="mt-2 text-xs font-medium text-[#4A5063]">{title}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-2 border-t border-[#EEF0F4] pt-6 text-sm text-[#6B7280]">
                <BadgeCheck size={16} className="text-[#151A33]" />
                Authenticity Certificate Included
              </div>

              {/* Accordions */}
              <div className="mt-6 divide-y divide-[#EEF0F4] border-y border-[#EEF0F4]">
                <button
                  onClick={() => setDescOpen((v) => !v)}
                  className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold text-[#151A33]"
                >
                  Description
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${descOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {descOpen && (
                  <p className="pb-4 text-sm leading-6 text-[#6B7280]">
                    {description}
                  </p>
                )}

                <button
                  onClick={() => setShippingOpen((v) => !v)}
                  className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold text-[#151A33]"
                >
                  Shipping &amp; Returns
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${shippingOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {shippingOpen && (
                  <p className="pb-4 text-sm leading-6 text-[#6B7280]">
                    Free shipping across India, dispatched within 24 hours.
                    Easy 7-day returns if the piece arrives damaged or isn&apos;t
                    what you expected.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PART 2 — THE PROMISE (warm cream band) ============ */}
      <section className="bg-[#FBF6ED] py-20">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
            Why shop with us
          </p>
          <h2 className="mt-2 text-center text-2xl font-bold text-[#151A33] sm:text-3xl">
            The Shraddha Darshan Promise
          </h2>
          <p className="mt-2 text-center text-sm text-[#6B7280]">
            Crafted with devotion, delivered with care
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {promiseCards.map((card) => (
              <div
                key={card.title}
                className="overflow-hidden rounded-2xl border border-[#EDE3CE] bg-white"
              >
                <div className="relative aspect-[4/3] bg-[#FAFAFB]">
                  <Image src={card.image} alt="" fill className="object-cover" />
                  <span className="absolute left-3 top-3 rounded-md bg-[#151A33]/85 px-2.5 py-1 text-[11px] font-medium text-white">
                    {card.badge}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-[#151A33]">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-5 text-[#6B7280]">
                    {card.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PART 3 — REVIEWS (soft blush band) ============ */}
      <section className="bg-[#FDF3F1] py-20">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#B4595A]">
            What buyers say
          </p>
          <h2 className="mt-2 text-center text-2xl font-bold text-[#151A33] sm:text-3xl">
            Customer Reviews
          </h2>

          <div className="mt-10 flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-center">
            <div className="text-center">
              <div className="flex justify-center gap-0.5 text-[#F4B400]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="mt-2 text-sm text-[#6B7280]">
                4.93 out of 5 · Based on {totalReviews} reviews
              </p>
            </div>

            <div className="w-full max-w-sm space-y-1.5 rounded-2xl bg-white p-5">
              {ratingBreakdown.map((row) => (
                <div key={row.stars} className="flex items-center gap-3 text-xs">
                  <span className="w-10 shrink-0 text-[#6B7280]">
                    {row.stars} star
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#EEF0F4]">
                    <div
                      className="h-full rounded-full bg-[#151A33]"
                      style={{
                        width: `${totalReviews ? (row.count / totalReviews) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="w-6 text-right text-[#6B7280]">{row.count}</span>
                </div>
              ))}
            </div>

            <button className="rounded-lg bg-[#151A33] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1F2547]">
              Write a review
            </button>
          </div>

          <div className="mx-auto mt-12 max-w-2xl divide-y divide-[#F0DEDB] rounded-2xl bg-white px-6">
            {reviews.map((review) => (
              <div key={review.name} className="py-6">
                <div className="flex items-center justify-between">
                  <div className="flex text-[#F4B400]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <span className="text-xs text-[#9AA0AC]">{review.date}</span>
                </div>
                <p className="mt-3 text-sm font-semibold text-[#151A33]">
                  {review.title}
                </p>
                <p className="mt-1 text-sm text-[#6B7280]">{review.body}</p>
                <p className="mt-2 text-xs font-medium text-[#4A5063]">
                  {review.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PART 4 — RELATED PRODUCTS (white) ============ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6B7280]">
            Complete the set
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[#151A33] sm:text-3xl">
            Related Products
          </h2>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((related) => (
              <Link
                key={related.id}
                href={`/collections/${related.slug}`}
                className="group overflow-hidden rounded-2xl border border-[#EEF0F4] transition hover:border-[#C7CCD6] hover:shadow-sm"
              >
                <div className="relative aspect-square bg-[#FAFAFB]">
                  <Image
                    src={related.image}
                    alt={related.name}
                    fill
                    className="object-contain p-6 transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-[#151A33]">
                    {related.name}
                  </h3>
                  <p className="mt-1 text-sm font-bold text-[#151A33]">
                    ₹{related.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile sticky CTA bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 flex gap-3 border-t border-[#EEF0F4] bg-white p-3 md:hidden">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 rounded-lg border border-[#F3C9C9] bg-[#FCE7E7] py-3 text-sm font-semibold text-[#151A33]"
        >
          {justAdded ? "Added ✓" : "Add to cart"}
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="flex-1 rounded-lg bg-[#151A33] py-3 text-sm font-semibold text-white"
        >
          Buy It Now
        </button>
      </div>
    </main>
  );
}
