import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Camera, MapPin, Users, CheckCircle2, Star, ArrowRight, UserCircle, Briefcase, Calendar } from "lucide-react";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans text-stone-900 flex flex-col">
      
      {/* NAVBAR */}
      <nav className="absolute top-0 w-full z-50 px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2 text-white font-serif text-2xl drop-shadow-md">
          <Heart className="w-6 h-6 text-rose-500" />
          WeddingSpace
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/professionisti" className="text-white/90 hover:text-white font-medium drop-shadow-sm flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Sei un Professionista?
          </Link>
          <Link href="/login">
            <Button className="bg-white text-stone-900 hover:bg-stone-200 rounded-full font-bold px-6">
              Accedi
            </Button>
          </Link>
        </div>
      </nav>

      {/* 1. HERO SECTION (SPOSI) */}
      <section className="relative pt-40 pb-32 px-4 flex flex-col items-center justify-center text-center overflow-hidden min-h-[90vh]">
        <div className="absolute inset-0 bg-stone-900 z-0">
          <img src="https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-40" alt="Sposi" />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-stone-900/60 to-[#faf9f8]" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-white mt-12">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-8 backdrop-blur-sm border border-white/20 shadow-lg">
            <Heart className="w-5 h-5 text-rose-400 mr-2" />
            <span className="text-sm font-medium tracking-wide">La Piattaforma per il tuo Matrimonio</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-8 drop-shadow-lg leading-tight">
            Crea il tuo spazio <br/><span className="italic font-light text-rose-200">per sempre.</span>
          </h1>
          <p className="text-xl md:text-2xl text-stone-200 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Raccogli le foto degli invitati in tempo reale, ricevi dediche emozionanti e racconta la vostra storia, capitolo dopo capitolo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/login?role=COUPLE&mode=REGISTER">
              <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-lg rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-2xl transition-transform hover:scale-105 border-none">
                Inizia Ora Gratuitamente <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC FEATURES (SPOSI) */}
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
                <li className="flex items-start gap-3"><CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" /> <span>Ricevi dediche emozionanti sul guestbook digitale.</span></li>
              </ul>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-amber-100 rounded-[2rem] transform rotate-3"></div>
              <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop" alt="Organizzazione" className="relative rounded-[2rem] shadow-2xl w-full object-cover aspect-[4/5]" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. CAPITOLI / TIMELINE (VECCHIA HOMEPAGE RIVISITATA) */}
      <section className="py-32 bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-10" alt="Viaggio" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-4">Un'Eredità Digitale</h2>
          <h3 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">Il matrimonio è il primo capitolo.<br/>La vostra storia continua.</h3>
          <p className="text-xl text-stone-300 max-w-3xl mx-auto mb-16 font-light">
            Con la funzione "I Vostri Capitoli", WeddingSpace cresce con la vostra famiglia. Continuate a raccogliere ricordi negli anni successivi, mantenendo lo stesso spazio sicuro per decenni.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative group overflow-hidden rounded-2xl aspect-[4/5] shadow-lg border border-white/10">
              <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" alt="Viaggio di Nozze" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-6 text-left">
                <div className="w-8 h-8 rounded-full bg-white text-stone-900 flex items-center justify-center font-bold text-sm mb-3">1</div>
                <h4 className="font-serif text-2xl font-bold text-white mb-1">Viaggio di Nozze</h4>
                <p className="text-stone-300 text-sm">Il primo grande viaggio.</p>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-2xl aspect-[4/5] shadow-lg border border-white/10">
              <img src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2069&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" alt="Anniversario" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-6 text-left">
                <div className="w-8 h-8 rounded-full bg-white text-stone-900 flex items-center justify-center font-bold text-sm mb-3">2</div>
                <h4 className="font-serif text-2xl font-bold text-white mb-1">Anniversario</h4>
                <p className="text-stone-300 text-sm">Festeggiate i traguardi.</p>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-2xl aspect-[4/5] shadow-lg border border-white/10">
              <img src="https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" alt="Nascita e Battesimo" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-6 text-left">
                <div className="w-8 h-8 rounded-full bg-white text-stone-900 flex items-center justify-center font-bold text-sm mb-3">3</div>
                <h4 className="font-serif text-2xl font-bold text-white mb-1">Nascita</h4>
                <p className="text-stone-300 text-sm">I nuovi capitoli.</p>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-2xl aspect-[4/5] shadow-lg border border-white/10">
              <img src="https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" alt="Famiglia" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-6 text-left">
                <div className="w-8 h-8 rounded-full bg-white text-stone-900 flex items-center justify-center font-bold text-sm mb-3">4</div>
                <h4 className="font-serif text-2xl font-bold text-white mb-1">Famiglia</h4>
                <p className="text-stone-300 text-sm">Ricordi nel tempo.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. IL BIVIO (LA SCELTA DEL PERCORSO) */}
      <section className="flex flex-col md:flex-row w-full min-h-[60vh]">
        {/* LATO SPOSI */}
        <div className="flex-1 relative flex flex-col justify-center items-center p-12 overflow-hidden bg-stone-900 group border-b md:border-b-0 md:border-r border-stone-800 py-24">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop" 
              alt="Matrimonio Bivio" 
              className="w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-105 transition-all duration-1000" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent" />
          </div>
          
          <div className="relative z-10 text-center max-w-sm mx-auto flex flex-col items-center">
            <div className="w-16 h-16 bg-rose-500/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-rose-500/30">
              <Heart className="w-8 h-8 text-rose-400" />
            </div>
            <h2 className="text-3xl font-serif text-white mb-4">Siete gli Sposi?</h2>
            <p className="text-stone-300 text-base mb-8 font-light">
              Create ora il vostro spazio digitale privato. Raccogliete le foto degli invitati e condividete ogni momento.
            </p>
            <Link href="/login?role=COUPLE&mode=REGISTER">
              <Button size="lg" className="h-12 px-8 rounded-full bg-white text-stone-900 hover:bg-stone-200 shadow-xl transition-all hover:scale-105 border-none font-bold">
                Inizia come Sposi
              </Button>
            </Link>
          </div>
        </div>

        {/* LATO PROFESSIONISTI */}
        <div className="flex-1 relative flex flex-col justify-center items-center p-12 overflow-hidden bg-stone-950 group py-24">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1554048612-b6a37e5cb23e?q=80&w=2070&auto=format&fit=crop" 
              alt="Fotografo Bivio" 
              className="w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-1000 grayscale group-hover:grayscale-0" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent" />
          </div>
          
          <div className="relative z-10 text-center max-w-sm mx-auto flex flex-col items-center">
            <div className="w-16 h-16 bg-amber-500/10 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-amber-500/20">
              <Camera className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-3xl font-serif text-white mb-4">Sei un Professionista?</h2>
            <p className="text-stone-400 text-base mb-8 font-light">
              Scopri il partner digitale per la tua agenzia. Genera contatti, vendi stampe e gestisci le tue gallery.
            </p>
            <Link href="/professionisti">
              <Button size="lg" className="h-12 px-8 rounded-full bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-xl transition-all hover:scale-105 border-none font-bold">
                Area Professionisti
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. PREZZI SPOSI */}
      <section className="py-24 bg-[#faf9f8]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900">Scegliete il vostro piano</h2>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto font-light">
              Nessun abbonamento mensile, nessun costo nascosto. 
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all">
              <h4 className="font-bold text-2xl text-stone-800 mb-2">Basic</h4>
              <p className="text-stone-500 mb-6 h-10">L'essenziale per il tuo evento</p>
              <div className="mb-8">
                <span className="text-4xl font-serif font-bold text-stone-900">€ 100</span><span className="text-stone-500">/anno</span>
              </div>
              <ul className="text-stone-600 space-y-4 mb-8">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> <span>Gestione di 1 Matrimonio</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> <span>Raccolta foto illimitate</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> <span>Guestbook digitale base</span></li>
              </ul>
              <Link href="/login?role=COUPLE&mode=REGISTER"><Button className="w-full bg-stone-900 hover:bg-stone-800 h-12 rounded-full text-white text-lg">Inizia Ora</Button></Link>
            </div>

            {/* Premium */}
            <div className="bg-stone-900 text-white p-8 rounded-3xl border border-stone-800 shadow-2xl relative transform md:-translate-y-4">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                Il Più Scelto
              </div>
              <h4 className="font-bold text-2xl text-white mb-2">Premium</h4>
              <p className="text-stone-400 mb-6 h-10">Estendi i ricordi nel tempo</p>
              <div className="mb-8">
                <span className="text-4xl font-serif font-bold text-white">€ 180</span><span className="text-stone-400">/anno</span>
              </div>
              <ul className="text-stone-300 space-y-4 mb-8">
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-rose-400 shrink-0" /> <span>Tutto il piano Basic</span></li>
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-rose-400 shrink-0" /> <span>Fino a 3 Capitoli della Vita</span></li>
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-rose-400 shrink-0" /> <span>Timeline e mappe interattive</span></li>
              </ul>
              <Link href="/login?role=COUPLE&mode=REGISTER"><Button className="w-full bg-rose-500 hover:bg-rose-600 text-white h-12 rounded-full font-bold text-lg">Inizia Ora</Button></Link>
            </div>

            {/* Moon */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all">
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
              <Link href="/login?role=COUPLE&mode=REGISTER"><Button variant="outline" className="w-full h-12 rounded-full border-stone-300 text-lg">Contattaci</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
