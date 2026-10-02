"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Star, Heart, Camera } from "lucide-react";
import Footer from "@/components/Footer";

export default function PrezziPage() {
  const [isTriennial, setIsTriennial] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans flex flex-col">
      {/* HEADER */}
      <div className="bg-stone-950 text-white py-24 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-serif mb-6">Scegli il piano per il tuo evento</h1>
        <p className="text-stone-400 max-w-2xl mx-auto text-lg">
          Trasparenza totale. Nessun costo nascosto. Blocca ora le funzionalità e goditele per sempre.
        </p>
      </div>

      {/* TARIFFE SPOSI */}
      <section className="py-24 px-4 bg-[#faf9f8]" id="sposi">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-rose-100 rounded-full mb-6">
              <Heart className="w-6 h-6 text-rose-500" />
            </div>
            <h2 className="text-4xl font-serif text-stone-900 mb-4">Piani per gli Sposi</h2>
            
            <div className="flex justify-center items-center gap-4 mb-8">
              <span className={`font-bold ${!isTriennial ? 'text-stone-900' : 'text-stone-400'}`}>Annuale</span>
              <button 
                onClick={() => setIsTriennial(!isTriennial)}
                className="w-16 h-8 bg-rose-500 rounded-full p-1 relative transition-colors"
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${isTriennial ? 'translate-x-8' : ''}`} />
              </button>
              <div className="flex flex-col items-start">
                <span className={`font-bold ${isTriennial ? 'text-stone-900' : 'text-stone-400'}`}>Triennale (Risparmia 50%)</span>
              </div>
            </div>
            
            <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl inline-block max-w-2xl mb-8">
              <h4 className="font-bold text-rose-800 mb-2">🎁 Hai già un fotografo partner?</h4>
              <p className="text-rose-600 text-sm">
                Se il tuo fotografo o professionista è già convenzionato con la piattaforma ecos.com, avrai diritto a un <strong>prezzo dedicato</strong> e vantaggioso (o incluso nel suo pacchetto). Chiedigli il codice invito!
              </p>
            </div>

          </div>

          
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Base */}
              <div className="bg-white p-10 rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all flex flex-col">
                <h4 className="font-bold text-2xl text-stone-800 mb-2">Base</h4>
                <p className="text-stone-500 mb-6 h-10">L'essenziale per il tuo matrimonio</p>
                <div className="mb-2">
                  <span className="text-5xl font-serif font-bold text-stone-900">{isTriennial ? '€ 99,50' : '€ 99'}</span>
                </div>
                <p className="text-sm text-stone-500 mb-6 min-h-[40px]">
                  {isTriennial ? (
                    <>Pagamento anticipato 3 anni.<br/><span className="text-emerald-600 font-bold">Risparmi € 99,50</span></>
                  ) : (
                    <>il primo anno<br/><span className="italic">rinnovo dal secondo anno € 50 all'anno</span></>
                  )}
                </p>
                <ul className="text-stone-600 space-y-4 mb-10 flex-1">
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> <span>Spazio: 3 GB</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> <span>Max 20 foto</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> <span>Max 1 capitolo</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> <span>Sito pubblico personalizzato</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> <span>Info luoghi e orari evento</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> <span>Lista nozze e regali</span></li>
                </ul>
                <Button 
                  className="w-full bg-stone-900 hover:bg-stone-800 h-14 rounded-full text-white text-lg disabled:opacity-50"
                  disabled={isTriennial}
                >
                  {isTriennial ? 'Presto Disponibile' : 'Seleziona Base'}
                </Button>
                {isTriennial && <p className="text-xs text-center text-stone-400 mt-2">Pagamento triennale in fase di configurazione Stripe.</p>}
              </div>
  
              {/* Premium */}
              <div className="bg-stone-900 text-white p-10 rounded-3xl border border-stone-800 shadow-2xl relative transform md:-translate-y-4 flex flex-col">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                  Il Più Scelto
                </div>
                <h4 className="font-bold text-2xl text-white mb-2">Premium</h4>
                <p className="text-stone-400 mb-6 h-10">Ideale per l'organizzazione completa</p>
                <div className="mb-2">
                  <span className="text-5xl font-serif font-bold text-white">{isTriennial ? '€ 209,50' : '€ 299'}</span>
                </div>
                <p className="text-sm text-stone-400 mb-6 min-h-[40px]">
                  {isTriennial ? (
                    <>Pagamento anticipato 3 anni.<br/><span className="text-emerald-400 font-bold">Risparmi € 209,50</span></>
                  ) : (
                    <>il primo anno<br/><span className="italic">rinnovo dal secondo anno € 60 all'anno</span></>
                  )}
                </p>
                <ul className="text-stone-300 space-y-4 mb-10 flex-1">
                  <li className="flex items-start gap-3"><Star className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" /> <span className="font-bold text-white">Tutto il piano Base, più:</span></li>
                  <li className="flex items-start gap-3"><Star className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" /> <span>Spazio: 5 GB</span></li>
                  <li className="flex items-start gap-3"><Star className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" /> <span>Max 500 foto</span></li>
                  <li className="flex items-start gap-3"><Star className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" /> <span>Max 15 capitoli</span></li>
                  <li className="flex items-start gap-3"><Star className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" /> <span>Gestione dei tavoli e inviti illimitati</span></li>
                  <li className="flex items-start gap-3"><Star className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" /> <span>Upload foto da parte della coppia</span></li>
                </ul>
                <Button 
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white h-14 rounded-full font-bold text-lg disabled:opacity-50"
                  disabled={isTriennial}
                >
                  {isTriennial ? 'Presto Disponibile' : 'Seleziona Premium'}
                </Button>
                {isTriennial && <p className="text-xs text-center text-stone-400 mt-2">Pagamento triennale in fase di configurazione Stripe.</p>}
              </div>
  
              {/* Diamond */}
              <div className="bg-white p-10 rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all flex flex-col">
                <h4 className="font-bold text-2xl text-stone-800 mb-2">Diamond</h4>
                <p className="text-stone-500 mb-6 h-10">L'esperienza di lusso definitiva</p>
                <div className="mb-2">
                  <span className="text-5xl font-serif font-bold text-stone-900">{isTriennial ? '€ 294,50' : '€ 449'}</span>
                </div>
                <p className="text-sm text-stone-500 mb-6 min-h-[40px]">
                  {isTriennial ? (
                    <>Pagamento anticipato 3 anni.<br/><span className="text-emerald-600 font-bold">Risparmi € 294,50</span></>
                  ) : (
                    <>il primo anno<br/><span className="italic">rinnovo dal secondo anno € 70 all'anno</span></>
                  )}
                </p>
                <ul className="text-stone-600 space-y-4 mb-10 flex-1">
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> <span className="font-bold text-stone-900">Tutto il piano Premium, più:</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> <span>Spazio: 50 GB</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> <span>Max 30 capitoli</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> <span>Proiezione Live Evento</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> <span>Esportazione PDF dei Tavoli</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> <span>Vetrina e Tableau personalizzabili</span></li>
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full h-14 rounded-full border-stone-300 text-lg hover:bg-stone-100 disabled:opacity-50"
                  disabled={isTriennial}
                >
                  {isTriennial ? 'Presto Disponibile' : 'Seleziona Diamond'}
                </Button>
                {isTriennial && <p className="text-xs text-center text-stone-400 mt-2">Pagamento triennale in fase di configurazione Stripe.</p>}
              </div>
            </div></div></section>

      <Footer />
    </div>
  );
}



