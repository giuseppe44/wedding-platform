
"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";
import { motion } from "framer-motion";

export default function MusicPlayer({ src }: { src?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Autoplay policy requires user interaction
    const handleInteraction = () => {
      if (!hasInteracted && audioRef.current && src) {
        setHasInteracted(true);
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          console.log("Autoplay prevented by browser");
        });
      }
    };

    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [hasInteracted, src]);

  const togglePlay = () => {
    if (!audioRef.current || !src) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Playback failed", e));
    }
    setIsPlaying(!isPlaying);
    setHasInteracted(true);
  };

  if (!src) return null; // Don"t render if no track provided

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        onClick={togglePlay}
        className="fixed bottom-6 left-6 z-40 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-stone-200 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors"
        aria-label="Toggle Music"
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5" />
        ) : (
          <div className="relative">
            <VolumeX className="w-5 h-5" />
            <Music className="w-3 h-3 absolute -top-1 -right-2 text-stone-400" />
          </div>
        )}
      </motion.button>
    </>
  );
}

