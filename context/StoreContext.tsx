"use client";
// ============================================================
// GLOBAL STORE CONTEXT — Supabase-powered CRUD + local state
// Cart, Wishlist, Recently Viewed persisted to localStorage
// ============================================================

import React, {
  createContext, useContext, useState, useEffect,
  useCallback, ReactNode, useRef,
} from "react";
import { Product, CartItem, Category } from "@/types";
import { sampleProducts } from "@/data/products";
import { supabase } from "@/lib/supabase";

const IS_SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://your-project-ref.supabase.co";

// ─── Context shape ──────────────────────────────────────────
interface StoreContextType {
  // Products (Supabase or fallback)
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, "id" | "created_at" | "updated_at">) => Promise<Product | null>;
  updateProduct: (updated: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Cart
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Wishlist
  wishlistIds: string[];
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;

  // Recently Viewed
  recentlyViewed: Product[];
  addRecentlyViewed: (product: Product) => void;

  // Search
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  searchResults: Product[];

  // Category filter (shared between navbar and catalog)
  activeCategory: Category | "all";
  setActiveCategory: (cat: Category | "all") => void;

  // UI
  isSearchOpen: boolean;
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// ─── Provider ───────────────────────────────────────────────
export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [loading, setLoading] = useState(IS_SUPABASE_CONFIGURED);
  const [error, setError] = useState<string | null>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const [activeCategory, setActiveCategoryState] = useState<Category | "all">("all");

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const catalogRef = useRef<HTMLElement | null>(null);

  // ── Fetch products from Supabase ─────────────────────────
  const refreshProducts = useCallback(async () => {
    if (!IS_SUPABASE_CONFIGURED) {
      setProducts(sampleProducts);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (err) throw err;
      setProducts(data as Product[]);
    } catch (e: unknown) {
      console.error("Supabase fetch error:", e);
      setError("Не удалось загрузить товары. Используются демо-данные.");
      setProducts(sampleProducts);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Persist localStorage ─────────────────────────────────
  useEffect(() => {
    refreshProducts();
    try {
      const c = localStorage.getItem("cart");
      const w = localStorage.getItem("wishlist");
      const r = localStorage.getItem("recentlyViewed");
      if (c) setCartItems(JSON.parse(c));
      if (w) setWishlistIds(JSON.parse(w));
      if (r) setRecentlyViewed(JSON.parse(r));
    } catch {/* ignore */}
  }, [refreshProducts]);

  useEffect(() => { localStorage.setItem("cart", JSON.stringify(cartItems)); }, [cartItems]);
  useEffect(() => { localStorage.setItem("wishlist", JSON.stringify(wishlistIds)); }, [wishlistIds]);
  useEffect(() => { localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed)); }, [recentlyViewed]);

  // ── Real-time search ─────────────────────────────────────
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const q = searchQuery.toLowerCase();
    setSearchResults(
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, products]);

  // ── Cart ─────────────────────────────────────────────────
  const cartTotal = cartItems.reduce((s, i) => s + i.product.price_kgs * i.quantity, 0);
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  const addToCart = useCallback((product: Product) => {
    setCartItems((prev) => {
      const ex = prev.find((i) => i.product.id === product.id);
      if (ex) return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty <= 0) { setCartItems((prev) => prev.filter((i) => i.product.id !== id)); return; }
    setCartItems((prev) => prev.map((i) => i.product.id === id ? { ...i, quantity: qty } : i));
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  // ── Wishlist ─────────────────────────────────────────────
  const toggleWishlist = useCallback((id: string) => {
    setWishlistIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  }, []);
  const isWishlisted = useCallback((id: string) => wishlistIds.includes(id), [wishlistIds]);

  // ── Recently viewed ──────────────────────────────────────
  const addRecentlyViewed = useCallback((product: Product) => {
    setRecentlyViewed((prev) => [product, ...prev.filter((p) => p.id !== product.id)].slice(0, 6));
  }, []);

  // ── Active category (scrolls to catalog on homepage) ────
  const setActiveCategory = useCallback((cat: Category | "all") => {
    setActiveCategoryState(cat);
    // Scroll to catalog section smoothly
    setTimeout(() => {
      const el = document.getElementById("catalog-section");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, []);

  // ── Supabase CRUD ────────────────────────────────────────
  const addProduct = useCallback(
    async (product: Omit<Product, "id" | "created_at" | "updated_at">): Promise<Product | null> => {
      if (!IS_SUPABASE_CONFIGURED) {
        const newProd = { ...product, id: `local-${Date.now()}` } as Product;
        setProducts((prev) => [newProd, ...prev]);
        return newProd;
      }
      const { data, error: err } = await supabase
        .from("products")
        .insert([product])
        .select()
        .single();
      if (err) { console.error(err); return null; }
      setProducts((prev) => [data as Product, ...prev]);
      return data as Product;
    },
    []
  );

  const updateProduct = useCallback(async (updated: Product) => {
    if (!IS_SUPABASE_CONFIGURED) {
      setProducts((prev) => prev.map((p) => p.id === updated.id ? updated : p));
      return;
    }
    const { id, created_at: _c, updated_at: _u, ...payload } = updated;
    const { error: err } = await supabase.from("products").update(payload).eq("id", id);
    if (err) { console.error(err); return; }
    setProducts((prev) => prev.map((p) => p.id === updated.id ? updated : p));
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    if (!IS_SUPABASE_CONFIGURED) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return;
    }
    const { error: err } = await supabase.from("products").delete().eq("id", id);
    if (err) { console.error(err); return; }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <StoreContext.Provider
      value={{
        products, loading, error, refreshProducts,
        addProduct, updateProduct, deleteProduct,
        cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
        cartTotal, cartCount,
        wishlistIds, toggleWishlist, isWishlisted,
        recentlyViewed, addRecentlyViewed,
        searchQuery, setSearchQuery, searchResults,
        activeCategory, setActiveCategory,
        isSearchOpen, setIsSearchOpen,
        isCartOpen, setIsCartOpen,
        isMobileMenuOpen, setIsMobileMenuOpen,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
