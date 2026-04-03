"use client";
// ============================================================
// IMAGE GALLERY — Zoom + swipe for product detail page
// ============================================================

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  name: string;
}

export default function ImageGallery({ images, name }: ImageGalleryProps) {
  const all = images.length > 0 ? images : ["/placeholder.png"];
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Keyboard nav
  useEffect(() => {
    if (!zoomed) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setSelected((s) => (s + 1) % all.length);
      if (e.key === "ArrowLeft") setSelected((s) => (s - 1 + all.length) % all.length);
      if (e.key === "Escape") setZoomed(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [zoomed, all.length]);

  useEffect(() => {
    if (zoomed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [zoomed]);

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) setSelected((s) => (s + 1) % all.length);
      else setSelected((s) => (s - 1 + all.length) % all.length);
    }
    setTouchStartX(null);
  };

  const prev = useCallback(() => setSelected((s) => (s - 1 + all.length) % all.length), [all.length]);
  const next = useCallback(() => setSelected((s) => (s + 1) % all.length), [all.length]);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className="relative bg-[#f5f5f7] rounded-2xl sm:rounded-3xl overflow-hidden cursor-zoom-in"
        style={{ aspectRatio: "1 / 1" }}
        onClick={() => setZoomed(true)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={all[selected]}
          alt={`${name} - Image ${selected + 1}`}
          fill
          sizes="(max-width:768px) 100vw, 50vw"
          className="object-contain p-6 sm:p-12"
          unoptimized
          priority
        />
        {/* Zoom hint */}
        <div className="absolute bottom-3 right-3 bg-black/30 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          🔍 Нажмите для увеличения
        </div>
        {/* Arrows if multiple */}
        {all.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full shadow flex items-center justify-center text-[#1d1d1f] transition-all hover:scale-110"
            >
              ‹
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full shadow flex items-center justify-center text-[#1d1d1f] transition-all hover:scale-110"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {all.length > 1 && (
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {all.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                selected === i ? "border-[#0071e3] shadow-md" : "border-transparent hover:border-[#c7c7cc]"
              }`}
            >
              <Image src={img} alt={`${name} thumb ${i + 1}`} width={80} height={80}
                className="w-full h-full object-contain p-1.5 bg-[#f5f5f7]"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}

      {/* ── Zoom Overlay ── */}
      {zoomed && (
        <div
          className="zoom-overlay fixed inset-0 bg-black/90 z-[150] flex items-center justify-center"
          onClick={() => setZoomed(false)}
        >
          <button onClick={() => setZoomed(false)}
            className="absolute top-4 right-4 text-white text-3xl w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            ×
          </button>

          {all.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              >
                ‹
              </button>
              <button onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              >
                ›
              </button>
            </>
          )}

          <div className="relative w-full max-w-2xl aspect-square mx-8" onClick={(e) => e.stopPropagation()}>
            <Image
              src={all[selected]}
              alt={name}
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {selected + 1} / {all.length} — нажмите Esc или за пределами
          </div>
        </div>
      )}
    </div>
  );
}
