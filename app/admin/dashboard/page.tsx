"use client";
// ============================================================
// ADMIN DASHBOARD — Supabase-powered CRUD with image upload
// ============================================================

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import { Product, Category } from "@/types";
import { formatPrice } from "@/data/products";
import ImageUploader from "@/components/admin/ImageUploader";

const CATEGORIES: Category[] = [
  "MacBook","iPhone","iPad","Apple Watch","AirPods",
  "Accessories","Samsung","Headphones","Monitors","Gaming",
];

const emptyForm = (): Omit<Product, "id" | "created_at" | "updated_at"> => ({
  name: "", tagline: "", price_kgs: 0, currency: "KGS",
  image: "", images: [], category: "iPhone",
  description: "", specs: {}, stock_status: true,
  featured: false, new_product: false, badge: "", rating: 0, review_count: 0,
});

// ── Stat Card ──────────────────────────────────────────────
function StatCard({ label, value, icon, colorClass }: { label: string; value: string | number; icon: string; colorClass: string }) {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 border border-[#e8e8ed] hover:shadow-lg transition-all duration-200 min-h-[80px] sm:min-h-[96px] active:scale-[0.98] cursor-pointer">
      <div className={`w-12 h-12 sm:w-12 sm:h-12 ${colorClass} rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-2xl shrink-0 font-bold`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-lg sm:text-2xl font-black text-[#1d1d1f] whitespace-nowrap overflow-hidden text-ellipsis leading-tight" style={{ fontSize: 'clamp(1.125rem, 5vw, 2rem)' }}>
          {value}
        </p>
        <p className="text-xs sm:text-sm text-[#6e6e73] line-clamp-1 mt-1 font-medium">{label}</p>
      </div>
    </div>
  );
}

// ── Product Form Modal ─────────────────────────────────────
function ProductModal({ product, onSave, onClose }: {
  product: Partial<Product> | null;
  onSave: (data: Omit<Product, "id" | "created_at" | "updated_at"> & { id?: string }) => void;
  onClose: () => void;
}) {
  const isNew = !product?.id;
  const [form, setForm] = useState<Omit<Product, "id" | "created_at" | "updated_at"> & { id?: string }>(
    product ? { ...emptyForm(), ...product } : emptyForm()
  );
  const [specsText, setSpecsText] = useState(
    product?.specs ? Object.entries(product.specs).map(([k, v]) => `${k}: ${v}`).join("\n") : ""
  );
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "media" | "specs">("basic");

  const parseSpecs = (text: string): Record<string, string> => {
    const r: Record<string, string> = {};
    text.split("\n").forEach((line) => {
      const idx = line.indexOf(":");
      if (idx > -1) r[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    });
    return r;
  };

  const handleImageChange = useCallback((urls: string[]) => {
    setForm((f) => ({ ...f, images: urls, image: urls[0] || "" }));
  }, []);

  const handleSave = async () => {
    if (!form.name || !form.price_kgs) { alert("Заполните название и цену"); return; }
    setSaving(true);
    await onSave({ ...form, specs: parseSpecs(specsText) });
    setSaving(false);
  };

  const tabs = [
    { id: "basic", label: "Основное" },
    { id: "media", label: "Фотографии" },
    { id: "specs", label: "Характеристики" },
  ] as const;

  return (
    <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-2xl max-h-[90vh] flex flex-col fade-in-scale">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f5f5f7] shrink-0">
          <h2 className="text-base font-bold text-[#1d1d1f]">
            {isNew ? "➕ Добавить товар" : "✏️ Редактировать товар"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f5f5f7] text-[#6e6e73] text-lg">×</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#f5f5f7] px-6 shrink-0">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === t.id
                  ? "border-[#0071e3] text-[#0071e3]"
                  : "border-transparent text-[#6e6e73] hover:text-[#1d1d1f]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* BASIC TAB */}
          {activeTab === "basic" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">Название *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder='MacBook Pro 16"'
                    className="w-full px-3.5 py-2.5 bg-[#f5f5f7] rounded-xl border border-transparent focus:border-[#0071e3] focus:bg-white outline-none text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">Слоган</label>
                  <input type="text" value={form.tagline} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
                    placeholder="Mind-blowingly fast."
                    className="w-full px-3.5 py-2.5 bg-[#f5f5f7] rounded-xl border border-transparent focus:border-[#0071e3] focus:bg-white outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">Цена (KGS) *</label>
                  <input type="number" value={form.price_kgs || ""} onChange={(e) => setForm((f) => ({ ...f, price_kgs: Number(e.target.value) }))}
                    placeholder="89900"
                    className="w-full px-3.5 py-2.5 bg-[#f5f5f7] rounded-xl border border-transparent focus:border-[#0071e3] focus:bg-white outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">Категория</label>
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Category }))}
                    className="w-full px-3.5 py-2.5 bg-[#f5f5f7] rounded-xl border border-transparent focus:border-[#0071e3] focus:bg-white outline-none text-sm">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">Бейдж</label>
                  <input type="text" value={form.badge || ""} onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
                    placeholder="New / Popular / Sale"
                    className="w-full px-3.5 py-2.5 bg-[#f5f5f7] rounded-xl border border-transparent focus:border-[#0071e3] focus:bg-white outline-none text-sm" />
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <ToggleSwitch checked={form.stock_status} onChange={(v) => setForm((f) => ({ ...f, stock_status: v }))} color="green" />
                  <span className="text-sm font-medium text-[#1d1d1f]">{form.stock_status ? "✅ В наличии" : "❌ Нет в наличии"}</span>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">Описание</label>
                  <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={3} placeholder="Подробное описание..."
                    className="w-full px-3.5 py-2.5 bg-[#f5f5f7] rounded-xl border border-transparent focus:border-[#0071e3] focus:bg-white outline-none text-sm resize-none" />
                </div>
                <div className="flex items-center gap-3">
                  <ToggleSwitch checked={!!form.featured} onChange={(v) => setForm((f) => ({ ...f, featured: v }))} color="blue" />
                  <span className="text-sm font-medium text-[#1d1d1f]"></span>
                </div>
                <div className="flex items-center gap-3">
                  <ToggleSwitch checked={!!form.new_product} onChange={(v) => setForm((f) => ({ ...f, new_product: v }))} color="blue" />
                  <span className="text-sm font-medium text-[#1d1d1f]">Новый</span>
                </div>
              </div>
            </div>
          )}

          {/* MEDIA TAB */}
          {activeTab === "media" && (
            <div>
              <p className="text-xs text-[#6e6e73] mb-4">
                Загружайте несколько изображений товара. Первое — главное фото в каталоге.
                {" "}Файлы автоматически сохраняются в Supabase Storage.
              </p>
              <ImageUploader images={form.images} onChange={handleImageChange} />
            </div>
          )}

          {/* SPECS TAB */}
          {activeTab === "specs" && (
            <div>
              <label className="block text-xs font-semibold text-[#1d1d1f] mb-2">
                Характеристики — каждая с новой строки, формат: <code className="bg-[#f5f5f7] px-1 rounded text-[10px]">Ключ: Значение</code>
              </label>
              <textarea
                value={specsText}
                onChange={(e) => setSpecsText(e.target.value)}
                rows={10}
                placeholder={"Chip: Apple M3 Pro\nMemory: 18GB Unified Memory\nStorage: 512GB SSD\nDisplay: 16.2-inch Liquid Retina XDR\nBattery: Up to 22 hours"}
                className="w-full px-3.5 py-3 bg-[#f5f5f7] rounded-xl border border-transparent focus:border-[#0071e3] focus:bg-white outline-none text-xs font-mono resize-none leading-relaxed"
              />
              <div className="mt-3 bg-[#f9f9fb] rounded-xl p-4">
                <p className="text-xs font-semibold text-[#6e6e73] mb-2">Предпросмотр:</p>
                <dl className="space-y-1.5">
                  {Object.entries(parseSpecs(specsText)).map(([k, v]) => (
                    <div key={k} className="flex gap-3 text-xs">
                      <dt className="text-[#6e6e73] w-28 shrink-0">{k}</dt>
                      <dd className="font-medium text-[#1d1d1f]">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-[#f5f5f7] shrink-0">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-[#d2d2d7] text-[#1d1d1f] rounded-full text-sm font-medium hover:bg-[#f5f5f7]">
            Отмена
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 bg-[#0071e3] text-white rounded-full text-sm font-semibold hover:bg-[#0064cc] disabled:opacity-60 disabled:cursor-not-allowed">
            {saving ? "Сохранение..." : isNew ? "Добавить товар" : "Сохранить изменения"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Mobile Product Card Component ────────────────────────────────
function MobileProductCard({ product, onEdit, onToggleStock, onDelete, deleteConfirm }: {
  product: Product;
  onEdit: () => void;
  onToggleStock: () => void;
  onDelete: () => void;
  deleteConfirm: boolean;
}) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-[#e8e8ed] p-4 space-y-3 hover:border-[#0071e3] transition-colors">
      {/* Product Header */}
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 bg-[#f5f5f7] rounded-xl overflow-hidden shrink-0">
          {product.image && (
            <Image src={product.image} alt={product.name} width={64} height={64}
              className="w-full h-full object-contain p-2" unoptimized />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-[#1d1d1f] text-sm sm:text-base line-clamp-2">{product.name}</h3>
          <p className="text-xs text-[#6e6e73] line-clamp-1 mt-1">{product.tagline}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {product.badge && <span className="bg-[#0071e3] text-white text-[8px] font-bold px-2 py-1 rounded-full">{product.badge}</span>}
            {product.featured && <span className="bg-amber-100 text-amber-700 text-[8px] font-bold px-2 py-1 rounded-full">Featured</span>}
            <span className="bg-[#f5f5f7] text-[#1d1d1f] text-[8px] font-medium px-2 py-1 rounded-full">{product.category}</span>
          </div>
        </div>
      </div>

      {/* Price and Status */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-[#1d1d1f]">{formatPrice(product.price_kgs)}</p>
          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
            product.stock_status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
          }`}>
            {product.stock_status ? "В наличии" : "Не в наличии"}
          </span>
        </div>
        <button
          onClick={() => setShowMore(!showMore)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f5f5f7] text-[#6e6e73]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      </div>

      {/* Action Buttons */}
      {showMore && (
        <div className="flex gap-2 pt-2 border-t border-[#f5f5f7]">
          <button
            onClick={onEdit}
            className="flex-1 py-2.5 text-sm font-medium border border-[#d2d2d7] text-[#1d1d1f] rounded-lg hover:border-[#0071e3] hover:text-[#0071e3] transition-colors min-h-[44px]"
          >
            Изменить
          </button>
          <button
            onClick={onToggleStock}
            className={`flex-1 py-2.5 text-sm font-medium border rounded-lg transition-colors min-h-[44px] ${
              product.stock_status 
                ? 'border-red-200 text-red-600 bg-red-50 hover:bg-red-100' 
                : 'border-green-200 text-green-600 bg-green-50 hover:bg-green-100'
            }`}
          >
            {product.stock_status ? "Не в наличии" : "В наличии"}
          </button>
          {deleteConfirm ? (
            <div className="flex gap-2">
              <button
                onClick={onDelete}
                className="flex-1 py-2.5 text-sm font-bold bg-[#ff3b30] text-white rounded-lg min-h-[44px]"
              >
                Delete
              </button>
              <button
                onClick={() => setShowMore(false)}
                className="flex-1 py-2.5 text-sm font-medium bg-[#f5f5f7] text-[#1d1d1f] rounded-lg min-h-[44px]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowMore(false)}
              className="flex-1 py-2.5 text-sm text-[#ff3b30] border border-[#ff3b30] rounded-lg bg-red-20 min-h-[44px]"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Toggle switch component ────────────────────────────────
function ToggleSwitch({ checked, onChange, color }: { checked: boolean; onChange: (v: boolean) => void; color: "green" | "blue" }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex w-11 h-6 rounded-full transition-colors ${
        checked ? (color === "green" ? "bg-[#34c759]" : "bg-[#0071e3]") : "bg-[#e8e8ed]"
      }`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
    </button>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const { products, loading, addProduct, updateProduct, deleteProduct, refreshProducts } = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null);
  const [searchQ, setSearchQ] = useState("");
  const [activeTab, setActiveTab] = useState<"products" | "stats">("products");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [catFilter, setCatFilter] = useState<Category | "all">("all");

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("adminAuth") !== "true") {
      router.replace("/admin");
    }
  }, [router]);

  // Refresh products on mount
  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = async (data: Omit<Product, "id" | "created_at" | "updated_at"> & { id?: string }) => {
    if (data.id) {
      await updateProduct(data as Product);
      showNotification("✅ Товар обновлён");
    } else {
      await addProduct(data);
      showNotification("✅ Товар добавлен");
    }
    setModalOpen(false);
    setEditProduct(null);
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    setDeleteConfirm(null);
    showNotification("🗑️ Товар удалён");
  };

  const handleToggleStock = async (product: Product) => {
    await updateProduct({ ...product, stock_status: !product.stock_status });
    showNotification(`${!product.stock_status ? "✅" : "❌"} Статус обновлён`);
  };

  const filtered = products.filter((p) => {
    const matchQ = p.name.toLowerCase().includes(searchQ.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQ.toLowerCase());
    const matchCat = catFilter === "all" || p.category === catFilter;
    return matchQ && matchCat;
  });

  const inStock = products.filter((p) => p.stock_status).length;
  const totalValue = products.reduce((s, p) => s + p.price_kgs, 0);

  return (
    <div className="min-h-screen bg-[#f5f5f7]">

      {/* ── Notification toast ── */}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] bg-[#1d1d1f] text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-xl fade-in">
          {notification}
        </div>
      )}

      {/* ── Header ── */}
      <header className="glass-header sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-2 sm:px-6 h-14 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="hidden sm:block">
                <h1 className="font-bold text-[#1d1d1f] text-base leading-none">TechStore KG</h1>
                <p className="text-[10px] text-[#6e6e73]">Admin Panel</p>
              </div>
              <div className="sm:hidden">
                <h1 className="font-bold text-[#1d1d1f] text-base">TechStore KG</h1>
              </div>
            </div>
          </div>
          
          {/* Center Section - Tab Buttons */}
          <div className="hidden md:flex items-center gap-1">
            {(["products", "stats"] as const).map((t) => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === t ? "bg-[#1d1d1f] text-white" : "text-[#6e6e73] hover:text-[#1d1d1f]"
                }`}
              >
                {t === "products" ? "Товары" : "Аналитика"}
              </button>
            ))}
            <button 
              onClick={() => router.push("/admin/leads")}
              className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium text-[#0071e3] hover:text-[#0064cc] transition-colors"
            >
              Leads
            </button>
          </div>
          
          {/* Right Section - Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile Burger Menu */}
            <div className="md:hidden">
              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f5f5f7] text-[#6e6e73]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              
              {/* Mobile Menu Dropdown */}
              {showMobileMenu && (
                <div className="absolute top-14 right-2 z-[300] bg-white rounded-xl shadow-xl border border-[#e8e8ed] p-2 min-w-[180px]">
                  <button 
                    onClick={() => setShowMobileMenu(false)}
                    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-[#f5f5f7] text-[#6e6e73] hover:bg-[#e8e8ed] transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                  
                  <div className="space-y-1 pt-2">
                    <button 
                      onClick={() => { refreshProducts(); setShowMobileMenu(false); }}
                      className="w-full px-3 py-2.5 text-left text-sm font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-lg transition-colors"
                    >
                      Refresh
                    </button>
                    <button 
                      onClick={() => { router.push("/admin/leads"); setShowMobileMenu(false); }}
                      className="w-full px-3 py-2.5 text-left text-sm font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-lg transition-colors"
                    >
                      Leads
                    </button>
                    <button 
                      onClick={() => { window.open("/", "_blank"); setShowMobileMenu(false); }}
                      className="w-full px-3 py-2.5 text-left text-sm font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-lg transition-colors"
                    >
                      Магазин
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-1 sm:gap-2">
              <button onClick={refreshProducts} className="text-xs text-[#6e6e73] hover:text-[#0071e3] p-1.5 rounded-full hover:bg-[#f5f5f7] whitespace-nowrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 4v6h-6"/>
                  <path d="M1 20v-6h6"/>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Tab Bar */}
        <div className="md:hidden border-t border-[#f5f5f7] bg-white">
          <div className="max-w-[1600px] mx-auto px-2 py-2">
            <div className="flex gap-1 overflow-x-auto">
              {(["products", "stats"] as const).map((t) => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={`px-3 py-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                    activeTab === t ? "bg-[#1d1d1f] text-white" : "text-[#6e6e73] hover:text-[#1d1d1f]"
                  }`}
                >
                  {t === "products" ? "Товары" : "Аналитика"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard label="Всего товаров" value={products.length} icon="📦" colorClass="bg-blue-50" />
          <StatCard label="В наличии" value={inStock} icon="✅" colorClass="bg-green-50" />
          <StatCard label="Нет в наличии" value={products.length - inStock} icon="❌" colorClass="bg-red-50" />
          <StatCard label="Стоимость каталога" value={`${(totalValue / 1000).toFixed(0)}K`} icon="💰" colorClass="bg-yellow-50" />
        </div>

        {/* ── ANALYTICS TAB ── */}
        {activeTab === "stats" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 fade-in">
            <div className="bg-white rounded-2xl border border-[#e8e8ed] p-6">
              <h3 className="font-bold text-[#1d1d1f] mb-5">Товары по категориям</h3>
              {CATEGORIES.map((cat) => {
                const count = products.filter((p) => p.category === cat).length;
                if (!count) return null;
                return (
                  <div key={cat} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-[#1d1d1f]">{cat}</span>
                      <span className="text-[#6e6e73]">{count}</span>
                    </div>
                    <div className="h-2 bg-[#f5f5f7] rounded-full overflow-hidden">
                      <div className="h-full bg-[#0071e3] rounded-full" style={{ width: `${(count / products.length) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="bg-white rounded-2xl border border-[#e8e8ed] p-6">
              <h3 className="font-bold text-[#1d1d1f] mb-5">Топ-5 по цене</h3>
              {[...products].sort((a, b) => b.price_kgs - a.price_kgs).slice(0, 5).map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 mb-3">
                  <span className="w-6 h-6 bg-[#f5f5f7] rounded-full flex items-center justify-center text-xs font-bold text-[#6e6e73]">{i + 1}</span>
                  <span className="flex-1 text-sm text-[#1d1d1f] truncate">{p.name}</span>
                  <span className="text-sm font-bold text-[#0071e3] shrink-0">{formatPrice(p.price_kgs)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PRODUCTS TABLE ── */}
        {activeTab === "products" && (
          <div className="bg-white rounded-2xl border border-[#e8e8ed] overflow-hidden fade-in">
            {/* Table toolbar */}
            <div className="p-4 sm:p-5 border-b border-[#f5f5f7] space-y-3">
              {/* Header */}
              <h2 className="text-base sm:text-lg font-bold text-[#1d1d1f]">
                Товары
                <span className="ml-2 text-xs font-normal text-[#6e6e73]">({filtered.length} of {products.length})</span>
              </h2>
              
              {/* Mobile Toolbar */}
              <div className="md:hidden space-y-2">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={searchQ} 
                    onChange={(e) => setSearchQ(e.target.value)}
                    placeholder="Search..."
                    className="flex-1 px-3 py-2 bg-[#f5f5f7] rounded-xl text-sm outline-none focus:bg-white border border-transparent focus:border-[#0071e3] min-h-[44px]"
                  />
                  <button 
                    onClick={() => { setEditProduct(null); setModalOpen(true); }}
                    className="px-4 py-2 bg-[#0071e3] text-white rounded-xl text-sm font-semibold hover:bg-[#0064cc] flex items-center gap-1 min-h-[44px] whitespace-nowrap"
                  >
                    + Add
                  </button>
                </div>
                <select 
                  value={catFilter} 
                  onChange={(e) => setCatFilter(e.target.value as never)}
                  className="w-full px-3 py-2 bg-[#f5f5f7] rounded-xl text-sm outline-none focus:bg-white border border-transparent focus:border-[#0071e3] min-h-[44px]"
                >
                  <option value="all">Все</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Desktop Toolbar */}
              <div className="hidden md:flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <input 
                    type="text" 
                    value={searchQ} 
                    onChange={(e) => setSearchQ(e.target.value)}
                    placeholder="Search..."
                    className="w-48 px-3 py-2 bg-[#f5f5f7] rounded-xl text-sm outline-none focus:bg-white border border-transparent focus:border-[#0071e3]"
                  />
                  <select 
                    value={catFilter} 
                    onChange={(e) => setCatFilter(e.target.value as never)}
                    className="px-3 py-2 bg-[#f5f5f7] rounded-xl text-sm outline-none focus:bg-white border border-transparent focus:border-[#0071e3]"
                  >
                    <option value="all">Все</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <button 
                  onClick={() => { setEditProduct(null); setModalOpen(true); }}
                  className="px-4 py-2 bg-[#0071e3] text-white rounded-full text-sm font-semibold hover:bg-[#0064cc] flex items-center gap-1 shrink-0"
                >
                  + Добавить товар
                </button>
              </div>
            </div>

            {/* Responsive Product List */}
            {loading ? (
              <div className="p-8 text-center text-[#6e6e73]">
                <div className="text-3xl mb-2 animate-spin inline-block">⏳</div>
                <p className="text-sm">Загрузка...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-14 text-[#6e6e73]">
                <div className="text-4xl mb-2">📭</div>
                <p className="font-medium text-sm">Товары не найдены</p>
              </div>
            ) : (
              <>
                {/* Desktop Table (>= 768px) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full min-w-[500px] max-w-full table-fixed" style={{ tableLayout: 'fixed', width: '100%' }}>
                    <thead>
                      <tr className="border-b border-[#f5f5f7] bg-[#fafafa]">
                        {["Товар", "Категория", "Цена", "Статус", ""].map((h) => (
                          <th key={h} className="text-left text-[10px] font-bold text-[#6e6e73] uppercase tracking-wider px-4 py-3 first:pl-5 last:pr-5">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f5f5f7]">
                      {filtered.map((p) => (
                        <tr key={p.id} className="hover:bg-[#fafafa] transition-colors">
                          {/* Product */}
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 bg-[#f5f5f7] rounded-xl overflow-hidden shrink-0">
                                {p.image && (
                                  <Image src={p.image} alt={p.name} width={44} height={44}
                                    className="w-full h-full object-contain p-1" unoptimized />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-[#1d1d1f] text-sm line-clamp-1">{p.name}</p>
                                <p className="text-[10px] text-[#6e6e73] line-clamp-1">{p.tagline}</p>
                                <div className="flex gap-1 mt-0.5">
                                  {p.badge && <span className="bg-[#0071e3] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">{p.badge}</span>}
                                  {p.featured && <span className="bg-amber-100 text-amber-700 text-[8px] font-bold px-1.5 py-0.5 rounded-full">Featured</span>}
                                </div>
                              </div>
                            </div>
                          </td>
                          {/* Category */}
                          <td className="px-4 py-3">
                            <span className="text-[10px] bg-[#f5f5f7] text-[#1d1d1f] px-2 py-1 rounded-full font-medium">{p.category}</span>
                          </td>
                          {/* Price */}
                          <td className="px-4 py-3">
                            <p className="font-bold text-[#1d1d1f] text-sm whitespace-nowrap">{formatPrice(p.price_kgs)}</p>
                          </td>
                          {/* Stock */}
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${p.stock_status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                              ● {p.stock_status ? "В наличии" : "Нет"}
                            </span>
                          </td>
                          {/* Actions */}
                          <td className="px-5 py-3">
                            <div className="flex items-center justify-end gap-1.5">
                              <button onClick={() => { setEditProduct(p); setModalOpen(true); }}
                                className="px-3 py-2 bg-[#0071e3] text-white rounded-full text-sm font-semibold hover:bg-[#0064cc] flex items-center gap-1 shrink-0"
                              >
                                ✏️ Edit
                              </button>
                              <button onClick={() => handleToggleStock(p)}
                                className={`px-2.5 py-1.5 text-[10px] font-medium rounded-full border transition-colors ${
                                  p.stock_status ? "border-[#ff3b30] text-[#ff3b30] hover:bg-red-50" : "border-[#34c759] text-[#34c759] hover:bg-green-50"
                                }`}>
                                {p.stock_status ? "Снять" : "Добавить"}
                              </button>
                              {deleteConfirm === p.id ? (
                                <div className="flex gap-1">
                                  <button onClick={() => handleDelete(p.id)} className="px-2 py-1.5 text-[10px] font-bold bg-[#ff3b30] text-white rounded-full">Да</button>
                                  <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1.5 text-[10px] bg-[#f5f5f7] rounded-full">Нет</button>
                                </div>
                              ) : (
                                <button onClick={() => setDeleteConfirm(p.id)}
                                  className="p-1.5 rounded-full text-[#6e6e73] hover:text-[#ff3b30] hover:bg-red-50 transition-colors">
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                    <path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards (< 768px) */}
                <div className="md:hidden space-y-3 px-2 sm:px-0">
                  {filtered.map((p) => (
                    <MobileProductCard
                      key={p.id}
                      product={p}
                      onEdit={() => { setEditProduct(p); setModalOpen(true); }}
                      onToggleStock={() => handleToggleStock(p)}
                      onDelete={() => handleDelete(p.id)}
                      deleteConfirm={deleteConfirm === p.id}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <ProductModal
          product={editProduct}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditProduct(null); }}
        />
      )}
    </div>
  );
}
