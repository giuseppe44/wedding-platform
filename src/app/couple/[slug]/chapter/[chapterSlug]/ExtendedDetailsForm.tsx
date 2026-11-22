"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateExtendedDetails } from "@/app/coupleActions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { DRESS_CODE_PALETTE, parseDressCode, stringifyDressCode } from "@/lib/dressCode";
import { Check } from "lucide-react";

const LOCATION_HELPERS: Record<
  string,
  {
    namePlaceholder: string;
    notesPlaceholder: string;
    helperText: string;
  }
> = {
  ceremony: {
    namePlaceholder: "Es. Chiesa di San Biagio / Palazzo Comunale",
    notesPlaceholder: "Es. La cerimonia sarà celebrata qui alle ore 11:00; parcheggio disponibile davanti al sagrato.",
    helperText: "Specifica se qui viene celebrato il rito religioso o civile.",
  },
  reception: {
    namePlaceholder: "Es. Villa Loreto Ristorante / Tenuta...",
    notesPlaceholder: "Es. Qui ci sposteremo per festeggiare, cenare e ballare dopo la cerimonia.",
    helperText: "Indica dove si terranno il banchetto, il taglio torta e la festa.",
  },
  bridePrep: {
    namePlaceholder: "Es. Casa della Sposa (o casa dei genitori di...)",
    notesPlaceholder: "Es. Qui si prepara la sposa prima della cerimonia.",
    helperText: "Così amici e fotografi sanno esattamente di chi è l'abitazione.",
  },
  groomPrep: {
    namePlaceholder: "Es. Casa dello Sposo (o casa dei genitori di...)",
    notesPlaceholder: "Es. Qui si prepara lo sposo con i testimoni prima di andare in chiesa.",
    helperText: "Così amici e fotografi sanno esattamente di chi è l'abitazione.",
  },
};

export default function ExtendedDetailsForm({ chapter, locations }: { chapter: any; locations: any[] }) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const initialDress = parseDressCode(chapter.dressCode);

  const getLoc = (type: string) =>
    locations.find((l) => l.type === type) || {
      type,
      name: "",
      address: "",
      city: "",
      notes: "",
      coordinates: "",
    };

  const [formData, setFormData] = useState({
    startTime: chapter.startTime || "",
    endTime: chapter.endTime || "",
    dressCodeText: initialDress.text,
    dressCodeColors: initialDress.colors.map((c) => c.id),
    usefulInfo: chapter.usefulInfo || "",
    ceremonyType: chapter.ceremonyType || "CIVIL",
    professionalsJson: chapter.professionalsJson || "",
    showGuestbook: chapter.showGuestbook ?? true,
    showSeating: chapter.showSeating ?? false,
    showGifts: chapter.showGifts ?? true,
    bridePrep: getLoc("BRIDE_PREP"),
    groomPrep: getLoc("GROOM_PREP"),
    ceremony: getLoc("CEREMONY"),
    reception: getLoc("RECEPTION"),
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const togglePaletteColor = (colorId: string) => {
    setFormData((prev) => {
      const exists = prev.dressCodeColors.includes(colorId);
      const next = exists
        ? prev.dressCodeColors.filter((id) => id !== colorId)
        : [...prev.dressCodeColors, colorId];
      return { ...prev, dressCodeColors: next };
    });
    setSaved(false);
  };

  const handleLocChange = (locType: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [locType]: { ...(prev[locType as keyof typeof prev] as any), [field]: value },
    }));
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dataToSave = {
      startTime: formData.startTime,
      endTime: formData.endTime,
      dressCode: stringifyDressCode(formData.dressCodeText, formData.dressCodeColors),
      usefulInfo: formData.usefulInfo,
      ceremonyType: formData.ceremonyType,
      professionalsJson: formData.professionalsJson,
      showGuestbook: formData.showGuestbook,
      showSeating: formData.showSeating,
      showGifts: formData.showGifts,
      locations: [formData.bridePrep, formData.groomPrep, formData.ceremony, formData.reception],
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
    const hints = LOCATION_HELPERS[locType] || LOCATION_HELPERS.ceremony;
    return (
      <div className="space-y-4 border p-4 rounded-xl bg-stone-50">
        <div>
          <h3 className="font-semibold text-stone-800">{label}</h3>
          <p className="text-xs text-stone-500 mt-0.5">{hints.helperText}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nome Luogo</Label>
            <Input
              value={loc.name}
              onChange={(e) => handleLocChange(locType, "name", e.target.value)}
              placeholder={hints.namePlaceholder}
            />
          </div>
          <div className="space-y-2">
            <Label>Città</Label>
            <Input
              value={loc.city}
              onChange={(e) => handleLocChange(locType, "city", e.target.value)}
              placeholder="es. Alghero (SS)"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Indirizzo Completo</Label>
            <Input
              value={loc.address}
              onChange={(e) => handleLocChange(locType, "address", e.target.value)}
              placeholder="Via Roma 1"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Coordinate (Lat, Lng) - Opzionale per OpenStreetMap</Label>
            <Input
              value={loc.coordinates || ""}
              onChange={(e) => handleLocChange(locType, "coordinates", e.target.value)}
              placeholder="41.9028, 12.4964"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Note / Cosa succede qui (visibile agli ospiti)</Label>
            <Textarea
              value={loc.notes || ""}
              onChange={(e) => handleLocChange(locType, "notes", e.target.value)}
              placeholder={hints.notesPlaceholder}
            />
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
          <CardDescription>Dettagli sugli orari e sullo stile dell&apos;evento.</CardDescription>
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

          <div className="space-y-3 md:col-span-2 pt-2">
            <div>
              <Label>Dress Code</Label>
              <Input
                name="dressCodeText"
                value={formData.dressCodeText}
                onChange={handleChange}
                placeholder="es. Elegante / Cerimonia / Tema anni '20..."
                className="mt-1.5"
              />
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Palette Colori Consigliata (Opzionale)
                </Label>
                {formData.dressCodeColors.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((p) => ({ ...p, dressCodeColors: [] }));
                      setSaved(false);
                    }}
                    className="text-xs text-rose-600 hover:underline cursor-pointer"
                  >
                    Nessun colore
                  </button>
                )}
              </div>
              <p className="text-xs text-stone-500">
                Seleziona 1, 2 o più colori se vuoi mostrare una palette sul sito pubblico. Se non selezioni nulla, sul sito non apparirà nessun pallino colorato.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {DRESS_CODE_PALETTE.map((c) => {
                  const selected = formData.dressCodeColors.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => togglePaletteColor(c.id)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                        selected
                          ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                          : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-stone-300 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.label}</span>
                      {selected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Informazioni Utili (Testo Libero)</Label>
            <Textarea
              name="usefulInfo"
              value={formData.usefulInfo}
              onChange={handleChange}
              placeholder="es. Informazioni su navette, parcheggi, regali..."
              className="min-h-32"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Professionisti (Mostrati in fondo alla pagina pubblica)</Label>
            <Textarea
              name="professionalsJson"
              value={formData.professionalsJson}
              onChange={handleChange}
              placeholder="es. Catering: Rossi, Fioraio: Verdi..."
              className="min-h-32"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Luoghi dell&apos;Evento</CardTitle>
          <CardDescription>
            Inserisci i dettagli delle location e aggiungi una nota breve per chiarire agli invitati dove si celebra e dove si festeggia.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderLocationFields("Cerimonia (Chiesa o Luogo del Rito)", "ceremony")}
          {renderLocationFields("Ricevimento (Villa o Ristorante dove si festeggia)", "reception")}
          {renderLocationFields("Preparazione Sposa (Casa della Sposa)", "bridePrep")}
          {renderLocationFields("Preparazione Sposo (Casa dello Sposo)", "groomPrep")}
        </CardContent>
      </Card>

      <Card className="border-rose-100 bg-rose-50/20">
        <CardHeader>
          <CardTitle>Visibilità Sezioni Vetrina Pubblica</CardTitle>
          <CardDescription>Scegli cosa mostrare agli ospiti nella tua vetrina pubblica.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 bg-white p-3 rounded border border-stone-200">
            <input
              type="checkbox"
              id="showGuestbook"
              name="showGuestbook"
              className="w-5 h-5 accent-rose-500"
              checked={formData.showGuestbook}
              onChange={(e) => {
                setFormData({ ...formData, showGuestbook: e.target.checked });
                setSaved(false);
              }}
            />
            <div className="flex flex-col">
              <Label htmlFor="showGuestbook" className="font-bold text-stone-800 cursor-pointer">
                Mostra Dediche (Guestbook)
              </Label>
              <span className="text-xs text-stone-500">Permetti agli ospiti di leggere e lasciare messaggi.</span>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white p-3 rounded border border-stone-200">
            <input
              type="checkbox"
              id="showSeating"
              name="showSeating"
              className="w-5 h-5 accent-rose-500"
              checked={formData.showSeating}
              onChange={(e) => {
                setFormData({ ...formData, showSeating: e.target.checked });
                setSaved(false);
              }}
            />
            <div className="flex flex-col">
              <Label htmlFor="showSeating" className="font-bold text-stone-800 cursor-pointer">
                Mostra Disposizione Tavoli
              </Label>
              <span className="text-xs text-stone-500">
                Gli ospiti potranno cercare il loro tavolo direttamente dalla home.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white p-3 rounded border border-stone-200">
            <input
              type="checkbox"
              id="showGifts"
              name="showGifts"
              className="w-5 h-5 accent-rose-500"
              checked={formData.showGifts}
              onChange={(e) => {
                setFormData({ ...formData, showGifts: e.target.checked });
                setSaved(false);
              }}
            />
            <div className="flex flex-col">
              <Label htmlFor="showGifts" className="font-bold text-stone-800 cursor-pointer">
                Mostra Lista Nozze / Regali
              </Label>
              <span className="text-xs text-stone-500">Mostra l&apos;IBAN e le coordinate per i regali.</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4 mt-6">
        {saved && <span className="text-green-600 font-medium self-center">Salvato con successo!</span>}
        <Button type="submit" size="lg" className="bg-stone-800 hover:bg-stone-700 font-bold px-8" disabled={loading}>
          {loading ? "Salvataggio..." : "Salva Tutto"}
        </Button>
      </div>
    </form>
  );
}
