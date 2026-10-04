"use client";
import { useState } from "react";
import { updateGuestRSVP } from "./rsvpActions";
import { parseDietary } from "@/lib/dietary";

const COMMON_ALLERGIES = [
  "Glutine", "Lattosio", "Frutta a guscio", "Arachidi",
  "Uova", "Latte e derivati", "Pesce", "Crostacei e molluschi",
  "Soia", "Sesamo"
];

export default function RSVPClient({ wedding, guest }: { wedding: any, guest: any }) {
  const dietary = parseDietary(guest.dietaryNotes);
  const [isAttending, setIsAttending] = useState<boolean | null>(guest.isAttending);
  const [allergies, setAllergies] = useState<string[]>(dietary.allergies);
  const [notes, setNotes] = useState(dietary.notes);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleAllergy = (a: string) => {
    setAllergies(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateGuestRSVP(wedding.id, guest.token, isAttending, allergies, notes);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      alert("Errore durante il salvataggio");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl max-w-lg w-full border border-stone-100 relative overflow-hidden">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif text-stone-900 mb-2">Conferma Partecipazione</h1>
        <p className="text-stone-500">Ciao <span className="font-semibold text-stone-800">{guest.name}</span>! {wedding.title || "L'evento"} si avvicina.</p>
      </div>

      <div className="space-y-8">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-3 text-center">Sarai dei nostri?</label>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setIsAttending(true)}
              className={`py-4 rounded-xl font-medium transition-all ${isAttending === true ? 'bg-rose-500 text-white shadow-lg scale-105' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
            >
              Sì, ci sarò!
            </button>
            <button 
              onClick={() => setIsAttending(false)}
              className={`py-4 rounded-xl font-medium transition-all ${isAttending === false ? 'bg-stone-800 text-white shadow-lg scale-105' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
            >
              No, purtroppo
            </button>
          </div>
        </div>

        {isAttending === true && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <label className="block text-sm font-semibold text-stone-700 mb-3">Allergie e Intolleranze</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {COMMON_ALLERGIES.map(a => (
                <button
                  key={a}
                  onClick={() => toggleAllergy(a)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors border ${allergies.includes(a) ? 'bg-rose-100 border-rose-200 text-rose-700' : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'}`}
                >
                  {a}
                </button>
              ))}
            </div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Altre esigenze (es. Vegano, Note)</label>
            <textarea 
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full border border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all outline-none"
              rows={3}
            ></textarea>
          </div>
        )}

        <button 
          onClick={handleSave}
          disabled={loading || isAttending === null}
          className="w-full bg-stone-900 text-white py-4 rounded-xl font-medium hover:bg-stone-800 disabled:opacity-50 transition-all"
        >
          {loading ? "Salvataggio..." : saved ? "Salvato con successo! ✓" : "Invia Conferma"}
        </button>
      </div>
    </div>
  );
}
