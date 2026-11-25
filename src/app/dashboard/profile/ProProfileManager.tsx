"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  upsertProfile,
  createService,
  updateService,
  deleteService,
  createSecondShowcase,
  saveUploadedProMediaField,
} from "@/app/proActions";
import { uploadProImageClient } from "@/lib/clientImageOptimizer";
import { PRO_CATEGORY_GROUPS, getProCategoryLabel } from "@/lib/proCategories";
import { ITALIAN_PROVINCES, getProvinceMeta } from "@/lib/provinceQuota";
import {
  ExternalLink,
  Plus,
  Edit,
  Trash2,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2,
  ShieldCheck,
  Sparkles,
  X,
  ArrowLeft,
  ArrowRight,
  Layers,
} from "lucide-react";

function resolvePreviewImg(raw?: string | null): string {
  if (!raw) return "";
  if (raw.startsWith("uploads/pro-") || raw.includes("/object/public/wedding-media/uploads/pro-")) {
    return `/api/media/pro?path=${encodeURIComponent(raw)}`;
  }
  return raw;
}

export default function ProProfileManager({
  initialProfiles,
  initialProfile,
}: {
  initialProfiles?: any[];
  initialProfile?: any;
}) {
  const router = useRouter();
  const normalizedList =
    initialProfiles && initialProfiles.length > 0
      ? initialProfiles
      : initialProfile
      ? [initialProfile]
      : [];

  const [showcases, setShowcases] = useState<any[]>(normalizedList);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const currentInitial = showcases[activeIndex] || {
    id: "",
    businessName: "",
    slug: "",
    category: "PHOTOGRAPHER",
    description: "",
    website: "",
    whatsapp: "",
    instagram: "",
    contactEmail: "",
    contactPhone: "",
    isActive: true,
    logoUrl: "",
    coverImage: "",
    profileImage: "",
    video1: "",
    video2: "",
    serviceArea: "",
    province: "",
    vatNumber: "",
    partnerCode: "",
    gallery: [],
    services: [],
  };

  const [profile, setProfile] = useState<any>(currentInitial);
  const [galleryUrls, setGalleryUrls] = useState<string[]>(
    Array.isArray(currentInitial.gallery)
      ? currentInitial.gallery.filter((u: string) => Boolean(u && u.trim()))
      : []
  );

  const [loading, setLoading] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );
  const [acceptedMediaRights, setAcceptedMediaRights] = useState(true);

  // Creazione 2ª Vetrina modal/inline
  const [showCreateSecond, setShowCreateSecond] = useState(false);
  const [secondForm, setSecondForm] = useState({
    businessName: "",
    category: "VIDEOMAKER",
    province: currentInitial.province || "",
    vatNumber: currentInitial.vatNumber || "",
  });

  const [serviceForm, setServiceForm] = useState({
    id: "",
    name: "",
    description: "",
    priceIndicative: "",
    order: "0",
  });
  const [isEditingService, setIsEditingService] = useState(false);

  const switchShowcase = (idx: number) => {
    const target = showcases[idx];
    if (!target) return;
    setActiveIndex(idx);
    setProfile(target);
    setGalleryUrls(
      Array.isArray(target.gallery)
        ? target.gallery.filter((u: string) => Boolean(u && u.trim()))
        : []
    );
    setFeedback(null);
    setShowCreateSecond(false);
    resetServiceForm();
  };

  const handleSingleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logoUrl" | "profileImage" | "coverImage"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!acceptedMediaRights) {
      setFeedback({
        type: "error",
        text: "Conferma la casella dei diritti d'autore sulle immagini prima di caricare.",
      });
      e.target.value = "";
      return;
    }

    setUploadingField(field);
    setUploadProgress(`Ottimizzazione HD e caricamento (${file.name})...`);
    setFeedback(null);

    const res = await uploadProImageClient(file, {
      isLogo: field === "logoUrl",
      profileId: profile.id || undefined,
    });

    e.target.value = "";

    if (!res.success || !res.url) {
      setUploadingField(null);
      setUploadProgress("");
      setFeedback({
        type: "error",
        text: res.error || "Errore durante il caricamento dell'immagine.",
      });
      return;
    }

    const updatedProfile = { ...profile, [field]: res.url };
    setProfile(updatedProfile);
    setShowcases((prev) => prev.map((s, idx) => (idx === activeIndex ? updatedProfile : s)));

    // Auto-salvataggio immediato nel DB se la vetrina esiste già
    if (profile.id) {
      try {
        await saveUploadedProMediaField({
          profileId: profile.id,
          field,
          value: res.url,
        });
      } catch {}
    }

    setUploadingField(null);
    setUploadProgress("");
    setFeedback({
      type: "success",
      text: "Immagine caricata e salvata automaticamente sulla vetrina!",
    });
  };

  const handleMultiGalleryUpload = async (filesList: FileList | File[]) => {
    const files = Array.from(filesList);
    if (files.length === 0) return;

    if (!acceptedMediaRights) {
      setFeedback({
        type: "error",
        text: "Conferma la casella dei diritti d'autore sotto il portfolio prima di caricare.",
      });
      return;
    }

    const availableSlots = 15 - galleryUrls.length;
    if (availableSlots <= 0) {
      setFeedback({
        type: "error",
        text: "Hai già raggiunto il massimo di 15 foto nel portfolio. Rimuovine una per sostituirla.",
      });
      return;
    }

    const batch = files.slice(0, availableSlots);
    setUploadingField("gallery");
    setFeedback(null);

    const nextGallery = [...galleryUrls];
    const errors: string[] = [];
    let added = 0;

    for (let i = 0; i < batch.length; i++) {
      const f = batch[i];
      setUploadProgress(`Ottimizzazione Ultra-HD e upload foto ${i + 1} di ${batch.length}...`);
      const res = await uploadProImageClient(f, {
        isLogo: false,
        profileId: profile.id || undefined,
      });
      if (res.success && res.url) {
        nextGallery.push(res.url);
        added++;
        setGalleryUrls([...nextGallery]);
      } else {
        errors.push(`${f.name}: ${res.error || "errore"}`);
      }
    }

    const updatedProfile = { ...profile, gallery: nextGallery };
    setProfile(updatedProfile);
    setShowcases((prev) => prev.map((s, idx) => (idx === activeIndex ? updatedProfile : s)));

    if (added > 0 && profile.id) {
      try {
        await saveUploadedProMediaField({
          profileId: profile.id,
          field: "gallery",
          value: nextGallery,
        });
      } catch {}
    }

    setUploadingField(null);
    setUploadProgress("");

    if (errors.length === 0) {
      setFeedback({
        type: "success",
        text: `${added} ${added === 1 ? "foto caricata" : "foto caricate"} e salvate automaticamente nel portfolio!`,
      });
    } else {
      setFeedback({
        type: "error",
        text:
          added > 0
            ? `Caricate ${added} foto. Errore su ${errors.length} file (${errors[0]}).`
            : `Errore durante il caricamento: ${errors[0]}`,
      });
    }
  };

  const removeGalleryPhoto = async (indexToRemove: number) => {
    const nextGallery = galleryUrls.filter((_, idx) => idx !== indexToRemove);
    setGalleryUrls(nextGallery);
    const updatedProfile = { ...profile, gallery: nextGallery };
    setProfile(updatedProfile);
    setShowcases((prev) => prev.map((s, idx) => (idx === activeIndex ? updatedProfile : s)));

    if (profile.id) {
      try {
        await saveUploadedProMediaField({
          profileId: profile.id,
          field: "gallery",
          value: nextGallery,
        });
      } catch {}
    }
  };

  const moveGalleryPhoto = async (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= galleryUrls.length) return;
    const nextGallery = [...galleryUrls];
    const [moved] = nextGallery.splice(index, 1);
    nextGallery.splice(targetIdx, 0, moved);
    setGalleryUrls(nextGallery);
    const updatedProfile = { ...profile, gallery: nextGallery };
    setProfile(updatedProfile);
    setShowcases((prev) => prev.map((s, idx) => (idx === activeIndex ? updatedProfile : s)));

    if (profile.id) {
      try {
        await saveUploadedProMediaField({
          profileId: profile.id,
          field: "gallery",
          value: nextGallery,
        });
      } catch {}
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      const dataToSave = {
        ...profile,
        profileId: profile.id || undefined,
        gallery: galleryUrls,
      };
      const updated = await upsertProfile(dataToSave);
      const merged = { ...updated, services: profile.services || [] };
      setProfile(merged);
      setShowcases((prev) =>
        prev.length === 0 ? [merged] : prev.map((s, idx) => (idx === activeIndex ? merged : s))
      );
      setFeedback({
        type: "success",
        text: updated.isActive
          ? "Vetrina salvata con successo! Tutte le modifiche sono online."
          : "Vetrina salvata! Nota: per questa provincia e categoria i posti a Numero Chiuso sono al completo, sei stato inserito in Lista Prioritaria.",
      });
      router.refresh();
    } catch (err: any) {
      setFeedback({
        type: "error",
        text: err?.message || "Errore durante il salvataggio della vetrina.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSecondShowcase = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      const created = await createSecondShowcase({
        businessName: secondForm.businessName,
        category: secondForm.category,
        province: secondForm.province || profile.province,
        vatNumber: secondForm.vatNumber || profile.vatNumber,
      });
      const nextList = [...showcases, created];
      setShowcases(nextList);
      setActiveIndex(nextList.length - 1);
      setProfile(created);
      setGalleryUrls([]);
      setShowCreateSecond(false);
      setFeedback({
        type: "success",
        text: `2ª Vetrina "${created.businessName}" attivata con successo! Codice Partner assegnato: ${created.partnerCode}. Ora personalizza foto e descrizione.`,
      });
      router.refresh();
    } catch (err: any) {
      setFeedback({
        type: "error",
        text: err?.message || "Impossibile creare la 2ª Vetrina.",
      });
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
    if (!profile.id) return;
    setLoading(true);
    try {
      if (isEditingService && serviceForm.id) {
        await updateService(serviceForm.id, serviceForm);
      } else {
        await createService(serviceForm, profile.id);
      }
      resetServiceForm();
      router.refresh();
      setFeedback({ type: "success", text: "Listino servizi aggiornato!" });
    } catch {
      setFeedback({ type: "error", text: "Errore nel salvataggio del servizio." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Vuoi rimuovere questo servizio dalla vetrina?")) return;
    setLoading(true);
    await deleteService(id);
    router.refresh();
    setLoading(false);
  };

  const selectedProvMeta = getProvinceMeta(profile.province);

  return (
    <div className="space-y-6">
      {/* BARRA MULTI-VETRINA (DOPPIA VETRINA STESSA P.IVA / MULTI-SERVIZIO) */}
      <div className="rounded-3xl bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-white p-5 sm:p-6 border border-amber-400/30 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-300 mb-1">
              <Layers className="w-3.5 h-3.5" /> Gestione Multi-Servizio &amp; Doppia Vetrina (Stessa P.IVA)
            </div>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl">
              Offri due attività complementari (es. <strong>Fotografia + Videomaker</strong>, oppure{" "}
              <strong>Location + Ristorante</strong>)? Puoi gestire fino a{" "}
              <strong className="text-amber-300">2 Vetrine indipendenti</strong> nella directory con un unico login.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {showcases.map((sc, idx) => (
              <button
                key={sc.id || idx}
                type="button"
                onClick={() => switchShowcase(idx)}
                className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeIndex === idx && !showCreateSecond
                    ? "bg-amber-400 text-stone-950 shadow-md"
                    : "bg-white/10 text-stone-200 hover:bg-white/20 border border-white/15"
                }`}
              >
                <span>Vetrina #{idx + 1}:</span>
                <span className="truncate max-w-[140px]">{sc.businessName || "Principale"}</span>
                {sc.partnerCode && (
                  <span className="px-1.5 py-0.5 rounded bg-stone-950/20 text-[10px] font-mono">
                    {sc.partnerCode}
                  </span>
                )}
              </button>
            ))}

            {showcases.length === 1 && (
              <button
                type="button"
                onClick={() => {
                  setSecondForm({
                    businessName: "",
                    category:
                      profile.category === "PHOTOGRAPHER"
                        ? "VIDEOMAKER"
                        : profile.category === "LOCATION"
                        ? "RESTAURANT"
                        : "PHOTOGRAPHER",
                    province: profile.province || "",
                    vatNumber: profile.vatNumber || "",
                  });
                  setShowCreateSecond((v) => !v);
                }}
                className="px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-stone-950 transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" /> Attiva 2ª Vetrina (Stessa P.IVA)
              </button>
            )}
          </div>
        </div>

        {/* PANNELLO RAPIDO ATTIVAZIONE 2ª VETRINA */}
        {showCreateSecond && showcases.length === 1 && (
          <form
            onSubmit={handleCreateSecondShowcase}
            className="mt-5 pt-5 border-t border-stone-800 grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
          >
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-amber-200">
                Nome 2ª Vetrina / Brand Secondario
              </label>
              <Input
                required
                value={secondForm.businessName}
                onChange={(e) => setSecondForm({ ...secondForm, businessName: e.target.value })}
                placeholder="Es. Studio Wedding Film"
                className="bg-stone-900 border-stone-700 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-amber-200">Categoria 2ª Vetrina</label>
              <select
                value={secondForm.category}
                onChange={(e) => setSecondForm({ ...secondForm, category: e.target.value })}
                className="flex h-10 w-full rounded-md border border-stone-700 bg-stone-900 px-3 py-2 text-sm text-white"
              >
                {PRO_CATEGORY_GROUPS.map((grp) => (
                  <optgroup key={grp.groupName} label={grp.groupName}>
                    {grp.items.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-amber-200">
                Partita IVA Condivisa (Opzionale)
              </label>
              <Input
                value={secondForm.vatNumber}
                onChange={(e) => setSecondForm({ ...secondForm, vatNumber: e.target.value })}
                placeholder="Es. 02656280902"
                className="bg-stone-900 border-stone-700 text-white"
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold"
              >
                {loading ? "Creazione..." : "Crea 2ª Vetrina"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateSecond(false)}
                className="border-stone-700 text-stone-300 bg-transparent hover:bg-stone-800"
              >
                Annulla
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* BANNER FEEDBACK STATO */}
      {feedback && (
        <div
          className={`rounded-2xl p-4 border flex items-start gap-3 text-sm shadow-xs ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-300 text-emerald-950"
              : "bg-red-50 border-red-300 text-red-900"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <div className="font-medium">{feedback.text}</div>
        </div>
      )}

      {uploadingField && (
        <div className="rounded-2xl p-4 bg-amber-50 border border-amber-300 text-amber-950 flex items-center gap-3 text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-amber-600 shrink-0" />
          <span className="font-semibold">{uploadProgress || "Caricamento immagine HD in corso..."}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLONNA PRINCIPALE: DATI & FOTO VETRINA */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-3xl border-stone-200 shadow-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="font-serif text-2xl">
                      {showcases.length > 1
                        ? `Vetrina #${activeIndex + 1}: ${profile.businessName || "Nuova Vetrina"}`
                        : "Informazioni Vetrina Pubblica"}
                    </CardTitle>
                    {profile.partnerCode && (
                      <span className="px-3 py-1 rounded-full bg-stone-900 text-amber-300 font-mono text-xs font-bold">
                        Codice Fornitore: {profile.partnerCode}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Categoria attuale: <strong>{getProCategoryLabel(profile.category)}</strong>
                  </p>
                </div>

                {profile?.slug && (
                  <a
                    href={`/pro/${profile.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold transition-all shadow-md bg-amber-500 hover:bg-amber-600 text-stone-950 h-10 px-6 hover:scale-105"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" /> Apri Vetrina Pubblica
                  </a>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome Attività / Studio / Struttura</Label>
                    <Input
                      value={profile.businessName || ""}
                      onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Slug Univoco (URL della vetrina)</Label>
                    <div className="flex items-center">
                      <span className="text-stone-500 bg-stone-100 px-3 py-2 border border-r-0 border-input rounded-l-md text-sm">
                        /pro/
                      </span>
                      <Input
                        className="rounded-l-none"
                        value={profile.slug || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                          })
                        }
                        required
                        placeholder="es. studio-fotografico-rossi"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Categoria Attività</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={profile.category || "PHOTOGRAPHER"}
                      onChange={(e) => setProfile({ ...profile, category: e.target.value })}
                    >
                      {PRO_CATEGORY_GROUPS.map((grp) => (
                        <optgroup key={grp.groupName} label={grp.groupName}>
                          {grp.items.map((item) => (
                            <option key={item.code} value={item.code}>
                              {item.label}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <span>Provincia Principale (Numero Chiuso)</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    </Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={profile.province || ""}
                      onChange={(e) => {
                        const code = e.target.value;
                        const meta = getProvinceMeta(code);
                        setProfile({
                          ...profile,
                          province: code,
                          serviceArea:
                            profile.serviceArea ||
                            (meta ? `${meta.name} e provincia (${meta.region})` : ""),
                        });
                      }}
                    >
                      <option value="">Seleziona la tua Provincia...</option>
                      {ITALIAN_PROVINCES.map((p) => (
                        <option key={p.code} value={p.code}>
                          {p.name} ({p.code}) — Max {p.maxPerCategory} per categoria
                        </option>
                      ))}
                    </select>
                    {selectedProvMeta && (
                      <p className="text-[11px] text-emerald-700 font-medium">
                        Esclusività territoriale GentiLuna: max {selectedProvMeta.maxPerCategory}{" "}
                        fornitori per categoria in provincia di {selectedProvMeta.name}.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-stone-500" />
                      <span>Partita IVA (Opzionale — sblocca Badge Impresa Verificata)</span>
                    </Label>
                    <Input
                      value={profile.vatNumber || ""}
                      onChange={(e) => setProfile({ ...profile, vatNumber: e.target.value })}
                      placeholder="Es. 02656280902 (non mostrata in chiaro se preferisci)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Area / Zone Coperte (Testo libero)</Label>
                    <Input
                      value={profile.serviceArea || ""}
                      onChange={(e) => setProfile({ ...profile, serviceArea: e.target.value })}
                      placeholder="es. Sassari, Alghero, Olbia e tutta la Sardegna"
                    />
                  </div>
                </div>

                {/* BOX TUTELA RECAPITI */}
                <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 leading-relaxed">
                  <strong className="flex items-center gap-1.5 text-sm font-semibold text-amber-900 mb-1">
                    <ShieldCheck className="w-4 h-4 text-amber-600" /> Ecosistema Protetto GentiLuna — Recapiti Riservati &amp; Preventivi Tracciati
                  </strong>
                  I tuoi recapiti diretti qui sotto restano riservati ad uso interno per verifica e notifiche immediate di nuovi preventivi: gli sposi ti contattano senza spam tramite{" "}
                  <strong>Richiedi Preventivo Gratuito</strong> e <strong>Live Chat interna</strong>.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email Notifiche Preventivi</Label>
                    <Input
                      type="email"
                      value={profile.contactEmail || ""}
                      onChange={(e) => setProfile({ ...profile, contactEmail: e.target.value })}
                      placeholder="studio@esempio.it"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp / Telefono (Riservato verifica)</Label>
                    <Input
                      value={profile.whatsapp || profile.contactPhone || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          whatsapp: e.target.value,
                          contactPhone: e.target.value,
                        })
                      }
                      placeholder="Es. +39 340..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sito Web Ufficiale (Riservato verifica)</Label>
                    <Input
                      value={profile.website || ""}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                      placeholder="https://"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Instagram (Riservato verifica)</Label>
                    <Input
                      value={profile.instagram || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, instagram: e.target.value.replace("@", "") })
                      }
                      placeholder="tuonomeprofilo"
                    />
                  </div>
                </div>

                {/* SEZIONE CARICAMENTO IMMAGINI ULTRA-HD CON AUTO-SAVE */}
                <div className="pt-4 border-t border-stone-200 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-stone-900">
                        Immagini Vetrina &amp; Portfolio Ultra-HD
                      </h3>
                      <p className="text-xs text-stone-500">
                        Carica direttamente i tuoi scatti (anche da 15–30 MB): vengono ottimizzati in nitidezza Retina 2.5K e salvati subito in automatico.
                      </p>
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedMediaRights}
                      onChange={(e) => setAcceptedMediaRights(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-stone-900 shrink-0"
                    />
                    <span>
                      Confermo di possedere i diritti d&apos;autore e le liberatorie necessarie per pubblicare le fotografie e i loghi caricati nella mia vetrina professionale.
                    </span>
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* FOTO PROFILO / LOGO */}
                    <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 space-y-3">
                      <Label className="font-bold text-stone-800">
                        Foto Profilo / Avatar o Logo Studio
                      </Label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full border-2 border-amber-300 bg-white overflow-hidden shrink-0 flex items-center justify-center">
                          {profile.profileImage || profile.logoUrl ? (
                            <img
                              src={resolvePreviewImg(profile.profileImage || profile.logoUrl)}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl font-serif text-stone-400">
                              {(profile.businessName || "G").charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold cursor-pointer">
                            <UploadCloud className="w-4 h-4 text-amber-300" />
                            <span>Carica Foto / Logo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={Boolean(uploadingField)}
                              onChange={(e) => handleSingleImageUpload(e, "profileImage")}
                            />
                          </label>
                          <Input
                            value={profile.profileImage || profile.logoUrl || ""}
                            onChange={(e) =>
                              setProfile({ ...profile, profileImage: e.target.value })
                            }
                            placeholder="Oppure incolla URL immagine..."
                            className="h-8 text-xs bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* IMMAGINE DI COPERTINA */}
                    <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 space-y-3">
                      <Label className="font-bold text-stone-800">
                        Immagine Grande di Copertina (Hero)
                      </Label>
                      {profile.coverImage ? (
                        <div className="relative h-24 w-full rounded-xl overflow-hidden border border-stone-200">
                          <img
                            src={resolvePreviewImg(profile.coverImage)}
                            alt="Copertina"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-24 w-full rounded-xl border border-dashed border-stone-300 bg-white flex items-center justify-center text-xs text-stone-400">
                          Nessuna copertina caricata
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold cursor-pointer shrink-0">
                          <UploadCloud className="w-4 h-4 text-amber-300" />
                          <span>Carica Copertina HD</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={Boolean(uploadingField)}
                            onChange={(e) => handleSingleImageUpload(e, "coverImage")}
                          />
                        </label>
                        <Input
                          value={profile.coverImage || ""}
                          onChange={(e) => setProfile({ ...profile, coverImage: e.target.value })}
                          placeholder="Oppure URL..."
                          className="h-8 text-xs bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PORTFOLIO MULTI-UPLOAD FINO A 15 FOTO */}
                  <div className="p-5 rounded-2xl border-2 border-dashed border-amber-300/80 bg-amber-50/30 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <Label className="text-base font-serif font-bold text-stone-900">
                          Portfolio Fotografico ({galleryUrls.length} / 15 scatti)
                        </Label>
                        <p className="text-xs text-stone-600">
                          Seleziona anche più foto contemporaneamente: non serve comprimere prima da Photoshop o Lightroom!
                        </p>
                      </div>

                      <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs sm:text-sm font-bold cursor-pointer shadow-sm transition-transform hover:scale-105">
                        <UploadCloud className="w-4 h-4" />
                        <span>Seleziona Foto Portfolio (Multiplo)</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          disabled={Boolean(uploadingField) || galleryUrls.length >= 15}
                          onChange={(e) => {
                            if (e.target.files) {
                              handleMultiGalleryUpload(e.target.files);
                              e.target.value = "";
                            }
                          }}
                        />
                      </label>
                    </div>

                    {galleryUrls.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
                        {galleryUrls.map((url, i) => (
                          <div
                            key={`${url}-${i}`}
                            className="relative group aspect-square rounded-xl overflow-hidden border border-stone-200 bg-white shadow-xs"
                          >
                            <img
                              src={resolvePreviewImg(url)}
                              alt={`Portfolio ${i + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-1.5 left-1.5 bg-stone-950/75 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              #{i + 1}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeGalleryPhoto(i)}
                              title="Rimuovi foto"
                              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-90 hover:opacity-100 shadow cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <div className="absolute bottom-1.5 inset-x-1.5 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                disabled={i === 0}
                                onClick={() => moveGalleryPhoto(i, -1)}
                                className="w-6 h-6 rounded-full bg-stone-900/80 text-white flex items-center justify-center disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={i === galleryUrls.length - 1}
                                onClick={() => moveGalleryPhoto(i, 1)}
                                className="w-6 h-6 rounded-full bg-stone-900/80 text-white flex items-center justify-center disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center text-xs text-stone-500">
                        Nessuna foto ancora nel portfolio. Clicca su <strong>Seleziona Foto Portfolio</strong> per caricare subito i tuoi scatti migliori.
                      </div>
                    )}
                  </div>
                </div>

                {/* VIDEO SHOWREEL & DESCRIZIONE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Link Video YouTube / Vimeo (1)</Label>
                    <Input
                      value={profile.video1 || ""}
                      onChange={(e) => setProfile({ ...profile, video1: e.target.value })}
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Link Video YouTube / Vimeo (2)</Label>
                    <Input
                      value={profile.video2 || ""}
                      onChange={(e) => setProfile({ ...profile, video2: e.target.value })}
                      placeholder="https://vimeo.com/..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Presentazione &amp; Filosofia dello Studio</Label>
                  <Textarea
                    className="min-h-32"
                    value={profile.description || ""}
                    onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                    placeholder="Racconta il tuo stile, l'esperienza che offri agli sposi e cosa ti distingue..."
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.isActive ?? true}
                      onChange={(e) => setProfile({ ...profile, isActive: e.target.checked })}
                      className="w-4 h-4 accent-stone-900"
                    />
                    <span className="text-sm font-medium text-stone-800">
                      Vetrina Pubblica Visibile nella Directory
                    </span>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={loading || Boolean(uploadingField)}
                  className="w-full h-12 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-base"
                >
                  {loading ? "Salvataggio in corso..." : "Salva Informazioni Vetrina"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* COLONNA DESTRA: PACCHETTI & SERVIZI */}
        <div className="space-y-8">
          <Card className="rounded-3xl border-stone-200 shadow-sm">
            <CardHeader>
              <CardTitle className="font-serif text-xl">
                {isEditingService ? "Modifica Servizio" : "Aggiungi Servizio / Pacchetto"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleServiceSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome Servizio / Pacchetto</Label>
                  <Input
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                    placeholder="Es. Servizio Fotografico Completo + Album"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Prezzo Indicativo (Opzionale)</Label>
                  <Input
                    value={serviceForm.priceIndicative || ""}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, priceIndicative: e.target.value })
                    }
                    placeholder="es. A partire da 1.200 €"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cosa include</Label>
                  <Textarea
                    value={serviceForm.description || ""}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, description: e.target.value })
                    }
                    placeholder="Descrivi cosa è incluso nel pacchetto..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={loading || !profile.id}
                    className="flex-1 rounded-xl bg-stone-900 hover:bg-stone-800 text-white"
                  >
                    {isEditingService ? "Aggiorna" : "Aggiungi al Listino"}
                  </Button>
                  {isEditingService && (
                    <Button type="button" variant="outline" onClick={resetServiceForm}>
                      Annulla
                    </Button>
                  )}
                </div>
                {!profile.id && (
                  <p className="text-xs text-amber-700 mt-2">
                    Salva prima i dati base della vetrina a sinistra per aggiungere i tuoi pacchetti.
                  </p>
                )}
              </form>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="font-serif font-bold text-lg text-stone-800">
              Servizi Pubblicati ({profile?.services?.length || 0})
            </h3>
            {profile?.services
              ?.slice()
              .sort((a: any, b: any) => a.order - b.order)
              .map((s: any) => (
                <Card key={s.id} className="shadow-xs rounded-2xl border-stone-200">
                  <CardContent className="p-4 flex flex-col gap-1.5">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-semibold text-stone-900">{s.name}</h4>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => {
                            setServiceForm({
                              id: s.id,
                              name: s.name,
                              description: s.description || "",
                              priceIndicative: s.priceIndicative || "",
                              order: s.order.toString(),
                            });
                            setIsEditingService(true);
                          }}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500"
                          onClick={() => handleDeleteService(s.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                    {s.priceIndicative && (
                      <p className="text-xs font-bold text-amber-700">{s.priceIndicative}</p>
                    )}
                    {s.description && (
                      <p className="text-xs text-stone-600 line-clamp-3">{s.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            {(!profile?.services || profile.services.length === 0) && (
              <p className="text-sm text-stone-400 italic">
                Nessun servizio ancora configurato per questa vetrina.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
