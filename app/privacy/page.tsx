"use client";

import { useState, useEffect } from "react";

export default function PrivacyPage() {
  const [activeId, setActiveId] = useState("collection");

  const sections = [
    { id: "collection", title: "1. Information We Collect" },
    { id: "usage", title: "2. How We Use Data" },
    { id: "sharing", title: "3. Information Sharing" },
    { id: "security", title: "4. Data Security" },
    { id: "rights", title: "5. Your Privacy Rights" },
    { id: "cookies", title: "6. Cookies & Tracking" },
    { id: "children", title: "7. Children's Privacy" },
    { id: "changes", title: "8. Policy Changes" },
    { id: "contact", title: "9. Contact Us" },
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
          Privacy Policy
        </h1>
        <p className="text-lg text-[#6e6e73]">
          How {process.env.NEXT_PUBLIC_STORE_NAME} collects, uses, and protects your personal information.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Левый сайдбар со скролл-спаем и ховером */}
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
          <section id="collection" className="bg-[#f5f5f7] rounded-3xl p-8 border border-[#e5e5ea]/60">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">1. Information We Collect</h2>
            <p className="text-[#6e6e73] leading-relaxed mb-4">
              We collect information you provide directly to us when making a purchase, creating an account, or contacting us, including:
            </p>
            <ul className="space-y-2 text-[#6e6e73] mb-4">
              <li className="flex items-start gap-2">
                <span className="text-black font-bold">✦</span>
                <span>Name, email address, phone number, and shipping/billing address</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black font-bold">✦</span>
                <span>Payment information (securely processed through third-party gateways like Stripe)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black font-bold">✦</span>
                <span>Account credentials and user preferences</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black font-bold">✦</span>
                <span>Any communications or messages you send to our support team</span>
              </li>
            </ul>
            <p className="text-[#6e6e73] leading-relaxed">
              We also automatically collect technical data regarding your device and browser interaction, such as IP address, device type, operating system, and browsing behavior on our site.
            </p>
          </section>

          <section id="usage" className="bg-[#f5f5f7] rounded-3xl p-8 border border-[#e5e5ea]/60">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">2. How We Use Your Information</h2>
            <p className="text-[#6e6e73] leading-relaxed mb-4">
              We use the collected information for various business purposes, including to:
            </p>
            <ul className="space-y-2 text-[#6e6e73]">
              <li className="flex items-start gap-2"><span className="text-black font-bold">✦</span> Process, fulfill, and ship your orders</li>
              <li className="flex items-start gap-2"><span className="text-black font-bold">✦</span> Send transactional updates, order confirmations, and tracking info</li>
              <li className="flex items-start gap-2"><span className="text-black font-bold">✦</span> Provide customer service and respond to your inquiries</li>
              <li className="flex items-start gap-2"><span className="text-black font-bold">✦</span> Improve website functionality, security, and user experience</li>
              <li className="flex items-start gap-2"><span className="text-black font-bold">✦</span> Comply with legal obligations and enforce our terms</li>
              <li className="flex items-start gap-2"><span className="text-black font-bold">✦</span> Send promotional updates or newsletters (only with your explicit consent)</li>
            </ul>
          </section>

          <section id="sharing" className="bg-[#f5f5f7] rounded-3xl p-8 border border-[#e5e5ea]/60">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">3. Information Sharing and Disclosure</h2>
            <p className="text-[#6e6e73] leading-relaxed mb-4">
              We do not sell, rent, or trade your personal information. We may share your data strictly with:
            </p>
            <ul className="space-y-2 text-[#6e6e73]">
              <li className="flex items-start gap-2"><span className="text-black font-bold">✦</span> Trusted service providers who assist us in operating our business (e.g., payment processors, fulfillment and shipping partners)</li>
              <li className="flex items-start gap-2"><span className="text-black font-bold">✦</span> Law enforcement or regulatory authorities if required by applicable law or to protect our legal rights</li>
              <li className="flex items-start gap-2"><span className="text-black font-bold">✦</span> Business entities in connection with a corporate transition, merger, or acquisition</li>
            </ul>
          </section>

          <section id="security" className="bg-[#f5f5f7] rounded-3xl p-8 border border-[#e5e5ea]/60">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">4. Data Security</h2>
            <p className="text-[#6e6e73] leading-relaxed">
              We implement robust technical and physical security measures to protect your personal data. Payment transactions are handled via encrypted protocols through PCI-DSS compliant providers like Stripe. While we strive to protect your data, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section id="rights" className="bg-[#f5f5f7] rounded-3xl p-8 border border-[#e5e5ea]/60">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">5. Your Privacy Rights</h2>
            <p className="text-[#6e6e73] leading-relaxed">
              Depending on your state or place of residence, you may have rights to access, correct, delete, or restrict the use of your personal data. Residents of certain states (such as California under the CCPA) have specific rights regarding the disclosure and handling of their personal info. To exercise these rights, please reach out to us directly.
            </p>
          </section>

          <section id="cookies" className="bg-[#f5f5f7] rounded-3xl p-8 border border-[#e5e5ea]/60">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">6. Cookies and Tracking Technologies</h2>
            <p className="text-[#6e6e73] leading-relaxed">
              We use cookies and similar tracking technologies to enhance user experience, remember preferences, and analyze site traffic. You can modify your browser settings to reject or delete cookies, though doing so may impact certain features of the website.
            </p>
          </section>

          <section id="children" className="bg-[#f5f5f7] rounded-3xl p-8 border border-[#e5e5ea]/60">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">7. Children's Privacy</h2>
            <p className="text-[#6e6e73] leading-relaxed">
              Our platform and services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children. If we discover that a child has provided us with data, we will take immediate steps to delete it.
            </p>
          </section>

          <section id="changes" className="bg-[#f5f5f7] rounded-3xl p-8 border border-[#e5e5ea]/60">
            <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">8. Changes to This Privacy Policy</h2>
            <p className="text-[#6e6e73] leading-relaxed">
              We reserve the right to update or modify this Privacy Policy at any time. Any changes will be posted on this page with an updated revision date. Your continued use of the site constitutes acceptance of those changes.
            </p>
          </section>

          {/* Контакты в стиле темной карточки, как на остальных страницах */}
          <section id="contact" className="bg-[#1d1d1f] text-white rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-white">9. Contact Us</h2>
            <p className="text-[#a1a1a6] mb-6">
              If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at:
            </p>
            <ul className="space-y-2 text-[#a1a1a6] text-sm mb-6">
              <li><strong className="text-white">Email:</strong> {process.env.NEXT_PUBLIC_STORE_EMAIL}</li>
              <li><strong className="text-white">Phone:</strong> {process.env.NEXT_PUBLIC_STORE_PHONE}</li>
              <li><strong className="text-white">Address:</strong> {process.env.NEXT_PUBLIC_STORE_ADDRESS}</li>
            </ul>
            <p className="text-[#86868b] text-xs pt-4 border-t border-white/10">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}