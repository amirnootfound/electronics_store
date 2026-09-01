// ============================================================
// FALLBACK / SEED DATA — Used when Supabase is not configured
// Also used for SSG fallbacks and dev without .env
// Universal Electronics Store - USD-based pricing
// ============================================================
import { Product, CategoryNavItem } from "@/types";

export const sampleProducts: Product[] = [
  {
    id: "iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    tagline: "Titanium. So strong. So light. So Pro.",
    price_kgs: 1199.99, // Now storing USD value (will be renamed later)
    currency: "USD",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=800&hei=800&fmt=jpeg&qlt=90",
    images: ["https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=800&hei=800&fmt=jpeg&qlt=90"],
    category: "Smartphones",
    description: "iPhone 15 Pro Max with A17 Pro chip. 6.7-inch Super Retina XDR display.",
    specs: { Processor: "A17 Pro", Display: "6.7-inch Super Retina XDR", Camera: "48MP Main", Storage: "256GB", Battery: "Up to 29 hours" },
    stock_status: true, stock_quantity: 5, featured: true, new_product: true, badge: "New", rating: 4.9, review_count: 1024,
  },
  {
    id: "dell-xps-15",
    name: "Dell XPS 15",
    tagline: "Performance. Creation. Entertainment.",
    price_kgs: 1499.99, currency: "USD",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=800&fit=crop",
    images: ["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=800&fit=crop"],
    category: "Laptops",
    description: "Dell XPS 15 with Intel Core i7, 32GB RAM, 1TB SSD. Perfect for creators.",
    specs: { Processor: "Intel Core i7", RAM: "32GB DDR5", Storage: "1TB SSD", Display: "15.6-inch OLED 3.5K", Graphics: "NVIDIA RTX 4050", Battery: "Up to 12 hours" },
    stock_status: true, stock_quantity: 3, featured: true, new_product: false, badge: "Popular", rating: 4.7, review_count: 876,
  },
  {
    id: "sony-wh1000xm5",
    name: "Sony WH-1000XM5",
    tagline: "Industry-leading noise cancellation.",
    price_kgs: 349.99, currency: "USD",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop"],
    category: "Audio",
    description: "Sony WH-1000XM5 with 8 microphones and 30-hour battery life.",
    specs: { "Driver Size": "30mm", "Frequency Response": "4Hz-40000Hz", "Battery Life": "30 hours", "Noise Cancellation": "Active", Connectivity: "Bluetooth 5.2", Weight: "250g" },
    stock_status: true, stock_quantity: 15, featured: false, new_product: false, rating: 4.8, review_count: 2341,
  },
  {
    id: "samsung-65-qled",
    name: "Samsung 65\" QLED 4K TV",
    tagline: "Quantum Dot technology for brilliant color.",
    price_kgs: 899.99, currency: "USD",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop",
    images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop"],
    category: "TV & Home Theater",
    description: "Samsung 65-inch QLED 4K Smart TV with Quantum Dot technology.",
    specs: { Display: "65-inch QLED 4K", Resolution: "3840x2160", "Smart TV": "Tizen", HDR: "HDR10+", "Refresh Rate": "120Hz" },
    stock_status: true, stock_quantity: 8, featured: false, new_product: false, rating: 4.6, review_count: 654,
  },
  {
    id: "logitech-mx-master-3s",
    name: "Logitech MX Master 3S",
    tagline: "Advanced wireless mouse for productivity.",
    price_kgs: 99.99, currency: "USD",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop",
    images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop"],
    category: "Accessories",
    description: "Logitech MX Master 3S wireless mouse with ergonomic design and precision scrolling.",
    specs: { Connectivity: "Bluetooth / USB-C", Sensor: "8000 DPI", Battery: "Up to 70 days", Buttons: "8 programmable", Compatibility: "Mac/Windows/Linux" },
    stock_status: true, stock_quantity: 25, featured: false, new_product: false, rating: 4.7, review_count: 1543,
  },
  {
    id: "anker-powercore-26800",
    name: "Anker PowerCore 26800",
    tagline: "High-capacity portable charger.",
    price_kgs: 49.99, currency: "USD",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=800&fit=crop",
    images: ["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=800&fit=crop"],
    category: "Accessories",
    description: "Anker PowerCore 26800 portable battery with 26800mAh capacity for multiple device charges.",
    specs: { Capacity: "26800mAh", Output: "USB-C / USB-A", "Fast Charging": "PowerIQ 3.0", Ports: "3 ports", Weight: "454g" },
    stock_status: true, stock_quantity: 50, featured: false, new_product: false, rating: 4.5, review_count: 3210,
  },
];

// ── Universal Price formatter (deprecated - use useCurrency hook instead) ──
// This is kept for backward compatibility during transition
export const formatPrice = (price: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

// ── Universal Category nav items (for mobile carousel & sidebar) ───
export const categoryNavItems: CategoryNavItem[] = [
  { label: "All", value: "all", emoji: "🛍️" },
  { label: "Laptops", value: "Laptops", emoji: "💻" },
  { label: "Smartphones", value: "Smartphones", emoji: "📱" },
  { label: "Tablets", value: "Tablets", emoji: "📟" },
  { label: "Audio", value: "Audio", emoji: "🎧" },
  { label: "Accessories", value: "Accessories", emoji: "⌚" },
  { label: "Displays", value: "Displays", emoji: "🖥️" },
  { label: "TV & Home Theater", value: "TV & Home Theater", emoji: "📺" },
  { label: "Gaming", value: "Gaming", emoji: "🎮" },
];
