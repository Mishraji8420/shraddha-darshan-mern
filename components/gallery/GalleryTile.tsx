"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { GalleryItem, GalleryTileSize } from "@/data/gallery";

interface GalleryTileProps {
  item: GalleryItem;
}

// Bento sizing — mobile stays single-column (no span classes needed),
// spans only kick in from the tablet breakpoint upward.
const sizeClasses: Record<GalleryTileSize, string> = {
  large: "sm:col-span-2 sm:row-span-2",
  wide: "sm:col-span-2",
  tall: "sm:row-span-2",
  normal: "",
};

export default function GalleryTile({ item }: GalleryTileProps) {
  const content = (
    <div className="group relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-[#101010]">
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
      />

      {/* Bottom gradient for caption legibility */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

      {/* Shimmer sweep — same treatment as ProductCard */}
      <div
        className="pointer-events-none absolute inset-0 -translate-x-full opacity-0 transition-all duration-700 ease-out group-hover:translate-x-full group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(115deg, transparent 42%, rgba(212,175,55,0.3) 50%, transparent 58%)",
        }}
      />

      {/* Corner brackets */}
      <span className="pointer-events-none absolute left-3 top-3 h-5 w-5 border-l-2 border-t-2 border-yellow-400 opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 transform-[translate(-4px,-4px)] group-hover:transform-[translate(0,0)]" />
      <span className="pointer-events-none absolute right-3 top-3 h-5 w-5 border-r-2 border-t-2 border-yellow-400 opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 transform-[translate(4px,-4px)] group-hover:transform-[translate(0,0)]" />
      <span className="pointer-events-none absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-yellow-400 opacity-0 transition-all duration-500 ease-out delay-75 group-hover:opacity-100 transform-[translate(-4px,4px)] group-hover:transform-[translate(0,0)]" />
      <span className="pointer-events-none absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-yellow-400 opacity-0 transition-all duration-500 ease-out delay-75 group-hover:opacity-100 transform-[translate(4px,4px)] group-hover:transform-[translate(0,0)]" />

      {/* Caption */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
        <p className="small-text max-w-[80%] text-white/90">{item.alt}</p>

        {item.productSlug && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-yellow-400/40 bg-black/50 text-yellow-400 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <ArrowUpRight size={15} />
          </span>
        )}
      </div>
    </div>
  );

  if (item.productSlug) {
    return (
      <Link
        href={`/collections/${item.productSlug}`}
        className={`relative block ${sizeClasses[item.size]}`}
        aria-label={`View product — ${item.alt}`}
      >
        {content}
      </Link>
    );
  }

  return <div className={`relative ${sizeClasses[item.size]}`}>{content}</div>;
}