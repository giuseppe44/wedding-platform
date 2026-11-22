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
  Building2,
  Music,
  HeartHandshake,
  Gem,
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

export type DirectoryProItem = {
  id: string;
  slug: string;
  businessName: string;
  category: string;
  categoryLabel: string;
  filterGroup: "FOTO_VIDEO" | "LOCATION" | "PLANNER_MUSICA";
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
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  filterGroup: "FOTO_VIDEO" | "LOCATION" | "PLANNER_MUSICA";
  accentBorder: string;
  accentBg: string;
  badgeClass: string;
  iconBg: string;
  couplePrompt: string;
  ctaLabel: string;
  ctaHref: string;
  icon: "camera" | "location" | "planner" | "music" | "beauty";
};

const OPEN_PARTNER_SLOTS: OpenSlotCard[] = [
  {
    id: "slot-foto-video",
    badge: "Qui potresti esserci tu • Selezione Aperta",
    title: "Fotografi & Videomaker",
    subtitle: "Cerchiamo studi selezionati nelle province ancora scoperte",
    description:
      "Consegni gallerie HD sul dominio GentiLuna, compari con il tuo QR Code durante il ricevimento davanti a tutti gli invitati e lavori a 0% commissioni.",
    filterGroup: "FOTO_VIDEO",
    accentBorder: "border-amber-300/80 hover:border-amber-400",
    accentBg: "from-[#fffbf2] via-white to-[#fff7ed]",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-300/80",
    iconBg: "bg-amber-100 text-amber-700 border-amber-200",
    couplePrompt: "Cerco fotografo e videomaker per il mio matrimonio",
    ctaLabel: "Crea la tua Vetrina Pro",
    ctaHref: "/professionisti",
    icon: "camera",
  },
  {
    id: "slot-location",
    badge: "Cerchiamo Partner in Zona",
    title: "Ville, Location & Ristoranti",
    subtitle: "Posiziona la tua struttura tra le mete consigliate agli sposi",
    description:
      "Oltre alla vetrina pubblica, GentiLuna offre il Portale Ristorante live condiviso con gli sposi per ricevere tavoli, intolleranze e allergie senza file sparsi.",
    filterGroup: "LOCATION",
    accentBorder: "border-rose-200/90 hover:border-rose-400",
    accentBg: "from-[#fff5f7] via-white to-[#fff1f2]",
    badgeClass: "bg-rose-100 text-rose-900 border-rose-200",
    iconBg: "bg-rose-100 text-rose-600 border-rose-200",
    couplePrompt: "Cerco villa, masseria o ristorante per ricevimento di matrimonio",
    ctaLabel: "Candida la tua Location",
    ctaHref: "/professionisti",
    icon: "location",
  },
  {
    id: "slot-planner",
    badge: "Spazio Riservato • Collaboratori Ricercati",
    title: "Wedding Planner & Flower Design",
    subtitle: "Diventa il punto di riferimento per le coppie della tua città",
    description:
      "Coordina timeline, tavoli e fornitori in un unico spazio condiviso con gli sposi e mostra i tuoi allestimenti con una vetrina editoriale curata.",
    filterGroup: "PLANNER_MUSICA",
    accentBorder: "border-violet-200/90 hover:border-violet-400",
    accentBg: "from-[#faf7ff] via-white to-[#f5f3ff]",
    badgeClass: "bg-violet-100 text-violet-900 border-violet-200",
    iconBg: "bg-violet-100 text-violet-700 border-violet-200",
    couplePrompt: "Cerco Wedding Planner e floral designer per matrimonio",
    ctaLabel: "Unisciti come Partner",
    ctaHref: "/professionisti",
    icon: "planner",
  },
  {
    id: "slot-music",
    badge: "Qui potresti esserci tu",
    title: "Musica Live, Band & DJ Wedding",
    subtitle: "Fatti scoprire dagli sposi e dai loro ospiti in sala",
    description:
      "Ogni invitato che apre il portale dell'evento vede i fornitori ufficiali della giornata: il modo più naturale per ricevere richieste per le prossime date.",
    filterGroup: "PLANNER_MUSICA",
    accentBorder: "border-sky-200/90 hover:border-sky-400",
    accentBg: "from-[#f2f9ff] via-white to-[#f0f9ff]",
    badgeClass: "bg-sky-100 text-sky-900 border-sky-200",
    iconBg: "bg-sky-100 text-sky-700 border-sky-200",
    couplePrompt: "Cerco band musica dal vivo e DJ per matrimonio",
    ctaLabel: "Attiva Scheda Artista",
    ctaHref: "/professionisti",
    icon: "music",
  },
  {
    id: "slot-beauty",
    badge: "Posti Fondatore • 49€ / 1° anno",
    title: "Make-up, Hair, Atelier & Cake",
    subtitle: "Cerchiamo eccellenze artigianali e bridal specialist",
    description:
      "Compila la tua scheda con foto, video, servizi e pulsante diretto WhatsApp. Blocca ora la tariffa lancio riservata ai primi 50 professionisti iscritti.",
    filterGroup: "PLANNER_MUSICA",
    accentBorder: "border-emerald-200/90 hover:border-emerald-400",
    accentBg: "from-[#f2fcf7] via-white to-[#ecfdf5]",
    badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-200",
    iconBg: "bg-emerald-100 text-emerald-700 border-emerald-200",
    couplePrompt: "Cerco make-up artist, hair stylist o atelier sposa",
    ctaLabel: "Scopri Promo Fondatori",
    ctaHref: "/professionisti",
    icon: "beauty",
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
    case "camera":
      return <Camera className="w-6 h-6" />;
    case "location":
      return <Building2 className="w-6 h-6" />;
    case "planner":
      return <HeartHandshake className="w-6 h-6" />;
    case "music":
      return <Music className="w-6 h-6" />;
    case "beauty":
      return <Gem className="w-6 h-6" />;
  }
}

export default function FornitoriDirectoryClient({
  pros,
}: {
  pros: DirectoryProItem[];
}) {
  const [activeFilter, setActiveFilter] = useState<
    "ALL" | "FOTO_VIDEO" | "LOCATION" | "PLANNER_MUSICA" | "OPEN_SLOTS"
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
              Funzioni Sposi &amp; Eventi
            </Link>
            <Link href="/funzioni-professionisti" className="hover:text-amber-600 transition-colors">
              Funzioni Professionisti
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
            <Link href="/professionisti">
              <Button className="bg-stone-900 text-white hover:bg-stone-800 rounded-full font-semibold px-5 h-10 text-xs sm:text-sm shadow-md">
                Sei un professionista?
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
              href="/funzioni-professionisti"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-100"
            >
              Funzioni Professionisti
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
              <Link href="/professionisti" className="flex-1">
                <Button className="w-full rounded-full bg-stone-900 text-white">
                  Area Pro
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
              Directory Ufficiale &amp; Matchmaking Sposi
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif text-stone-900 mb-4 leading-tight">
              Trova i Professionisti Giusti{" "}
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-amber-800 via-rose-600 to-amber-700">
                per il Tuo Evento
              </span>
            </h1>
            <p className="text-stone-600 text-base sm:text-lg font-light leading-relaxed">
              Esplora le vetrine dei professionisti verificati già presenti su GentiLuna oppure
              descrivi qui sotto cosa stai cercando per ricevere gratuitamente proposte su misura.
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
                  Qui trovi i primi professionisti verificati che hanno già completato la propria
                  scheda ufficiale e le categorie in cui stiamo ancora selezionando nuovi partner
                  sul territorio.
                </p>
              </div>

              {/* FILTRI RAPIDI */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "ALL", label: "Tutti" },
                  { id: "FOTO_VIDEO", label: "Foto & Video" },
                  { id: "LOCATION", label: "Location & Ristoranti" },
                  { id: "PLANNER_MUSICA", label: "Planner, Fiori & Musica" },
                  { id: "OPEN_SLOTS", label: "Candidature Aperte" },
                ].map((tab) => {
                  const isActive = activeFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() =>
                        setActiveFilter(
                          tab.id as
                            | "ALL"
                            | "FOTO_VIDEO"
                            | "LOCATION"
                            | "PLANNER_MUSICA"
                            | "OPEN_SLOTS"
                        )
                      }
                      className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
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
                    {/* IMMAGINE DI COPERTINA */}
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

                      {/* BADGE VERIFICATO */}
                      <div className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/95 text-white text-[11px] font-bold shadow-md backdrop-blur-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Vetrina Verificata
                      </div>

                      <div className="absolute top-3.5 right-3.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-950/80 border border-amber-400/50 text-amber-200 text-[11px] font-semibold backdrop-blur-xs">
                        <Award className="w-3 h-3 text-amber-400" />
                        {pro.categoryLabel}
                      </div>

                      {/* AVATAR + NOME */}
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

                    {/* CONTENUTO CARD */}
                    <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                      <div>
                        {/* RATING O PARTNER FONDATORE */}
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
                          {pro.description ||
                            `Scopri il portfolio fotografico, i servizi dedicati agli sposi e contatta direttamente ${pro.businessName} nella sua vetrina ufficiale.`}
                        </p>

                        {/* MINI ANTEPRIMA PORTFOLIO */}
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

              {/* 2. CARD INVITO "QUI POTRESTI ESSERCI TU / CERCHIAMO COLLABORATORI" */}
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

                  <div className="space-y-2.5 pt-2 border-t border-stone-200/60">
                    <Link href={slot.ctaHref} className="block">
                      <Button className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold flex items-center justify-center gap-2 border-none shadow-sm">
                        {slot.ctaLabel}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    <button
                      type="button"
                      onClick={() => triggerSearchPreset(slot.couplePrompt)}
                      className="w-full text-center text-xs font-semibold text-stone-600 hover:text-rose-600 py-1 transition-colors cursor-pointer"
                    >
                      Sei uno sposo e cerchi questa categoria? Richiedi Match ↑
                    </button>
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
                    Conosci un professionista speciale nella tua zona?
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Stiamo selezionando fotografi, location, musicisti e fornitori di qualità in
                    ogni provincia italiana. Segnalaci un talento di fiducia: lo inviteremo nella
                    directory GentiLuna!
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenSegnalaNonce((n) => n + 1)}
                  className="w-full h-11 rounded-xl bg-white border-rose-300 text-rose-700 hover:bg-rose-50 font-bold"
                >
                  Segnala un Professionista
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
                  Copertura Italia • Cerchiamo Collaboratori &amp; Partner
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-white mb-3 leading-tight">
                  Nella tua zona ci sono ancora{" "}
                  <span className="text-amber-300 italic">posti liberi in prima fila.</span>
                </h2>
                <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed mb-6">
                  Se sei una <strong className="text-white">coppia di sposi</strong>, clicca la tua
                  regione per cercare subito i fornitori disponibili. Se sei un{" "}
                  <strong className="text-amber-200">professionista del matrimonio</strong>, prenota
                  adesso la tua vetrina ufficiale prima che la tua provincia si completi.
                </p>

                <div className="flex flex-wrap gap-2">
                  {EXPANSION_REGIONS.map((region) => (
                    <button
                      key={region}
                      type="button"
                      onClick={() =>
                        triggerSearchPreset(
                          `Cerco fornitori per matrimonio in ${region}`
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
                  Offerta Primi 50 Professionisti
                </div>
                <h3 className="font-serif text-2xl text-white mb-2">
                  Qui potresti esserci tu!
                </h3>
                <ul className="space-y-2.5 text-sm text-stone-300 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Vetrina verificata con portfolio foto, video e recensioni reali</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>QR Code personale e visibilità diretta agli invitati degli eventi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Zero commissioni sui preventivi • Solo 49,00 € il 1° anno</span>
                  </li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <Link href="/professionisti" className="flex-1">
                    <Button className="w-full h-11 rounded-full bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold border-none">
                      Diventa Partner Ora
                    </Button>
                  </Link>
                  <Link href="/funzioni-professionisti" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full h-11 rounded-full bg-transparent border-stone-600 text-stone-200 hover:bg-white/10 hover:text-white"
                    >
                      Scopri tutte le funzioni
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
