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
  { top: "12%", left: "14%", size: 6, delay: 0, dur: 4.2 },
  { top: "22%", left: "82%", size: 8, delay: 0.8, dur: 5.0 },
  { top: "74%", left: "16%", size: 5, delay: 1.4, dur: 4.6 },
  { top: "80%", left: "84%", size: 7, delay: 0.4, dur: 5.4 },
  { top: "36%", left: "8%", size: 4, delay: 2.0, dur: 3.8 },
  { top: "60%", left: "91%", size: 6, delay: 1.1, dur: 4.8 },
  { top: "16%", left: "52%", size: 5, delay: 1.7, dur: 4.4 },
  { top: "88%", left: "46%", size: 4, delay: 0.6, dur: 5.2 },
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
          "radial-gradient(ellipse at 50% 35%, #fdfaf5 0%, #f5ece0 48%, #e8d9c8 100%)",
      }}
    >
      {/* Ambient luxury light orbs */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-rose-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-amber-200/35 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] rounded-full bg-white/50 blur-3xl" />

      {/* Delicate ornamental frame */}
      <div className="pointer-events-none absolute inset-4 sm:inset-8 border border-amber-700/15 rounded-3xl" />
      <div className="pointer-events-none absolute inset-6 sm:inset-10 border border-amber-700/10 rounded-2xl" />

      {/* Floating golden shimmer dust */}
      {SPARKLES.map((sp, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute rounded-full bg-amber-400/70 shadow-[0_0_10px_rgba(217,119,6,0.5)]"
          style={{ top: sp.top, left: sp.left, width: sp.size, height: sp.size }}
          animate={{ opacity: [0.15, 0.9, 0.15], y: [0, -14, 0], scale: [0.8, 1.25, 0.8] }}
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
          {/* Editorial Header above the envelope */}
          <div className="text-center mb-7 sm:mb-9 space-y-2">
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.2em" }}
              animate={{ opacity: 1, letterSpacing: "0.35em" }}
              transition={{ duration: 1 }}
              className="text-[10px] sm:text-xs font-semibold uppercase text-amber-800/80 flex items-center justify-center gap-2"
            >
              <span>✦</span> Siete Invitati <span>✦</span>
            </motion.p>
            {coupleNames && (
              <h1 className="text-3xl sm:text-5xl font-serif text-stone-900 tracking-tight drop-shadow-xs">
                {coupleNames}
              </h1>
            )}
            {formattedDate && (
              <p className="text-xs sm:text-sm font-serif italic text-stone-600">
                {formattedDate}
              </p>
            )}
          </div>

          {/* Interactive 3D Envelope */}
          <motion.div
            onClick={handleOpen}
            whileHover={phase === "closed" ? { y: -4, scale: 1.015 } : undefined}
            whileTap={phase === "closed" ? { scale: 0.985 } : undefined}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative w-[320px] h-[215px] sm:w-[460px] sm:h-[300px] cursor-pointer select-none"
            style={{ perspective: 1200 }}
          >
            {/* Soft luxury ground shadow */}
            <div className="absolute -bottom-5 left-6 right-6 h-8 bg-stone-900/20 blur-xl rounded-full" />

            {/* Inner Invitation Card sliding up when opening */}
            <motion.div
              initial={{ y: 0, opacity: 0 }}
              animate={
                phase === "opening"
                  ? { y: -115, opacity: 1 }
                  : { y: 8, opacity: 0 }
              }
              transition={{ duration: 0.75, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-5 top-4 bottom-4 rounded-xl bg-[#fffdf9] border border-amber-300/60 shadow-xl flex flex-col items-center justify-center p-5 text-center z-10"
            >
              <div className="w-full h-full border border-amber-700/20 rounded-lg flex flex-col items-center justify-center gap-2 px-4">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <p className="text-[10px] uppercase tracking-[0.28em] text-amber-800/70 font-semibold">
                  Con gioia vi invitiamo
                </p>
                <p className="font-serif text-xl sm:text-2xl text-stone-900">
                  {coupleNames || initials}
                </p>
              </div>
            </motion.div>

            {/* Envelope Back & Side Flaps */}
            <div
              className="absolute inset-0 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(68,46,29,0.22)] border border-amber-900/15"
              style={{
                background:
                  "linear-gradient(145deg, #fbf7f0 0%, #f1e8dc 55%, #e7dac8 100%)",
              }}
            >
              {/* Subtle cotton paper grain & gold hairline frame */}
              <div className="absolute inset-2 border border-amber-700/15 rounded-lg pointer-events-none" />

              {/* Left, Right & Bottom Flaps */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-20"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
              >
                <defs>
                  <linearGradient id="leftFlap" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f3eadf" />
                    <stop offset="100%" stopColor="#e5d7c6" />
                  </linearGradient>
                  <linearGradient id="bottomFlap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#faf4eb" />
                    <stop offset="100%" stopColor="#eadcc9" />
                  </linearGradient>
                </defs>
                {/* Left & Right */}
                <polygon points="0,0 50,53 0,100" fill="url(#leftFlap)" stroke="#d6c4ae" strokeWidth="0.4" />
                <polygon points="100,0 50,53 100,100" fill="url(#leftFlap)" stroke="#d6c4ae" strokeWidth="0.4" />
                {/* Bottom */}
                <polygon points="0,100 50,48 100,100" fill="url(#bottomFlap)" stroke="#d1bea6" strokeWidth="0.45" />
                {/* Delicate Gold Foil Accent on bottom crease */}
                <polyline
                  points="3,98 50,50 97,98"
                  fill="none"
                  stroke="#c89d54"
                  strokeOpacity="0.4"
                  strokeWidth="0.4"
                />
              </svg>
            </div>

            {/* 3D Animated Top Flap */}
            <motion.div
              initial={{ rotateX: 0 }}
              animate={phase === "opening" ? { rotateX: -175 } : { rotateX: 0 }}
              transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
              style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
              className="absolute top-0 left-0 right-0 h-[56%] z-30 pointer-events-none"
            >
              <svg
                className="w-full h-full drop-shadow-[0_6px_12px_rgba(68,46,29,0.16)]"
                preserveAspectRatio="none"
                viewBox="0 0 100 56"
              >
                <defs>
                  <linearGradient id="topFlap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fffcf7" />
                    <stop offset="100%" stopColor="#f0e5d6" />
                  </linearGradient>
                </defs>
                <polygon
                  points="0,0 50,54 100,0"
                  fill="url(#topFlap)"
                  stroke="#d1bea6"
                  strokeWidth="0.5"
                />
                {/* Gold foil trim along the triangular flap */}
                <polyline
                  points="4,1.5 50,50.5 96,1.5"
                  fill="none"
                  stroke="#c89d54"
                  strokeOpacity="0.65"
                  strokeWidth="0.5"
                />
              </svg>
            </motion.div>

            {/* Luxury Wax Seal (Burgundy / Rose-Gold) */}
            <motion.div
              animate={
                phase === "opening"
                  ? { scale: 0.6, opacity: 0 }
                  : { scale: [1, 1.045, 1], opacity: 1 }
              }
              transition={
                phase === "opening"
                  ? { duration: 0.35 }
                  : { repeat: Infinity, duration: 2.8, ease: "easeInOut" }
              }
              className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40"
            >
              {/* Outer soft golden aura */}
              <div className="absolute -inset-2 rounded-full bg-amber-400/25 blur-md" />
              <div
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center border-2 border-amber-200/40"
                style={{
                  background:
                    "radial-gradient(circle at 32% 28%, #b94a5b 0%, #881d33 52%, #4c0b1a 100%)",
                  boxShadow:
                    "inset 0 2px 6px rgba(255,220,200,0.45), inset 0 -4px 10px rgba(30,0,10,0.6), 0 10px 25px rgba(76,11,26,0.42)",
                }}
              >
                {/* Embossed inner wax ring */}
                <div className="w-16 h-16 sm:w-[4.75rem] sm:h-[4.75rem] rounded-full border border-amber-200/45 flex items-center justify-center shadow-inner">
                  <span className="text-amber-100 font-serif text-xl sm:text-2xl tracking-wider drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]">
                    {initials}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Elegant Call-to-Action Pill */}
          <motion.button
            type="button"
            onClick={handleOpen}
            animate={phase === "closed" ? { opacity: [0.75, 1, 0.75] } : { opacity: 0 }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
            className="mt-10 sm:mt-12 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/75 backdrop-blur-md border border-amber-700/20 shadow-sm text-stone-700 hover:bg-white hover:text-rose-800 transition-colors font-serif italic text-sm tracking-wide cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Tocca il sigillo per aprire l&apos;invito
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          </motion.button>
        </motion.div>
      </AnimatePresence>

      {/* Subtle GentiLuna signature */}
      <div className="pointer-events-none absolute bottom-5 left-0 right-0 text-center text-[10px] uppercase tracking-[0.3em] text-stone-500/60 font-medium">
        GentiLuna • Digital Wedding Experience
      </div>
    </div>
  );
}
