import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Camera, Search, MapPin, Users, ArrowRight, Briefcase, Calendar, Star, Menu } from "lucide-react";
import Footer from "@/components/Footer";
import PortalSearch from "@/components/PortalSearch";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans text-stone-900 flex flex-col">
      
      {/* NAVBAR (Portal Style) */}
      <nav className="absolute top-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-gradient-to-b from-stone-900/80 to-transparent">
        <div className="flex items-center gap-2 text-white font-serif text-2xl drop-shadow-md">
          <Heart className="w-6 h-6 text-rose-500" />
          WeddingSpace
        </div>
        <div className="hidden md:flex items-center gap-8 text-[13px] font-semibold tracking-widest text-white/95 drop-shadow-md">
          <Link href="#directory" className="hover:text-rose-300 transition-colors">TROVA FORNITORI</Link>
          <Link href="#capitoli" className="hover:text-rose-300 transition-colors">I CAPITOLI</Link>
          <Link href="/professionisti" className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> SEI UN PROFESSIONISTA?
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden md:block">
            <Button className="bg-white text-stone-900 hover:bg-stone-200 rounded-full font-bold px-6">
              Accedi
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden text-white"><Menu /></Button>
        </div>
      </nav>

      {/* 1. HERO PORTALE CON MOTORE DI RICERCA */}
      <section className="relative pt-48 pb-32 px-4 flex flex-col items-center justify-center text-center overflow-hidden min-h-[85vh]">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-60" alt="Matrimonio Ecosistema" />
          <div className="absolute inset-0 bg-stone-950/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#faf9f8]" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-white w-full">
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-6 drop-shadow-xl leading-tight">
            Il tuo <span className="italic font-light text-rose-300">Ecosistema</span> <br/>per eventi indimenticabili.
          </h1>
          <p className="text-xl md:text-2xl text-stone-100 max-w-3xl mx-auto mb-12 font-light drop-shadow-md">
            Trova i migliori professionisti, crea lo spazio digitale per le tue foto e condividi ogni capitolo della tua storia. Tutto in un'unica piattaforma.
          </p>
          
          {/* BARRA DI RICERCA INTERATTIVA */}
          <PortalSearch />
          
          {/* QUICK CHIPS */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <span className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/20 hover:bg-white/20 cursor-pointer transition-colors">📸 Fotografi</span>
            <span className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/20 hover:bg-white/20 cursor-pointer transition-colors">🏰 Location</span>
            <span className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/20 hover:bg-white/20 cursor-pointer transition-colors">🎵 Musica</span>
            <span className="bg-rose-500/80 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold border border-rose-400 hover:bg-rose-500 cursor-pointer transition-colors shadow-lg shadow-rose-500/20">✨ Crea il tuo Spazio Sposi</span>
          </div>
        </div>
      </section>

      {/* 2. I BENEFIT PER GLI SPOSI (PORTATO IN ALTO) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-rose-500 uppercase tracking-widest mb-4">L'Area Sposi</h2>
            <h3 className="text-3xl md:text-5xl font-serif text-stone-900 mb-6">Tutto quello che vi serve per un evento perfetto</h3>
            <p className="text-xl text-stone-500 max-w-2xl mx-auto font-light">
              Dimentica i vecchi siti per matrimoni. Ti diamo una vera app web per gestire ospiti, ricordi e tavoli in un unico posto.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-[#faf9f8] p-8 rounded-3xl border border-stone-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Camera className="w-6 h-6 text-rose-500" />
              </div>
              <h4 className="font-bold text-xl text-stone-900 mb-3">Raccolta foto dagli invitati</h4>
              <p className="text-stone-600 leading-relaxed">
                Gli invitati scansionano un QR code e caricano le foto in diretta senza scaricare app. Raccogli istantaneamente ricordi inediti.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-[#faf9f8] p-8 rounded-3xl border border-stone-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Users className="w-6 h-6 text-rose-500" />
              </div>
              <h4 className="font-bold text-xl text-stone-900 mb-3">Disposizione tavoli e RSVP</h4>
              <p className="text-stone-600 leading-relaxed">
                Gestisci le conferme degli ospiti e crea la mappa interattiva dei tavoli per il ristorante direttamente dal tuo spazio privato.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-[#faf9f8] p-8 rounded-3xl border border-stone-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Heart className="w-6 h-6 text-rose-500" />
              </div>
              <h4 className="font-bold text-xl text-stone-900 mb-3">Guestbook e Video-dediche</h4>
              <p className="text-stone-600 leading-relaxed">
                Lascia che parenti e amici registrino messaggi vocali, dediche scritte o brevi video-auguri che conserverai per sempre.
              </p>
            </div>
            {/* Feature 4 */}
            <div className="bg-[#faf9f8] p-8 rounded-3xl border border-stone-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Star className="w-6 h-6 text-rose-500" />
              </div>
              <h4 className="font-bold text-xl text-stone-900 mb-3">Gestione completa dell'album</h4>
              <p className="text-stone-600 leading-relaxed">
                Il tuo fotografo carica qui le foto ufficiali in alta risoluzione. Decidi tu quali foto rendere pubbliche o nascondere agli ospiti.
              </p>
            </div>
            {/* Feature 5 */}
            <div className="bg-[#faf9f8] p-8 rounded-3xl border border-stone-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <MapPin className="w-6 h-6 text-rose-500" />
              </div>
              <h4 className="font-bold text-xl text-stone-900 mb-3">Inviti digitali interattivi</h4>
              <p className="text-stone-600 leading-relaxed">
                Invia partecipazioni digitali tramite WhatsApp o Email con mappe, programma della giornata e link diretto per l'RSVP.
              </p>
            </div>
            {/* Feature 6 */}
            <div className="bg-[#faf9f8] p-8 rounded-3xl border border-stone-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-rose-500/20">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-xl text-stone-900 mb-3">Una pagina tutta vostra</h4>
              <p className="text-stone-600 leading-relaxed">
                La vostra storia racchiusa in una pagina web bellissima e personalizzata, protetta da password per la massima privacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CAPITOLI / TIMELINE (L'EREDITÀ DIGITALE) */}
      <section className="py-32 bg-stone-900 text-white relative overflow-hidden" id="capitoli">
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-stone-950" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-4">L'Ecosistema Cresce con Te</h2>
          <h3 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">Il matrimonio è il primo capitolo.<br/>La vostra storia continua.</h3>
          <p className="text-xl text-stone-300 max-w-3xl mx-auto mb-16 font-light">
            Da noi non prenoti solo il fotografo del matrimonio. WeddingSpace è una timeline della tua vita. Riapri il tuo spazio per ogni nuovo grande traguardo.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative group overflow-hidden rounded-2xl aspect-[4/5] shadow-lg border border-white/10">
              <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100 mix-blend-overlay" alt="Viaggio di Nozze" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-6 text-left">
                <div className="w-8 h-8 rounded-full bg-white text-stone-900 flex items-center justify-center font-bold text-sm mb-3">1</div>
                <h4 className="font-serif text-2xl font-bold text-white mb-1">Matrimonio</h4>
                <p className="text-stone-300 text-sm">Il giorno perfetto.</p>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-2xl aspect-[4/5] shadow-lg border border-white/10">
              <img src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2069&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100 mix-blend-overlay" alt="Anniversario" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-6 text-left">
                <div className="w-8 h-8 rounded-full bg-white text-stone-900 flex items-center justify-center font-bold text-sm mb-3">2</div>
                <h4 className="font-serif text-2xl font-bold text-white mb-1">Anniversari</h4>
                <p className="text-stone-300 text-sm">Rinnova la magia.</p>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-2xl aspect-[4/5] shadow-lg border border-white/10">
              <img src="https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100 mix-blend-overlay" alt="Nascita e Battesimo" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-6 text-left">
                <div className="w-8 h-8 rounded-full bg-white text-stone-900 flex items-center justify-center font-bold text-sm mb-3">3</div>
                <h4 className="font-serif text-2xl font-bold text-white mb-1">Battesimo</h4>
                <p className="text-stone-300 text-sm">Nuove vite, nuovi ricordi.</p>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-2xl aspect-[4/5] shadow-lg border border-white/10">
              <img src="https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100 mix-blend-overlay" alt="Famiglia" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-6 text-left">
                <div className="w-8 h-8 rounded-full bg-white text-stone-900 flex items-center justify-center font-bold text-sm mb-3">4</div>
                <h4 className="font-serif text-2xl font-bold text-white mb-1">Feste Private</h4>
                <p className="text-stone-300 text-sm">Un album infinito.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. IL BIVIO (PORTATO IN BASSO) */}
      <section className="py-24 bg-[#faf9f8]" id="directory">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">Un unico portale, due mondi interconnessi.</h2>
            <p className="text-stone-500 max-w-2xl mx-auto">La piattaforma che unisce chi celebra l'amore e chi lavora per renderlo perfetto.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl mx-auto">
            {/* CARD SPOSI */}
            <div className="flex-1 relative flex flex-col justify-end p-10 overflow-hidden rounded-[2.5rem] min-h-[400px] group shadow-xl">
              <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop" alt="Sposi Bivio" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent" />
              </div>
              <div className="relative z-10 text-left">
                <div className="w-14 h-14 bg-rose-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-rose-500/30">
                  <Heart className="w-7 h-7 text-rose-400" />
                </div>
                <h2 className="text-4xl font-serif text-white mb-3">Siete gli Sposi?</h2>
                <p className="text-stone-200 text-lg mb-8 font-light max-w-sm">
                  Cercate i fornitori, raccogliete le foto degli invitati e condividete l'organizzazione.
                </p>
                <Link href="/login?role=COUPLE&mode=REGISTER">
                  <Button size="lg" className="h-14 px-8 rounded-full bg-white text-stone-900 hover:bg-stone-200 shadow-xl transition-all hover:scale-105 border-none font-bold">
                    Crea Area Sposi
                  </Button>
                </Link>
              </div>
            </div>

            {/* CARD PROFESSIONISTI */}
            <div className="flex-1 relative flex flex-col justify-end p-10 overflow-hidden rounded-[2.5rem] min-h-[400px] group shadow-xl">
              <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop" alt="Pro Bivio" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent" />
              </div>
              <div className="relative z-10 text-left">
                <div className="w-14 h-14 bg-amber-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-amber-500/30">
                  <Camera className="w-7 h-7 text-amber-400" />
                </div>
                <h2 className="text-4xl font-serif text-white mb-3">Sei un Professionista?</h2>
                <p className="text-stone-300 text-lg mb-8 font-light max-w-sm">
                  Appari nelle ricerche, acquisisci i contatti degli invitati e vendi i tuoi servizi.
                </p>
                <Link href="/professionisti">
                  <Button size="lg" className="h-14 px-8 rounded-full bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-xl transition-all hover:scale-105 border-none font-bold">
                    Area Partner
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA PREZZI */}
      <section className="py-24 bg-white border-t border-stone-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6">Trasparenza totale. Nessun costo nascosto.</h2>
          <p className="text-xl text-stone-600 mb-10 font-light">
            Abbiamo creato piani su misura sia per i futuri sposi che per i professionisti del settore. Scopri tutte le funzionalità incluse e scegli l'opzione perfetta per te.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/prezzi">
              <Button size="lg" className="w-full sm:w-auto h-14 px-10 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-lg shadow-xl">
                Scopri i nostri Piani <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 rounded-full border-stone-300 text-stone-900 text-lg">
                Accedi o Registrati
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
