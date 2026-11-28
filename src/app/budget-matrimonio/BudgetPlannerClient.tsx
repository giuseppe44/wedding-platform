"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Calculator,
  Sparkles,
  Users,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Info,
  Share2,
  Copy,
  Check,
  Printer,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Calendar,
  Send,
  Star,
  Menu,
  X,
  ShieldCheck,
  Heart,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Footer from "@/components/Footer";
import { GentiLunaBrand } from "@/components/GentiLunaLogo";
import { ITALIAN_PROVINCES, PROVINCE_MAP } from "@/lib/provinceQuota";
import { submitLead } from "@/app/actions/leadActions";
import {
  BUDGET_DISCLAIMER_TEXT,
  BUDGET_IDEA_SCENARIOS,
  EVENT_TYPE_META,
  PRIORITY_META,
  VENUE_FORMULA_META,
  calculateSmartBudgetPlan,
  formatEuro,
  type BudgetEventType,
  type BudgetLineItem,
  type BudgetPlannerInput,
  type BudgetPriorityKey,
  type HoneymoonMode,
  type SeasonChoice,
  type VenueFormula,
} from "@/lib/budgetPlannerEngine";

export type SuggestedBudgetPro = {
  id: string;
  slug: string;
  businessName: string;
  category: string;
  categoryLabel: string;
  province: string | null;
  serviceArea: string | null;
  avatarUrl: string | null;
  reviewCount: number;
  avgRating: string | null;
};

interface BudgetPlannerClientProps {
  pros: SuggestedBudgetPro[];
  initialTab: "SIMULATORE" | "IDEE";
  initialInput: BudgetPlannerInput;
}

export default function BudgetPlannerClient({
  pros,
  initialTab,
  initialInput,
}: BudgetPlannerClientProps) {
  const [activeTab, setActiveTab] = useState<"SIMULATORE" | "IDEE">(initialTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Simulator State
  const [eventType, setEventType] = useState<BudgetEventType>(
    initialInput.eventType
  );
  const [totalBudget, setTotalBudget] = useState<number>(
    initialInput.totalBudget
  );
  const [guestsCount, setGuestsCount] = useState<number>(
    initialInput.guestsCount
  );
  const [venueFormula, setVenueFormula] = useState<VenueFormula>(
    initialInput.venueFormula
  );
  const [season, setSeason] = useState<SeasonChoice>(initialInput.season);
  const [honeymoonMode, setHoneymoonMode] = useState<HoneymoonMode>(
    initialInput.honeymoonMode
  );
  const [priorities, setPriorities] = useState<BudgetPriorityKey[]>(
    initialInput.priorities
  );
  const [provinceCode, setProvinceCode] = useState<string>(
    initialInput.provinceCode || ""
  );

  // Expanded cards (first 2 open by default for immediate value)
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    reception: true,
    "photo-video": true,
    "milestone-food": true,
  });

  // Share & Lead Modal State
  const [copiedLink, setCopiedLink] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadFocusCategory, setLeadFocusCategory] = useState<string>("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadNotes, setLeadNotes] = useState("");
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);

  const eventMeta = EVENT_TYPE_META[eventType];
  const selectedProvinceMeta = provinceCode
    ? PROVINCE_MAP[provinceCode] || null
    : null;

  const plan = useMemo(
    () =>
      calculateSmartBudgetPlan({
        eventType,
        totalBudget,
        guestsCount,
        venueFormula,
        season,
        honeymoonMode,
        priorities,
        provinceCode,
      }),
    [
      eventType,
      totalBudget,
      guestsCount,
      venueFormula,
      season,
      honeymoonMode,
      priorities,
      provinceCode,
    ]
  );

  const handleEventTypeChange = (nextType: BudgetEventType) => {
    const nextMeta = EVENT_TYPE_META[nextType];
    setEventType(nextType);
    setTotalBudget(nextMeta.defaultBudget);
    setGuestsCount(nextMeta.defaultGuests);
    setExpandedIds({
      reception: true,
      "photo-video": true,
      "milestone-food": true,
      "milestone-photo": true,
    });
  };

  const togglePriority = (key: BudgetPriorityKey) => {
    setPriorities((prev) => {
      if (prev.includes(key)) {
        return prev.filter((k) => k !== key);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), key];
      }
      return [...prev, key];
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = (open: boolean) => {
    const next: Record<string, boolean> = {};
    for (const item of plan.items) {
      next[item.id] = open;
    }
    setExpandedIds(next);
  };

  const applyScenarioPreset = (preset: BudgetPlannerInput) => {
    setEventType(preset.eventType);
    setTotalBudget(preset.totalBudget);
    setGuestsCount(preset.guestsCount);
    setVenueFormula(preset.venueFormula);
    setSeason(preset.season);
    setHoneymoonMode(preset.honeymoonMode);
    setPriorities(preset.priorities);
    setActiveTab("SIMULATORE");
    setExpandedIds({
      reception: true,
      "photo-video": true,
      "milestone-food": true,
    });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 240, behavior: "smooth" });
    }
  };

  const buildShareUrl = () => {
    const base =
      typeof window !== "undefined"
        ? `${window.location.origin}/budget-matrimonio`
        : "https://www.gentiluna.com/budget-matrimonio";
    const params = new URLSearchParams();
    params.set("e", eventType);
    params.set("b", String(plan.input.totalBudget));
    params.set("g", String(plan.input.guestsCount));
    params.set("v", venueFormula);
    params.set("s", season);
    params.set("h", honeymoonMode);
    if (priorities.length > 0) params.set("p", priorities.join(","));
    if (provinceCode) params.set("prov", provinceCode);
    return `${base}?${params.toString()}`;
  };

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(buildShareUrl());
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2600);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleWhatsAppShare = () => {
    const url = buildShareUrl();
    const topItems = plan.items
      .slice(0, 4)
      .map((i) => `• ${i.shortTitle}: ${formatEuro(i.allocatedAmount)}`)
      .join("\n");
    const msg = `Guarda questa simulazione ipotetica di budget per ${eventMeta.label} che ho preparato su GentiLuna ✨\n\nBudget: ${formatEuro(plan.input.totalBudget)} (${plan.input.guestsCount} invitati)\n${topItems}\n\nAprila e modificala qui:\n${url}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const matchProsForItem = (item: BudgetLineItem): {
    localPros: SuggestedBudgetPro[];
    nationalPros: SuggestedBudgetPro[];
  } => {
    if (!item.matchingCategoryCodes || item.matchingCategoryCodes.length === 0) {
      return { localPros: [], nationalPros: [] };
    }
    const categoryMatches = pros.filter((p) =>
      item.matchingCategoryCodes.includes(p.category)
    );
    if (!provinceCode) {
      return { localPros: [], nationalPros: categoryMatches.slice(0, 3) };
    }

    const provMeta = PROVINCE_MAP[provinceCode];
    const cityKeyword = provMeta
      ? provMeta.name.split(" ")[0].toLowerCase()
      : "";
    const regionKeyword = provMeta ? provMeta.region.toLowerCase() : "";

    const localPros = categoryMatches.filter((p) => {
      if (p.province && p.province.toUpperCase() === provinceCode) return true;
      const area = (p.serviceArea || "").toLowerCase();
      if (cityKeyword && area.includes(cityKeyword)) return true;
      if (regionKeyword && area.includes(regionKeyword)) return true;
      return false;
    });

    const localIds = new Set(localPros.map((p) => p.id));
    const nationalPros = categoryMatches
      .filter((p) => !localIds.has(p.id))
      .slice(0, 2);

    return {
      localPros: localPros.slice(0, 3),
      nationalPros,
    };
  };

  const openLeadModal = (categoryTitle?: string) => {
    setLeadFocusCategory(categoryTitle || "");
    setLeadSuccess(false);
    setLeadModalOpen(true);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail.trim()) return;
    setLeadSubmitting(true);
    try {
      const fd = new FormData();
      fd.set("email", leadEmail.trim());
      fd.set("intent", "BUDGET_PLANNER_SPOSI");

      const breakdownText = plan.items
        .map((i) => `${i.shortTitle}: ${formatEuro(i.allocatedAmount)}`)
        .join(" | ");

      const detailsLines = [
        `Origine: Simulatore Budget GentiLuna`,
        `Evento: ${eventMeta.label}`,
        `Budget Ipotetico: ${formatEuro(plan.input.totalBudget)} (${plan.input.guestsCount} ospiti)`,
        `Formula Ricevimento: ${VENUE_FORMULA_META[venueFormula].shortLabel}`,
        `Provincia: ${selectedProvinceMeta ? `${selectedProvinceMeta.name} (${provinceCode})` : "Non specificata"}`,
        leadFocusCategory ? `Voce di interesse: ${leadFocusCategory}` : "",
        leadPhone.trim() ? `Telefono/WhatsApp: ${leadPhone.trim()}` : "",
        leadNotes.trim() ? `Note cliente: ${leadNotes.trim()}` : "",
        `Ripartizione simulata: ${breakdownText}`,
      ]
        .filter(Boolean)
        .join("\n");

      fd.set("details", detailsLines);
      const res = await submitLead(fd);
      if (res.success) {
        setLeadSuccess(true);
      }
    } finally {
      setLeadSubmitting(false);
    }
  };

  const quickBudgetChips =
    eventType === "WEDDING"
      ? [10000, 18000, 25000, 35000, 50000]
      : [2000, 3500, 5500, 8500];

  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans text-stone-900 flex flex-col overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="sticky top-0 w-full z-50 px-4 sm:px-8 py-4 bg-white/95 backdrop-blur-md border-b border-stone-200/80 print:hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-3">
          <Link
            href="/"
            className="shrink-0"
          >
            <GentiLunaBrand theme="light" size="md" />
          </Link>

          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-widest text-stone-600">
            <Link href="/sposi" className="hover:text-rose-600 transition-colors">
              Per gli Sposi
            </Link>
            <Link
              href="/fornitori"
              className="hover:text-amber-700 transition-colors"
            >
              Fornitori &amp; Location
            </Link>
            <Link
              href="/funzioni-sposi"
              className="hover:text-stone-950 transition-colors"
            >
              Funzioni Evento
            </Link>
            <Link
              href="/prezzi"
              className="hover:text-stone-950 transition-colors"
            >
              Piani
            </Link>
            <Link href="/blog" className="hover:text-stone-950 transition-colors">
              Guide Blog
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/login?role=COUPLE&mode=REGISTER">
              <Button className="rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs sm:text-sm px-4 sm:px-6 h-9 sm:h-10">
                Crea Spazio Gratis
              </Button>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
              className="lg:hidden p-1.5 text-stone-700"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-stone-200 flex flex-col gap-2 text-sm font-medium text-stone-700">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-2 rounded-lg hover:bg-stone-100"
            >
              Home Page
            </Link>
            <Link
              href="/sposi"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-2 rounded-lg hover:bg-stone-100"
            >
              Area Sposi
            </Link>
            <Link
              href="/fornitori"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-2 rounded-lg hover:bg-stone-100"
            >
              Directory Fornitori
            </Link>
            <Link
              href="/funzioni-sposi"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-2 rounded-lg hover:bg-stone-100"
            >
              Funzioni Sposi &amp; Eventi
            </Link>
            <Link
              href="/prezzi"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-2 rounded-lg hover:bg-stone-100"
            >
              Piani &amp; Prezzi
            </Link>
          </div>
        )}
      </nav>

      {/* INTESTAZIONE SOLO PER LA STAMPA PDF */}
      <div className="hidden print:block border-b-2 border-stone-800 pb-4 mb-6 px-6 pt-6">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs uppercase tracking-widest text-stone-500 font-bold">
              GentiLuna.com • Bussola Organizzativa &amp; Simulazione Ipotetica
            </p>
            <h1 className="text-2xl font-serif font-bold text-stone-900 mt-1">
              Ipotesi di Budget {eventMeta.label}:{" "}
              {formatEuro(plan.input.totalBudget)} ({plan.input.guestsCount}{" "}
              invitati)
            </h1>
          </div>
          <p className="text-xs text-stone-500">
            Generato il {new Date().toLocaleDateString("it-IT")}
          </p>
        </div>
      </div>

      {/* HERO EDITORIALE CON DOPPIO INGRESSO */}
      <header className="relative bg-stone-950 text-white pt-12 pb-16 sm:pt-16 sm:pb-20 px-4 sm:px-6 overflow-hidden print:hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950/50 via-stone-950 to-rose-950/50 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.14),transparent_65%)] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-300/35 text-amber-200 text-xs font-bold uppercase tracking-widest mb-5">
            <Calculator className="w-3.5 h-3.5 text-amber-300" /> Strumento
            Gratuito • Pianifica il tuo Evento
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-[3.4rem] font-serif leading-[1.15] mb-4">
            Hai in mente un budget?{" "}
            <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-amber-100">
              Parti da lì e organizza tutto.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-stone-300 font-light max-w-3xl mx-auto leading-relaxed mb-8">
            Inserisci la cifra che vorresti investire per scoprire come
            distribuirla con equilibrio tra{" "}
            <strong className="text-white font-medium">
              Ristorante o Villa
            </strong>
            ,{" "}
            <strong className="text-white font-medium">
              Fotografo, Musica, Fiori e Abiti
            </strong>
            , chi contattare e cosa chiedere — oppure lasciati ispirare dalle
            nostre{" "}
            <strong className="text-amber-200 font-medium">
              6 Idee di Budget pronte
            </strong>
            .
          </p>

          {/* SELETTORE PRINCIPALE MODALITÀ */}
          <div className="inline-flex flex-col sm:flex-row p-1.5 rounded-3xl sm:rounded-full bg-white/10 backdrop-blur-md border border-white/15 gap-1.5 w-full sm:w-auto max-w-xl mx-auto">
            <button
              type="button"
              onClick={() => setActiveTab("SIMULATORE")}
              className={`px-6 py-3 rounded-2xl sm:rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2 ${
                activeTab === "SIMULATORE"
                  ? "bg-amber-400 text-stone-950 shadow-lg"
                  : "text-stone-200 hover:bg-white/10"
              }`}
            >
              <Calculator className="w-4 h-4 shrink-0" />
              <span>1. Inserisci il Tuo Budget (Su Misura)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("IDEE")}
              className={`px-6 py-3 rounded-2xl sm:rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2 ${
                activeTab === "IDEE"
                  ? "bg-rose-500 text-white shadow-lg"
                  : "text-stone-200 hover:bg-white/10"
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>2. Vedi 6 Idee di Budget Pronte</span>
            </button>
          </div>
        </div>
      </header>

      {/* AVVISO CHIARO ED ELEGANTE SULLA NATURA IPOTETICA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 relative z-20 w-full">
        <div className="bg-amber-50/95 backdrop-blur-md border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-md flex items-start gap-3.5">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-[13px] text-amber-950/90 leading-relaxed">
            <strong>Idea ipotetica da personalizzare:</strong> questo strumento
            ti offre una traccia pratica per iniziare a organizzare l&apos;evento.
            Non è un preventivo definitivo: tutte le voci andranno poi{" "}
            <strong>rettificate e confermate</strong> in base alla location o al
            ristorante scelto, al numero di invitati e ai professionisti.
          </p>
        </div>
      </div>

      {/* =================================================================== */}
      {/* TAB 2: LE 6 IDEE DI BUDGET PRONTE                                   */}
      {/* =================================================================== */}
      {activeTab === "IDEE" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 w-full">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-4xl font-serif text-stone-900 mb-3">
              Cosa puoi realizzare concretamente con ogni fascia di budget?
            </h2>
            <p className="text-stone-600 font-light text-sm sm:text-base leading-relaxed">
              Se non hai ancora scelto una cifra precisa, esplora questi{" "}
              <strong>6 progetti ipotetici reali</strong> studiati sulle
              differenze tra ristoranti, agriturismi, ville in esclusiva e team
              di professionisti. Clicca su qualsiasi idea per aprirla e
              modificarla a piacere nel simulatore!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BUDGET_IDEA_SCENARIOS.map((sc) => {
              const isDark = sc.id === "luxury-weekend";
              return (
                <div
                  key={sc.id}
                  className={`rounded-3xl border p-6 sm:p-7 bg-gradient-to-br ${sc.accentGradient} ${sc.borderClass} shadow-sm hover:shadow-xl transition-all flex flex-col justify-between gap-6`}
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                          isDark
                            ? "bg-amber-400/20 text-amber-200 border border-amber-400/40"
                            : "bg-white/90 text-stone-800 border border-stone-200"
                        }`}
                      >
                        {sc.badge}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          isDark ? "text-stone-300" : "text-stone-500"
                        }`}
                      >
                        {sc.guestsLabel}
                      </span>
                    </div>

                    <div
                      className={`text-2xl sm:text-3xl font-bold mb-1 ${
                        isDark ? "text-amber-300" : "text-stone-900"
                      }`}
                    >
                      {sc.budgetRangeLabel}
                    </div>
                    <h3
                      className={`font-serif text-xl font-bold mb-3 ${
                        isDark ? "text-white" : "text-stone-800"
                      }`}
                    >
                      {sc.title}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed mb-5 ${
                        isDark ? "text-stone-300" : "text-stone-600"
                      }`}
                    >
                      {sc.summary}
                    </p>

                    <div className="space-y-2.5 mb-5">
                      <p
                        className={`text-xs font-bold uppercase tracking-wider ${
                          isDark ? "text-amber-200" : "text-stone-800"
                        }`}
                      >
                        Cosa puoi fare in questa fascia:
                      </p>
                      {sc.whatYouCanDo.map((point, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs leading-relaxed">
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                              isDark ? "text-amber-300" : "text-emerald-600"
                            }`}
                          />
                          <span className={isDark ? "text-stone-200" : "text-stone-700"}>
                            {point}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div
                      className={`rounded-2xl p-3.5 text-xs leading-relaxed ${
                        isDark
                          ? "bg-white/10 text-amber-100 border border-white/10"
                          : "bg-stone-900/5 text-stone-700 border border-stone-200/70"
                      }`}
                    >
                      <strong className="font-semibold block mb-1">
                        💡 Dritte furbe per non sforare:
                      </strong>
                      {sc.smartTradeoffs.map((tip, idx) => (
                        <p key={idx} className={idx > 0 ? "mt-1" : ""}>
                          • {tip}
                        </p>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={() => applyScenarioPreset(sc.presetInput)}
                    className={`w-full rounded-full h-11 font-bold text-xs sm:text-sm ${
                      isDark
                        ? "bg-amber-400 hover:bg-amber-300 text-stone-950"
                        : "bg-stone-900 hover:bg-stone-800 text-white"
                    }`}
                  >
                    <span>Apri e Personalizza nel Simulatore</span>
                    <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
                  </Button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =================================================================== */}
      {/* TAB 1: IL SIMULATORE SU MISURA                                      */}
      {/* =================================================================== */}
      {activeTab === "SIMULATORE" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* COLONNA SINISTRA: PARAMETRI DEL CLIENTE (5 col) */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200/90 shadow-sm p-5 sm:p-7 space-y-6 print:hidden">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-rose-600">
                  Passo 1 • Configura la tua idea
                </span>
                <h2 className="text-2xl font-serif font-bold text-stone-900 mt-1">
                  Imposta Budget, Ospiti e Stile
                </h2>
              </div>

              {/* Tipo di Evento */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  Quale evento stai progettando?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(EVENT_TYPE_META) as BudgetEventType[]).map(
                    (typeKey) => {
                      const active = eventType === typeKey;
                      return (
                        <button
                          key={typeKey}
                          type="button"
                          onClick={() => handleEventTypeChange(typeKey)}
                          className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
                            active
                              ? "bg-stone-900 text-amber-200 border-stone-900 shadow-sm"
                              : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                          }`}
                        >
                          {EVENT_TYPE_META[typeKey].shortLabel}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Budget Totale */}
              <div className="bg-[#faf9f8] rounded-2xl p-4 border border-stone-200/80">
                <div className="flex justify-between items-baseline gap-2 mb-2">
                  <label
                    htmlFor="budget-number-input"
                    className="text-xs font-bold uppercase tracking-wider text-stone-700"
                  >
                    Il tuo Budget Ipotetico (€)
                  </label>
                  <span className="text-xl sm:text-2xl font-bold text-rose-600">
                    {formatEuro(totalBudget)}
                  </span>
                </div>

                <input
                  type="range"
                  aria-label="Seleziona budget totale"
                  min={eventMeta.minBudget}
                  max={eventMeta.maxBudget}
                  step={eventMeta.stepBudget}
                  value={Math.min(eventMeta.maxBudget, totalBudget)}
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer h-2 bg-stone-200 rounded-lg mb-3"
                />

                <div className="flex items-center gap-2 mb-3">
                  <Input
                    id="budget-number-input"
                    type="number"
                    min={1000}
                    max={250000}
                    step={250}
                    value={totalBudget}
                    onChange={(e) =>
                      setTotalBudget(Math.max(1000, Number(e.target.value) || 0))
                    }
                    className="bg-white font-semibold text-stone-900 h-10"
                  />
                  <span className="text-xs text-stone-500 shrink-0">
                    Inserisci cifra esatta
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {quickBudgetChips.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setTotalBudget(val)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                        totalBudget === val
                          ? "bg-rose-600 text-white border-rose-600"
                          : "bg-white text-stone-600 border-stone-200 hover:border-rose-300"
                      }`}
                    >
                      {formatEuro(val)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Numero Invitati */}
              <div className="bg-[#faf9f8] rounded-2xl p-4 border border-stone-200/80">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-amber-600" /> Numero Invitati
                    Stimato
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setGuestsCount((g) => Math.max(eventMeta.minGuests, g - 5))
                      }
                      className="w-7 h-7 rounded-full bg-white border border-stone-300 text-sm font-bold hover:bg-stone-100"
                    >
                      -
                    </button>
                    <span className="font-bold text-lg text-stone-900 min-w-[3.2rem] text-center">
                      {guestsCount}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setGuestsCount((g) => Math.min(eventMeta.maxGuests, g + 5))
                      }
                      className="w-7 h-7 rounded-full bg-white border border-stone-300 text-sm font-bold hover:bg-stone-100"
                    >
                      +
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  aria-label="Numero invitati"
                  min={eventMeta.minGuests}
                  max={eventMeta.maxGuests}
                  step={5}
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
                />
                <p className="text-[11px] text-stone-500 mt-1.5">
                  Fondamentale: il ristorante/catering varia a persona, mentre
                  fotografo, abiti o DJ sono costi fissi!
                </p>
              </div>

              {/* Provincia opzionale */}
              <div>
                <label
                  htmlFor="budget-province-select"
                  className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 inline mr-1 text-emerald-600" />
                  Provincia dell&apos;evento (opzionale, per suggerimenti mirati)
                </label>
                <select
                  id="budget-province-select"
                  value={provinceCode}
                  onChange={(e) => setProvinceCode(e.target.value)}
                  className="w-full h-10 rounded-xl border border-stone-300 bg-white px-3 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="">Tutta Italia (Media Nazionale)</option>
                  {ITALIAN_PROVINCES.map((prov) => (
                    <option key={prov.code} value={prov.code}>
                      {prov.name} ({prov.code}) — {prov.region}
                    </option>
                  ))}
                </select>
              </div>

              {/* Opzioni specifiche Matrimonio */}
              {eventType === "WEDDING" && (
                <>
                  {/* Scelta Formula Ristorante vs Villa */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                      Formula Ricevimento (Cambia molto i costi!)
                    </label>
                    <div className="space-y-2">
                      {(Object.keys(VENUE_FORMULA_META) as VenueFormula[]).map(
                        (vf) => {
                          const metaVf = VENUE_FORMULA_META[vf];
                          const active = venueFormula === vf;
                          return (
                            <button
                              key={vf}
                              type="button"
                              onClick={() => setVenueFormula(vf)}
                              className={`w-full text-left p-3 rounded-2xl border transition-all ${
                                active
                                  ? "border-emerald-500 bg-emerald-50/60 shadow-sm"
                                  : "border-stone-200 bg-white hover:bg-stone-50"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-xs sm:text-sm text-stone-900">
                                  {metaVf.label}
                                </span>
                                <span
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                    active
                                      ? "border-emerald-600 bg-emerald-600 text-white"
                                      : "border-stone-300"
                                  }`}
                                >
                                  {active && <Check className="w-2.5 h-2.5" />}
                                </span>
                              </div>
                              <p className="text-[11px] font-semibold text-emerald-800 mt-0.5">
                                {metaVf.costStructureBadge}
                              </p>
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* Giorno / Stagione */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                      Stagione &amp; Giorno della settimana
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSeason("PEAK_WEEKEND")}
                        className={`p-3 rounded-xl border text-left text-xs transition-all ${
                          season === "PEAK_WEEKEND"
                            ? "border-stone-900 bg-stone-900 text-white font-semibold"
                            : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        <div className="font-bold">Sabato / Alta Stagione</div>
                        <div className="opacity-80 text-[11px] mt-0.5">
                          Maggio – Settembre standard
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSeason("SMART_WEEKDAY")}
                        className={`p-3 rounded-xl border text-left text-xs transition-all ${
                          season === "SMART_WEEKDAY"
                            ? "border-amber-500 bg-amber-50 text-amber-950 font-semibold"
                            : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        <div className="font-bold">
                          Venerdì / Domenica / Media Stag.
                        </div>
                        <div className="text-emerald-700 font-semibold text-[11px] mt-0.5">
                          Ottimizza fino al 12% i costi!
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Luna di Miele */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                      Come gestite la Luna di Miele?
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        type="button"
                        onClick={() => setHoneymoonMode("GIFT_FUNDED")}
                        className={`p-3 rounded-xl border text-left text-xs transition-all ${
                          honeymoonMode === "GIFT_FUNDED"
                            ? "border-sky-500 bg-sky-50/70 text-sky-950"
                            : "border-stone-200 bg-white text-stone-700"
                        }`}
                      >
                        <span className="font-bold block">
                          ✈️ Gestita con Lista Viaggio / Lista Nozze (Consigliato)
                        </span>
                        <span className="text-[11px] text-stone-600">
                          Dedica l&apos;intero importo alla festa e organizza il
                          viaggio o i regali tramite la Lista dedicata agli ospiti.
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setHoneymoonMode("INCLUDED")}
                        className={`p-3 rounded-xl border text-left text-xs transition-all ${
                          honeymoonMode === "INCLUDED"
                            ? "border-sky-500 bg-sky-50/70 text-sky-950"
                            : "border-stone-200 bg-white text-stone-700"
                        }`}
                      >
                        <span className="font-bold block">
                          🌍 Includi il Viaggio dentro questo Budget (~14%)
                        </span>
                        <span className="text-[11px] text-stone-600">
                          Accantona già una quota dedicata alla Luna di Miele.
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Fino a 3 Priorità */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
                        Le vostre Priorità (Scegline fino a 3)
                      </label>
                      <span className="text-[11px] text-rose-600 font-semibold">
                        {priorities.length}/3 scelte
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(PRIORITY_META) as BudgetPriorityKey[]).map(
                        (pk) => {
                          const selected = priorities.includes(pk);
                          return (
                            <button
                              key={pk}
                              type="button"
                              onClick={() => togglePriority(pk)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                selected
                                  ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                                  : "bg-stone-50 text-stone-700 border-stone-200 hover:border-rose-300"
                              }`}
                            >
                              {selected ? "✦ " : ""}
                              {PRIORITY_META[pk].label}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* COLONNA DESTRA: PIANO GENERATO, GRAFICO E CONSIGLI (7 col) */}
            <div className="lg:col-span-7 space-y-6">
              {/* CARD SINTESI & SEMAFORO DI COERENZA ONESTA */}
              <div className="bg-white rounded-3xl border border-stone-200/90 shadow-md p-5 sm:p-8">
                {/* Banner Sostenibilità */}
                <div
                  className={`rounded-2xl p-4 mb-6 border flex items-start gap-3 ${
                    plan.sustainabilityStatus === "OPTIMAL"
                      ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
                      : plan.sustainabilityStatus === "BALANCED"
                      ? "bg-amber-50/80 border-amber-200 text-amber-950"
                      : "bg-rose-50/90 border-rose-300 text-rose-950"
                  }`}
                >
                  {plan.sustainabilityStatus === "STRETCHED" ? (
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2
                      className={`w-5 h-5 shrink-0 mt-0.5 ${
                        plan.sustainabilityStatus === "OPTIMAL"
                          ? "text-emerald-600"
                          : "text-amber-600"
                      }`}
                    />
                  )}
                  <div className="text-xs sm:text-sm space-y-1">
                    <p className="font-bold">{plan.sustainabilityHeadline}</p>
                    <p className="opacity-90 leading-relaxed">
                      {plan.sustainabilityMessage}
                    </p>
                    {plan.smartSuggestionTip && (
                      <p className="pt-1.5 font-medium flex items-start gap-1.5">
                        <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                        <span>{plan.smartSuggestionTip}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* 3 KPI Chiave */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  <div className="rounded-2xl bg-stone-950 text-white p-4">
                    <p className="text-[11px] uppercase tracking-wider text-stone-400">
                      Budget Totale Ipotetico
                    </p>
                    <p className="text-2xl sm:text-3xl font-serif font-bold text-amber-300 mt-0.5">
                      {formatEuro(plan.input.totalBudget)}
                    </p>
                    <p className="text-[11px] text-stone-300 mt-1">
                      Per {plan.input.guestsCount} invitati stimati
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#faf9f8] border border-stone-200 p-4">
                    <p className="text-[11px] uppercase tracking-wider text-stone-500">
                      Stima Banchetto / Ospite
                    </p>
                    <p className="text-2xl font-serif font-bold text-emerald-700 mt-0.5">
                      ~{formatEuro(plan.estimatedReceptionPerGuest)}
                    </p>
                    <p className="text-[11px] text-stone-500 mt-1">
                      {plan.estimatedVenueRentalFee > 0
                        ? `+ ~${formatEuro(plan.estimatedVenueRentalFee)} affitto villa`
                        : "Sala e cucina incluse nel menù"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#faf9f8] border border-stone-200 p-4">
                    <p className="text-[11px] uppercase tracking-wider text-stone-500">
                      Media Evento Tutto Incluso
                    </p>
                    <p className="text-2xl font-serif font-bold text-stone-900 mt-0.5">
                      ~{formatEuro(plan.perGuestOverall)}
                    </p>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Somma globale divisa per ospite
                    </p>
                  </div>
                </div>

                {/* Barra Visiva Proporzionale */}
                <div className="mb-5">
                  <div className="flex justify-between items-center text-xs text-stone-500 mb-2">
                    <span className="font-semibold text-stone-700">
                      Ripartizione Visiva Consigliata
                    </span>
                    <span>100% allocato con margine sicurezza</span>
                  </div>
                  <div className="h-4 w-full rounded-full overflow-hidden flex bg-stone-100 shadow-inner">
                    {plan.items.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          width: `${Math.max(2, item.percentage)}%`,
                          backgroundColor: item.colorHex,
                        }}
                        title={`${item.shortTitle}: ${formatEuro(item.allocatedAmount)} (${item.percentage}%)`}
                        className="h-full transition-all duration-500 border-r border-white/40 last:border-r-0"
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                    {plan.items.map((item) => (
                      <div
                        key={item.id}
                        className="inline-flex items-center gap-1.5 text-xs text-stone-700"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.colorHex }}
                        />
                        <span className="font-medium">{item.shortTitle}:</span>
                        <span className="font-bold">
                          {formatEuro(item.allocatedAmount)}
                        </span>
                        <span className="text-stone-400">
                          ({item.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pulsanti Condivisione Virale, Stampa e Consulenza */}
                <div className="pt-4 border-t border-stone-200/80 flex flex-wrap items-center gap-2.5 print:hidden">
                  <Button
                    type="button"
                    onClick={handleWhatsAppShare}
                    className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 h-10"
                  >
                    <Share2 className="w-3.5 h-3.5 mr-1.5" />
                    Invia al Partner su WhatsApp
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCopyShareLink}
                    className="rounded-full border-stone-300 text-stone-800 text-xs font-semibold px-4 h-10"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                        Link Copiato!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1.5" />
                        Copia Link Ipotesi
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.print()}
                    className="rounded-full border-stone-300 text-stone-800 text-xs font-semibold px-4 h-10"
                  >
                    <Printer className="w-3.5 h-3.5 mr-1.5" />
                    Stampa / PDF
                  </Button>

                  <Button
                    type="button"
                    onClick={() => openLeadModal()}
                    className="rounded-full bg-amber-400 hover:bg-amber-500 text-stone-950 text-xs font-bold px-4 h-10 ml-auto"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    Chiedi Suggerimenti Gratuiti
                  </Button>
                </div>
              </div>

              {/* LISTA VOCI DI SPESA DETTAGLIATE + CHI CONTATTARE */}
              <div className="space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                    Dettaglio Voci, Differenze &amp; Chi Contattare
                  </h3>
                  <div className="flex items-center gap-2 text-xs print:hidden">
                    <button
                      type="button"
                      onClick={() => expandAll(true)}
                      className="text-rose-600 hover:underline font-semibold"
                    >
                      Apri tutte
                    </button>
                    <span className="text-stone-300">•</span>
                    <button
                      type="button"
                      onClick={() => expandAll(false)}
                      className="text-stone-500 hover:underline"
                    >
                      Chiudi tutte
                    </button>
                  </div>
                </div>

                {plan.items.map((item) => {
                  const isOpen = Boolean(expandedIds[item.id]);
                  const { localPros, nationalPros } = matchProsForItem(item);
                  const displayPros =
                    localPros.length > 0 ? localPros : nationalPros;

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden transition-all print:border-stone-300 print:mb-4"
                    >
                      {/* Header Cliccabile */}
                      <button
                        type="button"
                        onClick={() => toggleExpand(item.id)}
                        className="w-full p-5 sm:p-6 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/70 transition-colors"
                      >
                        <div className="space-y-1 pr-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: item.colorHex }}
                            />
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${item.badgeClass}`}
                            >
                              {item.costType === "PER_PERSON"
                                ? "Costo a Persona"
                                : item.costType === "FIXED_SERVICE"
                                ? "Ingaggio / Costo Fisso"
                                : "Misto (Fisso + Ospiti)"}
                            </span>
                            {item.isPriorityBoosted && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500 text-white">
                                ✦ Vostra Priorità
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                            {item.title}
                          </h4>
                          <p className="text-xs text-stone-600">
                            {item.recommendedTierLabel}
                          </p>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2.5 sm:pt-0 border-stone-100">
                          <div className="text-left sm:text-right">
                            <div className="text-xl sm:text-2xl font-bold text-stone-900">
                              {formatEuro(item.allocatedAmount)}
                            </div>
                            <div className="text-[11px] text-stone-500">
                              Forbice: {formatEuro(item.minSuggested)} –{" "}
                              {formatEuro(item.maxSuggested)}
                            </div>
                            {item.perGuestNote && (
                              <div className="text-[11px] font-semibold text-emerald-700">
                                {item.perGuestNote}
                              </div>
                            )}
                          </div>
                          <span className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 print:hidden">
                            {isOpen ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </span>
                        </div>
                      </button>

                      {/* Corpo Espanso (sempre visibile in stampa!) */}
                      <div
                        className={`${
                          isOpen ? "block" : "hidden print:block"
                        } px-5 sm:px-6 pb-6 pt-2 border-t border-stone-100 space-y-4 bg-[#faf9f8]/50`}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          <div className="bg-white p-4 rounded-2xl border border-stone-200/80">
                            <p className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-1.5">
                              ⚖️ Differenze tra Strutture &amp; Professionisti
                            </p>
                            <p className="text-xs text-stone-600 leading-relaxed">
                              {item.proComparisonNote}
                            </p>
                          </div>

                          <div className="bg-white p-4 rounded-2xl border border-stone-200/80">
                            <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1.5">
                              💡 Consiglio Pratico
                            </p>
                            <p className="text-xs text-stone-600 leading-relaxed">
                              {item.honestAdvice}
                            </p>
                          </div>
                        </div>

                        {/* Domande da fare prima di firmare */}
                        <div className="bg-white p-4 rounded-2xl border border-stone-200/80">
                          <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                            <p className="text-xs font-bold uppercase tracking-wider text-stone-800">
                              📋 Cosa chiedere prima di confermare il preventivo
                            </p>
                            <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                              ⏱ {item.bookingTiming}
                            </span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-stone-700">
                            {item.questionsToAsk.map((q, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-rose-500 font-bold">•</span>
                                <span>{q}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Sinergia GentiLuna */}
                        <div className="bg-gradient-to-r from-amber-50/90 to-rose-50/70 p-3.5 rounded-2xl border border-amber-200/70 flex items-start gap-2.5 text-xs text-stone-800">
                          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <span>
                            <strong>Vantaggio GentiLuna:</strong>{" "}
                            {item.gentilunaTip}
                          </span>
                        </div>

                        {/* Suggerimento Fornitori (Ibrido, Onesto e Non Vincolante) */}
                        {item.matchingCategoryCodes.length > 0 && (
                          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 print:hidden">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                              <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                  Chi contattare per questa categoria
                                </p>
                                <p className="text-[11px] text-stone-500">
                                  {localPros.length > 0 && selectedProvinceMeta
                                    ? `Alcune attività presenti su GentiLuna per ${selectedProvinceMeta.name} (puoi valutare loro o i tuoi fornitori di fiducia):`
                                    : displayPros.length > 0
                                    ? "Alcuni professionisti e partner presenti su GentiLuna che puoi consultare per farti un'idea:"
                                    : "Stiamo ampliando i partner di questa categoria nella tua zona: usa pure le domande qui sopra o richiedici qualche spunto gratuito."}
                                </p>
                              </div>
                            </div>

                            {displayPros.length > 0 && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                                {displayPros.map((pro) => (
                                  <Link
                                    key={pro.id}
                                    href={`/pro/${pro.slug}`}
                                    className="group flex items-center gap-3 p-2.5 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all"
                                  >
                                    <div className="w-11 h-11 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200 flex items-center justify-center font-serif font-bold text-stone-600">
                                      {pro.avatarUrl ? (
                                        <img
                                          src={pro.avatarUrl}
                                          alt={pro.businessName}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        pro.businessName.charAt(0)
                                      )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-xs font-bold text-stone-900 truncate group-hover:text-amber-800">
                                        {pro.businessName}
                                      </p>
                                      <p className="text-[11px] text-stone-500 truncate">
                                        {pro.categoryLabel}
                                        {pro.serviceArea
                                          ? ` • ${pro.serviceArea}`
                                          : ""}
                                      </p>
                                      {pro.avgRating && (
                                        <p className="text-[10px] text-amber-700 font-semibold flex items-center gap-1 mt-0.5">
                                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                          {pro.avgRating} ({pro.reviewCount})
                                        </p>
                                      )}
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-700 shrink-0" />
                                  </Link>
                                ))}
                              </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                              {item.fornitoriFilterGroup && (
                                <Link
                                  href={`/fornitori?group=${item.fornitoriFilterGroup}${
                                    selectedProvinceMeta
                                      ? `&q=${encodeURIComponent(
                                          selectedProvinceMeta.name.split(" ")[0]
                                        )}`
                                      : ""
                                  }`}
                                >
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full text-xs border-stone-300"
                                  >
                                    Esplora Directory {item.shortTitle} →
                                  </Button>
                                </Link>
                              )}
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => openLeadModal(item.shortTitle)}
                                className="rounded-full text-xs bg-stone-900 hover:bg-stone-800 text-amber-200"
                              >
                                Suggeritemi contatti per {item.shortTitle}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* GUIDA COMPARATIVA: RISTORANTE VS VILLA VS AGRITURISMO           */}
          {/* =============================================================== */}
          <div className="mt-14 bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-sm">
            <div className="max-w-3xl mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                Chiarezza sui Costi Reali
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1 mb-2">
                Ristorante, Agriturismo o Villa + Catering? Ecco cosa cambia
                davvero nel budget
              </h3>
              <p className="text-sm text-stone-600 font-light leading-relaxed">
                Spesso due coppie con lo stesso numero di invitati spendono
                10.000 € di differenza solo per la struttura ricettiva. Sapere
                prima come funzionano le formule ti evita sorprese nei
                preventivi:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {(Object.keys(VENUE_FORMULA_META) as VenueFormula[]).map((vf) => {
                const m = VENUE_FORMULA_META[vf];
                return (
                  <div
                    key={vf}
                    className="rounded-2xl bg-[#faf9f8] border border-stone-200/90 p-5 flex flex-col justify-between gap-3"
                  >
                    <div>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 mb-2.5">
                        {m.shortLabel}
                      </span>
                      <p className="text-xs text-stone-700 leading-relaxed mb-3">
                        {m.summary}
                      </p>
                      <p className="text-xs text-emerald-800 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-100 mb-2">
                        <strong>Punto di forza:</strong> {m.pros}
                      </p>
                      <p className="text-xs text-amber-900 bg-amber-50/80 p-2.5 rounded-xl border border-amber-100">
                        <strong>Da verificare:</strong> {m.watchOut}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =============================================================== */}
          {/* CRONOPROGRAMMA ORGANIZZATIVO PASSO-PASSO                        */}
          {/* =============================================================== */}
          <div className="mt-10 bg-stone-950 text-white rounded-3xl p-6 sm:p-10">
            <div className="max-w-3xl mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Ordine di Prenotazione
                Consigliato
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold mt-1 mb-2">
                Come muoversi passo dopo passo senza ansia
              </h3>
              <p className="text-sm text-stone-300 font-light">
                Una volta definita l&apos;idea di budget, segui questo ordine
                logico per bloccare prima chi ha disponibilità limitata a un
                solo evento al giorno:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {plan.roadmap.map((step, idx) => (
                <div
                  key={step.period}
                  className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-400/15 px-3 py-1 rounded-full">
                      {step.period}
                    </span>
                    <span className="text-stone-500 font-serif italic text-lg">
                      0{idx + 1}
                    </span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-white">
                    {step.title}
                  </h4>
                  <ul className="space-y-2 text-xs text-stone-300 leading-relaxed">
                    {step.actions.map((act, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =================================================================== */}
      {/* DISCLAIMER FINALE + CALL TO ACTION ECOSISTEMA GENTILUNA             */}
      {/* =================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 w-full space-y-8">
        <div className="rounded-2xl bg-stone-100 border border-stone-200 p-5 text-xs text-stone-600 leading-relaxed">
          {BUDGET_DISCLAIMER_TEXT}
        </div>

        <div className="rounded-[2.5rem] bg-gradient-to-br from-rose-600 via-rose-500 to-amber-500 p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 print:hidden">
          <div className="max-w-2xl text-center lg:text-left space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest bg-white/20 px-3.5 py-1 rounded-full">
              <Heart className="w-3.5 h-3.5 fill-white" /> Dal Budget
              all&apos;Evento Reale
            </span>
            <h3 className="text-2xl sm:text-4xl font-serif font-bold leading-tight">
              Hai chiarito le idee? Ora crea gratis il tuo Spazio Evento su
              GentiLuna.
            </h3>
            <p className="text-rose-50 text-sm sm:text-base font-light leading-relaxed">
              Sito matrimonio con apertura a busta, inviti digitali WhatsApp,
              conferme RSVP, mappa tavoli sincronizzata col Ristorante e QR Code
              per raccogliere tutte le foto degli invitati senza app.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
            <Link href="/login?role=COUPLE&mode=REGISTER">
              <Button className="w-full sm:w-auto rounded-full bg-stone-950 hover:bg-stone-900 text-amber-300 font-bold px-7 h-12 text-sm shadow-lg">
                Crea Spazio Evento Gratis →
              </Button>
            </Link>
            <Link href="/fornitori">
              <Button
                variant="outline"
                className="w-full sm:w-auto rounded-full bg-white/15 border-white/40 text-white hover:bg-white hover:text-stone-900 font-semibold px-6 h-12 text-sm"
              >
                Esplora Fornitori Verificati
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* MODALE RICHIESTA SUGGERIMENTI GRATUITI (COLLEGATA A LEAD) */}
      <Dialog open={leadModalOpen} onOpenChange={setLeadModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-stone-900">
              {leadSuccess
                ? "Richiesta ricevuta con successo! ✨"
                : "Vuoi ricevere spunti utili per questo budget?"}
            </DialogTitle>
            <DialogDescription className="text-stone-600 text-sm">
              {leadSuccess
                ? "Il Team di GentiLuna.com analizzerà la tua simulazione e ti risponderà via email con suggerimenti dedicati."
                : `Inviaci questa ipotesi (${formatEuro(plan.input.totalBudget)} • ${plan.input.guestsCount} ospiti${
                    leadFocusCategory ? ` • Focus: ${leadFocusCategory}` : ""
                  }): ti aiuteremo volentieri a orientarti nella tua zona.`}
            </DialogDescription>
          </DialogHeader>

          {leadSuccess ? (
            <div className="py-4 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <p className="text-xs text-stone-500">
                Nel frattempo puoi già aprire gratuitamente il tuo Spazio Evento
                per provare inviti, tavoli e galleria QR!
              </p>
              <div className="flex gap-2 justify-center pt-2">
                <Link href="/login?role=COUPLE&mode=REGISTER">
                  <Button className="rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-5">
                    Crea Spazio Sposi Gratis
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLeadModalOpen(false)}
                  className="rounded-full text-xs"
                >
                  Chiudi
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="space-y-3.5 pt-2">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  La tua Email *
                </label>
                <Input
                  type="email"
                  required
                  placeholder="es. chiara.marco@email.it"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  WhatsApp / Telefono (opzionale)
                </label>
                <Input
                  type="tel"
                  placeholder="es. 340 1234567"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Data indicativa, città o dubbi particolari (opzionale)
                </label>
                <textarea
                  rows={3}
                  placeholder="Es. Ci sposiamo a Giugno 2027 in provincia di Cagliari, cerchiamo ristorante vista mare e fotografo..."
                  value={leadNotes}
                  onChange={(e) => setLeadNotes(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <p className="text-[11px] text-stone-500 leading-snug">
                Servizio gratuito curato da{" "}
                <strong>Il Team di GentiLuna.com</strong> per aiutarti a
                orientarti tra location e fornitori.
              </p>

              <Button
                type="submit"
                disabled={leadSubmitting}
                className="w-full rounded-full bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold h-11"
              >
                {leadSubmitting
                  ? "Invio in corso..."
                  : "Invia Ipotesi & Ricevi Consigli Gratuiti"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
