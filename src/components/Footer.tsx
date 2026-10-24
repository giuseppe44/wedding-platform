"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  const openCookiePreferences = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("open-cookie-preferences"));
    }
  };

  return (
    <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-900">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="text-2xl font-serif text-white tracking-tight flex items-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-rose-500" />
            GentiLuna
          </Link>
          <p className="text-sm max-w-sm leading-relaxed mb-4">
            La piattaforma digitale definitiva per sposi, invitati e professionisti. Raccogli ricordi, organizza il tuo evento e fai crescere il tuo business.
          </p>
          <p className="text-xs text-stone-500 leading-relaxed">
            <strong>GentiLuna (gentiluna.com)</strong> è un servizio di <strong>TopWebsite.it di Giuseppe Urgeghe</strong><br />
            Z.I. Predda Niedda, Strada 3 – 07100 Sassari (SS) • P.IVA 02656280902 • REA SS-203474
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-4">Esplora</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/sposi" className="hover:text-white transition-colors">Per gli Sposi</Link></li>
            <li><Link href="/professionisti" className="hover:text-white transition-colors">Per i Professionisti</Link></li>
            <li><Link href="/prezzi" className="hover:text-white transition-colors">Tariffe Sposi</Link></li>
            <li><Link href="/login" className="hover:text-white transition-colors">Accedi / Registrati</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-4">Note Legali e Tutela</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy &amp; Cookie Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Termini e Condizioni d&apos;Uso</Link></li>
            <li>
              <button
                type="button"
                onClick={openCookiePreferences}
                className="hover:text-white transition-colors text-left"
              >
                Preferenze Cookie
              </button>
            </li>
            <li><Link href="/login?role=ADMIN" className="hover:text-rose-500 transition-colors">Amministrazione</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-stone-800 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} GentiLuna – TopWebsite.it di Giuseppe Urgeghe (P.IVA 02656280902). Tutti i diritti riservati.</p>
        <p className="text-xs text-stone-500">Tutti i contenuti caricati dagli utenti sono sotto l&apos;esclusiva responsabilità dei rispettivi autori.</p>
      </div>
    </footer>
  );
}
