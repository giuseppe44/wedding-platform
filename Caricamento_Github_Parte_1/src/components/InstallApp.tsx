"use client";

import { useEffect, useState } from "react";
import { Download, Share2, Plus, CheckCircle, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}

export default function InstallApp() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ua = navigator.userAgent || "";
    setIsIos(/iPad|iPhone|iPod/.test(ua));
    if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
    }
    const onPrompt: EventListener = (e) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled: EventListener = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferred) return;
    try {
      await deferred.prompt();
      await deferred.userChoice;
    } catch {
      // Ignora eventuali errori di cancellazione dell'utente
    }
    setDeferred(null);
  };

  return (
    <div id="installa" className="bg-white rounded-3xl border border-stone-200 shadow-sm p-8 scroll-mt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-stone-900 flex items-center justify-center">
          <Smartphone className="w-6 h-6 text-rose-400" />
        </div>
        <div>
          <h3 className="text-2xl font-serif text-stone-900">Installa l&apos;App GentiLuna</h3>
          <p className="text-sm text-stone-500">Gratis, senza App Store né Play Store. Android e iPhone.</p>
        </div>
      </div>

      {installed ? (
        <p className="flex items-center gap-2 text-emerald-600 font-semibold">
          <CheckCircle className="w-5 h-5" /> App già installata su questo dispositivo.
        </p>
      ) : deferred ? (
        <button
          onClick={install}
          className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-full px-8 h-12"
        >
          <Download className="w-5 h-5" /> Installa l&apos;App
        </button>
      ) : isIos ? (
        <ol className="space-y-3 text-stone-700 text-sm">
          <li className="flex items-center gap-2">1. Apri questa pagina con <strong>Safari</strong>.</li>
          <li className="flex items-center gap-2">2. Tocca <Share2 className="w-4 h-4 inline" /> <strong>Condividi</strong>.</li>
          <li className="flex items-center gap-2">3. Scegli <Plus className="w-4 h-4 inline" /> <strong>Aggiungi alla schermata Home</strong>.</li>
        </ol>
      ) : (
        <p className="text-sm text-stone-600">
          Su <strong>Android</strong> apri il sito con Chrome, tocca il menu ⋮ e scegli{" "}
          <strong>Installa app</strong> / <strong>Aggiungi a schermata Home</strong>. Su <strong>iPhone</strong> usa Safari →
          Condividi → Aggiungi alla schermata Home. Da PC: icona di installazione nella barra degli indirizzi di Chrome/Edge.
        </p>
      )}
    </div>
  );
}
