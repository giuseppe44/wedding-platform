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
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PARTNER_LOYALTY_FREE_TARGET,
  PARTNER_LOYALTY_HALF_TARGET,
} from "@/lib/partnerReferral";

interface PartnerGrowthToolkitProps {
  slug: string;
  businessName: string;
  categoryLabel: string;
  inviteCode: string;
  convertedCount: number;
  registeredCount?: number;
}

export function PartnerGrowthToolkit({
  slug,
  businessName,
  categoryLabel,
  inviteCode,
  convertedCount,
  registeredCount = 0,
}: PartnerGrowthToolkitProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [badgeTheme, setBadgeTheme] = useState<"dark" | "ivory" | "minimal">("dark");

  const registerUrl = `https://www.gentiluna.com/login?mode=REGISTER&partner=${encodeURIComponent(
    inviteCode
  )}`;
  const referralUrl = `https://www.gentiluna.com/prezzi?partner=${encodeURIComponent(
    inviteCode
  )}`;
  const profileUrl = `https://www.gentiluna.com/pro/${slug}`;

  const unlockedHalf = convertedCount >= PARTNER_LOYALTY_HALF_TARGET;
  const unlockedFree = convertedCount >= PARTNER_LOYALTY_FREE_TARGET;
  const progressPct = Math.min(
    100,
    Math.round((convertedCount / PARTNER_LOYALTY_FREE_TARGET) * 100)
  );

  const badgeHtmlSnippet =
    badgeTheme === "dark"
      ? `<a href="${profileUrl}?utm_source=partner_badge" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:10px;padding:10px 18px;border-radius:999px;background:#0c0a09;border:1px solid rgba(251,191,36,0.55);color:#fef3c7;font-family:Georgia,serif;font-size:13px;text-decoration:none;box-shadow:0 6px 20px rgba(0,0,0,0.18);"><span style="color:#fbbf24;font-size:15px;">✦</span><span><strong style="color:#ffffff;">${businessName}</strong> • Partner Selezionato GentiLuna (${inviteCode})</span></a>`
      : badgeTheme === "ivory"
      ? `<a href="${profileUrl}?utm_source=partner_badge" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:10px;padding:10px 18px;border-radius:999px;background:#fffbf2;border:1px solid #fcd34d;color:#451a03;font-family:Georgia,serif;font-size:13px;text-decoration:none;box-shadow:0 4px 14px rgba(217,119,6,0.12);"><span style="color:#d97706;font-size:15px;">✦</span><span><strong>${businessName}</strong> • Partner Ufficiale GentiLuna (${inviteCode})</span></a>`
      : `<a href="${profileUrl}?utm_source=partner_badge" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:999px;background:#ffffff;border:1px solid #e7e5e4;color:#292524;font-family:sans-serif;font-size:12px;font-weight:600;text-decoration:none;"><span style="color:#d97706;">★</span><span>Partner GentiLuna • ${inviteCode}</span></a>`;

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2400);
  };

  const handleShareInviteWhatsapp = () => {
    const msg = `Ciao! 🎁 In qualità di Partner Selezionato GentiLuna (${businessName}), vi regalo il -15% di sconto immediato sull'attivazione del vostro spazio matrimonio/evento digitale (con QR Code foto invitati, mappa tavoli e lista regali)!\n\nIl mio Codice Partner Ufficiale: ${inviteCode}\nCreate il vostro spazio qui: ${registerUrl}\nOppure vedete i piani già scontati: ${referralUrl}`;
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
      {/* 1. CODICE PARTNER UFFICIALE (F01 / W01...) & FIDELIZZAZIONE ANNUALE -50% / 100% */}
      <div className="rounded-3xl bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 text-white p-6 sm:p-7 border border-amber-400/35 shadow-xl flex flex-col justify-between gap-5">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
              <Gift className="w-3.5 h-3.5" />
              Programma Fidelizzazione Partner
            </span>
            <span className="text-xs text-emerald-400 font-semibold">
              {convertedCount} attivati{registeredCount > 0 ? ` • ${registeredCount} iscritti` : ""}
            </span>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1.5">
            Il tuo Codice {inviteCode}: -15% agli Sposi, Rinnovo fino al 100% Gratis per te
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4">
            Fai iscrivere tutti i tuoi sposi con il tuo codice identificativo{" "}
            <strong className="text-amber-300 font-mono">{inviteCode}</strong>: loro ricevono subito il{" "}
            <strong className="text-white">-15%</strong>, e tu sblocchi a fine anno il{" "}
            <strong className="text-amber-300">-50% con 5 matrimoni</strong> e il{" "}
            <strong className="text-emerald-300">100% di rinnovo GRATUITO con 10 matrimoni!</strong>
          </p>

          {/* BOX CODICE IDENTIFICATIVO */}
          <div className="bg-white/10 border border-amber-300/35 rounded-2xl p-3.5 flex items-center justify-between gap-3 mb-4">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-widest text-stone-400">
                Codice Identificativo Fornitore ({categoryLabel})
              </div>
              <div className="font-mono text-xl sm:text-2xl font-bold text-amber-300 tracking-wider">
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
                  <Copy className="w-3.5 h-3.5 mr-1" /> Copia {inviteCode}
                </>
              )}
            </Button>
          </div>

          {/* BARRA DOPPIO TRAGUARDO ANNUALE (5 = -50% | 10 = 100% GRATIS) */}
          <div className="space-y-2">
            <div className="flex justify-between text-[11px] text-stone-300">
              <span>Traguardi Fedeltà Annuali</span>
              <span className="font-bold text-amber-300">
                {convertedCount} / {PARTNER_LOYALTY_FREE_TARGET} matrimoni
              </span>
            </div>

            <div className="relative w-full h-2.5 rounded-full bg-stone-800 overflow-hidden">
              <div
                style={{ width: `${convertedCount === 0 ? 4 : progressPct}%` }}
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 transition-all duration-500"
              />
              {/* Tacca intermedia dei 5 matrimoni (50%) */}
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-stone-950/80" />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
              <div
                className={`rounded-xl p-2 border flex items-center gap-1.5 ${
                  unlockedHalf
                    ? "bg-amber-400/20 border-amber-400/50 text-amber-200 font-bold"
                    : "bg-white/5 border-white/10 text-stone-400"
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>5 Eventi: -50% Rinnovo {unlockedHalf ? "✓" : ""}</span>
              </div>
              <div
                className={`rounded-xl p-2 border flex items-center gap-1.5 ${
                  unlockedFree
                    ? "bg-emerald-500/20 border-emerald-400/50 text-emerald-200 font-bold"
                    : "bg-white/5 border-white/10 text-stone-400"
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>10 Eventi: 100% Gratis {unlockedFree ? "✓" : ""}</span>
              </div>
            </div>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleShareInviteWhatsapp}
          className="w-full h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border-none"
        >
          <MessageCircle className="w-4 h-4 shrink-0" />
          Invia Codice {inviteCode} (-15%) agli Sposi su WhatsApp
        </Button>
      </div>

      {/* 2. BOLLINO UFFICIALE "PARTNER SELEZIONATO A NUMERO CHIUSO" PER IL SITO WEB */}
      <div className="rounded-3xl bg-white p-6 sm:p-7 border border-stone-200 shadow-sm flex flex-col justify-between gap-5">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              Bollino Selezione Numero Chiuso &amp; SEO
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
            Mostra il Bollino &ldquo;Partner Selezionato&rdquo; sul tuo Sito
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
            Incolla questo badge nel footer del tuo sito web: certifica che fai parte della{" "}
            <strong className="text-stone-900">selezione a Numero Chiuso per provincia</strong> nella categoria{" "}
            <strong className="text-stone-800">{categoryLabel}</strong> e migliora la SEO della tua vetrina.
          </p>

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

          <div className="p-5 rounded-2xl bg-stone-100/80 border border-stone-200/80 flex items-center justify-center min-h-[76px]">
            {badgeTheme === "dark" && (
              <span className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-stone-950 border border-amber-400/60 text-amber-100 font-serif text-xs sm:text-[13px] shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  <strong className="text-white">{businessName}</strong> • Partner Selezionato GentiLuna ({inviteCode})
                </span>
              </span>
            )}
            {badgeTheme === "ivory" && (
              <span className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#fffbf2] border border-amber-300 text-amber-950 font-serif text-xs sm:text-[13px] shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  <strong>{businessName}</strong> • Partner Ufficiale GentiLuna ({inviteCode})
                </span>
              </span>
            )}
            {badgeTheme === "minimal" && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-stone-300 text-stone-800 text-xs font-semibold shadow-2xs">
                <span className="text-amber-500">★</span>
                <span>Partner GentiLuna • {inviteCode}</span>
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
