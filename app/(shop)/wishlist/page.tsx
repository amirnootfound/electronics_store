"use client";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const { products, wishlistIds } = useStore();
  const wishlisted = products.filter((p) => wishlistIds.includes(p.id));
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 sm:py-12 fade-in">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-black text-[#1d1d1f]">Избранное</h1>
        <p className="text-[#6e6e73] mt-1 text-sm">{wishlisted.length > 0 ? `${wishlisted.length} товаров` : "Список пуст"}</p>
      </div>
      {wishlisted.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-5">❤️</div>
          <h2 className="text-xl font-bold text-[#1d1d1f] mb-2">Список желаний пуст</h2>
          <p className="text-[#6e6e73] text-sm mb-7">Нажмите ♡ на карточке товара</p>
          <Link href="/" className="px-7 py-3 bg-[#0071e3] text-white rounded-full font-semibold hover:bg-[#0064cc] text-sm">В магазин</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {wishlisted.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
