import type { Metadata } from "next";
import { BUSINESS, SITE_NAME } from "@/lib/seo";
import LegalPageLayout, {
  LegalH2,
  LegalP,
  LegalList,
} from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Return & Refund Policy",
  description: `Return, replacement and refund terms for ${SITE_NAME} orders.`,
  alternates: { canonical: "/refund-policy" },
};

export default function ReturnPolicyPage() {
  return (
    <LegalPageLayout title="Return & Refund Policy" lastUpdated="27 July 2026">
      <LegalP>
        We want you to be happy with your purchase. Since every piece is
        handcrafted silver, please read the terms below carefully.
      </LegalP>

      <div>
        <LegalH2>1. Damaged or Incorrect Items</LegalH2>
        <LegalP>
          If an item arrives damaged, defective, or different from what you
          ordered, please contact us within 48 hours of delivery with photos
          (and an unboxing video, if possible) at{" "}
          <a href={`mailto:${BUSINESS.email}`} className="text-yellow-400 hover:underline">
            {BUSINESS.email}
          </a>
          . We&apos;ll arrange a free replacement or full refund once
          verified.
        </LegalP>
      </div>

      <div>
        <LegalH2>2. Change-of-Mind Returns</LegalH2>
        <LegalP>
          For reasons other than damage/defect, we accept returns within 7
          days of delivery, provided the item is unused, in its original
          packaging, with all tags/certificates intact.
        </LegalP>
      </div>

      <div>
        <LegalH2>3. Non-Returnable Items</LegalH2>
        <LegalList
          items={[
            "Customized or engraved pieces.",
            "Items without original packaging, tags or certificates.",
            "Items showing signs of use.",
          ]}
        />
      </div>

      <div>
        <LegalH2>4. Refund Process</LegalH2>
        <LegalP>
          Once we receive and inspect a returned item, refunds are issued to
          your original payment method within 7–10 business days. For
          cash-on-delivery orders, we&apos;ll coordinate a bank transfer
          instead.
        </LegalP>
      </div>

      <div>
        <LegalH2>5. Return Shipping</LegalH2>
        <LegalP>
          For damaged/defective/incorrect items, we cover return shipping.
          For change-of-mind returns, return shipping is the customer&apos;s
          responsibility unless stated otherwise at the time.
        </LegalP>
      </div>

      <div>
        <LegalH2>6. Wholesale/Bulk Orders</LegalH2>
        <LegalP>
          Returns on wholesale/bulk orders are handled case-by-case as
          agreed with our wholesale team at the time of order — see our{" "}
          <a href="/wholesale" className="text-yellow-400 hover:underline">
            Wholesale page
          </a>
          .
        </LegalP>
      </div>

      <div>
        <LegalH2>7. Contact Us</LegalH2>
        <LegalP>
          For any return or refund query, reach us at{" "}
          <a href={`mailto:${BUSINESS.email}`} className="text-yellow-400 hover:underline">
            {BUSINESS.email}
          </a>{" "}
          or {BUSINESS.telephone}.
        </LegalP>
      </div>
    </LegalPageLayout>
  );
}
