"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Camera,
  UtensilsCrossed,
  Plane,
  CakeSlice,
  Car,
  HeartHandshake,
  UserPlus,
  Send,
  Menu,
  X,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { GentiLunaLogo } from "@/components/GentiLunaLogo";
import PortalSearch from "@/components/PortalSearch";
import type { ProFilterGroup } from "@/lib/proCategories";
import { getFeaturedLocalSeoSlugs } from "@/lib/localSeoData";

export type DirectoryProItem = {
  id: string;
  slug: string;
  businessName: string;
  category: string;
  categoryLabel: string;
  filterGroup: ProFilterGroup;
  description: string | null;
  serviceArea: string | null;
  coverUrl: string | null;
  avatarUrl: string | null;
  galleryPreview: string[];
  serviceNames: string[];
  reviewCount: number;
  avgRating: string | null;
};

type OpenSlotCard = {
  id: string;
  categoryCode: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  filterGroup: ProFilterGroup;
  accentBorder: string;
  accentBg: string;
  badgeClass: string;
  iconBg: string;
  couplePrompt: string;
  ctaLabel: string;
  icon: "restaurant" | "travel" | "pastry" | "ncc" | "camera" | "planner";
};

const OPEN_PARTNER_SLOTS: OpenSlotCard[] = [
  {
    id: "slot-ristoranti",
    categoryCode: "RESTAURANT",
    badge: "Vetrina Free + Regia Live",
    title: "Ristoranti, Ville & Open Bar",
    subtitle: "Regia tavoli & allergie live + nuovi banchetti tutto l'anno",
    description:
      "Crea gratis la tua vetrina e scopri il Portale Ristorante Live (celiaci, intolleranze e menù bimbi già contati tavolo per tavolo) e il Live Photo Wall in sala.",
    filterGroup: "RISTORANTI_LOCATION",
    accentBorder: "border-emerald-300/90 hover:border-emerald-500",
    accentBg: "from-[#f0fdf4] via-white to-[#ecfdf5]",
    badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300/80",
    iconBg: "bg-emerald-100 text-emerald-700 border-emerald-200",
    couplePrompt: "Cerco ristorante, villa o sala ricevimenti per il mio evento",
    ctaLabel: "Crea Vetrina Gratis (Ristorante)",
    icon: "restaurant",
  },
  {
    id: "slot-viaggi",
    categoryCode: "TRAVEL_AGENCY",
    badge: "Vetrina Free • Nuova Categoria",
    title: "Agenzie di Viaggi & Hotel Ospiti",
    subtitle: "Lista viaggio a tappe + alloggi invitati fuori sede",
    description:
      "Posiziona gratis la tua agenzia viaggi (con Lista Luna di Miele a tappe su GentiLuna) oppure il tuo Hotel/B&B per ospitare decine di invitati fuori sede.",
    filterGroup: "VIAGGI_AUTO_TORTE",
    accentBorder: "border-sky-300/90 hover:border-sky-500",
    accentBg: "from-[#f0f9ff] via-white to-[#e0f2fe]/50",
    badgeClass: "bg-sky-100 text-sky-900 border-sky-200",
    iconBg: "bg-sky-100 text-sky-700 border-sky-200",
    couplePrompt: "Cerco agenzia di viaggi per Luna di Miele o hotel per invitati",
    ctaLabel: "Crea Vetrina Gratis (Viaggi / Hotel)",
    icon: "travel",
  },
  {
    id: "slot-pasticcerie",
    categoryCode: "PASTRY_CAKE",
    badge: "Vetrina Free • Cerchiamo in Zona",
    title: "Pasticcerie, Negozi di Torte & Cake Design",
    subtitle: "Torte nuziali, sweet table, battesimi, comunioni e lauree",
    description:
      "Pubblica gratis le tue wedding cake, confettate e creazioni artigianali: fatti scegliere nel momento più fotografato dell'evento, a 0% commissioni.",
    filterGroup: "VIAGGI_AUTO_TORTE",
    accentBorder: "border-rose-200/90 hover:border-rose-400",
    accentBg: "from-[#fff5f7] via-white to-[#fff1f2]",
    badgeClass: "bg-rose-100 text-rose-900 border-rose-200",
    iconBg: "bg-rose-100 text-rose-600 border-rose-200",
    couplePrompt: "Cerco pasticceria o negozio di torte per wedding cake e confettata",
    ctaLabel: "Crea Vetrina Gratis (Pasticceria)",
    icon: "pastry",
  },
  {
    id: "slot-ncc",
    categoryCode: "NCC_CARS",
    badge: "Vetrina Free • Sposi & Navette",
    title: "NCC (Noleggio con Conducente) & Auto Sposi",
    subtitle: "Auto d'epoca, luxury car e transfer sicuro per gli invitati",
    description:
      "Registra gratis la tua flotta: proponi sia l'auto da cerimonia per gli sposi sia il servizio navetta/NCC per il rientro sicuro degli ospiti dalla location.",
    filterGroup: "VIAGGI_AUTO_TORTE",
    accentBorder: "border-amber-300/90 hover:border-amber-500",
    accentBg: "from-[#fffbf2] via-white to-[#fef3c7]/40",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-300/80",
    iconBg: "bg-amber-100 text-amber-800 border-amber-200",
    couplePrompt: "Cerco auto per matrimonio o servizio NCC noleggio con conducente",
    ctaLabel: "Crea Vetrina Gratis (Auto / NCC)",
    icon: "ncc",
  },
  {
    id: "slot-foto-video",
    categoryCode: "PHOTOGRAPHER",
    badge: "Vetrina Free + Piani PRO",
    title: "Fotografi & Videomaker",
    subtitle: "Cerchiamo studi selezionati nelle province ancora scoperte",
    description:
      "Parti dalla Vetrina Base gratuita o sblocca il piano PRO (da 49€/1° anno) per consegne gallerie HD illimitate e QR Code sui tavoli davanti agli invitati.",
    filterGroup: "FOTO_VIDEO",
    accentBorder: "border-indigo-200/90 hover:border-indigo-400",
    accentBg: "from-[#f5f7ff] via-white to-[#eef2ff]/60",
    badgeClass: "bg-indigo-100 text-indigo-900 border-indigo-200",
    iconBg: "bg-indigo-100 text-indigo-700 border-indigo-200",
    couplePrompt: "Cerco fotografo e videomaker per il mio matrimonio",
    ctaLabel: "Crea Vetrina Gratis (Foto / Video)",
    icon: "camera",
  },
  {
    id: "slot-planner-stile",
    categoryCode: "STATIONERY_FAVORS",
    badge: "Vetrina Free • Collaboratori",
    title: "Planner, Fioristi, Musica, Tipografie & Atelier",
    subtitle: "Diventa il punto di riferimento per le coppie della tua città",
    description:
      "Vetrina gratuita aperta a Wedding Planner, fioristi, musicisti/DJ, tipografie partecipazioni, bomboniere, photo booth, atelier sposi e make-up/hair artist.",
    filterGroup: "PLANNER_MUSICA_STILE",
    accentBorder: "border-violet-200/90 hover:border-violet-400",
    accentBg: "from-[#faf7ff] via-white to-[#f5f3ff]",
    badgeClass: "bg-violet-100 text-violet-900 border-violet-200",
    iconBg: "bg-violet-100 text-violet-700 border-violet-200",
    couplePrompt: "Cerco Wedding Planner, fiorista, musica, partecipazioni o atelier",
    ctaLabel: "Scopri Tutte le Categorie Partner",
    icon: "planner",
  },
];

const EXPANSION_REGIONS = [
  "Lombardia & Laghi",
  "Toscana & Umbria",
  "Puglia & Salento",
  "Sardegna",
  "Lazio & Roma",
  "Sicilia",
  "Veneto",
  "Piemonte",
  "Campania & Costiera",
  "Emilia-Romagna",
  "Liguria",
  "Calabria, Marche & Abruzzo",
];

function SlotIcon({ kind }: { kind: OpenSlotCard["icon"] }) {
  switch (kind) {
    case "restaurant":
      return <UtensilsCrossed className="w-6 h-6" />;
    case "travel":
      return <Plane className="w-6 h-6" />;
    case "pastry":
      return <CakeSlice className="w-6 h-6" />;
    case "ncc":
      return <Car className="w-6 h-6" />;
    case "camera":
      return <Camera className="w-6 h-6" />;
    case "planner":
      return <HeartHandshake className="w-6 h-6" />;
  }
}

export default function FornitoriDirectoryClient({
  pros,
}: {
  pros: DirectoryProItem[];
}) {
  const [activeFilter, setActiveFilter] = useState<
    "ALL" | ProFilterGroup | "OPEN_SLOTS"
  >("ALL");
  const [presetQuery, setPresetQuery] = useState("");
  const [presetNonce, setPresetNonce] = useState(0);
  const [openSegnalaNonce, setOpenSegnalaNonce] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const triggerSearchPreset = (queryText: string) => {
    setPresetQuery(queryText);
    setPresetNonce((n) => n + 1);
  };

  const filteredPros =
    activeFilter === "OPEN_SLOTS"
      ? []
      : activeFilter === "ALL"
      ? pros
      : pros.filter((p) => p.filterGroup === activeFilter);

  const filteredSlots =
    activeFilter === "ALL" || activeFilter === "OPEN_SLOTS"
      ? OPEN_PARTNER_SLOTS
      : OPEN_PARTNER_SLOTS.filter((s) => s.filterGroup === activeFilter);

  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans text-stone-900 flex flex-col overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="sticky top-0 w-full z-50 px-4 sm:px-6 py-4 bg-white/90 backdrop-blur-md border-b border-stone-200/70">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-3">
          <Link href="/" className="shrink-0">
            <div className="flex items-center gap-2 text-stone-900 font-serif text-xl sm:text-2xl">
              <GentiLunaLogo className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" />
              <span>GentiLuna</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
            <Link href="/funzioni-sposi" className="hover:text-rose-600 transition-colors">
              Sposi &amp; Eventi
            </Link>
            <Link href="/partner" className="text-emerald-700 hover:text-emerald-800 font-semibold transition-colors">
              Ristoranti, Viaggi &amp; Partner
            </Link>
            <Link href="/funzioni-professionisti" className="hover:text-amber-600 transition-colors">
              Fotografi &amp; Pro
            </Link>
            <Link href="/blog" className="hover:text-stone-900 transition-colors">
              Blog
            </Link>
          </div>

          <div className="hidden sm:flex items-center gap-2.5">
            <Link href="/login">
              <Button
                variant="outline"
                className="bg-white text-stone-900 border-stone-200 hover:bg-stone-100 rounded-full font-semibold px-5 h-10"
              >
                Accedi
              </Button>
            </Link>
            <Link href="/partner">
              <Button className="bg-stone-900 text-white hover:bg-stone-800 rounded-full font-semibold px-5 h-10 text-xs sm:text-sm shadow-md">
                Sei un&apos;attività? Unisciti
              </Button>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Apri menu"
            className="sm:hidden p-2 rounded-xl border border-stone-200 text-stone-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden mt-3 pt-3 border-t border-stone-100 flex flex-col gap-2 pb-2">
            <Link
              href="/funzioni-sposi"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-100"
            >
              Funzioni Sposi &amp; Eventi
            </Link>
            <Link
              href="/partner"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-emerald-700 bg-emerald-50/70"
            >
              Ristoranti, Agenzie Viaggi, Torte &amp; NCC
            </Link>
            <Link
              href="/funzioni-professionisti"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-100"
            >
              Funzioni Fotografi &amp; Pro
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-100"
            >
              Blog
            </Link>
            <div className="flex gap-2 pt-1">
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full rounded-full">
                  Accedi
                </Button>
              </Link>
              <Link href="/partner" className="flex-1">
                <Button className="w-full rounded-full bg-stone-900 text-white">
                  Diventa Partner
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow pt-10 sm:pt-14 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* HERO + RICERCA EVIDENZIATA */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-8 sm:mb-10"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100/80 border border-amber-300/70 text-amber-900 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Directory Ufficiale &amp; Matchmaking Eventi
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif text-stone-900 mb-4 leading-tight">
              <span className="block">Trova i Professionisti e le Strutture</span>
              <span className="inline-block px-2 -mx-2 box-decoration-clone italic text-transparent bg-clip-text bg-gradient-to-r from-amber-800 via-rose-600 to-amber-700">
                per il Tuo Evento
              </span>
            </h1>
            <p className="text-stone-600 text-base sm:text-lg font-light leading-relaxed">
              Ristoranti, fotografi, agenzie di viaggi, pasticcerie, auto NCC, wedding planner e molto altro: esplora le vetrine verificate oppure scrivi cosa stai cercando.
            </p>
          </motion.div>

          {/* BOX CENTRALE DI RICERCA AD ALTA VISIBILITÀ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gradient-to-b from-white via-[#fffcf7] to-white p-5 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.12)] border border-amber-200/70 mb-14 sm:mb-20"
          >
            <PortalSearch
              presetQuery={presetQuery}
              presetNonce={presetNonce}
              openSegnalaNonce={openSegnalaNonce}
            />
          </motion.div>

          {/* SEZIONE VETRINE PROFESSIONISTI + SPAZI APERTI */}
          <section aria-labelledby="directory-heading" className="mb-16 sm:mb-20">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Rete GentiLuna in Espansione
                </div>
                <h2
                  id="directory-heading"
                  className="text-2xl sm:text-4xl font-serif text-stone-900 mb-2"
                >
                  Vetrine Ufficiali &amp; Nuove Selezioni di Zona
                </h2>
                <p className="text-stone-600 text-sm sm:text-base max-w-2xl">
                  Qui trovi i professionisti verificati che hanno già completato la propria scheda e le categorie strategiche (Ristoranti, Agenzie Viaggi, Pasticcerie, NCC e Partner) con selezioni aperte.
                </p>
              </div>

              {/* FILTRI RAPIDI MULTI-SETTORE */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "ALL", label: "Tutti" },
                  { id: "RISTORANTI_LOCATION", label: "Ristoranti & Location" },
                  { id: "FOTO_VIDEO", label: "Foto & Video" },
                  { id: "VIAGGI_AUTO_TORTE", label: "Viaggi, Torte & NCC" },
                  { id: "PLANNER_MUSICA_STILE", label: "Planner, Musica & Stile" },
                  { id: "OPEN_SLOTS", label: "Candidature Aperte" },
                ].map((tab) => {
                  const isActive = activeFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() =>
                        setActiveFilter(
                          tab.id as "ALL" | ProFilterGroup | "OPEN_SLOTS"
                        )
                      }
                      className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                        isActive
                          ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                          : "bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:text-stone-900"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* GRIGLIA ARMONIOSA: PROFESSIONISTI ISCRITTI + CARD "QUI POTRESTI ESSERCI TU" */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {/* 1. PROFESSIONISTI ISCRITTI CON SCHEDA COMPILATA */}
              {filteredPros.map((pro) => {
                const heroImg = pro.coverUrl || pro.galleryPreview[0] || null;
                return (
                  <article
                    key={pro.id}
                    className="group bg-white rounded-[2rem] border border-stone-200/90 hover:border-amber-300 shadow-[0_12px_35px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_50px_-15px_rgba(217,119,6,0.2)] transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    <div className="relative h-52 bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 overflow-hidden">
                      {heroImg ? (
                        <img
                          src={heroImg}
                          alt={pro.businessName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-amber-200/40 font-serif text-4xl">
                          {pro.businessName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/15 to-transparent" />

                      <div className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/95 text-white text-[11px] font-bold shadow-md backdrop-blur-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Vetrina Verificata
                      </div>

                      <div className="absolute top-3.5 right-3.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-950/80 border border-amber-400/50 text-amber-200 text-[11px] font-semibold backdrop-blur-xs">
                        <Award className="w-3 h-3 text-amber-400" />
                        {pro.categoryLabel}
                      </div>

                      <div className="absolute bottom-3.5 left-4 right-4 flex items-end gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-white p-0.5 shadow-lg border border-amber-200 shrink-0 overflow-hidden">
                          {pro.avatarUrl ? (
                            <img
                              src={pro.avatarUrl}
                              alt={pro.businessName}
                              className="w-full h-full object-cover rounded-[14px]"
                            />
                          ) : (
                            <div className="w-full h-full rounded-[14px] bg-amber-50 flex items-center justify-center font-serif font-bold text-amber-900 text-lg">
                              {pro.businessName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 text-white">
                          <h3 className="font-serif text-xl font-bold leading-snug truncate drop-shadow-sm">
                            {pro.businessName}
                          </h3>
                          <p className="text-xs text-stone-200 flex items-center gap-1 truncate">
                            <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                            <span>{pro.serviceArea || "Disponibile in tutta Italia"}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          {pro.reviewCount > 0 && pro.avgRating ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                              {pro.avgRating} ({pro.reviewCount}{" "}
                              {pro.reviewCount === 1 ? "recensione" : "recensioni"})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                              Partner Ufficiale GentiLuna
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-stone-600 line-clamp-3 leading-relaxed mb-4">
                          {pro.description}
                        </p>

                        {pro.galleryPreview.length > 1 && (
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            {pro.galleryPreview.slice(0, 3).map((imgUrl, idx) => (
                              <div
                                key={`${pro.id}-gal-${idx}`}
                                className="h-16 rounded-xl overflow-hidden bg-stone-100 border border-stone-200/60"
                              >
                                <img
                                  src={imgUrl}
                                  alt={`${pro.businessName} portfolio ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {pro.serviceNames.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {pro.serviceNames.map((srv) => (
                              <span
                                key={srv}
                                className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700"
                              >
                                {srv}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <Link href={`/pro/${pro.slug}`} className="block pt-2">
                        <Button className="w-full h-11 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold flex items-center justify-center gap-2">
                          Visita Vetrina &amp; Portfolio
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </article>
                );
              })}

              {/* 2. CARD INVITO "QUI POTRESTI ESSERCI TU / NUOVE CATEGORIE" */}
              {filteredSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`rounded-[2rem] border-2 border-dashed bg-gradient-to-br ${slot.accentBg} ${slot.accentBorder} p-6 sm:p-7 flex flex-col justify-between gap-5 transition-all duration-300 shadow-xs hover:shadow-lg relative overflow-hidden`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold ${slot.badgeClass}`}
                      >
                        <UserPlus className="w-3.5 h-3.5 shrink-0" />
                        {slot.badge}
                      </span>
                      <div
                        className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${slot.iconBg}`}
                      >
                        <SlotIcon kind={slot.icon} />
                      </div>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-1.5">
                      {slot.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-stone-700 mb-3">
                      {slot.subtitle}
                    </p>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      {slot.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-stone-200/60">
                    <Link
                      href={
                        slot.id === "slot-planner-stile"
                          ? "/partner"
                          : `/login?role=PHOTOGRAPHER&mode=REGISTER&category=${slot.categoryCode}`
                      }
                      className="block"
                    >
                      <Button className="w-full h-11 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold flex items-center justify-center gap-2 border-none shadow-sm text-xs sm:text-sm">
                        {slot.ctaLabel}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      <Link
                        href={`/login?role=PHOTOGRAPHER&mode=REGISTER&category=${slot.categoryCode}&plan=PRO_FOUNDERS_49`}
                        className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline"
                      >
                        Oppure VIP PRO 49€/anno →
                      </Link>
                      <button
                        type="button"
                        onClick={() => triggerSearchPreset(slot.couplePrompt)}
                        className="text-[11px] font-semibold text-stone-600 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        Sposi: richiedi Match ↑
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* 3. CARD SEGNALAZIONE TALENTO CONSIGLIATO DAGLI SPOSI */}
              <div className="rounded-[2rem] border border-rose-200 bg-gradient-to-br from-rose-50/80 via-white to-amber-50/60 p-6 sm:p-7 flex flex-col justify-between gap-5 shadow-xs">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 border border-rose-200 text-rose-900 text-[11px] font-bold mb-4">
                    <Send className="w-3.5 h-3.5 text-rose-600" />
                    Consigliato dagli Sposi
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-2">
                    Conosci un ristorante o fornitore speciale nella tua zona?
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Stiamo selezionando ristoranti, agenzie viaggi, pasticcerie, NCC, fotografi e fornitori d&apos;eccellenza in ogni provincia. Segnalacelo e lo inviteremo su GentiLuna!
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenSegnalaNonce((n) => n + 1)}
                  className="w-full h-11 rounded-xl bg-white border-rose-300 text-rose-700 hover:bg-rose-50 font-bold"
                >
                  Segnala un&apos;Attività
                </Button>
              </div>
            </div>
          </section>

          {/* BANNER ZONE & REGIONI CON SELEZIONE APERTA */}
          <section className="rounded-[2.25rem] bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 text-white p-6 sm:p-10 md:p-12 border border-amber-400/25 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
                  <MapPin className="w-3.5 h-3.5" />
                  Copertura Italia • Ristoranti, Viaggi, Torte, NCC &amp; Pro
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-white mb-3 leading-tight">
                  Nella tua zona ci sono ancora{" "}
                  <span className="text-amber-300 italic">posti liberi in prima fila.</span>
                </h2>
                <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed mb-6">
                  Se organizzi un evento, clicca la tua regione per ricevere fino a 3 proposte su misura. Se gestisci un{" "}
                  <strong className="text-amber-200">ristorante, agenzia viaggi, pasticceria, flotta NCC o studio professionale</strong>, scopri il nuovo programma Partner.
                </p>

                <div className="flex flex-wrap gap-2">
                  {EXPANSION_REGIONS.map((region) => (
                    <button
                      key={region}
                      type="button"
                      onClick={() =>
                        triggerSearchPreset(
                          `Cerco ristorante e fornitori per matrimonio in ${region}`
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-amber-400/20 border border-white/15 hover:border-amber-300/50 text-xs font-medium text-stone-200 hover:text-white transition-all cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {region}
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 bg-white/5 border border-amber-300/25 rounded-3xl p-6 sm:p-7 backdrop-blur-sm">
                <div className="text-amber-300 text-xs font-bold uppercase tracking-widest mb-2">
                  Vetrina Base Gratuita + Piani PRO
                </div>
                <h3 className="font-serif text-2xl text-white mb-2">
                  Qui potresti esserci tu!
                </h3>
                <ul className="space-y-2.5 text-sm text-stone-300 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Vetrina Base Free (0€):</strong> iscriviti gratis e pubblica la tua scheda</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Regia Ristorante Live</strong> (tavoli + allergie) e Lista Viaggio inclusi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Upgrade VIP PRO a 49€/1° anno</strong> (poi Entry, PRO o Diamond) • 0% commissioni</span>
                  </li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <Link href="/partner" className="flex-1">
                    <Button className="w-full h-11 rounded-full bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold border-none">
                      Programma Ristoranti &amp; Partner
                    </Button>
                  </Link>
                  <Link href="/professionisti" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full h-11 rounded-full bg-transparent border-stone-600 text-stone-200 hover:bg-white/10 hover:text-white"
                    >
                      Piani Pro
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* HUB PAGINE SEO LOCALI PER CATEGORIA & REGIONE */}
          <section className="mt-14 bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-2xs">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-2">
              Ricerche Rapide per Categoria e Regione in Italia
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mb-4">
              Esplora le selezioni locali dedicate a ristoranti, fotografi, agenzie viaggi, pasticcerie e servizi NCC nelle principali destinazioni italiane:
            </p>
            <div className="flex flex-wrap gap-2">
              {getFeaturedLocalSeoSlugs()
                .slice(0, 20)
                .map((item) => (
                  <Link
                    key={item.slug}
                    href={`/fornitori/${item.slug}`}
                    className="px-3 py-1.5 rounded-full bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-300 text-xs font-medium text-stone-700 hover:text-stone-950 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
