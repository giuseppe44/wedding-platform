"use client";

import { useState } from "react";
import { Utensils, MessageCircle, Mail, Copy, Check, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RestaurantShareCardProps {
  coupleNames: string;
  eventDateText?: string;
  defaultVenueName?: string;
  portalUrl: string;
  compact?: boolean;
}

export function RestaurantShareCard({
  coupleNames,
  eventDateText,
  defaultVenueName = "",
  portalUrl,
  compact = false,
}: RestaurantShareCardProps) {
  const [venueName, setVenueName] = useState(defaultVenueName);
  const [copied, setCopied] = useState(false);

  const venueGreeting = venueName.trim()
    ? `Ciao team di ${venueName.trim()}!`
    : "Ciao!";

  const messageText = [
    `${venueGreeting} Siamo ${coupleNames}${eventDateText ? ` (data evento: ${eventDateText})` : ""}.`,
    `Stiamo organizzando e gestendo il nostro matrimonio tramite il portale GentiLuna (https://www.gentiluna.com).`,
    `Vi inviamo il vostro accesso dedicato per consultare sempre in diretta le conferme degli invitati, l'assegnazione dei tavoli e tutte le allergie e intolleranze alimentari:`,
    portalUrl,
    `Grazie mille per la collaborazione!`,
  ].join("\n\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsapp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(messageText)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleEmail = () => {
    const subject = `Tavoli, RSVP e Intolleranze — Matrimonio ${coupleNames} (GentiLuna)`;
    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(messageText)}`
    );
  };

  return (
    <div
      className={`rounded-3xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50/90 via-white to-amber-50/50 shadow-sm ${
        compact ? "p-5 sm:p-6" : "p-6 sm:p-8 mb-8"
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full">
              <Utensils className="w-3.5 h-3.5" /> Portale Ristorante &amp; Location
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100/80 border border-amber-200 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3 h-3" /> Aggiornato in diretta
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
            Invia subito Tavoli &amp; Intolleranze al Ristorante via GentiLuna
          </h3>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl">
            Comunica subito al ristorante o alla villa che gestite l&apos;evento con GentiLuna e condividi il loro{" "}
            <strong className="text-stone-800">link riservato di consultazione</strong>: potranno vedere in tempo reale tavoli, posti assegnati, allergie alimentari e orari, senza scambiare decine di file Excel.
          </p>

          <div className="max-w-sm pt-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
              Nome Ristorante / Villa (opzionale)
            </label>
            <Input
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              placeholder="Es. Villa Loreto Ristorante"
              className="bg-white border-emerald-200 focus:border-emerald-400 text-sm h-9 rounded-xl"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 shrink-0 lg:w-80">
          <Button
            type="button"
            onClick={handleWhatsapp}
            className="w-full min-h-11 h-auto py-2.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm gap-2 shadow-md whitespace-normal text-center cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>Invia Accesso al Ristorante (WhatsApp)</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleEmail}
            className="w-full min-h-10 h-auto py-2 px-4 rounded-full border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs sm:text-sm gap-2 whitespace-normal text-center cursor-pointer"
          >
            <Mail className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Invia via Email al Ristorante</span>
          </Button>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCopy}
              className="flex-1 h-9 rounded-full border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copiato!" : "Copia Link"}</span>
            </Button>

            <a
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-3 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Anteprima</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
