import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import SearchModal from "@/components/SearchModal";
import Link from "next/link";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_STORE_NAME,
  description: "Your trusted electronics store for Apple, Samsung, and premium electronics. Fast delivery, warranty, and flexible payment options.",
  keywords: "Apple, MacBook, iPhone, iPad, Samsung, electronics, premium, online store",
  openGraph: {
    title: process.env.NEXT_PUBLIC_STORE_NAME,
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
                  { title: "Categories", links: [{ label: "Laptops", href: "/?category=Laptops#catalog-section" }, { label: "Smartphones", href: "/?category=Smartphones#catalog-section" }, { label: "Tablets", href: "/?category=Tablets#catalog-section" }, { label: "Accessories", href: "/?category=Accessories#catalog-section" }] },
                  { title: "Support", links: [{ label: "About Us", href: "/about" }, { label: "Privacy", href: "/privacy" }, { label: "Terms of Service", href: "/terms" }, { label: "Returns", href: "/returns" }] },
                  { title: "Contact", links: [{ label: process.env.NEXT_PUBLIC_STORE_ADDRESS, href: "/" }, { label: process.env.NEXT_PUBLIC_STORE_PHONE, href: "tel:" + process.env.NEXT_PUBLIC_STORE_PHONE }, { label: process.env.NEXT_PUBLIC_STORE_EMAIL, href: "mailto:" + process.env.NEXT_PUBLIC_STORE_EMAIL }] },
                ].map((col) => (
                  <div key={col.title}>
                    <h4 className="font-semibold text-[#1d1d1f] mb-4 text-sm">{col.title}</h4>
                    <ul className="space-y-2">
                      {col.links.map((l) => (
                        <li key={l.label}><Link href={l.href} className="text-xs sm:text-sm text-[#6e6e73] hover:text-[#0071e3]">{l.label}</Link></li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#d2d2d7] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[#6e6e73]">
                <p>© 2026 {process.env.NEXT_PUBLIC_STORE_NAME}. All rights reserved</p>
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
