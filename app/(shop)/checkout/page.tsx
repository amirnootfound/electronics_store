"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/data/products";
import { CheckoutForm, Lead } from "@/types";
import { supabase } from "@/lib/supabase";

const WHATSAPP_NUMBER = "996553503794";

export default function CheckoutPage() {
  const { cartItems, cartTotal, cartCount, clearCart } = useStore();
  const [form, setForm] = useState<CheckoutForm>({ name: "", address: "", whatsapp: "", paymentMethod: "whatsapp" });
  const [submitted, setSubmitted] = useState(false);

  const buildMsg = () => encodeURIComponent(
    `🛍️ *Здравствуйте! хочу заказть в TechStore KG:*\n\n` +
    `👤 ${form.name}\n📍 ${form.address}\n📱 ${form.whatsapp}\n\n` +
    `📦 *Товары:*\n${cartItems.map((i) => `• ${i.product.name} ×${i.quantity} = ${formatPrice(i.product.price_kgs * i.quantity)}`).join("\n")}\n\n` +
    `💰 *Итого: ${formatPrice(cartTotal)}*` + `*Жду подтверждения заказа и информацию по доставке!*`
  );

  const createLead = async (): Promise<string | null> => {
    if (!supabase) {
      console.error("Supabase client not initialized");
      return null;
    }

    try {
      const leadData = {
        customer_name: form.name,
        whatsapp: form.whatsapp,
        address: form.address,
        product_name: `Заказ (${cartCount} товаров)`,
        category: "multiple",
        message: buildMsg().replace(/%0A/g, '\n').replace(/\*/g, ''),
        total_amount: cartTotal,
        source: "checkout" as const,
        status: "new" as const,
        priority: cartTotal > 50000 ? "high" : cartTotal > 20000 ? "medium" : "low" as const,
      };

      const { data, error } = await supabase
        .from("leads")
        .insert([leadData])
        .select()
        .single();

      if (error) {
        console.error("Error creating lead:", error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error("Error creating lead:", error);
      return null;
    }
  };

  const handleConfirm = async () => {
    if (!form.name || !form.address || !form.whatsapp) { alert("Заполните все поля"); return; }
    
    // Create lead first
    const leadId = await createLead();
    
    // Build WhatsApp message with lead reference
    const msgWithLeadId = leadId 
      ? `🆔 Lead ID: ${leadId}\n\n` + buildMsg().replace(/%0A/g, '\n').replace(/\*/g, '')
      : buildMsg();
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msgWithLeadId)}`, "_blank");
    setSubmitted(true); clearCart();
  };

  if (cartItems.length === 0 && !submitted) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <div className="text-5xl mb-4">🛒</div>
      <h1 className="text-xl font-bold mb-4">Корзина пуста</h1>
      <Link href="/" className="px-6 py-2.5 bg-[#0071e3] text-white rounded-full font-semibold text-sm">В магазин</Link>
    </div>
  );

  if (submitted) return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center text-center px-6 fade-in">
      <div className="text-6xl mb-5">✅</div>
      <h1 className="text-2xl font-bold text-[#1d1d1f] mb-2">Заказ отправлен!</h1>
      <p className="text-[#6e6e73] mb-7 text-sm">Менеджер свяжется с вами в WhatsApp</p>
      <Link href="/" className="px-7 py-3 bg-[#0071e3] text-white rounded-full font-semibold hover:bg-[#0064cc] text-sm">В магазин</Link>
    </div>
  );

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 sm:py-12 fade-in">
      <h1 className="text-2xl sm:text-3xl font-black text-[#1d1d1f] mb-8">Оформление заказа</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-5">
          {/* Contact */}
          <div className="bg-white border border-[#e8e8ed] rounded-2xl p-5 sm:p-6">
            <h2 className="font-bold text-[#1d1d1f] mb-4 flex items-center gap-2 text-sm sm:text-base">
              <span className="w-6 h-6 bg-[#0071e3] text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>
              Контактные данные
            </h2>
            <div className="space-y-3">
              {[
                { name: "name", label: "Имя и фамилия *", placeholder: "Айгерим Сатыбалдиева", type: "text" },
                { name: "address", label: "Адрес доставки *", placeholder: "г. Бишкек, мкр. Джал 25, кв. 42", type: "text" },
                { name: "whatsapp", label: "WhatsApp номер *", placeholder: "+996 700 123 456", type: "tel" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">{field.label}</label>
                  <input type={field.type} name={field.name} value={form[field.name as keyof CheckoutForm]}
                    onChange={(e) => setForm((f) => ({ ...f, [field.name]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl border border-transparent focus:border-[#0071e3] focus:bg-white outline-none text-sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white border border-[#e8e8ed] rounded-2xl p-5 sm:p-6">
            <h2 className="font-bold text-[#1d1d1f] mb-4 flex items-center gap-2 text-sm sm:text-base">
              <span className="w-6 h-6 bg-[#0071e3] text-white rounded-full text-xs flex items-center justify-center font-bold">2</span>
              Способ оплаты
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { v: "whatsapp", l: "WhatsApp", i: "💬", d: "Менеджер подтвердит" },
                { v: "odengi", l: "O!Денги", i: "🟠", d: "Онлайн оплата" },
                { v: "elsom", l: "Elsom", i: "🟢", d: "Мобильный кошелёк" },
                { v: "card", l: "Visa / MC", i: "💳", d: "Банковская карта" },
              ].map((m) => (
                <button key={m.v} onClick={() => setForm((f) => ({ ...f, paymentMethod: m.v as never }))}
                  className={`p-3.5 rounded-xl border-2 text-left transition-all ${form.paymentMethod === m.v ? "border-[#0071e3] bg-blue-50" : "border-[#e8e8ed] hover:border-[#c7c7cc]"}`}>
                  <div className="text-xl mb-1">{m.i}</div>
                  <p className="text-xs font-bold text-[#1d1d1f]">{m.l}</p>
                  <p className="text-[10px] text-[#6e6e73]">{m.d}</p>
                </button>
              ))}
            </div>
            {form.paymentMethod !== "whatsapp" && (
              <p className="mt-3 text-xs text-[#6e6e73] bg-[#f5f5f7] p-3 rounded-xl text-center">
                Онлайн-оплата будет доступна в следующей версии. Подтвердите через WhatsApp.
              </p>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-2">
          <div className="bg-[#f5f5f7] rounded-3xl p-5 sm:p-6 sticky top-20">
            <h2 className="font-bold text-[#1d1d1f] mb-4 text-sm sm:text-base">Заказ ({cartCount})</h2>
            <div className="space-y-3 mb-5">
              {cartItems.map((i) => (
                <div key={i.product.id} className="flex gap-2.5">
                  <div className="w-12 h-12 bg-white rounded-xl overflow-hidden shrink-0">
                    <Image src={i.product.image} alt={i.product.name} width={48} height={48} className="w-full h-full object-contain p-1" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#1d1d1f] line-clamp-1">{i.product.name}</p>
                    <p className="text-[10px] text-[#6e6e73]">×{i.quantity}</p>
                  </div>
                  <p className="text-xs font-bold text-[#1d1d1f] shrink-0">{formatPrice(i.product.price_kgs * i.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-[#d2d2d7] pt-4 mb-5">
              <div className="flex justify-between text-xs mb-1.5"><span className="text-[#6e6e73]">Доставка</span><span className="text-[#34c759] font-medium">Бесплатно</span></div>
              <div className="flex justify-between"><span className="font-bold text-sm">Итого</span><span className="font-black text-lg text-[#1d1d1f]">{formatPrice(cartTotal)}</span></div>
            </div>
            <button onClick={handleConfirm}
              className="w-full py-3.5 bg-[#25d366] text-white rounded-full font-bold hover:bg-[#1da851] transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 text-sm">
              💬 Подтвердить через WhatsApp
            </button>
            <p className="text-[10px] text-[#6e6e73] text-center mt-3">Вы будете перенаправлены в WhatsApp</p>
          </div>
        </div>
      </div>
    </div>
  );
}
