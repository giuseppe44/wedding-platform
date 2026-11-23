"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, Sparkles, QrCode, Palette, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GentiLunaLogo } from "@/components/GentiLunaLogo";

interface PrintTableCardsClientProps {
  slug: string;
  coupleNames: string;
  formattedDate: string;
  baseUrl: string;
}

export default function PrintTableCardsClient({
  slug,
  coupleNames,
  formattedDate,
  baseUrl,
}: PrintTableCardsClientProps) {
  const [layoutMode, setLayoutMode] = useState<"4xA6" | "2xA5">("4xA6");
  const [theme, setTheme] = useState<"champagne" | "blush" | "noir">("champagne");
  const [qrTarget, setQrTarget] = useState<"upload" | "portal">("upload");
  const [eyebrow, setEyebrow] = useState("Condividi i Tuoi Scatti");
  const [customMessage, setCustomMessage] = useState(
    "Inquadra il QR Code con la fotocamera del tuo telefono e carica in diretta le foto e i video più belli di questa giornata!"
  );

  const targetUrl =
    qrTarget === "upload"
      ? `${baseUrl}/w/${slug}/upload`
      : `${baseUrl}/w/${slug}`;
  const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=700x700&margin=8&data=${encodeURIComponent(
    targetUrl
  )}`;

  const cardsCount = layoutMode === "4xA6" ? 4 : 2;

  const cardThemeClasses =
    theme === "champagne"
      ? {
          outer: "bg-[#fffdf9] text-stone-900 border-amber-300",
          innerBorder: "border-amber-300/70",
          eyebrow: "text-amber-800",
          names: "text-stone-900",
          date: "text-amber-700",
          body: "text-stone-600",
          qrWrap: "bg-white border-amber-200",
          footer: "text-stone-400",
        }
      : theme === "blush"
      ? {
          outer: "bg-[#fff8fa] text-stone-900 border-rose-200",
          innerBorder: "border-rose-300/60",
          eyebrow: "text-rose-700",
          names: "text-stone-900",
          date: "text-rose-600",
          body: "text-stone-600",
          qrWrap: "bg-white border-rose-200",
          footer: "text-rose-400",
        }
      : {
          outer: "bg-stone-950 text-white border-amber-400/60",
          innerBorder: "border-amber-400/40",
          eyebrow: "text-amber-300",
          names: "text-white",
          date: "text-amber-200",
          body: "text-stone-300",
          qrWrap: "bg-white border-amber-300",
          footer: "text-stone-400",
        };

  return (
    <div className="min-h-screen bg-stone-100 print:bg-white py-8 print:py-0 px-4 print:px-0">
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background: #ffffff !important;
          }
        }
      `}</style>

      {/* PANNELLO DI CONTROLLO (NASCOSTO IN STAMPA) */}
      <div className="max-w-5xl mx-auto mb-8 print:hidden space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href={`/couple/${slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-700 hover:text-stone-950 bg-white px-4 py-2 rounded-full border border-stone-200 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Torna allo Spazio Evento
          </Link>

          <Button
            type="button"
            onClick={() => window.print()}
            className="rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold px-7 h-11 shadow-lg flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Stampa o Salva PDF A4
          </Button>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Studio Tipografico Cartoncini QR da Tavolo
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Cartoncini QR Pronti da Stampare — {coupleNames}
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              Personalizza stile e formato, poi clicca <strong>&ldquo;Stampa o Salva PDF A4&rdquo;</strong> per stampare in casa, in ristorante o inviare il PDF alla tua tipografia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* FORMATO */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <LayoutGrid className="w-3.5 h-3.5" /> Formato su Foglio A4
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLayoutMode("4xA6")}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                    layoutMode === "4xA6"
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-stone-50 text-stone-700 border-stone-200"
                  }`}
                >
                  4 Cartoncini A6
                </button>
                <button
                  type="button"
                  onClick={() => setLayoutMode("2xA5")}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                    layoutMode === "2xA5"
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-stone-50 text-stone-700 border-stone-200"
                  }`}
                >
                  2 Grandi A5
                </button>
              </div>
            </div>

            {/* TEMA COLORE */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" /> Stile Luxury
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "champagne", label: "Avorio & Oro" },
                  { id: "blush", label: "Rosa Cipria" },
                  { id: "noir", label: "Nero Maison" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id as "champagne" | "blush" | "noir")}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                      theme === t.id
                        ? "bg-amber-500 text-stone-950 border-amber-500"
                        : "bg-stone-50 text-stone-700 border-stone-200"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* DESTINAZIONE QR */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5" /> Azione QR Code
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setQrTarget("upload");
                    setEyebrow("Condividi i Tuoi Scatti");
                    setCustomMessage(
                      "Inquadra il QR Code con la fotocamera del tuo telefono e carica in diretta le foto e i video più belli di questa giornata!"
                    );
                  }}
                  className={`py-2.5 px-2.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                    qrTarget === "upload"
                      ? "bg-rose-600 text-white border-rose-600"
                      : "bg-stone-50 text-stone-700 border-stone-200"
                  }`}
                >
                  Invio Foto Live
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQrTarget("portal");
                    setEyebrow("Benvenuti al Nostro Evento");
                    setCustomMessage(
                      "Inquadra il QR Code per scoprire il tuo tavolo, il programma della giornata, lasciare una dedica e condividere le tue foto!"
                    );
                  }}
                  className={`py-2.5 px-2.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                    qrTarget === "portal"
                      ? "bg-rose-600 text-white border-rose-600"
                      : "bg-stone-50 text-stone-700 border-stone-200"
                  }`}
                >
                  Sito + Tavoli
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-stone-100">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-500">Titolo sopra i nomi</label>
              <Input value={eyebrow} onChange={(e) => setEyebrow(e.target.value)} />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-stone-500">Testo d&apos;invito sul cartoncino</label>
              <Input value={customMessage} onChange={(e) => setCustomMessage(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* FOGLIO A4 STAMPABILE */}
      <div className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none p-4 sm:p-6 print:p-0 rounded-2xl print:rounded-none">
        <div
          className={
            layoutMode === "4xA6"
              ? "grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-4 print:gap-[6mm]"
              : "grid grid-cols-1 gap-5 print:gap-[8mm]"
          }
        >
          {Array.from({ length: cardsCount }).map((_, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-5 sm:p-6 flex flex-col items-center justify-between text-center break-inside-avoid ${
                layoutMode === "4xA6" ? "min-h-[132mm]" : "min-h-[134mm] sm:flex-row sm:text-left sm:gap-8 print:flex-row print:text-left print:gap-8"
              } ${cardThemeClasses.outer}`}
            >
              <div
                className={`w-full h-full rounded-xl border ${cardThemeClasses.innerBorder} p-5 flex ${
                  layoutMode === "4xA6"
                    ? "flex-col items-center justify-between text-center gap-3"
                    : "flex-col sm:flex-row print:flex-row items-center justify-between gap-6"
                }`}
              >
                <div className={layoutMode === "2xA5" ? "flex-1 space-y-2.5" : "space-y-1.5"}>
                  <div
                    className={`text-[10px] font-bold uppercase tracking-[0.24em] ${cardThemeClasses.eyebrow}`}
                  >
                    ✦ {eyebrow} ✦
                  </div>
                  <h2
                    className={`font-serif font-bold leading-tight ${
                      layoutMode === "4xA6" ? "text-2xl" : "text-3xl"
                    } ${cardThemeClasses.names}`}
                  >
                    {coupleNames}
                  </h2>
                  {formattedDate && (
                    <div
                      className={`text-xs font-serif italic ${cardThemeClasses.date}`}
                    >
                      {formattedDate}
                    </div>
                  )}
                  <p
                    className={`text-xs leading-relaxed max-w-xs mx-auto ${
                      layoutMode === "2xA5" ? "sm:mx-0 print:mx-0 text-sm" : ""
                    } ${cardThemeClasses.body}`}
                  >
                    {customMessage}
                  </p>
                </div>

                <div className="flex flex-col items-center shrink-0 gap-2">
                  <div
                    className={`p-2.5 rounded-2xl border shadow-xs ${cardThemeClasses.qrWrap}`}
                  >
                    <img
                      src={qrImgUrl}
                      alt={`QR Code ${coupleNames}`}
                      className={
                        layoutMode === "4xA6"
                          ? "w-32 h-32 object-contain"
                          : "w-40 h-40 object-contain"
                      }
                    />
                  </div>
                  <div
                    className={`inline-flex items-center gap-1 text-[9px] tracking-widest uppercase font-semibold ${cardThemeClasses.footer}`}
                  >
                    <GentiLunaLogo className="w-3 h-3" />
                    <span>GentiLuna.com • Senza App</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
