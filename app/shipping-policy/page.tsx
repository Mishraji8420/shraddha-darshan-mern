import type { Metadata } from "next";
import { BUSINESS, SITE_NAME } from "@/lib/seo";
import LegalPageLayout, { LegalH2, LegalP } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: `Delivery timelines, charges and coverage for ${SITE_NAME} orders.`,
  alternates: { canonical: "/shipping-policy" },
};

export default function ShippingPolicyPage() {
  return (
    <LegalPageLayout title="Shipping Policy" lastUpdated="27 July 2026">
      <LegalP>
        We currently ship pan-India. Please read below for expected
        timelines, charges, and what happens if something goes wrong in
        transit.
      </LegalP>

      <div>
        <LegalH2>1. Dispatch Time</LegalH2>
        <LegalP>
          Orders are typically dispatched within 1–3 business days of
          confirmation. Custom or made-to-order pieces may take longer — any
          extra time will be communicated when you order.
        </LegalP>
      </div>

      <div>
        <LegalH2>2. Delivery Timeline</LegalH2>
        <LegalP>
          Once dispatched, orders typically arrive within 5–9 business days
          depending on your location. Metro cities are usually on the
          faster end of this range; remote areas may take a little longer.
        </LegalP>
      </div>

      <div>
        <LegalH2>3. Shipping Charges</LegalH2>
        <LegalP>
          Shipping charges (if any) are shown at checkout before you
          complete your order.
        </LegalP>
      </div>

      <div>
        <LegalH2>4. Packaging</LegalH2>
        <LegalP>
          Every order is packed securely to protect handcrafted silver
          pieces in transit. Please inspect your package on delivery — see
          our{" "}
          <a href="/refund-policy" className="text-yellow-400 hover:underline">
            Return &amp; Refund Policy
          </a>{" "}
          for what to do if an item arrives damaged.
        </LegalP>
      </div>

      <div>
        <LegalH2>5. Delays</LegalH2>
        <LegalP>
          Occasionally, deliveries may be delayed due to courier network
          issues, weather, or circumstances beyond our control. We&apos;ll
          keep you informed if this happens.
        </LegalP>
      </div>

      <div>
        <LegalH2>6. Questions About Your Order</LegalH2>
        <LegalP>
          Reach us at{" "}
          <a href={`mailto:${BUSINESS.email}`} className="text-yellow-400 hover:underline">
            {BUSINESS.email}
          </a>{" "}
          or {BUSINESS.telephone} for any shipping-related question.
        </LegalP>
      </div>
    </LegalPageLayout>
  );
}
