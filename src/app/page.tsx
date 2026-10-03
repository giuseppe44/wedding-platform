"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Heart, Camera, Search, MapPin, Users, ArrowRight, 
  Briefcase, Calendar, Star, Menu, Sparkles, CheckCircle, 
  Gift, Share2, Image as ImageIcon, MessageCircle, Map,
  Infinity, LayoutDashboard
} from "lucide-react";
import Footer from "@/components/Footer";
import { motion, Variants } from "framer-motion";

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
  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans text-stone-900 flex flex-col overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="absolute top-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-gradient-to-b from-stone-900/50 to-transparent">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-2 text-white font-serif text-2xl drop-shadow-md"
        >
          <Heart className="w-6 h-6 text-rose-500" />
          ecos.com
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden md:flex items-center gap-8 text-[12px] font-light tracking-[0.2em] text-white drop-shadow-md uppercase"
        >
          <Link href="/sposi" className="text-white hover:text-rose-300 transition-colors font-semibold">AREA SPOSI</Link>
          <Link href="/fornitori" className="hover:text-rose-300 transition-colors">FORNITORI</Link>
          <Link href="#pricing" className="hover:text-rose-300 transition-colors">ABBONAMENTI</Link>
          <Link href="/professionisti" className="text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> SEI UN PROFESSIONISTA?
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center gap-4"
        >
          <Link href="/login">
            <Button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-stone-900 rounded-full font-bold px-4 md:px-6">
              Accedi
            </Button>
          </Link>
          <div className="md:hidden text-white ml-2">
            <Menu className="w-8 h-8" />
          </div>
        </motion.div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden bg-stone-950">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop" 
            alt="Wedding Memories"
            className="w-full h-full object-cover opacity-60 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="inline-block py-1 px-3 rounded-full border border-rose-500/30 bg-rose-500/20 text-rose-300 text-xs font-bold tracking-[0.2em] mb-6 backdrop-blur-md">
              MOLTO PIÙ DI UN SITO WEB
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight drop-shadow-xl">
              Una Vetrina Unica <br className="hidden md:block" />
              <span className="text-stone-400 italic font-light">per Tutta la Vita.</span>
            </h1>
            <p className="text-lg md:text-2xl text-stone-300 font-light max-w-3xl mx-auto mb-10 leading-relaxed drop-shadow-md">
              Il vostro matrimonio è solo l'inizio della vostra vita insieme. 
              Da lì in avanti, tutto quello che farete lo ritroverete qua.
            </p>
          </motion.div>
        </div>
      </header>

      
        {/* THREE MAIN GATEWAYS - LUMINOSO E PREMIUM */}
        <section className="pt-32 pb-32 bg-gradient-to-b from-stone-50 via-white to-white relative z-20 -mt-20 rounded-t-[3rem] sm:rounded-t-[4rem] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.3)]">
          <div className="max-w-7xl mx-auto px-6">
            
            {/* Animazione introduttiva capitoli */}
            <div className="flex justify-center mb-20 relative z-30">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 bg-white/80 backdrop-blur-md px-8 py-4 rounded-full shadow-2xl border border-stone-200"
              >
                <div className="flex -space-x-4">
                  {[1, 2, 3].map((i) => (
                    <motion.div 
                      key={i}
                      animate={{ 
                        y: [0, -8, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 3,
                        delay: i * 0.4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut"
                      }}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 border-4 border-white flex items-center justify-center shadow-md relative z-10"
                    >
                      <Heart className="w-5 h-5 text-rose-500" />
                    </motion.div>
                  ))}
                </div>
                <div className="text-stone-700 font-serif italic text-lg ml-2">I Capitoli della vostra Storia</div>
              </motion.div>
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
                <motion.div variants={fadeUpVariant} className="bg-white border border-stone-100 p-10 rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-15px_rgba(244,63,94,0.2)] transition-all duration-500 h-full flex flex-col justify-between group-hover:-translate-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-rose-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-rose-50 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-inner relative group-hover:scale-110 transition-transform duration-500">
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
                  <div className="mt-12 flex items-center text-rose-500 font-semibold text-lg group-hover:gap-4 transition-all relative z-10">
                    Inizia ora <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                </motion.div>
              </Link>
  
              {/* 2. Fornitori */}
              <Link href="/fornitori" className="block group h-full">
                <motion.div variants={fadeUpVariant} className="bg-white border border-stone-100 p-10 rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-15px_rgba(41,37,36,0.15)] transition-all duration-500 h-full flex flex-col justify-between group-hover:-translate-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-stone-100 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-stone-100 to-stone-50 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-inner relative overflow-hidden group-hover:scale-110 transition-transform duration-500">
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
                    <h3 className="text-3xl font-serif text-stone-900 mb-4 group-hover:text-stone-700 transition-colors">Fornitori & Top Pro</h3>
                    <p className="text-stone-500 font-light leading-relaxed text-[1.1rem]">
                      Ricerca tra i migliori professionisti del settore. Esplora l'elenco generale dei nostri iscritti e trova fotografo, location, e molto altro.
                    </p>
                  </div>
                  <div className="mt-12 flex items-center text-stone-700 font-semibold text-lg group-hover:gap-4 transition-all relative z-10">
                    Cerca Fornitori <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                </motion.div>
              </Link>
  
              {/* 3. Abbonamenti e Promozioni */}
              <Link href="#pricing" className="block group h-full">
                <motion.div variants={fadeUpVariant} className="bg-white border border-stone-100 p-10 rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-15px_rgba(245,158,11,0.2)] transition-all duration-500 h-full flex flex-col justify-between group-hover:-translate-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-amber-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-50 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-inner relative group-hover:scale-110 transition-transform duration-500">
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
                  <div className="mt-12 flex items-center text-amber-500 font-semibold text-lg group-hover:gap-4 transition-all relative z-10">
                    Vedi Piani <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </section>
  
        {/* CORE FEATURES GRID */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-4">La Vostra Piattaforma</h2>
            <p className="text-xl text-stone-500 font-light max-w-2xl mx-auto">Tutto ciò di cui avete bisogno in un unico posto per un intrattenimento unico e memorabile.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 bg-stone-50 rounded-3xl border border-stone-100">
              <Camera className="w-10 h-10 text-rose-500 mb-6" />
              <h3 className="text-xl font-bold mb-3">Raccolta foto dagli invitati</h3>
              <p className="text-stone-600 font-light">Gli invitati scansionano un QR code e caricano le foto in diretta senza scaricare app. Raccogli istantaneamente ricordi inediti.</p>
            </div>
            <div className="p-8 bg-stone-50 rounded-3xl border border-stone-100">
              <Map className="w-10 h-10 text-emerald-500 mb-6" />
              <h3 className="text-xl font-bold mb-3">Disposizione tavoli e RSVP</h3>
              <p className="text-stone-600 font-light">Gestisci le conferme degli ospiti e crea la mappa interattiva dei tavoli per il ristorante direttamente dal tuo spazio privato.</p>
            </div>
            <div className="p-8 bg-stone-50 rounded-3xl border border-stone-100">
              <MessageCircle className="w-10 h-10 text-amber-500 mb-6" />
              <h3 className="text-xl font-bold mb-3">Guestbook e Video-dediche</h3>
              <p className="text-stone-600 font-light">Lascia che parenti e amici registrino messaggi vocali, dediche scritte o brevi video-auguri che conserverai per sempre.</p>
            </div>
            <div className="p-8 bg-stone-50 rounded-3xl border border-stone-100">
              <ImageIcon className="w-10 h-10 text-indigo-500 mb-6" />
              <h3 className="text-xl font-bold mb-3">Gestione completa dell'album</h3>
              <p className="text-stone-600 font-light">Il tuo fotografo carica qui le foto ufficiali in alta risoluzione. Decidi tu quali foto rendere pubbliche o nascondere.</p>
            </div>
            <div className="p-8 bg-stone-50 rounded-3xl border border-stone-100">
              <Share2 className="w-10 h-10 text-blue-500 mb-6" />
              <h3 className="text-xl font-bold mb-3">Inviti digitali interattivi</h3>
              <p className="text-stone-600 font-light">Invia partecipazioni digitali tramite WhatsApp o Email con mappe, programma della giornata e link diretto per l'RSVP.</p>
            </div>
            <div className="p-8 bg-stone-50 rounded-3xl border border-stone-100">
              <Sparkles className="w-10 h-10 text-rose-400 mb-6" />
              <h3 className="text-xl font-bold mb-3">Una pagina tutta vostra</h3>
              <p className="text-stone-600 font-light">La vostra storia racchiusa in una pagina web bellissima e personalizzata, protetta da password per la massima privacy.</p>
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
          >
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6 leading-tight">
              Un unico portale, <br/>
              <span className="text-rose-500 italic">due mondi interconnessi.</span>
            </h2>
            <p className="text-xl text-stone-600 font-light mb-10 leading-relaxed">
              La piattaforma che unisce chi celebra l'amore e chi lavora per renderlo perfetto.
            </p>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-stone-100 relative">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Infinity className="w-32 h-32 text-stone-900" />
              </div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Calendar className="text-rose-500 w-6 h-6" /> Il matrimonio è il primo capitolo.
              </h3>
              <p className="text-lg text-stone-600 font-light mb-6">
                La vostra storia continua. Da noi non prenoti solo il fotografo del matrimonio. ecos.com è una timeline della tua vita.
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
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl relative">
              <img 
                src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop" 
                alt="Couple smiling" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent flex items-end p-10">
                <p className="text-white text-2xl font-serif italic drop-shadow-md">"Una vetrina che durerà in eterno."</p>
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
              "ecos.com LIVE (Modalità Proiettore per le foto)",
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
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">-50%</span>
              </span>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* SPOSI ENTRY */}
              <div className="bg-white p-8 rounded-3xl shadow-md border border-stone-200 flex flex-col text-left hover:-translate-y-2 transition-transform">
                <div className="text-rose-500 font-bold tracking-widest text-sm mb-4 uppercase">Per gli Sposi</div>
                <h3 className="text-3xl font-serif text-stone-900 mb-2">Piano Base</h3>
                <p className="text-stone-500 mb-6 line-clamp-2">Inizia a raccogliere foto e a creare la tua timeline della vita.</p>
                
                <div className="text-4xl font-bold mb-2">
                  {isTriennial ? '148,50 €' : '99,00 €'}
                </div>
                {!isTriennial ? (
                  <div className="text-sm text-stone-500 mb-6 min-h-[40px]">
                    il primo anno<br/>
                    <span className="italic">rinnovo dal secondo anno 50,00 € all'anno</span>
                  </div>
                ) : (
                  <div className="text-sm text-emerald-600 font-bold mb-6 min-h-[40px]">
                    Pagamento anticipato 3 anni.<br/>Risparmi 148,50 €
                  </div>
                )}

                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0"/> Galleria foto e video</li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0"/> 10 GB di spazio privato</li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0"/> Sito web personalizzato</li>
                </ul>
                <Link href="/prezzi">
                  <Button className="w-full h-12 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-semibold">Scopri i Piani</Button>
                </Link>
              </div>
  
              {/* SPOSI PREMIUM */}
              <div className="bg-stone-900 p-8 rounded-3xl shadow-xl border border-stone-800 flex flex-col text-left text-white hover:-translate-y-2 transition-transform relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-rose-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">CONSIGLIATO</div>
                <div className="text-rose-400 font-bold tracking-widest text-sm mb-4 uppercase">Per gli Sposi</div>
                <h3 className="text-3xl font-serif mb-2">Piano Premium</h3>
                <p className="text-stone-400 mb-6 line-clamp-2">Sblocca tutte le funzionalità organizzative per un matrimonio perfetto.</p>
                
                <div className="text-4xl font-bold mb-2">
                  {isTriennial ? '448,50 €' : '299,00 €'}
                </div>
                {!isTriennial ? (
                  <div className="text-sm text-stone-400 mb-6 min-h-[40px]">
                    il primo anno<br/>
                    <span className="italic text-stone-500">rinnovo dal secondo anno 60,00 € all'anno</span>
                  </div>
                ) : (
                  <div className="text-sm text-emerald-400 font-bold mb-6 min-h-[40px]">
                    Pagamento anticipato 3 anni.<br/>Risparmi 448,50 €
                  </div>
                )}

                <ul className="space-y-4 mb-8 flex-grow text-stone-300">
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-emerald-400 shrink-0"/> Spazio Illimitato</li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-emerald-400 shrink-0"/> Disposizione Tavoli & RSVP</li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-emerald-400 shrink-0"/> ecos.com LIVE (Proiettore)</li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-emerald-400 shrink-0"/> Inviti digitali illimitati</li>
                </ul>
                <Link href="/prezzi">
                  <Button className="w-full h-12 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold border-none">Scopri i Piani</Button>
                </Link>
              </div>
  
              {/* PROFESSIONISTI */}
              <div className="bg-white p-8 rounded-3xl shadow-md border border-stone-200 flex flex-col text-left hover:-translate-y-2 transition-transform">
                <div className="text-amber-500 font-bold tracking-widest text-sm mb-4 uppercase">Per i Professionisti</div>
                <h3 className="text-3xl font-serif text-stone-900 mb-2">Pro & Partner</h3>
                <p className="text-stone-500 mb-6 line-clamp-2">Ottieni visibilità, consegne digitali perfette e acquisisci nuovi clienti.</p>
                <div className="text-4xl font-bold mb-2">da € 15<span className="text-xl text-stone-400 font-light">/mese</span></div>
                <div className="text-sm text-stone-500 mb-6 min-h-[40px]">Fatturazione annuale</div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0"/> Vetrina nella directory Top Pro</li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0"/> Consegna album in alta qualità</li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0"/> Ricevi recensioni e contatti diretti</li>
                </ul>
                <Link href="/professionisti">
                  <Button className="w-full h-12 rounded-full bg-amber-400 hover:bg-amber-500 text-stone-900 font-bold border-none shadow-sm">Scopri i Piani Pro</Button>
                </Link>
              </div>
            </div>
          </div>

        </section>

      <Footer />
    </div>
  );
}




