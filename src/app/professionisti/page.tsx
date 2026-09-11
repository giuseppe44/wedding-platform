import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase, TrendingUp, Users, CheckCircle2, Star, ArrowRight, Printer } from "lucide-react";
import Footer from "@/components/Footer";

export default function ProfessionistiLandingPage() {
  return (
    <div className="min-h-screen bg-[#1c1917] font-sans text-stone-100 flex flex-col">
      {/* HERO SECTION */}
      <section className="relative pt-40 pb-32 px-4 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-stone-950 z-0">
          <img src="https://images.unsplash.com/photo-1554048612-b6a37e5cb23e?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-30 grayscale" alt="Fotografo" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-white">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-full mb-8 backdrop-blur-sm border border-white/10">
            <Briefcase className="w-5 h-5 text-amber-400 mr-2" />
            <span className="text-sm font-medium tracking-wide text-amber-100">Il Business Partner per Fotografi</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-8 drop-shadow-lg leading-tight">
            Trasforma ogni evento in <br />
            <span className="italic font-light text-amber-300">nuovi clienti.</span>
          </h1>
          <p className="text-xl text-stone-300 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Non limitarti a consegnare le foto: consegna un'esperienza. Ottieni le email degli invitati, vendi stampe in modo automatico e crea la tua vetrina esclusiva.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/login?role=PHOTOGRAPHER&mode=REGISTER">
              <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-lg rounded-full bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-2xl transition-all hover:scale-105 border-none font-bold">
                Diventa Partner Ufficiale <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURE 1 - SPLIT */}
      <section className="py-24 bg-stone-900 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-4 bg-amber-900/30 rounded-[2rem] transform -rotate-3"></div>
              <img src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=2070&auto=format&fit=crop" alt="Marketing Fotografi" className="relative rounded-[2rem] shadow-2xl w-full object-cover aspect-[4/5] grayscale hover:grayscale-0 transition-all duration-700" />
              <div className="absolute -bottom-10 -right-10 bg-stone-800 p-6 rounded-3xl shadow-2xl hidden md:block border border-stone-700">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-500/20 p-3 rounded-full"><Users className="w-6 h-6 text-amber-400" /></div>
                  <div>
                    <p className="font-bold text-white">12 Nuovi Lead Acquisiti</p>
                    <p className="text-sm text-stone-400">Dal matrimonio di ieri</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-8 order-1 lg:order-2">
              <div className="w-16 h-16 bg-stone-800 border border-stone-700 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-amber-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">Il primo Viral Loop <br/>per fotografi.</h2>
              <p className="text-xl text-stone-400 leading-relaxed font-light">
                Perché lasciare i contatti sul tavolo quando puoi inserirli nel tuo database?
              </p>
              <p className="text-stone-300 leading-relaxed">
                Ogni matrimonio ha mediamente 100-150 invitati. Molti di loro si sposeranno presto o avranno bisogno di un fotografo. WeddingSpace cattura automaticamente le loro email per fargli vedere le tue foto, costruendo la tua lista contatti per te in modo passivo e nel rispetto della privacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE 2 - SPLIT */}
      <section className="py-24 bg-stone-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="w-16 h-16 bg-stone-800 border border-stone-700 rounded-2xl flex items-center justify-center mb-6">
                <Printer className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">Upsell automatico. <br/>Vendi senza vendere.</h2>
              <p className="text-xl text-stone-400 leading-relaxed font-light">
                Aumenta lo scontrino medio senza fare nessuna fatica.
              </p>
              <ul className="space-y-4 text-stone-300">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" /> <span>Inserisci un listino prezzi per stampe, tele e fotolibri.</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" /> <span>Gli invitati possono ordinare le loro foto preferite con un clic.</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" /> <span>Ogni spazio che crei diventa la tua vetrina pubblica sul nostro portale.</span></li>
              </ul>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-stone-800 rounded-[2rem] transform rotate-3"></div>
              <img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop" alt="Stampe e Fotolibri" className="relative rounded-[2rem] shadow-2xl w-full object-cover aspect-[4/5] grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* PREZZI */}
      <section className="py-32 bg-[#1c1917] border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl md:text-5xl font-serif text-white">Un investimento sul tuo brand</h2>
            <p className="text-xl text-stone-400 max-w-2xl mx-auto font-light">
              Recuperi il costo dell'abbonamento chiudendo anche un solo cliente in più grazie alla nostra piattaforma.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Entry */}
            <div className="bg-stone-900 p-10 rounded-3xl border border-stone-800 shadow-xl hover:border-stone-700 transition-colors">
              <h4 className="font-bold text-2xl text-white mb-2">Entry</h4>
              <p className="text-stone-500 mb-6 h-10">Ideale per iniziare</p>
              <div className="mb-8">
                <span className="text-5xl font-serif font-bold text-white">€ 150</span><span className="text-stone-500">/anno</span>
              </div>
              <ul className="text-stone-400 space-y-4 mb-10">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" /> <span>Gestione fino a 5 Matrimoni</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" /> <span>Profilo base nella directory</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" /> <span>Lead generation standard</span></li>
              </ul>
              <Link href="/login?role=PHOTOGRAPHER&mode=REGISTER"><Button variant="outline" className="w-full border-stone-700 text-stone-300 hover:text-white hover:bg-stone-800 h-14 rounded-full text-lg">Inizia Ora</Button></Link>
            </div>

            {/* Pro */}
            <div className="bg-gradient-to-b from-stone-800 to-stone-900 text-white p-10 rounded-3xl border border-amber-500/50 shadow-2xl relative transform md:-translate-y-8">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-amber-950 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                Consigliato
              </div>
              <h4 className="font-bold text-2xl text-white mb-2">Pro</h4>
              <p className="text-stone-400 mb-6 h-10">Per chi vuole scalare il business</p>
              <div className="mb-8">
                <span className="text-5xl font-serif font-bold text-white">€ 230</span><span className="text-stone-400">/anno</span>
              </div>
              <ul className="text-stone-300 space-y-4 mb-10">
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-amber-400 shrink-0" /> <span>Matrimoni Illimitati</span></li>
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-amber-400 shrink-0" /> <span>Vetrina Premium ad alta visibilità</span></li>
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-amber-400 shrink-0" /> <span>Modulo Upsell e Richiesta Stampe</span></li>
              </ul>
              <Link href="/login?role=PHOTOGRAPHER&mode=REGISTER"><Button className="w-full bg-amber-500 hover:bg-amber-600 text-amber-950 h-14 rounded-full font-bold text-lg">Diventa Pro</Button></Link>
            </div>

            {/* Diamond */}
            <div className="bg-stone-900 p-10 rounded-3xl border border-stone-800 shadow-xl hover:border-stone-700 transition-colors">
              <h4 className="font-bold text-2xl text-white mb-2">Diamond</h4>
              <p className="text-stone-500 mb-6 h-10">Il top per grandi agenzie</p>
              <div className="mb-8">
                <span className="text-5xl font-serif font-bold text-white">€ 450</span><span className="text-stone-500">/anno</span>
              </div>
              <ul className="text-stone-400 space-y-4 mb-10">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" /> <span>Tutto il piano Pro</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" /> <span>Multi-account per collaboratori</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" /> <span>Analytics avanzati</span></li>
              </ul>
              <Link href="/login?role=PHOTOGRAPHER&mode=REGISTER"><Button variant="outline" className="w-full border-stone-700 text-stone-300 hover:text-white hover:bg-stone-800 h-14 rounded-full text-lg">Contattaci</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
