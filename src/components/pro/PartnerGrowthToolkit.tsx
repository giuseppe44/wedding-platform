"use client";

import { useState } from "react";
import {
  Gift,
  Award,
  Copy,
  Check,
  MessageCircle,
  Code2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PartnerGrowthToolkitProps {
  slug: string;
  businessName: string;
  categoryLabel: string;
  inviteCode: string;
  convertedCount: number;
}

export function PartnerGrowthToolkit({
  slug,
  businessName,
  categoryLabel,
  inviteCode,
  convertedCount,
}: PartnerGrowthToolkitProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [badgeTheme, setBadgeTheme] = useState<"dark" | "ivory" | "minimal">("dark");

  const referralUrl = `https://www.gentiluna.com/prezzi?partner=${encodeURIComponent(
    inviteCode
  )}`;
  const profileUrl = `https://www.gentiluna.com/pro/${slug}`;

  const progressTarget = 3;
  const currentCycleCount = convertedCount % progressTarget;
  const progressPct = Math.min(
    100,
    Math.round(((convertedCount > 0 && currentCycleCount === 0 ? 3 : currentCycleCount) / progressTarget) * 100)
  );

  const badgeHtmlSnippet =
    badgeTheme === "dark"
      ? `<a href="${profileUrl}?utm_source=partner_badge" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:10px;padding:10px 18px;border-radius:999px;background:#0c0a09;border:1px solid rgba(251,191,36,0.55);color:#fef3c7;font-family:Georgia,serif;font-size:13px;text-decoration:none;box-shadow:0 6px 20px rgba(0,0,0,0.18);"><span style="color:#fbbf24;font-size:15px;">✦</span><span><strong style="color:#ffffff;">${businessName}</strong> • Partner Verificato GentiLuna</span></a>`
      : badgeTheme === "ivory"
      ? `<a href="${profileUrl}?utm_source=partner_badge" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:10px;padding:10px 18px;border-radius:999px;background:#fffbf2;border:1px solid #fcd34d;color:#451a03;font-family:Georgia,serif;font-size:13px;text-decoration:none;box-shadow:0 4px 14px rgba(217,119,6,0.12);"><span style="color:#d97706;font-size:15px;">✦</span><span><strong>${businessName}</strong> • Partner Ufficiale GentiLuna</span></a>`
      : `<a href="${profileUrl}?utm_source=partner_badge" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:999px;background:#ffffff;border:1px solid #e7e5e4;color:#292524;font-family:sans-serif;font-size:12px;font-weight:600;text-decoration:none;"><span style="color:#d97706;">★</span><span>Partner GentiLuna</span></a>`;

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2400);
  };

  const handleShareInviteWhatsapp = () => {
    const msg = `Ciao! 🎁 In qualità di Partner Ufficiale GentiLuna (${businessName}), vi regalo il -15% di sconto immediato sull'attivazione del vostro spazio matrimonio/evento digitale (con QR Code foto invitati, mappa tavoli e lista regali)!\n\nCodice sconto: ${inviteCode}\nLink diretto già scontato: ${referralUrl}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleCopyBadgeHtml = () => {
    navigator.clipboard.writeText(badgeHtmlSnippet);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2600);
  };

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. CODICE SCONTO PARTNER (-15% SPOSI + PREMIO VIP PRO) */}
      <div className="rounded-3xl bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 text-white p-6 sm:p-7 border border-amber-400/35 shadow-xl flex flex-col justify-between gap-5">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
              <Gift className="w-3.5 h-3.5" />
              Codice Invito Sposi (-15%)
            </span>
            <span className="text-xs text-emerald-400 font-semibold">
              {convertedCount} {convertedCount === 1 ? "coppia attivata" : "coppie attivate"}
            </span>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1.5">
            Regala il -15% alle tue coppie e vinci 1 Anno VIP PRO
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4">
            Condividi il tuo codice personale con sposi o festeggiati: loro ottengono subito il{" "}
            <strong className="text-amber-300">15% di sconto</strong> sui piani GentiLuna, e ogni{" "}
            <strong className="text-white">3 coppie attivate</strong> ricevi{" "}
            <strong className="text-emerald-300">12 mesi di Piano VIP PRO in omaggio!</strong>
          </p>

          {/* BOX CODICE */}
          <div className="bg-white/10 border border-amber-300/35 rounded-2xl p-3.5 flex items-center justify-between gap-3 mb-4">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-widest text-stone-400">
                Il tuo Codice Partner Ufficiale
              </div>
              <div className="font-mono text-base sm:text-lg font-bold text-amber-300 truncate">
                {inviteCode}
              </div>
            </div>
            <Button
              type="button"
              onClick={handleCopyInvite}
              variant="outline"
              className="rounded-xl bg-white/10 hover:bg-white/20 border-white/25 text-white h-10 px-3.5 text-xs font-semibold shrink-0"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Copiato
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" /> Copia Codice
                </>
              )}
            </Button>
          </div>

          {/* BARRA PROGRESSO PREMIO */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-stone-400">
              <span>Progresso premio 1 Anno VIP PRO gratis</span>
              <span className="font-bold text-amber-300">
                {convertedCount > 0 && currentCycleCount === 0 ? 3 : currentCycleCount} / 3 coppie
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden">
              <div
                style={{ width: `${Math.max(8, progressPct)}%` }}
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500"
              />
            </div>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleShareInviteWhatsapp}
          className="w-full h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border-none"
        >
          <MessageCircle className="w-4 h-4 shrink-0" />
          Invia Sconto -15% agli Sposi su WhatsApp
        </Button>
      </div>

      {/* 2. BOLLINO UFFICIALE "PARTNER VERIFICATO" PER IL SITO WEB (SEO & PRESTIGIO) */}
      <div className="rounded-3xl bg-white p-6 sm:p-7 border border-stone-200 shadow-sm flex flex-col justify-between gap-5">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              Bollino Ufficiale Sito Web &amp; SEO
            </span>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-900"
            >
              Vetrina <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-1.5">
            Mostra il Bollino &ldquo;Partner Verificato&rdquo; sul tuo Sito
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
            Incolla questo badge nel footer del tuo sito web (WordPress, Wix, Squarespace, ecc.): aumenta la fiducia delle coppie e potenzia l&apos;indicizzazione Google della tua vetrina{" "}
            <strong className="text-stone-800">{categoryLabel}</strong>.
          </p>

          {/* SELETTORE STILE BOLLINO */}
          <div className="flex items-center gap-2 mb-4">
            {[
              { id: "dark", label: "Nero & Oro" },
              { id: "ivory", label: "Avorio Luxury" },
              { id: "minimal", label: "Compatto" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setBadgeTheme(opt.id as "dark" | "ivory" | "minimal")}
                className={`px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer transition-all ${
                  badgeTheme === opt.id
                    ? "bg-stone-900 text-white border-stone-900"
                    : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* ANTEPRIMA REALE DEL BOLLINO */}
          <div className="p-5 rounded-2xl bg-stone-100/80 border border-stone-200/80 flex items-center justify-center min-h-[76px]">
            {badgeTheme === "dark" && (
              <span className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-stone-950 border border-amber-400/60 text-amber-100 font-serif text-xs sm:text-[13px] shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  <strong className="text-white">{businessName}</strong> • Partner Verificato GentiLuna
                </span>
              </span>
            )}
            {badgeTheme === "ivory" && (
              <span className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#fffbf2] border border-amber-300 text-amber-950 font-serif text-xs sm:text-[13px] shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  <strong>{businessName}</strong> • Partner Ufficiale GentiLuna
                </span>
              </span>
            )}
            {badgeTheme === "minimal" && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-stone-300 text-stone-800 text-xs font-semibold shadow-2xs">
                <span className="text-amber-500">★</span>
                <span>Partner GentiLuna</span>
              </span>
            )}
          </div>
        </div>

        <Button
          type="button"
          onClick={handleCopyBadgeHtml}
          className="w-full h-11 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
        >
          {copiedHtml ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" /> Codice HTML Copiato!
            </>
          ) : (
            <>
              <Code2 className="w-4 h-4 text-amber-300" /> Copia Codice HTML per il tuo Sito
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
