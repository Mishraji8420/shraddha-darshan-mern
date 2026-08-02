"use client";
 
import Image from "next/image";
import Link from "next/link";
 
import { useState, type FormEvent } from "react";
import { Phone, Mail, MapPin, ShieldCheck, Truck, Gem, ArrowRight, Check, Loader2 } from "lucide-react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
 
export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleNewsletterSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }
  
  return (
   <footer className="relative border-t border-white/10 bg-[#0d0d0d] pt-6! pb-20 sm:pt-8! sm:pb-24 lg:pb-28">
 
      {/* Top gold accent line */}
      <div className="h-0.5 w-full bg-linear-to-r from-transparent via-yellow-500/60 to-transparent" />
 
      {/* Trust strip */}
      <div className="border-b border-white/10">
        <div className="container py-8">
          <div className="mx-auto grid max-w-4xl grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
 
            <div className="flex items-center justify-center gap-3 px-0 py-4 text-center sm:justify-start sm:py-0 sm:pr-6 sm:text-left">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-yellow-500/30 bg-yellow-500/5 text-yellow-400">
                <Gem size={18} />
              </div>
              <div>
                <p className="text-[13.5px] font-medium text-white">Handcrafted Silver</p>
                <p className="small-text">Pure craftsmanship, made in India</p>
              </div>
            </div>
 
            <div className="flex items-center justify-center gap-3 px-0 py-4 text-center sm:py-0 sm:px-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-yellow-500/30 bg-yellow-500/5 text-yellow-400">
                <Truck size={18} />
              </div>
              <div>
                <p className="text-[13.5px] font-medium text-white">Pan-India Delivery</p>
                <p className="small-text">Safe and insured shipping</p>
              </div>
            </div>
 
            <div className="flex items-center justify-center gap-3 px-0 py-4 text-center sm:justify-end sm:py-0 sm:pl-6 sm:text-right">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-yellow-500/30 bg-yellow-500/5 text-yellow-400">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-[13.5px] font-medium text-white">Secure Payments</p>
                <p className="small-text">100% authentic guarantee</p>
              </div>
            </div>
 
          </div>
        </div>
      </div>
 
      <div className="container py-12 sm:py-14 lg:py-16">
 
        {/* Newsletter */}
        <div className="mb-12 flex flex-col items-center justify-between gap-6 radius-lg border border-white/10 bg-[#111111] p-5 sm:p-8 lg:flex-row lg:p-10">
 
          <div>
            <h3 className="card-title text-white">Join our inner circle</h3>
            <p className="body-text mt-2 max-w-md">
              Get early access to new collections, festive offers and exclusive gifting ideas.
            </p>
          </div>
 
          <div className="w-full max-w-sm">
            {status === "success" ? (
              <div className="flex h-12 items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-5 text-sm text-green-400">
                <Check size={16} />
                You&apos;re subscribed &mdash; welcome to the inner circle!
              </div>
            ) : (
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex w-full flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={status === "loading"}
                  aria-label="Email address"
                  className="h-12 flex-1 rounded-full border border-white/10 bg-[#0d0d0d] px-5 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-yellow-400 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  aria-label="Subscribe"
                  className="flex h-12 w-full shrink-0 items-center justify-center rounded-full bg-yellow-400 text-black transition hover:bg-yellow-300 disabled:opacity-60 sm:w-12"
                >
                  {status === "loading" ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <ArrowRight size={18} />
                  )}
                </button>
              </form>
            )}
            {status === "error" && (
              <p role="alert" className="mt-2 text-xs text-red-400">
                {errorMsg}
              </p>
            )}
          </div>
 
        </div>
 
        <div className="grid gap-10 text-center sm:text-left md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr]">
 
          <div>
 
            <Image
              src="/img/logo/logo.png"
              alt="Shraddha Darshan"
              width={68}
              height={68}
              className="mb-5 mx-auto sm:mx-0"
            />
 
            <h3 className="card-title text-white">
              Shraddha Darshan
            </h3>
 
            <p className="body-text mt-4 max-w-sm">
              Premium handcrafted silver décor, spiritual idols and luxury
              gifting collections created with timeless craftsmanship,
              devotion and elegance.
            </p>
 
            <div className="mt-7 space-y-4">
 
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 shrink-0 text-yellow-400" />
                <span className="small-text leading-6">
                  Kh No 100, 2nd Floor, House B/263, Gali No. 12, Near Shiv Mandir
                  <br />
                  Santnagar, Burari,
                  <br />
                  110084 Delhi, India
                </span>
              </div>
 
              <div className="flex items-center gap-3">
                <Phone size={17} className="text-yellow-400" />
                <span className="small-text">+91 9310399728</span>
              </div>
 
              <div className="flex items-center gap-3">
                <Mail size={17} className="text-yellow-400" />
                <span className="small-text">support@shardhadarshan.com</span>
              </div>
 
            </div>
 
            <div className="mt-7 flex justify-center gap-3 sm:justify-start">
 
              <a
                href="https://wa.me/919310399728?text=Hi!%20I'm%20interested%20in%20your%20products.%20Can%20you%20help%20me%3F"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/10 text-gray-400 transition-all duration-300 hover:border-yellow-400 hover:text-yellow-400"
              >
                <span className="absolute inset-0 scale-0 rounded-full bg-yellow-400/10 transition-transform duration-300 group-hover:scale-100" />
                <FaWhatsapp size={18} className="relative z-10" />
              </a>
 
              <a
                href="https://instagram.com/shraddhadharsan"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/10 text-gray-400 transition-all duration-300 hover:border-yellow-400 hover:text-yellow-400"
              >
                <span className="absolute inset-0 scale-0 rounded-full bg-yellow-400/10 transition-transform duration-300 group-hover:scale-100" />
                <FaInstagram size={18} className="relative z-10" />
              </a>

            </div>
 
          </div>
 
          <div>
            <h3 className="card-title text-white">Quick Links</h3>
            <ul className="mt-6 space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Shop", href: "/collections" },
                { label: "Categories", href: "/categories" },
                { label: "Gallery", href: "/gallery" },
                { label: "Wholesale", href: "/wholesale" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="small-text group inline-flex items-center gap-2 transition hover:text-yellow-400"
                  >
                    <span className="h-0.75 w-0 rounded-full bg-yellow-400 transition-all duration-300 group-hover:w-3" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
 
          <div>
            <h3 className="card-title text-white">Collections</h3>
            <ul className="mt-6 space-y-3">
              {["Elephant", "Kamdhenu", "Fish", "Spiritual Decor", "Gift Collection", "Home Decor"].map((item) => (
                <li key={item}>
                  <Link
                    href="/"
                    className="small-text group inline-flex items-center gap-2 transition hover:text-yellow-400"
                  >
                    <span className="h-0.75 w-0 rounded-full bg-yellow-400 transition-all duration-300 group-hover:w-3" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
 
          <div>
            <h3 className="card-title text-white">Information</h3>
            <ul className="mt-6 space-y-3">
              {[
                { label: "About Us", href: "/" },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms & Conditions", href: "/terms" },
                { label: "Shipping Policy", href: "/shipping-policy" },
                { label: "Return Policy", href: "/refund-policy" },
                { label: "FAQs", href: "/" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="small-text group inline-flex items-center gap-2 transition hover:text-yellow-400"
                  >
                    <span className="h-0.75 w-0 rounded-full bg-yellow-400 transition-all duration-300 group-hover:w-3" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
 
          <div>
            <h3 className="card-title text-white">Support</h3>
            <p className="body-text mt-6">
              Need help with your order or dealership enquiry? We are always happy to assist you.
            </p>
            <a
              href="mailto:support@shardhadarshan.com"
              className="mt-5 inline-flex text-sm font-medium text-yellow-400 transition hover:text-yellow-300"
            >
              support@shardhadarshan.com
            </a>
            <a
              href="tel:+919310399728"
              className="mt-3 block text-sm text-gray-400 transition hover:text-yellow-400"
            >
              +91 93103 99728
            </a>
          </div>
 
        </div>
 
        <div className="mt-14 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
 
            <p className="small-text text-center md:text-left">
              © 2026{" "}
              <span className="font-medium text-yellow-400">Shraddha Darshan</span>
              . All Rights Reserved.
            </p>
 
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link href="/privacy-policy" className="small-text transition hover:text-yellow-400">
                Privacy Policy
              </Link>
              <Link href="/terms" className="small-text transition hover:text-yellow-400">
                Terms & Conditions
              </Link>
              <Link href="/refund-policy" className="small-text transition hover:text-yellow-400">
                Refund Policy
              </Link>
            </div>
 
            <p className="small-text text-center md:text-right">
              Crafted with love in India
            </p>
 
          </div>
        </div>
 
      </div>
    </footer>
  );
}
 