import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { GentiLunaLogo } from "@/components/GentiLunaLogo";
import { BLOG_POSTS } from "@/data/blogPosts";
import { BlogClientGrid } from "./BlogClientGrid";

export const metadata: Metadata = {
  title: "Blog & Guide per Matrimoni, Ristoranti, Eventi e Professionisti",
  description:
    "22 guide pratiche su sito matrimonio personalizzato, QR Code foto invitati, Portale Ristorante allergie e tavoli, Agenzie Viaggi Luna di Miele, Pasticcerie, NCC Auto Sposi e vetrina gratuita fornitori.",
  keywords: [
    "blog matrimonio digitale",
    "portale ristorante matrimonio allergie",
    "lista viaggio di nozze agenzia viaggi",
    "ncc auto matrimonio e pasticceria torte",
    "gentiluna blog",
  ],
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogIndexPage() {
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
            <Link href="/funzioni-sposi" className="text-stone-600 hover:text-stone-900 px-2.5 py-1.5 rounded-full hover:bg-stone-100 transition-colors">
              Funzioni Sposi &amp; Eventi
            </Link>
            <Link href="/funzioni-professionisti" className="text-stone-600 hover:text-stone-900 px-2.5 py-1.5 rounded-full hover:bg-stone-100 transition-colors">
              Funzioni Professionisti
            </Link>
            <Link href="/partner" className="text-emerald-700 hover:text-emerald-800 font-semibold px-2.5 py-1.5 rounded-full hover:bg-emerald-50 transition-colors hidden md:inline-block">
              Ristoranti &amp; Partner
            </Link>
            <Link href="/fornitori" className="text-stone-600 hover:text-stone-900 px-2.5 py-1.5 rounded-full hover:bg-stone-100 transition-colors hidden sm:inline-block">
              Fornitori
            </Link>
            <Link href="/login">
              <Button className="rounded-full bg-stone-900 hover:bg-stone-800 text-white font-semibold px-4 sm:px-6 h-9 sm:h-10 text-xs sm:text-sm">
                Accedi
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO BLOG */}
      <header className="bg-stone-950 text-white py-16 sm:py-24 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-950/35 to-stone-950 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 space-y-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-rose-200 text-xs font-bold uppercase tracking-widest">
            <BookOpen className="w-3.5 h-3.5" /> Magazine &amp; Guide GentiLuna
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif leading-tight">
            Idee, guide pratiche e strategie{" "}
            <span className="italic text-rose-300 font-light">per Sposi &amp; Professionisti</span>
          </h1>
          <p className="text-base sm:text-xl text-stone-300 font-light max-w-2xl mx-auto leading-relaxed">
            Approfondimenti reali basati sulle funzionalità concrete di GentiLuna: dall&apos;organizzazione smart del ricevimento alla consegna fotografica e alla crescita del tuo studio.
          </p>
        </div>
      </header>

      {/* ARTICOLI */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16">
        <BlogClientGrid posts={BLOG_POSTS} />

        {/* DUAL CTA BANNER */}
        <section className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-rose-50 to-white border border-rose-200/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Per Sposi &amp; Eventi</span>
              <h3 className="text-2xl font-serif font-bold text-stone-900 mt-1 mb-2">
                Vuoi creare il sito del tuo evento in pochi minuti?
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Scopri le funzioni pubbliche e accedi gratuitamente per provare la tua bacheca evento con QR Code, RSVP e capitoli.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/funzioni-sposi">
                <Button className="rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold px-5">
                  Funzioni Sposi <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link href="/login?role=COUPLE&mode=REGISTER">
                <Button variant="outline" className="rounded-full border-stone-300">
                  Inizia Gratis
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 border border-stone-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Per Professionisti Wedding</span>
              <h3 className="text-2xl font-serif font-bold mt-1 mb-2">
                Consegne in HD e nuovi contatti a 0% commissioni
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                Entra nella directory nazionale e scopri l&apos;offerta lancio Founders Club riservata ai primi 50 studi italiani.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/funzioni-professionisti">
                <Button className="rounded-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-5">
                  Funzioni Pro <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link href="/professionisti#founders">
                <Button variant="outline" className="rounded-full bg-transparent border-stone-700 text-white hover:bg-stone-800">
                  Vedi Offerta 49 €
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
