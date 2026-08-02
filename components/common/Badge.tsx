"use client";

import { CheckCircle2 } from "lucide-react";

interface BadgeProps {
  text: string;
}

export default function Badge({ text }: BadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-sm font-medium text-yellow-300 backdrop-blur-md">
      <CheckCircle2 size={16} />
      <span>{text}</span>
    </div>
  );
}