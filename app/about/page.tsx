"use client";

import { useState, useEffect } from "react";

export default function AboutPage() {
  const [activeId, setActiveId] = useState("welcome");

  const sections = [
    { id: "welcome", title: "Welcome" },
    { id: "mission", title: "Mission & Values" },
    { id: "why-us", title: "Why Choose Us" },
    { id: "contact", title: "Get in Touch" },
  ];

  // Логика автоматического переключения при скролле
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250; // Смещение для срабатывания

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
          About Us
        </h1>
        <p className="text-lg text-[#6e6e73]">
          Behind the scenes of {process.env.NEXT_PUBLIC_STORE_NAME} and what drives us forward.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Левый сайдбар с живым скролл-спаем и ховером */}
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
                      ? "text-[#1d1d1f] font-bold translate-x-1.5" // Активный пункт (без кривой полоски, просто жирный и сдвинутый)
                      : "text-[#6e6e73] hover:text-[#1d1d1f] hover:translate-x-1.5" // Обычный пункт с твоим ховером
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
          <section id="welcome" className="bg-[#f5f5f7] rounded-3xl p-8 border border-[#e5e5ea]/60">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">Welcome to {process.env.NEXT_PUBLIC_STORE_NAME}</h2>
            <p className="text-[#6e6e73] leading-relaxed mb-4">
              At {process.env.NEXT_PUBLIC_STORE_NAME}, we are passionate about bringing high-quality products and an exceptional shopping experience directly to our customers.
            </p>
            <p className="text-[#6e6e73] leading-relaxed">
              Whether you are looking for the latest releases, expert advice, or top-tier customer service, our platform is designed to make your journey seamless and secure.
            </p>
          </section>

          <section id="mission" className="bg-[#f5f5f7] rounded-3xl p-8 border border-[#e5e5ea]/60">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">Our Mission & Values</h2>
            <p className="text-[#6e6e73] leading-relaxed mb-4">
              Modern commerce should be transparent, lightning-fast, and focused entirely on the user.
            </p>
            <ul className="space-y-3 text-[#6e6e73]">
              <li className="flex items-start gap-2">
                <span className="text-black font-bold">✦</span> 
                <span><strong className="text-[#1d1d1f]">Quality First:</strong> Only top-tier standards for our catalog.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black font-bold">✦</span> 
                <span><strong className="text-[#1d1d1f]">Customer Centric:</strong> Your feedback shapes our evolution.</span>
              </li>
            </ul>
          </section>

          <section id="why-us" className="bg-[#f5f5f7] rounded-3xl p-8 border border-[#e5e5ea]/60">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">Why Choose Us?</h2>
            <p className="text-[#6e6e73] leading-relaxed">
              We combine cutting-edge tech architecture with genuine care. Fast fulfillment, clean UX, and ironclad security make {process.env.NEXT_PUBLIC_STORE_NAME} stand out from the crowd.
            </p>
          </section>

          <section id="contact" className="bg-[#1d1d1f] text-white rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-white">Get in Touch</h2>
            <p className="text-[#a1a1a6] mb-6">
              Have questions or need assistance? Reach out to our team anytime.
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