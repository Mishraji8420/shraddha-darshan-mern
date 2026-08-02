"use client";

import { HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function GlassCard({
  children,
  className = "",
  ...props
}: GlassCardProps) {
  return (
    <div
      {...props}
      className={`
        card
        group
        relative
        flex
        h-full
        flex-col
        overflow-hidden
        ${className}
      `}
    >
      {/* Top Accent */}

      <div className="absolute left-0 top-0 h-[2px] w-0 bg-yellow-400 transition-all duration-500 group-hover:w-full" />

      {/* Glow */}

      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">

        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-yellow-400/6 blur-3xl" />

        <div className="absolute -left-16 bottom-0 h-32 w-32 rounded-full bg-yellow-400/5 blur-3xl" />

      </div>

      {/* Border Glow */}

      <div className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-transparent transition-all duration-500 group-hover:ring-yellow-400/20" />

      {/* Content */}

      <div className="relative z-10 flex flex-1 flex-col p-6 lg:p-7">

        {children}

      </div>

    </div>
  );
}