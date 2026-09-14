"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, QrCode } from "lucide-react";

// Mockup photos per la slideshow live
const mockPhotos = [
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522083165195-3444bed50be9?q=80&w=2070&auto=format&fit=crop"
];

export default function LiveProjectorMode() {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [randomGuestId, setRandomGuestId] = useState(55); // Use state to avoid hydration mismatch

  // Simula l'arrivo di nuove foto alternandole ogni 6 secondi
  useEffect(() => {
    setRandomGuestId(Math.floor(Math.random() * 100)); // Set initial guest ID on mount
    const interval = setInterval(() => {
      setCurrentPhoto((prev) => (prev + 1) % mockPhotos.length);
      setRandomGuestId(Math.floor(Math.random() * 100));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center overflow-hidden relative">
      
      {/* Sfondo sfocato dinamico */}
      <AnimatePresence mode="wait">
        <motion.img 
          key={`bg-${currentPhoto}`}
          src={mockPhotos[currentPhoto]} 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 w-full h-full object-cover blur-3xl scale-110"
        />
      </AnimatePresence>

      {/* HEADER: Branding e Logo (Responsivo: colonna su mobile, riga su desktop) */}
      <div className="absolute top-4 left-4 right-4 md:top-8 md:left-8 md:right-8 z-30 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-white drop-shadow-md leading-none">Marco & Giulia</h1>
          <p className="text-stone-300 tracking-[0.2em] md:tracking-[0.3em] uppercase text-xs md:text-sm mt-2">15 Settembre 2026</p>
        </div>
        <div className="text-stone-400 font-serif flex items-center gap-2 text-xs md:text-base bg-stone-950/50 md:bg-transparent px-3 py-1.5 md:p-0 rounded-full backdrop-blur-md md:backdrop-blur-none border border-white/10 md:border-transparent shadow-lg md:shadow-none">
          Powered by <span className="text-white">ecos.com <span className="text-rose-500 font-bold italic">LIVE</span></span>
        </div>
      </div>

      {/* Area Foto Centrale (Polaroid Style) */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-center p-4 md:p-12 mt-12 md:mt-0 mb-20 md:mb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhoto}
            initial={{ opacity: 0, scale: 0.9, y: 30, rotate: (Math.random() - 0.5) * 6 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: (Math.random() - 0.5) * 3 }}
            exit={{ opacity: 0, scale: 1.05, y: -30 }}
            transition={{ duration: 1.2, type: "spring" }}
            className="bg-white p-3 pb-16 md:p-6 md:pb-24 shadow-2xl rounded-sm w-full aspect-[4/3] md:aspect-[4/3] relative max-w-3xl mx-auto"
          >
            <img 
              src={mockPhotos[currentPhoto]} 
              className="w-full h-full object-cover rounded-sm shadow-inner" 
              alt="Live Wedding Photo"
            />
            <div className="absolute bottom-3 md:bottom-6 left-0 right-0 text-center px-2">
              <p className="font-serif text-xl md:text-3xl text-stone-800 line-clamp-1">
                Caricata da: <span className="italic">Ospite #{randomGuestId}</span>
              </p>
            </div>
            
            {/* Timbro decorativo - Ridimensionato su mobile */}
            <div className="absolute -bottom-6 -right-2 md:-bottom-8 md:-right-8 w-20 h-20 md:w-32 md:h-32 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-xl rotate-12 z-20">
              <Heart className="w-8 h-8 md:w-12 md:h-12 fill-current" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* FOOTER: QR Code e Condivisione */}
      <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-auto z-30 flex items-center gap-4 md:gap-6 bg-stone-900/60 backdrop-blur-md p-3 md:p-4 rounded-3xl border border-white/10 shadow-2xl">
        <div className="w-16 h-16 md:w-24 md:h-24 bg-white p-1.5 md:p-2 rounded-xl shadow-lg shrink-0">
          {/* Simula un QR Code */}
          <div className="w-full h-full border-2 md:border-4 border-stone-900 flex items-center justify-center border-dashed rounded-lg">
            <QrCode className="w-8 h-8 md:w-10 md:h-10 text-stone-900" />
          </div>
        </div>
        <div className="text-white">
          <p className="font-bold text-lg md:text-2xl leading-tight">Condividi ora!</p>
          <p className="text-stone-300 text-xs md:text-lg mt-0.5 md:mt-1">Inquadra per inviare le foto</p>
        </div>
      </div>
      
    </div>
  );
}
