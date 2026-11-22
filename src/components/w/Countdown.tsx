"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface CountdownProps {
  date: Date | string;
  headline?: string;
  subtitle?: string;
}

export default function Countdown({
  date,
  headline = "Manca questo tempo al grande giorno",
  subtitle = "Il conto alla rovescia ufficiale è iniziato",
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const target = new Date(date).getTime();

    const computeRemaining = () => {
      const now = Date.now();
      const difference = target - now;
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
      }
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        ended: false,
      };
    };

    const initial = computeRemaining();
    setTimeLeft({ days: initial.days, hours: initial.hours, minutes: initial.minutes, seconds: initial.seconds });
    if (initial.ended) return;

    const interval = setInterval(() => {
      const next = computeRemaining();
      setTimeLeft({ days: next.days, hours: next.hours, minutes: next.minutes, seconds: next.seconds });
      if (next.ended) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [date]);

  if (!isMounted) return null;

  const targetDate = new Date(date);
  if (targetDate.getTime() < Date.now()) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="my-10 px-4 text-center"
    >
      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-rose-600 bg-rose-50 border border-rose-200 px-3.5 py-1 rounded-full mb-3">
        <Sparkles className="w-3.5 h-3.5" /> {subtitle}
      </div>
      <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mb-6">{headline}</h2>

      <div className="grid grid-cols-4 gap-2 sm:gap-5 max-w-[330px] sm:max-w-lg mx-auto">
        {[
          { label: "GIORNI", value: timeLeft.days },
          { label: "ORE", value: timeLeft.hours },
          { label: "MINUTI", value: timeLeft.minutes },
          { label: "SECONDI", value: timeLeft.seconds },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.1 + idx * 0.08 }}
            className="flex flex-col items-center"
          >
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white border border-amber-200/80 rounded-full flex items-center justify-center shadow-md mb-1.5">
              <span className="text-lg sm:text-2xl font-serif font-bold text-stone-900 tabular-nums">
                {String(item.value).padStart(2, "0")}
              </span>
            </div>
            <span className="text-[9px] sm:text-xs font-semibold tracking-wider sm:tracking-widest text-stone-500">
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
