// 


import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import AnnouncementBar from "@/components/Layout/AnnouncementBar";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import FloatingWhatsApp from "@/components/common/FloatingWhatsApp";
import {
  BUSINESS,
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/seo";
 
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
 
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});
 
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["600", "700"],
  display: "swap",
});
 
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "silver idols online",
    "handcrafted silver décor",
    "silver pooja items",
    "silver gifting collection",
    "Vastu silver items",
    "silver wedding return gifts",
    "Shraddha Darshan",
  ],
  authors: [{ name: SITE_NAME }],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
  // TODO (you): once you set up Google Search Console, drop the
  // verification code in here, e.g.:
  // verification: { google: "your-verification-code" },
};

// Organization / LocalBusiness structured data — real business info (see
// lib/seo.ts), not placeholder. This is what lets Google show the
// business name, address, phone and social links as a Knowledge Panel /
// rich result instead of just a blue link.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: BUSINESS.name,
  image: `${SITE_URL}${DEFAULT_OG_IMAGE.url}`,
  url: SITE_URL,
  telephone: BUSINESS.telephone,
  email: BUSINESS.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: BUSINESS.address.streetAddress,
    addressLocality: BUSINESS.address.addressLocality,
    addressRegion: BUSINESS.address.addressRegion,
    postalCode: BUSINESS.address.postalCode,
    addressCountry: BUSINESS.address.addressCountry,
  },
  sameAs: [BUSINESS.instagram, BUSINESS.whatsapp],
};
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${jakarta.variable} ${playfair.variable} antialiased`}
      >
        <Providers>
          <AnnouncementBar />
          <Navbar />
          {children}
          <Footer />
          <FloatingWhatsApp />
        </Providers>
      </body>
    </html>
  );
}