"use client";

import { useState } from "react";
import { Search, X, CheckCircle2, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { submitLead } from "@/app/actions/leadActions";

export default function PortalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"preventivo" | "segnala" | "success">("preventivo");
  const [isLoading, setIsLoading] = useState(false);
  const [aiQuery, setAiQuery] = useState("");

  const handleAiSearch = () => {
    if(!aiQuery.trim()) return;
    setIsOpen(true);
    setView("preventivo");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const category = formData.get("category") || aiQuery;
    const city = formData.get("city") || "Da specificare";
    const date = formData.get("date") || "Da specificare";
    const proName = formData.get("proName");
    const proLink = formData.get("proLink");
    
    // Preparo i formData per il Server Action
    const actionData = new FormData();
    actionData.append("email", email as string);
    actionData.append("intent", view === "preventivo" ? "SPOSI_CERCA" : "SEGNALAZIONE_PRO");
    actionData.append("details", view === "preventivo" 
      ? `CERCA (AI): ${category} | DOVE: ${city} | DATA: ${date}` 
      : `SEGNALA PRO: ${proName} | SETTORE: ${formData.get("proCategory")} | SITO: ${proLink || "Non inserito"}`
    );

    // Chiamo il Server Action
    const result = await submitLead(actionData);
    
    setIsLoading(false);
    if (result.success) {
      setView("success");
    } else {
      alert("Errore durante l'invio. Riprova più tardi.");
    }
  };

  return (
    <>
      {/* BARRA DI RICERCA INTELLIGENTE (AI MATCHMAKER) */}
      <div 
        className="bg-stone-900/80 backdrop-blur-2xl p-2 md:p-3 rounded-3xl md:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex flex-col md:flex-row items-center w-full max-w-4xl mx-auto text-left transition-all hover:bg-stone-900 duration-300 border border-stone-600/50 cursor-text focus-within:border-rose-400 focus-within:ring-4 ring-rose-500/20"
      >
        <div className="px-4 hidden md:flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-rose-400" />
        </div>
        <div className="flex-1 px-4 py-2 w-full">
          <input 
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter') handleAiSearch(); }}
            placeholder="Es. Cerco fotografo stile reportage in Toscana, budget max 2.500€..."
            className="w-full bg-transparent border-none outline-none text-white placeholder-stone-400 text-sm md:text-lg font-light"
          />
        </div>
        <div className="px-2 py-2 w-full md:w-auto mt-2 md:mt-0">
          <Button 
            className="w-full md:w-auto h-14 md:h-14 px-8 rounded-2xl md:rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-lg shadow-[0_0_20px_rgba(244,63,94,0.4)] flex items-center justify-center gap-2 transition-all hover:scale-105 border-none"
            onClick={handleAiSearch}
          >
            <Wand2 className="w-5 h-5" /> Trova Match
          </Button>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if(!open) setTimeout(() => setView("preventivo"), 300); // reset on close
      }}>
        <DialogContent className="sm:max-w-[500px] bg-stone-950 text-white border-stone-800 rounded-3xl p-6 shadow-2xl">
          
          {view === "preventivo" && (
            <>
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-serif text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-rose-400" /> Analisi AI in corso...
                </DialogTitle>
                <DialogDescription className="text-stone-400 text-base mt-2">
                  Il nostro algoritmo sta analizzando la tua richiesta. Inserisci gli ultimi dati per ricevere <strong className="text-white">i 3 Match perfetti gratuiti.</strong>
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2 hidden">
                  {/* Nascondiamo input testuale classico perché usiamo la query AI */}
                  <Input name="category" value={aiQuery} readOnly />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Provincia</label>
                    <Input required name="city" placeholder="Es. Firenze" className="bg-stone-900 border-stone-800 text-white placeholder-stone-600 h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Data (opzionale)</label>
                    <Input type="date" name="date" className="bg-stone-900 border-stone-800 text-white h-12 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">La tua Email</label>
                  <Input required type="email" name="email" placeholder="tua@email.com" className="bg-stone-900 border-stone-800 text-white placeholder-stone-600 h-12 rounded-xl" />
                </div>

                <Button type="submit" disabled={isLoading} className="w-full h-14 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-lg font-bold mt-4 shadow-lg shadow-rose-500/20 border-none">
                  {isLoading ? "Elaborazione in corso..." : "Scopri i tuoi Match"}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-stone-800 text-center">
                <p className="text-stone-400 text-sm mb-4">Conosci un vero talento che dovrebbe stare qui?</p>
                <Button variant="outline" onClick={() => setView("segnala")} className="w-full h-12 bg-transparent border-stone-700 text-stone-300 hover:bg-stone-900 hover:text-white rounded-xl">
                  Segnala o Suggerisci un Professionista
                </Button>
              </div>
            </>
          )}

          {view === "segnala" && (
            <>
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-serif text-white">Segnala un Talento</DialogTitle>
                <DialogDescription className="text-stone-400 text-base mt-2">
                  L'ecosistema ecos.com cresce grazie alle raccomandazioni. Se conosci un professionista eccezionale, dicci chi è.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Nome del Professionista o Agenzia</label>
                  <Input required name="proName" placeholder="Es. Mario Rossi Fotografia" className="bg-stone-900 border-stone-800 text-white placeholder-stone-600 h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Link Instagram o Sito Web</label>
                  <Input name="proLink" placeholder="https://instagram.com/..." className="bg-stone-900 border-stone-800 text-white placeholder-stone-600 h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Di cosa si occupa?</label>
                  <Input required name="proCategory" placeholder="Es. Fotografo, Videomaker..." className="bg-stone-900 border-stone-800 text-white placeholder-stone-600 h-12 rounded-xl" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">La tua Email</label>
                  <Input required type="email" name="email" placeholder="tua@email.com" className="bg-stone-900 border-stone-800 text-white placeholder-stone-600 h-12 rounded-xl" />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="ghost" onClick={() => setView("preventivo")} className="flex-1 h-14 text-stone-400 hover:text-white hover:bg-stone-900 rounded-xl">
                    Indietro
                  </Button>
                  <Button type="submit" disabled={isLoading} className="flex-1 h-14 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 border-none">
                    {isLoading ? "Invio in corso..." : "Invia Segnalazione"}
                  </Button>
                </div>
              </form>
            </>
          )}

          {view === "success" && (
            <div className="py-10 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <DialogTitle className="text-3xl font-serif text-white mb-4">Ricevuto!</DialogTitle>
              <DialogDescription className="text-stone-300 text-lg max-w-sm mx-auto">
                La tua richiesta è stata registrata con successo. L'intelligenza artificiale e il nostro team ti invieranno a breve i tuoi match!
              </DialogDescription>
              <Button onClick={() => setIsOpen(false)} className="mt-8 h-12 px-8 bg-stone-800 hover:bg-stone-700 text-white rounded-full">
                Chiudi
              </Button>
            </div>
          )}

        </DialogContent>
      </Dialog>
    </>
  );
}
