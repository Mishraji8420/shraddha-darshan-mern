"use client";

import { HTMLAttributes } from "react";

interface SectionContainerProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export default function SectionContainer({
  children,
  className = "",
  ...props
}: SectionContainerProps) {
  return (
    <section
      {...props}
      className={`relative bg-[#050505] py-20 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}