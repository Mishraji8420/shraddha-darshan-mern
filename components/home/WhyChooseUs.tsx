"use client";

import {
  BadgeCheck,
  PackageCheck,
  Gift,
  Handshake,
} from "lucide-react";

import SectionContainer from "../common/SectionContainer";
import SectionTitle from "../common/SectionTitle";
import GlassCard from "../common/GlassCard";

const features = [
  {
    icon: BadgeCheck,
    title: "BIS Hallmarked",
    description:
      "Authentic certified silver craftsmanship with premium finishing.",
  },
  {
    icon: PackageCheck,
    title: "PAN India Delivery",
    description:
      "Fast, insured shipping with secure premium packaging.",
  },
  {
    icon: Gift,
    title: "Luxury Packaging",
    description:
      "Elegant gift-ready presentation with every order.",
  },
  {
    icon: Handshake,
    title: "Wholesale Support",
    description:
      "Dedicated assistance for dealers and bulk partners.",
  },
];

export default function WhyChooseUs() {
  return (
    <SectionContainer className="pt-6! pb-20 sm:pt-8! sm:pb-24 lg:pb-28">
      <div className="radius-lg border border-white/10 bg-[#0f0f0f] p-4 sm:p-6 lg:p-10">
        <SectionTitle
          badge="WHY CHOOSE US"
          title="Premium Quality You Can Trust"
          subtitle="Every masterpiece is crafted with devotion, precision and timeless elegance."
        />

        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <GlassCard
                key={index}
                className="text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-yellow-400/20 bg-yellow-400/10 text-yellow-400 transition-all duration-300 group-hover:bg-yellow-400 group-hover:text-black sm:h-14 sm:w-14">
                  <Icon
                    size={22}
                    strokeWidth={2}
                  />
                </div>

                <h3 className="card-title mt-5 text-white">
                  {item.title}
                </h3>

                <p className="body-text mt-3">
                  {item.description}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </SectionContainer>
  );
}