"use client";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { useCurrency } from "@/context/CurrencyContext";
import { formatPrice } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, products } = useStore();
  const { formatPrice: formatCurrencyPrice } = useCurrency();
  const recommended = products.filter((p) => !cartItems.find((i) => i.product.id === p.id)).slice(0, 4);

  if (cartItems.length === 0) return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center text-center px-6 fade-in">
      <div className="text-6xl mb-5">🛍️</div>
      <h1 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] mb-2">Your cart is empty</h1>
      <p className="text-[#6e6e73] mb-7">Add items you like to your cart</p>
      <Link href="/" className="px-7 py-3 bg-[#0071e3] text-white rounded-full font-semibold hover:bg-[#0064cc]">Shop Now</Link>
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 sm:py-10 fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-[#1d1d1f]">Cart <span className="text-base font-normal text-[#6e6e73]">({cartCount})</span></h1>
        <button onClick={clearCart} className="text-xs text-[#ff3b30] hover:underline">Clear</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {cartItems.map((item) => (
            <div key={item.product.id} className="flex gap-4 p-4 bg-white border border-[#e8e8ed] rounded-2xl">
              <Link href={`/product/${item.product.id}`}>
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#f5f5f7] rounded-xl overflow-hidden shrink-0">
                  <Image src={item.product.image} alt={item.product.name} width={96} height={96} className="w-full h-full object-contain p-2" unoptimized />
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-[#0071e3] font-bold uppercase tracking-wide">{item.product.category}</p>
                <p className="font-semibold text-[#1d1d1f] text-sm mt-0.5 line-clamp-2">{item.product.name}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-[#6e6e73]">Qty: {item.quantity}</span>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-[#1d1d1f]">{formatCurrencyPrice(item.product.price_kgs * item.quantity)}</p>
                    <button onClick={() => removeFromCart(item.product.id)} className="text-[#ff3b30] text-xs">Remove</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="bg-[#f5f5f7] rounded-3xl p-5 sm:p-6 sticky top-20">
            <h2 className="font-bold text-[#1d1d1f] mb-5">Order Summary</h2>
            <div className="space-y-2 mb-5">
              {cartItems.map((i) => (
                <div key={i.product.id} className="flex justify-between text-xs">
                  <span className="text-[#6e6e73] flex-1 mr-2 line-clamp-1">{i.product.name} ×{i.quantity}</span>
                  <span className="font-medium shrink-0">{formatCurrencyPrice(i.product.price_kgs * i.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#d2d2d7] pt-4 mb-5">
              <div className="flex justify-between text-sm"><span className="text-[#6e6e73]">Delivery</span><span className="text-[#34c759] font-medium">Free</span></div>
              <div className="flex justify-between mt-2"><span className="font-bold text-[#1d1d1f]">Total</span><span className="font-black text-[#1d1d1f] text-lg">{formatCurrencyPrice(cartTotal)}</span></div>
            </div>
            <Link href="/checkout" className="block w-full py-3.5 bg-[#0071e3] text-white text-center rounded-full font-bold hover:bg-[#0064cc] text-sm">Checkout →</Link>
            <p className="text-[10px] text-[#6e6e73] text-center mt-3">🔒 Secure Payment</p>
          </div>
        </div>
      </div>
      {recommended.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-bold text-[#1d1d1f] mb-5">You might also like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {recommended.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
