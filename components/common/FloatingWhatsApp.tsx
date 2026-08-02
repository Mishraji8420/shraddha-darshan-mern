import { FaWhatsapp } from "react-icons/fa";

// Moved out of the navbar into a fixed floating button (bottom-right),
// same pattern as most e-commerce sites — always reachable while scrolling,
// without taking up navbar space.
export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/919310399728?text=Hi!%20I'm%20interested%20in%20your%20products.%20Can%20you%20help%20me%3F"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] transition-transform duration-300 hover:scale-110 sm:bottom-6 sm:right-6"
    >
      <FaWhatsapp size={28} />
    </a>
  );
}
