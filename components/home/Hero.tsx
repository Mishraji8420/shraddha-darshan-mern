"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import PrimaryButton from "../common/PrimaryButton";

type Slide = {
  id: string;
  badge: string;
  heading: string;
  headingAccent: string;
  subtext: string;
  image: string;
};

const slides: Slide[] = [
  {
    id: "bala_ji",
    badge: "Featured Piece",
    heading: "Bring Divinity",
    headingAccent: "Into Every Home",
    subtext:
      "Discover handcrafted silver idols, premium décor, spiritual gifting collections and timeless masterpieces designed to bring elegance, prosperity and devotion into every sacred space.",
    image: "/img/hero/bala_ji.webp",
  },
  {
    id: "diya_turtle",
    badge: "Vastu Favourite",
    heading: "Stability &",
    headingAccent: "Prosperity Within",
    subtext:
      "Our silver Kachua diya blends timeless Vastu symbolism with everyday ritual — a graceful reminder of balance, stability and abundance in your home.",
    image: "/img/hero/diya_turtle.webp",
  },
  {
    id: "ram_bhakth",
    badge: "Strength & Devotion",
    heading: "Courage That",
    headingAccent: "Guards Your Home",
    subtext:
      "This finely-detailed silver Hanuman idol embodies unwavering devotion and protection — a powerful presence for your home temple and daily prayers.",
    image: "/img/hero/ram_bhakth.webp",
  },
  {
    id: "shankh",
    badge: "Sacred Ritual",
    heading: "The Sound Of",
    headingAccent: "Purity & Grace",
    subtext:
      "Hand-engraved with Lord Ganesha, this silver-gold conch brings auspicious beginnings to every pooja, wedding and festive celebration.",
    image: "/img/hero/shankh.webp",
  },
  {
    id: "swan",
    badge: "Symbol Of Grace",
    heading: "Love, Carved In",
    headingAccent: "Silver Forever",
    subtext:
      "A pair of silver swans entwined in a heart — an elegant gesture of love, unity and grace for anniversaries, weddings and cherished occasions.",
    image: "/img/hero/Swan.webp",
  },
];

const stats = [
  { value: "50+", label: "Premium Products" },
  { value: "100+", label: "Trusted Dealers" },
  { value: "999+", label: "Purity Grade" },
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const goTo = (i: number) => setIndex(i);
  const goPrev = () =>
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  const goNext = () => setIndex((prev) => (prev + 1) % slides.length);

  const slide = slides[index];

  return (
    <section
      className="relative overflow-hidden bg-[#050505] pb-10 pt-6 sm:pb-14 sm:pt-8 lg:pb-20 lg:pt-14"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Gold Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(212,175,55,.10),transparent_35%),radial-gradient(circle_at_85%_65%,rgba(212,175,55,.07),transparent_40%)]" />

      <div className="relative mx-auto max-w-400">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-6">
          {/* TEXT */}
          <div className="relative z-10 order-2 px-6 sm:px-10 lg:order-1 lg:pl-12 xl:pl-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-135"
              >
                <span className="badge-text text-yellow-400">
                  {slide.badge}
                </span>

                <h1 className="font-serif mt-4 text-[32px] leading-[1.15] text-white sm:text-[42px] lg:text-[50px]">
                  {slide.heading}
                  <br />
                  <span className="text-yellow-300">
                    {slide.headingAccent}
                  </span>
                </h1>

                <div className="mt-5 h-0.5 w-16 bg-linear-to-r from-yellow-400 to-transparent" />

                <p className="body-text mt-6 max-w-115">
                  {slide.subtext}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/collections">
                    <PrimaryButton className="h-11 px-6">
                      Explore Collection
                    </PrimaryButton>
                  </Link>

                  <button className="btn-secondary h-11 px-6">
                    Become Dealer
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Stats strip */}
            <div className="mt-10 flex max-w-115 items-center gap-6 border-t border-white/10 pt-6 sm:mt-12 sm:gap-8">
              {stats.map((item, i) => (
                <div key={item.label} className="flex items-center gap-6 sm:gap-8">
                  <div>
                    <h3 className="card-title text-yellow-400">
                      {item.value}
                    </h3>
                    <p className="small-text mt-1">{item.label}</p>
                  </div>

                  {i < stats.length - 1 && (
                    <span className="h-8 w-px bg-white/10" />
                  )}
                </div>
              ))}
            </div>

            {/* Dots (mobile/tablet inline) */}
            <div className="mt-8 flex items-center gap-2 lg:hidden">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-0.75 rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-8 bg-yellow-400"
                      : "w-4 bg-white/25 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* IMAGE */}
          <div className="relative order-1 h-72 px-6 sm:h-96 sm:px-10 lg:order-2 lg:h-115 lg:w-125 lg:max-w-125 lg:mr-auto lg:px-0 xl:h-125 xl:w-135 xl:max-w-135">
            <div className="absolute bottom-0 right-[15%] h-50 w-50 rounded-full bg-yellow-400/12 blur-[80px] sm:h-70 sm:w-70 lg:h-95 lg:w-95 lg:blur-[130px]" />

            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0 overflow-hidden rounded-[22px] ring-1 ring-white/10 sm:rounded-[28px]"
              >
                <Image
                  src={slide.image}
                  alt={`${slide.heading} ${slide.headingAccent}`}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-cover"
                />

                {/* Unifying dark gradient so every photo blends with the brand's dark theme */}
                <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/0 to-black/25" />
                <div className="absolute inset-0 bg-linear-to-r from-black/35 via-transparent to-transparent lg:from-black/25" />
              </motion.div>
            </AnimatePresence>

            {/* Arrows (desktop only) */}
            <button
              onClick={goPrev}
              aria-label="Previous slide"
              className="absolute left-8 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 p-2 text-white backdrop-blur transition hover:border-yellow-400/60 hover:text-yellow-400 lg:flex"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={goNext}
              aria-label="Next slide"
              className="absolute right-14 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 p-2 text-white backdrop-blur transition hover:border-yellow-400/60 hover:text-yellow-400 lg:flex"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Dots (desktop, pinned under text column) */}
        <div className="mt-8 hidden items-center gap-2 lg:flex lg:pl-8 xl:pl-12">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-0.75 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-8 bg-yellow-400"
                  : "w-4 bg-white/25 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}