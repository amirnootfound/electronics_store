"use client";
// ============================================================
// IMAGE UPLOADER — Multi-file drag-and-drop → Supabase Storage
// ============================================================

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { uploadProductImage, deleteProductImage } from "@/lib/supabase";

interface ImageUploaderProps {
  images: string[];
  onChange: (urls: string[]) => void;
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArr = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (!fileArr.length) return;

      setUploading(true);
      setProgress(fileArr.map(() => 0));
      const urls: string[] = [...images];

      for (let i = 0; i < fileArr.length; i++) {
      // Полностью удали эти строки (isConfigured и т.д.)
      // Сразу внутри цикла пиши:

      const file = fileArr[i];
      setUploading(true);

      // ПРЯМОЙ ВЫЗОВ БЕЗ ПРОВЕРОК
      const url = await uploadProductImage(file);

      if (url) {
        urls.push(url);
      } else {
      //  Если вернулся null, значит либо интернет, либо права в Supabase
      alert("Бро, Supabase не отдал ссылку. Проверь консоль!");
      }

      setProgress((p) => p.map((v, idx) => (idx === i ? 100 : v)));
      }

      onChange(urls);
      setUploading(false);
      setProgress([]);
    },
    [images, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleRemove = async (url: string, idx: number) => {
    const isSupabaseUrl = url.includes("supabase");
    if (isSupabaseUrl) await deleteProductImage(url);
    onChange(images.filter((_, i) => i !== idx));
  };

  const handleSetPrimary = (idx: number) => {
    const reordered = [images[idx], ...images.filter((_, i) => i !== idx)];
    onChange(reordered);
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          dragOver
            ? "border-[#0071e3] bg-blue-50"
            : "border-[#d2d2d7] hover:border-[#0071e3] hover:bg-[#f9f9fb]"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && processFiles(e.target.files)}
        />
        {uploading ? (
          <div className="space-y-3">
            <div className="text-2xl">⏳</div>
            <p className="text-sm font-medium text-[#1d1d1f]">Загрузка изображений...</p>
            <div className="space-y-1.5">
              {progress.map((p, i) => (
                <div key={i} className="h-1.5 bg-[#f5f5f7] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0071e3] rounded-full transition-all duration-300"
                    style={{ width: `${p}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="text-3xl mb-2">{dragOver ? "📂" : "🖼️"}</div>
            <p className="text-sm font-semibold text-[#1d1d1f]">
              {dragOver ? "Отпустите файлы здесь" : "Перетащите изображения или нажмите"}
            </p>
            <p className="text-xs text-[#6e6e73] mt-1">PNG, JPG, WebP — до 10МБ каждый · Несколько файлов</p>
          </div>
        )}
      </div>

      {/* Preview grid */}
      {images.length > 0 && (
        <div>
          <p className="text-xs text-[#6e6e73] font-medium mb-2">
            Галерея ({images.length} фото) — первое изображение = главное
          </p>
          <div className="flex flex-wrap gap-2">
            {images.map((url, idx) => (
              <div
                key={url + idx}
                className={`relative group w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  idx === 0 ? "border-[#0071e3]" : "border-[#e8e8ed]"
                }`}
              >
                <Image src={url} alt={`Image ${idx + 1}`} fill
                  className="object-contain p-1 bg-[#f5f5f7]" unoptimized />

                {/* Primary badge */}
                {idx === 0 && (
                  <div className="absolute top-0.5 left-0.5 bg-[#0071e3] text-white text-[8px] font-bold px-1 py-0.5 rounded-full leading-none">
                    Главное
                  </div>
                )}

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  {idx !== 0 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSetPrimary(idx); }}
                      className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[10px]"
                      title="Сделать главным"
                    >
                      ⭐
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemove(url, idx); }}
                    className="w-6 h-6 bg-[#ff3b30] rounded-full flex items-center justify-center text-white text-xs"
                    title="Удалить"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}

            {/* Add more button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-xl border-2 border-dashed border-[#d2d2d7] hover:border-[#0071e3] flex items-center justify-center text-[#6e6e73] hover:text-[#0071e3] transition-colors text-2xl"
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
