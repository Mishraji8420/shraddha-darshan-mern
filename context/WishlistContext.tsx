"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Product } from "@/types/products";

interface WishlistContextValue {
  items: Product[];
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
  wishlistCount: number;
  /** true once the wishlist has finished reading localStorage on the client */
  isHydrated: boolean;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined,
);
const STORAGE_KEY = "shraddha-darshan-wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Product[];
        if (Array.isArray(parsed)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage on mount, not derived UI state
          setItems(parsed);
        }
      }
    } catch {
      // Corrupted or unavailable storage — start with an empty wishlist.
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage might be full or disabled (private browsing) — fail silently.
    }
  }, [items, isHydrated]);

  const toggleWishlist = useCallback((product: Product) => {
    setItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: number) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const isWishlisted = useCallback(
    (productId: number) => items.some((item) => item.id === productId),
    [items],
  );

  const wishlistCount = useMemo(() => items.length, [items]);

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      toggleWishlist,
      removeFromWishlist,
      isWishlisted,
      wishlistCount,
      isHydrated,
    }),
    [items, toggleWishlist, removeFromWishlist, isWishlisted, wishlistCount, isHydrated],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within a <WishlistProvider>");
  }
  return ctx;
}
