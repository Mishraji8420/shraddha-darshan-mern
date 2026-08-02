import FeaturedCollection from "../components/home/FeaturedCollection";
import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import WhyChooseUs from "../components/home/WhyChooseUs";
import BestSellers from "../components/home/BestSellers";
import Testimonials from "@/components/home/Testimonials";
import DealerCTA from "@/components/home/DealerCTA";
import CategoryStrip from "@/components/home/CategoryStrip";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white">
      <Hero />
      <CategoryStrip />
      <Categories />
      <BestSellers />
      <FeaturedCollection />
      <WhyChooseUs />
      <Testimonials />
      <DealerCTA />
    </main>
  );
}
