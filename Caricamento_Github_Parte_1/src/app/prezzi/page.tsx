"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Star, Heart, Camera, ArrowLeft, CreditCard, ShieldCheck } from "lucide-react";
import Footer from "@/components/Footer";
import { createCheckoutSession } from "@/app/stripeActions";

export default function PrezziPage() {
  const [isTriennial, setIsTriennial] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSelectPlan = (planCode: string) => {
    setPendingPlan(planCode);
    startTransition(async () => {
      try {
        await createCheckoutSession(planCode);
      } catch (err: any) {
        setPendingPlan(null);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans flex flex-col">
      {/* HEADER */}
      <div className="bg-stone-950 text-white py-20 md:py-24 text-center px-4 relative">
        <div className="max-w-7xl mx-auto mb-6 text-left">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Torna alla Home
          </Link>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif mb-6">Scegli il piano per il tuo evento</h1>
        <p className="text-stone-400 max-w-2xl mx-auto text-lg">
          Trasparenza totale. Nessun costo nascosto. Attiva subito il tuo spazio e goditelo in ogni momento.
        </p>
      </div>

      {/* TARIFFE SPOSI / EVENTI */}
      <section className="py-16 md:py-24 px-4 bg-[#faf9f8]" id="sposi">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-rose-100 rounded-full mb-6">
              <Heart className="w-6 h-6 text-rose-500" />
            </div>
            <h2 className="text-4xl font-serif text-stone-900 mb-4">Piani per i tuoi Eventi</h2>

            <div className="flex justify-center items-center gap-4 mb-8">
              <span className={`font-bold ${!isTriennial ? "text-stone-900" : "text-stone-400"}`}>
                Annuale
              </span>
              <button
                type="button"
                onClick={() => setIsTriennial(!isTriennial)}
                className="w-16 h-8 bg-rose-500 rounded-full p-1 relative transition-colors"
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                    isTriennial ? "translate-x-8" : ""
                  }`}
                />
              </button>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${isTriennial ? "text-stone-900" : "text-stone-400"}`}>
                  Triennale (Promo 3 Anni)
                </span>
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl inline-block max-w-2xl mb-4">
              <h4 className="font-bold text-rose-800 mb-2">🎁 Hai già un fotografo partner?</h4>
              <p className="text-rose-600 text-sm">
                Se il tuo fotografo o professionista è già convenzionato con la piattaforma GentiLuna, avrai diritto a un{" "}
                <strong>prezzo dedicato</strong> e vantaggioso (o incluso nel suo pacchetto). Chiedigli il codice invito!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Base */}
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all flex flex-col text-center md:text-left">
              <h4 className="font-bold text-2xl text-stone-800 mb-2">Base</h4>
              <p className="text-stone-500 mb-6 min-h-[40px]">L&apos;essenziale per il tuo evento</p>
              <div className="mb-2">
                <span className="text-5xl font-serif font-bold text-stone-900">
                  {isTriennial ? "249,00 €" : "149,00 €"}
                </span>
              </div>
              <p className="text-sm text-stone-500 mb-6 min-h-[40px]">
                {isTriennial ? (
                  <>
                    Pagamento anticipato 3 anni.
                    <br />
                    <span className="text-emerald-600 font-bold">Blocchi il prezzo per un triennio</span>
                  </>
                ) : (
                  <>
                    il primo anno
                    <br />
                    <span className="italic">rinnovo dal secondo anno 50,00 € all&apos;anno</span>
                  </>
                )}
              </p>
              <ul className="text-stone-600 space-y-4 mb-10 flex-1 text-left">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />{" "}
                  <span>Spazio: 3 GB</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />{" "}
                  <span>Max 20 foto</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />{" "}
                  <span>Max 1 capitolo</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />{" "}
                  <span>Sito pubblico personalizzato</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />{" "}
                  <span>Info luoghi e orari evento</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />{" "}
                  <span>Lista nozze e regali</span>
                </li>
              </ul>
              <Button
                onClick={() => handleSelectPlan(isTriennial ? "BASE_TRIENNIAL" : "BASE_ANNUAL")}
                disabled={isPending}
                className="w-full bg-stone-900 hover:bg-stone-800 h-14 rounded-full text-white text-lg font-semibold"
              >
                {isPending && (pendingPlan === "BASE_ANNUAL" || pendingPlan === "BASE_TRIENNIAL")
                  ? "Reindirizzamento..."
                  : isTriennial
                  ? "Attiva Base (3 Anni)"
                  : "Seleziona Base"}
              </Button>
            </div>

            {/* Premium */}
            <div className="bg-stone-900 text-white p-8 md:p-10 rounded-3xl border border-stone-800 shadow-2xl relative transform md:-translate-y-4 flex flex-col text-center md:text-left">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                Il Più Scelto
              </div>
              <h4 className="font-bold text-2xl text-white mb-2">Premium</h4>
              <p className="text-stone-400 mb-6 min-h-[40px]">Ideale per l&apos;organizzazione completa</p>
              <div className="mb-2">
                <span className="text-5xl font-serif font-bold text-white">
                  {isTriennial ? "499,00 €" : "399,00 €"}
                </span>
              </div>
              <p className="text-sm text-stone-400 mb-6 min-h-[40px]">
                {isTriennial ? (
                  <>
                    Pagamento anticipato 3 anni.
                    <br />
                    <span className="text-emerald-400 font-bold">Risparmi sul rinnovo triennale</span>
                  </>
                ) : (
                  <>
                    il primo anno
                    <br />
                    <span className="italic">rinnovo dal secondo anno 60,00 € all&apos;anno</span>
                  </>
                )}
              </p>
              <ul className="text-stone-300 space-y-4 mb-10 flex-1 text-left">
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />{" "}
                  <span className="font-bold text-white">Tutto il piano Base, più:</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" /> <span>Spazio: 5 GB</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" /> <span>Max 500 foto</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" /> <span>Max 15 capitoli</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />{" "}
                  <span>Gestione dei tavoli e inviti illimitati</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />{" "}
                  <span>Upload foto da parte della coppia</span>
                </li>
              </ul>
              <Button
                onClick={() => handleSelectPlan(isTriennial ? "PREMIUM_TRIENNIAL" : "PREMIUM_ANNUAL")}
                disabled={isPending}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white h-14 rounded-full font-bold text-lg"
              >
                {isPending && (pendingPlan === "PREMIUM_ANNUAL" || pendingPlan === "PREMIUM_TRIENNIAL")
                  ? "Reindirizzamento..."
                  : isTriennial
                  ? "Attiva Premium (3 Anni)"
                  : "Seleziona Premium"}
              </Button>
            </div>

            {/* Diamond */}
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all flex flex-col text-center md:text-left">
              <h4 className="font-bold text-2xl text-stone-800 mb-2">Diamond</h4>
              <p className="text-stone-500 mb-6 min-h-[40px]">L&apos;esperienza di lusso definitiva</p>
              <div className="mb-2">
                <span className="text-5xl font-serif font-bold text-stone-900">
                  {isTriennial ? "673,50 €" : "449,00 €"}
                </span>
              </div>
              <p className="text-sm text-stone-500 mb-6 min-h-[40px]">
                {isTriennial ? (
                  <>
                    Pagamento anticipato 3 anni.
                    <br />
                    <span className="text-emerald-600 font-bold">Risparmi 673,50 €</span>
                  </>
                ) : (
                  <>
                    il primo anno
                    <br />
                    <span className="italic">rinnovo dal secondo anno 70,00 € all&apos;anno</span>
                  </>
                )}
              </p>
              <ul className="text-stone-600 space-y-4 mb-10 flex-1 text-left">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />{" "}
                  <span className="font-bold text-stone-900">Tutto il piano Premium, più:</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />{" "}
                  <span>Spazio: 50 GB</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />{" "}
                  <span>Max 30 capitoli</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />{" "}
                  <span>Proiezione Live Evento</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />{" "}
                  <span>Esportazione PDF dei Tavoli</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />{" "}
                  <span>Vetrina e Tableau personalizzabili</span>
                </li>
              </ul>
              <Button
                variant="outline"
                onClick={() => handleSelectPlan(isTriennial ? "DIAMOND_TRIENNIAL" : "DIAMOND_ANNUAL")}
                disabled={isPending}
                className="w-full h-14 rounded-full border-stone-300 text-lg hover:bg-stone-100 font-semibold"
              >
                {isPending && (pendingPlan === "DIAMOND_ANNUAL" || pendingPlan === "DIAMOND_TRIENNIAL")
                  ? "Reindirizzamento..."
                  : isTriennial
                  ? "Attiva Diamond (3 Anni)"
                  : "Seleziona Diamond"}
              </Button>
            </div>
          </div>

          {/* BANNER SICUREZZA PAGAMENTI + LINK PROFESSIONISTI */}
          <div className="mt-16 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-stone-200 shadow-sm text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 mx-auto md:mx-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900">Pagamenti 100% Sicuri con Stripe</h4>
                <p className="text-sm text-stone-500">
                  Attivazione immediata del tuo spazio personale subito dopo il pagamento con carta, Apple Pay o Google Pay.
                </p>
              </div>
            </div>
            <Link href="/professionisti#founders" className="shrink-0">
              <Button variant="outline" className="rounded-full border-amber-400 text-stone-900 hover:bg-amber-50 font-semibold">
                <Camera className="w-4 h-4 mr-2 text-amber-500" /> Sei un Professionista? Vedi Piani Pro
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
