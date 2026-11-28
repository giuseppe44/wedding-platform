import Link from "next/link";
import { Calculator, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomeBudgetTeaser() {
  return (
    <section className="py-10 md:py-14 bg-[#faf9f8] border-t border-stone-200/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-white border border-stone-200/90 p-6 sm:p-8 md:px-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              Strumento Gratuito
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 leading-snug">
              Hai in mente un budget?{" "}
              <span className="italic text-rose-500">Parti da lì e organizza.</span>
            </h2>
            <p className="text-stone-500 text-sm sm:text-base font-light leading-relaxed">
              Inserisci la tua idea di spesa o scopri i nostri scenari già pronti nella pagina dedicata per orientarti tra location, ristoranti e professionisti.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
            <Link href="/budget-matrimonio" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto min-h-11 h-auto py-2.5 px-6 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-sm whitespace-normal text-center leading-snug">
                <span>Simula il Budget</span>
                <ArrowRight className="w-4 h-4 ml-1.5 shrink-0" />
              </Button>
            </Link>
            <Link href="/budget-matrimonio?tab=idee" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto min-h-11 h-auto py-2.5 px-5 rounded-full border-stone-300 text-stone-800 hover:bg-stone-50 font-semibold text-sm whitespace-normal text-center leading-snug"
              >
                <Sparkles className="w-4 h-4 mr-1.5 text-amber-500 shrink-0" />
                <span>6 Idee Pronte</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
