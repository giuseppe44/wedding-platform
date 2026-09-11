import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Camera, MapPin, Users, CheckCircle2, Star, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";

export default function SposiLandingPage() {
  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans text-stone-900 flex flex-col">
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/login?role=COUPLE&mode=REGISTER">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-xl transition-all hover:scale-105 border-none">
                Inizia Ora Gratuitamente <ArrowRight className="ml-2 w-5 h-5" />
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
              <div className="absolute -inset-4 bg-rose-100 rounded-[2rem] transform -rotate-3"></div>
              <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop" alt="Raccolta Foto" className="relative rounded-[2rem] shadow-2xl w-full object-cover aspect-[4/5]" />
              <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-3xl shadow-xl hidden md:block border border-stone-100">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-100 p-3 rounded-full"><CheckCircle2 className="w-6 h-6 text-emerald-600" /></div>
                  <div>
                    <p className="font-bold text-stone-800">450+ Foto Ricevute</p>
                    <p className="text-sm text-stone-500">Aggiornato ora</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-8 order-1 lg:order-2">
              <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mb-6">
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
            <div className="space-y-8">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight">Un unico luogo <br/>per tutta l'organizzazione.</h2>
              <p className="text-xl text-stone-600 leading-relaxed font-light">
                Dimentica fogli Excel e centinaia di chat separate. WeddingSpace e' il vostro quartier generale.
              </p>
              <ul className="space-y-4 text-stone-600">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" /> <span>Raccogli gli RSVP e le intolleranze alimentari in automatico.</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" /> <span>Condividi le mappe interattive della chiesa e della location.</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" /> <span>Ricevi dediche emozionanti sul guestbook digitale, che si sblocca il giorno dopo l'evento.</span></li>
              </ul>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-amber-100 rounded-[2rem] transform rotate-3"></div>
              <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop" alt="Organizzazione Matrimonio" className="relative rounded-[2rem] shadow-2xl w-full object-cover aspect-[4/5]" />
            </div>
          </div>
        </div>
      </section>

      {/* PREZZI */}
      <section className="py-32 bg-stone-50 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900">Piani trasparenti per gli sposi</h2>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto font-light">
              Scegli l'abbonamento più adatto al tuo evento. Sblocca funzionalità esclusive e conserva i tuoi ricordi per sempre.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic */}
            <div className="bg-white p-10 rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all">
              <h4 className="font-bold text-2xl text-stone-800 mb-2">Basic</h4>
              <p className="text-stone-500 mb-6 h-10">L'essenziale per il tuo grande giorno</p>
              <div className="mb-8">
                <span className="text-5xl font-serif font-bold text-stone-900">€ 100</span><span className="text-stone-500">/anno</span>
              </div>
              <ul className="text-stone-600 space-y-4 mb-10">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> <span>Gestione di 1 Matrimonio</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> <span>Raccolta foto illimitate dagli ospiti</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> <span>Guestbook digitale base</span></li>
              </ul>
              <Link href="/login?role=COUPLE&mode=REGISTER"><Button className="w-full bg-stone-900 hover:bg-stone-800 h-14 rounded-full text-white text-lg">Inizia Ora</Button></Link>
            </div>

            {/* Premium */}
            <div className="bg-stone-900 text-white p-10 rounded-3xl border border-stone-800 shadow-2xl relative transform md:-translate-y-8">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-amber-950 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                Il Più Scelto
              </div>
              <h4 className="font-bold text-2xl text-white mb-2">Premium</h4>
              <p className="text-stone-400 mb-6 h-10">Estendi i ricordi nel tempo</p>
              <div className="mb-8">
                <span className="text-5xl font-serif font-bold text-white">€ 180</span><span className="text-stone-400">/anno</span>
              </div>
              <ul className="text-stone-300 space-y-4 mb-10">
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-amber-500 shrink-0" /> <span>Tutto il piano Basic</span></li>
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-amber-500 shrink-0" /> <span>Fino a 3 Capitoli della Vita extra</span></li>
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-amber-500 shrink-0" /> <span>Timeline e mappe interattive</span></li>
              </ul>
              <Link href="/login?role=COUPLE&mode=REGISTER"><Button className="w-full bg-amber-500 hover:bg-amber-600 text-amber-950 h-14 rounded-full font-bold text-lg">Inizia Ora</Button></Link>
            </div>

            {/* Moon */}
            <div className="bg-white p-10 rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all">
              <h4 className="font-bold text-2xl text-stone-800 mb-2">Moon</h4>
              <p className="text-stone-500 mb-6 h-10">L'esperienza di lusso definitiva</p>
              <div className="mb-8">
                <span className="text-5xl font-serif font-bold text-stone-900">€ 250</span><span className="text-stone-500">/anno</span>
              </div>
              <ul className="text-stone-600 space-y-4 mb-10">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> <span>Tutto il piano Premium</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> <span>Capitoli della Vita illimitati</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> <span>Nessuna filigrana o logo</span></li>
              </ul>
              <Link href="/login?role=COUPLE&mode=REGISTER"><Button variant="outline" className="w-full h-14 rounded-full border-stone-300 text-lg">Contattaci</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
