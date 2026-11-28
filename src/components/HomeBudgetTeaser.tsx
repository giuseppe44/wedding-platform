"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Calculator,
  Sparkles,
  ArrowRight,
  Users,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  calculateSmartBudgetPlan,
  formatEuro,
  VENUE_FORMULA_META,
  type VenueFormula,
} from "@/lib/budgetPlannerEngine";

const QUICK_BUDGETS = [10000, 18000, 25000, 38000, 55000];
const QUICK_GUESTS = [50, 80, 110, 140];
const QUICK_VENUES: VenueFormula[] = [
  "RESTAURANT",
  "AGRITURISMO",
  "VILLA_CATERING",
];

export default function HomeBudgetTeaser() {
  const [budget, setBudget] = useState<number>(24000);
  const [guests, setGuests] = useState<number>(100);
  const [venue, setVenue] = useState<VenueFormula>("RESTAURANT");

  const plan = useMemo(
    () =>
      calculateSmartBudgetPlan({
        eventType: "WEDDING",
        totalBudget: budget,
        guestsCount: guests,
        venueFormula: venue,
        season: "PEAK_WEEKEND",
        honeymoonMode: "GIFT_FUNDED",
        priorities: ["FOOD_WINE", "PHOTO_CINEMA"],
      }),
    [budget, guests, venue]
  );

  const deepLink = `/budget-matrimonio?b=${budget}&g=${guests}&v=${venue}`;

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-[#fffaf3] to-stone-50 border-t border-amber-200/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="rounded-[2.5rem] bg-stone-950 text-white p-6 sm:p-10 lg:p-12 shadow-2xl border border-amber-300/25 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* LATO SINISTRO: INPUT VELOCI */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-300/35 text-amber-200 text-[11px] font-bold uppercase tracking-widest mb-3">
                  <Calculator className="w-3.5 h-3.5 text-amber-300" /> Nuovo
                  Strumento Gratuito • Guida Onesta
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-serif leading-[1.15] mb-3">
                  Hai già in mente un budget?{" "}
                  <span className="italic text-amber-300">
                    Parti da lì e organizza.
                  </span>
                </h2>
                <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed">
                  Prova subito un&apos;ipotesi veloce o esplora le nostre{" "}
                  <strong className="text-white font-medium">
                    6 Idee di Budget
                  </strong>
                  : scopri come distribuire la spesa tra{" "}
                  <strong className="text-white font-medium">
                    Ristorante o Villa
                  </strong>
                  , Fotografo, Musica, Fiori e chi contattare passo dopo passo.
                </p>
              </div>

              {/* Scelta Budget */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
                    1. Scegli un Budget indicativo
                  </span>
                  <span className="text-2xl font-serif font-bold text-amber-300">
                    {formatEuro(budget)}
                  </span>
                </div>
                <input
                  type="range"
                  aria-label="Seleziona budget ipotetico"
                  min={7000}
                  max={75000}
                  step={1000}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-2 bg-stone-800 rounded-lg"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {QUICK_BUDGETS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBudget(b)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        budget === b
                          ? "bg-amber-400 text-stone-950"
                          : "bg-white/10 text-stone-300 hover:bg-white/20"
                      }`}
                    >
                      {formatEuro(b)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ospiti + Formula */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5 mb-2.5">
                    <Users className="w-3.5 h-3.5 text-rose-400" /> 2. Invitati
                    stimati
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {QUICK_GUESTS.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGuests(g)}
                        className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                          guests === g
                            ? "bg-rose-500 text-white"
                            : "bg-white/10 text-stone-300 hover:bg-white/20"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-300 block mb-2.5">
                    3. Tipo di Struttura
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {QUICK_VENUES.map((vf) => (
                      <button
                        key={vf}
                        type="button"
                        onClick={() => setVenue(vf)}
                        className={`px-3 py-1.5 rounded-xl text-left text-xs font-semibold transition-all flex items-center justify-between ${
                          venue === vf
                            ? "bg-emerald-500/25 border border-emerald-400/60 text-emerald-200"
                            : "bg-white/5 text-stone-300 hover:bg-white/10"
                        }`}
                      >
                        <span>{VENUE_FORMULA_META[vf].shortLabel}</span>
                        {venue === vf && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* LATO DESTRO: ANTEPRIMA IMMEDIATA DEL PIANO */}
            <div className="lg:col-span-6 bg-white text-stone-900 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-rose-600">
                    Anteprima Simulazione Ipotetica
                  </p>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                    Ecco come potresti dividere {formatEuro(budget)}
                  </h3>
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full ${
                    plan.sustainabilityStatus === "STRETCHED"
                      ? "bg-rose-100 text-rose-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {plan.sustainabilityStatus === "STRETCHED" ? (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" /> Da calibrare
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Coerente
                    </>
                  )}
                </span>
              </div>

              {/* Barra proporzionale */}
              <div className="h-3.5 w-full rounded-full overflow-hidden flex bg-stone-100">
                {plan.items.map((it) => (
                  <div
                    key={it.id}
                    style={{
                      width: `${Math.max(2, it.percentage)}%`,
                      backgroundColor: it.colorHex,
                    }}
                    className="h-full border-r border-white/50 last:border-r-0 transition-all duration-300"
                  />
                ))}
              </div>

              {/* Prime 5 Voci principali */}
              <div className="space-y-2.5">
                {plan.items.slice(0, 5).map((it) => (
                  <div
                    key={it.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#faf9f8] border border-stone-200/70"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: it.colorHex }}
                      />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-stone-800 truncate">
                          {it.shortTitle}
                        </p>
                        <p className="text-[11px] text-stone-500 truncate">
                          {it.perGuestNote || it.recommendedTierLabel}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-sm sm:text-base text-stone-900 shrink-0">
                      {formatEuro(it.allocatedAmount)}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-stone-500 flex items-start gap-1.5 leading-snug">
                <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Stima orientativa e ipotetica (include anche le altre voci e
                  il 6% imprevisti/SIAE): da rettificare e confermare con
                  strutture e professionisti.
                </span>
              </p>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <Link href={deepLink} className="flex-1">
                  <Button className="w-full rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold h-12 text-xs sm:text-sm shadow-md">
                    <span>Apri Piano Completo &amp; Chi Contattare</span>
                    <ArrowRight className="w-4 h-4 ml-1.5 shrink-0" />
                  </Button>
                </Link>
                <Link href="/budget-matrimonio?tab=idee">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto rounded-full border-stone-300 text-stone-800 hover:bg-stone-100 font-semibold h-12 px-5 text-xs sm:text-sm"
                  >
                    <Sparkles className="w-4 h-4 mr-1.5 text-amber-500" />6 Idee
                    di Budget
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
