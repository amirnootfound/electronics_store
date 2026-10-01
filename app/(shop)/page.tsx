"use client";
// ============================================================
// HOMEPAGE — Optimized hierarchy for KG market
// 1. Hero  2. Category Carousel  3. New & Popular
// 4. Trending Now  5. Visit Us (Maps)  6. Full Catalog
// ============================================================

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/ProductCard";
import CategoryCarousel from "@/components/CategoryCarousel";
import { Category } from "@/types";
import Navbar from "@/components/Navbar";

// ── Category filter list ──────────────────────────────────
const CATEGORY_TABS: { label: string; value: Category | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Laptops", value: "Laptops" },
  { label: "Smartphones", value: "Smartphones" },
  { label: "Tablets", value: "Tablets" },
  { label: "Audio", value: "Audio" },
  { label: "Accessories", value: "Accessories" },
  { label: "Displays", value: "Displays" },
  { label: "TV & Home Theater", value: "TV & Home Theater" },
  { label: "Gaming", value: "Gaming" },
];

export default function HomePage() {
  const { products, loading, recentlyViewed, activeCategory, setActiveCategory } = useStore();
  const searchParams = useSearchParams();
  const trendingRef = useRef<HTMLDivElement>(null);

  // Set category from URL query parameter on mount
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setActiveCategory(categoryParam as Category);
    }
  }, [searchParams, setActiveCategory]);

  // Scroll to catalog section if hash is present
  useEffect(() => {
    if (window.location.hash === "#catalog-section") {
      const element = document.getElementById("catalog-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  const featured = products.filter((p) => p.new_product || p.featured).slice(0, 4);
  const trending = products.filter((p) => p.stock_status || p.new_product).slice(0, 8);

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const scrollTrending = (dir: "left" | "right") => {
    if (!trendingRef.current) return;
    trendingRef.current.scrollBy({ left: dir === "right" ? 280 : -280, behavior: "smooth" });
  };

  return (
    <>
      <div className="fade-in">

        {/* ══════════════════════════════════════════
            1. HERO SECTION
        ══════════════════════════════════════════ */}
        <section className="relative bg-gradient-to-br from-[#1d1d1f] to-[#2a2a2d] overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-5 sm:px-8 py-12 sm:py-16 lg:py-24
                          flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16
                          min-h-[72vw] sm:min-h-[60vw] lg:min-h-[480px] max-h-[680px]">

            {/* Text */}
            <div className="flex-1 max-w-xl z-10 text-center lg:text-left">
              <p className="inline-block text-[#0071e3] text-xs sm:text-sm font-semibold uppercase tracking-widest mb-4 bg-blue-500/10 px-3 py-1 rounded-full">
                New 2024
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight text-white mb-3">
                MacBook Pro.
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-white/75 mb-2">
                Mind-blowingly fast.
              </p>
              <p className="text-sm sm:text-base text-white/50 mb-6 sm:mb-8">
                M3 Pro · 22 hours battery · Liquid Retina XDR
              </p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <button
                  onClick={() => setActiveCategory("MacBook")}
                  className="px-6 py-3 bg-[#0071e3] text-white rounded-full font-semibold text-sm hover:bg-[#0064cc] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30"
                >
                  See more MacBook →
                </button>
                <Link href="#catalog-section"
                  className="px-6 py-3 border border-white/25 text-white/80 rounded-full font-semibold text-sm hover:bg-white/10 transition-all hover:scale-105">
                  See all products →
                </Link>
              </div>
            </div>

            {/* Hero image */}
            <div className="flex-1 flex justify-center items-center relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-xl">
              <Image
                src="/images/mac.png"
                alt="MacBook Pro"
                width={640}
                height={420}
                priority
                unoptimized
                className="w-full h-auto object-contain drop-shadow-2xl"
                style={{ maxHeight: "42vw", minHeight: "200px" }}
              />
            </div>
          </div>
          {/* Glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 65% 60%, rgba(0,113,227,0.18) 0%, transparent 60%)" }} />
        </section>

        {/* ══════════════════════════════════════════
            2. CATEGORY ICON CAROUSEL
        ══════════════════════════════════════════ */}
        <CategoryCarousel />

        {/* ══════════════════════════════════════════
            3. NEW & POPULAR (2×2 on mobile)
        ══════════════════════════════════════════ */}
        <section className="bg-[#f5f5f7] py-10 sm:py-14">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] sm:text-xs text-[#6e6e73] font-bold uppercase tracking-widest mb-1">New & Popular</p>
                <h2 className="text-2xl sm:text-3xl font-black text-[#1d1d1f]">New & Popular</h2>
              </div>
            </div>
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {featured.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            4. TRENDING NOW — Horizontal carousel
        ══════════════════════════════════════════ */}
        <section className="py-10 sm:py-14">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] sm:text-xs text-[#6e6e73] font-bold uppercase tracking-widest mb-1">🔥 Trending Now</p>
                <h2 className="text-2xl sm:text-3xl font-black text-[#1d1d1f]">Trending Now</h2>
              </div>
              <div className="hidden sm:flex gap-2">
                <button onClick={() => scrollTrending("left")}
                  className="w-9 h-9 rounded-full border border-[#d2d2d7] flex items-center justify-center text-[#1d1d1f] hover:border-[#0071e3] hover:text-[#0071e3] transition-colors">
                  ‹
                </button>
                <button onClick={() => scrollTrending("right")}
                  className="w-9 h-9 rounded-full border border-[#d2d2d7] flex items-center justify-center text-[#1d1d1f] hover:border-[#0071e3] hover:text-[#0071e3] transition-colors">
                  ›
                </button>
              </div>
            </div>

            <div ref={trendingRef}
              className="flex gap-3 sm:gap-4 overflow-x-auto hide-scrollbar pb-3"
            >
              {trending.map((p) => (
                <div key={p.id} className="shrink-0 w-[155px] sm:w-[200px] md:w-[220px]">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            5. Maps banner
        ══════════════════════════════════════════ */}
        <section className="py-10 sm:py-14 bg-[#f5f5f7]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
            <div className="rounded-3xl overflow-hidden bg-white border border-[#e8e8ed] shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[320px] sm:min-h-[380px]">

               {/* Map embed */}
                <div className="relative bg-[#e8e8ed] min-h-[220px]">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(process.env.NEXT_PUBLIC_STORE_ADDRESS || '')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full absolute inset-0 border-0 min-h-[220px]"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${process.env.NEXT_PUBLIC_STORE_NAME} on map`}
                  />
                </div>

                {/* Info */}
                <div className="p-8 sm:p-10 flex flex-col justify-center">
                  <p className="text-[10px] sm:text-xs text-[#0071e3] font-bold uppercase tracking-widest mb-3">
                    📍 Our Store
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#1d1d1f] mb-2 leading-tight">
                    Visit Us<br className="hidden sm:block" /> in {process.env.NEXT_PUBLIC_STORE_LOCATION}
                  </h2>
                  <p className="text-[#6e6e73] text-sm sm:text-base mb-6 leading-relaxed">
                    Official Apple dealer and Samsung partner in U.S. Live demonstration, service center and expert consultation.
                  </p>

                  <div className="space-y-3 mb-7">
                    {[
                      { icon: "📍", label: "Address", value: process.env.NEXT_PUBLIC_STORE_ADDRESS || "" },
                      { icon: "🕐", label: "Hours", value: process.env.NEXT_PUBLIC_STORE_HOURS || "" },
                      { icon: "📞", label: "Phone", value: process.env.NEXT_PUBLIC_STORE_PHONE || "" },
                      // { icon: "💬", label: "WhatsApp", value: process.env.NEXT_PUBLIC_STORE_WHATSAPP },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-3">
                        <span className="text-base mt-0.5">{item.icon}</span>
                        <div>
                          <p className="text-[10px] text-[#6e6e73] font-medium">{item.label}</p>
                          <p className="text-sm font-semibold text-[#1d1d1f]">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <a
                      href={"https://maps.google.com/?q=" + process.env.NEXT_PUBLIC_STORE_ADDRESS}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-[#0071e3] text-white rounded-full font-semibold text-sm hover:bg-[#0064cc] transition-colors flex items-center gap-2"
                    >
                      📍 Route in Google Maps
                    </a>
                    <a
                      href={"https://wa.me/" + process.env.NEXT_PUBLIC_STORE_PHONE?.replace(/\D/g, '')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-[#25d366] text-white rounded-full font-semibold text-sm hover:bg-[#1da851] transition-colors flex items-center gap-2"
                    >
                      💬 WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            6. FULL CATALOG with category filtering
        ══════════════════════════════════════════ */}
        <section id="catalog-section" className="max-w-[1440px] mx-auto px-4 sm:px-6 pb-20 pt-10 sm:pt-14">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-[10px] sm:text-xs text-[#6e6e73] font-bold uppercase tracking-widest mb-2">Full catalog</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1d1d1f] leading-tight">
              Choose your device
            </h2>
            <p className="text-[#6e6e73] mt-2 text-sm sm:text-base">
              Official warranty · Fast delivery nationwide
            </p>
          </div>

          {/* Category filter tabs (scrollable on mobile) */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-5 sm:mb-6 sm:flex-wrap sm:justify-center">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveCategory(tab.value)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all shrink-0 ${
                  activeCategory === tab.value
                    ? "bg-[#1d1d1f] text-white shadow-md"
                    : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Count */}
          <p className="text-xs sm:text-sm text-[#6e6e73] mb-4">{filtered.length} products</p>

          {/* Grid — 2 cols mobile, 3 tablet, 4 desktop */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-[#f5f5f7] rounded-2xl h-72 animate-pulse" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-20 text-[#6e6e73]">
              <div className="text-5xl mb-4">📦</div>
              <p className="text-xl font-semibold">No products found</p>
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════
            RECENTLY VIEWED
        ══════════════════════════════════════════ */}
        {recentlyViewed.length > 0 && (
          <section className="bg-[#f5f5f7] py-10 sm:py-14">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] mb-6">Recently Viewed</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
                {recentlyViewed.map((p) => (
                  <Link key={p.id} href={`/product/${p.id}`}
                    className="bg-white rounded-2xl p-3 text-center hover:shadow-md transition-shadow group"
                  >
                    <Image 
                      src={p.image || "https://placehold.co/400x400?text=No+Image"} 
                      alt={p.name}
                      width={80} 
                      height={80}
                      className="w-full aspect-square object-contain mb-2 group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                    <p className="text-[10px] sm:text-xs font-semibold text-[#1d1d1f] line-clamp-2 leading-tight">{p.name}</p>
                    <p className="text-[10px] text-[#0071e3] font-bold mt-0.5">{Math.round(p.price_kgs / 1000)}K KGS</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Trust badges */}
        <section className="py-10 sm:py-14 max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: "🛡️", title: "Official Warranty", desc: "1 year on all devices" },
              { icon: "🚚", title: "Fast Delivery", desc: "Across Bishkek — 1-2 days" },
              { icon: "💳", title: "0% Installment", desc: "Up to 12 months" },
              { icon: "🔄", title: "14-Day Returns", desc: "No questions asked" },
            ].map((b) => (
              <div key={b.title} className="flex flex-col items-center gap-2">
                <div className="text-3xl sm:text-4xl">{b.icon}</div>
                <p className="font-semibold text-[#1d1d1f] text-xs sm:text-sm">{b.title}</p>
                <p className="text-xs text-[#6e6e73]">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
