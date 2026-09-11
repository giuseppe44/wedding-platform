import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Star, Heart, Camera } from "lucide-react";
import Footer from "@/components/Footer";

export default function PrezziPage() {
  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans flex flex-col">
      {/* HEADER */}
      <div className="bg-stone-950 text-white py-24 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-serif mb-6">Scegli il tuo piano ideale</h1>
        <p className="text-stone-400 max-w-2xl mx-auto text-lg">
          Trasparenza totale. Nessun costo nascosto. Seleziona se sei una coppia di futuri sposi o un professionista del settore.
        </p>
      </div>

      {/* TARIFFE SPOSI */}
      <section className="py-24 px-4 bg-[#faf9f8]" id="sposi">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-rose-100 rounded-full mb-6">
              <Heart className="w-6 h-6 text-rose-500" />
            </div>
            <h2 className="text-4xl font-serif text-stone-900">Piani per gli Sposi</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic */}
            <div className="bg-white p-10 rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all flex flex-col">
              <h4 className="font-bold text-2xl text-stone-800 mb-2">Basic</h4>
              <p className="text-stone-500 mb-6 h-10">L'essenziale per il tuo evento</p>
              <div className="mb-8">
                <span className="text-5xl font-serif font-bold text-stone-900">€ 100</span><span className="text-stone-500">/una tantum</span>
              </div>
              <ul className="text-stone-600 space-y-4 mb-10 flex-1">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> <span>Gestione di 1 Matrimonio/Evento</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> <span>Raccolta foto illimitata dagli ospiti</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> <span>Guestbook digitale base</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> <span>Download album in HD</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> <span>Mappa interattiva della location</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> <span>Privacy garantita (accesso tramite PIN)</span></li>
              </ul>
              <Link href="/login?role=COUPLE&mode=REGISTER"><Button className="w-full bg-stone-900 hover:bg-stone-800 h-14 rounded-full text-white text-lg">Seleziona Basic</Button></Link>
            </div>

            {/* Premium */}
            <div className="bg-stone-900 text-white p-10 rounded-3xl border border-stone-800 shadow-2xl relative transform md:-translate-y-4 flex flex-col">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                Il Più Scelto
              </div>
              <h4 className="font-bold text-2xl text-white mb-2">Premium</h4>
              <p className="text-stone-400 mb-6 h-10">Estendi i ricordi nel tempo</p>
              <div className="mb-8">
                <span className="text-5xl font-serif font-bold text-white">€ 180</span><span className="text-stone-400">/una tantum</span>
              </div>
              <ul className="text-stone-300 space-y-4 mb-10 flex-1">
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" /> <span className="font-bold text-white">Tutto il piano Basic, più:</span></li>
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" /> <span>Fino a 3 Capitoli della Vita (es. Anniversario)</span></li>
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" /> <span>Gestione Tavoli e RSVP ospiti</span></li>
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" /> <span>Timeline e programma della giornata</span></li>
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" /> <span>Video-dediche dagli invitati</span></li>
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" /> <span>Design personalizzato della galleria</span></li>
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" /> <span>Inviti digitali integrati (Email/WhatsApp)</span></li>
              </ul>
              <Link href="/login?role=COUPLE&mode=REGISTER"><Button className="w-full bg-rose-500 hover:bg-rose-600 text-white h-14 rounded-full font-bold text-lg">Seleziona Premium</Button></Link>
            </div>

            {/* Moon */}
            <div className="bg-white p-10 rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all flex flex-col">
              <h4 className="font-bold text-2xl text-stone-800 mb-2">Moon</h4>
              <p className="text-stone-500 mb-6 h-10">L'esperienza di lusso definitiva</p>
              <div className="mb-8">
                <span className="text-5xl font-serif font-bold text-stone-900">€ 250</span><span className="text-stone-500">/una tantum</span>
              </div>
              <ul className="text-stone-600 space-y-4 mb-10 flex-1">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> <span className="font-bold text-stone-900">Tutto il piano Premium, più:</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> <span>Capitoli della Vita illimitati</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> <span>Nessuna filigrana o logo WeddingSpace</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> <span>Conservazione in Cloud garantita a vita</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> <span>Dominio personalizzato (es. lucaemaria.it)</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> <span>Assistenza prioritaria dedicata 24/7</span></li>
              </ul>
              <Link href="/login?role=COUPLE&mode=REGISTER"><Button variant="outline" className="w-full h-14 rounded-full border-stone-300 text-lg hover:bg-stone-100">Seleziona Moon</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* TARIFFE PROFESSIONISTI */}
      <section className="py-24 px-4 bg-stone-950 text-white border-t border-stone-800" id="professionisti">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-amber-500/10 rounded-full mb-6">
              <Camera className="w-6 h-6 text-amber-500" />
            </div>
            <h2 className="text-4xl font-serif text-white">Piani per Professionisti</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Entry */}
            <div className="bg-stone-900 p-10 rounded-3xl border border-stone-800 shadow-xl flex flex-col">
              <h4 className="font-bold text-2xl text-white mb-2">Entry</h4>
              <p className="text-stone-500 mb-6 h-10">Ideale per iniziare</p>
              <div className="mb-8">
                <span className="text-5xl font-serif font-bold text-white">€ 150</span><span className="text-stone-500">/anno</span>
              </div>
              <ul className="text-stone-400 space-y-4 mb-10 flex-1">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> <span>Gestione fino a 5 Matrimoni/Eventi</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> <span>Profilo base nella directory pubblica</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> <span>Lead generation standard (Email)</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> <span>Galleria privata per gli sposi</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> <span>QR Code personalizzato per i tavoli</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> <span>Assistenza via email</span></li>
              </ul>
              <Link href="/login?role=PHOTOGRAPHER&mode=REGISTER"><Button variant="outline" className="w-full border-stone-700 text-stone-300 hover:text-white hover:bg-stone-800 h-14 rounded-full text-lg">Seleziona Entry</Button></Link>
            </div>

            {/* Pro */}
            <div className="bg-gradient-to-b from-stone-800 to-stone-900 text-white p-10 rounded-3xl border border-amber-500/50 shadow-2xl relative transform md:-translate-y-4 flex flex-col">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-amber-950 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                Consigliato
              </div>
              <h4 className="font-bold text-2xl text-white mb-2">Pro</h4>
              <p className="text-stone-400 mb-6 h-10">Per chi vuole scalare il business</p>
              <div className="mb-8">
                <span className="text-5xl font-serif font-bold text-white">€ 230</span><span className="text-stone-400">/anno</span>
              </div>
              <ul className="text-stone-300 space-y-4 mb-10 flex-1">
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" /> <span className="font-semibold text-white">Tutto il piano Entry, più:</span></li>
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" /> <span>Matrimoni ed Eventi Illimitati</span></li>
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" /> <span>Vetrina Premium ad alta visibilità</span></li>
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" /> <span>Modulo Upsell e Richiesta Stampe</span></li>
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" /> <span>Download album in Alta Risoluzione</span></li>
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" /> <span>Export Database Contatti (CSV)</span></li>
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" /> <span>Personalizzazione colori e logo galleria</span></li>
              </ul>
              <Link href="/login?role=PHOTOGRAPHER&mode=REGISTER"><Button className="w-full bg-amber-500 hover:bg-amber-600 text-amber-950 h-14 rounded-full font-bold text-lg">Seleziona Pro</Button></Link>
            </div>

            {/* Diamond */}
            <div className="bg-stone-900 p-10 rounded-3xl border border-stone-800 shadow-xl flex flex-col">
              <h4 className="font-bold text-2xl text-white mb-2">Diamond</h4>
              <p className="text-stone-500 mb-6 h-10">Il top per grandi agenzie</p>
              <div className="mb-8">
                <span className="text-5xl font-serif font-bold text-white">€ 450</span><span className="text-stone-500">/anno</span>
              </div>
              <ul className="text-stone-400 space-y-4 mb-10 flex-1">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> <span className="font-semibold text-white">Tutto il piano Pro, più:</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> <span>Multi-account per collaboratori (Team)</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> <span>Analytics avanzati e conversioni</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> <span>Rimozione totale brand (White-label)</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> <span>Dominio personalizzato (es. eventi.tuonome.it)</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> <span>Account Manager dedicato</span></li>
              </ul>
              <Link href="/login?role=PHOTOGRAPHER&mode=REGISTER"><Button variant="outline" className="w-full border-stone-700 text-stone-300 hover:text-white hover:bg-stone-800 h-14 rounded-full text-lg">Seleziona Diamond</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
