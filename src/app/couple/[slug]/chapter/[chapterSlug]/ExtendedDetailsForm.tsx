"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateExtendedDetails } from "@/app/coupleActions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function ExtendedDetailsForm({ chapter, locations }: { chapter: any, locations: any[] }) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const getLoc = (type: string) => locations.find(l => l.type === type) || { type, name: "", address: "", city: "", notes: "", coordinates: "" };

  const [formData, setFormData] = useState({
    startTime: chapter.startTime || "",
    endTime: chapter.endTime || "",
    dressCode: chapter.dressCode || "",
    usefulInfo: chapter.usefulInfo || "",
    ceremonyType: chapter.ceremonyType || "CIVIL",
    professionalsJson: chapter.professionalsJson || "",
    bridePrep: getLoc("BRIDE_PREP"),
    groomPrep: getLoc("GROOM_PREP"),
    ceremony: getLoc("CEREMONY"),
    reception: getLoc("RECEPTION")
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleLocChange = (locType: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [locType]: { ...prev[locType as keyof typeof prev] as any, [field]: value }
    }));
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const dataToSave = {
      startTime: formData.startTime,
      endTime: formData.endTime,
      dressCode: formData.dressCode,
      usefulInfo: formData.usefulInfo,
      ceremonyType: formData.ceremonyType,
      professionalsJson: formData.professionalsJson,
      locations: [
        formData.bridePrep,
        formData.groomPrep,
        formData.ceremony,
        formData.reception
      ]
    };

    try {
      await updateExtendedDetails(chapter.id, dataToSave, chapter.slug);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderLocationFields = (label: string, locType: string) => {
    const loc = formData[locType as keyof typeof formData] as any;
    return (
      <div className="space-y-4 border p-4 rounded-xl bg-stone-50">
        <h3 className="font-semibold text-stone-800">{label}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nome Luogo</Label>
            <Input value={loc.name} onChange={(e) => handleLocChange(locType, "name", e.target.value)} placeholder="es. Villa Rosa" />
          </div>
          <div className="space-y-2">
            <Label>Città</Label>
            <Input value={loc.city} onChange={(e) => handleLocChange(locType, "city", e.target.value)} placeholder="es. Roma" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Indirizzo Completo</Label>
            <Input value={loc.address} onChange={(e) => handleLocChange(locType, "address", e.target.value)} placeholder="Via Roma 1" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Coordinate (Lat, Lng) - Opzionale per OpenStreetMap</Label>
            <Input value={loc.coordinates || ""} onChange={(e) => handleLocChange(locType, "coordinates", e.target.value)} placeholder="41.9028, 12.4964" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Note / Dettagli</Label>
            <Textarea value={loc.notes || ""} onChange={(e) => handleLocChange(locType, "notes", e.target.value)} placeholder="es. Parcheggio sul retro" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Informazioni Generali</CardTitle>
          <CardDescription>Dettagli sugli orari e sullo stile dell'evento.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 mt-4">
            <Label>Tipo di Cerimonia</Label>
            <select 
              name="ceremonyType" 
              value={formData.ceremonyType} 
              onChange={handleChange}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="CIVIL">Civile / Simbolica</option>
              <option value="RELIGIOUS">Religiosa</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Orario Inizio</Label>
            <Input type="time" name="startTime" value={formData.startTime} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Orario Fine Festa (Opzionale)</Label>
            <Input type="time" name="endTime" value={formData.endTime} onChange={handleChange} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Dress Code</Label>
            <Input name="dressCode" value={formData.dressCode} onChange={handleChange} placeholder="es. Elegante, Casual, Tema anni '20..." />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Informazioni Utili (Testo Libero)</Label>
            <Textarea name="usefulInfo" value={formData.usefulInfo} onChange={handleChange} placeholder="es. Informazioni su navette, parcheggi, regali..." className="min-h-32" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Professionisti (Mostrati in fondo alla pagina pubblica)</Label>
            <Textarea name="professionalsJson" value={formData.professionalsJson} onChange={handleChange} placeholder="es. Catering: Rossi, Fioraio: Verdi..." className="min-h-32" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Luoghi dell'Evento</CardTitle>
          <CardDescription>Inserisci i dettagli delle location per visualizzare le mappe agli invitati.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderLocationFields("Cerimonia", "ceremony")}
          {renderLocationFields("Ricevimento", "reception")}
          {renderLocationFields("Preparazione Sposa", "bridePrep")}
          {renderLocationFields("Preparazione Sposo", "groomPrep")}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        {saved && <span className="text-green-600 font-medium self-center">Salvato con successo!</span>}
        <Button type="submit" disabled={loading}>{loading ? "Salvataggio..." : "Salva Dettagli"}</Button>
      </div>
    </form>
  );
}
