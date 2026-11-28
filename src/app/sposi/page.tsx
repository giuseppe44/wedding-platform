import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Camera, MapPin, Users, CheckCircle2, Star, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Area Sposi – Sito Matrimonio, Foto Invitati QR Code e RSVP",
  description:
    "Crea il sito digitale del tuo matrimonio su GentiLuna: raccogli foto e video degli invitati con QR Code in tempo reale, gestisci RSVP, intolleranze, tavoli e lista nozze.",
  alternates: {
    canonical: "/sposi",
  },
};

export default function SposiLandingPage() {
  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans text-stone-900 flex flex-col overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-40 pb-32 px-4 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-stone-900 z-0">
          <img src="https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-40" alt="Sposi" />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-stone-900/60 to-[#faf9f8]" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-white">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-8 backdrop-blur-sm border border-white/20">
            <Heart className="w-5 h-5 text-rose-400 mr-2" />
            <span className="text-sm font-medium tracking-wide">Esclusivo per i Futuri Sposi</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-8 drop-shadow-lg leading-tight">
            Crea il tuo spazio <br/><span className="italic font-light text-rose-200">per sempre.</span>
          </h1>
          <p className="text-xl text-stone-200 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Raccogli le foto di tutti gli invitati in tempo reale, ricevi dediche emozionanti e organizza ogni dettaglio in un unico, elegante spazio digitale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
            <Link href="/login?role=COUPLE&mode=REGISTER" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto min-h-14 h-auto py-3.5 px-6 sm:px-8 text-base sm:text-lg rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-xl transition-all hover:scale-105 border-none whitespace-normal text-center leading-snug">
                <span>Inizia Ora Gratuitamente</span> <ArrowRight className="ml-2 w-5 h-5 shrink-0" />
              </Button>
            </Link>
            <Link href="/budget-matrimonio" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto min-h-14 h-auto py-3.5 px-6 sm:px-8 text-base sm:text-lg rounded-full bg-white/10 backdrop-blur-md border-amber-300/50 text-amber-100 hover:bg-amber-400 hover:text-stone-950 transition-all whitespace-normal text-center leading-snug">
                <span>Hai un Budget? Parti da lì ✨</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURE 1 - DYNAMIC SPLIT */}
      <section className="py-24 bg-[#faf9f8]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-4 bg-rose-100 rounded-[2rem] transform -rotate-2"></div>
              <img src="/press/GentiLuna_Immagine_7.jpg" alt="Tableau Interattivo, Galleria HD, RSVP e Timeline GentiLuna" className="relative rounded-[2rem] shadow-2xl w-full object-cover aspect-[16/9]" />
              <div className="mt-4 rounded-2xl overflow-hidden shadow-lg border border-stone-200 relative z-10">
                <img src="/press/GentiLuna_Immagine_8.jpg" alt="Gestione RSVP, Intolleranze e Tavoli dallo Smartphone" className="w-full object-cover aspect-[16/9]" />
              </div>
            </div>
            
            <div className="space-y-8 order-1 lg:order-2 text-center lg:text-left">
              <div className="w-16 h-16 mx-auto lg:mx-0 bg-rose-100 rounded-2xl flex items-center justify-center mb-6">
                <Camera className="w-8 h-8 text-rose-600" />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight">Il punto di vista <br/>dei tuoi invitati.</h2>
              <p className="text-xl text-stone-600 leading-relaxed font-light">
                Il fotografo ufficiale cattura la perfezione, ma i tuoi amici catturano il divertimento. 
              </p>
              <p className="text-stone-500 leading-relaxed">
                Stampa un elegante QR code da mettere sui tavoli. Gli invitati lo inquadrano, scattano e la foto finisce immediatamente nella vostra galleria privata. Nessuna App da scaricare per loro, nessun gruppo WhatsApp intasato per voi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE 2 - DYNAMIC SPLIT */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="w-16 h-16 mx-auto lg:mx-0 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight">Un unico luogo <br/>per tutta l'organizzazione.</h2>
              <p className="text-xl text-stone-600 leading-relaxed font-light">
                Dimentica fogli Excel e centinaia di chat separate. GentiLuna e' il vostro quartier generale.
              </p>
              <ul className="space-y-4 text-stone-600 text-left">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" /> <span>Raccogli gli RSVP e le intolleranze alimentari in automatico.</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" /> <span>Condividi le mappe interattive della chiesa e della location.</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" /> <span>Ricevi dediche emozionanti sul guestbook digitale, che si sblocca il giorno dopo l'evento.</span></li>
              </ul>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-amber-100 rounded-[2rem] transform rotate-2"></div>
              <img src="/press/GentiLuna_Showcase_Capitoli.jpg" alt="I Capitoli della Vita: Matrimonio, Viaggio di Nozze, Nascita e Famiglia" className="relative rounded-[2rem] shadow-2xl w-full object-cover aspect-[16/9]" />
              <div className="mt-4 rounded-2xl overflow-hidden shadow-lg border border-stone-200 relative z-10">
                <img src="/press/GentiLuna_Showcase_Regali_Guestbook.jpg" alt="Lista Regali IBAN, Tappe Viaggio Nozze e Guestbook Dediche" className="w-full object-cover aspect-[16/9]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STRUMENTO GRATUITO BUDGET & IDEE */}
      <section className="py-20 bg-stone-950 text-white border-t border-stone-800">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-300/35 text-amber-200 text-xs font-bold uppercase tracking-widest">
            Nuovo Strumento Gratuito per i Tuoi Eventi
          </span>
          <h2 className="text-3xl md:text-5xl font-serif leading-tight">
            Non sapete come dividere il budget tra{" "}
            <span className="italic text-amber-300">Ristorante, Villa e Professionisti?</span>
          </h2>
          <p className="text-base sm:text-lg text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
            Inserite la cifra che avete in mente o scoprite le nostre 6 Idee di Matrimonio già pronte: vedrete subito cosa fare, chi contattare e i dettagli utili da verificare per organizzare tutto passo dopo passo.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/budget-matrimonio">
              <Button size="lg" className="w-full sm:w-auto rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-8 h-13">
                <span>Simula il Tuo Budget Gratis</span> <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/budget-matrimonio?tab=idee">
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full bg-transparent border-stone-600 text-white hover:bg-white/10 px-7 h-13">
                Esplora 6 Idee di Budget
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA PREZZI */}
      <section className="py-24 bg-white border-t border-stone-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6">Trasparenza totale. Nessun costo nascosto.</h2>
          <p className="text-xl text-stone-600 mb-10 font-light">
            Abbiamo creato piani su misura per il tuo evento. Scopri tutte le funzionalità incluse e scegli l'opzione perfetta per conservare i tuoi ricordi per sempre.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/prezzi#sposi" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto min-h-14 h-auto py-3.5 px-8 sm:px-10 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-base sm:text-lg shadow-xl whitespace-normal text-center leading-snug">
                <span>Scopri i nostri Piani</span> <ArrowRight className="ml-2 w-5 h-5 shrink-0" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
