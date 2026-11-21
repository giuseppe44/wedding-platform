"use client";

import { useState } from "react";
import { Check, Link2, Mail, MessageCircle, Share2 } from "lucide-react";

interface ShareChapterButtonsProps {
  urlPath: string; // es: /w/paolo-e-tina-nozze/chapter/paolo-e-tina-nozze
  title: string;   // es: "Il Matrimonio di Paolo & Tina"
  compact?: boolean;
  variant?: "light" | "dark";
  label?: string;
}

export default function ShareChapterButtons({
  urlPath,
  title,
  compact = false,
  variant = "light",
  label = "Condividi capitolo:",
}: ShareChapterButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getFullUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}${urlPath}`;
    }
    return `https://www.gentiluna.com${urlPath}`;
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = getFullUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsapp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = getFullUrl();
    const text = `Scopri "${title}" su GentiLuna! Qui trovi tutti i dettagli, le foto e i ricordi dell'evento: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  const handleEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = getFullUrl();
    const subject = `${title} — GentiLuna`;
    const body = `Ciao!\n\nTi condivido "${title}" su GentiLuna, dove puoi trovare tutti i dettagli, le foto e i ricordi dell'evento:\n\n${url}\n\nA presto!`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const isDark = variant === "dark";

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${compact ? "pt-3 mt-3 border-t border-stone-200/80" : ""}`}
      onClick={(e) => e.stopPropagation()}
    >
      {label && (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider mr-1 ${
            isDark ? "text-stone-300" : "text-stone-500"
          }`}
        >
          <Share2 className="w-3 h-3" />
          {label}
        </span>
      )}

      <button
        type="button"
        onClick={handleWhatsapp}
        title="Condividi su WhatsApp"
        className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-colors cursor-pointer ${
          compact ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-xs"
        } ${
          isDark
            ? "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/30"
            : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
        }`}
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span>WhatsApp</span>
      </button>

      <button
        type="button"
        onClick={handleEmail}
        title="Condividi via Email"
        className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-colors cursor-pointer ${
          compact ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-xs"
        } ${
          isDark
            ? "bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-400/30"
            : "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
        }`}
      >
        <Mail className="w-3.5 h-3.5" />
        <span>Email</span>
      </button>

      <button
        type="button"
        onClick={handleCopy}
        title="Copia link"
        className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-colors cursor-pointer ${
          compact ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-xs"
        } ${
          copied
            ? "bg-stone-900 text-white border border-stone-900"
            : isDark
            ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
            : "bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300"
        }`}
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Link2 className="w-3.5 h-3.5" />}
        <span>{copied ? "Copiato!" : "Copia Link"}</span>
      </button>
    </div>
  );
}
