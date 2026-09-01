"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { useCurrency } from "@/context/CurrencyContext";
import { formatPrice } from "@/data/products";
import { CheckoutForm, Lead, PaymentMethod, OrderPath } from "@/types";
import { supabase } from "@/lib/supabase";

const PHONE_NUMBER = "+15551234567"; // Universal phone number

export default function CheckoutPage() {
  const { cartItems, cartTotal, cartCount, clearCart } = useStore();
  const { formatPrice: formatCurrencyPrice } = useCurrency();
  const [form, setForm] = useState<CheckoutForm>({ 
    name: "", 
    address: "", 
    phone: "", 
    email: "",
    paymentMethod: "card", 
    orderPath: "online" 
  });
  const [submitted, setSubmitted] = useState(false);
  
  // Dynamic payment methods (US-focused)
  const paymentMethods: PaymentMethod[] = [
    { id: "1", name: "Credit/Debit Card", code: "card", icon: "💳", description: "Pay with Visa, Mastercard, American Express", is_active: true, requires_online_payment: true, display_order: 1 },
    { id: "2", name: "Apple Pay", code: "apple-pay", icon: "🍎", description: "Fast and secure payment with Apple Pay", is_active: true, requires_online_payment: true, display_order: 2 },
    { id: "3", name: "Zelle", code: "zelle", icon: "🏦", description: "Direct bank transfer via Zelle", is_active: true, requires_online_payment: false, display_order: 3 },
    { id: "4", name: "Cash on Pickup", code: "cash-pickup", icon: "💵", description: "Pay with cash when picking up your order", is_active: true, requires_online_payment: false, display_order: 4 },
    { id: "5", name: "Pay in Store", code: "pay-store", icon: "🏪", description: "Pay at our physical store location", is_active: true, requires_online_payment: false, display_order: 5 },
  ];

  // Dynamic order paths
  const orderPaths: OrderPath[] = [
    { id: "1", name: "Online Order", code: "online", icon: "🌐", description: "Complete your order online", is_active: true, display_order: 1 },
    { id: "2", name: "Direct Call", code: "call", icon: "📞", description: "Call us to place your order", is_active: true, display_order: 2 },
    { id: "3", name: "SMS/Text", code: "sms", icon: "💬", description: "Send us a text message to order", is_active: true, display_order: 3 },
    { id: "4", name: "Store Pickup", code: "pickup", icon: "🏪", description: "Order online and pick up at our store", is_active: true, display_order: 4 },
    { id: "5", name: "Delivery", code: "delivery", icon: "🚚", description: "Have your order delivered to your door", is_active: true, display_order: 5 },
  ];

  const buildMsg = () => encodeURIComponent(
    `🛍️ *Hello! I want to order from TechStore:*\n\n` +
    `👤 ${form.name}\n📍 ${form.address}\n📱 ${form.phone}\n` +
    (form.email ? `📧 ${form.email}\n` : "") +
    `💳 Payment: ${paymentMethods.find(m => m.code === form.paymentMethod)?.name}\n` +
    `🛒 Order Path: ${orderPaths.find(p => p.code === form.orderPath)?.name}\n\n` +
    `📦 *Items:*\n${cartItems.map((i) => `• ${i.product.name} ×${i.quantity} = ${formatCurrencyPrice(i.product.price_kgs * i.quantity)}`).join("\n")}\n\n` +
    `💰 *Total: ${formatCurrencyPrice(cartTotal)}*\n\n*Looking forward to order confirmation and delivery information!*`
  );

  const createLead = async (): Promise<string | null> => {
    if (!supabase) {
      console.error("Supabase client not initialized");
      return null;
    }

    try {
      const leadData = {
        customer_name: form.name,
        phone: form.phone,
        address: form.address,
        email: form.email,
        product_name: `Order (${cartCount} items)`,
        category: "multiple",
        message: buildMsg().replace(/%0A/g, '\n').replace(/\*/g, ''),
        total_amount: cartTotal,
        currency: "USD",
        payment_method_id: paymentMethods.find(m => m.code === form.paymentMethod)?.id,
        order_path_id: orderPaths.find(p => p.code === form.orderPath)?.id,
        source: "checkout" as const,
        status: "new" as const,
        priority: cartTotal > 500 ? "high" : cartTotal > 200 ? "medium" : "low" as const, // USD thresholds
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
    if (!form.name || !form.address || !form.phone) { alert("Please fill in all required fields"); return; }
    
    // Create lead first
    const leadId = await createLead();
    
    // Build message with lead reference
    const msgWithLeadId = leadId 
      ? `🆔 Lead ID: ${leadId}\n\n` + buildMsg().replace(/%0A/g, '\n').replace(/\*/g, '')
      : buildMsg();
    
    // Handle different order paths
    if (form.orderPath === "online") {
      if (form.paymentMethod === "card" || form.paymentMethod === "apple-pay") {
        alert("Online payment integration coming soon. Please choose another payment method or order path.");
        return;
      }
    }
    
    if (form.orderPath === "call") {
      window.location.href = `tel:${PHONE_NUMBER}`;
    } else if (form.orderPath === "sms") {
      window.location.href = `sms:${PHONE_NUMBER}?body=${encodeURIComponent(msgWithLeadId)}`;
    } else {
      // Default to showing confirmation
      setSubmitted(true);
      clearCart();
    }
  };

  if (cartItems.length === 0 && !submitted) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <div className="text-5xl mb-4">🛒</div>
      <h1 className="text-xl font-bold mb-4">Your cart is empty</h1>
      <Link href="/" className="px-6 py-2.5 bg-[#0071e3] text-white rounded-full font-semibold text-sm">Shop Now</Link>
    </div>
  );

  if (submitted) return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center text-center px-6 fade-in">
      <div className="text-6xl mb-5">✅</div>
      <h1 className="text-2xl font-bold text-[#1d1d1f] mb-2">Order submitted!</h1>
      <p className="text-[#6e6e73] mb-7 text-sm">We'll contact you shortly to confirm your order.</p>
      <Link href="/" className="px-7 py-3 bg-[#0071e3] text-white rounded-full font-semibold hover:bg-[#0064cc] text-sm">Continue Shopping</Link>
    </div>
  );

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 sm:py-12 fade-in">
      <h1 className="text-2xl sm:text-3xl font-black text-[#1d1d1f] mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-5">
          {/* Contact */}
          <div className="bg-white border border-[#e8e8ed] rounded-2xl p-5 sm:p-6">
            <h2 className="font-bold text-[#1d1d1f] mb-4 flex items-center gap-2 text-sm sm:text-base">
              <span className="w-6 h-6 bg-[#0071e3] text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>
              Contact Information
            </h2>
            <div className="space-y-3">
              {[
                { name: "name", label: "Full Name *", placeholder: "John Doe", type: "text" },
                { name: "address", label: "Delivery Address *", placeholder: "123 Main St, City, State 12345", type: "text" },
                { name: "phone", label: "Phone Number *", placeholder: "+1 (555) 123-4567", type: "tel" },
                { name: "email", label: "Email Address", placeholder: "john@example.com", type: "email" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5">{field.label}</label>
                  <input type={field.type} name={field.name} value={form[field.name as keyof CheckoutForm] || ""}
                    onChange={(e) => setForm((f) => ({ ...f, [field.name]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 bg-[#f5f5f7] rounded-xl border border-transparent focus:border-[#0071e3] focus:bg-white outline-none text-sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Order Path */}
          <div className="bg-white border border-[#e8e8ed] rounded-2xl p-5 sm:p-6">
            <h2 className="font-bold text-[#1d1d1f] mb-4 flex items-center gap-2 text-sm sm:text-base">
              <span className="w-6 h-6 bg-[#0071e3] text-white rounded-full text-xs flex items-center justify-center font-bold">2</span>
              How would you like to order?
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              {orderPaths.map((m) => (
                <button key={m.code} onClick={() => setForm((f) => ({ ...f, orderPath: m.code }))}
                  className={`p-3.5 rounded-xl border-2 text-left transition-all ${form.orderPath === m.code ? "border-[#0071e3] bg-blue-50" : "border-[#e8e8ed] hover:border-[#c7c7cc]"}`}>
                  <div className="text-xl mb-1">{m.icon}</div>
                  <p className="text-xs font-bold text-[#1d1d1f]">{m.name}</p>
                  <p className="text-[10px] text-[#6e6e73]">{m.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white border border-[#e8e8ed] rounded-2xl p-5 sm:p-6">
            <h2 className="font-bold text-[#1d1d1f] mb-4 flex items-center gap-2 text-sm sm:text-base">
              <span className="w-6 h-6 bg-[#0071e3] text-white rounded-full text-xs flex items-center justify-center font-bold">3</span>
              Payment Method
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              {paymentMethods.map((m) => (
                <button key={m.code} onClick={() => setForm((f) => ({ ...f, paymentMethod: m.code }))}
                  className={`p-3.5 rounded-xl border-2 text-left transition-all ${form.paymentMethod === m.code ? "border-[#0071e3] bg-blue-50" : "border-[#e8e8ed] hover:border-[#c7c7cc]"}`}>
                  <div className="text-xl mb-1">{m.icon}</div>
                  <p className="text-xs font-bold text-[#1d1d1f]">{m.name}</p>
                  <p className="text-[10px] text-[#6e6e73]">{m.description}</p>
                </button>
              ))}
            </div>
            {(form.paymentMethod === "card" || form.paymentMethod === "apple-pay") && (
              <p className="mt-3 text-xs text-[#6e6e73] bg-[#f5f5f7] p-3 rounded-xl text-center">
                Online payment integration coming soon. Please choose another payment method or order path.
              </p>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-2">
          <div className="bg-[#f5f5f7] rounded-3xl p-5 sm:p-6 sticky top-20">
            <h2 className="font-bold text-[#1d1d1f] mb-4 text-sm sm:text-base">Order Summary ({cartCount})</h2>
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
                  <p className="text-xs font-bold text-[#1d1d1f] shrink-0">{formatCurrencyPrice(i.product.price_kgs * i.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-[#d2d2d7] pt-4 mb-5">
              <div className="flex justify-between text-xs mb-1.5"><span className="text-[#6e6e73]">Delivery</span><span className="text-[#34c759] font-medium">Free</span></div>
              <div className="flex justify-between"><span className="font-bold text-sm">Total</span><span className="font-black text-lg text-[#1d1d1f]">{formatCurrencyPrice(cartTotal)}</span></div>
            </div>
            <button onClick={handleConfirm}
              className="w-full py-3.5 bg-[#0071e3] text-white rounded-full font-bold hover:bg-[#0064cc] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 text-sm">
              �️ Place Order
            </button>
            <p className="text-[10px] text-[#6e6e73] text-center mt-3">By placing this order, you agree to our Terms & Conditions</p>
          </div>
        </div>
      </div>
    </div>
  );
}