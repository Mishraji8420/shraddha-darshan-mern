

export type GalleryTileSize = "large" | "wide" | "tall" | "normal";

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  size: GalleryTileSize;
  productSlug?: string;
}

export const galleryItems: GalleryItem[] = [
  {
    id: "ganesh-velvet-box",
    src: "/img/collection/ganesha/ganeshIdol.webp",
    alt: "Silver Ganesh idol presented in a premium velvet gift box",
    size: "large",
    productSlug: "sacred-ganesh-shankh",
  },
  {
    id: "featured-elephant",
    src: "/img/featured/featured-collection.webp",
    alt: "Royal silver elephant showpiece on a temple-style backdrop",
    size: "wide",
  },
  {
    id: "ganesh-home-setting",
    src: "/img/collection/ganesha/ganesh1.webp",
    alt: "Silver Ganesh idol placed at home with diyas and flowers",
    size: "tall",
    productSlug: "sacred-ganesh-shankh",
  },
  {
    id: "royal-elephant",
    src: "/img/products/Royal-Silver-Elephant.webp",
    alt: "Royal Silver Elephant showpiece",
    size: "normal",
    productSlug: "royal-silver-elephant",
  },
  {
    id: "swan-pair",
    src: "/img/products/Royal-Silver-Swan-Pair.webp",
    alt: "Royal Silver Swan Pair",
    size: "normal",
    productSlug: "royal-silver-swan-pair",
  },
  {
    id: "kamdhenu",
    src: "/img/products/Kamdhenu-Cow-&-Calf.webp",
    alt: "Kamdhenu Cow & Calf silver idol",
    size: "normal",
    productSlug: "kamdhenu-cow-calf",
  },
  {
    id: "twin-fish",
    src: "/img/products/Auspicious-Twin-Fish.webp",
    alt: "Auspicious Twin Fish showpiece",
    size: "normal",
    productSlug: "auspicious-twin-fish",
  },
  {
    id: "balaji-bust",
    src: "/img/products/Balaji-Divine-Bust.webp",
    alt: "Balaji Divine Bust silver idol",
    size: "normal",
    productSlug: "balaji-divine-bust",
  },
  {
    id: "tree-of-life",
    src: "/img/products/Tree-of-Life-Showpiece.webp",
    alt: "Tree of Life Showpiece",
    size: "normal",
    productSlug: "tree-of-life-showpiece",
  },
];