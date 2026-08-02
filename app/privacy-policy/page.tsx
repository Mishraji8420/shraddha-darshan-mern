import type { Metadata } from "next";
import { BUSINESS, SITE_NAME } from "@/lib/seo";
import LegalPageLayout, {
  LegalH2,
  LegalP,
  LegalList,
} from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} collects, uses and protects your personal information.`,
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="27 July 2026">
      <LegalP>
        {SITE_NAME} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects your privacy. This
        policy explains what personal information we collect when you use
        this website, how we use it, and the choices you have.
      </LegalP>

      <div>
        <LegalH2>1. Information We Collect</LegalH2>
        <LegalP>We collect information you give us directly, such as:</LegalP>
        <LegalList
          items={[
            "Name, email address and phone number — when you use the Contact or Wholesale enquiry forms, or place an order.",
            "Delivery address and billing details — when you place an order.",
            "Any message or details you choose to share with us in an enquiry.",
          ]}
        />
        <LegalP>
          We also automatically collect limited technical information (such
          as browser type and general usage patterns) to keep the site
          working correctly and secure — we do not use this to build
          advertising profiles.
        </LegalP>
      </div>

      <div>
        <LegalH2>2. How We Use Your Information</LegalH2>
        <LegalList
          items={[
            "To respond to enquiries submitted via our Contact or Wholesale forms.",
            "To process, ship and provide support for orders.",
            "To send order updates and, where you've agreed, occasional updates about new collections.",
            "To improve the website and keep it secure.",
          ]}
        />
      </div>

      <div>
        <LegalH2>3. Sharing Your Information</LegalH2>
        <LegalP>
          We do not sell your personal information. We share it only with
          service providers who help us run this business, such as:
        </LegalP>
        <LegalList
          items={[
            "Email delivery providers, to send enquiry confirmations and order updates.",
            "Our database/hosting provider, to securely store order and account information.",
            "Payment gateways, to process payments securely — we do not store your full card or UPI details ourselves.",
            "Courier/logistics partners, to deliver your order.",
          ]}
        />
      </div>

      <div>
        <LegalH2>4. Cookies &amp; Similar Technologies</LegalH2>
        <LegalP>
          We use cookies or similar local storage to keep your cart/wishlist
          working between visits and, where applicable, to keep you signed
          in. You can clear these at any time through your browser settings,
          though some features may not work correctly without them.
        </LegalP>
      </div>

      <div>
        <LegalH2>5. Data Retention &amp; Security</LegalH2>
        <LegalP>
          We retain order and account information for as long as needed to
          provide our services and meet legal/accounting requirements, and
          take reasonable technical measures to protect it. No method of
          transmission or storage is 100% secure, and we cannot guarantee
          absolute security.
        </LegalP>
      </div>

      <div>
        <LegalH2>6. Your Choices</LegalH2>
        <LegalP>
          You can ask us to access, correct, or delete the personal
          information we hold about you by contacting us using the details
          below.
        </LegalP>
      </div>

      <div>
        <LegalH2>7. Contact Us</LegalH2>
        <LegalP>
          For any privacy-related questions, reach us at{" "}
          <a href={`mailto:${BUSINESS.email}`} className="text-yellow-400 hover:underline">
            {BUSINESS.email}
          </a>{" "}
          or {BUSINESS.telephone}.
        </LegalP>
      </div>
    </LegalPageLayout>
  );
}
