export interface Product {
  id: number;
  name: string;
  slug: string;
  image: string;
  category: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
  badge: string;
  inStock: boolean;
  featured: boolean;
}