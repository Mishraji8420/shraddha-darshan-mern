"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Truck, ShieldCheck, Gift, X } from "lucide-react";

const messages = [
  { icon: Truck, text: "Free PAN-India shipping on all prepaid orders" },
  { icon: ShieldCheck, text: "999 Silver Purity — Certified Craftsmanship" },
  { icon: Gift, text: "Wholesale dealer? WhatsApp us for special pricing" },
];

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [visible]);

  if (!visible) return null;

  const Current = messages[index];
  const Icon = Current.icon;

  return (
    <div className="relative flex h-9 items-center justify-center overflow-hidden border-b border-white/10 bg-[#0c0c0c] px-10 text-center text-[12px] font-medium text-gray-300 sm:h-10 sm:text-[13px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35 }}
          className="flex items-center gap-2"
        >
          <Icon size={13} className="shrink-0 text-yellow-400" />
          <span className="truncate">{Current.text}</span>
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Close announcement bar"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-yellow-400"
      >
        <X size={15} />
      </button>
    </div>
  );
}
