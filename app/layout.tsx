import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import SearchModal from "@/components/SearchModal";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TechStore KG — Premium Electronics Bishkek",
  description: "Официальный магазин Apple, Samsung и премиальной электроники в Бишкеке, Кыргызстан. Быстрая доставка, гарантия, рассрочка.",
  keywords: "Apple, MacBook, iPhone, iPad, Samsung, электроника, Бишкек, Кыргызстан",
  openGraph: {
    title: "TechStore KG",
    description: "Premium electronics in Bishkek",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-scroll-behavior="smooth">
      <body className="bg-white text-[#333] antialiased">
        <StoreProvider>
          <SearchModal />
          <CartSidebar />
          <main className="min-h-screen">{children}</main>

          {/* Footer */}
          <footer className="bg-[#f5f5f7] border-t border-[#d2d2d7] mt-12 sm:mt-20">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                {[
                  { title: "Магазин", links: [{ label: "Главная", href: "/" }, { label: "Избранное", href: "/wishlist" }, { label: "Корзина", href: "/cart" }, { label: "Заказать", href: "/checkout" }] },
                  { title: "Категории", links: [{ label: "MacBook", href: "/" }, { label: "iPhone", href: "/" }, { label: "iPad", href: "/" }, { label: "Apple Watch", href: "/" }] },
                  { title: "Поддержка", links: [{ label: "О нас", href: "/" }, { label: "Доставка", href: "/" }, { label: "Гарантия", href: "/" }, { label: "Возврат", href: "/" }] },
                  { title: "Контакты", links: [{ label: "пр. Чуй 123, Бишкек", href: "/" }, { label: "+996 700 123 456", href: "tel:+996700123456" }, { label: "info@techstore.kg", href: "mailto:info@techstore.kg" }] },
                ].map((col) => (
                  <div key={col.title}>
                    <h4 className="font-semibold text-[#1d1d1f] mb-4 text-sm">{col.title}</h4>
                    <ul className="space-y-2">
                      {col.links.map((l) => (
                        <li key={l.label}><a href={l.href} className="text-xs sm:text-sm text-[#6e6e73] hover:text-[#0071e3]">{l.label}</a></li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#d2d2d7] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[#6e6e73]">
                <p>© 2024 TechStore KG. Все права защищены.</p>
                <Link href="/admin" className="hover:text-[#0071e3]">
                  Панель администратора
                </Link>
              </div>
            </div>
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
