"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, SlidersHorizontal, X } from "lucide-react";

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [functionalCookies, setFunctionalCookies] = useState(true);
  const [analyticsCookies, setAnalyticsCookies] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShow(true);
    }

    const handleOpenPreferences = () => {
      const savedPrefs = localStorage.getItem("cookie_preferences");
      if (savedPrefs) {
        try {
          const parsed = JSON.parse(savedPrefs);
          setFunctionalCookies(!!parsed.functional);
          setAnalyticsCookies(!!parsed.analytics);
        } catch {
          // ignore parse error
        }
      }
      setShow(true);
      setShowCustomize(true);
    };

    window.addEventListener("open-cookie-preferences", handleOpenPreferences);
    return () => window.removeEventListener("open-cookie-preferences", handleOpenPreferences);
  }, []);

  const saveConsent = (type: "all" | "necessary" | "custom") => {
    const preferences = {
      necessary: true,
      functional: type === "all" ? true : type === "necessary" ? false : functionalCookies,
      analytics: type === "all" ? true : type === "necessary" ? false : analyticsCookies,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cookie_consent", type);
    localStorage.setItem("cookie_preferences", JSON.stringify(preferences));
    setShow(false);
    setShowCustomize(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none">
      <div className="max-w-5xl mx-auto bg-stone-950 text-stone-200 border border-stone-800 rounded-3xl shadow-2xl p-6 md:p-8 pointer-events-auto animate-in slide-in-from-bottom duration-300">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2.5 text-white font-serif text-lg md:text-xl">
              <Cookie className="w-5 h-5 text-rose-400 shrink-0" />
              <span>La tua privacy su GentiLuna</span>
            </div>
            <p className="text-xs md:text-sm text-stone-400 leading-relaxed">
              Questo sito (gestito da <strong>TopWebsite.it di Giuseppe Urgeghe</strong>) utilizza cookie tecnici strettamente necessari al funzionamento e alla sicurezza della piattaforma (sessioni autenticate, tutela dei dati degli invitati) e, previo tuo consenso, cookie funzionali e statistici. L&apos;utilizzo della piattaforma e il caricamento di foto, video o testi sono regolati dai nostri{" "}
              <Link href="/terms" className="underline text-white hover:text-rose-300 font-medium">
                Termini e Condizioni
              </Link>{" "}
              e dalla nostra{" "}
              <Link href="/privacy" className="underline text-white hover:text-rose-300 font-medium">
                Privacy &amp; Cookie Policy
              </Link>.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto shrink-0">
            <button
              type="button"
              onClick={() => setShowCustomize(!showCustomize)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-900 hover:text-white text-xs md:text-sm font-medium transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Personalizza
            </button>
            <button
              type="button"
              onClick={() => saveConsent("necessary")}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-900 hover:text-white text-xs md:text-sm font-medium transition-colors"
            >
              Solo necessari
            </button>
            <button
              type="button"
              onClick={() => saveConsent("all")}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs md:text-sm font-bold shadow-lg shadow-rose-500/20 transition-colors"
            >
              Accetta tutti
            </button>
          </div>
        </div>

        {showCustomize && (
          <div className="mt-6 pt-6 border-t border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Gestione Preferenze Cookie
              </h4>
              <button
                type="button"
                onClick={() => setShowCustomize(false)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-stone-900/80 border border-stone-800 p-4 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Cookie Tecnici Essenziali</span>
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                    Sempre attivi
                  </span>
                </div>
                <p className="text-stone-400 leading-relaxed">
                  Indispensabili per il login sicuro, la navigazione, la protezione degli spazi evento e il salvataggio delle preferenze privacy.
                </p>
              </div>

              <label className="bg-stone-900/80 border border-stone-800 p-4 rounded-2xl space-y-1.5 cursor-pointer hover:border-stone-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Cookie Funzionali</span>
                  <input
                    type="checkbox"
                    checked={functionalCookies}
                    onChange={(e) => setFunctionalCookies(e.target.checked)}
                    className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
                  />
                </div>
                <p className="text-stone-400 leading-relaxed">
                  Permettono di memorizzare scelte di visualizzazione e migliorare l&apos;esperienza utente nelle gallerie e nei capitoli.
                </p>
              </label>

              <label className="bg-stone-900/80 border border-stone-800 p-4 rounded-2xl space-y-1.5 cursor-pointer hover:border-stone-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Cookie Statistici Anonimi</span>
                  <input
                    type="checkbox"
                    checked={analyticsCookies}
                    onChange={(e) => setAnalyticsCookies(e.target.checked)}
                    className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
                  />
                </div>
                <p className="text-stone-400 leading-relaxed">
                  Ci aiutano a capire in forma aggregata come viene utilizzato il sito per migliorare costantemente i servizi offerti.
                </p>
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => saveConsent("custom")}
                className="px-5 py-2 rounded-xl bg-white text-stone-950 hover:bg-stone-200 text-xs font-bold transition-colors"
              >
                Salva le mie preferenze
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
