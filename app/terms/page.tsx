"use client";

import { useState, useEffect } from "react";

export default function TermsPage() {
  const [activeId, setActiveId] = useState("acceptance");

  const sections = [
    { id: "acceptance", title: "Acceptance" },
    { id: "accounts", title: "User Accounts" },
    { id: "purchases", title: "Purchases & Payments" },
    { id: "shipping", title: "Shipping & Delivery" },
    { id: "liability", title: "Limitation of Liability" },
    { id: "contact", title: "Legal Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveId(section.id);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 scroll-smooth">
      {/* Заголовок страницы */}
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-black text-[#1d1d1f] tracking-tight mb-3">
          Terms of Service
        </h1>
        <p className="text-lg text-[#6e6e73]">
          Please read these terms carefully before using {process.env.NEXT_PUBLIC_STORE_NAME}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Левый сайдбар со скролл-спаем */}
        <div className="hidden lg:block lg:col-span-4 sticky top-24">
          <nav className="space-y-1 border-l-2 border-[#e5e5ea] pl-4">
            {sections.map((section) => {
              const isActive = activeId === section.id;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`block py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-[#1d1d1f] font-bold translate-x-1.5"
                      : "text-[#6e6e73] hover:text-[#1d1d1f] hover:translate-x-1.5"
                  }`}
                >
                  {section.title}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Правая колонка с карточками контента */}
        <div className="lg:col-span-8 space-y-6">
          <section id="acceptance" className="bg-[#f5f5f7] rounded-3xl p-8 border border-[#e5e5ea]/60">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">1. Agreement to Terms</h2>
            <p className="text-[#6e6e73] leading-relaxed">
              By accessing or shopping at {process.env.NEXT_PUBLIC_STORE_NAME}, you agree to comply with and be bound by these Terms of Service. If you disagree with any part of these terms, please do not use our website.
            </p>
          </section>

          <section id="accounts" className="bg-[#f5f5f7] rounded-3xl p-8 border border-[#e5e5ea]/60">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">2. User Accounts</h2>
            <p className="text-[#6e6e73] leading-relaxed">
              When you create an account with us, you must provide accurate and up-to-date information. You are solely responsible for safeguarding your password and all activities that occur under your account.
            </p>
          </section>

          <section id="purchases" className="bg-[#f5f5f7] rounded-3xl p-8 border border-[#e5e5ea]/60">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">3. Purchases & Payments</h2>
            <p className="text-[#6e6e73] leading-relaxed">
              All purchases through our platform are subject to product availability. We reserve the right to refuse or cancel any order for reasons including stock limits, inaccuracies, or suspected fraud. Payments are processed securely via third-party gateways.
            </p>
          </section>

          <section id="shipping" className="bg-[#f5f5f7] rounded-3xl p-8 border border-[#e5e5ea]/60">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">4. Shipping & Delivery</h2>
            <p className="text-[#6e6e73] leading-relaxed">
              Delivery timelines and shipping costs are calculated at checkout. {process.env.NEXT_PUBLIC_STORE_NAME} is not responsible for carrier delays or customs holds outside of our direct control.
            </p>
          </section>

          <section id="liability" className="bg-[#f5f5f7] rounded-3xl p-8 border border-[#e5e5ea]/60">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">5. Limitation of Liability</h2>
            <p className="text-[#6e6e73] leading-relaxed">
              To the maximum extent permitted by law, {process.env.NEXT_PUBLIC_STORE_NAME} shall not be held liable for any indirect, incidental, or consequential damages arising out of your use of our products or website.
            </p>
          </section>

          <section id="contact" className="bg-[#1d1d1f] text-white rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-white">Legal Inquiries</h2>
            <p className="text-[#a1a1a6] mb-6">
              If you have any questions regarding these Terms, please contact us.
            </p>
            <ul className="space-y-2 text-[#a1a1a6] text-sm">
              <li><strong className="text-white">Email:</strong> {process.env.NEXT_PUBLIC_STORE_EMAIL}</li>
              <li><strong className="text-white">Phone:</strong> {process.env.NEXT_PUBLIC_STORE_PHONE}</li>
              <li><strong className="text-white">Address:</strong> {process.env.NEXT_PUBLIC_STORE_ADDRESS}</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}