"use client";

import { Star, StarHalf } from "lucide-react";

type Props = {
  rating: number;
};

export default function StarRating({ rating }: Props) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = Math.max(
    0,
    5 - fullStars - (hasHalfStar ? 1 : 0)
  );

  return (
    <div className="flex items-center gap-1">

      {/* Stars */}

      <div className="flex items-center gap-0.5">

        {Array.from({ length: fullStars }).map((_, index) => (
          <Star
            key={`full-${index}`}
            size={13}
            strokeWidth={1.8}
            className="fill-[#d4af37] text-[#d4af37]"
          />
        ))}

        {hasHalfStar && (
          <StarHalf
            size={13}
            strokeWidth={1.8}
            className="fill-[#d4af37] text-[#d4af37]"
          />
        )}

        {Array.from({ length: emptyStars }).map((_, index) => (
          <Star
            key={`empty-${index}`}
            size={13}
            strokeWidth={1.8}
            className="text-gray-600"
          />
        ))}

      </div>

      {/* Rating */}

      <span className="ml-1 text-[12px] font-medium text-gray-400">
        {rating.toFixed(1)}
      </span>

    </div>
  );
}