/**
 * Content + form config for app/wholesale/page.tsx and
 * components/wholesale/WholesaleEnquiryForm.tsx. Kept separate from
 * constants/categories.ts since that file is specifically about the real
 * DB-backed shop categories, not wholesale-page copy.
 */

// TODO (you): confirm the real minimum order quantity per design/piece —
// this is a placeholder. It's shown as plain copy on the page (not a
// hard-coded price), so it's a one-line change once you give me the real
// number.
export const MOQ_PER_DESIGN = 10;

export const BUSINESS_TYPES = [
  "Retail / Gift Shop",
  "Corporate Gifting Company",
  "Temple / Pooja Store",
  "Wedding / Event Planner",
  "Exporter",
  "Other",
];

export const QUANTITY_RANGES = [
  `${MOQ_PER_DESIGN}–25 pieces`,
  "26–50 pieces",
  "51–100 pieces",
  "100+ pieces",
];

export const AUDIENCE_SEGMENTS = [
  {
    icon: "ShoppingBag",
    title: "Retail & Gift Shops",
    description:
      "Stock handcrafted silver idols and décor your customers won't find elsewhere.",
  },
  {
    icon: "Handshake",
    title: "Corporate Gifting",
    description:
      "Premium, presentation-ready silver gifts for client and employee occasions.",
  },
  {
    icon: "Home",
    title: "Temples & Pooja Stores",
    description:
      "Authentic silver idols and ritual pieces for daily worship and festivals.",
  },
  {
    icon: "Heart",
    title: "Wedding & Event Planners",
    description:
      "Elegant silver return-gifts and favours, ordered in bulk for weddings and events.",
  },
  {
    icon: "Truck",
    title: "Exporters",
    description:
      "Export-ready packaging for international silver décor and gifting orders.",
  },
];

export const WHY_PARTNER = [
  {
    icon: "ShieldCheck",
    title: "BIS Hallmarked Silver",
    description: "Authentic, certified silver craftsmanship on every piece.",
  },
  {
    icon: "BadgeCheck",
    title: "20+ Years of Craftsmanship",
    description:
      "Every piece is hand-finished by artisans with two decades of silver-plating expertise.",
  },
  {
    icon: "PackageCheck",
    title: "Secure, Export-Grade Packaging",
    description:
      "Shock-proof packing built for safe pan-India and international shipping.",
  },
  {
    icon: "Phone",
    title: "Dedicated Wholesale Support",
    description:
      "A direct WhatsApp line for quotes, samples and order tracking — no call centre queues.",
  },
];

export const PROCESS_STEPS = [
  {
    title: "Enquire",
    description: "Share your business details and the categories you're interested in.",
  },
  {
    title: "Get a Quote",
    description: "Our team responds with catalog, pricing and available customization.",
  },
  {
    title: "Approve a Sample",
    description: "Review product photos or a physical sample before committing to bulk.",
  },
  {
    title: "Confirm & Dispatch",
    description: "Place your bulk order and we handle secure, tracked dispatch pan-India.",
  },
];

export const WHOLESALE_FAQ = [
  {
    question: "What's the minimum order quantity?",
    answer: `Minimum order is ${MOQ_PER_DESIGN} pieces per design. Mixed-design bulk orders are welcome — talk to us about combining designs to meet the minimum.`,
  },
  {
    question: "Do you offer sample pieces before a bulk order?",
    answer:
      "Yes — we can share detailed product photos, and physical samples can be arranged for serious bulk enquiries.",
  },
  {
    question: "Can products be customized or branded?",
    answer:
      "Engraving and packaging customization are available for qualifying order volumes — let us know what you have in mind in your enquiry.",
  },
  {
    question: "Do you ship pan-India for wholesale orders?",
    answer:
      "Yes, the same insured pan-India shipping we use for retail orders extends to wholesale/dealer orders.",
  },
];
