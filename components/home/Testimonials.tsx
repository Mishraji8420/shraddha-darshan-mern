"use client";

import { CheckCircle } from "lucide-react";

import SectionContainer from "../common/SectionContainer";
import SectionTitle from "../common/SectionTitle";
import GlassCard from "../common/GlassCard";
import StarRating from "../common/StarRating";

const testimonials = [
  {
    name: "Amit Sharma",
    city: "Delhi",
    rating: 5,
    review:
      "Outstanding craftsmanship. The silver finish is exceptional and the premium packaging exceeded my expectations.",
  },
  {
    name: "Priya Verma",
    city: "Mumbai",
    rating: 4.5,
    review:
      "Beautiful product with elegant finishing. Exactly as shown in the pictures. Perfect for gifting.",
  },
  {
    name: "Rahul Singh",
    city: "Lucknow",
    rating: 5,
    review:
      "Excellent quality with luxurious finishing. Safe packaging and quick delivery made the purchase worthwhile.",
  },
  {
    name: "Neha Gupta",
    city: "Jaipur",
    rating: 5,
    review:
      "Amazing craftsmanship and premium look. It adds a beautiful spiritual touch to our living room.",
  },
  {
    name: "Vikram Mehta",
    city: "Ahmedabad",
    rating: 4.5,
    review:
      "Very satisfied with the quality and finishing. One of the finest silver décor pieces I have purchased.",
  },
  {
    name: "Sneha Kapoor",
    city: "Bengaluru",
    rating: 5,
    review:
      "Luxury packaging, premium quality and excellent customer support. Definitely recommended for gifting.",
  },
];

export default function Testimonials() {
  return (
    <SectionContainer className="pt-6! pb-20 sm:pt-8! sm:pb-24 lg:pb-28">
      <div className="radius-lg border border-white/10 bg-[#0f0f0f] p-4 sm:p-6 lg:p-10">
        <SectionTitle
          badge="TESTIMONIALS"
          title="Loved Across India"
          subtitle="Trusted by thousands of happy customers across India."
        />

        <div className="mt-8 grid gap-5 sm:mt-10 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((item) => (
            <GlassCard key={item.name}>
              <StarRating rating={item.rating} />

              <p className="body-text mt-5 flex-1 italic">
                “{item.review}”
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5 sm:gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-sm font-bold text-black sm:h-12 sm:w-12">
                  {item.name.charAt(0)}
                </div>

                <div className="min-w-0">
                  <h4 className="truncate text-[15px] font-semibold text-white sm:text-[16px]">
                    {item.name}
                  </h4>

                  <div className="mt-1 flex items-center gap-2">
                    <CheckCircle
                      size={14}
                      className="shrink-0 text-green-500"
                    />

                    <span className="truncate text-[11px] text-gray-400 sm:text-[12px]">
                      Verified Customer • {item.city}
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}