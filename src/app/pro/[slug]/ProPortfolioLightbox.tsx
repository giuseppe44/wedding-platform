"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";

interface ProPortfolioLightboxProps {
  images: string[];
  businessName: string;
}

export default function ProPortfolioLightbox({
  images,
  businessName,
}: ProPortfolioLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") setActiveIndex((i) => (i === null ? null : (i + 1) % images.length));
      if (e.key === "ArrowLeft") setActiveIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, images.length]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {images.map((src, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-stone-200/70 focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label={`Apri foto ${idx + 1} di ${businessName}`}
          >
            <img
              src={src}
              alt={`${businessName} – Portfolio ${idx + 1}`}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
              <span className="text-[11px] font-semibold text-white/90 tracking-wide">
                Scatto #{idx + 1}
              </span>
              <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center">
                <Expand className="w-3.5 h-3.5" />
              </span>
            </div>
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label="Chiudi galleria"
            className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((activeIndex - 1 + images.length) % images.length);
                }}
                aria-label="Foto precedente"
                className="absolute left-3 sm:left-6 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((activeIndex + 1) % images.length);
                }}
                aria-label="Foto successiva"
                className="absolute right-3 sm:right-6 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[activeIndex]}
              alt={`${businessName} – Anteprima ${activeIndex + 1}`}
              className="max-h-[78vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
            />
            <div className="text-xs text-stone-300 font-medium tracking-wider uppercase">
              {businessName} • {activeIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
