"use client";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/data/products";

export default function CartSidebar() {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useStore();
  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]" onClick={() => setIsCartOpen(false)} />
      <div className="cart-panel fixed right-0 top-0 h-full w-full max-w-[420px] bg-white z-[90] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f5f5f7]">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#1d1d1f]">Корзина</h2>
            {cartCount > 0 && <span className="bg-[#0071e3] text-white text-xs font-bold rounded-full px-2 py-0.5">{cartCount}</span>}
          </div>
          <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-full hover:bg-[#f5f5f7] text-[#6e6e73] text-xl leading-none">×</button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="text-5xl mb-4">🛍️</div>
            <h3 className="text-base font-semibold text-[#1d1d1f] mb-2">Корзина пуста</h3>
            <button onClick={() => setIsCartOpen(false)}
              className="mt-4 px-6 py-2.5 bg-[#0071e3] text-white rounded-full text-sm font-semibold hover:bg-[#0064cc]">
              В магазин
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex gap-3 py-3 border-b border-[#f5f5f7] last:border-0">
                  <div className="w-18 h-18 w-[72px] h-[72px] bg-[#f5f5f7] rounded-xl overflow-hidden shrink-0">
                    <Image src={item.product.image} alt={item.product.name} width={72} height={72}
                      className="w-full h-full object-contain p-1.5" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-[#0071e3] font-semibold">{item.product.category}</p>
                    <p className="font-semibold text-[#1d1d1f] text-xs leading-tight mt-0.5 line-clamp-2">{item.product.name}</p>
                    <p className="font-bold text-[#1d1d1f] text-sm mt-1">{formatPrice(item.product.price_kgs * item.quantity)}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full border border-[#d2d2d7] flex items-center justify-center text-xs font-bold hover:border-[#0071e3] hover:text-[#0071e3]">−</button>
                      <span className="text-xs font-semibold w-5 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full border border-[#d2d2d7] flex items-center justify-center text-xs font-bold hover:border-[#0071e3] hover:text-[#0071e3]">+</button>
                      <button onClick={() => removeFromCart(item.product.id)} className="ml-auto text-[#ff3b30] text-[10px]">Удалить</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[#f5f5f7] px-5 py-4 space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-[#6e6e73] text-sm">Итого ({cartCount})</span>
                <span className="text-lg font-bold text-[#1d1d1f]">{formatPrice(cartTotal)}</span>
              </div>
              <Link href="/checkout" onClick={() => setIsCartOpen(false)}
                className="block w-full py-3 bg-[#0071e3] text-white text-center rounded-full font-semibold text-sm hover:bg-[#0064cc]">
                Оформить заказ →
              </Link>
              <div className="flex gap-2">
                <Link href="/cart" onClick={() => setIsCartOpen(false)}
                  className="flex-1 py-2 border border-[#d2d2d7] text-[#1d1d1f] text-center rounded-full text-xs font-medium hover:border-[#0071e3]">
                  Корзина
                </Link>
                <button onClick={clearCart}
                  className="flex-1 py-2 border border-[#ff3b30] text-[#ff3b30] rounded-full text-xs font-medium hover:bg-red-50">
                  Очистить
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
