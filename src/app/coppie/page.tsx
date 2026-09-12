"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, Lock, Map, Sparkles, BookHeart, CheckCircle } from "lucide-react";
import Footer from "@/components/Footer";
import { motion, Variants } from "framer-motion";

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function CoppiePage() {
  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans text-stone-900 flex flex-col overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="absolute top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-stone-900 font-serif text-2xl drop-shadow-sm"
        >
          <Heart className="w-6 h-6 text-rose-500" />
          ecos.com
        </Link>
        <div className="hidden md:flex items-center gap-8 text-[12px] font-medium tracking-[0.2em] text-stone-900 uppercase">
          <Link href="/#directory" className="hover:text-rose-500 transition-colors">Trova Fornitori</Link>
          <Link href="/professionisti" className="hover:text-rose-500 transition-colors">Area Partner</Link>
        </div>
        <Link href="/login?role=COUPLE&mode=REGISTER">
          <Button className="rounded-full bg-stone-900 hover:bg-stone-800 text-white font-medium px-6 hidden md:inline-flex shadow-xl">
            Crea il vostro spazio
          </Button>
        </Link>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=2070&auto=format&fit=crop" 
            alt="Coppia che si abbraccia" 
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#faf9f8]/80 via-[#faf9f8]/40 to-[#faf9f8]" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center w-full mt-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h2 className="text-[11px] md:text-xs font-semibold text-rose-500 uppercase tracking-[0.3em] mb-6 flex justify-center items-center gap-2">
              <Sparkles className="w-3.5 h-3.5"/> Il Santuario Digitale
            </h2>
            <h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-6 leading-tight text-stone-900">
              Custodite la vostra storia, <br/>
              <span className="italic font-light text-rose-500">un ricordo alla volta.</span>
            </h1>
            <p className="text-xl md:text-2xl text-stone-600 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
              Molto più di un social network. Uno spazio intimo e privato dove documentare i vostri traguardi, raccogliere foto ad alta risoluzione e progettare il vostro futuro insieme.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login?role=COUPLE&mode=REGISTER">
                <Button size="lg" className="w-full sm:w-auto h-16 px-10 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-lg shadow-xl transition-all hover:scale-105">
                  Iniziate a scrivere <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4 PILASTRI / FUNZIONI */}
      <section className="py-24 bg-white relative">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center"
          >
            <motion.div variants={fadeUpVariant} className="space-y-16">
              
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0 border border-rose-100 shadow-sm">
                  <BookHeart className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">La Timeline della vostra storia</h3>
                  <p className="text-stone-500 font-light text-lg leading-relaxed">Il primo appuntamento, la prima casa, quel viaggio indimenticabile. Registrate ogni capitolo della vostra vita su una linea del tempo bellissima e interattiva.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-full bg-stone-50 flex items-center justify-center flex-shrink-0 border border-stone-100 shadow-sm">
                  <Lock className="w-6 h-6 text-stone-700" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">Vault Fotografico Privato</h3>
                  <p className="text-stone-500 font-light text-lg leading-relaxed">I social media sono caotici e pubblici. Salvate i vostri scatti più belli in alta risoluzione in uno spazio protetto, visibile solo a voi e alle persone che inviterete.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 border border-amber-100 shadow-sm">
                  <Map className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">La Bucket List di Coppia</h3>
                  <p className="text-stone-500 font-light text-lg leading-relaxed">Dai ristoranti in cui volete cenare alle città che sognate di esplorare. Create liste condivise per non dimenticare mai i vostri piccoli e grandi progetti.</p>
                </div>
              </div>

            </motion.div>

            <motion.div variants={fadeUpVariant} className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
               <img src="https://images.unsplash.com/photo-1522083165195-3444bed50be9?q=80&w=2070&auto=format&fit=crop" alt="Coppia felice" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/20 to-transparent"></div>
               <div className="absolute bottom-10 left-10 right-10">
                 <div className="bg-white/20 backdrop-blur-md border border-white/30 p-6 rounded-2xl text-white">
                   <p className="font-serif italic text-2xl mb-2">"Il nostro rifugio digitale"</p>
                   <p className="font-light text-stone-200">Lontano dal rumore dei social, tutto ciò che conta per noi è custodito qui.</p>
                 </div>
               </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* LA MAGIA DELL'UPSELL */}
      <section className="py-24 bg-rose-500 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop')] opacity-10 mix-blend-multiply bg-cover bg-center"></div>
         <div className="max-w-4xl mx-auto px-4 text-center relative z-10 text-white">
           <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
           >
             <h2 className="text-4xl md:text-6xl font-serif mb-6 tracking-tight">Avete deciso di fare il grande passo?</h2>
             <p className="text-xl md:text-2xl font-light text-rose-100 max-w-2xl mx-auto mb-10 leading-relaxed">
               ecos.com cresce con voi. Con un semplice click, potrete trasformare il vostro Diario in un vero e proprio ecosistema organizzativo per il vostro Matrimonio. 
             </p>
             <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-left grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12 shadow-xl">
               <div className="flex items-center gap-3">
                 <div className="bg-white rounded-full p-1"><CheckCircle className="w-5 h-5 text-rose-500" /></div>
                 <span className="font-medium text-lg">Gestione Invitati e RSVP</span>
               </div>
               <div className="flex items-center gap-3">
                 <div className="bg-white rounded-full p-1"><CheckCircle className="w-5 h-5 text-rose-500" /></div>
                 <span className="font-medium text-lg">Ricerca dei migliori Professionisti</span>
               </div>
               <div className="flex items-center gap-3">
                 <div className="bg-white rounded-full p-1"><CheckCircle className="w-5 h-5 text-rose-500" /></div>
                 <span className="font-medium text-lg">Disposizione Tavoli Interattiva</span>
               </div>
               <div className="flex items-center gap-3">
                 <div className="bg-white rounded-full p-1"><CheckCircle className="w-5 h-5 text-rose-500" /></div>
                 <span className="font-medium text-lg">Partecipazioni Digitali</span>
               </div>
             </div>
             
             <Link href="/login?role=COUPLE&mode=REGISTER">
                <Button size="lg" className="h-16 px-12 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-lg shadow-[0_0_30px_rgba(0,0,0,0.3)] transition-all hover:scale-105 border-none font-bold">
                  Iniziate gratuitamente oggi
                </Button>
              </Link>
           </motion.div>
         </div>
      </section>

      <Footer />
    </div>
  );
}
