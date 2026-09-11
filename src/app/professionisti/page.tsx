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
          <img src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-70 mix-blend-overlay" alt="Fotografo al lavoro" />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/40 to-stone-950" />
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

      {/* CTA PREZZI */}
      <section className="py-24 bg-stone-900 border-t border-stone-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Trasparenza totale. Nessun costo nascosto.</h2>
          <p className="text-xl text-stone-400 mb-10 font-light">
            Abbiamo creato piani su misura per far crescere la tua agenzia. Scopri tutte le funzionalità incluse e scegli l'investimento perfetto per il tuo business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/prezzi#professionisti">
              <Button size="lg" className="w-full sm:w-auto h-14 px-10 rounded-full bg-amber-500 hover:bg-amber-600 text-stone-950 text-lg shadow-xl font-bold">
                Scopri i nostri Piani <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
