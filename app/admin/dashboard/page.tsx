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
  featured: false, badge: "", rating: 0, review_count: 0,
});

// ── Stat Card ──────────────────────────────────────────────
function StatCard({ label, value, icon, colorClass }: { label: string; value: string | number; icon: string; colorClass: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 flex items-center gap-4 border border-[#e8e8ed] hover:shadow-sm transition-shadow">
      <div className={`w-12 h-12 ${colorClass} rounded-2xl flex items-center justify-center text-2xl shrink-0`}>{icon}</div>
      <div>
        <p className="text-2xl font-black text-[#1d1d1f]">{value}</p>
        <p className="text-xs text-[#6e6e73]">{label}</p>
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
                  <span className="text-sm font-medium text-[#1d1d1f]">Featured на главной</span>
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

// ── MAIN DASHBOARD ─────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const { products, loading, addProduct, updateProduct, deleteProduct, refreshProducts } = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null);
  const [searchQ, setSearchQ] = useState("");
  const [activeTab, setActiveTab] = useState<"products" | "stats">("products");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [catFilter, setCatFilter] = useState<Category | "all">("all");

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("adminAuth") !== "true") {
      router.replace("/admin");
    }
  }, [router]);

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
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">⌘</span>
            <div className="hidden sm:block">
              <h1 className="font-bold text-[#1d1d1f] text-sm leading-none">TechStore KG</h1>
              <p className="text-[10px] text-[#6e6e73]">Admin</p>
            </div>
            <div className="flex gap-1 ml-1 sm:ml-3">
              {(["products", "stats"] as const).map((t) => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                    activeTab === t ? "bg-[#1d1d1f] text-white" : "text-[#6e6e73] hover:text-[#1d1d1f]"
                  }`}
                >
                  {t === "products" ? "Товары" : "Аналитика"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={refreshProducts} className="hidden sm:block text-xs text-[#6e6e73] hover:text-[#0071e3] px-3 py-1.5 rounded-full hover:bg-[#f5f5f7]">
              🔄 Обновить
            </button>
            <a href="/" target="_blank" className="hidden sm:block text-xs text-[#0071e3] hover:underline">Магазин ↗</a>
            <button onClick={() => { localStorage.removeItem("adminAuth"); router.replace("/admin"); }}
              className="px-3 py-1.5 border border-[#d2d2d7] rounded-full text-xs text-[#ff3b30] hover:bg-red-50">
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 border-b border-[#f5f5f7]">
              <h2 className="text-base font-bold text-[#1d1d1f]">
                Товары
                <span className="ml-2 text-xs font-normal text-[#6e6e73]">({filtered.length} из {products.length})</span>
              </h2>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <input type="text" value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Поиск..."
                  className="w-36 sm:w-48 px-3 py-2 bg-[#f5f5f7] rounded-xl text-xs sm:text-sm outline-none focus:bg-white border border-transparent focus:border-[#0071e3]" />
                <select value={catFilter} onChange={(e) => setCatFilter(e.target.value as never)}
                  className="px-3 py-2 bg-[#f5f5f7] rounded-xl text-xs sm:text-sm outline-none focus:bg-white border border-transparent focus:border-[#0071e3]">
                  <option value="all">Все</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <button onClick={() => { setEditProduct(null); setModalOpen(true); }}
                  className="px-4 py-2 bg-[#0071e3] text-white rounded-full text-xs sm:text-sm font-semibold hover:bg-[#0064cc] flex items-center gap-1 shrink-0">
                  + Добавить
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center text-[#6e6e73]">
                  <div className="text-3xl mb-2 animate-spin inline-block">⏳</div>
                  <p className="text-sm">Загрузка из Supabase...</p>
                </div>
              ) : (
                <table className="w-full min-w-[600px]">
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
                              <p className="font-semibold text-[#1d1d1f] text-xs sm:text-sm line-clamp-1">{p.name}</p>
                              <p className="text-[10px] text-[#6e6e73] line-clamp-1 hidden sm:block">{p.tagline}</p>
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
                          <p className="font-bold text-[#1d1d1f] text-xs sm:text-sm whitespace-nowrap">{formatPrice(p.price_kgs)}</p>
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
                              className="px-2.5 py-1.5 text-[10px] font-medium border border-[#d2d2d7] text-[#1d1d1f] rounded-full hover:border-[#0071e3] hover:text-[#0071e3]">
                              Изменить
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
              )}
              {!loading && filtered.length === 0 && (
                <div className="text-center py-14 text-[#6e6e73]">
                  <div className="text-4xl mb-2">📭</div>
                  <p className="font-medium text-sm">Товары не найдены</p>
                </div>
              )}
            </div>
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
