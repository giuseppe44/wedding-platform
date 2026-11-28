"use client";

import Link from "next/link";
import { GentiLunaLogo } from "@/components/GentiLunaLogo";

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
          <Link href="/" className="text-2xl font-serif text-white tracking-tight flex items-center gap-2.5 mb-4">
            <GentiLunaLogo className="w-7 h-7 shrink-0" />
            GentiLuna
          </Link>
          <p className="text-sm max-w-sm leading-relaxed mb-3">
            La piattaforma digitale definitiva per sposi, invitati e professionisti. Raccogli ricordi, organizza il tuo evento e fai crescere il tuo business.
          </p>
          <p className="text-xs text-rose-400/90 font-serif italic tracking-wide">
            Da un&apos;idea di Michele e Giuseppe
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-4">Esplora</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/sposi" className="hover:text-white transition-colors">Per gli Sposi</Link></li>
            <li><Link href="/budget-matrimonio" className="text-amber-300 font-semibold hover:text-amber-200 transition-colors">Parti dal Budget &amp; Idee ✨</Link></li>
            <li><Link href="/demo" className="text-amber-300/90 hover:text-amber-200 transition-colors">Prova Demo Live ✨</Link></li>
            <li><Link href="/funzioni-sposi" className="hover:text-white transition-colors">Funzioni Sposi &amp; Eventi</Link></li>
            <li><Link href="/professionisti" className="hover:text-white transition-colors">Per i Professionisti</Link></li>
            <li><Link href="/partner" className="text-amber-300/90 hover:text-amber-200 transition-colors">Ristoranti, Viaggi, Torte &amp; NCC</Link></li>
            <li><Link href="/funzioni-professionisti" className="hover:text-white transition-colors">Funzioni Professionisti</Link></li>
            <li><Link href="/fornitori" className="hover:text-white transition-colors">Directory Fornitori</Link></li>
            <li><Link href="/prezzi" className="hover:text-white transition-colors">Tariffe &amp; Abbonamenti</Link></li>
            <li><Link href="/blog" className="hover:text-white transition-colors">Blog &amp; Guide</Link></li>
            <li><Link href="/login" className="hover:text-white transition-colors">Accedi / Registrati</Link></li>
            <li><Link href="/assistenza" className="hover:text-white transition-colors">Assistenza Clienti</Link></li>
            <li><Link href="/assistenza#installa" className="hover:text-white transition-colors">Scarica l&apos;App</Link></li>
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
            <li className="pt-1 text-xs text-stone-600"><a href="mailto:info@gentiluna.com" className="hover:text-stone-400 transition-colors">info@gentiluna.com</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-stone-800 text-sm flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <p>&copy; {new Date().getFullYear()} GentiLuna. Tutti i diritti riservati. • Sviluppato da <a href="https://www.topidea.it" target="_blank" rel="noopener noreferrer" className="text-stone-300 hover:text-white underline">TopIdea.it</a> – P.IVA 02656280902</p>
      </div>
    </footer>
  );
}
