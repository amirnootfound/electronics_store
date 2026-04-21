"use client";
// ============================================================
// ADMIN LEADS DASHBOARD - Track and manage customer inquiries
// ============================================================

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { Lead, LeadStatus } from "@/types";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/data/products";

// Lead status configuration
const LEAD_STATUS_CONFIG = {
  new: { label: "Новый", color: "bg-blue-100 text-blue-800", icon: "·" },
  contacted: { label: "Связан", color: "bg-yellow-100 text-yellow-800", icon: "·" },
  qualified: { label: "Квалифицирован", color: "bg-purple-100 text-purple-800", icon: "·" },
  closed: { label: "Закрыт", color: "bg-green-100 text-green-800", icon: "·" },
  lost: { label: "Потерян", color: "bg-red-100 text-red-800", icon: "·" },
} as const;

const PRIORITY_CONFIG = {
  low: { label: "Low", color: "bg-gray-100 text-gray-700" },
  medium: { label: "Medium", color: "bg-orange-100 text-orange-700" },
  high: { label: "High", color: "bg-red-100 text-red-700" },
} as const;

const SOURCE_CONFIG = {
  checkout: { label: "Checkout", icon: "CART" },
  product_page: { label: "Product", icon: "PROD" },
  homepage: { label: "Homepage", icon: "HOME" },
} as const;

// Mobile Lead Card Component
function MobileLeadCard({ lead, onEdit, onDelete, onStatusChange }: {
  lead: Lead;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: LeadStatus) => void;
}) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-[#e8e8ed] p-5 hover:border-[#0071e3] transition-all hover:shadow-md min-h-[320px] flex flex-col">
      {/* Header with Customer Info */}
      <div className="flex items-start justify-between mb-4 pb-3 border-b border-[#f5f5f7]">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-[#0071e3] rounded-full flex items-center justify-center text-white text-xs font-bold">
              {lead.customer_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-[#1d1d1f] text-sm">{lead.customer_name}</h3>
              <p className="text-xs text-[#6e6e73]">📱 {lead.whatsapp}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowActions(!showActions)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f5f5f7] text-[#6e6e73] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      </div>

      {/* Product Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[#6e6e73] mb-1">Product</p>
            <p className="font-medium text-[#1d1d1f] text-sm line-clamp-1">{lead.product_name}</p>
          </div>
          {lead.total_amount && (
            <div className="text-right">
              <p className="text-xs text-[#6e6e73] mb-1">Value</p>
              <p className="font-bold text-[#0071e3] text-lg">{formatPrice(lead.total_amount)}</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#6e6e73]">Category:</span>
          <span className="text-xs bg-[#f5f5f7] text-[#1d1d1f] px-2 py-1 rounded-lg font-medium">{lead.category}</span>
          <span className="text-xs text-[#6e6e73]">Source:</span>
          <span className="text-xs bg-[#f5f5f7] text-[#1d1d1f] px-2 py-1 rounded-lg font-medium">{SOURCE_CONFIG[lead.source].label}</span>
        </div>
      </div>

      {/* Status and Priority */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <p className="text-xs text-[#6e6e73] mb-2">Status</p>
          <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg ${LEAD_STATUS_CONFIG[lead.status].color}`}>
            {LEAD_STATUS_CONFIG[lead.status].icon} {LEAD_STATUS_CONFIG[lead.status].label}
          </span>
        </div>
        <div className="flex-1">
          <p className="text-xs text-[#6e6e73] mb-2">Priority</p>
          <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg ${PRIORITY_CONFIG[lead.priority].color}`}>
            {PRIORITY_CONFIG[lead.priority].label}
          </span>
        </div>
      </div>

      {/* Date */}
      <div className="mt-auto pt-3 border-t border-[#f5f5f7]">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#6e6e73]">
            📅 {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : 'No date'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex gap-2 pt-3 border-t border-[#f5f5f7]">
          <button
            onClick={onEdit}
            className="flex-1 py-2.5 text-sm font-medium border border-[#d2d2d7] text-[#1d1d1f] rounded-lg hover:border-[#0071e3] hover:text-[#0071e3] transition-colors min-h-[44px]"
          >
            ✏️ Edit
          </button>
          <select
            value={lead.status}
            onChange={(e) => onStatusChange(e.target.value as LeadStatus)}
            className="flex-1 py-2.5 text-sm font-medium border border-[#d2d2d7] text-[#1d1d1f] rounded-lg hover:border-[#0071e3] hover:text-[#0071e3] transition-colors min-h-[44px] bg-white"
          >
            {Object.entries(LEAD_STATUS_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
          <button
            onClick={onDelete}
            className="flex-1 py-2.5 text-sm font-bold bg-[#ff3b30] text-white rounded-lg min-h-[44px] hover:bg-[#d70015]"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, icon, colorClass }: { label: string; value: string | number; icon: string; colorClass: string }) {
  const getIcon = (label: string) => {
    switch(label.toLowerCase()) {
      case 'всего заявок': return '📊';
      case 'новые заявки': return '🆕';
      case 'высокий приоритет': return '🔥';
      case 'общая стоимость': return '💰';
      default: return '📈';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 flex items-center gap-4 border border-[#e8e8ed] hover:shadow-sm transition-shadow">
      <div className={`w-12 h-12 ${colorClass} rounded-2xl flex items-center justify-center text-2xl shrink-0`}>
        {getIcon(label)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-lg font-black text-[#1d1d1f] truncate">{value}</p>
        <p className="text-[10px] text-[#6e6e73] truncate">{label}</p>
      </div>
    </div>
  );
}

// Lead Modal Component
function LeadModal({ lead, onUpdate, onClose }: {
  lead: Lead;
  onUpdate: (id: string, updates: Partial<Lead>) => Promise<void>;
  onClose: () => void;
}) {
  const [notes, setNotes] = useState(lead.notes || "");
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [priority, setPriority] = useState<"low" | "medium" | "high">(lead.priority);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(lead.id, { notes, status, priority, contacted_at: status === "contacted" ? new Date().toISOString() : lead.contacted_at });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-2xl max-h-[90vh] flex flex-col fade-in-scale">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f5f5f7] shrink-0">
          <h2 className="text-base font-bold text-[#1d1d1f]">Детали Лидa</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f5f5f7] text-[#6e6e73] text-lg">×</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Customer Info */}
          <div className="bg-[#f5f5f7] rounded-2xl p-4">
            <h3 className="font-semibold text-[#1d1d1f] mb-3 text-sm">Информация о клиенте</h3>
            <div className="space-y-2 text-sm">
              <div><span className="text-[#6e6e73]">Имя:</span> <span className="font-medium">{lead.customer_name}</span></div>
              <div><span className="text-[#6e6e73]">WhatsApp:</span> <span className="font-medium">{lead.whatsapp}</span></div>
              {lead.address && (
                <div>
                  <span className="text-[#6e6e73]">Адрес:</span> 
                  <span className="font-medium">{lead.address}</span>
                </div>
              )}
              {lead.email && (
                <div>
                  <span className="text-[#6e6e73]">Почта:</span> 
                  <span className="font-medium">{lead.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-[#f5f5f7] rounded-2xl p-4">
            <h3 className="font-semibold text-[#1d1d1f] mb-3 text-sm">Интересующий продукт</h3>
            <div className="space-y-2 text-sm">
              <div><span className="text-[#6e6e73]">Продукт:</span> <span className="font-medium">{lead.product_name}</span></div>
              <div><span className="text-[#6e6e73]">Категория:</span> <span className="font-medium">{lead.category}</span></div>
              {lead.total_amount && (
                <div>
                  <span className="text-[#6e6e73]">Стоимость:</span> 
                  <span className="font-bold text-[#0071e3]">{formatPrice(lead.total_amount)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Editable Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1d1d1f] mb-2">Статус</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className="w-full px-3 py-2 bg-[#f5f5f7] rounded-xl text-sm outline-none focus:bg-white border border-transparent focus:border-[#0071e3]"
              >
                {Object.entries(LEAD_STATUS_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1d1d1f] mb-2">Приоритет</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
                className="w-full px-3 py-2 bg-[#f5f5f7] rounded-xl text-sm outline-none focus:bg-white border border-transparent focus:border-[#0071e3]"
              >
                {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1d1d1f] mb-2">Примечания</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Добавьте примечания об этом лидe..."
                className="w-full px-3 py-2 bg-[#f5f5f7] rounded-xl text-sm outline-none focus:bg-white border border-transparent focus:border-[#0071e3] min-h-[100px] resize-none"
              />
            </div>
          </div>

          {/* Message */}
          {lead.message && (
            <div>
              <label className="block text-xs font-semibold text-[#1d1d1f] mb-2">Оригинальное сообщение</label>
              <div className="bg-[#f5f5f7] rounded-xl p-3 text-sm text-[#6e6e73] whitespace-pre-wrap">{lead.message}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-[#f5f5f7] shrink-0">
          <button 
            onClick={() => window.open(`https://wa.me/${lead.whatsapp.replace(/[^\d]/g, '')}`, "_blank")}
            className="flex-1 py-2.5 bg-[#25d366] text-white rounded-full text-sm font-semibold hover:bg-[#1da851] flex items-center justify-center gap-2"
          >
            WhatsApp
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 bg-[#0071e3] text-white rounded-full text-sm font-semibold hover:bg-[#0064cc] disabled:opacity-50"
          >
            {saving ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LeadsDashboard() {
  const router = useRouter();
  const { refreshProducts } = useStore();
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<"low" | "medium" | "high" | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<"checkout" | "product_page" | "homepage" | "all">("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("adminAuth") !== "true") {
      router.replace("/admin");
    }
  }, [router]);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data as Lead[]);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (selectedLead) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [selectedLead]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    try {
      const { error } = await supabase
        .from("leads")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
      
      setLeads(prev => prev.map(lead => 
        lead.id === id ? { ...lead, ...updates, updated_at: new Date().toISOString() } : lead
      ));
      
      showNotification("Заявка обновлена успешно");
    } catch (error) {
      console.error("Error updating lead:", error);
      showNotification("Failed to update lead");
    }
  };

  const deleteLead = async (id: string) => {
    // Custom confirmation dialog instead of browser alert
    const confirmed = window.confirm("Are you sure you want to delete this lead?\n\nThis action cannot be undone.");
    if (!confirmed) return;
    
    try {
      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setLeads(prev => prev.filter(lead => lead.id !== id));
      showNotification("Заявка удалена успешно");
    } catch (error) {
      console.error("Error deleting lead:", error);
      showNotification("Failed to delete lead");
    }
  };

  const filtered = leads.filter(lead => {
    const matchSearch = !searchQ || 
      lead.customer_name.toLowerCase().includes(searchQ.toLowerCase()) ||
      lead.product_name.toLowerCase().includes(searchQ.toLowerCase()) ||
      lead.whatsapp.includes(searchQ);
    const matchStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchPriority = priorityFilter === "all" || lead.priority === priorityFilter;
    const matchSource = sourceFilter === "all" || lead.source === sourceFilter;
    
    return matchSearch && matchStatus && matchPriority && matchSource;
  });

  // Stats
  const newLeads = leads.filter(l => l.status === "new").length;
  const totalValue = leads.reduce((sum, l) => sum + (l.total_amount || 0), 0);
  const highPriority = leads.filter(l => l.priority === "high").length;
  const conversionRate = leads.length > 0 ? ((leads.filter(l => l.status === "closed").length / leads.length) * 100).toFixed(1) : "0";

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] bg-[#1d1d1f] text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-xl fade-in">
          {notification}
        </div>
      )}

      {/* Header */}
      <header className="glass-header sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="block sm:hidden">
                <h1 className="font-bold text-[#1d1d1f] text-sm leading-none">TechStore KG</h1>
                <p className="text-[10px] text-[#6e6e73]">Leads</p>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-[#1d1d1f] text-sm leading-none">TechStore KG</h1>
                <p className="text-[10px] text-[#6e6e73]">Leads</p>
              </div>
            </div>
          </div>
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
                      onClick={() => { router.push("/admin/dashboard"); setShowMobileMenu(false); }}
                      className="w-full px-3 py-2.5 text-left text-sm font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-lg transition-colors"
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={() => { fetchLeads(); setShowMobileMenu(false); }}
                      className="w-full px-3 py-2.5 text-left text-sm font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-lg transition-colors"
                    >
                      Обновить
                    </button>
                    <button 
                      onClick={() => { localStorage.removeItem("adminAuth"); router.replace("/admin"); setShowMobileMenu(false); }}
                      className="w-full px-3 py-2.5 text-left text-sm font-medium text-[#ff3b30] hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Выйти
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-1 sm:gap-2">
              <button onClick={() => router.push("/admin/dashboard")} className="text-xs text-[#0071e3] hover:text-[#0064cc] px-2 sm:px-3 py-1.5 rounded-full hover:bg-[#f0f7ff] min-h-[36px] sm:min-h-[40px] whitespace-nowrap">
                Admin-Panel
              </button>
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
      </header>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard label="Всего заявок" value={leads.length} icon="LEADS" colorClass="bg-blue-50" />
          <StatCard label="Новые заявки" value={newLeads} icon="NEW" colorClass="bg-green-50" />
          <StatCard label="Высокий приоритет" value={highPriority} icon="HIGH" colorClass="bg-red-50" />
          <StatCard label="Общая стоимость" value={`${(totalValue / 1000).toFixed(0)}K`} icon="VALUE" colorClass="bg-yellow-50" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-[#e8e8ed] p-4 mb-6">
          {/* Mobile Filters */}
          <div className="md:hidden space-y-3">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={searchQ} 
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Поиск" 
                className="flex-1 px-3 py-2 bg-[#f5f5f7] rounded-xl text-sm outline-none focus:bg-white border border-transparent focus:border-[#0071e3] min-h-[44px]" 
              />
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 py-2 bg-[#0071e3] text-white rounded-xl text-sm font-medium min-h-[44px] whitespace-nowrap"
              >
                Фильтры
              </button>
            </div>
            {showFilters && (
              <div className="space-y-2">
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value as LeadStatus | "all")}
                  className="w-full px-3 py-2 bg-[#f5f5f7] rounded-xl text-sm outline-none focus:bg-white border border-transparent focus:border-[#0071e3] min-h-[44px]"
                >
                  <option value="all">Все статусы</option>
                  {Object.entries(LEAD_STATUS_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
                <select 
                  value={priorityFilter} 
                  onChange={(e) => setPriorityFilter(e.target.value as "low" | "medium" | "high" | "all")}
                  className="w-full px-3 py-2 bg-[#f5f5f7] rounded-xl text-sm outline-none focus:bg-white border border-transparent focus:border-[#0071e3] min-h-[44px]"
                >
                  <option value="all">Все приоритеты</option>
                  {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
                <select 
                  value={sourceFilter} 
                  onChange={(e) => setSourceFilter(e.target.value as "checkout" | "product_page" | "homepage" | "all")}
                  className="w-full px-3 py-2 bg-[#f5f5f7] rounded-xl text-sm outline-none focus:bg-white border border-transparent focus:border-[#0071e3] min-h-[44px]"
                >
                  <option value="all">Все источники</option>
                  {Object.entries(SOURCE_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Desktop Filters */}
          <div className="hidden md:flex flex-wrap items-center gap-3">
            <input 
              type="text" 
              value={searchQ} 
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Поиск" 
              className="flex-1 min-w-[200px] px-3 py-2 bg-[#f5f5f7] rounded-xl text-sm outline-none focus:bg-white border border-transparent focus:border-[#0071e3]" 
            />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value as LeadStatus | "all")}
              className="px-3 py-2 bg-[#f5f5f7] rounded-xl text-sm outline-none focus:bg-white border border-transparent focus:border-[#0071e3]"
            >
              <option value="all">Все статусы</option>
              {Object.entries(LEAD_STATUS_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
            <select 
              value={priorityFilter} 
              onChange={(e) => setPriorityFilter(e.target.value as "low" | "medium" | "high" | "all")}
              className="px-3 py-2 bg-[#f5f5f7] rounded-xl text-sm outline-none focus:bg-white border border-transparent focus:border-[#0071e3]"
            >
              <option value="all">Все приоритеты</option>
              {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
            <select 
              value={sourceFilter} 
              onChange={(e) => setSourceFilter(e.target.value as "checkout" | "product_page" | "homepage" | "all")}
              className="px-3 py-2 bg-[#f5f5f7] rounded-xl text-sm outline-none focus:bg-white border border-transparent focus:border-[#0071e3]"
            >
              <option value="all">Все источники</option>
              {Object.entries(SOURCE_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Leads List */}
        <div className="bg-white rounded-2xl border border-[#e8e8ed] overflow-hidden">
          <div className="p-5 border-b border-[#f5f5f7] flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1d1d1f]">
              Список лидов ({filtered.length} из {leads.length})
            </h2>
            {leads.length === 0 && (
              <button
                onClick={() => setSelectedLead({
                  id: '',
                  customer_name: '',
                  whatsapp: '',
                  email: '',
                  address: '',
                  product_name: '',
                  category: 'iPhone',
                  total_amount: undefined,
                  status: 'new',
                  priority: 'medium',
                  source: 'product_page',
                  message: '',
                  notes: '',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  contacted_at: undefined
                })}
                className="px-3 py-1.5 bg-[#0071e3] text-white rounded-full text-xs font-medium hover:bg-[#0064cc] min-h-[36px] sm:min-h-[40px] whitespace-nowrap"
              >
                + Добавить лид
              </button>
            )}
          </div>

          {loading ? (
            <div className="p-8 text-center text-[#6e6e73]">
              <div className="text-3xl mb-2 animate-spin inline-block">⏳</div>
              <p className="text-sm">Загрузка...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-14 text-[#6e6e73]">
              <div className="text-4xl mb-2">Пусто</div>
              <p className="font-medium text-sm">Нет заявок</p>
              <p className="text-xs mt-1">Попробуйте изменить фильтры</p>
            </div>
          ) : (
            <>
              {/* Desktop Table (>= 768px) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-[#f5f5f7] bg-[#fafafa]">
                      <th className="text-left text-[10px] font-bold text-[#6e6e73] uppercase tracking-wider px-4 py-3">Клиент</th>
                      <th className="text-left text-[10px] font-bold text-[#6e6e73] uppercase tracking-wider px-4 py-3">Продукт</th>
                      <th className="text-left text-[10px] font-bold text-[#6e6e73] uppercase tracking-wider px-4 py-3">Стоимость</th>
                      <th className="text-left text-[10px] font-bold text-[#6e6e73] uppercase tracking-wider px-4 py-3">Источник</th>
                      <th className="text-left text-[10px] font-bold text-[#6e6e73] uppercase tracking-wider px-4 py-3">Статус</th>
                      <th className="text-left text-[10px] font-bold text-[#6e6e73] uppercase tracking-wider px-4 py-3">Приоритет</th>
                      <th className="text-left text-[10px] font-bold text-[#6e6e73] uppercase tracking-wider px-4 py-3">Дата</th>
                      <th className="text-left text-[10px] font-bold text-[#6e6e73] uppercase tracking-wider px-4 py-3">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f5f5f7]">
                    {filtered.map((lead) => (
                      <tr key={lead.id} className="hover:bg-[#fafafa] transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-semibold text-[#1d1d1f] text-sm">{lead.customer_name}</p>
                            <p className="text-[10px] text-[#6e6e73]">{lead.whatsapp}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-[#1d1d1f] text-sm line-clamp-1">{lead.product_name}</p>
                            <p className="text-[10px] text-[#6e6e73]">{lead.category}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {lead.total_amount ? (
                            <p className="font-bold text-[#1d1d1f] text-sm">{formatPrice(lead.total_amount)}</p>
                          ) : (
                            <p className="text-[10px] text-[#6e6e73]">-</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] bg-[#f5f5f7] text-[#1d1d1f] px-2 py-1 rounded-full font-medium">
                            {SOURCE_CONFIG[lead.source]?.icon} {SOURCE_CONFIG[lead.source]?.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${LEAD_STATUS_CONFIG[lead.status].color}`}>
                            {LEAD_STATUS_CONFIG[lead.status].icon} {LEAD_STATUS_CONFIG[lead.status].label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${PRIORITY_CONFIG[lead.priority].color}`}>
                            {PRIORITY_CONFIG[lead.priority].label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-[10px] text-[#6e6e73]">
                              {new Date(lead.created_at || "").toLocaleDateString()}
                            </p>
                            <p className="text-[9px] text-[#6e6e73]">
                              {new Date(lead.created_at || "").toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button 
                              onClick={() => setSelectedLead(lead)}
                              className="px-2 py-1 text-[10px] font-medium border border-[#d2d2d7] text-[#1d1d1f] rounded-full hover:border-[#0071e3] hover:text-[#0071e3]"
                            >
                              Редактировать
                            </button>
                            <button 
                              onClick={() => deleteLead(lead.id)}
                              className="px-2 py-1 text-[10px] font-medium text-[#ff3b30] hover:bg-red-50 rounded-full"
                            >
                              Удалить
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards (< 768px) */}
              <div className="md:hidden space-y-3 p-4">
                {filtered.map((lead) => (
                  <MobileLeadCard
                    key={lead.id}
                    lead={lead}
                    onEdit={() => setSelectedLead(lead)}
                    onDelete={() => deleteLead(lead.id)}
                    onStatusChange={(status) => updateLead(lead.id, { status })}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Lead Details Modal */}
        {selectedLead && (
          <LeadModal
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            onUpdate={updateLead}
          />
        )}
      </div>
    </div>
  );
}
