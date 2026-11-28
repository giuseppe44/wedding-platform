import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { GentiLunaBrand } from "@/components/GentiLunaLogo";
import {
  Camera,
  QrCode,
  ShieldCheck,
  Briefcase,
  ArrowRight,
  Lock,
  Sparkles,
  Users,
  Layers,
  Award,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Funzioni Lato Professionisti – Consegna HD, Vetrina e Clienti a 0% Commissioni",
  description:
    "Scopri come fotografi, videomaker, wedding planner e location usano GentiLuna: vetrina verificata, consegna gallerie HD, richieste preventivo tracciate a 0% commissioni e visibilità via QR Code.",
  alternates: {
    canonical: "/funzioni-professionisti",
  },
};

const CORE_PRO_FEATURES = [
  {
    icon: Award,
    title: "Vetrina Verificata nella Directory Nazionale",
    badge: "Alta Visibilità",
    text: "Mostra logo, copertina, biografia, zona operativa, portfolio fino a 15 immagini ad alta risoluzione (fino a 25 MB, inclusi HEIC e TIFF), video e servizi.",
  },
  {
    icon: Camera,
    title: "Spazi Sposi & Consegna Album in HD",
    badge: "Zero compressione",
    text: "Genera in pochi clic lo spazio digitale per i tuoi clienti e carica gallerie ufficiali divise per album e capitoli, scaricabili dagli sposi in formato ZIP.",
  },
  {
    icon: QrCode,
    title: "Il Tuo Brand davanti a Tutti gli Invitati",
    badge: "Passaparola Live",
    text: "Ogni volta che gli ospiti al tavolo inquadrano il QR Code del matrimonio per inviare o guardare le foto, scoprono che sei tu il professionista ufficiale.",
  },
  {
    icon: ShieldCheck,
    title: "Preventivi Tracciati, Chat Protetta & 0% Commissioni",
    badge: "0% Commissioni",
    text: "Niente aste al ribasso né percentuali sui contratti: i tuoi recapiti sono protetti dai bot ma ogni richiesta arriva via email e in chat interna tracciata.",
  },
  {
    icon: Users,
    title: "Collaborazione sull'Evento per Planner & Location",
    badge: "Team Integrato",
    text: "Affianca le coppie nell'organizzazione operativa: orari, liste presenze RSVP, note alimentari, mappatura tavoli e documenti caricabili nello spazio condiviso.",
  },
  {
    icon: Layers,
    title: "Soluzioni Scalabili & White-Label",
    badge: "Entry → Diamond",
    text: "Parti dal Founders Club in offerta lancio (49 € per 12 mesi invece di 299 €) fino a pacchetti sposi in stock e personalizzazione brand dedicata nel piano Diamond.",
  },
];

const TEASER_PRO_PREVIEWS = [
  {
    title: "Sistema Guidato Conversione Invitati → Nuovi Clienti",
    summary:
      "Meccaniche interne studiate per trasformare i partecipanti dell'evento in contatti qualificati per futuri matrimoni, battesimi e servizi studio.",
  },
  {
    title: "Flussi Riservati di Collaborazione Coppia–Professionista",
    summary:
      "Strumenti operativi interni all'area partner per assegnazione rapida degli sposi, moderazione congiunta e gestione coordinata delle consegne.",
  },
  {
    title: "Coach Interattivo di Ottimizzazione Vetrina",
    summary:
      "Indicatori smart e suggerimenti su misura in dashboard che evidenziano cosa completare per aumentare la resa del profilo nella tua provincia.",
  },
  {
    title: "Funzioni Commerciali & Upsell Riservate ai Partner",
    summary:
      "Strumenti di presentazione servizi, proposte dedicate in galleria e futuri moduli di espansione disponibili solo a chi accede con account Partner.",
  },
];

export default function FunzioniProfessionistiPage() {
  return (
    <div className="min-h-screen bg-stone-950 font-sans text-stone-100 flex flex-col overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 w-full bg-stone-950/90 backdrop-blur-md border-b border-stone-800 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="shrink-0">
            <GentiLunaBrand theme="dark" variant="pro" badge="PRO" />
          </Link>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium">
            <Link href="/funzioni-sposi" className="text-stone-300 hover:text-white px-2.5 py-1.5 rounded-full hover:bg-stone-800 transition-colors">
              Funzioni Sposi &amp; Eventi
            </Link>
            <Link href="/blog" className="text-stone-300 hover:text-white px-2.5 py-1.5 rounded-full hover:bg-stone-800 transition-colors">
              Blog
            </Link>
            <Link href="/professionisti#pricing" className="text-stone-300 hover:text-white px-2.5 py-1.5 rounded-full hover:bg-stone-800 transition-colors">
              Piani PRO
            </Link>
            <Link href="/login?role=PHOTOGRAPHER&mode=REGISTER">
              <Button className="rounded-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-4 sm:px-6 h-9 sm:h-10 text-xs sm:text-sm">
                Area Professionisti
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="relative py-16 sm:py-24 px-4 sm:px-6 text-center overflow-hidden border-b border-stone-800">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-stone-950 to-rose-500/10 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
            <Briefcase className="w-3.5 h-3.5" /> Funzioni Lato Professionisti
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif leading-tight text-white">
            Consegne impeccabili ed{" "}
            <span className="text-amber-400 italic font-light">esposizione reale in sala</span>, a 0% commissioni.
          </h1>
          <p className="text-base sm:text-xl text-stone-300 font-light max-w-2xl mx-auto leading-relaxed">
            Una selezione chiara degli strumenti dedicati a fotografi, videomaker, wedding planner, location e fornitori — insieme a un&apos;anticipazione di ciò che sblocchi solo in Dashboard Partner.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/professionisti#founders" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto min-h-12 h-auto py-3 px-7 rounded-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm sm:text-base whitespace-normal text-center leading-snug">
                <span>Promo Founders Club (€ 49 / 12 mesi)</span>
                <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
              </Button>
            </Link>
            <Link href="/login?role=PHOTOGRAPHER&mode=REGISTER" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto min-h-12 h-auto py-3 px-7 rounded-full bg-transparent border-stone-700 text-stone-200 hover:bg-stone-800 text-sm sm:text-base whitespace-normal text-center leading-snug">
                Registrati come Partner
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* VISUAL SHOWCASE PROFESSIONISTI */}
      <section className="pt-12 sm:pt-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl overflow-hidden border border-stone-800 bg-stone-900 shadow-lg">
            <div className="aspect-[16/9]">
              <img
                src="/press/GentiLuna_Showcase_Pro.jpg"
                alt="Consegna Album HD, Vetrina Pro, Preventivi Protetti e 0% Commissioni"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5">
              <p className="font-serif font-bold text-white text-lg">Consegna Album HD &amp; Preventivi a 0% Commissioni</p>
              <p className="text-sm text-stone-400 font-light mt-1">Consegna elegante ai tuoi sposi con vetrina verificata e richieste tracciate.</p>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden border border-stone-800 bg-stone-900 shadow-lg">
            <div className="aspect-[16/9]">
              <img
                src="/press/GentiLuna_Showcase_Planner.jpg"
                alt="Gestione Tavoli, Conferme RSVP, Note Allergie e Team Fornitori"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5">
              <p className="font-serif font-bold text-white text-lg">Coordinamento Tavoli, RSVP &amp; Team Fornitori</p>
              <p className="text-sm text-stone-400 font-light mt-1">Ideale per Wedding Planner, Location e Studi che collaborano sullo spazio dell&apos;evento.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE PRO FUNCTIONS */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-serif text-white mb-4">
            Alcune funzioni principali per il tuo business
          </h2>
          <p className="text-stone-400 text-base sm:text-lg font-light">
            Progettate da professionisti del matrimonio per valorizzare il tuo lavoro davanti agli sposi e agli invitati.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CORE_PRO_FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-800 hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-stone-800 text-amber-300 px-3 py-1 rounded-full">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-white mb-3">{feat.title}</h3>
                  <p className="text-sm sm:text-base text-stone-400 leading-relaxed font-light">{feat.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* EXCLUSIVE / TEASER SECTION (PROTECTED FROM COMPETITORS) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-stone-900/70 border-t border-stone-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12 pb-8 border-b border-stone-800">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-rose-300 bg-rose-500/10 border border-rose-400/20 px-3.5 py-1.5 rounded-full">
                <Lock className="w-3.5 h-3.5" /> Anteprima Potenzialità Riservate
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif text-white">
                Strumenti avanzati visibili solo in Dashboard Partner
              </h2>
              <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
                Per proteggere il vantaggio competitivo della nostra rete ed evitare che piattaforme generaliste replichino le nostre soluzioni, sveliamo tutte le funzioni avanzate solo ai professionisti iscritti dentro l&apos;Area Riservata.
              </p>
            </div>
            <Link href="/professionisti#founders" className="w-full sm:w-auto shrink-0">
              <Button className="w-full sm:w-auto min-h-12 h-auto py-3 px-6 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold whitespace-normal text-center leading-snug">
                <span>Accedi al Founders Club</span>
                <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TEASER_PRO_PREVIEWS.map((item) => (
              <div
                key={item.title}
                className="bg-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-8 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-stone-400 leading-relaxed">{item.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
