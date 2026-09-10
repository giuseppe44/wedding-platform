"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trash2, Gift, Edit, Plus, Power, PowerOff } from "lucide-react";
import { createGiftOption, updateGiftOption, deleteGiftOption, toggleGiftOption } from "@/app/giftActions";

export default function GiftManager({ chapter, giftOptions }: { chapter: any, giftOptions: any[] }) {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    id: "",
    type: "CASH_GIFT",
    title: "",
    description: "",
    iban: "",
    paypalLink: "",
    externalLink: "",
    order: "0"
  });

  const [isEditing, setIsEditing] = useState(false);

  const resetForm = () => {
    setFormData({ id: "", type: "CASH_GIFT", title: "", description: "", iban: "", paypalLink: "", externalLink: "", order: "0" });
    setIsEditing(false);
  };

  const editOption = (opt: any) => {
    setFormData({
      id: opt.id,
      type: opt.type,
      title: opt.title || "",
      description: opt.description || "",
      iban: opt.iban || "",
      paypalLink: opt.paypalLink || "",
      externalLink: opt.externalLink || "",
      order: opt.order?.toString() || "0"
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isEditing && formData.id) {
      await updateGiftOption(formData.id, formData, chapter.slug);
    } else {
      await createGiftOption(chapter.id, formData, chapter.slug);
    }
    resetForm();
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-stone-800">Lista Nozze & Regali</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Col */}
        <Card className="lg:col-span-1 border-stone-200">
          <CardHeader>
            <CardTitle>{isEditing ? "Modifica Opzione" : "Aggiungi Opzione Regalo"}</CardTitle>
            <CardDescription>Specifica come desideri ricevere i regali.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Tipologia</Label>
                <select 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="CASH_GIFT">Contributo Libero / Busta</option>
                  <option value="HONEYMOON">Viaggio di Nozze</option>
                  <option value="GIFT_REGISTRY">Lista Nozze Classica</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Titolo (Opzionale)</Label>
                <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="es. Contributo Viaggio di Nozze" />
              </div>

              <div className="space-y-2">
                <Label>Messaggio / Descrizione</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Un piccolo pensiero per il nostro viaggio..." />
              </div>

              <div className="space-y-2">
                <Label>IBAN (Nascosto pubblicamente)</Label>
                <Input value={formData.iban} onChange={(e) => setFormData({...formData, iban: e.target.value})} placeholder="IT00A0000000000000000000000" />
              </div>

              <div className="space-y-2">
                <Label>Link PayPal.Me (Opzionale)</Label>
                <Input value={formData.paypalLink} onChange={(e) => setFormData({...formData, paypalLink: e.target.value})} placeholder="https://paypal.me/tuonome" />
              </div>

              <div className="space-y-2">
                <Label>Link Esterno (Agenzia Viaggi, Lista Amazon...)</Label>
                <Input value={formData.externalLink} onChange={(e) => setFormData({...formData, externalLink: e.target.value})} placeholder="https://..." />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {isEditing ? "Salva Modifiche" : "Aggiungi"}
                </Button>
                {isEditing && (
                  <Button type="button" variant="outline" onClick={resetForm} disabled={loading}>
                    Annulla
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* List Col */}
        <div className="lg:col-span-2 space-y-4">
          {giftOptions.length === 0 ? (
            <div className="text-center p-12 bg-stone-50 border border-stone-200 dashed rounded-xl">
              <Gift className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-stone-600">Nessuna opzione regalo configurata</h3>
              <p className="text-stone-400 mt-2">Aggiungi un'opzione per permettere ai tuoi ospiti di farti un regalo comodamente.</p>
            </div>
          ) : (
            giftOptions.sort((a, b) => a.order - b.order).map(opt => (
              <Card key={opt.id} className={`border-stone-200 transition-opacity ${opt.isActive ? '' : 'opacity-60 bg-stone-50'}`}>
                <CardContent className="p-6 flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-stone-500 bg-stone-100 px-2 py-1 rounded">
                        {opt.type === 'HONEYMOON' ? 'Viaggio' : opt.type === 'GIFT_REGISTRY' ? 'Lista Nozze' : 'Contributo'}
                      </span>
                      {!opt.isActive && <span className="text-xs font-bold text-red-500 uppercase">Disattivato</span>}
                    </div>
                    <h3 className="text-xl font-serif text-stone-800">{opt.title || "Regalo"}</h3>
                    {opt.description && <p className="text-sm text-stone-600 mt-2 line-clamp-2">{opt.description}</p>}
                    
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-stone-500">
                      {opt.iban && <div><strong className="text-stone-700">IBAN:</strong> {opt.iban.substring(0, 5)}...</div>}
                      {opt.paypalLink && <div><strong className="text-stone-700">PayPal:</strong> Si</div>}
                      {opt.externalLink && <div><strong className="text-stone-700">Link Esterno:</strong> Si</div>}
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 justify-end shrink-0">
                    <Button variant="outline" size="sm" onClick={() => editOption(opt)} className="gap-2">
                      <Edit className="w-4 h-4"/> Modifica
                    </Button>
                    <form action={toggleGiftOption.bind(null, opt.id, !opt.isActive, chapter.slug)}>
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        {opt.isActive ? <PowerOff className="w-4 h-4"/> : <Power className="w-4 h-4"/>} 
                        {opt.isActive ? "Disattiva" : "Attiva"}
                      </Button>
                    </form>
                    <form action={deleteGiftOption.bind(null, opt.id, chapter.slug)}>
                      <Button variant="ghost" size="sm" className="w-full text-red-500 hover:text-red-700 hover:bg-red-50 gap-2">
                        <Trash2 className="w-4 h-4"/> Elimina
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
