"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import ImageGallery from "@/components/ImageGallery";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { products, addToCart, toggleWishlist, isWishlisted, addRecentlyViewed } = useStore();
  const product = products.find((p) => p.id === id);
  const [added, setAdded] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", whatsapp: "", message: "" });
  const wishlisted = isWishlisted(id);
  const router = useRouter();

  const related = products.filter((p) => p.category === product?.category && p.id !== id).slice(0, 4);

  useEffect(() => { if (product) addRecentlyViewed(product); }, [product, addRecentlyViewed]);

  if (!product) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <div className="text-5xl mb-4">🔍</div>
      <h1 className="text-xl font-bold mb-2">Товар не найден</h1>
      <Link href="/" className="mt-4 px-6 py-2.5 bg-[#0071e3] text-white rounded-full font-semibold">← В магазин</Link>
    </div>
  );

  const handleAddToCart = () => { addToCart(product); setAdded(true); setTimeout(() => setAdded(false), 2000); };

  const handleQuickContact = async () => {
    if (!contactForm.name || !contactForm.whatsapp) {
      alert("Please fill in your name and WhatsApp number");
      return;
    }

    if (!supabase) {
      alert("Service temporarily unavailable. Please try again later.");
      return;
    }

    try {
      const leadData = {
        customer_name: contactForm.name,
        whatsapp: contactForm.whatsapp,
        product_name: product.name,
        category: product.category,
        product_id: product.id,
        message: contactForm.message || `Interested in ${product.name}`,
        total_amount: product.price_kgs,
        source: "product_page" as const,
        status: "new" as const,
        priority: product.price_kgs > 50000 ? "high" : product.price_kgs > 20000 ? "medium" : "low" as const,
      };

      const { data, error } = await supabase
        .from("leads")
        .insert([leadData])
        .select()
        .single();

      if (error) {
        console.error("Error creating lead:", error);
        alert("Failed to send inquiry. Please try again.");
        return;
      }

      // Open WhatsApp with lead reference
      const msg = `🆔 Lead ID: ${data.id}\n\n🛍️ *Product Inquiry: ${product.name}*\n\n👤 ${contactForm.name}\n📱 ${contactForm.whatsapp}\n\n💰 Price: ${formatPrice(product.price_kgs)}\n\n${contactForm.message}`;
      
      window.open(`https://wa.me/996553503794?text=${encodeURIComponent(msg)}`, "_blank");
      setShowContactModal(false);
      setContactForm({ name: "", whatsapp: "", message: "" });
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send inquiry. Please try again.");
    }
  };

  return (
    <div className="fade-in">
      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4">
      <button 
      onClick={() => router.back()}
      className="flex items-center text-[#0071e3] mb-6 hover:opacity-70 transition-all font-medium"
    >
      <span className="mr-2">←</span> Назад
    </button>
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-[#6e6e73] flex-wrap">
          <Link href="/" className="hover:text-[#0071e3]">Главная</Link>
          <span>/</span>
          <span className="hover:text-[#0071e3] cursor-pointer">{product.category}</span>
          <span>/</span>
          <span className="text-[#1d1d1f] font-medium line-clamp-1">{product.name}</span>
        </nav>
      </div>

      {/* Product layout */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* Gallery */}
          <ImageGallery images={product.images?.length ? product.images : [product.image]} name={product.name} />

          {/* Details */}
          <div className="lg:sticky lg:top-20">
            <p className="text-[#0071e3] font-bold text-xs uppercase tracking-widest mb-2">{product.category}</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1d1d1f] leading-tight mb-2">{product.name}</h1>
            <p className="text-lg sm:text-xl text-[#6e6e73] mb-4 font-light">{product.tagline}</p>

            {/* Stars */}
            {product.rating && product.review_count && (
              <div className="flex items-center gap-2 mb-5">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <svg key={s} width="13" height="13" viewBox="0 0 24 24"
                      fill={s <= Math.round(product.rating!) ? "#f59e0b" : "none"}
                      stroke="#f59e0b" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-[#6e6e73]">{product.rating} ({product.review_count} отзывов)</span>
              </div>
            )}

            <p className="text-sm sm:text-base text-[#1d1d1f] leading-relaxed mb-6">{product.description}</p>

            {/* Specs */}
            {Object.keys(product.specs).length > 0 && (
              <div className="bg-[#f5f5f7] rounded-2xl p-4 sm:p-5 mb-6">
                <h3 className="font-semibold text-[#1d1d1f] mb-3 text-xs uppercase tracking-widest">Характеристики</h3>
                <dl className="space-y-2">
                  {Object.entries(product.specs).map(([k, v]) => (
                    <div key={k} className="flex items-start gap-3">
                      <dt className="text-xs text-[#6e6e73] w-32 shrink-0">{k}</dt>
                      <dd className="text-xs font-semibold text-[#1d1d1f]">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-3xl sm:text-4xl font-black text-[#1d1d1f]">{formatPrice(product.price_kgs)}</p>
                <p className={`text-xs font-semibold mt-1 ${product.stock_status ? "text-[#34c759]" : "text-[#ff3b30]"}`}>
                  {product.stock_status ? "● В наличии" : "● Нет в наличии"}
                </p>
              </div>
              {product.badge && <span className="bg-[#0071e3] text-white text-xs font-bold px-3 py-1 rounded-full">{product.badge}</span>}
            </div>

            <div className="flex gap-3 mb-3">
              <button onClick={handleAddToCart} disabled={!product.stock_status}
                className={`flex-1 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base transition-all ${
                  !product.stock_status ? "bg-[#f5f5f7] text-[#c7c7cc] cursor-not-allowed"
                  : added ? "bg-[#34c759] text-white scale-95"
                  : "bg-[#0071e3] text-white hover:bg-[#0064cc] shadow-lg shadow-blue-500/20"
                }`}
              >
                {added ? "✓ Добавлено!" : product.stock_status ? "В корзину" : "Нет в наличии"}
              </button>
              <button onClick={() => toggleWishlist(product.id)}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 flex items-center justify-center transition-all ${
                  wishlisted ? "border-[#ff3b30] bg-red-50" : "border-[#d2d2d7] hover:border-[#ff3b30]"
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24"
                  fill={wishlisted ? "#ff3b30" : "none"}
                  stroke={wishlisted ? "#ff3b30" : "#6e6e73"} strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
            <div className="flex gap-3 mb-3">
              <button onClick={() => setShowContactModal(true)}
                className="flex-1 py-3.5 sm:py-4 rounded-full border-2 border-[#25d366] text-[#25d366] font-bold text-sm sm:text-base hover:bg-[#25d366] hover:text-white transition-all flex items-center justify-center gap-2">
                Быстрый заказ
              </button>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="bg-[#f5f5f7] py-12">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] mb-6">Похожие товары</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Quick Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-md max-h-[90vh] flex flex-col fade-in-scale">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f5f5f7] shrink-0">
              <h2 className="text-base font-bold text-[#1d1d1f]">Быстрый заказ</h2>
              <button onClick={() => setShowContactModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f5f5f7] text-[#6e6e73] text-lg">×</button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              <p className="text-sm text-[#6e6e73]">Получите больше информации о <strong>{product.name}</strong></p>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">Имя *</label>
                  <input 
                    type="text" 
                    value={contactForm.name}
                    onChange={(e) => setContactForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Your name"
                    className="w-full px-3.5 py-2.5 bg-[#f5f5f7] rounded-xl border border-transparent focus:border-[#0071e3] focus:bg-white outline-none text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">WhatsApp *</label>
                  <input 
                    type="tel" 
                    value={contactForm.whatsapp}
                    onChange={(e) => setContactForm(f => ({ ...f, whatsapp: e.target.value }))}
                    placeholder="+996 700 123 456"
                    className="w-full px-3.5 py-2.5 bg-[#f5f5f7] rounded-xl border border-transparent focus:border-[#0071e3] focus:bg-white outline-none text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">Сообщение (optional)</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm(f => ({ ...f, message: e.target.value }))}
                    rows={3}
                    placeholder="Any questions about this product?"
                    className="w-full px-3.5 py-2.5 bg-[#f5f5f7] rounded-xl border border-transparent focus:border-[#0071e3] focus:bg-white outline-none text-sm resize-none"
                  />
                </div>
              </div>

              <div className="bg-[#f5f5f7] rounded-xl p-3">
                <p className="text-xs text-[#6e6e73] mb-1">💰 Price:</p>
                <p className="font-bold text-[#1d1d1f]">{formatPrice(product.price_kgs)}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-[#f5f5f7] shrink-0">
              <button 
                onClick={() => setShowContactModal(false)}
                className="flex-1 py-2.5 border border-[#d2d2d7] text-[#1d1d1f] rounded-full text-sm font-medium hover:bg-[#f5f5f7]"
              >
                Отмена
              </button>
              <button 
                onClick={handleQuickContact}
                className="flex-1 py-2.5 bg-[#25d366] text-white rounded-full text-sm font-semibold hover:bg-[#1da851] flex items-center justify-center gap-2"
              >
                Отправить в WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
