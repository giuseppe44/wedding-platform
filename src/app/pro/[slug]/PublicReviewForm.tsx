"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageCircle } from "lucide-react";
import { leavePublicReview } from "@/app/proActions";
import Link from "next/link";

export default function PublicReviewForm({ proId, proName }: { proId: string, proName: string }) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !brideName || !text) return;
    setLoading(true);
    setError(null);
    try {
      await leavePublicReview(proId, rating, text, { email, brideName, groomName, weddingDate });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Si è verificato un errore.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="mt-6 md:mt-0 bg-stone-800 hover:bg-stone-700 text-white rounded-full px-6 shadow-md border-2 border-stone-800 transition-all hover:scale-105 group font-medium gap-2">
          <MessageCircle className="w-4 h-4 text-stone-300 group-hover:text-white" /> Lascia una Recensione
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-stone-800">Recensisci {proName}</DialogTitle>
        </DialogHeader>
        
        {success ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 fill-current" />
            </div>
            <h3 className="text-xl font-serif text-stone-800">Grazie per la recensione!</h3>
            <p className="text-stone-500 text-sm">
              Abbiamo creato automaticamente il tuo spazio <strong>ecos.com</strong> dedicato al tuo matrimonio.
              Accedi con la tua email per scoprire tutte le funzioni e custodire i tuoi ricordi!
            </p>
            <div className="pt-4">
              <Link href="/login">
                <Button className="w-full bg-stone-800 hover:bg-stone-700">Vai al Login</Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
                {error}
                {error.includes("già registrata") && (
                  <div className="mt-2">
                    <Link href="/login"><Button variant="outline" size="sm" className="w-full text-red-700 border-red-200">Vai al Login</Button></Link>
                  </div>
                )}
              </div>
            )}
            
            <div className="p-4 bg-stone-50 rounded-lg border border-stone-100 mb-4">
              <p className="text-xs text-stone-500 mb-2 font-medium uppercase tracking-wider">La tua valutazione</p>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map(r => (
                  <button key={r} type="button" onClick={() => setRating(r)} className={`p-2 transition-transform hover:scale-110 ${rating >= r ? 'text-yellow-400' : 'text-stone-300'}`}>
                    <Star className="w-8 h-8 fill-current drop-shadow-sm" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Scrivi la tua esperienza</Label>
              <Textarea required value={text} onChange={e => setText(e.target.value)} placeholder="Come ti sei trovato? Racconta la tua esperienza..." className="min-h-[100px]" />
            </div>

            <div className="pt-4 border-t border-stone-100">
              <p className="text-sm font-medium text-stone-800 mb-4">I tuoi dati (creeremo gratis il tuo spazio sposi!)</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label>Nome Sposa/o 1</Label>
                  <Input required value={brideName} onChange={e => setBrideName(e.target.value)} placeholder="Giulia" />
                </div>
                <div className="space-y-2">
                  <Label>Nome Sposa/o 2</Label>
                  <Input value={groomName} onChange={e => setGroomName(e.target.value)} placeholder="Marco (opzionale)" />
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <Label>Data Matrimonio (già avvenuto o futuro)</Label>
                <Input type="date" value={weddingDate} onChange={e => setWeddingDate(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="la.tua@email.it" />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="submit" disabled={loading} className="w-full bg-stone-800 hover:bg-stone-700">
                {loading ? "Invio in corso..." : "Invia Recensione e Crea Spazio"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
