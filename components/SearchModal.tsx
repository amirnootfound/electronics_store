"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/data/products";

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery, searchResults, addRecentlyViewed, products } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Search filters state
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      setSearchQuery("");
      // Restore body scroll when modal is closed
      document.body.style.overflow = '';
    }
  }, [isSearchOpen, setSearchQuery]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setIsSearchOpen(false); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [setIsSearchOpen]);

  // Apply filters and sorting to search results
  const filteredResults = (() => {
    let filtered = searchResults;

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    // Stock filter
    if (stockFilter === "in-stock") {
      filtered = filtered.filter(p => p.stock_status);
    } else if (stockFilter === "out-of-stock") {
      filtered = filtered.filter(p => !p.stock_status);
    }

    // Price filter
    if (priceFilter !== "all") {
      const [min, max] = priceFilter.split('-').map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        filtered = filtered.filter(p => p.price_kgs >= min && p.price_kgs <= max);
      }
    }

    // Sorting
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price_kgs - b.price_kgs);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price_kgs - a.price_kgs);
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  })();

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex flex-col" onClick={() => setIsSearchOpen(false)}>
      <div className="bg-white w-full shadow-2xl fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Search bar */}
        <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 sm:gap-3 bg-[#f5f5f7] rounded-2xl px-3 sm:px-4 py-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6e6e73" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input ref={inputRef} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск — MacBook, iPhone, AirPods..."
              className="flex-1 min-w-0 bg-transparent text-[#1d1d1f] text-sm sm:text-base placeholder-[#c7c7cc] outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-[#6e6e73] text-base sm:text-lg leading-none p-1.5 sm:p-2 min-w-[32px] sm:min-w-[40px] aspect-square">
                ×
              </button>
            )}
            <div className="flex gap-1 sm:gap-2">
              <button onClick={() => setShowFilters(!showFilters)} className="text-[#0071e3] text-xs sm:text-sm font-medium p-1.5 sm:px-2.5 min-w-[60px] sm:min-w-[80px] whitespace-nowrap">
                🎚️ Фильтры
              </button>
              <button onClick={() => setIsSearchOpen(false)} className="text-[#0071e3] text-xs sm:text-sm font-medium p-1.5 sm:px-2.5 min-w-[50px] sm:min-w-[70px] whitespace-nowrap">
                Отмена
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="max-w-[700px] mx-auto px-4 sm:px-6 pb-4">
            <div className="bg-[#f8f9fa] rounded-xl p-3 sm:p-4 space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-[#1d1d1f] mb-2 sm:mb-3 text-sm sm:text-base">Фильтры поиска</h3>
              
              {/* Compact Filters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Category Filter */}
                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1">Категория</label>
                  <select 
                    value={categoryFilter} 
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-[#e8e8ed] rounded-lg text-xs sm:text-sm outline-none focus:border-[#0071e3]"
                  >
                    <option value="all">Все</option>
                    <option value="MacBook">MacBook</option>
                    <option value="iPhone">iPhone</option>
                    <option value="iPad">iPad</option>
                    <option value="Apple Watch">Watch</option>
                    <option value="AirPods">AirPods</option>
                    <option value="Accessories">Аксессуары</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Headphones">Наушники</option>
                    <option value="Monitors">Мониторы</option>
                    <option value="Gaming">Игры</option>
                  </select>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1">Цена</label>
                  <select 
                    value={priceFilter} 
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-[#e8e8ed] rounded-lg text-xs sm:text-sm outline-none focus:border-[#0071e3]"
                  >
                    <option value="all">Все цены</option>
                    <option value="0-20000">До 20К</option>
                    <option value="20000-50000">20К-50К</option>
                    <option value="50000-100000">50К-100К</option>
                    <option value="100000-999999">100К+</option>
                  </select>
                </div>

                {/* Stock Filter */}
                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1">Наличие</label>
                  <select 
                    value={stockFilter} 
                    onChange={(e) => setStockFilter(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-[#e8e8ed] rounded-lg text-xs sm:text-sm outline-none focus:border-[#0071e3]"
                  >
                    <option value="all">Все</option>
                    <option value="in-stock">В наличии</option>
                    <option value="out-of-stock">Нет</option>
                  </select>
                </div>
              </div>

              {/* Sort By - Full Width on Mobile */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#1d1d1f] mb-1">Сортировка</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white border border-[#e8e8ed] rounded-lg text-xs sm:text-sm outline-none focus:border-[#0071e3]"
                >
                  <option value="relevance">Релевантность</option>
                  <option value="name">По имени</option>
                  <option value="price-low">Цена ↑</option>
                  <option value="price-high">Цена ↓</option>
                </select>
              </div>

              {/* Clear Filters - Full Width on Mobile */}
              <div className="sm:col-span-2">
                <button 
                  onClick={() => {
                    setCategoryFilter("all");
                    setPriceFilter("all");
                    setStockFilter("all");
                    setSortBy("relevance");
                  }}
                  className="w-full py-1.5 sm:py-2 bg-[#f5f5f7] text-[#1d1d1f] rounded-lg text-xs sm:text-sm font-medium hover:bg-[#e8e8ed]"
                >
                  Сбросить
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {searchQuery && (
          <div className="max-w-[760px] mx-auto px-4 sm:px-6 pb-6 max-h-[55vh] overflow-y-auto">
            {filteredResults.length === 0 ? (
              <div className="text-center py-10 text-[#6e6e73]">
                <p className="text-3xl mb-3">🔍</p>
                <p className="font-medium">Ничего не найдено</p>
                <p className="text-sm mt-1">Попробуйте другой запрос или измените фильтры</p>
              </div>
            ) : (
              <>
                <p className="text-xs text-[#6e6e73] mb-3">
                  Найдено {filteredResults.length} результатов
                  {(categoryFilter !== "all" || priceFilter !== "all" || stockFilter !== "all" || sortBy !== "relevance") && 
                    ` (фильтры активны)`
                  }
                </p>
                <div className="flex flex-col gap-1">
                  {filteredResults.map((p) => (
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
