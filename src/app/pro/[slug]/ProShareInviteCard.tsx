"use client";

import { useState } from "react";
import Link from "next/link";
import { QrCode, Share2, Download, Users, Briefcase, MessageCircle, Check, Link2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProShareInviteCardProps {
  slug: string;
  businessName: string;
  categoryLabel: string;
}

export default function ProShareInviteCard({
  slug,
  businessName,
  categoryLabel,
}: ProShareInviteCardProps) {
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);

  const profileUrl = `https://www.gentiluna.com/pro/${slug}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(profileUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsapp = () => {
    const text = `Scopri la vetrina ufficiale di ${businessName} (${categoryLabel}) su GentiLuna: portfolio, servizi e preventivi diretti. ${profileUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  const handleShareEmail = () => {
    const subject = `${businessName} — Vetrina su GentiLuna`;
    const body = `Ciao!\n\nTi condivido il profilo ufficiale di ${businessName} (${categoryLabel}) su GentiLuna:\n${profileUrl}\n\nPuoi vedere portfolio, servizi, recensioni e richiedere un preventivo gratuito.`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleInviteCouplesWhatsapp = () => {
    const text = `Ciao! Organizzate il vostro matrimonio o evento su GentiLuna per raccogliere tutte le foto con QR Code, gestire RSVP, tavoli e vedere la mia vetrina (${businessName}): ${profileUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  const handleInviteColleagueWhatsapp = () => {
    const text = `Ciao! Sto usando GentiLuna PRO per avere una vetrina portfolio ad alta visibilità, consegnare gallerie HD agli sposi e ricevere preventivi a 0% commissioni. Dai un'occhiata alla mia pagina: ${profileUrl} — oppure iscriviti al Founders Club: https://www.gentiluna.com/professionisti#founders`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-300 bg-amber-500/15 border border-amber-400/25 px-3 py-1 rounded-full mb-2">
            <Share2 className="w-3.5 h-3.5" /> Condivisione &amp; Inviti
          </span>
          <h3 className="text-2xl font-serif font-bold text-white">
            Condividi questa Vetrina o Invita su GentiLuna
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed max-w-xl">
            Copia il link da mettere nella bio Instagram, invialo alle coppie su WhatsApp oppure genera il QR Code stampabile per biglietti da visita e fiere.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowQr((s) => !s)}
          className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full transition-colors shrink-0 cursor-pointer"
        >
          <QrCode className="w-4 h-4 text-amber-300" />
          <span>{showQr ? "Nascondi QR Vetrina" : "Mostra QR Vetrina"}</span>
        </button>
      </div>

      {showQr && (
        <div className="bg-white text-stone-900 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5 border border-amber-200 animate-in fade-in">
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 shrink-0">
            <img
              src={qrSrc}
              alt={`QR Code Vetrina ${businessName}`}
              className="w-32 h-32 object-contain"
            />
          </div>
          <div className="text-center sm:text-left space-y-2.5">
            <h4 className="font-serif font-bold text-lg text-stone-900">
              QR Code Ufficiale — {businessName}
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Inquadrando questo codice gli sposi e gli invitati atterrano subito su portfolio, recensioni e richiesta preventivo.
            </p>
            <a
              href={qrSrc}
              download={`QR_GentiLuna_${slug}.png`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2 rounded-full"
            >
              <Download className="w-3.5 h-3.5" /> Scarica QR Code Alta Qualità
            </a>
          </div>
        </div>
      )}

      {/* Share Buttons Row */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleShareWhatsapp}
          className="inline-flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
        >
          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
        </button>

        <button
          type="button"
          onClick={handleShareEmail}
          className="inline-flex items-center gap-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
        >
          <Mail className="w-3.5 h-3.5" /> Email
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Link2 className="w-3.5 h-3.5" />}
          <span>{copied ? "Copiato!" : "Copia Link"}</span>
        </button>
      </div>

      {/* Invite Prompts */}
      <div className="pt-4 border-t border-stone-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleInviteCouplesWhatsapp}
          className="flex items-center justify-between gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-left transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">Invita Sposi su GentiLuna</div>
              <div className="text-[11px] text-stone-400 truncate">Invia la vetrina + spazio evento su WhatsApp</div>
            </div>
          </div>
          <span className="text-xs text-rose-300 font-bold shrink-0">Invia →</span>
        </button>

        <button
          type="button"
          onClick={handleInviteColleagueWhatsapp}
          className="flex items-center justify-between gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-left transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">Invita un Collega del Settore</div>
              <div className="text-[11px] text-stone-400 truncate">Fai scoprire il Founders Club a 0% comm.</div>
            </div>
          </div>
          <span className="text-xs text-amber-300 font-bold shrink-0">Invita →</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-[11px] text-stone-400">
        <span>Sei un Fotografo, Location o Wedding Planner?</span>
        <Link href="/professionisti#founders" className="text-amber-300 hover:text-amber-200 font-bold underline">
          Crea anche tu la tua vetrina PRO →
        </Link>
      </div>
    </div>
  );
}
