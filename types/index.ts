// ============================================================
// GLOBAL TYPE DEFINITIONS — TechStore KG
// ============================================================

export interface Product {
  id: string;
  name: string;
  tagline: string;
  price_kgs: number;           // Supabase snake_case
  currency: "KGS";
  image: string;               // Primary image URL
  images: string[];            // Gallery array (Supabase Storage URLs)
  category: Category;
  description: string;
  specs: Record<string, string>;
  stock_status: boolean;       // Supabase snake_case
  featured: boolean;
  badge?: string;
  rating?: number;
  review_count?: number;
  created_at?: string;
  updated_at?: string;
}

export type Category =
  | "MacBook"
  | "iPhone"
  | "iPad"
  | "Apple Watch"
  | "AirPods"
  | "Accessories"
  | "Samsung"
  | "Headphones"
  | "Monitors"
  | "Gaming";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutForm {
  name: string;
  address: string;
  whatsapp: string;
  paymentMethod: "whatsapp" | "odengi" | "elsom" | "card";
}

// UI state for category nav
export interface CategoryNavItem {
  label: string;
  value: Category | "all";
  emoji: string;
}
