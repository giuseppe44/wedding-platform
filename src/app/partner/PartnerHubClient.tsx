"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  UtensilsCrossed,
  Plane,
  CakeSlice,
  Car,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  QrCode,
  ShieldCheck,
  CreditCard,
  Building2,
  FileCheck2,
  Users,
  Printer,
  Tv,
  Menu,
  X,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { GentiLunaLogo } from "@/components/GentiLunaLogo";
import { PRO_CATEGORIES, getProCategoryMeta } from "@/lib/proCategories";

const HIGHLIGHT_SECTORS = [
  {
    code: "TRAVEL_AGENCY",
    icon: Plane,
    badge: "Altissimo Valore Medio",
    title: "Agenzie di Viaggi & Luna di Miele",
    subtitle: "Lista Viaggio a tappe già pronta per le tue coppie",
    accentClass: "from-sky-50 via-white to-indigo-50/50 border-sky-200/90",
    iconClass: "bg-sky-100 text-sky-700 border-sky-200",
    btnClass: "bg-sky-600 hover:bg-sky-700 text-white",
    points: [
      "Offri agli sposi una splendida Lista Viaggio di Nozze a tappe senza dover sviluppare siti esterni",
      "Area dedicata dove caricare voucher e Documenti di Viaggio per la coppia",
      "Il tuo brand compare davanti a 100–150 invitati (e futuri viaggiatori!) durante l'evento",
    ],
  },
  {
    code: "PASTRY_CAKE",
    icon: CakeSlice,
    badge: "Eventi 365 Giorni l'Anno",
    title: "Pasticcerie, Negozi di Torte & Cake Design",
    subtitle: "Matrimoni, battesimi, comunioni, lauree e diciottesimi",
    accentClass: "from-rose-50 via-white to-amber-50/50 border-rose-200/90",
    iconClass: "bg-rose-100 text-rose-600 border-rose-200",
    btnClass: "bg-rose-600 hover:bg-rose-700 text-white",
    points: [
      "Vetrina portfolio per wedding cake monumentali, sweet table, confettate e pasticceria mignon",
      "Massima visibilità nel momento più fotografato: il taglio della torta con QR Code in sala",
      "Ricevi ordini diretti anche per battesimi, lauree, comunioni e anniversari a 0% commissioni",
    ],
  },
  {
    code: "NCC_CARS",
    icon: Car,
    badge: "Doppio Servizio Sposi + Invitati",
    title: "NCC, Auto Sposi & Auto d'Epoca",
    subtitle: "Noleggio con conducente, vetture cerimonia e navette ospiti",
    accentClass: "from-amber-50 via-white to-stone-50 border-amber-300/80",
    iconClass: "bg-amber-100 text-amber-800 border-amber-200",
    btnClass: "bg-stone-900 hover:bg-stone-800 text-amber-300",
    points: [
      "Mostra la tua flotta di auto d'epoca, sportive, limousine e berline di rappresentanza per gli sposi",
      "Proponi il servizio Navetta & Transfer NCC sicuro (hotel/aeroporto ↔ chiesa ↔ ristorante) agli invitati",
      "Preventivi diretti tracciati nella tua dashboard senza intermediari né percentuali",
    ],
  },
  {
    code: "STATIONERY_FAVORS",
    icon: Printer,
    badge: "Partner in Prima Fila",
    title: "Tipografie, Bomboniere, Hotel, Open Bar & Atelier",
    subtitle: "Intercetta sposi e invitati fin dal primo giorno di preparativi",
    accentClass: "from-violet-50 via-white to-fuchsia-50/40 border-violet-200/90",
    iconClass: "bg-violet-100 text-violet-700 border-violet-200",
    btnClass: "bg-violet-700 hover:bg-violet-800 text-white",
    points: [
      "Tipografie & Bomboniere: vendi partecipazioni, menù e segnaposto con QR Code GentiLuna integrato",
      "Hotel, B&B & Resort: ospita decine di invitati fuori sede che cercano alloggio vicino al ristorante",
      "Open Bar, Bartender, Atelier Sposi & Photo Booth: vetrina gratuita e contatti diretti a 0% commissioni",
    ],
  },
];

export default function PartnerHubClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("RESTAURANT");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeMeta = getProCategoryMeta(selectedCategory);

  const buildOnboardingHref = (categoryCode: string, planCode?: string) =>
    `/login?role=PHOTOGRAPHER&mode=REGISTER&category=${encodeURIComponent(
      categoryCode
    )}${planCode ? `&plan=${encodeURIComponent(planCode)}` : ""}`;

  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans text-stone-900 flex flex-col overflow-x-hidden">
      {/* TOP NAVBAR */}
      <nav className="sticky top-0 z-50 bg-stone-950/95 backdrop-blur-md border-b border-stone-800 px-4 sm:px-6 py-4 text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 font-serif text-xl sm:text-2xl text-white shrink-0">
            <GentiLunaLogo variant="pro" className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" />
            <span>GentiLuna</span>
            <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-amber-400 ml-0.5">
              PARTNER
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-widest text-stone-300 font-medium">
            <a href="#ristoranti" className="hover:text-amber-300 transition-colors">
              Ristoranti &amp; Sale
            </a>
            <a href="#categorie-partner" className="hover:text-amber-300 transition-colors">
              Viaggi, Torte &amp; NCC
            </a>
            <Link href="/fornitori" className="hover:text-amber-300 transition-colors">
              Directory Fornitori
            </Link>
            <Link href="/funzioni-professionisti" className="hover:text-amber-300 transition-colors">
              Fotografi &amp; Regia
            </Link>
          </div>

          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            <Link href="/login?role=PHOTOGRAPHER">
              <Button
                variant="outline"
                className="rounded-full bg-transparent border-stone-700 text-stone-200 hover:bg-white/10 hover:text-white h-9 px-4 text-xs"
              >
                Accedi
              </Button>
            </Link>
            <a href="#attiva-ora">
              <Button className="rounded-full bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold h-9 px-5 text-xs border-none">
                Attiva Vetrina (49€)
              </Button>
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Apri menu"
            className="sm:hidden p-2 rounded-xl border border-stone-800 text-amber-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden mt-3 pt-3 border-t border-stone-800 flex flex-col gap-2 pb-2 text-sm">
            <a
              href="#ristoranti"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-stone-200 hover:bg-stone-900"
            >
              Ristoranti, Ville &amp; Sale Ricevimenti
            </a>
            <a
              href="#categorie-partner"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-stone-200 hover:bg-stone-900"
            >
              Agenzie Viaggi, Pasticcerie &amp; NCC
            </a>
            <Link
              href="/fornitori"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-stone-200 hover:bg-stone-900"
            >
              Directory Fornitori
            </Link>
            <div className="flex gap-2 pt-2">
              <Link href="/login?role=PHOTOGRAPHER" className="flex-1">
                <Button variant="outline" className="w-full rounded-full border-stone-700 text-white bg-transparent">
                  Accedi
                </Button>
              </Link>
              <a href="#attiva-ora" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                <Button className="w-full rounded-full bg-amber-400 text-stone-950 font-bold">
                  Attiva 49€
                </Button>
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* HERO PARTNER ECOSYSTEM */}
      <header className="relative bg-stone-950 text-white pt-14 pb-20 sm:pt-20 sm:pb-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.16),transparent_65%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/35 text-amber-300 text-xs font-bold uppercase tracking-widest mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Programma Ufficiale Ristoranti &amp; Partner Eventi • 0% Commissioni
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif leading-tight mb-5">
            <span className="block">Ristoranti, Viaggi, Pasticcerie e NCC:</span>
            <span className="inline-block px-2 -mx-2 box-decoration-clone italic text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-rose-200">
              trasforma ogni cerimonia in nuovi clienti.
            </span>
          </h1>

          <p className="text-stone-300 text-base sm:text-xl font-light max-w-3xl mx-auto leading-relaxed mb-8">
            GentiLuna unisce in un solo ecosistema digitale <strong className="text-white">matrimoni, battesimi, comunioni, lauree e anniversari</strong>: strumenti operativi reali per la sala e visibilità diretta sugli smartphone di tutti gli invitati.
          </p>

          {/* PILLOLE RAPIDE SETTORI */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-8">
            {[
              { href: "#ristoranti", label: "🍽️ Ristoranti & Ville" },
              { href: "#categorie-partner", label: "✈️ Agenzie di Viaggi" },
              { href: "#categorie-partner", label: "🎂 Pasticcerie & Torte" },
              { href: "#categorie-partner", label: "🚘 NCC & Auto Matrimoni" },
              { href: "#categorie-partner", label: "💌 Tipografie & Bomboniere" },
            ].map((pill) => (
              <a
                key={pill.label}
                href={pill.href}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-amber-400/20 border border-white/15 hover:border-amber-300/50 text-xs sm:text-sm font-medium text-stone-100 transition-all"
              >
                {pill.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#attiva-ora">
              <Button className="h-12 px-8 rounded-full bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/20 border-none">
                Crea Vetrina Gratis o Sblocca VIP 49€
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <Link href="/demo">
              <Button
                variant="outline"
                className="h-12 px-7 rounded-full bg-transparent border-stone-700 text-stone-200 hover:bg-white/10 hover:text-white text-sm"
              >
                Prova la Demo Interattiva Live
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* SEZIONE 1: FOCUS RISTORANTI, VILLE & SALE RICEVIMENTI */}
        <section id="ristoranti" className="py-16 sm:py-24 px-4 sm:px-6 bg-white border-b border-stone-200/70">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* TESTO VANTAGGI RISTORANTE */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-600" />
                  Speciale Ristoranti, Ville, Agriturismi &amp; Catering
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-stone-900 leading-tight">
                  Basta fogli sparsi in cucina e cambi tavolo dell&apos;ultimo minuto.
                </h2>

                <p className="text-stone-600 text-base sm:text-lg font-light leading-relaxed">
                  Con GentiLuna offri ai tuoi clienti (sposi, neo-genitori per battesimi e comunioni, laureati) uno strumento esclusivo che <strong>semplifica il lavoro di sala e cucina</strong> e riempie il tuo calendario cerimonie tutto l&apos;anno.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                        1. Portale Ristorante Live (Tavoli + Allergie già contate)
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 mt-0.5 leading-relaxed">
                        Ricevi dagli sposi un link unico sempre aggiornato con l&apos;elenco tavoli, il conteggio esatto di celiaci, intolleranti al lattosio, vegetariani, vegani, menù bimbi e seggioloni, pronto da stampare per lo chef.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <Tv className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                        2. GentiLuna Live Wall su TV o Proiettore di Sala
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 mt-0.5 leading-relaxed">
                        Trasforma i monitor o il proiettore della tua sala in uno spettacolo emozionante: le foto scattate dagli ospiti compaiono in diretta durante il ricevimento. Un servizio esclusivo che fa scegliere il tuo ristorante rispetto alla concorrenza.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                        3. 150 Invitati in Sala = Nuovi Banchetti Tutto l&apos;Anno
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 mt-0.5 leading-relaxed">
                        Ogni ospite che inquadra il QR Code sul tavolo per vedere il proprio posto o caricare una foto scopre la <strong>Vetrina Ufficiale del tuo Ristorante</strong> per prenotare il proprio matrimonio, battesimo, laurea o festa aziendale.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <Link href={buildOnboardingHref("RESTAURANT", "PRO_FOUNDERS_49")}>
                    <Button className="h-12 px-7 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md">
                      Iscrivi ora il tuo Ristorante / Location (49€)
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href={buildOnboardingHref("RESTAURANT", "PRO_DIAMOND_449")}>
                    <Button
                      variant="outline"
                      className="h-12 px-6 rounded-full border-stone-300 text-stone-800 hover:bg-stone-100 font-semibold"
                    >
                      Scopri Piano Location White-Label
                    </Button>
                  </Link>
                </div>
              </div>

              {/* SIMULAZIONE VISIVA PORTALE SALA & CUCINA */}
              <div className="lg:col-span-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-[2.25rem] bg-stone-950 text-white p-6 sm:p-8 shadow-2xl border border-stone-800 relative overflow-hidden"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-5 mb-6 border-b border-stone-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-stone-400">Anteprima Regia Sala &amp; Cucina</div>
                        <div className="font-serif font-bold text-base text-white">
                          Ricevimento Paolo &amp; Tina • 142 Ospiti
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Sincronizzato Live
                    </span>
                  </div>

                  {/* CONTATORI CUCINA */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {[
                      { label: "Celiaci / Gluten Free", val: "4", color: "text-amber-300 border-amber-400/30 bg-amber-500/10" },
                      { label: "Senza Lattosio", val: "6", color: "text-sky-300 border-sky-400/30 bg-sky-500/10" },
                      { label: "Vegani / Vegetar.", val: "5", color: "text-emerald-300 border-emerald-400/30 bg-emerald-500/10" },
                      { label: "Menù Bimbi", val: "8", color: "text-rose-300 border-rose-400/30 bg-rose-500/10" },
                    ].map((stat) => (
                      <div key={stat.label} className={`rounded-2xl border p-3.5 text-center ${stat.color}`}>
                        <div className="text-2xl font-bold font-serif">{stat.val}</div>
                        <div className="text-[11px] opacity-90 leading-tight mt-0.5">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* ESEMPIO TAVOLI */}
                  <div className="space-y-3 mb-6">
                    <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-sm text-white">Tavolo 1 — Sposi &amp; Testimoni (10 posti)</div>
                        <div className="text-xs text-amber-300 mt-0.5">
                          ⚠️ 1 Celiaco certificato (Elena R.) • 1 Senza Lattosio (Marco B.)
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-stone-800 text-stone-300 shrink-0">
                        Completo
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-sm text-white">Tavolo 2 — Amici &amp; Famiglie (9 posti)</div>
                        <div className="text-xs text-emerald-300 mt-0.5">
                          🌱 2 Menù Vegetariani • 👶 2 Menù Bimbi (1 seggiolone)
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-stone-800 text-stone-300 shrink-0">
                        Completo
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-amber-500/15 border border-amber-400/30 flex items-center justify-between gap-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-2.5 text-amber-100">
                      <QrCode className="w-5 h-5 text-amber-300 shrink-0" />
                      <span>Inclusa Vetrina Ufficiale del Ristorante visibile a tutti gli ospiti!</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* SEZIONE 2: LE NUOVE CATEGORIE AD ALTO RENDIMENTO */}
        <section id="categorie-partner" className="py-16 sm:py-24 px-4 sm:px-6 bg-[#faf9f8]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="inline-block px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300/80 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
                Nuove Categorie Ufficiali Aperte
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif text-stone-900 mb-4">
                Un ecosistema pensato per ogni protagonista dell&apos;evento
              </h2>
              <p className="text-stone-600 text-base sm:text-lg font-light">
                Seleziona la tua categoria: la tua vetrina pubblica, il modulo preventivi e gli strumenti dedicati si adattano automaticamente alla tua attività.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              {HIGHLIGHT_SECTORS.map((sec) => {
                const Icon = sec.icon;
                return (
                  <div
                    key={sec.code}
                    className={`rounded-[2.25rem] border bg-gradient-to-br ${sec.accentClass} p-7 sm:p-9 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between gap-6`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-5">
                        <span className="px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-800 text-xs font-bold shadow-2xs">
                          {sec.badge}
                        </span>
                        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${sec.iconClass}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>

                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-1.5">
                        {sec.title}
                      </h3>
                      <p className="text-sm font-semibold text-stone-700 mb-5">{sec.subtitle}</p>

                      <ul className="space-y-3 text-sm text-stone-600">
                        {sec.points.map((pt) => (
                          <li key={pt} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-stone-200/60 flex flex-col sm:flex-row gap-2.5">
                      <Link href={buildOnboardingHref(sec.code)} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full h-11 rounded-2xl bg-white border-stone-300 text-stone-900 hover:bg-stone-100 font-bold text-xs sm:text-sm"
                        >
                          Vetrina Base Gratis (0€)
                        </Button>
                      </Link>
                      <Link href={buildOnboardingHref(sec.code, "PRO_FOUNDERS_49")} className="flex-1">
                        <Button className={`w-full h-11 rounded-2xl font-bold flex items-center justify-center gap-1.5 border-none shadow-sm text-xs sm:text-sm ${sec.btnClass}`}>
                          <span>VIP PRO (49€/anno)</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SEZIONE 3: VETRINA FREE + LIVELLI IN ABBONAMENTO PRO */}
        <section id="attiva-ora" className="py-16 sm:py-24 px-4 sm:px-6 bg-white border-t border-stone-200/70">
          <div className="max-w-5xl mx-auto">
            {/* CONFRONTO CHIARO: VETRINA FREE VS PIANI PRO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              <div className="rounded-3xl border border-stone-200 bg-stone-50/80 p-6 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                    Ingresso Libero
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-stone-900 mt-3 mb-1">
                    Vetrina Base Free
                  </h3>
                  <div className="text-3xl font-bold text-stone-900 mb-3">0,00 €</div>
                  <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    Registrati gratis, pubblica la tua scheda nella directory Fornitori (fino a 3 servizi) e inizia subito a farti trovare a 0% commissioni.
                  </p>
                </div>
                <span className="text-xs font-semibold text-emerald-700">✓ Nessuna carta richiesta</span>
              </div>

              <div className="rounded-3xl border-2 border-amber-400 bg-stone-950 text-white p-6 flex flex-col justify-between shadow-xl">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-950 bg-amber-400 px-3 py-1 rounded-full">
                    Più Scelto • Primi 50
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white mt-3 mb-1">
                    Founders Club PRO
                  </h3>
                  <div className="text-3xl font-bold text-amber-300 mb-1">
                    49,00 € <span className="text-xs text-stone-400 font-normal">/ 1° anno</span>
                  </div>
                  <div className="text-[11px] text-stone-400 line-through mb-3">anziché 299,00 €/anno</div>
                  <p className="text-xs text-stone-300 leading-relaxed mb-4">
                    Badge VIP Partner, servizi illimitati in vetrina, eventi illimitati, QR Code in sala per lead dagli invitati e Live Chat protetta.
                  </p>
                </div>
                <span className="text-xs font-semibold text-amber-300">★ Poi piani Entry (120€) o PRO (299€)</span>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-stone-50/80 p-6 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
                    Per Location &amp; Agenzie
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-stone-900 mt-3 mb-1">
                    Diamond White-Label
                  </h3>
                  <div className="text-3xl font-bold text-stone-900 mb-3">
                    449,00 € <span className="text-xs text-stone-500 font-normal">/ anno</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    Include pacchetti Sposi in stock da regalare/rivendere alle tue coppie, piattaforma White-Label col tuo Logo e Account Manager dedicato.
                  </p>
                </div>
                <Link href="/professionisti#pricing" className="text-xs font-bold text-stone-900 underline">
                  Confronta tutti i livelli PRO →
                </Link>
              </div>
            </div>

            <div className="rounded-[2.5rem] bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 text-white p-6 sm:p-10 md:p-12 border border-amber-400/35 shadow-2xl">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-widest mb-3">
                  <CreditCard className="w-3.5 h-3.5" />
                  Attivazione Immediata: Gratis o Promo VIP 49€
                </span>
                <h2 className="text-2xl sm:text-4xl font-serif text-white mb-3">
                  Scegli la tua categoria e inizia subito
                </h2>
                <p className="text-stone-300 text-sm sm:text-base font-light">
                  Puoi partire con la <strong className="text-white">Vetrina Base Gratuita (0€)</strong> e fare upgrade quando vuoi, oppure bloccare subito il <strong className="text-amber-300">Posto Fondatore VIP a 49,00 € / 1° anno</strong>.
                </p>
              </div>

              {/* SELETTORE INTERATTIVO CATEGORIA */}
              <div className="bg-white/5 border border-white/15 rounded-3xl p-5 sm:p-7 mb-6">
                <label
                  htmlFor="partner-cat-select"
                  className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2.5"
                >
                  1. Qual è la categoria della tua attività?
                </label>
                <select
                  id="partner-cat-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-12 rounded-xl bg-white text-stone-900 font-semibold px-4 text-sm sm:text-base border-2 border-amber-300 outline-none"
                >
                  {PRO_CATEGORIES.map((cat) => (
                    <option key={cat.code} value={cat.code}>
                      {cat.label}
                    </option>
                  ))}
                </select>

                <div className="mt-4 p-4 rounded-2xl bg-amber-400/10 border border-amber-300/25 text-xs sm:text-sm text-amber-100 leading-relaxed">
                  <strong className="text-amber-300">Vantaggio per {activeMeta.label}:</strong>{" "}
                  {activeMeta.proValuePitch}
                </div>
              </div>

              {/* DOPPIA SCELTA: VETRINA FREE O CHECKOUT VIP 49€ */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Link href={buildOnboardingHref(selectedCategory)} className="block">
                    <Button
                      variant="outline"
                      className="w-full min-h-14 h-auto py-3.5 px-5 rounded-2xl bg-white/10 hover:bg-white/20 border-white/30 text-white font-bold text-sm sm:text-base whitespace-normal text-center"
                    >
                      Crea Vetrina Gratuita (0€) →
                    </Button>
                  </Link>

                  <Link
                    href={buildOnboardingHref(selectedCategory, "PRO_FOUNDERS_49")}
                    className="block"
                  >
                    <Button className="w-full min-h-14 h-auto py-3.5 px-5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-sm sm:text-base shadow-[0_10px_30px_-5px_rgba(245,158,11,0.45)] flex items-center justify-center gap-2 border-none whitespace-normal text-center">
                      <CreditCard className="w-4 h-4 shrink-0" />
                      <span>Attiva VIP PRO — 49,00 € / 1° anno</span>
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-stone-400 pt-1">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Carta, PostePay, Apple Pay &amp; Google Pay su Stripe
                  </span>
                  <span>•</span>
                  <span>Attivazione immediata</span>
                  <span>•</span>
                  <span>0% commissioni sui preventivi</span>
                </div>

                {/* OPZIONE BONIFICO AZIENDALE B2B */}
                <div className="mt-6 pt-5 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
                  <span>
                    Sei un Ristorante, Agenzia o Società e preferisci pagare tramite{" "}
                    <strong className="text-stone-200">Bonifico Bancario Aziendale con Fattura P.IVA</strong>?
                  </span>
                  <a
                    href={`mailto:info@gentiluna.com?subject=${encodeURIComponent(
                      `Attivazione Partner (${activeMeta.label}) tramite Bonifico Aziendale`
                    )}&body=${encodeURIComponent(
                      `Buongiorno Team GentiLuna,\n\nvorremmo attivare il profilo Partner (${activeMeta.label} - Promo 49,00 €) con pagamento tramite Bonifico Aziendale e Fattura Elettronica.\n\nNome Attività:\nCittà / Provincia:\nPartita IVA / Ragione Sociale:\nRecapito telefonico:\n`
                    )}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-stone-700 text-amber-200 font-semibold whitespace-nowrap shrink-0 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Richiedi IBAN &amp; Fattura B2B
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
