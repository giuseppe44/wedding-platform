
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Countdown({ date }: { date: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const target = new Date(date).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [date]);

  if (!isMounted) return null;

  const targetDate = new Date(date);
  if (targetDate.getTime() < new Date().getTime()) return null; // Event already passed

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="flex justify-center gap-4 md:gap-8 my-12"
    >
      {[
        { label: "GIORNI", value: timeLeft.days },
        { label: "ORE", value: timeLeft.hours },
        { label: "MINUTI", value: timeLeft.minutes },
        { label: "SECONDI", value: timeLeft.seconds }
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-stone-50 border border-stone-200 rounded-full flex items-center justify-center shadow-sm mb-2">
            <span className="text-xl md:text-2xl font-serif text-stone-800">{item.value}</span>
          </div>
          <span className="text-[10px] md:text-xs tracking-widest text-stone-500">{item.label}</span>
        </div>
      ))}
    </motion.div>
  );
}

