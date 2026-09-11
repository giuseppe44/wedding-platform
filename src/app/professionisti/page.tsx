import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase, TrendingUp, Users, CheckCircle2, Star, ArrowRight, Printer } from "lucide-react";

export default function ProfessionistiLandingPage() {
  return (
    <div className="min-h-screen bg-[#1c1917] font-sans text-stone-100">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-stone-950 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent opacity-90" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-white">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-full mb-8 backdrop-blur-sm border border-white/10">
            <Briefcase className="w-5 h-5 text-amber-400 mr-2" />
            <span className="text-sm font-medium tracking-wide">Per Fotografi e Professionisti</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-8 drop-shadow-lg leading-tight">
            Trasforma ogni evento in <br />
            <span className="italic font-light text-amber-300">nuovi clienti.</span>
          </h1>
          <p className="text-xl text-stone-300 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Non consegnare solo le foto: consegna un'esperienza. Ottieni i contatti degli invitati, vendi stampe dirette e crea la tua vetrina esclusiva.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/login?role=PHOTOGRAPHER&mode=REGISTER">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-xl transition-all hover:scale-105 border-none font-bold">
                Diventa Partner Ufficiale <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FUNZIONALITA */}
      <section className="py-24 bg-stone-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Molto più di una gallery</h2>
            <p className="text-lg text-stone-400 max-w-2xl mx-auto">
              I migliori professionisti non si limitano a scattare foto. Gestiscono il loro brand.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-stone-800 p-8 rounded-3xl border border-stone-700 hover:border-amber-500/30 transition-colors">
              <div className="w-14 h-14 bg-stone-700 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-2xl font-serif text-white mb-3">Lead Generation</h3>
              <p className="text-stone-400 leading-relaxed">
                Raccogli automaticamente le email degli invitati che vogliono vedere le foto. Costruisci il tuo database per marketing futuro.
              </p>
            </div>
            
            <div className="bg-stone-800 p-8 rounded-3xl border border-stone-700 hover:border-amber-500/30 transition-colors">
              <div className="w-14 h-14 bg-stone-700 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-serif text-white mb-3">Vetrina Portfolio</h3>
              <p className="text-stone-400 leading-relaxed">
                Tutti i matrimoni a cui partecipi formano automaticamente la tua Vetrina Pubblica. Fatti trovare dalle future coppie.
              </p>
            </div>
            
            <div className="bg-stone-800 p-8 rounded-3xl border border-stone-700 hover:border-amber-500/30 transition-colors">
              <div className="w-14 h-14 bg-stone-700 rounded-2xl flex items-center justify-center mb-6">
                <Printer className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-serif text-white mb-3">Upsell & Stampe</h3>
              <p className="text-stone-400 leading-relaxed">
                Inserisci pulsanti per richiedere stampe, scaricare file in alta risoluzione o lasciare recensioni su Google direttamente dall'app.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PREZZI */}
      <section className="py-24 bg-stone-950 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-serif text-white">Un investimento nel tuo brand</h2>
            <p className="text-lg text-stone-400 max-w-2xl mx-auto">
              Recuperi il costo con il primo cliente acquisito.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Entry */}
            <div className="bg-stone-900 p-8 rounded-3xl border border-stone-800 shadow-sm hover:border-stone-700 transition-colors">
              <h4 className="font-bold text-2xl text-white mb-2">Entry</h4>
              <p className="text-stone-500 mb-6 h-10">Ideale per iniziare</p>
              <div className="mb-8">
                <span className="text-4xl font-serif font-bold text-white">€ 150</span><span className="text-stone-500">/anno</span>
              </div>
              <ul className="text-stone-400 space-y-4 mb-8">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" /> <span>Gestione fino a 5 Matrimoni</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" /> <span>Profilo base nella directory</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" /> <span>Lead generation standard</span></li>
              </ul>
              <Link href="/login?role=PHOTOGRAPHER&mode=REGISTER"><Button variant="outline" className="w-full border-stone-700 text-stone-300 hover:text-white hover:bg-stone-800 h-12 rounded-full">Inizia Ora</Button></Link>
            </div>

            {/* Pro */}
            <div className="bg-gradient-to-b from-stone-800 to-stone-900 text-white p-8 rounded-3xl border border-amber-500/50 shadow-2xl relative transform md:-translate-y-4">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-amber-950 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                Consigliato
              </div>
              <h4 className="font-bold text-2xl text-white mb-2">Pro</h4>
              <p className="text-stone-400 mb-6 h-10">Per chi vuole scalare il business</p>
              <div className="mb-8">
                <span className="text-4xl font-serif font-bold text-white">€ 230</span><span className="text-stone-400">/anno</span>
              </div>
              <ul className="text-stone-300 space-y-4 mb-8">
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-amber-400 shrink-0" /> <span>Matrimoni Illimitati</span></li>
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-amber-400 shrink-0" /> <span>Vetrina Premium ad alta visibilità</span></li>
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-amber-400 shrink-0" /> <span>Modulo Upsell e Richiesta Stampe</span></li>
              </ul>
              <Link href="/login?role=PHOTOGRAPHER&mode=REGISTER"><Button className="w-full bg-amber-500 hover:bg-amber-600 text-amber-950 h-12 rounded-full font-bold">Diventa Pro</Button></Link>
            </div>

            {/* Diamond */}
            <div className="bg-stone-900 p-8 rounded-3xl border border-stone-800 shadow-sm hover:border-stone-700 transition-colors">
              <h4 className="font-bold text-2xl text-white mb-2">Diamond</h4>
              <p className="text-stone-500 mb-6 h-10">Il top per grandi agenzie</p>
              <div className="mb-8">
                <span className="text-4xl font-serif font-bold text-white">€ 450</span><span className="text-stone-500">/anno</span>
              </div>
              <ul className="text-stone-400 space-y-4 mb-8">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" /> <span>Tutto il piano Pro</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" /> <span>Multi-account per collaboratori</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" /> <span>Analytics avanzati</span></li>
              </ul>
              <Link href="/login?role=PHOTOGRAPHER&mode=REGISTER"><Button variant="outline" className="w-full border-stone-700 text-stone-300 hover:text-white hover:bg-stone-800 h-12 rounded-full">Contattaci</Button></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
