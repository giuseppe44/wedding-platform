import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Camera, MapPin, Users, CheckCircle2, Star, ArrowRight } from "lucide-react";

export default function SposiLandingPage() {
  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans text-stone-900">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-stone-900 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 to-stone-900 opacity-90" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-white">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-8 backdrop-blur-sm border border-white/20">
            <Heart className="w-5 h-5 text-rose-400 mr-2" />
            <span className="text-sm font-medium tracking-wide">Per i Futuri Sposi</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-8 drop-shadow-lg leading-tight">
            Crea il tuo spazio <span className="italic font-light text-rose-200">per sempre.</span>
          </h1>
          <p className="text-xl text-stone-300 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
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

      {/* FUNZIONALITA */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-6">Tutto quello che vi serve</h2>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto">
              Dimentica i gruppi WhatsApp disordinati. Un'unica piattaforma elegante per vivere il matrimonio perfetto.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-stone-50 p-8 rounded-3xl border border-stone-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mb-6">
                <Camera className="w-7 h-7 text-rose-600" />
              </div>
              <h3 className="text-2xl font-serif text-stone-800 mb-3">Foto dagli Invitati</h3>
              <p className="text-stone-600 leading-relaxed">
                Stampa un QR code sui tavoli. Gli invitati potranno scattare e caricare le foto in diretta senza scaricare nessuna app.
              </p>
            </div>
            
            <div className="bg-stone-50 p-8 rounded-3xl border border-stone-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-2xl font-serif text-stone-800 mb-3">Gestione Ospiti</h3>
              <p className="text-stone-600 leading-relaxed">
                Organizza i tavoli, invia le partecipazioni digitali e ricevi le conferme di presenza (RSVP) in un clic.
              </p>
            </div>
            
            <div className="bg-stone-50 p-8 rounded-3xl border border-stone-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-serif text-stone-800 mb-3">Programma & Mappe</h3>
              <p className="text-stone-600 leading-relaxed">
                Condividi la timeline della giornata, le mappe interattive per la chiesa e la location e suggerimenti su dove dormire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PREZZI */}
      <section className="py-24 bg-stone-50 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-serif text-stone-900">Piani trasparenti per gli sposi</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Scegli l'abbonamento più adatto al tuo evento. Sblocca funzionalità esclusive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-2xl text-stone-800 mb-2">Basic</h4>
              <p className="text-stone-500 mb-6 h-10">L'essenziale per il tuo grande giorno</p>
              <div className="mb-8">
                <span className="text-4xl font-serif font-bold text-stone-900">€ 100</span><span className="text-stone-500">/anno</span>
              </div>
              <ul className="text-stone-600 space-y-4 mb-8">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> <span>Gestione di 1 Matrimonio</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> <span>Raccolta foto illimitate dagli ospiti</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> <span>Guestbook digitale base</span></li>
              </ul>
              <Link href="/login?role=COUPLE&mode=REGISTER"><Button className="w-full bg-stone-900 hover:bg-stone-800 h-12 rounded-full text-white">Inizia Ora</Button></Link>
            </div>

            {/* Premium */}
            <div className="bg-stone-900 text-white p-8 rounded-3xl border border-stone-800 shadow-2xl relative transform md:-translate-y-4">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-amber-950 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                Più Scelto
              </div>
              <h4 className="font-bold text-2xl text-white mb-2">Premium</h4>
              <p className="text-stone-400 mb-6 h-10">Estendi i ricordi nel tempo</p>
              <div className="mb-8">
                <span className="text-4xl font-serif font-bold text-white">€ 180</span><span className="text-stone-400">/anno</span>
              </div>
              <ul className="text-stone-300 space-y-4 mb-8">
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-amber-500 shrink-0" /> <span>Tutto il piano Basic</span></li>
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-amber-500 shrink-0" /> <span>Fino a 3 Capitoli della Vita extra</span></li>
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-amber-500 shrink-0" /> <span>Timeline e mappe interattive</span></li>
              </ul>
              <Link href="/login?role=COUPLE&mode=REGISTER"><Button className="w-full bg-amber-500 hover:bg-amber-600 text-amber-950 h-12 rounded-full font-bold">Inizia Ora</Button></Link>
            </div>

            {/* Moon */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-2xl text-stone-800 mb-2">Moon</h4>
              <p className="text-stone-500 mb-6 h-10">L'esperienza di lusso definitiva</p>
              <div className="mb-8">
                <span className="text-4xl font-serif font-bold text-stone-900">€ 250</span><span className="text-stone-500">/anno</span>
              </div>
              <ul className="text-stone-600 space-y-4 mb-8">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> <span>Tutto il piano Premium</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> <span>Capitoli della Vita illimitati</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> <span>Nessuna filigrana o logo</span></li>
              </ul>
              <Link href="/login?role=COUPLE&mode=REGISTER"><Button variant="outline" className="w-full h-12 rounded-full border-stone-300">Contattaci</Button></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
