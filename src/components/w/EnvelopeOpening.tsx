"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface EnvelopeOpeningProps {
  initials: string;
  coupleNames?: string;
  date?: Date | string | null;
  children: React.ReactNode;
}

const SPARKLES = [
  { top: "10%", left: "12%", size: 6, delay: 0, dur: 4.2 },
  { top: "20%", left: "84%", size: 8, delay: 0.8, dur: 5.0 },
  { top: "74%", left: "14%", size: 5, delay: 1.4, dur: 4.6 },
  { top: "82%", left: "86%", size: 7, delay: 0.4, dur: 5.4 },
  { top: "36%", left: "7%", size: 4, delay: 2.0, dur: 3.8 },
  { top: "58%", left: "92%", size: 6, delay: 1.1, dur: 4.8 },
  { top: "14%", left: "50%", size: 5, delay: 1.7, dur: 4.4 },
  { top: "89%", left: "44%", size: 4, delay: 0.6, dur: 5.2 },
];

export default function EnvelopeOpening({
  initials,
  coupleNames,
  date,
  children,
}: EnvelopeOpeningProps) {
  const [phase, setPhase] = useState<"closed" | "opening" | "revealed">("closed");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleOpen = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    setTimeout(() => {
      setPhase("revealed");
    }, 1350);
  };

  if (!isMounted) return null;

  if (phase === "revealed") {
    return <>{children}</>;
  }

  const formattedDate = date
    ? new Date(date).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden touch-none px-4"
      style={{
        background:
          "radial-gradient(ellipse at 50% 30%, #fffcf7 0%, #f5eadc 52%, #e6d3bc 100%)",
      }}
    >
      {/* Ambient luxury light orbs */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-amber-300/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] rounded-full bg-white/55 blur-3xl" />

      {/* Double Ornamental Gold Frame */}
      <div className="pointer-events-none absolute inset-4 sm:inset-8 border border-amber-800/20 rounded-3xl" />
      <div className="pointer-events-none absolute inset-6 sm:inset-10 border border-amber-800/12 rounded-2xl" />

      {/* Floating golden shimmer dust */}
      {SPARKLES.map((sp, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute rounded-full bg-amber-500/75 shadow-[0_0_12px_rgba(180,83,9,0.45)]"
          style={{ top: sp.top, left: sp.left, width: sp.size, height: sp.size }}
          animate={{ opacity: [0.2, 0.95, 0.2], y: [0, -14, 0], scale: [0.85, 1.25, 0.85] }}
          transition={{ repeat: Infinity, duration: sp.dur, delay: sp.delay, ease: "easeInOut" }}
        />
      ))}

      <AnimatePresence mode="wait">
        <motion.div
          key="envelope-stage"
          initial={{ opacity: 0, y: 24 }}
          animate={
            phase === "opening"
              ? { opacity: 0, scale: 1.08, y: -16 }
              : { opacity: 1, y: 0, scale: 1 }
          }
          transition={{
            duration: phase === "opening" ? 0.55 : 0.9,
            delay: phase === "opening" ? 0.8 : 0,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative z-10 flex flex-col items-center w-full max-w-xl"
        >
          {/* High-Contrast Editorial Header */}
          <div className="text-center mb-8 sm:mb-10 space-y-2.5">
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2.5 px-4 py-1 rounded-full bg-amber-900/10 border border-amber-800/20 text-[11px] sm:text-xs font-bold uppercase tracking-[0.3em] text-amber-950"
            >
              <span>✦</span> Siete Invitati <span>✦</span>
            </motion.div>

            {coupleNames && (
              <h1 className="text-4xl sm:text-6xl font-serif font-semibold text-stone-950 tracking-tight leading-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                {coupleNames}
              </h1>
            )}

            <div className="flex items-center justify-center gap-3 pt-0.5">
              <span className="h-[1px] w-10 bg-gradient-to-r from-transparent to-amber-700/50" />
              {formattedDate ? (
                <p className="text-sm sm:text-base font-serif italic font-medium text-stone-800 tracking-wide">
                  {formattedDate}
                </p>
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              )}
              <span className="h-[1px] w-10 bg-gradient-to-l from-transparent to-amber-700/50" />
            </div>
          </div>

          {/* Interactive Luxury 3D Envelope */}
          <motion.div
            onClick={handleOpen}
            whileHover={phase === "closed" ? { y: -5, scale: 1.02 } : undefined}
            whileTap={phase === "closed" ? { scale: 0.985 } : undefined}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative w-[330px] h-[220px] sm:w-[480px] sm:h-[312px] cursor-pointer select-none"
            style={{ perspective: 1300 }}
          >
            {/* Deep realistic ground shadow */}
            <div className="absolute -bottom-6 left-7 right-7 h-10 bg-stone-950/25 blur-2xl rounded-full" />

            {/* Silk Burgundy Inner Liner (visible inside as top flap lifts) */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden shadow-[0_24px_55px_rgba(68,46,29,0.28)] border border-amber-900/20"
              style={{
                background:
                  "linear-gradient(155deg, #6b1628 0%, #4a0e1b 55%, #2f0811 100%)",
              }}
            >
              {/* Gold subtle pattern on silk liner */}
              <div className="absolute inset-2.5 border border-amber-300/25 rounded-xl pointer-events-none" />
            </div>

            {/* Cream Invitation Card sliding up when opening */}
            <motion.div
              initial={{ y: 6, opacity: 0 }}
              animate={
                phase === "opening"
                  ? { y: -125, opacity: 1 }
                  : { y: 10, opacity: 0 }
              }
              transition={{ duration: 0.78, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-5 top-4 bottom-4 rounded-xl bg-[#fffdf8] border border-amber-400/70 shadow-2xl flex flex-col items-center justify-center p-5 text-center z-10"
            >
              <div className="w-full h-full border border-amber-700/25 rounded-lg flex flex-col items-center justify-center gap-2 px-4">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <p className="text-[11px] uppercase tracking-[0.28em] text-amber-900 font-bold">
                  Con gioia vi invitiamo
                </p>
                <p className="font-serif text-2xl sm:text-3xl text-stone-950 font-semibold">
                  {coupleNames || initials}
                </p>
              </div>
            </motion.div>

            {/* Cotton-Paper Envelope Front Flaps (Left, Right, Bottom) */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-20">
              <svg
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
              >
                <defs>
                  <linearGradient id="leftFlapLux" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#faf3e9" />
                    <stop offset="100%" stopColor="#e8dac7" />
                  </linearGradient>
                  <linearGradient id="rightFlapLux" x1="1" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f8f0e4" />
                    <stop offset="100%" stopColor="#e4d4be" />
                  </linearGradient>
                  <linearGradient id="bottomFlapLux" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fffaf2" />
                    <stop offset="100%" stopColor="#ebdcc8" />
                  </linearGradient>
                </defs>
                <polygon points="0,0 50,53 0,100" fill="url(#leftFlapLux)" stroke="#cfb99e" strokeWidth="0.45" />
                <polygon points="100,0 50,53 100,100" fill="url(#rightFlapLux)" stroke="#cfb99e" strokeWidth="0.45" />
                <polygon points="0,100 50,47 100,100" fill="url(#bottomFlapLux)" stroke="#cbb497" strokeWidth="0.5" />
                {/* Gold Foil Double Line on bottom flap */}
                <polyline
                  points="3.5,98 50,49.5 96.5,98"
                  fill="none"
                  stroke="#c59441"
                  strokeOpacity="0.65"
                  strokeWidth="0.5"
                />
              </svg>
            </div>

            {/* 3D Animated Top Flap */}
            <motion.div
              initial={{ rotateX: 0 }}
              animate={phase === "opening" ? { rotateX: -175 } : { rotateX: 0 }}
              transition={{ duration: 0.72, ease: [0.65, 0, 0.35, 1] }}
              style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
              className="absolute top-0 left-0 right-0 h-[57%] z-30 pointer-events-none"
            >
              <svg
                className="w-full h-full drop-shadow-[0_8px_16px_rgba(68,46,29,0.2)]"
                preserveAspectRatio="none"
                viewBox="0 0 100 57"
              >
                <defs>
                  <linearGradient id="topFlapLux" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fffdf9" />
                    <stop offset="100%" stopColor="#efe2d0" />
                  </linearGradient>
                </defs>
                <polygon
                  points="0,0 50,55 100,0"
                  fill="url(#topFlapLux)"
                  stroke="#c9b294"
                  strokeWidth="0.55"
                />
                {/* Embossed Gold Foil V-Trim */}
                <polyline
                  points="3.5,1.5 50,51 96.5,1.5"
                  fill="none"
                  stroke="#c59441"
                  strokeOpacity="0.8"
                  strokeWidth="0.6"
                />
              </svg>
            </motion.div>

            {/* Luxury Wax Seal with Botanical Gold Wreath */}
            <motion.div
              animate={
                phase === "opening"
                  ? { scale: 0.55, opacity: 0 }
                  : { scale: [1, 1.05, 1], opacity: 1 }
              }
              transition={
                phase === "opening"
                  ? { duration: 0.35 }
                  : { repeat: Infinity, duration: 2.8, ease: "easeInOut" }
              }
              className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 flex items-center justify-center"
            >
              {/* Delicate Gold Botanical Ring behind Seal */}
              <svg
                className="absolute w-32 h-32 sm:w-36 sm:h-36 pointer-events-none opacity-80"
                viewBox="0 0 120 120"
                fill="none"
              >
                <circle cx="60" cy="60" r="46" stroke="#c59441" strokeWidth="0.9" strokeDasharray="3 4" />
                <circle cx="60" cy="60" r="51" stroke="#c59441" strokeOpacity="0.45" strokeWidth="0.6" />
              </svg>

              {/* Soft golden aura */}
              <div className="absolute -inset-2 rounded-full bg-amber-400/30 blur-md" />

              {/* Sculpted Burgundy Wax Seal */}
              <div
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center border-2 border-amber-200/50"
                style={{
                  background:
                    "radial-gradient(circle at 30% 25%, #c74f62 0%, #8b1a32 50%, #460916 100%)",
                  boxShadow:
                    "inset 0 2px 7px rgba(255,225,205,0.5), inset 0 -5px 12px rgba(25,0,8,0.65), 0 12px 28px rgba(70,9,22,0.48)",
                }}
              >
                <div className="w-16 h-16 sm:w-[4.75rem] sm:h-[4.75rem] rounded-full border border-amber-200/55 flex items-center justify-center shadow-inner">
                  <span className="text-amber-50 font-serif font-semibold text-xl sm:text-2xl tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                    {initials}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* High-Contrast Luxury Call-to-Action Button */}
          <motion.button
            type="button"
            onClick={handleOpen}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            animate={phase === "closed" ? { opacity: [0.9, 1, 0.9] } : { opacity: 0 }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
            className="mt-11 sm:mt-13 inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-stone-900 hover:bg-rose-900 text-amber-50 border border-amber-300/30 shadow-[0_10px_25px_rgba(28,25,23,0.28)] transition-colors font-serif text-sm sm:text-base tracking-wide cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Tocca il sigillo per aprire l&apos;invito</span>
            <Sparkles className="w-4 h-4 text-amber-300" />
          </motion.button>
        </motion.div>
      </AnimatePresence>

      {/* Crisp GentiLuna signature */}
      <div className="pointer-events-none absolute bottom-5 left-0 right-0 text-center text-[11px] uppercase tracking-[0.32em] text-stone-700/70 font-semibold">
        GentiLuna • Digital Wedding Experience
      </div>
    </div>
  );
}
