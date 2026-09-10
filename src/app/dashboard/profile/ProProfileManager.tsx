"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { upsertProfile, createService, updateService, deleteService } from "@/app/proActions";
import { ExternalLink, Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export default function ProProfileManager({ initialProfile }: { initialProfile: any }) {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(initialProfile || {
    businessName: "", slug: "", category: "PHOTOGRAPHER", description: "", website: "", whatsapp: "", instagram: "", contactEmail: "", contactPhone: "", isActive: true
  });

  const [serviceForm, setServiceForm] = useState({ id: "", name: "", description: "", priceIndicative: "", order: "0" });
  const [isEditingService, setIsEditingService] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await upsertProfile(profile);
      setProfile({ ...updated, services: profile.services || [] });
      alert("Profilo salvato!");
    } catch (err: any) {
      alert(err.message || "Errore nel salvataggio");
    } finally {
      setLoading(false);
    }
  };

  const resetServiceForm = () => {
    setServiceForm({ id: "", name: "", description: "", priceIndicative: "", order: "0" });
    setIsEditingService(false);
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditingService && serviceForm.id) {
        await updateService(serviceForm.id, serviceForm);
      } else {
        await createService(serviceForm);
      }
      resetServiceForm();
      // To properly refresh services without full reload, one would ideally use a router.refresh() 
      // but Server Actions auto-revalidate the page, so it will update on next server render.
      window.location.reload(); 
    } catch (err: any) {
      alert("Errore nel salvataggio del servizio");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Sei sicuro?")) return;
    setLoading(true);
    await deleteService(id);
    window.location.reload();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Profile Form */}
      <div className="lg:col-span-2 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Informazioni Profilo</CardTitle>
            {initialProfile?.slug && (
              <a href={`/pro/${initialProfile.slug}`} target="_blank" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-fit mt-2 h-9 px-3"><ExternalLink className="w-4 h-4 mr-2"/> Visualizza Vetrina</a>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome Attività</Label>
                  <Input value={profile.businessName} onChange={e => setProfile({...profile, businessName: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={profile.category}
                    onChange={e => setProfile({...profile, category: e.target.value})}
                  >
                    <option value="PHOTOGRAPHER">Fotografo</option>
                    <option value="VIDEOMAKER">Videomaker</option>
                    <option value="WEDDING_PLANNER">Wedding Planner</option>
                    <option value="DJ">DJ</option>
                    <option value="MUSICIAN">Musicista / Band</option>
                    <option value="LOCATION">Location</option>
                    <option value="CATERING">Catering / Ristorante</option>
                    <option value="FLORIST">Fiorista</option>
                    <option value="MAKEUP_ARTIST">Make-up Artist</option>
                    <option value="HAIR_STYLIST">Hair Stylist</option>
                    <option value="OTHER">Altro</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Slug Univoco (URL vetrina)</Label>
                  <div className="flex items-center">
                    <span className="text-stone-500 bg-stone-100 px-3 py-2 border border-r-0 border-input rounded-l-md text-sm">/pro/</span>
                    <Input className="rounded-l-none" value={profile.slug} onChange={e => setProfile({...profile, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})} required placeholder="es. mario-rossi-foto" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Sito Web</Label>
                  <Input value={profile.website || ""} onChange={e => setProfile({...profile, website: e.target.value})} placeholder="https://" />
                </div>
                <div className="space-y-2">
                  <Label>Email Contatto</Label>
                  <Input type="email" value={profile.contactEmail || ""} onChange={e => setProfile({...profile, contactEmail: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Telefono Contatto</Label>
                  <Input value={profile.contactPhone || ""} onChange={e => setProfile({...profile, contactPhone: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp</Label>
                  <Input value={profile.whatsapp || ""} onChange={e => setProfile({...profile, whatsapp: e.target.value})} placeholder="Es. +39..." />
                </div>
                <div className="space-y-2">
                  <Label>Instagram (Username)</Label>
                  <Input value={profile.instagram || ""} onChange={e => setProfile({...profile, instagram: e.target.value.replace('@', '')})} placeholder="tuonome" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Descrizione</Label>
                <Textarea className="min-h-32" value={profile.description || ""} onChange={e => setProfile({...profile, description: e.target.value})} placeholder="Racconta la tua attività..." />
              </div>

              <div className="space-y-2">
                <Label>Stato Vetrina</Label>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={profile.isActive} onChange={e => setProfile({...profile, isActive: e.target.checked})} className="w-4 h-4" />
                  <span className="text-sm">Vetrina Pubblica Attiva</span>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full">Salva Profilo</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Services Manager */}
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{isEditingService ? "Modifica Servizio" : "Nuovo Servizio"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleServiceSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome Servizio</Label>
                <Input value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Prezzo Indicativo (Opzionale)</Label>
                <Input value={serviceForm.priceIndicative || ""} onChange={e => setServiceForm({...serviceForm, priceIndicative: e.target.value})} placeholder="es. A partire da 500€" />
              </div>
              <div className="space-y-2">
                <Label>Descrizione</Label>
                <Textarea value={serviceForm.description || ""} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading || !initialProfile} className="flex-1">
                  {isEditingService ? "Aggiorna" : "Aggiungi"}
                </Button>
                {isEditingService && (
                  <Button type="button" variant="outline" onClick={resetServiceForm}>Annulla</Button>
                )}
              </div>
              {!initialProfile && <p className="text-xs text-red-500 mt-2">Devi prima salvare il profilo per aggiungere servizi.</p>}
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="font-semibold text-stone-800">I Tuoi Servizi</h3>
          {initialProfile?.services?.sort((a: any, b: any) => a.order - b.order).map((s: any) => (
            <Card key={s.id} className="shadow-sm">
              <CardContent className="p-4 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-stone-800">{s.name}</h4>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setServiceForm({ id: s.id, name: s.name, description: s.description || "", priceIndicative: s.priceIndicative || "", order: s.order.toString() }); setIsEditingService(true); }}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => handleDeleteService(s.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                {s.priceIndicative && <p className="text-xs font-semibold text-stone-500">{s.priceIndicative}</p>}
                {s.description && <p className="text-sm text-stone-600 line-clamp-2">{s.description}</p>}
              </CardContent>
            </Card>
          ))}
          {(!initialProfile?.services || initialProfile.services.length === 0) && (
             <p className="text-sm text-stone-400 italic">Nessun servizio configurato.</p>
          )}
        </div>
      </div>
    </div>
  );
}
