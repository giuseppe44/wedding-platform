"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageCircle, ShieldCheck } from "lucide-react";
import { leavePublicReview } from "@/app/proActions";
import Link from "next/link";

export default function PublicReviewForm({
  proId,
  proName,
}: {
  proId: string;
  proName: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { minDateStr, maxDateStr } = useMemo(() => {
    const now = new Date();
    const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
    const fmt = (d: Date) => d.toISOString().split("T")[0];
    return {
      minDateStr: fmt(twoYearsAgo),
      maxDateStr: fmt(now),
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !brideName || !text || !weddingDate) return;
    setLoading(true);
    setError(null);
    try {
      await leavePublicReview(proId, rating, text, {
        email,
        brideName,
        groomName,
        weddingDate,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Si è verificato un errore.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="mt-6 md:mt-0 inline-flex items-center justify-center bg-stone-800 hover:bg-stone-700 text-white rounded-full px-6 py-2.5 h-10 text-sm shadow-md border-2 border-stone-800 transition-all hover:scale-105 group font-medium gap-2 cursor-pointer">
        <MessageCircle className="w-4 h-4 text-stone-300 group-hover:text-white" /> Lascia una Recensione Verificata
      </DialogTrigger>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-stone-800">
            Recensisci {proName}
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 fill-current" />
            </div>
            <h3 className="text-xl font-serif text-stone-800">Grazie per la tua recensione!</h3>
            <p className="text-stone-500 text-sm">
              La tua esperienza verificata è stata pubblicata. Se non avevi ancora uno spazio su{" "}
              <strong>GentiLuna</strong>, è stato preparato automaticamente per custodire i ricordi del tuo evento!
            </p>
            <div className="pt-4">
              <Link href="/login">
                <Button className="w-full bg-stone-800 hover:bg-stone-700">Vai al Login</Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-[11px] text-emerald-950 flex items-start gap-2 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Tutela Anti-Falsificazione GentiLuna:</strong> sono ammesse esclusivamente recensioni di eventi reali celebrati negli <strong>ultimi 2 anni</strong> (massimo 1 recensione per indirizzo email, mai mostrata in chiaro).
              </span>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
                {error}
                {(error.includes("già registrato") || error.includes("Login")) && (
                  <div className="mt-2">
                    <Link href="/login">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-red-700 border-red-200"
                      >
                        Vai al Login
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-100">
              <p className="text-xs text-stone-500 mb-2 font-medium uppercase tracking-wider text-center">
                La tua valutazione
              </p>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRating(r)}
                    className={`p-1.5 transition-transform hover:scale-110 ${
                      rating >= r ? "text-yellow-400" : "text-stone-300"
                    }`}
                  >
                    <Star className="w-8 h-8 fill-current drop-shadow-sm" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Racconta la tua esperienza (min. 25 caratteri)</Label>
              <Textarea
                required
                minLength={25}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Come ti sei trovato per il tuo matrimonio o evento? Racconta i dettagli reali..."
                className="min-h-[95px]"
              />
            </div>

            <div className="pt-3 border-t border-stone-100 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Nome Sposa/o 1</Label>
                  <Input
                    required
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    placeholder="Es. Giulia"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Nome Sposa/o 2</Label>
                  <Input
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    placeholder="Es. Marco"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Data Reale dell&apos;Evento (ultimi 24 mesi)</Label>
                <Input
                  type="date"
                  required
                  min={minDateStr}
                  max={maxDateStr}
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label>La tua Email (privata, 1 sola recensione consentita)</Label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="la.tua@email.it"
                />
              </div>

              <label className="flex items-start gap-2.5 pt-2 text-xs text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 w-4 h-4 accent-stone-900 shrink-0 cursor-pointer"
                />
                <span className="leading-relaxed">
                  Dichiaro sotto la mia responsabilità che la recensione si riferisce a un evento reale degli ultimi 2 anni e accetto i{" "}
                  <Link href="/terms" target="_blank" className="underline font-semibold text-stone-900">
                    Termini e Condizioni
                  </Link>{" "}
                  e la{" "}
                  <Link href="/privacy" target="_blank" className="underline font-semibold text-stone-900">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-stone-800 hover:bg-stone-700"
              >
                {loading ? "Verifica e invio..." : "Pubblica Recensione Verificata"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
