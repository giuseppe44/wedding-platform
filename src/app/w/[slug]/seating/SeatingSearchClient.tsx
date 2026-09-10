"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search } from "lucide-react";
import { searchGuestSeating } from "@/app/seatingActions";

export default function SeatingSearchClient({ timelineItemId }: { timelineItemId: string }) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !surname.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await searchGuestSeating(timelineItemId, name, surname);
      if (data) {
        setResult(data);
      } else {
        setError("Nessun tavolo assegnato trovato per questo nome. Verifica di aver inserito correttamente nome e cognome o contatta gli sposi.");
      }
    } catch (err) {
      setError("Si è verificato un errore durante la ricerca.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Input 
                placeholder="Il tuo Nome" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Input 
                placeholder="Il tuo Cognome" 
                value={surname} 
                onChange={(e) => setSurname(e.target.value)} 
                required 
              />
            </div>
            <Button type="submit" className="w-full gap-2" disabled={loading}>
              <Search className="w-4 h-4" /> {loading ? "Ricerca in corso..." : "Cerca Tavolo"}
            </Button>
            {error && <p className="text-sm text-red-600 text-center mt-2">{error}</p>}
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-stone-200 shadow-md bg-white animate-in fade-in slide-in-from-bottom-4">
          <CardHeader className="text-center pb-2">
            <CardDescription className="uppercase tracking-widest text-stone-500 font-bold">Il tuo tavolo</CardDescription>
            <CardTitle className="text-4xl font-serif text-stone-800 py-4">{result.table}</CardTitle>
            <p className="text-stone-500 text-sm">{result.tableType === "ROUND" ? "Tavolo Rotondo" : "Tavolo Rettangolare"}</p>
          </CardHeader>
          <CardContent className="bg-stone-50 m-4 rounded-xl p-6">
            <h4 className="font-medium text-stone-800 mb-4 text-center">Al tuo tavolo:</h4>
            <ul className="grid grid-cols-2 gap-2 text-center text-stone-600 text-sm">
              {result.tablemates.map((mate: string, i: number) => (
                <li key={i}>{mate}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
