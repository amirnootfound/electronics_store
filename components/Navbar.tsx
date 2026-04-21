"use client";
// ============================================================
// NAVBAR — Mobile-first Apple-style
// Mobile: [Burger] [Logo] [Search+Cart]
// Desktop: [Logo] [Nav Links] [Search+Wishlist+Cart]
// ============================================================

import { useState, useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { categoryNavItems } from "@/data/products";

// ── Icons ──────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
  </svg>
);
const HeartIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const CartIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);
const BurgerIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const desktopLinks = [
  { label: "MacBook", cat: "MacBook" },
  { label: "iPhone", cat: "iPhone" },
  { label: "iPad", cat: "iPad" },
  { label: "Watch", cat: "Apple Watch" },
  { label: "AirPods", cat: "AirPods" },
  { label: "Все", cat: "all" },
];

export default function Navbar() {
  const {
    cartCount, wishlistIds,
    setIsSearchOpen, setIsCartOpen,
    isMobileMenuOpen, setIsMobileMenuOpen,
    setActiveCategory, activeCategory,
  } = useStore();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat as never);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`glass-header fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${scrolled ? "shadow-sm" : ""}`}>

        {/* ── Top bar (shared) ── */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

          {/* ── Mobile LEFT: Burger ── */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 -ml-1 rounded-xl text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <CloseIcon /> : <BurgerIcon />}
          </button>

          {/* ── Logo — CENTER on mobile, LEFT on desktop ── */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-[#1d1d1f] text-lg absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
          >
            <span className="text-2xl">⌘</span>
            <span className="hidden sm:block tracking-tight text-[15px]">TechStore KG</span>
          </Link>

          {/* ── Desktop nav links ── */}
          <nav className="hidden lg:flex items-center gap-0.5 mx-auto">
            {desktopLinks.map((l) => (
              <Link
                key={l.cat}
                href={l.cat === "all" ? "/" : `/?category=${l.cat}`}
                onClick={() => handleCategoryClick(l.cat)}
                className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                  activeCategory === l.cat
                    ? "text-[#0071e3] bg-blue-50"
                    : "text-[#1d1d1f] hover:text-[#0071e3] hover:bg-[#f5f5f7]"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* ── Right icons ── */}
          <div className="flex items-center gap-0.5">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-xl text-[#1d1d1f] hover:bg-[#f5f5f7] hover:text-[#0071e3] transition-colors"
              aria-label="Search"
            >
              <SearchIcon />
            </button>

            {/* Wishlist — desktop only */}
            <Link
              href="/wishlist"
              className="relative p-2 rounded-xl text-[#1d1d1f] hover:bg-[#f5f5f7] hover:text-[#0071e3] transition-colors hidden sm:flex items-center"
              aria-label="Wishlist"
            >
              <HeartIcon />
              {wishlistIds.length > 0 && (
                <span className="badge-pulse absolute -top-0.5 -right-0.5 bg-[#ff3b30] text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 leading-none">
                  {wishlistIds.length > 9 ? "9+" : wishlistIds.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl text-[#1d1d1f] hover:bg-[#f5f5f7] hover:text-[#0071e3] transition-colors"
              aria-label="Cart"
            >
              <CartIcon />
              {cartCount > 0 && (
                <span className="badge-pulse absolute -top-0.5 -right-0.5 bg-[#ff3b30] text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 leading-none">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile Drawer Menu ── */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#f0f0f5] bg-white/98 backdrop-blur-xl fade-in">
            <div className="max-w-[1440px] mx-auto px-4 py-3">
              <p className="text-[10px] text-[#6e6e73] font-bold uppercase tracking-widest px-3 mb-2">
                Категории
              </p>
              <nav className="grid grid-cols-2 gap-1">
                {categoryNavItems.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => handleCategoryClick(item.value)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium text-sm transition-colors ${
                      activeCategory === item.value
                        ? "bg-[#0071e3] text-white"
                        : "hover:bg-[#f5f5f7] text-[#1d1d1f]"
                    }`}
                  >
                    <span className="text-lg">{item.emoji}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
              {/* Wishlist link in mobile menu */}
              <Link
                href="/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 mt-1 rounded-xl hover:bg-[#f5f5f7] text-sm font-medium text-[#1d1d1f]"
              >
                <span className="text-lg">❤️</span>
                Избранное
                {wishlistIds.length > 0 && (
                  <span className="ml-auto bg-[#ff3b30] text-white text-xs font-bold rounded-full px-2 py-0.5">
                    {wishlistIds.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Spacer */}
      <div className="h-14" />
    </>
  );
}
