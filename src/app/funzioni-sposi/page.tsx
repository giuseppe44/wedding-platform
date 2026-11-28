import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { GentiLunaLogo } from "@/components/GentiLunaLogo";
import {
  Heart,
  QrCode,
  MapPin,
  Users,
  BookOpen,
  Gift,
  Sparkles,
  Lock,
  ArrowRight,
  Camera,
  CheckCircle2,
  ShieldCheck,
  Briefcase,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Funzioni Lato Sposi ed Eventi – Sito Nozze, QR Foto e Organizzazione",
  description:
    "Scopri le principali funzionalità di GentiLuna per Sposi ed Eventi privati: sito web personalizzato con busta d'invito, raccolta foto QR Code, RSVP, mappa tavoli e capitoli di vita.",
  alternates: {
    canonical: "/funzioni-sposi",
  },
};

const CORE_COUPLE_FEATURES = [
  {
    icon: Sparkles,
    title: "Sito Evento Unico & Apertura a Busta",
    badge: "Incluso da subito",
    text: "Un indirizzo elegante con i vostri nomi e una busta interattiva con sigillo che accoglie amici e familiari fin dal primo clic.",
  },
  {
    icon: QrCode,
    title: "Raccolta Foto & Video via QR Code",
    badge: "Senza App",
    text: "Scarichi il QR Code e lo metti sui tavoli: gli invitati inquadrano con la fotocamera e inviano foto spontanee dal browser, senza installare nulla.",
  },
  {
    icon: Users,
    title: "Inviti Digitali, RSVP & Intolleranze",
    badge: "Zero caos Excel",
    text: "Link personali per confermare la presenza, indicare allergie o intolleranze alimentari e scelte menù per facilitare sala e catering.",
  },
  {
    icon: MapPin,
    title: "Mappa Tavoli & Luoghi della Giornata",
    badge: "Interattivo",
    text: "Indirizzi precisi di cerimonia e ricevimento, orari delle fasi dell'evento e disposizione dei tavoli consultabile dagli invitati quando vuoi tu.",
  },
  {
    icon: BookOpen,
    title: "Capitoli della Storia & Guestbook",
    badge: "Per sempre",
    text: "Parti dal matrimonio ma continua nel tempo con Viaggi, Anniversari, Nascite, Battesimi e dediche degli ospiti conservate in un archivio ordinato.",
  },
  {
    icon: Gift,
    title: "Lista Nozze, Quote Viaggio & Documenti",
    badge: "0% trattenute",
    text: "Mostra con eleganza il tuo IBAN, le tappe del viaggio di nozze o link esterni e custodisci biglietti e voucher nella tua area riservata.",
  },
];

const TEASER_COUPLE_PREVIEWS = [
  {
    title: "Modalità Proiezione Live in Sala",
    summary:
      "Uno strumento dedicato ai momenti clou della festa per trasformare monitor e proiettori del ricevimento in un racconto visivo istantaneo.",
  },
  {
    title: "Regia Privacy & Moderazione Granulare",
    summary:
      "Controlli mirati su singoli capitoli, sezioni visibili al pubblico e approvazione preventiva su ogni scatto o dedica ricevuta.",
  },
  {
    title: "Guida Intelligente & Percorso Guidato Sposi",
    summary:
      "Un sistema di suggerimenti passo-passo e assistente contestuale integrato in bacheca che ti aiuta a non dimenticare alcun dettaglio.",
  },
  {
    title: "Collaborazione Riservata con i Tuoi Fornitori",
    summary:
      "Funzioni evolute interne all'Area di Gestione pensate per far dialogare in sicurezza il vostro album e il team di professionisti scelto.",
  },
];

export default function FunzioniSposiPage() {
  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans text-stone-900 flex flex-col overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5 font-serif text-xl sm:text-2xl text-stone-900">
            <GentiLunaLogo className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" />
            <span>GentiLuna</span>
          </Link>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium">
            <Link href="/budget-matrimonio" className="text-amber-700 font-bold hover:text-amber-800 px-2.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 transition-colors">
              Budget &amp; Idee ✨
            </Link>
            <Link href="/funzioni-professionisti" className="text-stone-600 hover:text-stone-900 px-2.5 py-1.5 rounded-full hover:bg-stone-100 transition-colors">
              Funzioni Professionisti
            </Link>
            <Link href="/blog" className="text-stone-600 hover:text-stone-900 px-2.5 py-1.5 rounded-full hover:bg-stone-100 transition-colors">
              Blog
            </Link>
            <Link href="/prezzi" className="text-stone-600 hover:text-stone-900 px-2.5 py-1.5 rounded-full hover:bg-stone-100 transition-colors">
              Piani &amp; Prezzi
            </Link>
            <Link href="/login?role=COUPLE&mode=REGISTER">
              <Button className="rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold px-4 sm:px-6 h-9 sm:h-10 text-xs sm:text-sm">
                Crea il tuo Spazio
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="relative bg-stone-950 text-white py-16 sm:py-24 px-4 sm:px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-950/60 via-stone-950 to-amber-950/40 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-bold uppercase tracking-widest">
            <Heart className="w-3.5 h-3.5 text-rose-400" /> Funzioni Lato Sposi ed Eventi
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif leading-tight">
            Tutto quello che serve per il tuo evento,{" "}
            <span className="text-rose-300 italic font-light">senza stress e senza app.</span>
          </h1>
          <p className="text-base sm:text-xl text-stone-300 font-light max-w-2xl mx-auto leading-relaxed">
            Ecco una panoramica delle funzioni principali dedicate a matrimoni, feste, battesimi, compleanni e anniversari — più alcune anticipazioni su ciò che troverai solo dentro la tua Area Riservata.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/login?role=COUPLE&mode=REGISTER" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto min-h-12 h-auto py-3 px-7 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm sm:text-base whitespace-normal text-center leading-snug">
                <span>Inizia Gratis il tuo Spazio</span>
                <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
              </Button>
            </Link>
            <Link href="/prezzi" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto min-h-12 h-auto py-3 px-7 rounded-full bg-transparent border-stone-600 text-white hover:bg-white/10 text-sm sm:text-base whitespace-normal text-center leading-snug">
                Vedi Piani Annuali e Triennali
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* VISUAL SHOWCASE SPOSI */}
      <section className="pt-12 sm:pt-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl overflow-hidden border border-stone-200/80 shadow-md bg-white">
            <div className="aspect-[16/9]">
              <img
                src="/press/GentiLuna_Immagine_7.jpg"
                alt="Tableau Interattivo, Galleria HD, RSVP e Timeline GentiLuna"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5">
              <p className="font-serif font-bold text-stone-900 text-lg">Tableau, Galleria HD &amp; Scaletta in Diretta</p>
              <p className="text-sm text-stone-500 font-light mt-1">Tutto ciò che gli ospiti cercano durante l&apos;evento, raggiungibile dal QR Code al tavolo.</p>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden border border-stone-200/80 shadow-md bg-white">
            <div className="aspect-[16/9]">
              <img
                src="/press/GentiLuna_Showcase_Regali_Guestbook.jpg"
                alt="Lista Regali IBAN, Tappe Viaggio Nozze, Guestbook Dediche e Documenti"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5">
              <p className="font-serif font-bold text-stone-900 text-lg">Lista Nozze, Quote Viaggio &amp; Guestbook</p>
              <p className="text-sm text-stone-500 font-light mt-1">Regali trasparenti, tappe del viaggio di nozze e dediche emozionanti senza intermediazioni.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FUNCTIONS LISTED OPENLY */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mb-4">
            Alcune delle funzionalità principali già pronte
          </h2>
          <p className="text-stone-600 text-base sm:text-lg font-light">
            Strumenti concreti progettati per aiutarti davvero prima, durante e dopo il giorno della festa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CORE_COUPLE_FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 px-3 py-1 rounded-full">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-stone-900 mb-3">{feat.title}</h3>
                  <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-light">{feat.text}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-10 rounded-3xl bg-gradient-to-r from-amber-50 via-white to-rose-50 border border-amber-200/80 p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 text-center lg:text-left max-w-2xl">
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full">
              Bussola Gratuita Pre-Evento
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Hai in mente un budget? Parti da lì e organizza senza errori
            </h3>
            <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
              Prova il nostro simulatore ipotetico gratuito o consulta le 6 Idee di Budget: confronta Ristorante vs Villa + Catering, scopri chi contattare e condividi il piano su WhatsApp col tuo partner.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full sm:w-auto">
            <Link href="/budget-matrimonio">
              <Button className="w-full sm:w-auto rounded-full bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold px-6 h-11 text-sm">
                Apri Simulatore Budget →
              </Button>
            </Link>
            <Link href="/budget-matrimonio?tab=idee">
              <Button variant="outline" className="w-full sm:w-auto rounded-full border-stone-300 text-stone-800 hover:bg-white px-5 h-11 text-sm">
                Vedi 6 Idee Pronte
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* EXCLUSIVE / TEASER SECTION (PROTECTED FROM COMPETITORS) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-stone-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12 pb-8 border-b border-stone-800">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-300 bg-amber-500/10 border border-amber-400/20 px-3.5 py-1.5 rounded-full">
                <Lock className="w-3.5 h-3.5" /> Anteprima dell&apos;Ecosistema Interno
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif">
                E molto altro ti aspetta dentro l&apos;Area Personale
              </h2>
              <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
                Non esponiamo pubblicamente tutte le automazioni e gli strumenti avanzati per tutelare l&apos;unicità del portale dalle copie dei competitor: iscrivendoti scopri subito l&apos;intera suite guidata passo-passo.
              </p>
            </div>
            <Link href="/login?role=COUPLE&mode=REGISTER" className="w-full sm:w-auto shrink-0">
              <Button className="w-full sm:w-auto min-h-12 h-auto py-3 px-6 rounded-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold whitespace-normal text-center leading-snug">
                <span>Sblocca l&apos;Area Sposi</span>
                <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TEASER_COUPLE_PREVIEWS.map((item) => (
              <div
                key={item.title}
                className="bg-stone-950/70 border border-stone-800 rounded-3xl p-6 sm:p-8 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-stone-400 leading-relaxed">{item.summary}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-sm text-stone-300">
                <strong className="text-white block mb-1">Hai già un Fotografo o Fornitore Partner GentiLuna?</strong>
                Chiedigli l&apos;accesso agevolato: molti professionisti integrano GentiLuna direttamente nel loro servizio sposi.
              </div>
            </div>
            <Link href="/fornitori" className="w-full sm:w-auto shrink-0">
              <Button variant="outline" className="w-full sm:w-auto min-h-11 h-auto py-2.5 px-5 rounded-full bg-transparent border-stone-600 text-white hover:bg-white/10 whitespace-normal text-center">
                <Briefcase className="w-4 h-4 mr-2 shrink-0" />
                <span>Cerca Fornitori Partner</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
