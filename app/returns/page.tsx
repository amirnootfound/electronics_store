"use client";

import { useState, useEffect } from "react";

export default function ReturnsPage() {
  const [activeId, setActiveId] = useState("window");

  const sections = [
    { id: "window", title: "Return Window" },
    { id: "eligibility", title: "Eligibility" },
    { id: "process", title: "How to Return" },
    { id: "refunds", title: "Refunds" },
    { id: "damaged", title: "Damaged Items" },
    { id: "contact", title: "Support" },
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
          Returns & Refunds
        </h1>
        <p className="text-lg text-[#6e6e73]">
          Everything you need to know about returning items to {process.env.NEXT_PUBLIC_STORE_NAME}.
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
          <section id="window" className="bg-[#f5f5f7] rounded-3xl p-8 border border-[#e5e5ea]/60">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">1. Return Window</h2>
            <p className="text-[#6e6e73] leading-relaxed">
              We want you to love what you buy from {process.env.NEXT_PUBLIC_STORE_NAME}. If you need to make a return, you have <strong className="text-[#1d1d1f]">14 calendar days</strong> from the delivery date to start a request.
            </p>
          </section>

          <section id="eligibility" className="bg-[#f5f5f7] rounded-3xl p-8 border border-[#e5e5ea]/60">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">2. Eligibility for Returns</h2>
            <p className="text-[#6e6e73] leading-relaxed mb-4">
              To qualify for a return, your items must fulfill these simple requirements:
            </p>
            <ul className="space-y-3 text-[#6e6e73]">
              <li className="flex items-start gap-2">
                <span className="text-black font-bold">✦</span>
                <span><strong className="text-[#1d1d1f]">Original Package:</strong> Unopened, undamaged, and in pristine condition.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black font-bold">✦</span>
                <span><strong className="text-[#1d1d1f]">No Signs of Use:</strong> Must include all accessories and manuals.</span>
              </li>
            </ul>
          </section>

          <section id="process" className="bg-[#f5f5f7] rounded-3xl p-8 border border-[#e5e5ea]/60">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">3. How to Initiate a Return</h2>
            <p className="text-[#6e6e73] leading-relaxed">
              Drop us an email at <span className="text-[#1d1d1f] font-semibold">{process.env.NEXT_PUBLIC_STORE_EMAIL}</span> with your order details. Once approved, we will send over the return shipping guidelines and instructions.
            </p>
          </section>

          <section id="refunds" className="bg-[#f5f5f7] rounded-3xl p-8 border border-[#e5e5ea]/60">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">4. Refunds Process</h2>
            <p className="text-[#6e6e73] leading-relaxed">
              After we receive and inspect your package, approved refunds are automatically credited back to your initial payment method within <strong className="text-[#1d1d1f]">5–7 business days</strong>.
            </p>
          </section>

          <section id="damaged" className="bg-[#f5f5f7] rounded-3xl p-8 border border-[#e5e5ea]/60">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">5. Damaged or Defective Items</h2>
            <p className="text-[#6e6e73] leading-relaxed">
              Received something broken or incorrect? Let us know immediately, and we will sort out a replacement or a full refund at zero extra cost.
            </p>
          </section>

          <section id="contact" className="bg-[#1d1d1f] text-white rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-white">Need Help with a Return?</h2>
            <p className="text-[#a1a1a6] mb-6">
              Our support team is always ready to guide you through the process.
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