"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem("cookie_consent", "declined");
    // Se rifiutati, andrebbe implementata una logica per disattivare eventuali script di tracciamento
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 md:pb-6 bg-white border-t border-stone-200 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom">
      <div className="text-sm text-stone-600 max-w-4xl">
        <strong className="text-stone-800">Questo sito utilizza i cookie.</strong><br/>
        Utilizziamo cookie tecnici essenziali per il funzionamento della piattaforma e cookie per finalità di sicurezza, come il mantenimento delle sessioni degli invitati e la protezione dei dati sensibili (es. intolleranze alimentari). 
        Chiudendo questo banner, scorrendo questa pagina, cliccando su un link o proseguendo la navigazione in altra maniera, acconsenti all'uso dei cookie.
        Puoi leggere di più nella nostra <Link href="/privacy" className="underline text-stone-800">Privacy Policy</Link>.
      </div>
      <div className="flex shrink-0 gap-2 w-full md:w-auto">
        <button onClick={decline} className="flex-1 md:flex-none px-4 py-2 border border-stone-300 text-stone-700 rounded-lg text-sm hover:bg-stone-50 transition-colors">
          Rifiuta
        </button>
        <button onClick={accept} className="flex-1 md:flex-none px-4 py-2 bg-stone-800 text-white rounded-lg text-sm hover:bg-stone-700 transition-colors">
          Accetta
        </button>
      </div>
    </div>
  );
}
