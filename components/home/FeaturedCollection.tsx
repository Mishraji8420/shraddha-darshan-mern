"use client";

import Image from "next/image";
import PrimaryButton from "../common/PrimaryButton";
import SectionContainer from "../common/SectionContainer";

export default function FeaturedCollection() {
  return (
    <SectionContainer className="!pt-6 pb-20 sm:!pt-8 sm:pb-24 lg:pb-28">
      <div className="radius-lg relative overflow-hidden border border-white/10 bg-[#101010]">
        {/* Soft Glow */}
        <div className="absolute -left-24 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-yellow-400/10 blur-[100px] sm:h-72 sm:w-72 sm:blur-[140px]" />
        <div className="absolute -right-24 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-yellow-400/10 blur-[100px] sm:h-72 sm:w-72 sm:blur-[140px]" />

        <div className="relative grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
          {/* LEFT */}
          <div className="order-2 p-5 text-center sm:p-8 lg:order-1 lg:p-14 lg:text-left">
            <span className="badge-text inline-flex rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-yellow-400">
              FEATURED COLLECTION
            </span>

            <h2 className="section-title mt-6 text-white">
              Luxury Spiritual
              <br />
              Collection
            </h2>

            <p className="body-text mx-auto mt-5 max-w-lg lg:mx-0">
              Experience timeless elegance with handcrafted silver masterpieces
              designed to bring devotion, prosperity and luxury into every home.
            </p>

            <div className="mt-8">
              <PrimaryButton>
                Explore Collection
              </PrimaryButton>
            </div>
          </div>

          {/* RIGHT */}
          <div className="order-1 relative flex items-center justify-center p-6 sm:p-8 lg:order-2 lg:p-12">
            <div className="absolute h-[220px] w-[220px] rounded-full bg-yellow-400/12 blur-[80px] sm:h-[320px] sm:w-[320px] sm:blur-[110px] lg:h-[380px] lg:w-[380px] lg:blur-[120px]" />

            <Image
              src="/img/featured/featured-collection.png"
              alt="Featured Collection"
              width={520}
              height={520}
              priority
              className="relative z-10 w-[220px] object-contain transition duration-500 hover:scale-105 sm:w-[300px] lg:w-[450px]"
            />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}