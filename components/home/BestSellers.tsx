import { toLegacyProduct } from "@/lib/adapters";
import { getCachedFeaturedProducts } from "@/lib/cached-queries";
import SectionContainer from "../common/SectionContainer";
import SectionTitle from "../common/SectionTitle";
import ProductCard from "../product/ProductCard";

// Server Component. Previously this rendered *every* product from the
// static data file regardless of its `featured` flag (the flag existed on
// each product but was never actually read anywhere) — now it genuinely
// queries only featured products, highest rated first. Cached for 60s
// (see lib/cached-queries.ts) to cut down homepage load time.
export default async function BestSellers() {
  const dbProducts = await getCachedFeaturedProducts();
  const products = dbProducts.map(toLegacyProduct);

  return (
    <SectionContainer className="!pt-6 pb-20 sm:!pt-8 sm:pb-24 lg:pb-28">
      <div className="radius-lg border border-white/10 bg-[#0f0f0f] p-4 sm:p-6 lg:p-10">
        <SectionTitle
          badge="BEST SELLERS"
          title="Our Most Loved Collection"
          subtitle="Discover handcrafted silver masterpieces loved by customers across India."
        />

        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
