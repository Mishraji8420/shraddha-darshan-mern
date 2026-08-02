"use client";

import Link from "next/link";
import { Phone, ShieldCheck, Truck, Gift, ArrowRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import GlassCard from "../common/GlassCard";
import SectionContainer from "../common/SectionContainer";

export default function DealerCTA() {
  return (
    <SectionContainer className="pt-6! pb-20 sm:pt-8! sm:pb-24 lg:pb-28">
      <div className="radius-lg relative overflow-hidden border border-white/10 bg-[#101010]">
        {/* Glow */}
        <div className="absolute -left-24 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-yellow-400/10 blur-[100px] sm:h-72 sm:w-72 sm:blur-[140px]" />
        <div className="absolute -right-24 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-yellow-400/10 blur-[100px] sm:h-72 sm:w-72 sm:blur-[140px]" />

        <div className="relative grid gap-8 lg:grid-cols-2 lg:gap-10">
          {/* LEFT */}
          <div className="p-5 text-center sm:p-8 lg:p-14 lg:text-left">
            <span className="badge-text inline-flex rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-yellow-400">
              WHOLESALE PROGRAM
            </span>

            <h2 className="section-title mt-6 text-white">
              Become Our
              <br />
              Authorized Dealer
            </h2>

            <p className="body-text mx-auto mt-5 max-w-lg lg:mx-0">
              Partner with Shraddha Darshan and grow your business with premium handcrafted silver collections, exclusive wholesale pricing and dedicated dealer support.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <a
                href="https://wa.me/919310399728?text=Hi!%20I'm%20interested%20in%20your%20products.%20Can%20you%20help%20me%3F"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                <FaWhatsapp size={18} />
                WhatsApp
              </a>

              <a
                href="tel:+919310399728"
                className="btn-secondary inline-flex items-center justify-center gap-2"
              >
                <Phone size={17} />
                Call Now
              </a>
            </div>

            <Link
              href="/wholesale"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-yellow-400 transition hover:text-yellow-300"
            >
              View full wholesale details
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* RIGHT */}
          <div className="grid gap-5 p-5 sm:p-8 lg:p-10">
            <GlassCard>
              <ShieldCheck
                size={24}
                className="text-yellow-400"
              />

              <h3 className="card-title mt-4 text-white">
                BIS Hallmarked Silver
              </h3>

              <p className="body-text mt-2">
                Certified premium handcrafted silver products.
              </p>
            </GlassCard>

            <GlassCard>
              <Truck
                size={24}
                className="text-yellow-400"
              />

              <h3 className="card-title mt-4 text-white">
                PAN India Supply
              </h3>

              <p className="body-text mt-2">
                Fast delivery with secure packaging nationwide.
              </p>
            </GlassCard>

            <GlassCard>
              <Gift
                size={24}
                className="text-yellow-400"
              />

              <h3 className="card-title mt-4 text-white">
                Bulk Orders
              </h3>

              <p className="body-text mt-2">
                Best pricing for retailers, distributors and gifting partners.
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}