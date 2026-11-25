"use client";

import { Suspense, useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  Star,
  Heart,
  Camera,
  ArrowLeft,
  ShieldCheck,
  Loader2,
  Gift,
  Sparkles,
  X,
} from "lucide-react";
import Footer from "@/components/Footer";
import { createCheckoutSession } from "@/app/stripeActions";
import { validatePartnerCodeAction } from "@/app/actions/partnerReferralAction";

function formatEuroCentsClient(cents: number) {
  return (
    (cents / 100).toLocaleString("it-IT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " €"
  );
}

function PrezziContent() {
  const searchParams = useSearchParams();
  const urlPartner = searchParams.get("partner") || "";

  const [isTriennial, setIsTriennial] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [codeInput, setCodeInput] = useState(urlPartner.toUpperCase());
  const [checkingCode, setCheckingCode] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [verifiedPartner, setVerifiedPartner] = useState<{
    code: string;
    businessName: string;
    categoryLabel: string;
    discountPercent: number;
  } | null>(null);

  const verifyCode = async (codeToTest: string) => {
    const clean = codeToTest.trim();
    if (!clean) return;
    setCheckingCode(true);
    setCodeError("");
    try {
      const res = await validatePartnerCodeAction(clean);
      if (res.valid) {
        setVerifiedPartner({
          code: res.code,
          businessName: res.businessName,
          categoryLabel: res.categoryLabel,
          discountPercent: res.discountPercent,
        });
        setCodeInput(res.code);
      } else {
        setVerifiedPartner(null);
        setCodeError(res.error);
      }
    } catch {
      setCodeError("Errore di connessione durante la verifica del codice.");
    } finally {
      setCheckingCode(false);
    }
  };

  useEffect(() => {
    if (urlPartner.trim()) {
      verifyCode(urlPartner);
    }
  }, [urlPartner]);

  const handleSelectPlan = (planCode: string) => {
    setPendingPlan(planCode);
    startTransition(async () => {
      try {
        await createCheckoutSession(planCode, undefined, verifiedPartner?.code);
      } catch {
        setPendingPlan(null);
      }
    });
  };

  const renderPriceBlock = (baseCents: number, darkCard = false) => {
    if (!verifiedPartner) {
      return (
        <span
          className={`text-5xl font-serif font-bold ${
            darkCard ? "text-white" : "text-stone-900"
          }`}
        >
          {formatEuroCentsClient(baseCents)}
        </span>
      );
    }
    const discounted = Math.round(
      (baseCents * (100 - verifiedPartner.discountPercent)) / 100
    );
    return (
      <div className="space-y-1">
        <div
          className={`text-sm line-through font-medium ${
            darkCard ? "text-stone-400" : "text-stone-400"
          }`}
        >
          {formatEuroCentsClient(baseCents)}
        </div>
        <div className="flex items-center justify-center md:justify-start gap-2">
          <span
            className={`text-4xl sm:text-5xl font-serif font-bold ${
              darkCard ? "text-emerald-300" : "text-emerald-700"
            }`}
          >
            {formatEuroCentsClient(discounted)}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-xs font-bold">
            -{verifiedPartner.discountPercent}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans flex flex-col overflow-x-hidden">
      {/* HEADER */}
      <div className="bg-stone-950 text-white py-20 md:py-24 text-center px-4 relative">
        <div className="max-w-7xl mx-auto mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Torna alla Home
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-amber-300 hover:text-amber-200 font-semibold"
          >
            <Sparkles className="w-4 h-4" /> Prova la Demo Interattiva →
          </Link>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif mb-6">
          Scegli il piano per il tuo evento
        </h1>
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
            <h2 className="text-4xl font-serif text-stone-900 mb-4">
              Piani per i tuoi Eventi
            </h2>

            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 mb-8">
              <span
                className={`font-bold text-sm sm:text-base ${
                  !isTriennial ? "text-stone-900" : "text-stone-400"
                }`}
              >
                Annuale
              </span>
              <button
                type="button"
                aria-label="Cambia durata annuale o triennale"
                onClick={() => setIsTriennial(!isTriennial)}
                className="w-16 h-8 bg-rose-500 rounded-full p-1 relative transition-colors shrink-0 cursor-pointer"
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                    isTriennial ? "translate-x-8" : ""
                  }`}
                />
              </button>
              <div className="flex items-center gap-2">
                <span
                  className={`font-bold text-sm sm:text-base ${
                    isTriennial ? "text-stone-900" : "text-stone-400"
                  }`}
                >
                  Triennale (Promo 3 Anni)
                </span>
              </div>
            </div>

            {/* BOX INTERATTIVO CODICE INVITO PARTNER (-15% REALE) */}
            <div className="bg-gradient-to-br from-rose-50 via-white to-amber-50/70 border border-rose-200/80 p-5 sm:p-6 rounded-3xl max-w-2xl mx-auto mb-4 shadow-xs">
              <div className="flex items-center justify-center gap-2 text-rose-800 font-bold text-sm sm:text-base mb-1.5">
                <Gift className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Hai il Codice Invito di un Ristorante, Fotografo o Partner?</span>
              </div>
              <p className="text-stone-600 text-xs sm:text-sm mb-4">
                Inseriscilo qui sotto per sbloccare subito il{" "}
                <strong className="text-rose-700">-15% di sconto dedicato</strong> su tutti i piani evento!
              </p>

              {verifiedPartner ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                      ✓ Codice Partner Attivo ({verifiedPartner.code})
                    </div>
                    <div className="text-sm text-emerald-950 font-semibold mt-0.5">
                      Sconto -{verifiedPartner.discountPercent}% offerto da{" "}
                      <strong>{verifiedPartner.businessName}</strong> ({verifiedPartner.categoryLabel})
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setVerifiedPartner(null);
                      setCodeInput("");
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-800 px-3 py-1.5 rounded-full bg-white border border-stone-200 cursor-pointer shrink-0"
                  >
                    <X className="w-3.5 h-3.5" /> Rimuovi
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    verifyCode(codeInput);
                  }}
                  className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto"
                >
                  <Input
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                    placeholder="Es. F01, W01, R01"
                    className="h-11 bg-white border-stone-300 text-stone-900 font-mono uppercase text-sm rounded-xl"
                  />
                  <Button
                    type="submit"
                    disabled={checkingCode || !codeInput.trim()}
                    className="h-11 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold shrink-0"
                  >
                    {checkingCode ? "Verifica..." : "Applica -15%"}
                  </Button>
                </form>
              )}

              {codeError && (
                <p className="text-xs text-rose-600 font-medium mt-2">{codeError}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Base */}
            <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all flex flex-col text-center md:text-left">
              <h4 className="font-bold text-2xl text-stone-800 mb-2">Base</h4>
              <p className="text-stone-500 mb-6 min-h-[40px]">
                L&apos;essenziale per il tuo evento
              </p>
              <div className="mb-2">
                {renderPriceBlock(isTriennial ? 24900 : 14900, false)}
              </div>
              <p className="text-sm text-stone-500 mb-6 min-h-[40px]">
                {isTriennial ? (
                  <>
                    Pagamento anticipato 3 anni.
                    <br />
                    <span className="text-emerald-600 font-bold">
                      Blocchi il prezzo per un triennio
                    </span>
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
                onClick={() =>
                  handleSelectPlan(isTriennial ? "BASE_TRIENNIAL" : "BASE_ANNUAL")
                }
                disabled={isPending}
                className={`w-full min-h-14 h-auto py-3.5 px-4 rounded-full font-semibold whitespace-normal text-center leading-snug transition-all ${
                  isPending &&
                  (pendingPlan === "BASE_ANNUAL" || pendingPlan === "BASE_TRIENNIAL")
                    ? "bg-stone-800 text-white disabled:opacity-100 text-sm"
                    : "bg-stone-900 hover:bg-stone-800 text-white text-base sm:text-lg"
                }`}
              >
                {isPending &&
                (pendingPlan === "BASE_ANNUAL" || pendingPlan === "BASE_TRIENNIAL") ? (
                  <span className="inline-flex items-center justify-center gap-2 text-white">
                    <Loader2 className="w-4 h-4 animate-spin shrink-0 text-white" />
                    <span>Reindirizzamento...</span>
                  </span>
                ) : isTriennial ? (
                  "Attiva Base (3 Anni)"
                ) : (
                  "Seleziona Base"
                )}
              </Button>
            </div>

            {/* Premium */}
            <div className="bg-stone-900 text-white p-6 sm:p-8 lg:p-10 rounded-3xl border border-stone-800 shadow-2xl relative transform md:-translate-y-4 flex flex-col text-center md:text-left">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                Il Più Scelto
              </div>
              <h4 className="font-bold text-2xl text-white mb-2">Premium</h4>
              <p className="text-stone-400 mb-6 min-h-[40px]">
                Ideale per l&apos;organizzazione completa
              </p>
              <div className="mb-2">
                {renderPriceBlock(isTriennial ? 49900 : 39900, true)}
              </div>
              <p className="text-sm text-stone-400 mb-6 min-h-[40px]">
                {isTriennial ? (
                  <>
                    Pagamento anticipato 3 anni.
                    <br />
                    <span className="text-emerald-400 font-bold">
                      Risparmi sul rinnovo triennale
                    </span>
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
                  <Star className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />{" "}
                  <span>Spazio: 5 GB</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />{" "}
                  <span>Max 500 foto</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />{" "}
                  <span>Max 15 capitoli</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />{" "}
                  <span>Gestione dei tavoli, Portale Ristorante e inviti illimitati</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />{" "}
                  <span>Cartoncini QR da tavolo pronti da stampare</span>
                </li>
              </ul>
              <Button
                onClick={() =>
                  handleSelectPlan(isTriennial ? "PREMIUM_TRIENNIAL" : "PREMIUM_ANNUAL")
                }
                disabled={isPending}
                className={`w-full min-h-14 h-auto py-3.5 px-4 rounded-full font-bold whitespace-normal text-center leading-snug transition-all ${
                  isPending &&
                  (pendingPlan === "PREMIUM_ANNUAL" || pendingPlan === "PREMIUM_TRIENNIAL")
                    ? "bg-rose-700 text-white disabled:opacity-100 text-sm"
                    : "bg-rose-500 hover:bg-rose-600 text-white text-base sm:text-lg"
                }`}
              >
                {isPending &&
                (pendingPlan === "PREMIUM_ANNUAL" || pendingPlan === "PREMIUM_TRIENNIAL") ? (
                  <span className="inline-flex items-center justify-center gap-2 text-white">
                    <Loader2 className="w-4 h-4 animate-spin shrink-0 text-white" />
                    <span>Reindirizzamento...</span>
                  </span>
                ) : isTriennial ? (
                  "Attiva Premium (3 Anni)"
                ) : (
                  "Seleziona Premium"
                )}
              </Button>
            </div>

            {/* Diamond */}
            <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all flex flex-col text-center md:text-left">
              <h4 className="font-bold text-2xl text-stone-800 mb-2">Diamond</h4>
              <p className="text-stone-500 mb-6 min-h-[40px]">
                L&apos;esperienza di lusso definitiva
              </p>
              <div className="mb-2">
                {renderPriceBlock(isTriennial ? 67350 : 44900, false)}
              </div>
              <p className="text-sm text-stone-500 mb-6 min-h-[40px]">
                {isTriennial ? (
                  <>
                    Pagamento anticipato 3 anni.
                    <br />
                    <span className="text-emerald-600 font-bold">
                      Esperienza Diamond per 3 anni
                    </span>
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
                  <span className="font-bold">Tutto il piano Premium, più:</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />{" "}
                  <span>Spazio: 50 GB in Alta Risoluzione</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />{" "}
                  <span>Max 30 capitoli</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />{" "}
                  <span>GentiLuna LIVE (Proiettore in sala)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />{" "}
                  <span>Esportazione PDF dei Tavoli</span>
                </li>
              </ul>
              <Button
                variant="outline"
                onClick={() =>
                  handleSelectPlan(isTriennial ? "DIAMOND_TRIENNIAL" : "DIAMOND_ANNUAL")
                }
                disabled={isPending}
                className={`w-full min-h-14 h-auto py-3.5 px-4 rounded-full border-stone-300 font-semibold whitespace-normal text-center leading-snug transition-all ${
                  isPending &&
                  (pendingPlan === "DIAMOND_ANNUAL" || pendingPlan === "DIAMOND_TRIENNIAL")
                    ? "bg-stone-900 text-white border-stone-900 disabled:opacity-100 text-sm"
                    : "text-base sm:text-lg hover:bg-stone-100"
                }`}
              >
                {isPending &&
                (pendingPlan === "DIAMOND_ANNUAL" || pendingPlan === "DIAMOND_TRIENNIAL") ? (
                  <span className="inline-flex items-center justify-center gap-2 text-white">
                    <Loader2 className="w-4 h-4 animate-spin shrink-0 text-white" />
                    <span>Reindirizzamento...</span>
                  </span>
                ) : isTriennial ? (
                  "Attiva Diamond (3 Anni)"
                ) : (
                  "Seleziona Diamond"
                )}
              </Button>
            </div>
          </div>

          {/* BANNER SICUREZZA PAGAMENTI + LINK PROFESSIONISTI */}
          <div className="mt-16 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm text-center md:text-left">
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
            <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto shrink-0">
              <Link href="/professionisti#founders" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto min-h-11 h-auto py-2.5 px-5 rounded-full border-amber-400 text-stone-900 hover:bg-amber-50 font-semibold whitespace-normal text-center leading-snug"
                >
                  <Camera className="w-4 h-4 mr-2 text-amber-500 shrink-0" />
                  <span>Piani Fotografi &amp; Pro</span>
                </Button>
              </Link>
              <Link href="/partner" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto min-h-11 h-auto py-2.5 px-5 rounded-full bg-stone-900 hover:bg-stone-800 text-amber-300 font-semibold whitespace-normal text-center leading-snug">
                  <span>Ristoranti, Viaggi, Torte &amp; NCC →</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function PrezziPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#faf9f8] p-12 text-center text-stone-500">Caricamento piani...</div>}>
      <PrezziContent />
    </Suspense>
  );
}
