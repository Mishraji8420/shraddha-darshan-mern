/**
 * Seeds the database from scratch.
 *
 * This also FIXES the category-taxonomy mismatch flagged in the frontend
 * audit: the old `data/products.ts` used free-text categories ("Elephant",
 * "Tortoise", "Fish"...) that didn't match the real shop-by-category nav
 * ("Vastu", "God Idols", "Home Decor"...), so most categories on /categories
 * always showed "Coming Soon" even though matching products existed.
 *
 * From here on, Category is the single source of truth (matches
 * constants/categories.ts on the frontend, minus the two virtual
 * badge-filters "Best Seller" and "New" — those are not real categories,
 * they stay as Product.badge).
 *
 * Run with: npx prisma db seed
 */
import { config } from "dotenv";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Same reason as prisma.config.ts: this script runs standalone via `tsx`,
// outside Next.js's own env loading, so .env.local needs to be loaded
// explicitly.
config({ path: ".env.local" });

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter });

const categories = [
  { title: "Gifting", slug: "gifting", icon: "Gift" },
  { title: "Vastu", slug: "vastu", icon: "Gem" },
  { title: "Home Decor", slug: "decor", icon: "Home" },
  { title: "Car Dashboard", slug: "car-dashboard", icon: "Car" },
  { title: "God Idols", slug: "god-idols", icon: "GiElephant" },
  { title: "Pooja", slug: "pooja", icon: "Lamp" },
  { title: "Kamdhenu", slug: "kamdhenu", icon: "GiCow" },
] as const;

// NOTE on category assignment below: "Gifting", "Car Dashboard" and "Pooja"
// genuinely have zero matching products in the current catalog — that's
// expected and correct, not a bug. They'll show "Coming Soon" until real
// products are added to those lines.
const products = [
  {
    name: "Royal Silver Elephant",
    slug: "royal-silver-elephant",
    description:
      "A pair-worthy silver elephant showpiece, hand-finished with intricate detailing. Elephants are a classic Vastu symbol of strength, wisdom and good fortune — placed at the entrance or living room to invite positive energy.",
    images: ["/img/products/Royal-Silver-Elephant.png"],
    price: 2999,
    oldPrice: 3999,
    categorySlug: "vastu",
    badge: "Best Seller",
    rating: 4.8,
    reviewsCount: 126,
    stockQuantity: 40,
    featured: true,
  },
  {
    name: "Sacred Prosperity Tortoise",
    slug: "sacred-prosperity-tortoise",
    description:
      "A silver tortoise on a decorative base, one of the most popular Vastu pieces for the home or office. Traditionally kept facing the main door or on the north side of a room to attract stability and prosperity.",
    images: ["/img/products/Sacred-Prosperity-Tortoise.png"],
    price: 2999,
    oldPrice: 3999,
    categorySlug: "vastu",
    badge: "Trending",
    rating: 4.5,
    reviewsCount: 92,
    stockQuantity: 35,
    featured: true,
  },
  {
    name: "Kamdhenu Cow & Calf",
    slug: "kamdhenu-cow-calf",
    description:
      "A finely detailed silver Kamdhenu cow with her calf, revered as a symbol of abundance, nourishment and divine motherhood. A meaningful gift for housewarmings, weddings and festive occasions.",
    images: ["/img/products/Kamdhenu-Cow-&-Calf.png"],
    price: 2999,
    oldPrice: 3999,
    categorySlug: "kamdhenu",
    badge: "Premium",
    rating: 5.0,
    reviewsCount: 168,
    stockQuantity: 25,
    featured: true,
  },
  {
    name: "Auspicious Twin Fish",
    slug: "auspicious-twin-fish",
    description:
      "A pair of silver fish, a well-known Vastu and Feng Shui symbol of harmony, fertility and good luck in relationships. Compact enough for a study table, altar, or gifting box.",
    images: ["/img/products/Auspicious-Twin-Fish.png"],
    price: 2999,
    oldPrice: 3999,
    categorySlug: "vastu",
    badge: "Popular",
    rating: 4.2,
    reviewsCount: 54,
    stockQuantity: 50,
    featured: false,
  },
  {
    name: "Balaji Divine Bust",
    slug: "balaji-divine-bust",
    description:
      "A regal silver bust of Lord Balaji, hand-finished with fine facial and ornamental detailing. A centerpiece idol for the home temple, meant to be placed at eye level for daily darshan.",
    images: ["/img/products/Balaji-Divine-Bust.png"],
    price: 2999,
    oldPrice: 3999,
    categorySlug: "god-idols",
    badge: "Limited",
    rating: 5.0,
    reviewsCount: 214,
    stockQuantity: 18,
    featured: true,
  },
  {
    name: "Sacred Ganesh Shankh",
    slug: "sacred-ganesh-shankh",
    description:
      "Lord Ganesh seated beside a silver shankh (conch), combining two of the most auspicious symbols in one piece — ideal for pooja rooms, festive gifting and new beginnings like Griha Pravesh.",
    images: [
      "/img/products/Sacred-Ganesh-Shankh.png",
      "/img/collection/ganesha/ganesh1.png",
      "/img/collection/ganesha/ganesh2.png",
      "/img/collection/ganesha/ganesh3.png",
      "/img/collection/ganesha/ganeshIdol.jpeg",
    ],
    price: 2999,
    oldPrice: 3999,
    categorySlug: "god-idols",
    badge: "Exclusive",
    rating: 4.6,
    reviewsCount: 87,
    stockQuantity: 30,
    featured: false,
  },
  {
    name: "Royal Silver Swan Pair",
    slug: "royal-silver-swan-pair",
    description:
      "An elegant pair of silver swans, symbolizing grace, purity and a happy union — a favourite wedding and anniversary gift. Finished with a mirror-polish shine that complements any console or centre table.",
    images: ["/img/products/Royal-Silver-Swan-Pair.png"],
    price: 2999,
    oldPrice: 3999,
    categorySlug: "decor",
    badge: "Luxury",
    rating: 4.9,
    reviewsCount: 143,
    stockQuantity: 22,
    featured: true,
  },
  {
    name: "Tree of Life Showpiece",
    slug: "tree-of-life-showpiece",
    description:
      "A silver Tree of Life showpiece representing growth, connection and eternal prosperity. A modern spiritual decor piece that works equally well on a study desk, mantelpiece or office reception.",
    images: ["/img/products/Tree-of-Life-Showpiece.png"],
    price: 2999,
    oldPrice: 3999,
    categorySlug: "decor",
    badge: "New",
    rating: 4.4,
    reviewsCount: 73,
    stockQuantity: 45,
    featured: false,
  },
  {
    // Bonus 9th product: this image already existed in
    // public/img/products/ but was never wired into data/products.ts —
    // added here since it's a ready-to-sell asset going to waste otherwise.
    name: "Divine Gajalakshmi Elephant",
    slug: "divine-gajalakshmi-elephant",
    description:
      "Goddess Gajalakshmi seated atop a silver elephant, a powerful combined symbol of wealth (Lakshmi) and royal strength (Gaja). A striking centerpiece for the home temple or as a premium gift for someone starting a new venture.",
    images: ["/img/products/Divine-Gajalakshmi-Elephant.png"],
    price: 3499,
    oldPrice: 4499,
    categorySlug: "god-idols",
    badge: "New",
    rating: 4.7,
    reviewsCount: 12,
    stockQuantity: 15,
    featured: false,
  },
];

async function main() {
  console.log("Seeding categories...");
  const categoryBySlug = new Map<string, number>();

  for (const cat of categories) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { title: cat.title, icon: cat.icon },
      create: cat,
    });
    categoryBySlug.set(cat.slug, record.id);
  }

  console.log("Seeding products...");
  for (const { categorySlug, ...p } of products) {
    const categoryId = categoryBySlug.get(categorySlug);
    if (!categoryId) {
      throw new Error(
        `Unknown categorySlug "${categorySlug}" for product "${p.name}" — check the categories list above.`,
      );
    }

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { ...p, categoryId },
      create: { ...p, categoryId },
    });
  }

  const productCount = await prisma.product.count();
  const categoryCount = await prisma.category.count();
  console.log(
    `Done. ${categoryCount} categories, ${productCount} products seeded.`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
