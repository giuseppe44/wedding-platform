"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Bell, CheckCircle2, Camera, Utensils, ArrowRight, Sparkles } from "lucide-react";
import { submitPublicEventConnection } from "@/app/actions/weddingGuestLeadAction";

interface GuestRegistrationFormProps {
  buttonColor: string;
  timelineItemId?: string;
  weddingSlug?: string;
  coupleNames?: string;
}

export default function GuestRegistrationForm({
  buttonColor,
  timelineItemId = "",
  weddingSlug = "",
  coupleNames = "Gli Sposi",
}: GuestRegistrationFormProps) {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);

  const [partnerMode, setPartnerMode] = useState<"NONE" | "PRO" | "RESTAURANT">("NONE");
  const [partnerName, setPartnerName] = useState("");
  const [partnerBusiness, setPartnerBusiness] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [partnerPhone, setPartnerPhone] = useState("");
  const [partnerNotes, setPartnerNotes] = useState("");
  const [partnerLoading, setPartnerLoading] = useState(false);
  const [partnerSent, setPartnerSent] = useState(false);
  const [partnerError, setPartnerError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (timelineItemId) {
      const res = await submitPublicEventConnection({
        timelineItemId,
        weddingSlug,
        coupleNames,
        type: "GUEST",
        name,
        email,
        phone,
        marketingConsent,
      });
      setLoading(false);
      if (!res.success) {
        setError(res.error || "Errore durante la registrazione.");
        return;
      }
      setSuccess(true);
      return;
    }

    setLoading(false);
    setSuccess(true);
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (partnerMode === "NONE") return;
    setPartnerLoading(true);
    setPartnerError(null);

    const res = await submitPublicEventConnection({
      timelineItemId: timelineItemId || weddingSlug || "public",
      weddingSlug,
      coupleNames,
      type: partnerMode,
      name: partnerName,
      email: partnerEmail,
      phone: partnerPhone,
      companyOrRole: partnerBusiness,
      notes: partnerNotes,
      marketingConsent: true,
    });

    setPartnerLoading(false);
    if (!res.success) {
      setPartnerError(res.error || "Errore durante l'invio.");
      return;
    }
    setPartnerSent(true);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto mb-16 mt-8">
      {success ? (
        <div className="bg-white border border-stone-100 shadow-sm rounded-3xl p-8 text-center max-w-xl mx-auto">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h3 className="font-serif text-2xl text-stone-800 mb-2">Registrazione completata!</h3>
          <p className="text-stone-500">
            Grazie! Ti avviseremo non appena gli sposi apriranno il Guestbook e pubblicheranno nuove foto nell&apos;album.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-stone-100 shadow-xl rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: buttonColor }} />

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-stone-50 mb-4">
              <Bell className="w-6 h-6 text-stone-600" />
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-stone-800 mb-2">
              Sei un Invitato? Rimani connesso all&apos;evento
            </h3>
            <p className="text-stone-500 text-sm md:text-base">
              Lascia i tuoi recapiti per ricevere una notifica quando {coupleNames} apriranno il Guestbook e pubblicheranno le foto ufficiali in HD.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome e Cognome *</Label>
                <Input
                  id="nome"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Mario Rossi"
                  className="mt-1 bg-stone-50"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mario@example.com"
                  className="mt-1 bg-stone-50"
                />
              </div>
              <div>
                <Label htmlFor="telefono">Cellulare (Opzionale)</Label>
                <Input
                  id="telefono"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+39 333 1234567"
                  className="mt-1 bg-stone-50"
                />
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-stone-100">
              <div className="flex items-start gap-3">
                <Checkbox id="privacy" required className="mt-1 shrink-0" />
                <Label htmlFor="privacy" className="text-xs text-stone-500 leading-snug font-normal cursor-pointer">
                  * Ho letto l&apos;
                  <Link href="/privacy" target="_blank" className="underline text-rose-600 font-semibold">
                    Informativa sulla Privacy
                  </Link>{" "}
                  e accetto il trattamento dei dati personali per ricevere aggiornamenti sull&apos;evento.
                </Label>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="marketing"
                  checked={marketingConsent}
                  onCheckedChange={(val) => setMarketingConsent(Boolean(val))}
                  className="mt-1 shrink-0"
                />
                <Label htmlFor="marketing" className="text-xs text-stone-500 leading-snug font-normal cursor-pointer">
                  Acconsento a ricevere eventuali proposte dai fornitori ufficiali di questo evento (Opzionale).
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full text-white py-4 min-h-12 h-auto text-base sm:text-lg rounded-full shadow-md hover:scale-[1.01] transition-transform font-bold whitespace-normal"
              style={{ backgroundColor: buttonColor }}
            >
              {loading ? "Registrazione in corso..." : "Avvisami sulle novità"}
            </Button>
          </form>
        </div>
      )}

      {/* COLLABORAZIONE DIRETTA CON PROFESSIONISTI & RISTORANTE / LOCATION */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-800">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-300 bg-amber-500/15 border border-amber-400/25 px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Collaborazioni &amp; Partner dell&apos;Evento
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Lavori al matrimonio di {coupleNames}? Mettiti in contatto!
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 mt-2 font-light leading-relaxed">
            GentiLuna connette gratuitamente nello stesso spazio digitale gli sposi, i professionisti del wedding e il ristorante che ospita il ricevimento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white/5 border border-white/15 rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-bold text-white">
                Sei il Professionista che collabora con loro?
              </h4>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Fotografo, Videomaker, Wedding Planner, Fiorista o Musicista: collegati a questo spazio su GentiLuna per comparire con la tua vetrina davanti a tutti gli invitati.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  setPartnerMode("PRO");
                  setPartnerSent(false);
                }}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs sm:text-sm py-2.5 px-4 rounded-full transition-colors cursor-pointer"
              >
                Mettiti in contatto
              </button>
              <Link
                href="/professionisti#founders"
                className="inline-flex items-center justify-center gap-1 border border-white/20 hover:bg-white/10 text-white text-xs font-semibold py-2.5 px-4 rounded-full transition-colors"
              >
                Crea Vetrina <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="bg-white/5 border border-white/15 rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <Utensils className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-bold text-white">
                Sei il Ristorante o la Location dell&apos;evento?
              </h4>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Ricevi dagli sposi il link riservato con la mappa dei tavoli, il conteggio degli ospiti confermati e la scheda cucina delle allergie e intolleranze sempre aggiornata!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  setPartnerMode("RESTAURANT");
                  setPartnerSent(false);
                }}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-stone-950 font-bold text-xs sm:text-sm py-2.5 px-4 rounded-full transition-colors cursor-pointer"
              >
                Collegati come Ristorante
              </button>
              <Link
                href="/professionisti#founders"
                className="inline-flex items-center justify-center gap-1 border border-white/20 hover:bg-white/10 text-white text-xs font-semibold py-2.5 px-4 rounded-full transition-colors"
              >
                Scopri GentiLuna <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {partnerMode !== "NONE" && (
          <div className="mt-6 bg-white text-stone-900 rounded-2xl p-5 sm:p-6 border border-amber-200 animate-in fade-in">
            {partnerSent ? (
              <div className="text-center py-4 space-y-2">
                <CheckCircle2 className="w-9 h-9 text-emerald-600 mx-auto" />
                <h4 className="font-serif font-bold text-lg text-stone-900">Richiesta di collegamento inviata!</h4>
                <p className="text-xs sm:text-sm text-stone-600">
                  Abbiamo avvisato {coupleNames} della tua disponibilità. Puoi anche attivare gratis la tua vetrina partner su GentiLuna per collaborare su tutti i prossimi matrimoni.
                </p>
                <div className="pt-2">
                  <Link href="/login?role=PHOTOGRAPHER&mode=REGISTER">
                    <Button className="rounded-full bg-stone-900 text-white hover:bg-stone-800 text-xs sm:text-sm">
                      Attiva Account Partner Gratuito
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePartnerSubmit} className="space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-stone-200 pb-3">
                  <h4 className="font-serif font-bold text-lg text-stone-900">
                    {partnerMode === "RESTAURANT"
                      ? `Collegamento Ristorante / Location per ${coupleNames}`
                      : `Collegamento Professionista per ${coupleNames}`}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setPartnerMode("NONE")}
                    className="text-xs text-stone-500 hover:text-stone-900 underline cursor-pointer"
                  >
                    Chiudi
                  </button>
                </div>

                {partnerError && (
                  <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-2.5">
                    {partnerError}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-semibold">
                      {partnerMode === "RESTAURANT" ? "Nome Struttura / Ristorante *" : "Nome Studio / Azienda *"}
                    </Label>
                    <Input
                      required
                      value={partnerBusiness}
                      onChange={(e) => setPartnerBusiness(e.target.value)}
                      placeholder={partnerMode === "RESTAURANT" ? "Es. Villa Loreto Ristorante" : "Es. Studio Luce Fotografia"}
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Referente *</Label>
                    <Input
                      required
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      placeholder="Nome e Cognome"
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Email *</Label>
                    <Input
                      type="email"
                      required
                      value={partnerEmail}
                      onChange={(e) => setPartnerEmail(e.target.value)}
                      placeholder="info@struttura.it"
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Telefono / WhatsApp</Label>
                    <Input
                      type="tel"
                      value={partnerPhone}
                      onChange={(e) => setPartnerPhone(e.target.value)}
                      placeholder="+39 333 ..."
                      className="mt-1 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-semibold">Messaggio per gli sposi o richiesta accesso tavoli</Label>
                  <Input
                    value={partnerNotes}
                    onChange={(e) => setPartnerNotes(e.target.value)}
                    placeholder={
                      partnerMode === "RESTAURANT"
                        ? "Es. Inviateci il link Portale Ristorante per vedere intolleranze e disposizione tavoli..."
                        : "Es. Siamo il fotografo / DJ ufficiale, vorremmo collegare la nostra vetrina all'evento..."
                    }
                    className="mt-1 text-sm"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={partnerLoading}
                  className="w-full rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold"
                >
                  {partnerLoading ? "Invio in corso..." : "Invia Richiesta di Collegamento"}
                </Button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
