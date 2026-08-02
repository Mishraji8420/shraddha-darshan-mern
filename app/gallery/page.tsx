import type { Metadata } from "next";
import { galleryItems } from "@/data/gallery";
import GalleryTile from "@/components/gallery/GalleryTile";

export const metadata: Metadata = {
  title: "Gallery | Shraddha Darshan",
  description:
    "A closer look at Shraddha Darshan's handcrafted silver idols and gifting pieces — real settings, real craftsmanship.",
};

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero / breadcrumb — matches the Categories page pattern */}
      <section className="border-b border-white/10 px-6 py-16 sm:px-10 lg:px-16">
        <span className="badge-text text-yellow-400">Shraddha Darshan</span>
        <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
          Our Gallery
        </h1>
        <p className="mt-3 max-w-xl text-gray-400">
          A closer look at our silver — photographed the way it actually
          lives, in real homes and pooja spaces.
        </p>
        <p className="mt-6 text-sm text-gray-500">Home / Gallery</p>
      </section>

      {/* Bento grid — single column on mobile, spans open up from sm/lg */}
      <section className="px-6 py-12 sm:px-10 lg:px-16">
        <div className="grid auto-rows-[180px] grid-cols-1 gap-4 sm:auto-rows-[200px] sm:grid-cols-2 lg:auto-rows-[240px] lg:grid-cols-4">
          {galleryItems.map((item) => (
            <GalleryTile key={item.id} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}