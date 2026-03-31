"use client";
// ============================================================
// PRODUCT CARD — 2-col on mobile, heart always visible
// ============================================================

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { formatPrice } from "@/data/products";
import { useStore } from "@/context/StoreContext";

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="15" height="15" viewBox="0 0 24 24"
    fill={filled ? "#ff3b30" : "none"}
    stroke={filled ? "#ff3b30" : "#6e6e73"} strokeWidth="2.2"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const CartIconSm = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);
const StarRating = ({ rating, count }: { rating: number; count: number }) => (
  <div className="flex items-center gap-1">
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} width="10" height="10" viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? "#f59e0b" : "none"}
          stroke="#f59e0b" strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
    <span className="text-[10px] text-[#6e6e73]">({count})</span>
  </div>
);

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export default function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const { addToCart, toggleWishlist, isWishlisted, addRecentlyViewed } = useStore();
  const [added, setAdded] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.stock_status) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  // ── LIST mode ────────────────────────────────────────────
  if (viewMode === "list") {
    return (
      <Link href={`/product/${product.id}`} onClick={() => addRecentlyViewed(product)}
        className="flex gap-4 sm:gap-5 p-4 sm:p-5 bg-white rounded-2xl border border-[#e8e8ed] hover:border-[#c7c7cc] hover:shadow-lg transition-all duration-300 group"
      >
        <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-[#f5f5f7] rounded-xl overflow-hidden">
          <Image src={product.image} alt={product.name} width={112} height={112}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        </div>
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <p className="text-[11px] text-[#0071e3] font-semibold uppercase tracking-wide">{product.category}</p>
            <h3 className="font-semibold text-[#1d1d1f] text-sm sm:text-base leading-tight mt-0.5 line-clamp-2">
              {product.name}
            </h3>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <p className="font-bold text-[#1d1d1f] text-base sm:text-lg">{formatPrice(product.price_kgs)}</p>
              <span className={`text-xs font-medium ${product.stock_status ? "text-[#34c759]" : "text-[#ff3b30]"}`}>
                {product.stock_status ? "В наличии" : "Нет в наличии"}
              </span>
            </div>
            <button onClick={handleCart} disabled={!product.stock_status}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                product.stock_status
                  ? added ? "bg-[#34c759] text-white" : "bg-[#0071e3] text-white hover:bg-[#0064cc]"
                  : "bg-[#f5f5f7] text-[#c7c7cc] cursor-not-allowed"
              }`}
            >
              {added ? "✓" : "В корзину"}
            </button>
          </div>
        </div>
      </Link>
    );
  }

  // ── GRID mode ────────────────────────────────────────────
  return (
    <div className="product-card bg-white rounded-xl sm:rounded-2xl border border-[#e8e8ed] hover:border-[#c7c7cc] overflow-hidden group relative flex flex-col">

      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.badge && (
          <span className="bg-[#0071e3] text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
            {product.badge}
          </span>
        )}
        {!product.stock_status && (
          <span className="bg-[#ff3b30] text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase">
            Нет
          </span>
        )}
      </div>

      {/* Heart — ALWAYS VISIBLE on mobile, hover on desktop */}
      <button onClick={handleWishlist}
        className={`absolute top-2 right-2 z-10 p-1.5 rounded-full transition-all ${
          wishlisted
            ? "bg-red-50 opacity-100"
            : "bg-white/90 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        } shadow-sm`}
      >
        <HeartIcon filled={wishlisted} />
      </button>

      {/* Image */}
      <Link href={`/product/${product.id}`} onClick={() => addRecentlyViewed(product)}
        className="block bg-[#f5f5f7] img-zoom"
      >
        <div className="relative pt-[82%]">
          <Image src={product.image} alt={product.name} fill
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
            className="object-contain p-4 sm:p-6"
            unoptimized
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col gap-1 flex-1">
        <p className="text-[10px] sm:text-xs text-[#0071e3] font-semibold uppercase tracking-wide">{product.category}</p>

        <Link href={`/product/${product.id}`} onClick={() => addRecentlyViewed(product)}>
          <h3 className="font-semibold text-[#1d1d1f] text-xs sm:text-sm leading-snug hover:text-[#0071e3] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {product.rating && product.review_count && (
          <StarRating rating={product.rating} count={product.review_count} />
        )}

        <div className="flex-1" />

        <div className="mt-1.5">
          <p className="font-black text-[#1d1d1f] text-sm sm:text-lg leading-tight">{formatPrice(product.price_kgs)}</p>
          <p className={`text-[10px] sm:text-xs font-medium mt-0.5 ${product.stock_status ? "text-[#34c759]" : "text-[#ff3b30]"}`}>
            {product.stock_status ? "● В наличии" : "● Нет в наличии"}
          </p>
        </div>

        <button onClick={handleCart} disabled={!product.stock_status}
          className={`mt-2 w-full py-2 sm:py-2.5 rounded-full text-[11px] sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${
            !product.stock_status
              ? "bg-[#f5f5f7] text-[#c7c7cc] cursor-not-allowed"
              : added
              ? "bg-[#34c759] text-white scale-95"
              : "bg-[#0071e3] text-white hover:bg-[#0064cc] active:scale-95"
          }`}
        >
          {added ? "✓ Добавлено" : !product.stock_status ? "Нет в наличии" : <><CartIconSm /> В корзину</>}
        </button>
      </div>
    </div>
  );
}
