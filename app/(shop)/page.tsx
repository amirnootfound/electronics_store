"use client";
// ============================================================
// HOMEPAGE — Optimized hierarchy for KG market
// 1. Hero  2. Category Carousel  3. New & Popular
// 4. Trending Now  5. Visit Us (Maps)  6. Full Catalog
// ============================================================

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/ProductCard";
import CategoryCarousel from "@/components/CategoryCarousel";
import { Category } from "@/types";
import Navbar from "@/components/Navbar";

// ── Category filter list ──────────────────────────────────
const CATEGORY_TABS: { label: string; value: Category | "all" }[] = [
  { label: "Все", value: "all" },
  { label: "MacBook", value: "MacBook" },
  { label: "iPhone", value: "iPhone" },
  { label: "iPad", value: "iPad" },
  { label: "Watch", value: "Apple Watch" },
  { label: "AirPods", value: "AirPods" },
  { label: "Samsung", value: "Samsung" },
  { label: "Headphones", value: "Headphones" },
  { label: "Monitors", value: "Monitors" },
  { label: "Gaming", value: "Gaming" },
];

export default function HomePage() {
  const { products, loading, recentlyViewed, activeCategory, setActiveCategory } = useStore();
  const trendingRef = useRef<HTMLDivElement>(null);

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
                Новинка 2024
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight text-white mb-3">
                MacBook Pro.
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-white/75 mb-2">
                Mind-blowingly fast.
              </p>
              <p className="text-sm sm:text-base text-white/50 mb-6 sm:mb-8">
                M3 Pro · 22 часа батарея · Liquid Retina XDR
              </p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <button
                  onClick={() => setActiveCategory("MacBook")}
                  className="px-6 py-3 bg-[#0071e3] text-white rounded-full font-semibold text-sm hover:bg-[#0064cc] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30"
                >
                  Смотреть MacBook →
                </button>
                <Link href="#catalog-section"
                  className="px-6 py-3 border border-white/25 text-white/80 rounded-full font-semibold text-sm hover:bg-white/10 transition-all hover:scale-105">
                  Весь каталог
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
                <p className="text-[10px] sm:text-xs text-[#6e6e73] font-bold uppercase tracking-widest mb-1">Подборка</p>
                <h2 className="text-2xl sm:text-3xl font-black text-[#1d1d1f]">Новинки и популярные</h2>
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
                <p className="text-[10px] sm:text-xs text-[#6e6e73] font-bold uppercase tracking-widest mb-1">🔥 Хиты продаж</p>
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
            5. VISIT US IN BISHKEK — Maps banner
        ══════════════════════════════════════════ */}
        <section className="py-10 sm:py-14 bg-[#f5f5f7]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
            <div className="rounded-3xl overflow-hidden bg-white border border-[#e8e8ed] shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[320px] sm:min-h-[380px]">

                {/* Map embed */}
                <div className="relative bg-[#e8e8ed] min-h-[220px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2924.8844!2d74.5975!3d42.8746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x389eb6c4e1234567%3A0xabcdef1234567890!2z0KHQvtCy0LXRgtGB0LrQuNC5!5e0!3m2!1sru!2skg!4v1700000000000"
                    className="w-full h-full absolute inset-0 border-0 min-h-[220px]"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="TechStore KG на карте"
                  />
                </div>

                {/* Info */}
                <div className="p-8 sm:p-10 flex flex-col justify-center">
                  <p className="text-[10px] sm:text-xs text-[#0071e3] font-bold uppercase tracking-widest mb-3">
                    📍 Наш магазин
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#1d1d1f] mb-2 leading-tight">
                    Посетите нас<br className="hidden sm:block" /> в Бишкеке
                  </h2>
                  <p className="text-[#6e6e73] text-sm sm:text-base mb-6 leading-relaxed">
                    Официальный дилер Apple и партнёр Samsung в Кыргызстане. Живая демонстрация, сервисный центр и консультация специалиста.
                  </p>

                  <div className="space-y-3 mb-7">
                    {[
                      { icon: "📍", label: "Адрес", value: "г. Бишкек, пр. Чуй 123, ТЦ Бишкек Парк, 2 этаж" },
                      { icon: "🕐", label: "Режим работы", value: "Пн–Вс: 10:00 – 21:00" },
                      { icon: "📞", label: "Телефон", value: "+996 700 123 456" },
                      { icon: "💬", label: "WhatsApp", value: "+996 700 123 456" },
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
                      href="https://maps.google.com/?q=Бишкек+пр.Чуй+123"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-[#0071e3] text-white rounded-full font-semibold text-sm hover:bg-[#0064cc] transition-colors flex items-center gap-2"
                    >
                      📍 Маршрут в Google Maps
                    </a>
                    <a
                      href="https://wa.me/996700123456"
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
            <p className="text-[10px] sm:text-xs text-[#6e6e73] font-bold uppercase tracking-widest mb-2">Весь ассортимент</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1d1d1f] leading-tight">
              Выберите устройство
            </h2>
            <p className="text-[#6e6e73] mt-2 text-sm sm:text-base">
              Официальная гарантия · Быстрая доставка по Кыргызстану
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
          <p className="text-xs sm:text-sm text-[#6e6e73] mb-4">{filtered.length} товаров</p>

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
              <p className="text-xl font-semibold">Товары не найдены</p>
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════
            RECENTLY VIEWED
        ══════════════════════════════════════════ */}
        {recentlyViewed.length > 0 && (
          <section className="bg-[#f5f5f7] py-10 sm:py-14">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] mb-6">Недавно просмотренные</h2>
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
                    <p className="text-[10px] text-[#0071e3] font-bold mt-0.5">{Math.round(p.price_kgs / 1000)}K сом</p>
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
              { icon: "🛡️", title: "Официальная гарантия", desc: "1 год на все устройства" },
              { icon: "🚚", title: "Быстрая доставка", desc: "По Бишкеку — 1-2 дня" },
              { icon: "💳", title: "Рассрочка 0%", desc: "До 12 месяцев" },
              { icon: "🔄", title: "Возврат 14 дней", desc: "Без вопросов" },
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
