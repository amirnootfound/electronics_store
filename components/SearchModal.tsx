"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/data/products";

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery, searchResults, addRecentlyViewed } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) setTimeout(() => inputRef.current?.focus(), 60);
    else setSearchQuery("");
  }, [isSearchOpen, setSearchQuery]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setIsSearchOpen(false); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [setIsSearchOpen]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex flex-col" onClick={() => setIsSearchOpen(false)}>
      <div className="bg-white w-full shadow-2xl fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Search bar */}
        <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3 bg-[#f5f5f7] rounded-2xl px-4 py-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6e6e73" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input ref={inputRef} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск — MacBook, iPhone, AirPods..."
              className="flex-1 bg-transparent text-[#1d1d1f] text-base placeholder-[#c7c7cc] outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-[#6e6e73] text-lg leading-none">×</button>
            )}
            <button onClick={() => setIsSearchOpen(false)} className="text-[#0071e3] text-sm font-medium shrink-0">
              Отмена
            </button>
          </div>
        </div>

        {/* Results */}
        {searchQuery && (
          <div className="max-w-[760px] mx-auto px-4 sm:px-6 pb-6 max-h-[55vh] overflow-y-auto">
            {searchResults.length === 0 ? (
              <div className="text-center py-10 text-[#6e6e73]">
                <p className="text-3xl mb-3">🔍</p>
                <p className="font-medium">Ничего не найдено</p>
                <p className="text-sm mt-1">Попробуйте другой запрос</p>
              </div>
            ) : (
              <>
                <p className="text-xs text-[#6e6e73] mb-3">Найдено {searchResults.length} результатов</p>
                <div className="flex flex-col gap-1">
                  {searchResults.map((p) => (
                    <Link key={p.id} href={`/product/${p.id}`}
                      onClick={() => { addRecentlyViewed(p); setIsSearchOpen(false); }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#f5f5f7] transition-colors"
                    >
                      <div className="w-14 h-14 bg-[#f5f5f7] rounded-xl overflow-hidden shrink-0">
                        <Image src={p.image} alt={p.name} width={56} height={56}
                          className="w-full h-full object-contain p-1" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#0071e3] font-medium">{p.category}</p>
                        <p className="font-semibold text-[#1d1d1f] text-sm truncate">{p.name}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-[#1d1d1f] text-sm">{formatPrice(p.price_kgs)}</p>
                        <p className={`text-xs ${p.stock_status ? "text-[#34c759]" : "text-[#ff3b30]"}`}>
                          {p.stock_status ? "В наличии" : "Нет"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {!searchQuery && (
          <div className="max-w-[760px] mx-auto px-4 sm:px-6 pb-6">
            <p className="text-xs text-[#6e6e73] font-semibold mb-3 uppercase tracking-widest">Популярные</p>
            <div className="flex flex-wrap gap-2">
              {["MacBook Pro", "iPhone 15", "AirPods Pro", "Samsung S24", "Apple Watch"].map((t) => (
                <button key={t} onClick={() => setSearchQuery(t)}
                  className="px-3 py-1.5 bg-[#f5f5f7] rounded-full text-sm text-[#1d1d1f] hover:bg-[#e8e8ed]"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
