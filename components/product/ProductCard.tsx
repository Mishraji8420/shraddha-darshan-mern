"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, ShoppingCart, Check } from "lucide-react";

import { Product } from "../../types/products";
import GlassCard from "../common/GlassCard";
import ProductBadge from "./ProductBadge";
import StarRating from "../common/StarRating";
import PrimaryButton from "../common/PrimaryButton";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [justAdded, setJustAdded] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const productHref = `/collections/${product.slug}`;

  const handleAddToCart = () => {
    addToCart(product);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1500);
  };

  const handleWishlistClick = (event: React.MouseEvent) => {
    // Prevent the parent <Link> (product image) from navigating
    // when the wishlist heart itself is clicked.
    event.preventDefault();
    event.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <GlassCard className="group">
      {/* Product Image */}
      <Link
        href={productHref}
        className="relative block overflow-hidden rounded-t-[20px] bg-[#111111]"
      >
        <ProductBadge badge={product.badge} />

        <Image
          src={product.image}
          alt={product.name}
          width={700}
          height={700}
          className="h-[300px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Shimmer sweep */}
        <div
          className="pointer-events-none absolute inset-0 -translate-x-full opacity-0 transition-all duration-700 ease-out group-hover:translate-x-full group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(115deg, transparent 42%, rgba(212,175,55,0.3) 50%, transparent 58%)",
          }}
        />

        {/* Corner frame brackets - premium "focus" reveal */}
        <span className="pointer-events-none absolute left-3 top-3 h-5 w-5 border-l-2 border-t-2 border-yellow-400 opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 [transform:translate(-4px,-4px)] group-hover:[transform:translate(0,0)]" />
        <span className="pointer-events-none absolute right-3 top-3 h-5 w-5 border-r-2 border-t-2 border-yellow-400 opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 [transform:translate(4px,-4px)] group-hover:[transform:translate(0,0)]" />
        <span className="pointer-events-none absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-yellow-400 opacity-0 transition-all duration-500 ease-out delay-75 group-hover:opacity-100 [transform:translate(-4px,4px)] group-hover:[transform:translate(0,0)]" />
        <span className="pointer-events-none absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-yellow-400 opacity-0 transition-all duration-500 ease-out delay-75 group-hover:opacity-100 [transform:translate(4px,4px)] group-hover:[transform:translate(0,0)]" />

        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={
            wishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={wishlisted}
          className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 ${
            wishlisted
              ? "border-yellow-400 bg-yellow-400 text-black"
              : "border-white/10 bg-black/55 text-white hover:border-yellow-400 hover:bg-yellow-400 hover:text-black"
          }`}
        >
          <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
        </button>

        <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-white/10 bg-[#151515]/95 px-5 py-2 text-[13px] font-medium text-white opacity-0 backdrop-blur-lg transition-all duration-300 group-hover:opacity-100">
          <Eye size={15} />
          Quick View
        </span>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <StarRating rating={product.rating} />

        <Link href={productHref} className="mt-4 block">
          <h3 className="product-title line-clamp-2 text-white transition-colors duration-300 hover:text-yellow-400">
            {product.name}
          </h3>
        </Link>

        <div className="mt-4 flex items-end gap-3">
          <span className="price">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          <span className="old-price">
            ₹{product.oldPrice.toLocaleString("en-IN")}
          </span>
        </div>

        <PrimaryButton
          type="button"
          onClick={handleAddToCart}
          showArrow={false}
          className="mt-auto w-full justify-center"
        >
          {justAdded ? (
            <>
              <Check size={16} />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              Add to Cart
            </>
          )}
        </PrimaryButton>
      </div>
    </GlassCard>
  );
}
