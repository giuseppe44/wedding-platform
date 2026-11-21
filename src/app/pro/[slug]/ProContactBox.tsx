"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, MessageSquare, Send, CheckCircle2, Lock, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestProQuote } from "@/app/actions/proQuoteAction";

interface ProContactBoxProps {
  proId: string;
  proName: string;
  serviceArea?: string | null;
  isLoggedIn: boolean;
}

export default function ProContactBox({
  proId,
  proName,
  serviceArea,
  isLoggedIn,
}: ProContactBoxProps) {
  const [showForm, setShowForm] = useState(false);
  const [coupleName, setCoupleName] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [coupleEmail, setCoupleEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await requestProQuote({
      proId,
      coupleName,
      weddingDate,
      coupleEmail,
      message,
    });

    setLoading(false);
    if (!res.success) {
      setError(res.error || "Si è verificato un errore. Riprova.");
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-md sticky top-8 space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Partner Verificato GentiLuna
          </span>
          <h3 className="font-serif text-xl text-stone-900">Contatta {proName}</h3>
          {serviceArea && (
            <p className="text-xs text-stone-500 mt-0.5">Area operativa: {serviceArea}</p>
          )}
        </div>
      </div>

      <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3.5 text-xs text-stone-600 leading-relaxed flex items-start gap-2.5">
        <Lock className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
        <span>
          <strong>Comunicazioni Protette:</strong> per garantire sicurezza anti-spam e tracciamento dei preventivi, tutti i contatti avvengono direttamente dentro l&apos;ecosistema GentiLuna.
        </span>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h4 className="font-bold text-emerald-900">Richiesta inviata!</h4>
          <p className="text-xs text-emerald-800 leading-relaxed">
            <strong>{proName}</strong> ha ricevuto la tua richiesta su GentiLuna e ti risponderà al più presto tramite la piattaforma.
          </p>
          {!isLoggedIn && (
            <div className="pt-2">
              <Link href="/login?role=COUPLE&mode=REGISTER">
                <Button size="sm" className="w-full rounded-xl bg-stone-900 text-white hover:bg-stone-800">
                  Crea il tuo spazio Sposi gratuito
                </Button>
              </Link>
            </div>
          )}
        </div>
      ) : !showForm ? (
        <div className="space-y-3">
          <Button
            type="button"
            onClick={() => setShowForm(true)}
            className="w-full h-12 bg-stone-900 text-white hover:bg-stone-800 rounded-xl font-semibold text-sm shadow-sm gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-rose-400" />
            Richiedi Preventivo Gratuito
          </Button>

          <Link href={isLoggedIn ? "/dashboard/messages" : "/login?role=COUPLE"} className="block">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 rounded-xl border-stone-300 text-stone-800 hover:bg-stone-50 font-medium text-sm gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-rose-500" />
              {isLoggedIn ? "Apri Live Chat Interna" : "Accedi per la Live Chat"}
            </Button>
          </Link>

          <p className="text-[11px] text-center text-stone-400 pt-1">
            Risposta rapida • Zero spam • 100% gratuito per gli sposi
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-stone-700">I vostri nomi *</Label>
            <Input
              required
              value={coupleName}
              onChange={(e) => setCoupleName(e.target.value)}
              placeholder="Es. Giulia & Marco"
              className="rounded-xl text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-stone-700">Data evento</Label>
              <Input
                type="date"
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-stone-700">Email per risposta *</Label>
              <Input
                type="email"
                required
                value={coupleEmail}
                onChange={(e) => setCoupleEmail(e.target.value)}
                placeholder="vostra@email.it"
                className="rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-stone-700">Dettagli della richiesta *</Label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Raccontaci la location, il numero indicativo di invitati e cosa desideri per il tuo evento..."
              className="w-full rounded-xl border border-stone-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-800 resize-none"
            />
            <p className="text-[11px] text-stone-400">
              Non inserire numeri di telefono, WhatsApp o link esterni nel messaggio: il sistema li blocca automaticamente per proteggere la tua privacy.
            </p>
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setError(null);
              }}
              className="rounded-xl border-stone-300 text-stone-600"
            >
              Annulla
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-stone-900 text-white hover:bg-stone-800 rounded-xl gap-2 font-semibold"
            >
              <Send className="w-4 h-4" />
              {loading ? "Invio..." : "Invia Richiesta"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
