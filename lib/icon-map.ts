import {
  Gift,
  Home,
  Gem,
  Car,
  Trophy,
  Sparkles,
  Lamp,
  type LucideIcon,
} from "lucide-react";
import { GiElephant, GiCow } from "react-icons/gi";
import type { IconType } from "react-icons";

/**
 * Category.icon is stored as a plain string in the database (e.g. "Gift",
 * "GiElephant") since Postgres obviously can't store a React component.
 * This maps that string back to the real icon component on the frontend.
 * Trophy/Sparkles are here too for the two virtual badge filters
 * ("Best Seller" / "New"), which aren't real Category rows.
 */
export const categoryIconMap: Record<string, LucideIcon | IconType> = {
  Gift,
  Home,
  Gem,
  Car,
  Trophy,
  Sparkles,
  Lamp,
  GiElephant,
  GiCow,
};
