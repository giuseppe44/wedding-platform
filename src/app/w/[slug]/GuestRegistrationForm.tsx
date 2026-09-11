"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Bell, CheckCircle2 } from "lucide-react";

export default function GuestRegistrationForm({ buttonColor }: { buttonColor: string }) {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Collegare al database
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 1000);
  };

  if (success) {
    return (
      <div className="bg-white border border-stone-100 shadow-sm rounded-3xl p-8 text-center max-w-xl mx-auto mb-16">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h3 className="font-serif text-2xl text-stone-800 mb-2">Registrazione completata!</h3>
        <p className="text-stone-500">
          Grazie! Ti avviseremo non appena ci saranno novita da parte degli sposi.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-stone-100 shadow-xl rounded-3xl p-8 md:p-12 max-w-2xl mx-auto relative overflow-hidden mb-16 mt-8">
      <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: buttonColor }} />
      
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-stone-50 mb-4">
          <Bell className="w-6 h-6 text-stone-600" />
        </div>
        <h3 className="font-serif text-2xl md:text-3xl text-stone-800 mb-2">Rimani connesso all'evento</h3>
        <p className="text-stone-500 text-sm md:text-base">
          Lascia i tuoi recapiti per ricevere una notifica quando gli sposi apriranno il Guestbook delle dediche e per accedere all'album fotografico completo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        <div className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome e Cognome *</Label>
            <Input id="nome" required placeholder="Mario Rossi" className="mt-1 bg-stone-50" />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" required placeholder="mario@example.com" className="mt-1 bg-stone-50" />
          </div>
          <div>
            <Label htmlFor="telefono">Cellulare (Opzionale)</Label>
            <Input id="telefono" type="tel" placeholder="+39 333 1234567" className="mt-1 bg-stone-50" />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-stone-100">
          <div className="flex items-start gap-3">
            <Checkbox id="privacy" required className="mt-1" />
            <Label htmlFor="privacy" className="text-xs text-stone-500 leading-snug font-normal cursor-pointer">
              * Ho letto l'Informativa sulla Privacy e accetto il trattamento dei miei dati personali per le finalita legate all'evento.
            </Label>
          </div>
          <div className="flex items-start gap-3">
            <Checkbox id="marketing" className="mt-1" />
            <Label htmlFor="marketing" className="text-xs text-stone-500 leading-snug font-normal cursor-pointer">
              Acconsento a ricevere comunicazioni, offerte esclusive e novita dai professionisti ufficiali di questo evento. (Opzionale)
            </Label>
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full text-white py-6 text-lg rounded-full shadow-md hover:scale-[1.02] transition-transform font-bold" style={{ backgroundColor: buttonColor }}>
          {loading ? "Registrazione in corso..." : "Avvisami sulle novita"}
        </Button>
      </form>
    </div>
  );
}
