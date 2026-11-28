"use client";

import { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  Wand2,
  CheckCircle2,
  PenLine,
  Camera,
  MapPin,
  HeartHandshake,
  Send,
  Plane,
  CakeSlice,
  Car,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { submitLead } from "@/app/actions/leadActions";

const TYPEWRITER_EXAMPLES = [
  "Cerco un ristorante o villa con giardino per 120 invitati...",
  "Cerco negozio per Lista Nozze, regali e articoli casa...",
  "Cerco fotografo stile reportage in Sardegna per Giugno 2027...",
  "Cerchiamo agenzia viaggi per Luna di Miele in Giappone o Polinesia...",
  "Vorremmo pasticceria per wedding cake e NCC auto d'epoca per gli sposi...",
];

const QUICK_SUGGESTIONS = [
  {
    label: "Ristorante o Villa",
    icon: MapPin,
    prompt: "Cerco un ristorante o villa esclusiva per ricevimento con gestione menù e allergie",
    chipClass: "border-emerald-200 bg-emerald-50/90 text-emerald-900 hover:bg-emerald-100",
  },
  {
    label: "Fotografo & Video",
    icon: Camera,
    prompt: "Cerco un fotografo stile reportage e videomaker con drone",
    chipClass: "border-rose-200 bg-rose-50/90 text-rose-900 hover:bg-rose-100",
  },
  {
    label: "Viaggio di Nozze",
    icon: Plane,
    prompt: "Cerco un'agenzia viaggi specializzata in Luna di Miele e lista viaggio",
    chipClass: "border-sky-200 bg-sky-50/90 text-sky-900 hover:bg-sky-100",
  },
  {
    label: "Liste Nozze & Regali",
    icon: Gift,
    prompt: "Cerco un negozio specializzato in Liste Nozze, regali matrimonio e articoli per la casa",
    chipClass: "border-amber-300 bg-amber-50/90 text-amber-950 hover:bg-amber-100",
  },
  {
    label: "Pasticceria & Torte",
    icon: CakeSlice,
    prompt: "Cerco una pasticceria e cake designer per torta nuziale e sweet table",
    chipClass: "border-pink-200 bg-pink-50/90 text-pink-900 hover:bg-pink-100",
  },
  {
    label: "NCC & Auto Sposi",
    icon: Car,
    prompt: "Cerco noleggio auto per matrimonio o servizio NCC con conducente per sposi e invitati",
    chipClass: "border-amber-200 bg-amber-50/90 text-amber-900 hover:bg-amber-100",
  },
  {
    label: "Planner, Fiori & Musica",
    icon: HeartHandshake,
    prompt: "Cerco Wedding Planner, fiorista e musica live / DJ per l'evento",
    chipClass: "border-violet-200 bg-violet-50/90 text-violet-900 hover:bg-violet-100",
  },
];

export type PortalSearchProps = {
  initialQuery?: string;
  presetQuery?: string;
  presetNonce?: number;
  openSegnalaNonce?: number;
};

export default function PortalSearch({
  initialQuery = "",
  presetQuery,
  presetNonce,
  openSegnalaNonce,
}: PortalSearchProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"preventivo" | "segnala" | "success">("preventivo");
  const [isLoading, setIsLoading] = useState(false);
  const [aiQuery, setAiQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [emptyHintPulse, setEmptyHintPulse] = useState(false);

  // Typewriter animation state
  const [exampleIdx, setExampleIdx] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // React to external preset query clicks (e.g. from region/category cards)
  useEffect(() => {
    if (presetNonce && presetQuery) {
      setAiQuery(presetQuery);
      wrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        inputRef.current?.focus();
      }, 350);
    }
  }, [presetNonce, presetQuery]);

  // React to external "Segnala un professionista" trigger
  useEffect(() => {
    if (openSegnalaNonce && openSegnalaNonce > 0) {
      setView("segnala");
      setIsOpen(true);
    }
  }, [openSegnalaNonce]);

  // Smooth typewriter loop when input is empty and not focused
  useEffect(() => {
    if (isFocused || aiQuery.length > 0) return;

    const currentFull = TYPEWRITER_EXAMPLES[exampleIdx % TYPEWRITER_EXAMPLES.length];

    let timeoutId: ReturnType<typeof setTimeout>;
    if (!isDeleting && typedText.length < currentFull.length) {
      timeoutId = setTimeout(() => {
        setTypedText(currentFull.slice(0, typedText.length + 1));
      }, 38);
    } else if (!isDeleting && typedText.length === currentFull.length) {
      timeoutId = setTimeout(() => {
        setIsDeleting(true);
      }, 2200);
    } else if (isDeleting && typedText.length > 0) {
      timeoutId = setTimeout(() => {
        setTypedText(currentFull.slice(0, typedText.length - 1));
      }, 18);
    } else {
      setIsDeleting(false);
      setExampleIdx((prev) => (prev + 1) % TYPEWRITER_EXAMPLES.length);
    }

    return () => clearTimeout(timeoutId);
  }, [typedText, isDeleting, exampleIdx, isFocused, aiQuery]);

  const handleAiSearch = () => {
    if (!aiQuery.trim()) {
      setEmptyHintPulse(true);
      inputRef.current?.focus();
      setTimeout(() => setEmptyHintPulse(false), 1800);
      return;
    }
    setIsOpen(true);
    setView("preventivo");
  };

  const handleQuickFill = (prompt: string) => {
    setAiQuery(prompt);
    inputRef.current?.focus();
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

    const actionData = new FormData();
    actionData.append("email", email as string);
    actionData.append("intent", view === "preventivo" ? "SPOSI_CERCA" : "SEGNALAZIONE_PRO");
    actionData.append(
      "details",
      view === "preventivo"
        ? `CERCA (AI): ${category} | DOVE: ${city} | DATA: ${date}`
        : `SEGNALA PRO: ${proName} | SETTORE: ${formData.get("proCategory")} | SITO: ${proLink || "Non inserito"}`
    );

    const result = await submitLead(actionData);

    setIsLoading(false);
    if (result.success) {
      setView("success");
    } else {
      alert("Errore durante l'invio. Riprova più tardi.");
    }
  };

  const showAnimatedOverlay = !isFocused && aiQuery.length === 0;

  return (
    <div ref={wrapperRef} className="w-full max-w-4xl mx-auto">
      {/* INTESTAZIONE EVIDENTE SOPRA LA CASELLA DI SCRITTURA */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 border border-rose-200/90 text-rose-900 text-xs sm:text-sm font-semibold shadow-xs mb-2">
          <PenLine className="w-4 h-4 text-rose-500 animate-bounce" />
          <span>Scrivi qui sotto cosa stai cercando per il tuo evento</span>
        </div>
        <p className="text-xs sm:text-sm text-stone-500 max-w-xl mx-auto">
          Descrivi con parole tue categoria, città, data o budget: ricevi gratis fino a{" "}
          <strong className="text-stone-700 font-semibold">3 proposte mirate</strong> dai professionisti della tua zona.
        </p>
      </div>

      {/* CORNICE SCURA ELEGANTE CON CAMPO BIANCO AD ALTO CONTRASTO */}
      <div
        className={`bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 p-3 sm:p-4 rounded-[1.75rem] sm:rounded-[2.25rem] shadow-[0_20px_50px_-12px_rgba(28,25,23,0.4)] border transition-all duration-300 ${
          emptyHintPulse
            ? "border-rose-400 ring-4 ring-rose-500/30"
            : "border-amber-400/40 hover:border-amber-400/70"
        }`}
      >
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* CAMPO DI TESTO BIANCO LUMINOSO CON ESEMPIO CHE SI SCRIVE DA SOLO */}
          <div
            onClick={() => inputRef.current?.focus()}
            className="flex-1 bg-white rounded-2xl px-3.5 sm:px-5 py-3.5 sm:py-4 border-2 border-amber-300/90 focus-within:border-rose-500 focus-within:ring-4 focus-within:ring-rose-500/20 shadow-inner relative flex items-center gap-3 cursor-text min-h-[58px]"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-200/80 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-rose-500" />
            </div>

            <div className="relative flex-1 min-w-0">
              <input
                ref={inputRef}
                type="text"
                value={aiQuery}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAiSearch();
                }}
                aria-label="Descrivi il professionista che stai cercando"
                placeholder={
                  isFocused
                    ? "Scrivi qui: es. Fotografo reportage a Firenze per Settembre..."
                    : ""
                }
                className="w-full bg-transparent border-none outline-none text-stone-900 placeholder-stone-400 text-sm sm:text-base md:text-lg font-medium"
              />

              {/* OVERLAY ANIMATO "ESEMPIO CHE SI SCRIVE" */}
              {showAnimatedOverlay && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none select-none absolute inset-0 flex items-center justify-between gap-2 overflow-hidden"
                >
                  <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200/80 font-bold text-[10px] sm:text-[11px] uppercase tracking-wider shrink-0">
                      Es.
                    </span>
                    <span className="text-stone-600 text-xs sm:text-base font-normal truncate">
                      {typedText}
                    </span>
                    <span className="inline-block w-[2px] h-4 sm:h-5 bg-rose-500 animate-pulse shrink-0" />
                  </div>

                  <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-semibold shrink-0">
                    Clicca e scrivi qui
                  </span>
                </div>
              )}
            </div>

            {aiQuery.length > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setAiQuery("");
                  inputRef.current?.focus();
                }}
                className="text-xs font-semibold text-stone-400 hover:text-stone-700 px-2 py-1 rounded-lg"
              >
                Cancella
              </button>
            )}
          </div>

          {/* PULSANTE AZIONE */}
          <Button
            type="button"
            onClick={handleAiSearch}
            className="w-full md:w-auto h-14 px-7 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-base sm:text-lg shadow-[0_10px_25px_-5px_rgba(244,63,94,0.55)] flex items-center justify-center gap-2 transition-all hover:scale-[1.02] border-none shrink-0"
          >
            <Wand2 className="w-5 h-5" /> Trova Match
          </Button>
        </div>

        {emptyHintPulse && (
          <p className="text-amber-300 text-xs sm:text-sm font-medium text-center mt-2.5">
            👆 Scrivi cosa cerchi nella casella bianca qui sopra oppure clicca uno degli esempi rapidi qui sotto!
          </p>
        )}
      </div>

      {/* PILLOLE DI ESEMPIO CLICCABILI CON 1 CLIC */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-1">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <span className="text-xs font-semibold text-stone-500 mr-1">
            Suggerimenti rapidi:
          </span>
          {QUICK_SUGGESTIONS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleQuickFill(item.prompt)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all shadow-2xs cursor-pointer ${item.chipClass}`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            setView("segnala");
            setIsOpen(true);
          }}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-950 underline underline-offset-4 shrink-0 cursor-pointer self-center"
        >
          <Send className="w-3.5 h-3.5 text-amber-600" />
          Segnala un professionista
        </button>
      </div>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setTimeout(() => setView("preventivo"), 300);
        }}
      >
        <DialogContent className="sm:max-w-[500px] bg-stone-950 text-white border-stone-800 rounded-3xl p-6 shadow-2xl">
          {view === "preventivo" && (
            <>
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-serif text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-rose-400" /> Analisi richiesta in corso...
                </DialogTitle>
                <DialogDescription className="text-stone-400 text-base mt-2">
                  Stiamo abbinando la tua richiesta:{" "}
                  <span className="text-amber-200 italic">&ldquo;{aiQuery}&rdquo;</span>. Inserisci
                  gli ultimi dati per ricevere{" "}
                  <strong className="text-white">fino a 3 Match gratuiti.</strong>
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2 hidden">
                  <Input name="category" value={aiQuery} readOnly />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                      Provincia o Città
                    </label>
                    <Input
                      required
                      name="city"
                      placeholder="Es. Firenze, Cagliari, Bari..."
                      className="bg-stone-900 border-stone-800 text-white placeholder-stone-600 h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                      Data Evento (opzionale)
                    </label>
                    <Input
                      type="date"
                      name="date"
                      className="bg-stone-900 border-stone-800 text-white h-12 rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    La tua Email
                  </label>
                  <Input
                    required
                    type="email"
                    name="email"
                    placeholder="tua@email.com"
                    className="bg-stone-900 border-stone-800 text-white placeholder-stone-600 h-12 rounded-xl"
                  />
                </div>

                <label className="block text-xs text-stone-400 cursor-pointer pt-1 leading-relaxed">
                  <input
                    type="checkbox"
                    required
                    className="mr-2 w-4 h-4 align-middle accent-rose-500 cursor-pointer"
                  />
                  Dichiaro di aver letto e accettato la{" "}
                  <a href="/privacy" target="_blank" className="underline text-white">
                    Privacy Policy
                  </a>{" "}
                  e i{" "}
                  <a href="/terms" target="_blank" className="underline text-white">
                    Termini e Condizioni
                  </a>{" "}
                  di GentiLuna.
                </label>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-lg font-bold mt-4 shadow-lg shadow-rose-500/20 border-none"
                >
                  {isLoading ? "Elaborazione in corso..." : "Ricevi i tuoi Match Gratuiti"}
                </Button>
              </form>

              <div className="mt-6 pt-5 border-t border-stone-800 text-center">
                <p className="text-stone-400 text-sm mb-3">
                  Conosci un vero talento che dovrebbe comparire in questa pagina?
                </p>
                <Button
                  variant="outline"
                  onClick={() => setView("segnala")}
                  className="w-full h-11 bg-transparent border-stone-700 text-stone-300 hover:bg-stone-900 hover:text-white rounded-xl"
                >
                  Segnala o Suggerisci un Professionista
                </Button>
              </div>
            </>
          )}

          {view === "segnala" && (
            <>
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-serif text-white">
                  Segnala un Talento della tua Zona
                </DialogTitle>
                <DialogDescription className="text-stone-400 text-base mt-2">
                  L&apos;ecosistema GentiLuna cresce grazie al passaparola degli sposi e dei
                  professionisti. Dicci chi merita una vetrina ufficiale qui.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Nome del Professionista o Struttura
                  </label>
                  <Input
                    required
                    name="proName"
                    placeholder="Es. Studio Luce Fotografia / Villa Aurora"
                    className="bg-stone-900 border-stone-800 text-white placeholder-stone-600 h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Link Instagram, Sito Web o Città
                  </label>
                  <Input
                    name="proLink"
                    placeholder="https://instagram.com/... oppure città"
                    className="bg-stone-900 border-stone-800 text-white placeholder-stone-600 h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Di cosa si occupa?
                  </label>
                  <Input
                    required
                    name="proCategory"
                    placeholder="Es. Fotografo, Videomaker, Location, Fiorista..."
                    className="bg-stone-900 border-stone-800 text-white placeholder-stone-600 h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    La tua Email
                  </label>
                  <Input
                    required
                    type="email"
                    name="email"
                    placeholder="tua@email.com"
                    className="bg-stone-900 border-stone-800 text-white placeholder-stone-600 h-12 rounded-xl"
                  />
                </div>

                <label className="block text-xs text-stone-400 cursor-pointer pt-1 leading-relaxed">
                  <input
                    type="checkbox"
                    required
                    className="mr-2 w-4 h-4 align-middle accent-amber-500 cursor-pointer"
                  />
                  Dichiaro di aver letto e accettato la{" "}
                  <a href="/privacy" target="_blank" className="underline text-white">
                    Privacy Policy
                  </a>{" "}
                  e i{" "}
                  <a href="/terms" target="_blank" className="underline text-white">
                    Termini e Condizioni
                  </a>{" "}
                  di GentiLuna.
                </label>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setView("preventivo")}
                    className="flex-1 h-14 text-stone-400 hover:text-white hover:bg-stone-900 rounded-xl"
                  >
                    Indietro
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-14 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 border-none"
                  >
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
              <DialogTitle className="text-3xl font-serif text-white mb-4">
                Richiesta Ricevuta!
              </DialogTitle>
              <DialogDescription className="text-stone-300 text-lg max-w-sm mx-auto">
                Grazie! Il nostro team e l&apos;assistente GentiLuna stanno elaborando i migliori
                abbinamenti e ti risponderanno via email a brevissimo.
              </DialogDescription>
              <Button
                onClick={() => setIsOpen(false)}
                className="mt-8 h-12 px-8 bg-stone-800 hover:bg-stone-700 text-white rounded-full"
              >
                Chiudi
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
