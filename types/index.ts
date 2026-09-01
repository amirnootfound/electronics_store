// ============================================================
// GLOBAL TYPE DEFINITIONS — Universal Electronics Store
// ============================================================

export interface Product {
  id: string;
  name: string;
  tagline: string;
  price_kgs: number;           // Storing USD value (legacy field name, will be refactored)
  currency: string;            // Dynamic currency (USD, EUR, KGS, etc.)
  image: string;               // Primary image URL
  images: string[];            // Gallery array (Supabase Storage URLs)
  category: string;            // Dynamic category (no longer hardcoded)
  category_id?: string;         // UUID reference to categories table
  brand_id?: string;           // UUID reference to brands table
  description: string;
  specs: Record<string, string>;
  condition?: string;          // 'new', 'refurbished', 'used'
  warranty?: string;
  stock_status: boolean;       // Supabase snake_case
  stock_quantity?: number;     // Available quantity (null = unlimited)
  featured: boolean;
  new_product: boolean;        // Brand new for marketing sections
  badge?: string;
  rating?: number;
  review_count?: number;
  created_at?: string;
  updated_at?: string;
}

// Dynamic category type (string instead of union)
export type Category = string;

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutForm {
  name: string;
  address: string;
  phone: string;               // Changed from whatsapp to generic phone
  email?: string;
  paymentMethod: string;       // Dynamic payment method
  orderPath: string;          // Order path (online, call, sms, pickup, delivery)
}

// UI state for category nav
export interface CategoryNavItem {
  label: string;
  value: Category | "all";
  emoji: string;
}

export type LeadStatus = "new" | "contacted" | "qualified" | "closed" | "lost";

export interface Lead {
  id: string;
  customer_name: string;
  phone: string;               // Changed from whatsapp to generic phone
  address?: string;
  email?: string;
  product_id?: string;
  product_name: string;
  category: string;
  category_id?: string;        // UUID reference to categories table
  message?: string;
  total_amount?: number;
  currency?: string;
  payment_method_id?: string;   // UUID reference to payment_methods table
  order_path_id?: string;      // UUID reference to order_paths table
  source: "checkout" | "product_page" | "homepage";
  status: LeadStatus;
  priority: "low" | "medium" | "high";
  notes?: string;
  created_at?: string;
  updated_at?: string;
  contacted_at?: string;
}

// Database types for new tables
export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  emoji?: string;
  icon_url?: string;
  description?: string;
  parent_id?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BrandRecord {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  website_url?: string;
  description?: string;
  is_featured: boolean;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SpecTemplate {
  id: string;
  name: string;
  category_id?: string;
  template: Record<string, any>; // JSON template with field definitions
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  code: string;
  icon?: string;
  description?: string;
  is_active: boolean;
  requires_online_payment: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface OrderPath {
  id: string;
  name: string;
  code: string;
  icon?: string;
  description?: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}
