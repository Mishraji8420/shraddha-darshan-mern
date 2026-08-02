"use client";

interface ProductBadgeProps {
  badge: string;
}

const styles: Record<string, string> = {
  "Best Seller":
    "bg-[#d4af37] text-black border-[#d4af37]",
  Premium:
    "bg-[#111111] text-yellow-400 border-yellow-400/40",
  Trending:
    "bg-[#111111] text-blue-400 border-blue-400/40",
  Popular:
    "bg-[#111111] text-orange-400 border-orange-400/40",
  Limited:
    "bg-[#111111] text-red-400 border-red-400/40",
  Exclusive:
    "bg-[#111111] text-violet-400 border-violet-400/40",
  Luxury:
    "bg-[#111111] text-purple-400 border-purple-400/40",
  New:
    "bg-[#111111] text-emerald-400 border-emerald-400/40",
};

export default function ProductBadge({
  badge,
}: ProductBadgeProps) {
  return (
    <span
      className={`
        absolute
        left-4
        top-4
        z-20
        rounded-full
        border
        px-3
        py-1.5
        text-[11px]
        font-semibold
        uppercase
        tracking-[1.5px]
        backdrop-blur-md
        ${
          styles[badge] ||
          "bg-[#d4af37] text-black border-[#d4af37]"
        }
      `}
    >
      {badge}
    </span>
  );
}