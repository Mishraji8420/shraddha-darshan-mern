/**
 * Single source of truth for SEO + business info. Every place that needs
 * the site's canonical URL, name, description, or real business details
 * (JSON-LD, sitemap.ts, robots.ts, app/layout.tsx) should import from here
 * instead of hardcoding strings — so fixing the domain or address later is
 * a one-line change, not a find-and-replace across the app.
 *
 * TODO (you): confirm the real production domain below (or set
 * NEXT_PUBLIC_SITE_URL in .env.local / Vercel env vars — this file falls
 * back to it first). Right now it defaults to the domain your contact
 * email already uses (support@shardhadarshan.com). If the real domain is
 * spelled differently (e.g. shraddhadarshan.com), update the fallback or
 * set the env var before going live — sitemap/canonical/OG tags all read
 * from this one value.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://shardhadarshan.com"
).replace(/\/$/, "");

export const SITE_NAME = "Shraddha Darshan";

export const SITE_TAGLINE = "Premium Handcrafted Silver Décor & Idols";

export const SITE_DESCRIPTION =
  "Shraddha Darshan — premium handcrafted silver décor, spiritual idols and luxury gifting collections crafted with timeless devotion and elegance. Pan-India delivery, 100% authentic silver.";

// Real business info — pulled from components/Layout/Footer.tsx, which is
// already live on every page, so this isn't new/invented data. telephone
// and whatsapp are the same real number (+91 93103 99728) — confirmed.
// A second number (+91 72810 73148) was previously hardcoded in 3 places
// (Footer's tel: link, DealerCTA "Call Now", ContactInfo "Call Now") —
// that was wrong and has been corrected to match this one.
export const BUSINESS = {
  name: SITE_NAME,
  telephone: "+91 93103 99728",
  whatsapp: "https://wa.me/919310399728",
  email: "support@shardhadarshan.com",
  instagram: "https://instagram.com/shraddhadharsan",
  address: {
    streetAddress:
      "Kh No 100, 2nd Floor, House B/263, Gali No. 12, Near Shiv Mandir, Santnagar",
    addressLocality: "Burari",
    addressRegion: "Delhi",
    postalCode: "110084",
    addressCountry: "IN",
  },
};

// Default social-share image. featured-collection.png is a real product
// banner (1536x1024) — much better than the square logo for OG/Twitter
// cards, but a purpose-made 1200x630 banner would render even more
// cleanly on link previews. Fine for launch, worth revisiting later.
export const DEFAULT_OG_IMAGE = {
  url: "/img/featured/featured-collection.png",
  width: 1536,
  height: 1024,
  alt: SITE_NAME,
};
