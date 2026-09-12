import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Camera, Users, Target, Rocket, ArrowRight, CheckCircle2, TrendingUp, BarChart, MonitorSmartphone, Star, Gift, Heart } from "lucide-react";
import Footer from "@/components/Footer";

export default function ProfessionistiPage() {
  return (
    <div className="min-h-screen bg-stone-950 font-sans text-stone-100 flex flex-col">
      {/* 1. HERO - ALTO IMPATTO */}
      <section className="relative pt-40 pb-32 px-4 flex flex-col items-center justify-center text-center overflow-hidden min-h-[90vh]">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-30 mix-blend-luminosity" alt="Fotografo al lavoro" />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-950/80 to-stone-950" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-sm tracking-widest uppercase mb-8 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
            <Rocket className="w-4 h-4" /> LANCIO UFFICIALE: FOUNDERS CLUB APERTO
          </div>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-6 leading-tight text-white">
            Diventa il professionista <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">più richiesto</span> della tua città.
          </h1>
          <p className="text-xl md:text-2xl text-stone-400 max-w-3xl mx-auto mb-12 font-light">
            Smetti di perdere contatti. Trasforma ogni matrimonio in una macchina automatica di lead generation e aumenta il tuo fatturato vendendo stampe direttamente agli invitati.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#founders">
              <Button size="lg" className="h-16 px-10 rounded-full bg-amber-500 hover:bg-amber-600 text-stone-950 text-xl font-bold shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all hover:scale-105">
                Accedi al Founders Club <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
            <Link href="#pricing">
              <Button size="lg" variant="outline" className="h-16 px-10 rounded-full border-stone-700 hover:bg-stone-800 text-stone-300 text-xl">
                Vedi i Piani Normali
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. FOUNDERS CLUB PROMO (NEW SECTION) */}
      <section className="py-24 bg-gradient-to-b from-stone-950 to-stone-900 border-b border-stone-800 relative overflow-hidden" id="founders">
        <div className="absolute -right-40 -top-40 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute -left-40 bottom-0 w-96 h-96 bg-rose-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="bg-stone-900 border border-amber-500/30 rounded-[3rem] p-8 md:p-16 shadow-[0_0_50px_rgba(245,158,11,0.1)] relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-500 text-stone-950 font-black tracking-widest uppercase text-sm px-6 py-2 rounded-full flex items-center gap-2">
              <Gift className="w-5 h-5" /> Offerta Lancio (Solo 50 Posti)
            </div>
            
            <div className="text-center mb-10 mt-4">
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Il primo anno te lo paghiamo noi.</h2>
              <p className="text-xl text-stone-400 font-light max-w-2xl mx-auto">
                Stiamo selezionando 50 fotografi in tutta Italia per lanciare la piattaforma. Candidati ora e ottieni il pacchetto <strong className="text-amber-400">PRO (Valore €230) 100% GRATIS</strong> per 12 mesi.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-stone-950 p-8 rounded-3xl border border-stone-800">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">L'unica Condizione?</h3>
                <p className="text-stone-400 mb-6 leading-relaxed">
                  Vogliamo professionisti veri. Ti chiediamo solo di usare ecos.com e i nostri QR Code per la raccolta foto in almeno <strong>3 matrimoni reali quest'anno</strong>. 
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-stone-300"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Nessun vincolo di rinnovo</li>
                  <li className="flex items-center gap-3 text-stone-300"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Zero commissioni sulle stampe</li>
                  <li className="flex items-center gap-3 text-stone-300"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Profilo "VIP Partner" nella directory</li>
                </ul>
              </div>
              <div className="text-center bg-stone-900 p-8 rounded-2xl border border-stone-800 relative">
                <div className="text-stone-500 line-through text-2xl mb-2 font-serif">€ 230,00</div>
                <div className="text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-2">€ 0,00</div>
                <div className="text-stone-400 mb-8 uppercase tracking-widest text-sm font-bold">Per i primi 12 Mesi</div>
                <Link href="/login?role=PHOTOGRAPHER&mode=REGISTER">
                  <Button className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                    Blocca il tuo Posto Gratis
                  </Button>
                </Link>
                <p className="text-stone-500 text-xs mt-4">Restano solo 14 inviti disponibili.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. IL PROBLEMA / LA SOLUZIONE (AGITAZIONE) */}
      <section className="py-24 bg-stone-900 border-b border-stone-800 relative">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-serif text-white mb-6">Quanti contatti stai lasciando sul tavolo?</h2>
            <p className="text-lg text-stone-400 mb-8 leading-relaxed">
              In un matrimonio medio ci sono 100 invitati. Ognuno di loro fa foto, ognuno di loro guarda le tue foto, ma <strong>nessuno di loro conosce il tuo nome o ha il tuo bigliettino da visita.</strong>
            </p>
            <p className="text-lg text-stone-400 mb-8 leading-relaxed">
              Con ecos.com, ogni invitato che inquadra il QR code per vedere o caricare le foto entra nel <strong>tuo database</strong>.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-stone-300"><CheckCircle2 className="w-6 h-6 text-emerald-500" /> Acquisizione contatti 100% GDPR compliant</li>
              <li className="flex items-center gap-3 text-stone-300"><CheckCircle2 className="w-6 h-6 text-emerald-500" /> Profilo in evidenza nella directory sposi</li>
              <li className="flex items-center gap-3 text-stone-300"><CheckCircle2 className="w-6 h-6 text-emerald-500" /> E-commerce integrato per vendere le tue stampe</li>
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-rose-500/20 blur-3xl rounded-full" />
            <div className="relative bg-stone-950 border border-stone-800 p-8 rounded-3xl shadow-2xl">
              <div className="flex items-center justify-between mb-8 border-b border-stone-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-white font-bold">Nuovo Lead Acquisito</div>
                    <div className="text-stone-500 text-sm">Ospite Matrimonio Rossi</div>
                  </div>
                </div>
                <div className="text-emerald-500 font-bold">+1</div>
              </div>
              <div className="flex items-center justify-between mb-8 border-b border-stone-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center">
                    <BarChart className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-white font-bold">Stampa Venduta</div>
                    <div className="text-stone-500 text-sm">Foto #402 - 20x30cm</div>
                  </div>
                </div>
                <div className="text-emerald-500 font-bold">€ 15.00</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-rose-500" />
                  </div>
                  <div>
                    <div className="text-white font-bold">Nuova Recensione</div>
                    <div className="text-stone-500 text-sm">5 Stelle Vetrina Sposi</div>
                  </div>
                </div>
                <div className="flex text-amber-500"><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURE GRID */}
      <section className="py-24 bg-stone-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Strumenti progettati per fatturare</h2>
            <p className="text-stone-400 max-w-2xl mx-auto text-lg">Abbiamo tolto tutto il superfluo per lasciarti solo le funzionalità che impattano direttamente sul tuo business.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-stone-900 border border-stone-800 p-8 rounded-3xl hover:border-amber-500/50 transition-colors group">
              <MonitorSmartphone className="w-10 h-10 text-amber-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-4">AI Matchmaking</h3>
              <p className="text-stone-400 text-sm leading-relaxed">Gli sposi cercano con linguaggio naturale. La nostra intelligenza artificiale li collega direttamente a te se il tuo profilo combacia perfettamente.</p>
            </div>
            <div className="bg-stone-900 border border-stone-800 p-8 rounded-3xl hover:border-amber-500/50 transition-colors group">
              <Rocket className="w-10 h-10 text-amber-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-4">CRM & Preventivi Digitali</h3>
              <p className="text-stone-400 text-sm leading-relaxed">Crea, invia e fai firmare digitalmente preventivi spettacolari. Ricevi l'acconto istantaneamente via Stripe senza uscire dalla piattaforma.</p>
            </div>
            <div className="bg-stone-900 border border-stone-800 p-8 rounded-3xl hover:border-amber-500/50 transition-colors group">
              <Users className="w-10 h-10 text-amber-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-4">Lead Gen dagli Invitati</h3>
              <p className="text-stone-400 text-sm leading-relaxed">Gli invitati lasciano la mail per scaricare le foto. Tu usi quelle email per proporre i tuoi servizi per i loro futuri eventi (battesimi, ecc).</p>
            </div>
            <div className="bg-stone-900 border border-stone-800 p-8 rounded-3xl hover:border-amber-500/50 transition-colors group">
              <Camera className="w-10 h-10 text-amber-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-4">Upsell & E-Commerce</h3>
              <p className="text-stone-400 text-sm leading-relaxed">Vendi foto in alta risoluzione o fotolibri in autonomia tramite la gallery privata degli sposi. Trattieni l'intero margine.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PREZZI PROFESSIONISTI */}
      <section className="py-24 bg-[#1c1917] border-t border-stone-800" id="pricing">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl md:text-5xl font-serif text-white">I Piani a Regime</h2>
            <p className="text-xl text-stone-400 max-w-2xl mx-auto font-light">
              Ecco i costi reali della piattaforma se non entri nel Founders Club.<br/> Recuperi il costo chiudendo anche un solo cliente in più.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto opacity-90">
            {/* Entry */}
            <div className="bg-stone-900 p-10 rounded-3xl border border-stone-800 shadow-xl flex flex-col hover:border-stone-700 transition-colors">
              <h4 className="font-bold text-2xl text-white mb-2">Entry</h4>
              <p className="text-stone-500 mb-6 h-10">Ideale per iniziare</p>
              <div className="mb-8">
                <span className="text-5xl font-serif font-bold text-white">€ 150</span><span className="text-stone-500">/anno</span>
              </div>
              <ul className="text-stone-400 space-y-4 mb-10 flex-1">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> <span>Gestione fino a 5 Eventi</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> <span>Profilo base nella directory</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> <span>Lead generation standard (Email)</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> <span>Galleria privata per gli sposi</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> <span>Assistenza via email</span></li>
              </ul>
              <Link href="/login?role=PHOTOGRAPHER&mode=REGISTER"><Button variant="outline" className="w-full border-stone-700 text-stone-300 hover:text-white hover:bg-stone-800 h-14 rounded-full text-lg">Seleziona Entry</Button></Link>
            </div>

            {/* Pro */}
            <div className="bg-gradient-to-b from-stone-800 to-stone-900 text-white p-10 rounded-3xl border border-amber-500/50 shadow-2xl relative transform md:-translate-y-6 flex flex-col">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                Incluso nel Founders Club
              </div>
              <h4 className="font-bold text-2xl text-white mb-2">Pro</h4>
              <p className="text-stone-400 mb-6 h-10">Per chi vuole scalare il business</p>
              <div className="mb-8">
                <span className="text-5xl font-serif font-bold text-white">€ 230</span><span className="text-stone-400">/anno</span>
              </div>
              <ul className="text-stone-300 space-y-4 mb-10 flex-1">
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" /> <span className="font-semibold text-white">Tutto il piano Entry, più:</span></li>
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" /> <span>Eventi Illimitati</span></li>
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" /> <span>Vetrina Premium ad alta visibilità</span></li>
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" /> <span>Modulo Upsell e Richiesta Stampe</span></li>
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" /> <span>Download album in Alta Risoluzione</span></li>
                <li className="flex items-start gap-3"><Star className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" /> <span>Personalizzazione colori e logo galleria</span></li>
              </ul>
              <Link href="#founders"><Button className="w-full bg-amber-500 hover:bg-amber-600 text-amber-950 h-14 rounded-full font-bold text-lg">Provalo Gratis</Button></Link>
            </div>

            {/* Diamond */}
            <div className="bg-stone-900 p-10 rounded-3xl border border-stone-800 shadow-xl flex flex-col hover:border-stone-700 transition-colors">
              <h4 className="font-bold text-2xl text-white mb-2">Diamond</h4>
              <p className="text-stone-500 mb-6 h-10">Ideale per Wedding Planner & Location</p>
              <div className="mb-8">
                <span className="text-5xl font-serif font-bold text-white">€ 490</span><span className="text-stone-500">/anno</span>
              </div>
              <ul className="text-stone-400 space-y-4 mb-10 flex-1">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> <span className="font-semibold text-white">Tutto il piano Pro, più:</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> <span>Multi-account per staff e collaboratori</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> <span>Pacchetti Sposi in stock da rivendere</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> <span>Piattaforma White-Label (Tuo Logo)</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> <span>Dominio personalizzato (es. portale.tuobrand.it)</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /> <span>Account Manager ecos.com dedicato</span></li>
              </ul>
              <Link href="/login?role=PHOTOGRAPHER&mode=REGISTER"><Button variant="outline" className="w-full border-stone-700 text-stone-300 hover:text-white hover:bg-stone-800 h-14 rounded-full text-lg">Contattaci per Demo</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
