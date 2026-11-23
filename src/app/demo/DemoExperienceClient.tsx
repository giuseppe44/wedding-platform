"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  UtensilsCrossed,
  Heart,
  Award,
  Search,
  Camera,
  CheckCircle2,
  ArrowRight,
  Plane,
  CakeSlice,
  Car,
  QrCode,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Footer from "@/components/Footer";
import { GentiLunaLogo } from "@/components/GentiLunaLogo";
import ScratchDate from "@/components/w/ScratchDate";
import { LocationCuteIcon } from "@/components/w/LocationCuteIcon";

const DEMO_TABLES = [
  {
    name: "Tavolo 1 — Amalfi (Sposi & Testimoni)",
    guests: [
      { name: "Sofia Ferraro", diet: "Nessuna" },
      { name: "Lorenzo Conti", diet: "Nessuna" },
      { name: "Elena Rinaldi", diet: "Celiaca certificata" },
      { name: "Marco Bellini", diet: "Senza Lattosio" },
    ],
    tags: ["CELIACO", "LATTOSIO"],
  },
  {
    name: "Tavolo 2 — Capri (Famiglie)",
    guests: [
      { name: "Giulia Santoro", diet: "Vegetariana" },
      { name: "Zio Roberto", diet: "Nessuna" },
      { name: "Piccolo Tommaso", diet: "Menù Bimbi + Seggiolone" },
      { name: "Chiara De Luca", diet: "Vegana" },
    ],
    tags: ["VEGANO", "BIMBI"],
  },
  {
    name: "Tavolo 3 — Positano (Amici)",
    guests: [
      { name: "Matteo Galli", diet: "Nessuna" },
      { name: "Sara Moretti", diet: "Celiaca" },
      { name: "Davide Serra", diet: "Allergia frutta a guscio" },
      { name: "Martina Costa", diet: "Senza Lattosio" },
    ],
    tags: ["CELIACO", "LATTOSIO"],
  },
];

export default function DemoExperienceClient() {
  const [activeTab, setActiveTab] = useState<"COUPLE" | "RESTAURANT" | "PARTNERS">("COUPLE");
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [dateRevealed, setDateRevealed] = useState(false);
  const [guestQuery, setGuestQuery] = useState("");
  const [demoPhotoAdded, setDemoPhotoAdded] = useState(false);
  const [dietFilter, setDietFilter] = useState<"ALL" | "CELIACO" | "LATTOSIO" | "VEGANO" | "BIMBI">("ALL");

  const matchedGuests = guestQuery.trim()
    ? DEMO_TABLES.flatMap((t) =>
        t.guests
          .filter((g) => g.name.toLowerCase().includes(guestQuery.toLowerCase()))
          .map((g) => ({ guest: g.name, table: t.name }))
      )
    : [];

  const filteredTables =
    dietFilter === "ALL"
      ? DEMO_TABLES
      : DEMO_TABLES.filter((t) => t.tags.includes(dietFilter));

  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans text-stone-900 flex flex-col overflow-x-hidden">
      {/* TOP BAR */}
      <nav className="sticky top-0 z-50 bg-stone-950/95 backdrop-blur-md border-b border-stone-800 px-4 sm:px-6 py-3.5 text-white">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 font-serif text-xl sm:text-2xl text-white">
            <GentiLunaLogo className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" />
            <span>GentiLuna</span>
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest bg-amber-400/20 border border-amber-400/40 text-amber-300 px-2 py-0.5 rounded-full ml-1">
              DEMO LIVE
            </span>
          </Link>

          <div className="flex items-center gap-2.5">
            <Link href="/prezzi" className="hidden sm:inline-block">
              <Button
                variant="outline"
                className="rounded-full bg-transparent border-stone-700 text-stone-200 hover:bg-white/10 hover:text-white h-9 px-4 text-xs"
              >
                Vedi Piani Sposi
              </Button>
            </Link>
            <Link href="/partner">
              <Button className="rounded-full bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold h-9 px-4 text-xs border-none">
                Sei un Ristorante / Pro?
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HEADER SELETTORE 3 PROSPETTIVE */}
      <header className="bg-stone-950 text-white pt-10 pb-12 px-4 text-center border-b border-stone-800">
        <div className="max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Prova GentiLuna in 15 Secondi • Senza Registrazione
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif mb-3">
            Tocca con mano l&apos;esperienza dal vivo
          </h1>
          <p className="text-stone-400 text-sm sm:text-base max-w-2xl mx-auto mb-7 font-light">
            Passa liberamente tra le 3 viste reali dell&apos;evento dimostrativo di{" "}
            <strong className="text-amber-200">Sofia &amp; Lorenzo</strong>: cosa vive l&apos;invitato, cosa riceve lo Chef del Ristorante e come compaiono i Partner.
          </p>

          {/* 3 TAB SWITCHER */}
          <div className="inline-flex flex-wrap justify-center gap-2 p-1.5 rounded-2xl bg-stone-900 border border-stone-800">
            <button
              type="button"
              onClick={() => setActiveTab("COUPLE")}
              className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition-all ${
                activeTab === "COUPLE"
                  ? "bg-rose-500 text-white shadow-md"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <Heart className="w-4 h-4" />
              1. Vista Sposi &amp; Invitati
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("RESTAURANT")}
              className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition-all ${
                activeTab === "RESTAURANT"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              2. Vista Ristorante &amp; Cucina
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("PARTNERS")}
              className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition-all ${
                activeTab === "PARTNERS"
                  ? "bg-amber-400 text-stone-950 shadow-md"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <Award className="w-4 h-4" />
              3. Vista Fornitori in Sala
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* ================= TAB 1: VISTA SPOSI & INVITATI ================= */}
        {activeTab === "COUPLE" && (
          <div className="space-y-10">
            {!envelopeOpen ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-lg mx-auto rounded-[2.5rem] bg-gradient-to-b from-[#fffdf9] to-[#f8f1e5] border border-amber-200 p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden"
              >
                <div className="text-xs uppercase tracking-[0.26em] text-amber-800/80 font-bold mb-4">
                  Passo 1 • Invito Digitale Interattivo
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mb-3">
                  Sofia &amp; Lorenzo
                </h2>
                <p className="text-sm text-stone-600 mb-8">
                  Siete invitati al nostro matrimonio. Toccate il sigillo dorato per aprire la busta!
                </p>

                <button
                  type="button"
                  onClick={() => setEnvelopeOpen(true)}
                  className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700 border-4 border-amber-200 shadow-[0_12px_30px_rgba(217,119,6,0.45)] flex flex-col items-center justify-center text-stone-950 font-serif font-bold text-xl hover:scale-105 transition-transform cursor-pointer"
                >
                  <span>S&amp;L</span>
                  <span className="text-[9px] font-sans uppercase tracking-widest mt-0.5">
                    Apri
                  </span>
                </button>
              </motion.div>
            ) : (
              <div className="space-y-10">
                {/* HERO SPOSI CON VERO GRATTA E VINCI */}
                <div className="rounded-[2.5rem] bg-stone-950 text-white p-7 sm:p-12 text-center relative overflow-hidden shadow-2xl border border-amber-400/30">
                  <button
                    type="button"
                    onClick={() => {
                      setEnvelopeOpen(false);
                      setDateRevealed(false);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white mb-4 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Rivedi apertura busta
                  </button>

                  <div className="text-xs uppercase tracking-[0.25em] text-amber-300 mb-2">
                    ✦ Il Nostro Matrimonio ✦
                  </div>
                  <h2 className="text-4xl sm:text-6xl font-serif font-bold mb-6">
                    Sofia <span className="text-amber-300 italic">&amp;</span> Lorenzo
                  </h2>

                  <p className="text-xs sm:text-sm text-amber-200/90 mb-4">
                    👇 Gratta qui sotto con il dito o con il mouse per svelare la data!
                  </p>

                  <div className="max-w-xs mx-auto">
                    <ScratchDate
                      date="2027-06-19T16:00:00.000Z"
                      onReveal={() => setDateRevealed(true)}
                    />
                  </div>

                  {dateRevealed && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold"
                    >
                      🎉 Data svelata! Nella pagina reale parte subito il Countdown su una riga!
                    </motion.div>
                  )}
                </div>

                {/* LUOGHI ILLUSTRATI + RICERCA TAVOLO + CARICA FOTO */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* LUOGHI */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
                    <h3 className="font-serif text-2xl font-bold text-stone-900">
                      Programma &amp; Luoghi con Icone Illustrate
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
                        <LocationCuteIcon kind="church" />
                        <div className="font-serif font-bold text-sm mt-2">Ore 16:00 • Pieve Storica</div>
                        <div className="text-xs text-stone-500">Cerimonia Religiosa</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
                        <LocationCuteIcon kind="hotel" />
                        <div className="font-serif font-bold text-sm mt-2">Ore 18:30 • Villa Belvedere</div>
                        <div className="text-xs text-stone-500">Aperitivo, Cena &amp; Party</div>
                      </div>
                    </div>
                  </div>

                  {/* TABLEAU INTERATTIVO */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
                    <h3 className="font-serif text-2xl font-bold text-stone-900">
                      Tableau Interattivo: Cerca il tuo Posto
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600">
                      Prova a scrivere <strong>&ldquo;Elena&rdquo;</strong>, <strong>&ldquo;Marco&rdquo;</strong> o <strong>&ldquo;Giulia&rdquo;</strong>:
                    </p>
                    <div className="relative">
                      <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <Input
                        value={guestQuery}
                        onChange={(e) => setGuestQuery(e.target.value)}
                        placeholder="Scrivi il tuo nome (es. Elena)..."
                        className="pl-10 h-11 rounded-xl"
                      />
                    </div>
                    {matchedGuests.length > 0 ? (
                      <div className="space-y-2">
                        {matchedGuests.map((m) => (
                          <div
                            key={m.guest}
                            className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-950 font-semibold flex justify-between gap-2"
                          >
                            <span>{m.guest}</span>
                            <span className="text-emerald-700">{m.table}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-stone-400 italic">
                        Gli invitati trovano il tavolo dal proprio telefono in 2 secondi, senza code davanti al cartellone!
                      </p>
                    )}
                  </div>
                </div>

                {/* SIMULATORE CARICA FOTO QR */}
                <div className="rounded-3xl bg-gradient-to-r from-rose-50 via-white to-amber-50 border border-rose-200/80 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 text-center md:text-left">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600">
                      <QrCode className="w-4 h-4" /> Raccolta Foto Invitati Senza App
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-stone-900">
                      Inquadra sul tavolo e carica i tuoi ricordi in HD
                    </h3>
                    <p className="text-sm text-stone-600 max-w-xl">
                      Nessuna app da installare: l&apos;ospite tocca un pulsante, sceglie le foto dal rullino e le invia subito alla galleria moderata degli sposi (e sul proiettore Live in sala!).
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => setDemoPhotoAdded(true)}
                    className="rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 h-12 shrink-0"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {demoPhotoAdded ? "✓ Foto Demo Inviata!" : "Simula Invio Foto Ospite"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: VISTA RISTORANTE & CUCINA ================= */}
        {activeTab === "RESTAURANT" && (
          <div className="space-y-6">
            <div className="rounded-[2.25rem] bg-stone-950 text-white p-6 sm:p-9 border border-emerald-500/35 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-stone-800">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                    Portale Ristorante Live • Accesso Diretto Senza Password
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold mt-1">
                    Scheda Sala &amp; Cucina — Sofia &amp; Lorenzo
                  </h2>
                </div>
                <Link href="/partner#ristoranti">
                  <Button className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-stone-950 font-bold text-xs px-5 h-10 border-none">
                    Iscrivi Gratis il tuo Ristorante →
                  </Button>
                </Link>
              </div>

              {/* FILTRI INTERATTIVI CUCINA */}
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { id: "ALL", label: "Tutti i Tavoli (3)" },
                  { id: "CELIACO", label: "🌾 Celiaci (2)" },
                  { id: "LATTOSIO", label: "🥛 Senza Lattosio (2)" },
                  { id: "VEGANO", label: "🌱 Vegani / Vegetar. (2)" },
                  { id: "BIMBI", label: "👶 Menù Bimbi & Seggioloni (1)" },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() =>
                      setDietFilter(
                        f.id as "ALL" | "CELIACO" | "LATTOSIO" | "VEGANO" | "BIMBI"
                      )
                    }
                    className={`px-3.5 py-2 rounded-full text-xs font-bold border cursor-pointer transition-all ${
                      dietFilter === f.id
                        ? "bg-emerald-500 text-stone-950 border-emerald-400"
                        : "bg-stone-900 text-stone-300 border-stone-700 hover:border-stone-500"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredTables.map((table) => (
                  <div
                    key={table.name}
                    className="rounded-2xl bg-stone-900 border border-stone-800 p-5 space-y-3"
                  >
                    <h3 className="font-serif font-bold text-base text-amber-200 border-b border-stone-800 pb-2">
                      {table.name}
                    </h3>
                    <ul className="space-y-2 text-xs">
                      {table.guests.map((g) => (
                        <li key={g.name} className="flex items-start justify-between gap-2">
                          <span className="text-white font-medium">{g.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded-md font-semibold ${
                              g.diet === "Nessuna"
                                ? "bg-stone-800 text-stone-400"
                                : "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                            }`}
                          >
                            {g.diet}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: VISTA PARTNER IN SALA ================= */}
        {activeTab === "PARTNERS" && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-4xl font-serif text-stone-900 mb-2">
                Il Team Ufficiale visibile a tutti i 140 invitati
              </h2>
              <p className="text-sm sm:text-base text-stone-600">
                Ogni volta che un ospite apre il sito dell&apos;evento, vede i Partner Ufficiali della giornata e può richiedere un preventivo diretto a <strong>0% commissioni</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  icon: UtensilsCrossed,
                  cat: "Ristorante & Villa",
                  name: "Tenuta Belvedere",
                  note: "Regia Sala & Banqueting",
                  href: "/partner#ristoranti",
                },
                {
                  icon: Plane,
                  cat: "Agenzia di Viaggi",
                  name: "Orizzonti Honeymoon",
                  note: "Lista Viaggio Giappone",
                  href: "/partner#categorie-partner",
                },
                {
                  icon: CakeSlice,
                  cat: "Pasticceria & Torte",
                  name: "Atelier Dolce Arte",
                  note: "Wedding Cake & Confettata",
                  href: "/partner#categorie-partner",
                },
                {
                  icon: Car,
                  cat: "NCC & Auto Sposi",
                  name: "Prestige Auto & Navette",
                  note: "Spider d'Epoca + Van Ospiti",
                  href: "/partner#categorie-partner",
                },
              ].map((p) => {
                const Icon = p.icon;
                return (
                  <Link
                    key={p.name}
                    href={p.href}
                    className="bg-white rounded-3xl border border-stone-200 p-6 text-center hover:border-amber-400 hover:shadow-lg transition-all flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-3">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-rose-600 mb-1">
                        {p.cat}
                      </div>
                      <h3 className="font-serif font-bold text-lg text-stone-900">{p.name}</h3>
                      <p className="text-xs text-stone-500 mt-1">{p.note}</p>
                    </div>
                    <span className="text-xs font-bold text-amber-800 inline-flex items-center justify-center gap-1">
                      Crea una vetrina così (0€) <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA FINALE */}
        <div className="mt-14 rounded-3xl bg-stone-900 text-white p-7 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-1">
              Pronto a portare questa magia nel tuo evento o nella tua attività?
            </h3>
            <p className="text-sm text-stone-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              Attivazione in 2 minuti • Vetrina Base Gratuita per tutte le categorie Partner
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href="/login?role=COUPLE&mode=REGISTER">
              <Button className="rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold px-6 h-11">
                Inizia come Sposi
              </Button>
            </Link>
            <Link href="/partner">
              <Button className="rounded-full bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold px-6 h-11 border-none">
                Unisciti come Partner (0€)
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
