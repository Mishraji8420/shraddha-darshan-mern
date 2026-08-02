
import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
 
export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Shraddha Darshan for order support, product questions, or wholesale and dealer enquiries. We usually reply within 24 hours.",
};
 
export default function ContactPage() {
  return (
    <main>
      {/* Hero / breadcrumb — matches the Cart & Wishlist page pattern */}
      <section className="border-b border-white/10 bg-[#0b0b0b] py-16">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-yellow-400">
            Shraddha Darshan
          </p>
          <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 max-w-xl text-gray-400">
            Questions about an order, a product, or partnering with us? Send
            us a message and our team will get back to you shortly.
          </p>
          <p className="mt-6 text-sm text-gray-500">Home / Contact</p>
        </div>
      </section>
 
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-10">
          <ContactForm />
          <ContactInfo />
        </div>
      </section>
    </main>
  );
}