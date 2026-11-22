"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import Countdown from "./Countdown";

interface MagicCountdownSectionProps {
  date: Date | string;
  revealKey: string;
  waitForScratch?: boolean;
  headline?: string;
}

export default function MagicCountdownSection({
  date,
  revealKey,
  waitForScratch = true,
  headline = "Manca questo tempo al grande giorno",
}: MagicCountdownSectionProps) {
  const [revealed, setRevealed] = useState(!waitForScratch);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!waitForScratch) return;

    try {
      if (window.sessionStorage.getItem(`gentiluna_scratch_${revealKey}`) === "1") {
        setRevealed(true);
      }
    } catch {
      // ignore storage errors
    }

    const handleRevealEvent = (e: Event) => {
      const custom = e as CustomEvent<{ key?: string }>;
      if (!custom.detail?.key || custom.detail.key === revealKey) {
        setRevealed(true);
        window.setTimeout(() => {
          sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 420);
      }
    };

    window.addEventListener("gentiluna:date-revealed", handleRevealEvent);
    return () => window.removeEventListener("gentiluna:date-revealed", handleRevealEvent);
  }, [revealKey, waitForScratch]);

  const targetDate = new Date(date);
  if (targetDate.getTime() < Date.now()) {
    return null;
  }

  return (
    <div ref={sectionRef} className="max-w-4xl mx-auto px-4 pt-8 scroll-mt-24">
      <AnimatePresence mode="wait">
        {revealed ? (
          <motion.div
            key="countdown-revealed"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="bg-gradient-to-br from-rose-50/70 via-white to-amber-50/60 border border-amber-200/70 rounded-3xl py-4 px-4 shadow-sm"
          >
            <Countdown date={date} headline={headline} />
          </motion.div>
        ) : (
          <motion.div
            key="countdown-waiting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-6"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs sm:text-sm font-medium shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Gratta il riquadro d&apos;oro qui sopra per svelare la data e far apparire il countdown ✨</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
