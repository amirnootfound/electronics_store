import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import SearchModal from "@/components/SearchModal";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TechStore — Premium Electronics Store",
  description: "Your trusted electronics store for Apple, Samsung, and premium electronics. Fast delivery, warranty, and flexible payment options.",
  keywords: "Apple, MacBook, iPhone, iPad, Samsung, electronics, premium, online store",
  openGraph: {
    title: "TechStore — Premium Electronics",
    description: "Your trusted electronics store for premium devices",
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
    <html lang="en" data-scroll-behavior="smooth">
      <body className="bg-white text-[#333] antialiased">
        <CurrencyProvider>
          <StoreProvider>
            <SearchModal />
            <CartSidebar />
            <main className="min-h-screen">{children}</main>

          {/* Footer */}
          <footer className="bg-[#f5f5f7] border-t border-[#d2d2d7] mt-12 sm:mt-20">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                {[
                  { title: "Shop", links: [{ label: "Home", href: "/" }, { label: "Wishlist", href: "/wishlist" }, { label: "Cart", href: "/cart" }, { label: "Checkout", href: "/checkout" }] },
                  { title: "Categories", links: [{ label: "Laptops", href: "/" }, { label: "Smartphones", href: "/" }, { label: "Tablets", href: "/" }, { label: "Accessories", href: "/" }] },
                  { title: "Support", links: [{ label: "About Us", href: "/" }, { label: "Delivery", href: "/" }, { label: "Warranty", href: "/" }, { label: "Returns", href: "/" }] },
                  { title: "Contact", links: [{ label: "123 Main St, City", href: "/" }, { label: "+1 (555) 123-4567", href: "tel:+15551234567" }, { label: "info@techstore.com", href: "mailto:info@techstore.com" }] },
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
                <p>© 2026 TechStore. All rights reserved.</p>
                <Link href="/admin" className="hover:text-[#0071e3]">
                  Admin Panel
                </Link>
              </div>
            </div>
          </footer>
          </StoreProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
