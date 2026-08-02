"use client";

import { ArrowRight } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

interface PrimaryButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  showArrow?: boolean;
}

export default function PrimaryButton({
  children,
  showArrow = true,
  className = "",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      {...props}
      className={`
        btn-primary
        group
        inline-flex
        h-11
        items-center
        justify-center
        gap-2
        rounded-full
        border
        border-[#d4af37]
        bg-[#d4af37]
        px-6
        text-[13px]
        font-medium
        tracking-[0.2px]
        text-black
        transition-all
        duration-300
        hover:-translate-y-[2px]
        hover:bg-[#dfbc48]
        hover:shadow-[0_10px_30px_rgba(212,175,55,.28)]
        active:scale-95
        ${className}
      `}
    >
      <span>{children}</span>

      {showArrow && (
        <ArrowRight
          size={15}
          strokeWidth={2}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      )}
    </button>
  );
}