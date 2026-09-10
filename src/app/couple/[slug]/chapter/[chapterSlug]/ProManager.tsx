"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Plus, Trash2, Star, CheckCircle, XCircle } from "lucide-react";
import { searchProfessionals, assignProfessional, revokeAssignment, createReview } from "@/app/proAssignmentActions";
import Link from "next/link";

export default function ProManager({ chapter, assignments }: { chapter: any, assignments: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState<{proId: string, rating: number, text: string} | null>(null);

  const activeAssignments = assignments.filter(a => a.status === "ACTIVE");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    try {
      const results = await searchProfessionals(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAssign = async (proId: string) => {
    setLoading(true);
    try {
      const role = prompt("Che ruolo avrà? (es. Fotografo Ufficiale, Wedding Planner)") || "";
      await assignProfessional(chapter.id, proId, role);
      // Wait for server action to revalidate
      alert("Professionista assegnato!");
    } catch (err: any) {
      alert(err.message || "Errore");
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (assignmentId: string) => {
    if (!confirm("Sei sicuro di voler revocare l'accesso a questo professionista?")) return;
    setLoading(true);
    try {
      await revokeAssignment(assignmentId, chapter.slug);
    } catch (err: any) {
      alert(err.message || "Errore");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm) return;
    setLoading(true);
    try {
      await createReview(chapter.id, reviewForm.proId, reviewForm.rating, reviewForm.text, chapter.slug);
      alert("Recensione salvata!");
      setReviewForm(null);
    } catch (err: any) {
      alert(err.message || "Errore durante il salvataggio della recensione.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-stone-800">Team Professionisti</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Active Assignments List */}
        <Card className="border-stone-200">
          <CardHeader>
            <CardTitle>Professionisti Assegnati</CardTitle>
            <CardDescription>Il team che lavora al tuo matrimonio.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeAssignments.length === 0 ? (
              <p className="text-stone-500 italic">Nessun professionista assegnato.</p>
            ) : (
              activeAssignments.map(a => (
                <div key={a.id} className="flex justify-between items-start border-b border-stone-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex gap-4">
                    {a.professionalProfile.logoUrl ? (
                      <img src={a.professionalProfile.logoUrl} className="w-12 h-12 rounded-full object-cover" alt="logo" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center font-bold text-stone-400">
                        {a.professionalProfile.businessName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-stone-800 flex items-center gap-2">
                        {a.professionalProfile.businessName}
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </h4>
                      <p className="text-sm text-stone-500">{a.role || a.professionalProfile.category}</p>
                      <a href={`/pro/${a.professionalProfile.slug}`} target="_blank" className="text-xs text-blue-500 hover:underline">Vedi Vetrina</a>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0 items-end">
                    <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50 w-full justify-start" onClick={() => handleRevoke(a.id)} disabled={loading}>
                      <Trash2 className="w-3 h-3 mr-2" /> Revoca
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start text-yellow-600 border-yellow-200 hover:bg-yellow-50" onClick={() => setReviewForm({ proId: a.professionalProfileId, rating: 5, text: "" })}>
                      <Star className="w-3 h-3 mr-2" /> Recensisci
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div className="space-y-8">
          {/* Review Form (Conditional) */}
          {reviewForm && (
            <Card className="border-yellow-200 bg-yellow-50/30">
              <CardHeader>
                <CardTitle className="text-yellow-800 flex items-center gap-2"><Star className="w-5 h-5"/> Scrivi una recensione</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Valutazione (1-5)</Label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(r => (
                        <button key={r} type="button" onClick={() => setReviewForm({...reviewForm, rating: r})} className={`p-2 rounded-full ${reviewForm.rating >= r ? 'text-yellow-500' : 'text-stone-300'}`}>
                          <Star className="w-6 h-6 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Recensione testuale</Label>
                    <Textarea required value={reviewForm.text} onChange={e => setReviewForm({...reviewForm, text: e.target.value})} placeholder="Come ti sei trovato con questo professionista?" />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading} className="bg-yellow-600 hover:bg-yellow-700 text-white">Salva Recensione</Button>
                    <Button type="button" variant="outline" onClick={() => setReviewForm(null)}>Annulla</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Search Pros */}
          <Card className="border-stone-200">
            <CardHeader>
              <CardTitle>Aggiungi Professionista</CardTitle>
              <CardDescription>Cerca per nome attività o categoria.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Cerca professionisti..." />
                <Button type="submit" disabled={isSearching}><Search className="w-4 h-4" /></Button>
              </form>

              {searchResults.length > 0 && (
                <div className="space-y-3 mt-4">
                  <h4 className="font-semibold text-sm text-stone-500">Risultati:</h4>
                  {searchResults.map(p => {
                    const isAlreadyAssigned = activeAssignments.some(a => a.professionalProfileId === p.id);
                    return (
                      <div key={p.id} className="flex justify-between items-center p-3 border rounded-md border-stone-100 bg-stone-50">
                        <div>
                          <p className="font-medium text-stone-800">{p.businessName}</p>
                          <p className="text-xs text-stone-500">{p.category}</p>
                        </div>
                        {isAlreadyAssigned ? (
                          <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">Assegnato</span>
                        ) : (
                          <Button size="sm" onClick={() => handleAssign(p.id)} disabled={loading} className="gap-2">
                            <Plus className="w-3 h-3"/> Assegna
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
