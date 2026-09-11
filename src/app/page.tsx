import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Camera, Video, Heart, ShieldCheck, Zap, Users, Gift, MessageSquare, Star, ArrowRight, Play, BookOpen, Clock, HeartHandshake, UserPlus } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans text-stone-900 selection:bg-stone-200">
      {/* HEADER */}
      <header className="absolute top-0 w-full px-6 py-6 flex flex-wrap justify-between items-center z-50">
        <div className="font-serif text-2xl font-bold tracking-tighter text-white drop-shadow-md mb-4 md:mb-0">
          Wedding<span className="font-light">Space</span>
        </div>
        <div className="flex gap-4 items-center flex-wrap">
          <Link href="/guest">
            <Button variant="ghost" className="text-stone-200 hover:text-white hover:bg-white/10 rounded-full font-medium transition-colors">
              Sei un invitato?
            </Button>
          </Link>
          <Link href="/login?role=PHOTOGRAPHER">
            <Button variant="ghost" className="text-stone-200 hover:text-white hover:bg-white/10 rounded-full font-medium transition-colors">
              Accesso Professionisti
            </Button>
          </Link>
          <Link href="/login?role=COUPLE">
            <Button className="bg-white text-stone-900 hover:bg-stone-200 rounded-full font-semibold shadow-md">
              Sposi
            </Button>
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 px-4 bg-stone-950">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop" 
            alt="Wedding Cover" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-900/40 to-[#faf9f8]"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 mt-16">
          <h1 className="text-5xl md:text-7xl font-serif font-medium tracking-tight text-white leading-[1.1] drop-shadow-lg">
            La Vostra Storia.<br/>Un Unico Spazio Digitale.
          </h1>
          <p className="text-xl text-stone-200 max-w-2xl mx-auto font-light leading-relaxed drop-shadow">
            Dimentica le app complicate. Crea il tuo sito matrimoniale, raccogli foto in alta qualità, gestisci gli invitati e continua a scrivere i capitoli della tua vita.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/login?role=COUPLE">
              <Button className="h-14 px-8 text-lg bg-white text-stone-900 rounded-full hover:bg-stone-200 hover:scale-105 transition-all shadow-2xl font-semibold">
                Crea il tuo Spazio
              </Button>
            </Link>
            <Link href="/w/demo-chiara-e-matteo">
              <Button variant="outline" className="h-14 px-8 text-lg border-white/50 bg-transparent text-white hover:bg-white/20 hover:text-white rounded-full transition-all flex items-center gap-2 backdrop-blur-sm">
                <Play className="w-5 h-5 fill-current" /> Vedi una Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* COME FUNZIONA SECTION */}
      <section className="py-20 bg-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-50/40 via-white to-white pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-2">Semplicità assoluta</h2>
            <h3 className="text-3xl md:text-4xl font-serif text-stone-900">Come Funziona</h3>
          </div>
          
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Timeline Line (Desktop Only) */}
            <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-transparent via-amber-200 to-transparent"></div>

            <div className="text-center space-y-4">
              <div className="relative z-10 w-20 h-20 bg-stone-900 border-2 border-amber-300/60 ring-4 ring-amber-50 rounded-full flex items-center justify-center mx-auto text-3xl font-serif text-amber-200 shadow-xl shadow-amber-900/10">1</div>
              <h4 className="text-xl font-bold font-serif text-stone-900">Crea</h4>
              <p className="text-stone-500 text-sm">Gli sposi o il fotografo creano lo spazio digitale del matrimonio in 2 minuti.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="relative z-10 w-20 h-20 bg-stone-900 border-2 border-amber-300/60 ring-4 ring-amber-50 rounded-full flex items-center justify-center mx-auto text-3xl font-serif text-amber-200 shadow-xl shadow-amber-900/10">2</div>
              <h4 className="text-xl font-bold font-serif text-stone-900">Invita</h4>
              <p className="text-stone-500 text-sm">Condividi l'accesso agli ospiti, gestisci le conferme e assegna i tavoli.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="relative z-10 w-20 h-20 bg-stone-900 border-2 border-amber-300/60 ring-4 ring-amber-50 rounded-full flex items-center justify-center mx-auto text-3xl font-serif text-amber-200 shadow-xl shadow-amber-900/10">3</div>
              <h4 className="text-xl font-bold font-serif text-stone-900">Raccogli</h4>
              <p className="text-stone-500 text-sm">Durante l'evento, gli ospiti scattano foto e lasciano dediche via QR Code.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="relative z-10 w-20 h-20 bg-stone-900 border-2 border-amber-300/60 ring-4 ring-amber-50 rounded-full flex items-center justify-center mx-auto text-3xl font-serif text-amber-200 shadow-xl shadow-amber-900/10">4</div>
              <h4 className="text-xl font-bold font-serif text-stone-900">Continua</h4>
              <p className="text-stone-500 text-sm">Il matrimonio è solo l'inizio. Aggiungi capitoli come Viaggio, Nascita, Anniversario.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEZIONE SPOSI */}
      <section className="py-24 bg-[#faf9f8]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-sm font-bold text-rose-500 uppercase tracking-widest">Per gli Sposi</h2>
              <h3 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight">Il vostro giorno, organizzato e protetto.</h3>
              <p className="text-lg text-stone-600">
                WeddingSpace non è solo un sito web, ma il quartier generale del vostro matrimonio.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-rose-100 p-2 rounded-full"><Users className="w-5 h-5 text-rose-600"/></div>
                  <div>
                    <strong className="block text-stone-900 text-lg">Gestione Ospiti e Tavoli</strong>
                    <span className="text-stone-500 text-sm">Raccogli RSVP, intolleranze alimentari e assegna i posti in modo intelligente.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-rose-100 p-2 rounded-full"><Camera className="w-5 h-5 text-rose-600"/></div>
                  <div>
                    <strong className="block text-stone-900 text-lg">QR Code e Raccolta Media</strong>
                    <span className="text-stone-500 text-sm">Nessuna app da scaricare. Gli ospiti inquadrano il QR Code sui tavoli e inviano foto in tempo reale.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-rose-100 p-2 rounded-full"><Clock className="w-5 h-5 text-rose-600"/></div>
                  <div>
                    <strong className="block text-stone-900 text-lg">Programma e Mappe</strong>
                    <span className="text-stone-500 text-sm">Mostra agli invitati gli orari e le indicazioni stradali per chiesa e ricevimento.</span>
                  </div>
                </li>
              </ul>
              
              <Link href="/login?role=COUPLE">
                <Button className="mt-4 bg-stone-900 text-white rounded-full px-8 py-6 text-lg hover:bg-stone-800 transition-all flex items-center gap-2">
                  Esplora l'Area Sposi <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-rose-100 rounded-[2rem] transform rotate-3"></div>
              <img src="https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=2070&auto=format&fit=crop" alt="Spazio Sposi" className="relative rounded-[2rem] shadow-xl w-full object-cover aspect-[4/5]" />
            </div>
          </div>
        </div>
      </section>

      {/* DOPO IL MATRIMONIO (Crucial Section) */}
      <section className="py-32 bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-20" alt="Viaggio" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-sm font-bold text-yellow-500 uppercase tracking-widest mb-4">Un'Eredità Digitale</h2>
          <h3 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">Il matrimonio è il primo capitolo.<br/>La vostra storia continua.</h3>
          <p className="text-xl text-stone-300 max-w-3xl mx-auto mb-16 font-light">
            Con la funzione "I Vostri Capitoli", WeddingSpace cresce con la vostra famiglia. Continuate a raccogliere ricordi negli anni successivi, mantenendo lo stesso spazio sicuro.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative group overflow-hidden rounded-2xl aspect-[4/5] shadow-lg border border-white/10">
              <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90" alt="Viaggio di Nozze" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/10 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-6 text-left">
                <h4 className="font-serif text-2xl font-bold text-white mb-2">Viaggio di Nozze</h4>
                <p className="text-stone-300 text-sm">Il primo grande viaggio insieme.</p>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-2xl aspect-[4/5] shadow-lg border border-white/10">
              <img src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2069&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90" alt="Anniversario" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/10 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-6 text-left">
                <h4 className="font-serif text-2xl font-bold text-white mb-2">Anniversario</h4>
                <p className="text-stone-300 text-sm">Festeggiate ogni traguardo.</p>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-2xl aspect-[4/5] shadow-lg border border-white/10">
              <img src="https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90" alt="Nascita e Battesimo" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/10 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-6 text-left">
                <h4 className="font-serif text-2xl font-bold text-white mb-2">Nascita</h4>
                <p className="text-stone-300 text-sm">Nuovi capitoli della famiglia.</p>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-2xl aspect-[4/5] shadow-lg border border-white/10">
              <img src="https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90" alt="Famiglia" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/10 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-6 text-left">
                <h4 className="font-serif text-2xl font-bold text-white mb-2">Famiglia</h4>
                <p className="text-stone-300 text-sm">Ricordi che crescono con voi.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEZIONE INVITATI */}
      <section className="py-24 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Per gli Invitati</h2>
          <h3 className="text-4xl font-serif text-stone-900 mb-8">Un'esperienza su misura per chi amate.</h3>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto mb-12">
            Ogni invitato accede tramite un link unico. Potrà vedere solo i capitoli a cui è stato autorizzato, visualizzare il proprio tavolo, e sfogliare le foto del matrimonio in uno spazio privato, sicuro e senza social network invadenti.
          </p>
          <Link href="/guest">
            <Button variant="outline" className="border-stone-300 text-stone-800 rounded-full px-8 py-6 text-lg hover:bg-stone-50 transition-all">
              Esplora l'esperienza Invitato
            </Button>
          </Link>
        </div>
      </section>

      {/* SEZIONE PROFESSIONISTI */}
      <section className="py-24 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute -inset-4 bg-stone-300 rounded-[2rem] transform -rotate-3"></div>
              <img src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=2070&auto=format&fit=crop" alt="Fotografi e Videomaker" className="relative rounded-[2rem] shadow-xl w-full object-cover aspect-[4/5]" />
            </div>
            
            <div className="order-1 lg:order-2 space-y-8">
              <h2 className="text-sm font-bold text-stone-500 uppercase tracking-widest">SaaS Per Fotografi e Videomaker</h2>
                <h3 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight">Digitalizza la tua consegna. Fatti trovare da nuovi clienti.</h3>
                <p className="text-lg text-stone-600">
                  Trasforma ogni evento in una macchina trova-clienti. Invece di inviare un semplice link Google Drive, porta il tuo brand e i tuoi contatti sugli smartphone di centinaia di invitati. Crea un'esperienza premium per gli sposi e posizionati nella nostra vetrina esclusiva.
                </p>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-white p-2 rounded-full shadow-sm"><UserPlus className="w-5 h-5 text-stone-800"/></div>
                  <div>
                    <strong className="block text-stone-900 text-lg">Profilo Pubblico (Vetrina)</strong>
                    <span className="text-stone-500 text-sm">Ottieni la tua pagina pubblica con portfolio, biografia, contatti WhatsApp e recensioni.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-white p-2 rounded-full shadow-sm"><Star className="w-5 h-5 text-stone-800"/></div>
                  <div>
                    <strong className="block text-stone-900 text-lg">Consegna Album Interattiva</strong>
                    <span className="text-stone-500 text-sm">Carica i media per gli sposi. Loro selezionano le foto per l'album e te le approvano direttamente dalla piattaforma.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-white p-2 rounded-full shadow-sm"><Zap className="w-5 h-5 text-stone-800"/></div>
                  <div>
                    <strong className="block text-stone-900 text-lg">Lead Generation (Premium)</strong>
                    <span className="text-stone-500 text-sm">I fotografi Premium vengono consigliati agli sposi che creano il sito prima del matrimonio.</span>
                  </div>
                </li>
              </ul>
              
              <Link href="/login?role=PHOTOGRAPHER">
                <Button className="mt-4 bg-stone-900 text-white rounded-full px-8 py-6 text-lg hover:bg-stone-800 transition-all flex items-center gap-2">
                  Area Professionisti <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SEZIONE PIANI */}
      <section className="py-24 bg-white border-t border-stone-100">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl font-serif text-stone-900">Piani trasparenti per ogni esigenza</h2>
          <p className="text-lg text-stone-600">
            Che tu sia una coppia o un professionista, abbiamo il piano perfetto per te. Puoi iniziare gratuitamente e sbloccare le funzioni Premium solo se ne hai davvero bisogno.
          </p>
          <div className="pt-8">
             <Link href="/dashboard/billing">
                <Button variant="outline" className="h-14 px-8 text-lg border-stone-300 text-stone-800 rounded-full hover:bg-stone-100 transition-all">
                  Scopri i Piani
                </Button>
             </Link>
          </div>
        </div>
      </section>

      {/* FOOTER RISCRITTO DA ZERO E ORDINATO */}
      <footer className="bg-stone-950 text-stone-400 py-16 px-6 text-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4">
            <h4 className="font-serif text-xl text-white">WeddingSpace</h4>
            <p className="text-stone-500">
              La piattaforma che unisce sposi, invitati e professionisti in un unico racconto digitale, dal matrimonio per tutta la vita.
            </p>
          </div>
          
          <div>
            <h5 className="font-bold text-white mb-4 uppercase tracking-widest text-xs">Aree Piattaforma</h5>
            <ul className="space-y-3">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/login?role=COUPLE" className="hover:text-white transition-colors">Accesso Sposi</Link></li>
              <li><Link href="/guest" className="hover:text-white transition-colors">Accesso Invitati</Link></li>
              <li><Link href="/login?role=PHOTOGRAPHER" className="hover:text-white transition-colors">Accesso Professionisti</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white mb-4 uppercase tracking-widest text-xs">Note Legali</h5>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Termini e Condizioni</Link></li>
              <li><Link href="/cookie" className="hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white mb-4 uppercase tracking-widest text-xs">Supporto</h5>
            <ul className="space-y-3">
              <li><Link href="mailto:support@weddingspace.com" className="hover:text-white transition-colors">Contatti</Link></li>
              <li><Link href="/login?role=ADMIN" className="text-sky-400 hover:text-sky-300 transition-colors">Accesso Amministratore</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="max-w-7xl mx-auto border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-stone-600">
          <p>© {new Date().getFullYear()} WeddingSpace. Tutti i diritti riservati.</p>
          <p className="mt-4 md:mt-0">Fatto con ❤️ in Italia.</p>
        </div>
      </footer>
    </div>
  );
}
