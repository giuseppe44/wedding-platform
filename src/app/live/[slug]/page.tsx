"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, QrCode } from "lucide-react";
import { getLiveMedia } from "@/app/actions";

type LiveMedia = { url: string; uploaderName?: string | null; guestMessage?: string | null };

const fallbackPhotos: LiveMedia[] = [
  { url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop" },
  { url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop" }
];

export default function LiveProjectorMode({ params }: { params: { slug: string } }) {
  const [photos, setPhotos] = useState<LiveMedia[]>(fallbackPhotos);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [baseUrl, setBaseUrl] = useState("");

  const fetchPhotos = async () => {
    try {
      const realMedia = await getLiveMedia(params.slug);
      if (realMedia && realMedia.length > 0) {
        setPhotos(realMedia);
      }
    } catch (e) {
      console.error("Errore nel caricamento delle foto live", e);
    }
  };

  useEffect(() => {
    setBaseUrl(window.location.origin);
    fetchPhotos();

    const pollInterval = setInterval(fetchPhotos, 10000);

    const slideInterval = setInterval(() => {
      setCurrentPhoto((prev) => (prev + 1) % photos.length);
    }, 5000);

    return () => {
      clearInterval(pollInterval);
      clearInterval(slideInterval);
    };
  }, [photos.length, params.slug]);

  const activeMedia = photos[currentPhoto] || fallbackPhotos[0];

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center overflow-hidden relative">
      
      {/* BACKGROUND BLURRED */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={`bg-${currentPhoto}`}
            src={activeMedia.url}
            className="w-full h-full object-cover opacity-30 blur-3xl scale-110"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-stone-950/40" />
      </div>

      {/* MAIN PHOTO CONTAINER */}
      <div className="relative z-10 w-full h-[60vh] md:h-screen p-4 md:p-16 flex items-center justify-center pt-24 md:pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhoto}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-6xl max-h-full rounded-2xl md:rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10"
            style={{ aspectRatio: '16/9' }}
          >
            <img 
              src={activeMedia.url}
              alt="Live Wedding Memory" 
              className="w-full h-full object-contain bg-stone-900/80 backdrop-blur-sm"
            />
            
            {/* DEDICA OVERLAY */}
            {(activeMedia.guestMessage || activeMedia.uploaderName) && (
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                {activeMedia.guestMessage && (
                  <p className="text-xl md:text-4xl text-white font-serif italic drop-shadow-md mb-2 md:mb-4">
                    "{activeMedia.guestMessage}"
                  </p>
                )}
                {activeMedia.uploaderName && (
                  <p className="text-stone-300 font-sans tracking-widest uppercase text-sm md:text-lg drop-shadow-md">
                    Da parte di <strong className="text-white font-bold">{activeMedia.uploaderName}</strong>
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* HEADER OVERLAY */}
      <div className="absolute top-0 left-0 w-full p-4 md:p-8 z-30 flex flex-col md:flex-row justify-between items-center bg-gradient-to-b from-stone-950/80 to-transparent gap-2 md:gap-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-14 h-14 rounded-full bg-rose-500/20 flex items-center justify-center backdrop-blur-md border border-rose-500/30">
            <Heart className="w-5 h-5 md:w-7 md:h-7 text-rose-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-serif text-white tracking-wide shadow-black drop-shadow-md">ecos.com <span className="font-light text-rose-300">LIVE</span></h1>
            <p className="text-xs md:text-sm text-stone-300 tracking-widest uppercase shadow-black drop-shadow-md">Condividi le tue emozioni</p>
          </div>
        </div>
      </div>

      {/* FOOTER: QR Code */}
      <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-auto z-30 flex items-center gap-4 md:gap-6 bg-stone-900/60 backdrop-blur-md p-3 md:p-4 rounded-3xl border border-white/10 shadow-2xl">
        <div className="w-16 h-16 md:w-24 md:h-24 bg-white p-1.5 md:p-2 rounded-xl shadow-lg shrink-0">
          <div className="w-full h-full border-2 md:border-4 border-stone-900 flex items-center justify-center border-dashed rounded-lg">
            {baseUrl && (
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${baseUrl}/w/${params.slug}/upload`}
                alt="QR Code Matrimonio"
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>
        <div>
          <p className="text-white text-base md:text-2xl font-serif mb-0.5 md:mb-1 drop-shadow-md">Inquadra per partecipare!</p>
          <p className="text-stone-300 text-xs md:text-sm max-w-[200px] md:max-w-xs leading-snug drop-shadow-md">
            Scansiona questo QR Code col telefono e carica subito foto e messaggi!
          </p>
        </div>
      </div>
    </div>
  );
}
