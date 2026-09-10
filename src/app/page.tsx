import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Camera, Image as ImageIcon, Video, Heart, ShieldCheck, Zap, Users, Gift, MessageSquare, Star, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-stone-200">
      {/* HEADER */}
      <header className="absolute top-0 w-full px-6 py-6 flex justify-between items-center z-50">
        <div className="font-serif text-2xl font-bold tracking-tighter text-white drop-shadow-md">
          Wedding<span className="font-light">Space</span>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/login">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20 rounded-full font-medium transition-colors">
              Accesso Professionisti
            </Button>
          </Link>
          <Link href="/login">
            <Button className="bg-white/90 backdrop-blur-sm text-stone-900 hover:bg-white rounded-full font-semibold shadow-lg">
              Accedi
            </Button>
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop" 
            alt="Wedding background" 
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-stone-900/50 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-900/20 to-stone-50" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium tracking-wide">
            <Star className="w-4 h-4 text-yellow-300" />
            IL PORTALE PER SPOSI E PROFESSIONISTI
          </div>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 drop-shadow-2xl leading-[1.1]">
            Il tuo matrimonio,<br /> <span className="font-light italic text-stone-200">un ricordo corale.</span>
          </h1>
          <p className="text-lg md:text-2xl text-stone-100 mb-10 font-light drop-shadow-md max-w-3xl mx-auto leading-relaxed">
            Un'unica piattaforma digitale elegante e sicura. Gli sposi raccolgono foto, dediche e gestiscono il loro grande giorno. I professionisti offrono un servizio Premium indimenticabile.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Esplora Sposi */}
            <form action={async () => {
              "use server"
              const { loginAction } = await import("@/app/actions");
              await loginAction("COUPLE");
              const { redirect } = await import("next/navigation");
              redirect("/couple/demo-chiara-e-matteo");
            }}>
              <Button size="lg" className="group h-14 px-8 text-lg rounded-full bg-white text-stone-900 hover:bg-stone-100 transition-all shadow-xl font-semibold flex items-center gap-2">
                Esplora lato Sposi
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
            
            {/* Esplora Invitati */}
            <Link href="/w/demo-chiara-e-matteo">
              <Button size="lg" variant="outline" className="group h-14 px-8 text-lg rounded-full bg-stone-900/40 text-white border-white/40 hover:bg-stone-900/60 hover:text-white backdrop-blur-sm transition-all shadow-xl font-semibold flex items-center gap-2">
                Esplora lato Invitati
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SEZIONE SPOSI */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-stone-500 font-bold tracking-widest text-sm uppercase mb-3">Per i Futuri Sposi</h2>
          <h3 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6">Tutto il tuo matrimonio, <br className="hidden md:block"/> in un unico spazio privato.</h3>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Dall'organizzazione alla raccolta dei ricordi, fino agli anniversari futuri. WeddingSpace è il tuo compagno digitale per una giornata senza pensieri.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: <ImageIcon className="w-6 h-6"/>, title: "Galleria Live & QR", desc: "Gli invitati scansionano il QR code e caricano foto e video in tempo reale." },
            { icon: <Heart className="w-6 h-6"/>, title: "La Nostra Storia", desc: "Racconta il tuo amore in una timeline interattiva: dal primo incontro al 'Sì'." },
            { icon: <Users className="w-6 h-6"/>, title: "Gestione Invitati & Tavoli", desc: "Tieni traccia delle conferme, assegna i posti e gestisci le intolleranze alimentari." },
            { icon: <MessageSquare className="w-6 h-6"/>, title: "Guestbook & Dediche", desc: "Un diario digitale dove gli amici possono lasciarvi un messaggio che resterà per sempre." },
            { icon: <Gift className="w-6 h-6"/>, title: "Lista Nozze & Regali", desc: "Inserisci l'IBAN o il link alla lista nozze in modo elegante e discreto." },
            { icon: <ShieldCheck className="w-6 h-6"/>, title: "Privacy e Moderazione", desc: "Decidi tu quali foto rendere pubbliche. Nessuna immagine finisce sui social senza il tuo permesso." }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-stone-900 mb-6 group-hover:scale-110 group-hover:bg-stone-900 group-hover:text-white transition-all duration-300">
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold text-stone-900 mb-3">{feature.title}</h4>
              <p className="text-stone-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SEZIONE PROFESSIONISTI (SaaS) */}
      <section className="py-24 px-6 bg-stone-900 text-stone-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-500 via-stone-900 to-stone-900"></div>
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-stone-400 font-bold tracking-widest text-sm uppercase mb-3">Area Professionisti</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">Perché i migliori professionisti scelgono WeddingSpace?</h3>
            <p className="text-lg text-stone-300 mb-8 leading-relaxed">
              Non è solo un servizio per gli sposi, ma uno strumento di marketing e fidelizzazione per te. Consegna i tuoi scatti in un portale premium, mettiti in vetrina e ricevi nuovi incarichi.
            </p>
            <ul className="space-y-5 mb-10">
              {[
                "Vetrina pubblica: Fatti trovare da futuri sposi nella tua zona.",
                "Portfolio e Servizi: Mostra i tuoi pacchetti e le tue recensioni.",
                "Connessione diretta: Chat integrata per comunicare con gli sposi.",
                "Piano Premium: Abbonati per visibilità prioritaria e servizi illimitati."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-yellow-400 shrink-0" />
                  <span className="text-stone-200 font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/login">
              <Button size="lg" className="bg-white text-stone-900 hover:bg-stone-200 rounded-full h-14 px-8 text-lg font-semibold shadow-xl">
                Crea il tuo Profilo Pro
              </Button>
            </Link>
          </div>
          
          <div className="relative">
            {/* Decorative mockup frame */}
            <div className="bg-stone-800 rounded-2xl p-4 shadow-2xl border border-stone-700 transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=2070&auto=format&fit=crop" 
                alt="Dashboard Mockup" 
                className="rounded-xl opacity-90 w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-stone-50 border-t border-stone-200 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <div className="font-serif text-2xl font-bold tracking-tighter text-stone-900 mb-4">
              Wedding<span className="font-light">Space</span>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed mb-6">
              La piattaforma digitale che trasforma il matrimonio in un ricordo condiviso, connettendo sposi, invitati e professionisti in un unico ecosistema elegante.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-stone-900 mb-4 uppercase tracking-wider text-xs">Piattaforma</h4>
            <ul className="space-y-3 text-sm text-stone-600">
              <li><Link href="/w/demo-chiara-e-matteo" className="hover:text-stone-900 transition-colors">Demo Invitati</Link></li>
              <li>
                <form action={async () => {
                  "use server"
                  const { loginAction } = await import("@/app/actions");
                  await loginAction("COUPLE");
                  const { redirect } = await import("next/navigation");
                  redirect("/couple/demo-chiara-e-matteo");
                }}>
                  <button type="submit" className="hover:text-stone-900 transition-colors">Demo Sposi</button>
                </form>
              </li>
              <li><Link href="/login" className="hover:text-stone-900 transition-colors">Area Professionisti</Link></li>
              <li><Link href="/login" className="hover:text-stone-900 transition-colors">Accedi</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 mb-4 uppercase tracking-wider text-xs">Legale & Privacy</h4>
            <ul className="space-y-3 text-sm text-stone-600">
              <li><Link href="/privacy" className="hover:text-stone-900 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-stone-900 transition-colors">Termini e Condizioni</Link></li>
              <li><Link href="#" className="hover:text-stone-900 transition-colors">Cookie Policy</Link></li>
              <li><Link href="#" className="hover:text-stone-900 transition-colors">GDPR Compliance</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 mb-4 uppercase tracking-wider text-xs">Contatti</h4>
            <ul className="space-y-3 text-sm text-stone-600">
              <li>info@weddingspace.com</li>
              <li>Assistenza Sposi</li>
              <li>Supporto Professionisti</li>
              <li>Italia</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-stone-200 text-center text-stone-500 text-sm">
          &copy; {new Date().getFullYear()} Top Website. Tutti i diritti riservati.
        </div>
      </footer>
    </div>
  );
}
