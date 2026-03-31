"use client";
// ============================================================
// CATEGORY ICON CAROUSEL — Horizontal scroll strip
// Inspired by Legionstore.kg — Icon + Label pills
// ============================================================

import { useRef } from "react";
import { useStore } from "@/context/StoreContext";
import { categoryNavItems } from "@/data/products";

export default function CategoryCarousel() {
  const { activeCategory, setActiveCategory } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-white border-b border-[#f0f0f5] py-3 sm:py-4">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="flex gap-2 sm:gap-3 overflow-x-auto hide-scrollbar pb-1"
        >
          {categoryNavItems.map((item) => {
            const isActive = activeCategory === item.value;
            return (
              <button
                key={item.value}
                onClick={() => setActiveCategory(item.value as never)}
                className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-2xl transition-all duration-200 min-w-[68px] ${
                  isActive
                    ? "bg-[#1d1d1f] text-white shadow-md scale-95"
                    : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed] active:scale-95"
                }`}
              >
                <span className="text-xl leading-none">{item.emoji}</span>
                <span className="text-[11px] font-semibold whitespace-nowrap leading-none">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
