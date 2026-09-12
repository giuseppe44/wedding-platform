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

  // Simula l'arrivo di nuove foto alternandole ogni 6 secondi
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhoto((prev) => (prev + 1) % mockPhotos.length);
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

      {/* Area Foto Centrale (Polaroid Style) */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhoto}
            initial={{ opacity: 0, scale: 0.9, y: 50, rotate: (Math.random() - 0.5) * 10 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: (Math.random() - 0.5) * 4 }}
            exit={{ opacity: 0, scale: 1.1, y: -50 }}
            transition={{ duration: 1.5, type: "spring" }}
            className="bg-white p-6 pb-24 shadow-2xl rounded-sm max-w-5xl w-full aspect-[4/3] relative"
          >
            <img 
              src={mockPhotos[currentPhoto]} 
              className="w-full h-full object-cover rounded-sm shadow-inner" 
              alt="Live Wedding Photo"
            />
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <p className="font-serif text-3xl text-stone-800">Caricata da: <span className="italic">Ospite #{Math.floor(Math.random() * 100)}</span></p>
            </div>
            
            {/* Timbro decorativo */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-xl rotate-12">
              <Heart className="w-12 h-12 fill-current" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Overlay fisso (Branding e QR) */}
      <div className="absolute top-8 left-8 z-20">
        <h1 className="text-4xl font-serif text-white drop-shadow-md">Marco & Giulia</h1>
        <p className="text-stone-300 tracking-[0.3em] uppercase text-sm mt-2">15 Settembre 2026</p>
      </div>

      <div className="absolute bottom-8 left-8 z-20 flex items-center gap-6 bg-stone-900/50 backdrop-blur-md p-4 rounded-3xl border border-white/10">
        <div className="w-24 h-24 bg-white p-2 rounded-xl shadow-lg">
          {/* Simula un QR Code - In produzione usa QRCode component */}
          <div className="w-full h-full border-4 border-stone-900 flex items-center justify-center border-dashed">
            <QrCode className="w-10 h-10 text-stone-900" />
          </div>
        </div>
        <div className="text-white">
          <p className="font-bold text-2xl">Condividi ora!</p>
          <p className="text-stone-300 text-lg">Inquadra per inviare le tue foto</p>
        </div>
      </div>
      
      <div className="absolute top-8 right-8 z-20 text-stone-500 font-serif flex items-center gap-2">
        Powered by <span className="text-white">ecos.com <span className="text-rose-500 font-bold italic">LIVE</span></span>
      </div>

    </div>
  );
}
