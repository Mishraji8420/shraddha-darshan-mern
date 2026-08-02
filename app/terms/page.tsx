import type { Metadata } from "next";
import { BUSINESS, SITE_NAME } from "@/lib/seo";
import LegalPageLayout, { LegalH2, LegalP } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms that govern your use of ${SITE_NAME} and any orders placed with us.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms & Conditions" lastUpdated="27 July 2026">
      <LegalP>
        These terms govern your use of this website and any purchase you
        make from {SITE_NAME}. By using this site or placing an order, you
        agree to these terms.
      </LegalP>

      <div>
        <LegalH2>1. Products &amp; Pricing</LegalH2>
        <LegalP>
          We make every effort to display product colours, finish and size
          accurately, but slight variations are natural in handcrafted
          silver pieces and are not defects. Prices are listed in Indian
          Rupees (INR) and may change without prior notice; the price
          charged is the one shown at the time you place your order.
        </LegalP>
      </div>

      <div>
        <LegalH2>2. Orders &amp; Acceptance</LegalH2>
        <LegalP>
          Placing an order is an offer to buy — we may decline or cancel any
          order (for example, due to stock unavailability or a pricing
          error), in which case we&apos;ll notify you and refund any amount
          already paid.
        </LegalP>
      </div>

      <div>
        <LegalH2>3. Payments</LegalH2>
        <LegalP>
          Payments are processed through secure third-party payment
          gateways and/or cash-on-delivery, where offered. We do not store
          your full card, UPI or banking details on our own servers.
        </LegalP>
      </div>

      <div>
        <LegalH2>4. Shipping &amp; Returns</LegalH2>
        <LegalP>
          Shipping timelines and charges are set out in our{" "}
          <a href="/shipping-policy" className="text-yellow-400 hover:underline">
            Shipping Policy
          </a>
          . Returns, replacements and refunds are governed by our{" "}
          <a href="/refund-policy" className="text-yellow-400 hover:underline">
            Return &amp; Refund Policy
          </a>
          .
        </LegalP>
      </div>

      <div>
        <LegalH2>5. Intellectual Property</LegalH2>
        <LegalP>
          All content on this website — including product photography,
          descriptions, logo and design — belongs to {SITE_NAME} and may not
          be copied or reused without our written permission.
        </LegalP>
      </div>

      <div>
        <LegalH2>6. Limitation of Liability</LegalH2>
        <LegalP>
          To the extent permitted by law, {SITE_NAME} is not liable for any
          indirect or consequential loss arising from the use of this
          website or its products, beyond the value of the order in
          question.
        </LegalP>
      </div>

      <div>
        <LegalH2>7. Governing Law</LegalH2>
        <LegalP>
          These terms are governed by the laws of India, and any disputes
          will be subject to the exclusive jurisdiction of the courts in
          Delhi.
        </LegalP>
      </div>

      <div>
        <LegalH2>8. Contact Us</LegalH2>
        <LegalP>
          Questions about these terms can be sent to{" "}
          <a href={`mailto:${BUSINESS.email}`} className="text-yellow-400 hover:underline">
            {BUSINESS.email}
          </a>
          .
        </LegalP>
      </div>
    </LegalPageLayout>
  );
}
