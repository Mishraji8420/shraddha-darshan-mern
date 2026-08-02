"use client";

import Image from "next/image";
import { Sparkle } from "lucide-react";

import SectionContainer from "../common/SectionContainer";
import SectionTitle from "../common/SectionTitle";
import GlassCard from "../common/GlassCard";
import PrimaryButton from "../common/PrimaryButton";

const categories = [
  { title: "Elephant", image: "/img/categories/elephant.png" },
  { title: "Kamdhenu", image: "/img/categories/cow.png" },
  { title: "Fish", image: "/img/categories/fish.png" },
  { title: "Spiritual Decor", image: "/img/categories/decor.png" },
  { title: "Gift Collection", image: "/img/categories/gift.png" },
  { title: "Home Decor", image: "/img/categories/home.png" },
];

export default function Categories() {
  return (
    <SectionContainer className="!pt-6 pb-20 sm:!pt-8 sm:pb-24 lg:pb-28">
      <div className="radius-lg border border-white/10 bg-[#0f0f0f] p-4 sm:p-6 lg:p-10">
        <SectionTitle
          badge="OUR COLLECTION"
          title="Shop by Category"
          subtitle="Explore handcrafted silver décor, gifting collections and spiritual masterpieces."
        />

        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((item) => (
            <GlassCard
              key={item.title}
              className="group h-full"
            >
              <div className="relative overflow-hidden radius-md bg-[#141414]">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={600}
                  height={600}
                  className="h-[220px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 sm:h-[250px] lg:h-[280px]"
                />

                <div
                  className="pointer-events-none absolute inset-0 -translate-x-full opacity-0 transition-all duration-700 ease-out group-hover:translate-x-full group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(115deg, transparent 40%, rgba(212,175,55,0.35) 50%, transparent 60%)",
                  }}
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <Sparkle
                  className="absolute left-[20%] top-[22%] h-4 w-4 text-yellow-300 opacity-0 animate-twinkle"
                  style={{ animationDelay: "0s" }}
                  fill="currentColor"
                />
                <Sparkle
                  className="absolute right-[18%] top-[38%] h-3 w-3 text-yellow-200 opacity-0 animate-twinkle"
                  style={{ animationDelay: "0.4s" }}
                  fill="currentColor"
                />
                <Sparkle
                  className="absolute bottom-[25%] left-[45%] h-3.5 w-3.5 text-yellow-300 opacity-0 animate-twinkle"
                  style={{ animationDelay: "0.8s" }}
                  fill="currentColor"
                />
              </div>

              <div className="mt-5 flex flex-1 flex-col sm:mt-6">
                <h3 className="card-title text-white">
                  {item.title}
                </h3>

                <p className="body-text mt-3">
                  Premium handcrafted silver collection designed to bring elegance and timeless spirituality into every home.
                </p>

                <PrimaryButton
                  className="mt-6 w-full sm:w-fit"
                  showArrow={false}
                >
                  Explore
                </PrimaryButton>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}