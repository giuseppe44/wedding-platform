"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Camera, Search, MapPin, Users, ArrowRight, Briefcase, Calendar, Star, Menu, Sparkles } from "lucide-react";
import Footer from "@/components/Footer";
import PortalSearch from "@/components/PortalSearch";
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

const scaleUpVariant: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans text-stone-900 flex flex-col overflow-x-hidden">
      
      {/* NAVBAR (Portal Style) */}
      <nav className="absolute top-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-gradient-to-b from-stone-900/80 to-transparent">
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
          <Link href="#directory" className="hover:text-rose-300 transition-colors">TROVA FORNITORI</Link>
          <Link href="#capitoli" className="hover:text-rose-300 transition-colors">I CAPITOLI</Link>
          <Link href="/professionisti" className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> SEI UN PROFESSIONISTA?
          </Link>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center gap-4"
        >
          <Link href="/login" className="hidden md:block">
            <Button className="bg-white text-stone-900 hover:bg-stone-200 rounded-full font-bold px-6">
              Accedi
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden text-white"><Menu /></Button>
        </motion.div>
      </nav>

      {/* 1. HERO PORTALE CON MOTORE DI RICERCA */}
      <section className="relative pt-48 pb-32 px-4 flex flex-col items-center justify-center text-center overflow-hidden min-h-[85vh]">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 2, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover" 
            alt="Matrimonio Ecosistema" 
          />
          <div className="absolute inset-0 bg-stone-950/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#faf9f8]" />
        </div>
        
        {/* ELEMENTI FLUTTUANTI (Floating Widgets) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[5%] xl:left-[15%] bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl hidden lg:flex items-center gap-3 shadow-2xl z-20"
        >
          <div className="bg-rose-500 rounded-full p-2"><Camera className="w-4 h-4 text-white"/></div>
          <div className="text-white text-sm font-medium pr-2">+12 Foto caricate</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[40%] right-[5%] xl:right-[15%] bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl hidden lg:flex items-center gap-3 shadow-2xl z-20"
        >
          <div className="bg-emerald-500 rounded-full p-2"><Users className="w-4 h-4 text-white"/></div>
          <div className="text-white text-sm font-medium pr-2">Tavolo 4 Confermato</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="relative z-10 max-w-5xl mx-auto text-white w-full"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-5xl md:text-7xl font-serif tracking-tight mb-6 drop-shadow-xl leading-tight"
          >
            Il tuo <span className="italic font-light text-rose-300">Ecosistema</span> <br/>per eventi indimenticabili.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-xl md:text-2xl text-stone-100 max-w-3xl mx-auto mb-12 font-light drop-shadow-md"
          >
            Trova i migliori professionisti, crea lo spazio digitale per le tue foto e condividi ogni capitolo della tua storia. Tutto in un'unica piattaforma.
          </motion.p>
          
          {/* BARRA DI RICERCA INTERATTIVA */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <PortalSearch />
          </motion.div>
          
          {/* QUICK CHIPS */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-wrap justify-center gap-3 mt-8"
          >
            <span className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/20 hover:bg-white/20 cursor-pointer transition-colors">📸 Fotografi</span>
            <span className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/20 hover:bg-white/20 cursor-pointer transition-colors">🏰 Location</span>
            <span className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/20 hover:bg-white/20 cursor-pointer transition-colors">🎵 Musica</span>
            <span className="bg-rose-500/80 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold border border-rose-400 hover:bg-rose-500 cursor-pointer transition-colors shadow-lg shadow-rose-500/20">✨ Crea il tuo Spazio Sposi</span>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. I BENEFIT PER GLI SPOSI (Staggered Animation) */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUpVariant} className="text-[11px] md:text-xs font-semibold text-rose-400 uppercase tracking-[0.3em] mb-4 flex justify-center items-center gap-2">
              <Sparkles className="w-3.5 h-3.5"/> Il Vostro Spazio
            </motion.h2>
            <motion.h3 variants={fadeUpVariant} className="text-4xl md:text-6xl font-serif text-stone-900 mb-6 tracking-tight leading-tight">
              L'eleganza di un'esperienza <br className="hidden md:block" />senza compromessi.
            </motion.h3>
            <motion.p variants={fadeUpVariant} className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto font-light leading-relaxed">
              Un ambiente digitale su misura, disegnato per custodire le emozioni e orchestrare ogni dettaglio del vostro matrimonio con la massima cura.
            </motion.p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {/* Feature 1 */}
            <motion.div variants={fadeUpVariant} className="bg-[#faf9f8] rounded-3xl border border-stone-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden group flex flex-col">
              <div className="w-full h-56 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=2071&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Raccolta foto" />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h4 className="font-serif text-2xl text-stone-900 mb-3">Raccolta foto dagli invitati</h4>
                <p className="text-stone-600 leading-relaxed font-light">
                  Gli invitati scansionano un QR code e caricano le foto in diretta senza scaricare app. Raccogli istantaneamente ricordi inediti.
                </p>
              </div>
            </motion.div>
            {/* Feature 2 */}
            <motion.div variants={fadeUpVariant} className="bg-[#faf9f8] rounded-3xl border border-stone-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden group flex flex-col">
              <div className="w-full h-56 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Tavoli" />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h4 className="font-serif text-2xl text-stone-900 mb-3">Disposizione tavoli e RSVP</h4>
                <p className="text-stone-600 leading-relaxed font-light">
                  Gestisci le conferme degli ospiti e crea la mappa interattiva dei tavoli per il ristorante direttamente dal tuo spazio privato.
                </p>
              </div>
            </motion.div>
            {/* Feature 3 */}
            <motion.div variants={fadeUpVariant} className="bg-[#faf9f8] rounded-3xl border border-stone-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden group flex flex-col">
              <div className="w-full h-56 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2064&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Guestbook" />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h4 className="font-serif text-2xl text-stone-900 mb-3">Guestbook e Video-dediche</h4>
                <p className="text-stone-600 leading-relaxed font-light">
                  Lascia che parenti e amici registrino messaggi vocali, dediche scritte o brevi video-auguri che conserverai per sempre.
                </p>
              </div>
            </motion.div>
            {/* Feature 4 */}
            <motion.div variants={fadeUpVariant} className="bg-[#faf9f8] rounded-3xl border border-stone-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden group flex flex-col">
              <div className="w-full h-56 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1606490204739-122e2361ef53?q=80&w=2069&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Album" />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h4 className="font-serif text-2xl text-stone-900 mb-3">Gestione completa dell'album</h4>
                <p className="text-stone-600 leading-relaxed font-light">
                  Il tuo fotografo carica qui le foto ufficiali in alta risoluzione. Decidi tu quali foto rendere pubbliche o nascondere.
                </p>
              </div>
            </motion.div>
            {/* Feature 5 */}
            <motion.div variants={fadeUpVariant} className="bg-[#faf9f8] rounded-3xl border border-stone-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden group flex flex-col">
              <div className="w-full h-56 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1577901089201-831e5f5223ab?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Inviti" />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h4 className="font-serif text-2xl text-stone-900 mb-3">Inviti digitali interattivi</h4>
                <p className="text-stone-600 leading-relaxed font-light">
                  Invia partecipazioni digitali tramite WhatsApp o Email con mappe, programma della giornata e link diretto per l'RSVP.
                </p>
              </div>
            </motion.div>
            {/* Feature 6 */}
            <motion.div variants={fadeUpVariant} className="bg-[#faf9f8] rounded-3xl border border-stone-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden group flex flex-col">
              <div className="w-full h-56 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Sposi" />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h4 className="font-serif text-2xl text-stone-900 mb-3">Una pagina tutta vostra</h4>
                <p className="text-stone-600 leading-relaxed font-light">
                  La vostra storia racchiusa in una pagina web bellissima e personalizzata, protetta da password per la massima privacy.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3. CAPITOLI / TIMELINE (L'EREDITÀ DIGITALE - Parallax feel) */}
      <section className="py-32 bg-stone-900 text-white relative overflow-hidden" id="capitoli">
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-stone-950" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeUpVariant} className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-4">L'Ecosistema Cresce con Te</motion.h2>
            <motion.h3 variants={fadeUpVariant} className="text-4xl md:text-6xl font-serif mb-8 leading-tight">Il matrimonio è il primo capitolo.<br/>La vostra storia continua.</motion.h3>
            <motion.p variants={fadeUpVariant} className="text-xl text-stone-300 max-w-3xl mx-auto mb-16 font-light">
              Da noi non prenoti solo il fotografo del matrimonio. ecos.com è una timeline della tua vita. Riapri il tuo spazio per ogni nuovo grande traguardo.
            </motion.p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <motion.div variants={scaleUpVariant} className="relative group overflow-hidden rounded-2xl aspect-[4/5] shadow-2xl border border-white/10">
              <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100 mix-blend-overlay" alt="Viaggio di Nozze" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-6 text-left">
                <div className="w-8 h-8 rounded-full bg-white text-stone-900 flex items-center justify-center font-bold text-sm mb-3">1</div>
                <h4 className="font-serif text-2xl font-bold text-white mb-1">Matrimonio</h4>
                <p className="text-stone-300 text-sm">Il giorno perfetto.</p>
              </div>
            </motion.div>
            
            <motion.div variants={scaleUpVariant} className="relative group overflow-hidden rounded-2xl aspect-[4/5] shadow-2xl border border-white/10">
              <img src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2069&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100 mix-blend-overlay" alt="Anniversario" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-6 text-left">
                <div className="w-8 h-8 rounded-full bg-white text-stone-900 flex items-center justify-center font-bold text-sm mb-3">2</div>
                <h4 className="font-serif text-2xl font-bold text-white mb-1">Anniversari</h4>
                <p className="text-stone-300 text-sm">Rinnova la magia.</p>
              </div>
            </motion.div>

            <motion.div variants={scaleUpVariant} className="relative group overflow-hidden rounded-2xl aspect-[4/5] shadow-2xl border border-white/10">
              <img src="https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100 mix-blend-overlay" alt="Nascita e Battesimo" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-6 text-left">
                <div className="w-8 h-8 rounded-full bg-white text-stone-900 flex items-center justify-center font-bold text-sm mb-3">3</div>
                <h4 className="font-serif text-2xl font-bold text-white mb-1">Battesimo</h4>
                <p className="text-stone-300 text-sm">Nuove vite, nuovi ricordi.</p>
              </div>
            </motion.div>

            <motion.div variants={scaleUpVariant} className="relative group overflow-hidden rounded-2xl aspect-[4/5] shadow-2xl border border-white/10">
              <img src="https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100 mix-blend-overlay" alt="Famiglia" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-6 text-left">
                <div className="w-8 h-8 rounded-full bg-white text-stone-900 flex items-center justify-center font-bold text-sm mb-3">4</div>
                <h4 className="font-serif text-2xl font-bold text-white mb-1">Feste Private</h4>
                <p className="text-stone-300 text-sm">Un album infinito.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 4. IL BIVIO (Magnetic / Hover scale effects) */}
      <section className="py-24 bg-[#faf9f8]" id="directory">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">Un unico portale, due mondi interconnessi.</h2>
            <p className="text-stone-500 max-w-2xl mx-auto">La piattaforma che unisce chi celebra l'amore e chi lavora per renderlo perfetto.</p>
          </motion.div>
          
          <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl mx-auto">
            {/* CARD SPOSI */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 relative flex flex-col justify-end p-10 overflow-hidden rounded-[2.5rem] min-h-[400px] group shadow-xl hover:shadow-2xl transition-shadow duration-500"
            >
              <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop" alt="Sposi Bivio" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent" />
              </div>
              <div className="relative z-10 text-left">
                <div className="w-14 h-14 bg-rose-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-rose-500/30 group-hover:bg-rose-500/40 transition-colors duration-500">
                  <Heart className="w-7 h-7 text-rose-400 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h2 className="text-4xl font-serif text-white mb-3">Siete gli Sposi?</h2>
                <p className="text-stone-200 text-lg mb-8 font-light max-w-sm">
                  Cercate i fornitori, raccogliete le foto degli invitati e condividete l'organizzazione.
                </p>
                <Link href="/login?role=COUPLE&mode=REGISTER">
                  <Button size="lg" className="h-14 px-8 rounded-full bg-white text-stone-900 hover:bg-stone-200 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105 border-none font-bold">
                    Crea Area Sposi
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* CARD PROFESSIONISTI */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex-1 relative flex flex-col justify-end p-10 overflow-hidden rounded-[2.5rem] min-h-[400px] group shadow-xl hover:shadow-2xl transition-shadow duration-500"
            >
              <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop" alt="Pro Bivio" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent" />
              </div>
              <div className="relative z-10 text-left">
                <div className="w-14 h-14 bg-amber-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-amber-500/30 group-hover:bg-amber-500/40 transition-colors duration-500">
                  <Camera className="w-7 h-7 text-amber-400 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h2 className="text-4xl font-serif text-white mb-3">Sei un Professionista?</h2>
                <p className="text-stone-300 text-lg mb-8 font-light max-w-sm">
                  Appari nelle ricerche, acquisisci i contatti degli invitati e vendi i tuoi servizi.
                </p>
                <Link href="/professionisti">
                  <Button size="lg" className="h-14 px-8 rounded-full bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all hover:scale-105 border-none font-bold">
                    Area Partner
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA PREZZI */}
      <section className="py-24 bg-white border-t border-stone-200">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-4 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6">Trasparenza totale. Nessun costo nascosto.</h2>
          <p className="text-xl text-stone-600 mb-10 font-light">
            Abbiamo creato piani su misura sia per i futuri sposi che per i professionisti del settore. Scopri tutte le funzionalità incluse e scegli l'opzione perfetta per te.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/prezzi">
              <Button size="lg" className="w-full sm:w-auto h-14 px-10 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-lg shadow-xl hover:-translate-y-1 transition-all">
                Scopri i nostri Piani <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 rounded-full border-stone-300 text-stone-900 text-lg hover:bg-stone-50 transition-colors">
                Accedi o Registrati
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
