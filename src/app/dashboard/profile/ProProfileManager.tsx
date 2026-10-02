"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { upsertProfile, createService, updateService, deleteService, uploadProMedia } from "@/app/proActions";
import Image from "next/image";
import { ExternalLink, Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export default function ProProfileManager({ initialProfile }: { initialProfile: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(initialProfile || {
    businessName: "", slug: "", category: "PHOTOGRAPHER", description: "", website: "", whatsapp: "", instagram: "", contactEmail: "", contactPhone: "", isActive: true, coverImage: "", profileImage: "", video1: "", video2: "", serviceArea: ""
  });
  
  const [galleryText, setGalleryText] = useState(initialProfile?.gallery?.join('\n') || "");

  const [serviceForm, setServiceForm] = useState({ id: "", name: "", description: "", priceIndicative: "", order: "0" });
  const [isEditingService, setIsEditingService] = useState(false);

  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Warning UI as requested by prompt
    if (!window.confirm("ATTENZIONE - DIRITTI D'AUTORE\nConfermi di possedere i diritti o le autorizzazioni per caricare e mostrare questa immagine nel tuo profilo e portfolio?")) {
      e.target.value = "";
      return;
    }
    
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const url = await uploadProMedia(formData);
      if (field === "gallery") {
        const currentGallery = galleryText.split('\n').map((u: string) => u.trim()).filter((u: string) => u !== "");
        if (currentGallery.length >= 15) {
          alert("Puoi caricare un massimo di 15 immagini nel portfolio.");
          return;
        }
        currentGallery.push(url);
        setGalleryText(currentGallery.join('\n'));
      } else {
        setProfile({...profile, [field]: url});
      }
    } catch (err: any) {
      alert(err.message || "Errore nel caricamento");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSave = {
        ...profile,
        gallery: galleryText.split('\n').map((url: string) => url.trim()).filter((url: string) => url !== "")
      };
      const updated = await upsertProfile(dataToSave);
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
      // The path is revalidated in the server action, so we just ask the router to refresh 
      // the server components without losing the client state (unsaved profile edits).
      router.refresh(); 
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
    router.refresh();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Profile Form */}
      <div className="lg:col-span-2 space-y-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Informazioni Profilo</CardTitle>
              {initialProfile?.slug && (
                <a 
                  href={`/pro/${initialProfile.slug}`} 
                  target="_blank" 
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold transition-all shadow-md bg-amber-500 hover:bg-amber-600 text-stone-950 h-10 px-6 hover:scale-105"
                >
                  <ExternalLink className="w-4 h-4 mr-2"/> Visualizza Vetrina
                </a>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome Attività</Label>
                  <Input value={profile.businessName} onChange={e => setProfile({...profile, businessName: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Logo (URL o Carica File)</Label>
  <div className="flex flex-col gap-2">
    <div className="flex gap-2">
      <Input value={profile.logoUrl || ""} onChange={e => setProfile({...profile, logoUrl: e.target.value})} placeholder="https://..." />
      <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'logoUrl')} className="max-w-[200px]" disabled={loading} />
    </div>
    {profile.logoUrl && <img src={profile.logoUrl} alt="Logo preview" className="h-16 w-16 object-contain border rounded" />}
  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Immagine / Logo (URL)</Label>
                  <Input value={profile.logoUrl || ""} onChange={e => setProfile({...profile, logoUrl: e.target.value})} placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <Label>Foto Profilo (URL o Carica File)</Label>
  <div className="flex flex-col gap-2">
    <div className="flex gap-2">
      <Input value={profile.profileImage || ""} onChange={e => setProfile({...profile, profileImage: e.target.value})} placeholder="https://..." />
      <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'profileImage')} className="max-w-[200px]" disabled={loading} />
    </div>
    {profile.profileImage && <img src={profile.profileImage} alt="Profile preview" className="h-20 w-20 object-cover border rounded-full" />}
  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Copertina (URL o Carica File)</Label>
  <div className="flex flex-col gap-2">
    <div className="flex gap-2">
      <Input value={profile.coverImage || ""} onChange={e => setProfile({...profile, coverImage: e.target.value})} placeholder="https://..." />
      <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'coverImage')} className="max-w-[200px]" disabled={loading} />
    </div>
    {profile.coverImage && <img src={profile.coverImage} alt="Cover preview" className="h-32 w-full object-cover border rounded-md" />}
  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Area / Zona di Lavoro</Label>
                  <Input value={profile.serviceArea || ""} onChange={e => setProfile({...profile, serviceArea: e.target.value})} placeholder="es. Sassari e provincia, Sardegna" />
                </div>
                <div className="space-y-2">
                  <Label>Link Video Vimeo / YouTube (1)</Label>
                  <Input value={profile.video1 || ""} onChange={e => setProfile({...profile, video1: e.target.value})} placeholder="https://youtube.com/..." />
                </div>
                <div className="space-y-2">
                  <Label>Link Video Vimeo / YouTube (2)</Label>
                  <Input value={profile.video2 || ""} onChange={e => setProfile({...profile, video2: e.target.value})} placeholder="https://vimeo.com/..." />
                </div>
              </div>
              
              <div className="space-y-2 mt-6">
                <Label>Descrizione</Label>
                <Textarea className="min-h-32" value={profile.description || ""} onChange={e => setProfile({...profile, description: e.target.value})} placeholder="Racconta la tua attività..." />
              </div>

              <div className="space-y-2">
                <Label>Portfolio Fotografico (Fino a 15 immagini)</Label>
  <p className="text-xs text-stone-500 mb-2">Incolla URL esterni (uno per riga) o usa il pulsante per caricare direttamente (saranno aggiunti in fondo).</p>
  <div className="flex flex-col gap-3">
    <Textarea className="min-h-48 whitespace-pre" value={galleryText} onChange={e => setGalleryText(e.target.value)} placeholder="https://...\nhttps://..." />
    <div className="flex items-center gap-4 border p-4 bg-stone-50 rounded-md">
      <Label className="shrink-0 font-bold">Carica Immagine:</Label>
      <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'gallery')} disabled={loading} />
      <p className="text-xs text-stone-500 shrink-0">Max 5MB. Sarà aggiunta in automatico.</p>
    </div>
    {galleryText && (
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-4">
        {galleryText.split('\n').map((u: string, i: number) => u.trim() ? (
          <div key={i} className="relative group aspect-square">
            <img src={u.trim()} alt="Gallery preview" className="w-full h-full object-cover border rounded-sm" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <span className="text-white text-xs">{i+1}</span>
            </div>
          </div>
        ) : null)}
      </div>
    )}
  </div>
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

