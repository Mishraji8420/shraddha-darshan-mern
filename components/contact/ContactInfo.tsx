import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
 
const infoItems = [
  {
    icon: MapPin,
    title: "Visit Us",
    lines: [
      "Kh No 100, 2nd Floor, House B/263,",
      "Gali No. 12, Near Shiv Mandir, Santnagar, Burari,",
      "110084 Delhi, India",
    ],
  },
  {
    icon: Phone,
    title: "Call Us",
    lines: ["+91 93103 99728"],
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: ["support@shardhadarshan.com"],
  },
  {
    icon: Clock,
    title: "Business Hours",
    lines: ["Mon – Sat: 10:00 AM – 7:00 PM", "Sunday: Closed"],
  },
];
 
export default function ContactInfo() {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-white/10 bg-[#111111] p-5 sm:p-8">
        <h3 className="card-title text-white">Get in Touch</h3>
        <p className="body-text mt-2">
          Have a question about an order, a product, or becoming a dealer?
          We&apos;d love to hear from you.
        </p>
 
        <div className="mt-6 space-y-5">
          {infoItems.map(({ icon: Icon, title, lines }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-yellow-400/25 bg-yellow-400/5 text-yellow-400">
                <Icon size={17} />
              </div>
              <div>
                <p className="text-[13.5px] font-medium text-white">
                  {title}
                </p>
                {lines.map((line) => (
                  <p key={line} className="small-text leading-6">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
 
      {/* Quick actions */}
      <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
        <a
          href="https://wa.me/919310399728?text=Hi!%20I'm%20interested%20in%20your%20products.%20Can%20you%20help%20me%3F"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-[13px] font-semibold text-white transition-all duration-300 hover:bg-[#20ba5a]"
        >
          <FaWhatsapp size={17} />
          Chat on WhatsApp
        </a>
 
        <a
          href="tel:+919310399728"
          className="btn-secondary flex-1 justify-center"
        >
          <Phone size={16} />
          Call Now
        </a>
      </div>
 
      {/* Social */}
      <div className="rounded-2xl border border-white/10 bg-[#111111] p-5 sm:p-6">
        <p className="text-[13px] font-medium text-gray-300">Follow us</p>
        <div className="mt-4 flex gap-3">
          <a
            href="https://wa.me/919310399728?text=Hi!%20I'm%20interested%20in%20your%20products.%20Can%20you%20help%20me%3F"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gray-400 transition-all duration-300 hover:border-yellow-400 hover:text-yellow-400"
          >
            <FaWhatsapp size={18} />
          </a>
          <a
            href="https://instagram.com/shraddhadharsan"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow us on Instagram"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gray-400 transition-all duration-300 hover:border-yellow-400 hover:text-yellow-400"
          >
            <FaInstagram size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}
 