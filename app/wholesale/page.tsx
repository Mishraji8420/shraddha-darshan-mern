import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { prisma } from "@/lib/prisma";
import { BUSINESS } from "@/lib/seo";
import { wholesaleIconMap } from "@/lib/wholesale-icon-map";
import SectionContainer from "@/components/common/SectionContainer";
import SectionTitle from "@/components/common/SectionTitle";
import GlassCard from "@/components/common/GlassCard";
import WholesaleEnquiryForm from "@/components/wholesale/WholesaleEnquiryForm";
import {
  AUDIENCE_SEGMENTS,
  MOQ_PER_DESIGN,
  PROCESS_STEPS,
  WHOLESALE_FAQ,
  WHY_PARTNER,
} from "@/constants/wholesale";

// Real content now (was a noindex placeholder before) — indexable, with
// its own title/description like every other real page on the site.
export const metadata: Metadata = {
  title: "Wholesale & Dealer Enquiries",
  description:
    "Become a Shraddha Darshan wholesale partner — handcrafted BIS Hallmarked silver idols, décor and gifting collections for retailers, corporate gifting, temples, event planners and exporters. Pan-India dispatch.",
  alternates: { canonical: "/wholesale" },
};

const whatsappHref =
  "https://wa.me/919310399728?text=Hi!%20I'm%20interested%20in%20wholesale%2Fdealer%20pricing.";

export default async function WholesalePage() {
  // Real categories from the DB — same source of truth as
  // app/categories/page.tsx, so the enquiry form's category checklist
  // never drifts out of sync with what's actually sold.
  const categories = await prisma.category.findMany({
    select: { title: true },
    orderBy: { id: "asc" },
  });
  const categoryTitles = categories.map((c) => c.title);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="border-b border-white/10 px-6 py-16 text-center sm:px-10 sm:py-20 lg:px-16">
        <span className="badge-text inline-flex rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-yellow-400">
          WHOLESALE PROGRAM
        </span>

        <h1 className="section-title mx-auto mt-6 max-w-3xl text-white">
          Become Our Authorized Dealer
        </h1>

        <p className="body-text mx-auto mt-5 max-w-2xl">
          Partner with Shraddha Darshan and grow your business with premium
          handcrafted, BIS Hallmarked silver collections — built for
          retailers, corporate gifting, temples, event planners and
          exporters, with dedicated dealer support.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#enquiry-form"
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            Enquire Now
            <ArrowRight size={15} />
          </a>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center justify-center gap-2"
          >
            <FaWhatsapp size={18} />
            WhatsApp Us
          </a>

          <a
            href={`tel:${BUSINESS.telephone.replace(/\s/g, "")}`}
            className="btn-secondary inline-flex items-center justify-center gap-2"
          >
            <Phone size={17} />
            Call Now
          </a>
        </div>

        <p className="mt-6 text-sm text-gray-500">Home / Wholesale</p>
      </section>

      {/* Who it's for */}
      <SectionContainer className="bg-black!">
        <SectionTitle
          badge="WHO IT'S FOR"
          title="Built for Every Kind of Bulk Buyer"
          subtitle="Whether you run a shop, plan events, or supply temples — we work with you."
        />

        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {AUDIENCE_SEGMENTS.map((segment) => {
            const Icon = wholesaleIconMap[segment.icon];
            return (
              <GlassCard key={segment.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-yellow-400/20 bg-yellow-400/10 text-yellow-400 transition-all duration-300 group-hover:bg-yellow-400 group-hover:text-black sm:h-14 sm:w-14">
                  {Icon && <Icon size={22} strokeWidth={2} />}
                </div>
                <h3 className="card-title mt-5 text-white">{segment.title}</h3>
                <p className="body-text mt-3">{segment.description}</p>
              </GlassCard>
            );
          })}
        </div>
      </SectionContainer>

      {/* Why partner with us */}
      <SectionContainer>
        <SectionTitle
          badge="WHY PARTNER WITH US"
          title="Quality and Support You Can Rely On"
        />

        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
          {WHY_PARTNER.map((item) => {
            const Icon = wholesaleIconMap[item.icon];
            return (
              <GlassCard key={item.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-yellow-400/20 bg-yellow-400/10 text-yellow-400 transition-all duration-300 group-hover:bg-yellow-400 group-hover:text-black sm:h-14 sm:w-14">
                  {Icon && <Icon size={22} strokeWidth={2} />}
                </div>
                <h3 className="card-title mt-5 text-white">{item.title}</h3>
                <p className="body-text mt-3">{item.description}</p>
              </GlassCard>
            );
          })}
        </div>
      </SectionContainer>

      {/* Categories available */}
      {categoryTitles.length > 0 && (
        <SectionContainer className="bg-black!">
          <SectionTitle
            badge="AVAILABLE FOR WHOLESALE"
            title="Categories You Can Stock"
          />
          <div className="flex flex-wrap justify-center gap-3">
            {categoryTitles.map((title) => (
              <Link
                key={title}
                href={`/collections?category=${encodeURIComponent(title)}`}
                className="rounded-full border border-white/10 bg-[#111111] px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:border-yellow-400/40 hover:text-yellow-400"
              >
                {title}
              </Link>
            ))}
          </div>
        </SectionContainer>
      )}

      {/* How it works */}
      <SectionContainer>
        <SectionTitle badge="HOW IT WORKS" title="From Enquiry to Dispatch" />

        <div className="grid grid-cols-1 gap-5 sm:mt-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((step, index) => (
            <GlassCard key={step.title}>
              <span className="badge-text text-yellow-400">
                Step {index + 1}
              </span>
              <h3 className="card-title mt-3 text-white">{step.title}</h3>
              <p className="body-text mt-2">{step.description}</p>
            </GlassCard>
          ))}
        </div>

        <p className="body-text mx-auto mt-8 max-w-2xl text-center">
          Minimum order: <span className="text-yellow-400">{MOQ_PER_DESIGN} pieces per design</span>.
          Mixed-design bulk orders are welcome.
        </p>
      </SectionContainer>

      {/* FAQ */}
      <SectionContainer className="bg-black!">
        <SectionTitle badge="FAQ" title="Common Wholesale Questions" />

        <div className="mx-auto grid max-w-3xl gap-4">
          {WHOLESALE_FAQ.map((item) => (
            <GlassCard key={item.question}>
              <h3 className="card-title text-white">{item.question}</h3>
              <p className="body-text mt-2">{item.answer}</p>
            </GlassCard>
          ))}
        </div>
      </SectionContainer>

      {/* Enquiry form */}
      <SectionContainer id="enquiry-form">
        <SectionTitle
          badge="GET IN TOUCH"
          title="Start Your Wholesale Enquiry"
          subtitle="Fill this in and our team will get back to you within 24 hours on business days."
        />

        <div className="mx-auto max-w-3xl">
          <WholesaleEnquiryForm availableCategories={categoryTitles} />
        </div>
      </SectionContainer>
    </main>
  );
}
