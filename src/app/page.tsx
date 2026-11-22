"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Heart, Camera, Search, MapPin, Users, ArrowRight, 
  Briefcase, Calendar, Star, Menu, Sparkles, CheckCircle, 
  Gift, Share2, Image as ImageIcon, MessageCircle, Map,
  Infinity, LayoutDashboard, Moon, ChevronDown
} from "lucide-react";
import Footer from "@/components/Footer";
import { GentiLunaLogo } from "@/components/GentiLunaLogo";
import { motion, Variants } from "framer-motion";

type LifeMilestone = {
  id: string;
  label: string;
  pillClass: string;
  dotColor: string;
  icon: ReactNode;
};

const LIFE_MILESTONES: LifeMilestone[] = [
  {
    id: "proposta",
    label: "La Proposta",
    pillClass: "border-rose-200/90 bg-white/95 text-rose-950 shadow-rose-200/40",
    dotColor: "#fb7185",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" aria-hidden="true">
        <circle cx="12" cy="15" r="5.5" stroke="#e11d48" strokeWidth="2" fill="#fff1f2" />
        <path d="M9 9.5L12 5L15 9.5L12 11.5L9 9.5Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M12 2.5V4M16.5 4.5L15.5 5.5M7.5 4.5L8.5 5.5" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "matrimonio",
    label: "Il Matrimonio",
    pillClass: "border-amber-300/90 bg-white/95 text-amber-950 shadow-amber-200/50",
    dotColor: "#f59e0b",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" aria-hidden="true">
        <circle cx="9.5" cy="14" r="5" stroke="#d97706" strokeWidth="2.1" />
        <circle cx="14.5" cy="14" r="5" stroke="#fb7185" strokeWidth="2.1" />
        <path d="M12 4.2C11.1 3 9.3 3.2 9.3 4.7C9.3 6 12 7.5 12 7.5C12 7.5 14.7 6 14.7 4.7C14.7 3.2 12.9 3 12 4.2Z" fill="#f43f5e" />
      </svg>
    ),
  },
  {
    id: "luna-di-miele",
    label: "Luna di Miele",
    pillClass: "border-sky-200/90 bg-white/95 text-sky-950 shadow-sky-200/50",
    dotColor: "#0ea5e9",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" aria-hidden="true">
        <circle cx="17.5" cy="6.5" r="3.2" fill="#fde047" stroke="#f59e0b" strokeWidth="1.2" />
        <path d="M3.5 13.5L19.5 6.5L15.5 19.5L11.2 14.8L7.5 17L8.2 13.8L3.5 13.5Z" fill="#38bdf8" stroke="#0369a1" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "nascita",
    label: "Dolce Attesa & Nascita",
    pillClass: "border-pink-200/90 bg-white/95 text-pink-950 shadow-pink-200/50",
    dotColor: "#ec4899",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" aria-hidden="true">
        <path d="M5 13H19C19 17.2 15.9 20 12 20C8.1 20 5 17.2 5 13Z" fill="#fbcfe8" stroke="#db2777" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M12 13V6C15.5 6 18.2 8.8 18.8 13" fill="#fce7f3" stroke="#db2777" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="8.5" cy="21" r="1.4" fill="#f59e0b" />
        <circle cx="15.5" cy="21" r="1.4" fill="#f59e0b" />
        <path d="M7.5 6.5L8.2 8L9.8 8.2L8.6 9.3L8.9 10.8L7.5 10L6.1 10.8L6.4 9.3L5.2 8.2L6.8 8L7.5 6.5Z" fill="#fbbf24" />
      </svg>
    ),
  },
  {
    id: "battesimo",
    label: "Il Battesimo",
    pillClass: "border-indigo-200/90 bg-white/95 text-indigo-950 shadow-indigo-200/50",
    dotColor: "#6366f1",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" aria-hidden="true">
        <path d="M12 3.5L13.4 7.2L17.3 7.5L14.3 9.9L15.3 13.7L12 11.6L8.7 13.7L9.7 9.9L6.7 7.5L10.6 7.2L12 3.5Z" fill="#fde68a" stroke="#d97706" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M6.5 18.5C8.5 16.5 15.5 16.5 17.5 18.5" stroke="#6366f1" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="12" cy="19.5" r="1.3" fill="#818cf8" />
      </svg>
    ),
  },
  {
    id: "compleanni",
    label: "Compleanni & Feste",
    pillClass: "border-orange-200/90 bg-white/95 text-orange-950 shadow-orange-200/50",
    dotColor: "#f97316",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" aria-hidden="true">
        <rect x="5" y="12" width="14" height="7.5" rx="2" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.5" />
        <path d="M5 15.2C7 16.5 9 14 12 15.2C15 16.5 17 14 19 15.2" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 8.2V12" stroke="#ea580c" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M12 4C13.3 5.5 13.3 7.2 12 7.8C10.7 7.2 10.7 5.5 12 4Z" fill="#facc15" stroke="#f59e0b" strokeWidth="1" />
      </svg>
    ),
  },
  {
    id: "traguardi",
    label: "Lauree & Traguardi",
    pillClass: "border-violet-200/90 bg-white/95 text-violet-950 shadow-violet-200/50",
    dotColor: "#8b5cf6",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" aria-hidden="true">
        <path d="M3 9.5L12 5L21 9.5L12 14L3 9.5Z" fill="#ddd6fe" stroke="#6d28d9" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M7 11.8V16.2C7 17.8 9.5 19 12 19C14.5 19 17 17.8 17 16.2V11.8" stroke="#6d28d9" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M20 10V15.5" stroke="#f59e0b" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="20" cy="16.3" r="1.3" fill="#f59e0b" />
      </svg>
    ),
  },
  {
    id: "anniversari",
    label: "Anniversari d'Oro",
    pillClass: "border-emerald-200/90 bg-white/95 text-emerald-950 shadow-emerald-200/50",
    dotColor: "#10b981",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" aria-hidden="true">
        <path d="M15.5 4.5C11.2 4.8 8 8.3 8 12.7C8 17.2 11.6 20.6 16.2 20.4C13.6 19.2 12 16.5 12 13.2C12 9.5 13.5 6.5 15.5 4.5Z" fill="#fcd34d" stroke="#d97706" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M16.8 10.2C16.1 9.2 14.6 9.4 14.6 10.6C14.6 11.7 16.8 13 16.8 13C16.8 13 19 11.7 19 10.6C19 9.4 17.5 9.2 16.8 10.2Z" fill="#10b981" />
      </svg>
    ),
  },
];

function LifeEventsStream() {
  return (
    <div className="relative w-full bg-[#fffaf3] bg-gradient-to-r from-[#fff7ec] via-[#fff0f4] to-[#fef9eb] border-b border-amber-200/75 overflow-hidden select-none">
      {/* Linea luminosa superiore oro champagne e oro rosa */}
      <motion.div
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        style={{ backgroundSize: "200% 100%" }}
        className="h-[2.5px] w-full bg-gradient-to-r from-amber-300 via-yellow-500 via-rose-300 to-amber-300"
      />

      {/* Filo d'oro ondulato decorativo sullo sfondo */}
      <svg
        viewBox="0 0 1200 56"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-45"
      >
        <defs>
          <linearGradient id="lifeWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#fb7185" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#eab308" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <path
          d="M0,28 C150,10 300,46 450,28 C600,10 750,46 900,28 C1050,10 1125,38 1200,28"
          fill="none"
          stroke="url(#lifeWaveGrad)"
          strokeWidth="2"
          strokeDasharray="6 6"
        />
      </svg>

      {/* Sfumature morbide ai bordi curvi */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-20 bg-gradient-to-r from-[#fff7ec] via-[#fff7ec]/80 to-transparent z-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-20 bg-gradient-to-l from-[#fef9eb] via-[#fef9eb]/80 to-transparent z-20" />

      {/* Nastro animato continuo dei Capitoli della Vita */}
      <div className="relative z-10 py-3 sm:py-3.5 overflow-hidden">
        <motion.div
          className="flex w-max items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 34, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          {[0, 1].map((copyIdx) => (
            <div
              key={copyIdx}
              aria-hidden={copyIdx === 1}
              className="flex items-center shrink-0"
            >
              {LIFE_MILESTONES.map((item, idx) => (
                <div key={`${copyIdx}-${item.id}`} className="flex items-center shrink-0">
                  <motion.div
                    animate={{ y: idx % 2 === 0 ? [0, -2.5, 0] : [0, 2.5, 0] }}
                    transition={{
                      duration: 3 + (idx % 3) * 0.6,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: idx * 0.2,
                    }}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-sm ${item.pillClass}`}
                  >
                    {item.icon}
                    <span className="font-serif text-xs sm:text-[13px] font-semibold tracking-wide whitespace-nowrap">
                      {item.label}
                    </span>
                  </motion.div>

                  {/* Connettore dorato stilizzato tra un evento e il successivo */}
                  <div className="flex items-center gap-1.5 mx-2.5 sm:mx-3.5 shrink-0" aria-hidden="true">
                    <span className="w-3 sm:w-4 h-[1.5px] rounded-full bg-gradient-to-r from-amber-300 to-rose-300" />
                    <motion.span
                      animate={{ scale: [0.85, 1.25, 0.85], rotate: [0, 90, 180] }}
                      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: idx * 0.25 }}
                      style={{ color: item.dotColor }}
                      className="text-[11px] leading-none"
                    >
                      ✦
                    </motion.span>
                    <span className="w-3 sm:w-4 h-[1.5px] rounded-full bg-gradient-to-r from-rose-300 to-amber-300" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Home() {
  const [isTriennial, setIsTriennial] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans text-stone-900 flex flex-col overflow-x-hidden">
      
      {/* NAVBAR LUXURY ESSENZIALE */}
      <nav className="absolute top-0 w-full z-50 px-5 sm:px-8 lg:px-12 py-5 flex justify-between items-center gap-4 bg-gradient-to-b from-stone-950/75 via-stone-950/35 to-transparent">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-2.5 text-white font-serif text-xl sm:text-2xl tracking-wide drop-shadow-md shrink-0"
        >
          <GentiLunaLogo className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
          <span>GentiLuna</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="hidden xl:flex items-center gap-7 text-[11px] font-medium tracking-[0.18em] text-stone-200/95 uppercase"
        >
          <Link href="/funzioni-sposi" className="hover:text-amber-200 transition-colors whitespace-nowrap">
            Sposi &amp; Eventi
          </Link>
          <Link href="/funzioni-professionisti" className="hover:text-amber-200 transition-colors whitespace-nowrap">
            Professionisti
          </Link>
          <Link href="/fornitori" className="hover:text-amber-200 transition-colors whitespace-nowrap">
            Fornitori
          </Link>
          <Link href="/prezzi" className="hover:text-amber-200 transition-colors whitespace-nowrap">
            Piani
          </Link>
          <Link href="/blog" className="hover:text-amber-200 transition-colors whitespace-nowrap">
            Blog
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center gap-3 sm:gap-5 shrink-0"
        >
          <Link
            href="/professionisti"
            className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.16em] uppercase text-amber-200/90 hover:text-amber-100 transition-colors"
          >
            Area Pro
          </Link>
          <Link href="/login">
            <Button className="bg-white/10 backdrop-blur-md border border-amber-200/35 text-amber-50 hover:bg-amber-50 hover:text-stone-950 rounded-full font-medium tracking-wider text-xs uppercase px-5 sm:px-6 h-9 sm:h-10 transition-all">
              Accedi
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Apri menu"
            className="xl:hidden text-amber-100 p-1"
          >
            <Menu className="w-7 h-7" />
          </button>
        </motion.div>

        {mobileMenuOpen && (
          <div className="absolute top-20 left-4 right-4 bg-stone-950/95 backdrop-blur-xl border border-amber-200/20 rounded-3xl p-6 flex flex-col gap-3 text-center xl:hidden shadow-2xl z-50">
            <Link href="/funzioni-sposi" onClick={() => setMobileMenuOpen(false)} className="text-stone-100 hover:text-amber-200 font-medium tracking-widest text-xs uppercase py-2.5 border-b border-stone-800/80">
              Funzioni Sposi &amp; Eventi
            </Link>
            <Link href="/funzioni-professionisti" onClick={() => setMobileMenuOpen(false)} className="text-stone-100 hover:text-amber-200 font-medium tracking-widest text-xs uppercase py-2.5 border-b border-stone-800/80">
              Funzioni Professionisti
            </Link>
            <Link href="/fornitori" onClick={() => setMobileMenuOpen(false)} className="text-stone-200 hover:text-amber-200 tracking-widest text-xs uppercase py-2.5 border-b border-stone-800/80">
              Fornitori &amp; Top Pro
            </Link>
            <Link href="/prezzi" onClick={() => setMobileMenuOpen(false)} className="text-stone-200 hover:text-amber-200 tracking-widest text-xs uppercase py-2.5 border-b border-stone-800/80">
              Piani e Abbonamenti
            </Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="text-stone-200 hover:text-amber-200 tracking-widest text-xs uppercase py-2.5 border-b border-stone-800/80">
              Blog &amp; Guide
            </Link>
            <Link href="/professionisti" onClick={() => setMobileMenuOpen(false)} className="text-amber-300 hover:text-amber-200 font-semibold tracking-widest text-xs uppercase pt-2 flex items-center justify-center gap-2">
              <Briefcase className="w-3.5 h-3.5" /> Sei un Professionista?
            </Link>
          </div>
        )}
      </nav>

      {/* HERO BENVENUTO LUXURY - PULITO, POETICO E COMPATTO */}
      <header className="relative min-h-[42svh] md:min-h-[46svh] flex flex-col justify-center overflow-hidden bg-stone-950">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop" 
            alt="Wedding Memories"
            className="w-full h-full object-cover opacity-50 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/45 to-stone-950/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.13),transparent_65%)]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-6 pt-20 pb-12 sm:pt-24 sm:pb-14 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
          >
            {/* Filetto oro di benvenuto senza riquadri pesanti */}
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <span className="w-7 sm:w-10 h-[1px] bg-gradient-to-r from-transparent to-amber-300/80" />
              <span className="text-amber-200/90 text-[10px] sm:text-xs font-medium tracking-[0.28em] uppercase">
                Benvenuti su GentiLuna
              </span>
              <span className="w-7 sm:w-10 h-[1px] bg-gradient-to-l from-transparent to-amber-300/80" />
            </div>

            <h1 className="text-[2rem] sm:text-5xl lg:text-[3.6rem] font-serif text-white mb-3.5 leading-[1.14] tracking-tight drop-shadow-xl">
              Il Vostro Spazio Unico,{" "}
              <br className="hidden sm:block" />
              <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-rose-100">
                dove ogni emozione resta per sempre.
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-stone-300/90 font-light max-w-md sm:max-w-xl mx-auto leading-relaxed">
              Dal giorno del vostro Sì a ogni nuovo capitolo della vita insieme.
            </p>
          </motion.div>
        </div>
      </header>

      
        {/* THREE MAIN GATEWAYS - NASTRO ANIMATO IN EVIDENZA NELLA PRIMA SCHERMATA */}
        <section
          id="capitoli-vita"
          className="pb-16 md:pb-24 bg-white relative z-20 -mt-8 sm:-mt-10 rounded-t-[2rem] sm:rounded-t-[3.25rem] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.4)] overflow-hidden"
        >
          {/* Nastro animato a colori degli Eventi della Vita */}
          <LifeEventsStream />

          {/* Sottile indicatore luxury di scorrimento compatto */}
          <div className="flex justify-center pt-2.5 sm:pt-3">
            <a
              href="#esplora-capitoli"
              aria-label="Scorri per scoprire GentiLuna"
              className="group inline-flex items-center gap-1.5 text-stone-400 hover:text-amber-700 transition-colors"
            >
              <span className="text-[10px] uppercase tracking-[0.25em] font-medium text-amber-800/75">
                Scopri
              </span>
              <motion.span
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="inline-flex text-amber-600"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </motion.span>
            </a>
          </div>

          <div id="esplora-capitoli" className="max-w-7xl mx-auto px-6 pt-3 md:pt-4">
              {/* Introduzione capitoli pulita ed editoriale - TUTTO SU UNA RIGA SU DESKTOP */}
              <div className="relative z-30 mb-7 md:mb-9 max-w-5xl mx-auto text-center px-2 sm:px-4">
                <motion.h2 
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-2xl sm:text-4xl lg:text-5xl font-serif text-stone-900 mb-3 relative z-10 leading-tight whitespace-normal sm:whitespace-nowrap"
                >
                  <span>Custodisci ogni </span>
                  <motion.span
                    animate={{ y: [0, -3, 0], scale: [1, 1.015, 1] }}
                    transition={{ duration: 3.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    className="relative inline-flex items-center align-baseline"
                  >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-900 via-yellow-600 to-amber-800 italic font-bold text-3xl sm:text-5xl lg:text-[3.4rem] pr-2">
                      momento prezioso
                    </span>
                    <span className="inline-flex items-center gap-1 ml-1 sm:ml-2 shrink-0 pointer-events-none select-none">
                      <motion.span
                        animate={{ opacity: [0.55, 1, 0.55], scale: [0.92, 1.12, 0.92], rotate: [-4, 6, -4] }}
                        transition={{ duration: 2.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                        className="inline-flex text-amber-600"
                      >
                        <Moon className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400/80 stroke-amber-600" />
                      </motion.span>
                      <motion.span
                        animate={{ opacity: [0.35, 1, 0.35], scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, delay: 0.5, ease: "easeInOut" }}
                        className="inline-flex text-amber-500"
                      >
                        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-amber-500" />
                      </motion.span>
                    </span>
                  </motion.span>
                </motion.h2>
                
                <motion.p 
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 }}
                  className="text-sm sm:text-base md:text-lg text-stone-600 max-w-sm sm:max-w-2xl mx-auto font-light leading-relaxed relative z-10"
                >
                  Da un matrimonio indimenticabile al primo sorriso di tuo figlio. Crea un portale privato, raccogli le foto degli invitati e costruisci un ricordo che durer&agrave; per sempre.
                </motion.p>
              </div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-20"
            >
              {/* 1. Organizza il tuo matrimonio */}
              <Link href="/sposi" className="block group h-full">
                <motion.div variants={fadeUpVariant} className="bg-gradient-to-br from-rose-50/60 via-white to-white border border-rose-100/50 p-10 rounded-[2.5rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(244,63,94,0.25)] transition-all duration-500 h-full flex flex-col justify-between text-center md:text-left group-hover:-translate-y-4 relative overflow-hidden backdrop-blur-md">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-rose-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto md:mx-0 bg-gradient-to-br from-rose-100 to-rose-50 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-inner relative group-hover:scale-110 transition-transform duration-500">
                      <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                      >
                        <Heart className="w-9 h-9 text-rose-500" fill="currentColor" />
                      </motion.div>
                      {/* Floating particles */}
                      <motion.div animate={{ y: [-5, -20], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }} className="absolute top-2 right-2 w-2 h-2 bg-rose-400 rounded-full"></motion.div>
                      <motion.div animate={{ y: [-5, -25], opacity: [0, 1, 0] }} transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, delay: 1 }} className="absolute top-4 left-2 w-1.5 h-1.5 bg-rose-300 rounded-full"></motion.div>
                    </div>
                    <h3 className="text-3xl font-serif text-stone-900 mb-4 group-hover:text-rose-600 transition-colors">Organizza il tuo Evento</h3>
                    <p className="text-stone-500 font-light leading-relaxed text-[1.1rem]">
                      Un portale esclusivo per i tuoi momenti speciali. Iscriviti, accedi alla tua Area Personale e organizza l'intero evento in ogni singolo dettaglio, condividendolo con i tuoi ospiti.
                    </p>
                  </div>
                  <div className="mt-12 flex items-center justify-center md:justify-start text-rose-500 font-semibold text-lg group-hover:gap-4 transition-all relative z-10">
                    Inizia ora <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                </motion.div>
              </Link>
  
              {/* 2. Fornitori */}
              <Link href="/fornitori" className="block group h-full">
                <motion.div variants={fadeUpVariant} className="bg-gradient-to-br from-stone-100/60 via-white to-white border border-stone-200/50 p-10 rounded-[2.5rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(41,37,36,0.2)] transition-all duration-500 h-full flex flex-col justify-between text-center md:text-left group-hover:-translate-y-4 relative overflow-hidden backdrop-blur-md">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-stone-100 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto md:mx-0 bg-gradient-to-br from-stone-100 to-stone-50 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-inner relative overflow-hidden group-hover:scale-110 transition-transform duration-500">
                      <motion.div
                        animate={{ rotate: [0, 15, 0, -15, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                      >
                        <Search className="w-9 h-9 text-stone-700" strokeWidth={2.5} />
                      </motion.div>
                      {/* Scanning line effect */}
                      <motion.div 
                        animate={{ y: ['-100%', '200%'] }} 
                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="absolute inset-0 w-full h-1/2 bg-gradient-to-b from-transparent via-stone-300/40 to-transparent"
                      ></motion.div>
                    </div>
                    <h3 className="text-3xl font-serif text-stone-900 mb-4 group-hover:text-stone-700 transition-colors">
                      Fornitori &amp; <span className="whitespace-nowrap">Top Pro</span>
                    </h3>
                    <p className="text-stone-500 font-light leading-relaxed text-[1.1rem]">
                      Ricerca tra i migliori professionisti del settore. Esplora l'elenco generale dei nostri iscritti e trova fotografo, location, e molto altro.
                    </p>
                  </div>
                  <div className="mt-12 flex items-center justify-center md:justify-start text-stone-700 font-semibold text-lg group-hover:gap-4 transition-all relative z-10">
                    Cerca Fornitori <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                </motion.div>
              </Link>
  
              {/* 3. Abbonamenti e Promozioni */}
              <Link href="/prezzi" className="block group h-full">
                <motion.div variants={fadeUpVariant} className="bg-gradient-to-br from-amber-50/60 via-white to-white border border-amber-100/50 p-10 rounded-[2.5rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(245,158,11,0.25)] transition-all duration-500 h-full flex flex-col justify-between text-center md:text-left group-hover:-translate-y-4 relative overflow-hidden backdrop-blur-md">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-amber-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto md:mx-0 bg-gradient-to-br from-amber-100 to-amber-50 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-inner relative group-hover:scale-110 transition-transform duration-500">
                      <motion.div
                        animate={{ y: [0, -6, 0], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                      >
                        <Gift className="w-9 h-9 text-amber-500" strokeWidth={2.5} />
                      </motion.div>
                      <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }} className="absolute top-3 right-3">
                        <div className="w-2.5 h-2.5 bg-amber-400 rotate-45 rounded-sm"></div>
                      </motion.div>
                      <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }} className="absolute bottom-3 left-3">
                        <div className="w-2 h-2 bg-amber-300 rotate-45 rounded-sm"></div>
                      </motion.div>
                    </div>
                    <h3 className="text-3xl font-serif text-stone-900 mb-4 group-hover:text-amber-600 transition-colors">Pacchetti & Promozioni</h3>
                    <p className="text-stone-500 font-light leading-relaxed text-[1.1rem]">
                      Scopri cosa possiamo offrirti. Visualizza i pacchetti, gli abbonamenti e le promozioni in corso, sia per sposi che per professionisti.
                    </p>
                  </div>
                  <div className="mt-12 flex items-center justify-center md:justify-start text-amber-500 font-semibold text-lg group-hover:gap-4 transition-all relative z-10">
                    Vedi Piani <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>

            {/* PERCORSI DEDICATI DISTRIBUITI CON ELEGANZA NELLA PAGINA */}
            <div className="mt-12 pt-10 border-t border-stone-200/70 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center">
              <Link
                href="/funzioni-sposi"
                className="group inline-flex items-center gap-2 text-sm font-serif italic text-stone-700 hover:text-rose-600 transition-colors"
              >
                <span>Esplora tutte le Funzioni per Sposi &amp; Eventi</span>
                <ArrowRight className="w-4 h-4 text-rose-500 group-hover:translate-x-1 transition-transform" />
              </Link>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-amber-300" />
              <Link
                href="/funzioni-professionisti"
                className="group inline-flex items-center gap-2 text-sm font-serif italic text-stone-700 hover:text-amber-700 transition-colors"
              >
                <span>Scopri GentiLuna per Fotografi &amp; Professionisti</span>
                <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
  
        
      {/* CORE FEATURES BENTO GRID (PREMIUM) */}
      <section className="py-16 md:py-32 bg-stone-50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-900 mb-6"
            >
              Le Funzioni <span className="italic text-rose-500">Premium</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-stone-500 font-light max-w-2xl mx-auto"
            >
              Non solo estetica. Una suite potente per gestire ogni aspetto del tuo evento con una facilità incredibile.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[340px]">
            
            {/* Box 1: Condivisione Live (Span 2) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-2 bg-gradient-to-br from-rose-500 to-rose-600 rounded-[2.5rem] p-8 md:p-12 text-white overflow-hidden relative shadow-2xl flex flex-col justify-between text-center md:text-left group"
            >
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 group-hover:scale-110 transition-transform duration-1000"></div>
              <div className="relative z-10 max-w-sm mx-auto md:mx-0">
                <div className="w-16 h-16 mx-auto md:mx-0 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl md:text-4xl font-serif mb-4">Condivisione Live</h3>
                <p className="text-rose-100 text-base md:text-lg font-light leading-relaxed">
                  Gli invitati scansionano il QR Code stampato sui tavoli e caricano foto e video in tempo reale, senza app. Una galleria spontanea che si aggiorna in diretta.
                </p>
              </div>
              <div className="hidden md:block absolute right-6 bottom-6 w-72 aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/30 rotate-2 group-hover:rotate-0 group-hover:-translate-y-2 transition-all duration-700 pointer-events-none">
                <img src="/press/GentiLuna_Immagine_6.jpg" alt="QR Code Live sui tavoli e Galleria in diretta" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            {/* Box 2: Guestbook */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-10 text-stone-800 border border-stone-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col items-center md:items-start text-center md:text-left relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-16 h-16 mx-auto md:mx-0 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 text-amber-500 relative z-10">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif mb-3 relative z-10">Guestbook Digitale</h3>
              <p className="text-stone-500 font-light relative z-10 flex-1">
                Parenti e amici possono lasciarvi messaggi e dediche speciali da conservare e approvare prima della pubblicazione.
              </p>
            </motion.div>

            {/* Box 3: Tavoli e RSVP */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2.5rem] p-8 md:p-10 text-stone-800 border border-stone-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col items-center md:items-start text-center md:text-left relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-16 h-16 mx-auto md:mx-0 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 text-emerald-500 relative z-10">
                <Map className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif mb-3 relative z-10">Mappa Tavoli &amp; RSVP</h3>
              <p className="text-stone-500 font-light relative z-10 flex-1">
                Ricevi le conferme di partecipazione, annota allergie e intolleranze e organizza i tavoli del ristorante con un editor intuitivo.
              </p>
            </motion.div>

            {/* Box 4: Album Pro (Span 2) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:col-span-2 bg-gradient-to-br from-stone-900 to-black rounded-[2.5rem] p-8 md:p-12 text-white overflow-hidden relative shadow-2xl flex flex-col justify-between text-center md:text-left group"
            >
              <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 translate-x-1/4 group-hover:scale-110 transition-transform duration-1000"></div>
              <div className="relative z-10 max-w-md mx-auto md:mx-0">
                <div className="w-16 h-16 mx-auto md:mx-0 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                  <ImageIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl md:text-4xl font-serif mb-4">L&apos;Album Ufficiale in HD</h3>
                <p className="text-stone-300 text-base md:text-lg font-light leading-relaxed">
                  L&apos;accesso diretto per il tuo fotografo o videomaker: consegna gallerie in alta risoluzione divise in capitoli, scaricabili in ZIP.
                </p>
              </div>
              <div className="hidden md:block absolute right-6 bottom-6 w-72 aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-amber-400/30 -rotate-2 group-hover:rotate-0 group-hover:-translate-y-2 transition-all duration-700 pointer-events-none">
                <img src="/press/GentiLuna_Showcase_Pro.jpg" alt="GentiLuna Studio Consegna Album HD e Vetrina Pro" className="w-full h-full object-cover" />
              </div>
            </motion.div>

          </div>

          {/* SHOWCASE DINAMICO: VERA INTERFACCIA DAL VIVO */}
          <div className="mt-16 md:mt-20">
            <div className="text-center mb-10">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-rose-600 bg-rose-50 border border-rose-200 px-3.5 py-1 rounded-full mb-3">
                La Piattaforma in Azione
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif text-stone-900">
                Così prende vita il tuo Evento su GentiLuna
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  img: "/press/GentiLuna_Immagine_7.jpg",
                  title: "Tableau Interattivo, Galleria HD & Timeline",
                  desc: "Dal cartoncino QR sul tavolo allo smartphone degli invitati: scaletta della giornata, tavoli e scatti sincronizzati.",
                  href: "/funzioni-sposi",
                },
                {
                  img: "/press/GentiLuna_Immagine_8.jpg",
                  title: "RSVP Ospiti, Intolleranze & Ricerca Posti",
                  desc: "Conferme immediate, segnalazioni alimentari e lista ospiti in un'interfaccia elegante accessibile senza app.",
                  href: "/funzioni-sposi",
                },
                {
                  img: "/press/GentiLuna_Immagine_3.jpg",
                  title: "GentiLuna LIVE su Proiettore in Sala",
                  desc: "Proietta in tempo reale su maxischermo le emozioni scattate e approvate durante la festa.",
                  href: "/prezzi",
                },
                {
                  img: "/press/GentiLuna_Showcase_Planner.jpg",
                  title: "Regia per Sposi, Wedding Planner & Fotografi",
                  desc: "Tavoli rotondi o imperiali, Team Fornitori collegato e consegne HD a 0% commissioni.",
                  href: "/funzioni-professionisti",
                },
              ].map((item) => (
                <Link
                  key={item.img}
                  href={item.href}
                  className="group bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-stone-900 relative">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between gap-2">
                    <h4 className="font-serif font-bold text-xl text-stone-900 group-hover:text-rose-600 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-sm text-stone-500 font-light leading-relaxed">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/funzioni-sposi">
                <Button className="rounded-full bg-rose-500 hover:bg-rose-600 text-white px-6 h-11 font-semibold">
                  Scopri Funzioni Sposi &amp; Eventi
                </Button>
              </Link>
              <Link href="/funzioni-professionisti">
                <Button className="rounded-full bg-stone-900 hover:bg-stone-800 text-amber-300 px-6 h-11 font-semibold">
                  Scopri Funzioni Professionisti
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="outline" className="rounded-full border-stone-300 text-stone-800 hover:bg-white px-6 h-11 font-semibold">
                  Leggi le 15 Guide nel Blog
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>


{/* TWO WORLDS & TIMELINE SECTION */}
      <section className="py-24 bg-stone-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6 leading-tight">
              Un unico portale, <br/>
              <span className="text-rose-500 italic">due mondi interconnessi.</span>
            </h2>
            <p className="text-xl text-stone-600 font-light mb-10 leading-relaxed">
              La piattaforma che unisce chi celebra l&apos;amore e chi lavora per renderlo perfetto.
            </p>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-stone-100 relative text-center md:text-left">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Infinity className="w-32 h-32 text-stone-900" />
              </div>
              <h3 className="text-2xl font-bold mb-4 flex flex-col md:flex-row items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto md:mx-0 shrink-0">
                  <Calendar className="text-rose-500 w-6 h-6" />
                </div>
                <span>Il matrimonio è il primo capitolo.</span>
              </h3>
              <p className="text-lg text-stone-600 font-light mb-6">
                La vostra storia continua. Da noi non prenoti solo il fotografo del matrimonio. GentiLuna è una timeline della tua vita.
              </p>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <p className="text-stone-800 font-medium">Riapri il tuo spazio per ogni nuovo grande traguardo.</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[16/9] rounded-[2rem] overflow-hidden shadow-2xl relative border border-stone-200 bg-stone-900">
              <img 
                src="/press/GentiLuna_Showcase_Capitoli.jpg" 
                alt="GentiLuna Capitoli della Vita: Matrimonio, Viaggio di Nozze, Nascita e Famiglia" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-md border border-stone-200">
                <img src="/press/GentiLuna_Showcase_Regali_Guestbook.jpg" alt="Lista Regali, Tappe Viaggio Nozze e Guestbook Dediche" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-md border border-stone-200">
                <img src="/press/GentiLuna_Immagine_9.jpg" alt="Sito Evento personalizzato e Galleria Live su smartphone" className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* CHECKLIST SECTION */}
      <section className="py-24 bg-stone-950 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-6">Tutto ciò che potrete fare</h2>
            <p className="text-xl text-stone-400 font-light max-w-2xl mx-auto">
              Nessuna sorpresa, solo strumenti eleganti per organizzare e ricordare il vostro evento in ogni singolo dettaglio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 max-w-4xl mx-auto">
            {[
              "Sito web personalizzato per il matrimonio",
              "Inviti digitali interattivi (Email / WhatsApp)",
              "Gestione RSVP e menù (intolleranze, scelte)",
              "Disposizione interattiva dei tavoli",
              "GentiLuna LIVE (Modalità Proiettore per le foto)",
              "Galleria fotografica privata e sicura",
              "Guestbook digitale per auguri e video-dediche",
              "Possibilità di nascondere o approvare le foto",
              "Spazio per futuri traguardi (battesimi, feste)",
              "Sconti esclusivi invitando i vostri fornitori"
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-stone-200 text-lg font-light">{feature}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      
        {/* PRICING / PACCHETTI PLACEHOLDER */}
        <section id="pricing" className="py-24 bg-[#faf9f8] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6">Piani e Promozioni</h2>
            <p className="text-xl text-stone-500 font-light max-w-2xl mx-auto mb-10">
              Scegliete l'abbonamento perfetto per le vostre esigenze o per il vostro business.
            </p>

            <div className="flex justify-center items-center gap-4 mb-12">
              <span className={"text-lg font-medium " + (!isTriennial ? "text-stone-900" : "text-stone-400")}>Annuale</span>
              <button 
                onClick={() => setIsTriennial(!isTriennial)}
                className="w-16 h-8 bg-rose-500 rounded-full relative p-1 transition-colors"
              >
                <div className={"w-6 h-6 bg-white rounded-full shadow-sm transition-transform " + (isTriennial ? "translate-x-8" : "translate-x-0")} />
              </button>
              <span className={"text-lg font-medium flex items-center gap-2 " + (isTriennial ? "text-stone-900" : "text-stone-400")}>
                Triennale 
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">PROMO 3 ANNI</span>
              </span>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* SPOSI ENTRY */}
              <div className="bg-white p-8 rounded-3xl shadow-md border border-stone-200 flex flex-col text-center md:text-left hover:-translate-y-2 transition-transform">
                <div className="text-rose-500 font-bold tracking-widest text-sm mb-4 uppercase">Per gli Sposi</div>
                <h3 className="text-3xl font-serif text-stone-900 mb-2">Piano Base</h3>
                <p className="text-stone-500 mb-6 line-clamp-2">Inizia a raccogliere foto e a creare la tua timeline della vita.</p>
                
                <div className="text-4xl font-bold mb-2">
                  {isTriennial ? '249,00 €' : '149,00 €'}
                </div>
                {!isTriennial ? (
                  <div className="text-sm text-stone-500 mb-6 min-h-[40px]">
                    il primo anno<br/>
                    <span className="italic">rinnovo dal secondo anno 50,00 € all'anno</span>
                  </div>
                ) : (
                  <div className="text-sm text-emerald-600 font-bold mb-6 min-h-[40px]">
                    Pagamento anticipato 3 anni.<br/>Blocchi il prezzo per un triennio
                  </div>
                )}

                <ul className="space-y-4 mb-8 flex-grow text-left">
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0"/> Galleria foto e video</li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0"/> 3 GB di spazio privato</li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0"/> Sito web personalizzato</li>
                </ul>
                <Link href={`/login?role=COUPLE&mode=REGISTER&plan=${isTriennial ? "BASE_TRIENNIAL" : "BASE_ANNUAL"}`}>
                  <Button className="w-full min-h-12 h-auto py-3 px-4 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-semibold whitespace-normal text-center">
                    Attiva Piano Base
                  </Button>
                </Link>
              </div>
  
              {/* SPOSI PREMIUM */}
              <div className="bg-stone-900 p-8 rounded-3xl shadow-xl border border-stone-800 flex flex-col text-center md:text-left text-white hover:-translate-y-2 transition-transform relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-rose-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">CONSIGLIATO</div>
                <div className="text-rose-400 font-bold tracking-widest text-sm mb-4 uppercase">Per gli Sposi</div>
                <h3 className="text-3xl font-serif mb-2">Piano Premium</h3>
                <p className="text-stone-400 mb-6 line-clamp-2">Sblocca tutte le funzionalità organizzative per un matrimonio perfetto.</p>
                
                <div className="text-4xl font-bold mb-2">
                  {isTriennial ? '499,00 €' : '399,00 €'}
                </div>
                {!isTriennial ? (
                  <div className="text-sm text-stone-400 mb-6 min-h-[40px]">
                    il primo anno<br/>
                    <span className="italic text-stone-500">rinnovo dal secondo anno 60,00 € all'anno</span>
                  </div>
                ) : (
                  <div className="text-sm text-emerald-400 font-bold mb-6 min-h-[40px]">
                    Pagamento anticipato 3 anni.<br/>Risparmi sul rinnovo triennale
                  </div>
                )}

                <ul className="space-y-4 mb-8 flex-grow text-stone-300 text-left">
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-emerald-400 shrink-0"/> Fino a 15 Capitoli & 5 GB</li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-emerald-400 shrink-0"/> Disposizione Tavoli & RSVP</li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-emerald-400 shrink-0"/> Upload diretto foto sposi & ospiti</li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-emerald-400 shrink-0"/> Inviti digitali illimitati</li>
                </ul>
                <Link href={`/login?role=COUPLE&mode=REGISTER&plan=${isTriennial ? "PREMIUM_TRIENNIAL" : "PREMIUM_ANNUAL"}`}>
                  <Button className="w-full min-h-12 h-auto py-3 px-4 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold border-none whitespace-normal text-center">
                    Attiva Piano Premium
                  </Button>
                </Link>
              </div>
  
              {/* PROFESSIONISTI */}
              <div className="bg-white p-8 rounded-3xl shadow-md border border-stone-200 flex flex-col text-center md:text-left hover:-translate-y-2 transition-transform">
                <div className="text-amber-500 font-bold tracking-widest text-sm mb-4 uppercase">Per i Professionisti</div>
                <h3 className="text-3xl font-serif text-stone-900 mb-2">Pro & Partner</h3>
                <p className="text-stone-500 mb-6 line-clamp-2">Ottieni visibilità, consegne digitali perfette e acquisisci nuovi clienti.</p>
                <div className="text-4xl font-bold mb-2">49,00 €<span className="text-xl text-stone-400 font-light"> /1° anno</span></div>
                <div className="text-sm text-amber-600 font-semibold mb-6 min-h-[40px]">Promo Lancio Primi 50 Iscritti<br/><span className="text-stone-400 font-normal line-through">invece di 299,00 €/anno</span></div>
                <ul className="space-y-4 mb-8 flex-grow text-left">
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0"/> Vetrina nella directory Top Pro</li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0"/> Consegna album in alta qualità</li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0"/> Ricevi recensioni e contatti diretti</li>
                </ul>
                <Link href="/professionisti">
                  <Button className="w-full min-h-12 h-auto py-3 px-4 rounded-full bg-amber-400 hover:bg-amber-500 text-stone-900 font-bold border-none shadow-sm whitespace-normal text-center">Scopri i Piani Pro</Button>
                </Link>
              </div>
            </div>
          </div>

        </section>

      <Footer />
    </div>
  );
}




