/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Camera,
  CheckCircle2,
  Loader2,
  UploadCloud,
  X,
  Film,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import { uploadTimelineMediaClient } from "@/lib/clientImageOptimizer";
import Link from "next/link";

export default function UploadClient({
  timelineItemId,
  displayTitle,
  slug,
  buttonColor,
}: {
  timelineItemId: string;
  displayTitle: string;
  displayType: string;
  slug: string;
  buttonColor?: string;
  travelStages?: any[];
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [guestName, setGuestName] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setErrorMsg("");
      setFiles((prev) => {
        const total = [...prev, ...newFiles];
        if (total.length > 25) {
          setErrorMsg("Puoi selezionare fino a 25 foto/video per ogni invio.");
          return total.slice(0, 25);
        }
        return total;
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;
    if (!guestName.trim()) {
      setErrorMsg("Inserisci il tuo nome così gli sposi sapranno chi ha scattato le foto.");
      return;
    }
    if (!acceptedLegal) {
      setErrorMsg("Accetta i Termini e la Privacy Policy per procedere.");
      return;
    }

    setUploading(true);
    setErrorMsg("");

    let uploadedOk = 0;
    let firstError = "";

    // Elaborazione sequenziale 1-ad-1: zero crash memoria su iPhone/Android e zero limite 4.5MB
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      setProgressText(`Invio ${i + 1} di ${files.length}...`);
      const res = await uploadTimelineMediaClient(timelineItemId, f, {
        guestName: guestName.trim(),
        guestMessage: guestMessage.trim() || undefined,
      });
      if (res.success) {
        uploadedOk++;
      } else if (!firstError) {
        firstError = res.error || `Errore su ${f.name}`;
      }
    }

    setUploading(false);
    setProgressText("");

    if (uploadedOk > 0 && !firstError) {
      setSuccess(true);
      setFiles([]);
    } else if (uploadedOk > 0 && firstError) {
      setSuccess(true);
      setFiles([]);
    } else {
      setErrorMsg(firstError || "Si è verificato un problema durante il caricamento. Riprova.");
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md text-center p-8 shadow-2xl border-none">
        <CheckCircle2 className="mx-auto h-20 w-20 text-green-500 mb-6" />
        <h2 className="text-3xl font-bold mb-4 font-serif">Grazie di cuore! ✨</h2>
        <p className="text-stone-600 mb-8 text-lg">
          I tuoi ricordi sono stati caricati con successo nello spazio dell&apos;evento.
        </p>
        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full py-6 text-lg rounded-full"
            onClick={() => setSuccess(false)}
          >
            Carica altre foto
          </Button>
          <Link href={`/w/${slug}`} className="block">
            <Button
              className="w-full py-6 text-lg rounded-full text-white hover:opacity-90"
              style={{ backgroundColor: buttonColor || "#000" }}
            >
              Torna alla pagina evento
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-2xl border-none overflow-hidden">
      <CardHeader className="text-center bg-stone-100 pb-8 pt-8">
        <CardTitle className="text-2xl font-serif leading-snug">
          Condividi foto per
          <br />
          {displayTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleUpload} className="space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-2 text-left">
            <label className="text-sm font-semibold text-stone-700">Il tuo nome (chi sei?)</label>
            <input
              type="text"
              required
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="es. Zio Marco"
              className="w-full border border-stone-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-500"
            />
          </div>

          <div className="space-y-2 text-left">
            <label className="text-sm font-semibold text-stone-700">
              Dedica un messaggio agli sposi (Opzionale)
            </label>
            <textarea
              value={guestMessage}
              onChange={(e) => setGuestMessage(e.target.value)}
              placeholder="Scrivi qui il tuo augurio... apparirà anche sul maxischermo live!"
              className="w-full border border-stone-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-500 min-h-[80px]"
            />
          </div>

          <div
            className="border-2 border-dashed border-stone-300 rounded-2xl p-8 text-center bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex flex-col items-center">
              <UploadCloud className="h-16 w-16 text-stone-400 mb-4" />
              <span className="text-lg font-semibold text-stone-700">Tocca per selezionare</span>
              <span className="text-sm text-stone-500 mt-2">
                Puoi selezionare fino a 25 foto e video insieme
              </span>
            </div>
          </div>

          {files.length > 0 && (
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {files.map((file, i) => (
                <div key={i} className="flex items-center justify-between bg-stone-100 p-3 rounded-lg">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {file.type.startsWith("video") ? (
                      <Film className="text-stone-500 shrink-0" />
                    ) : (
                      <ImageIcon className="text-stone-500 shrink-0" />
                    )}
                    <span className="text-sm truncate w-44">{file.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    disabled={uploading}
                    className="text-stone-400 hover:text-red-500 p-1"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="flex items-start gap-3 p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-left text-xs text-stone-600 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={acceptedLegal}
              onChange={(e) => setAcceptedLegal(e.target.checked)}
              className="mt-1 w-4 h-4 accent-stone-900 shrink-0 cursor-pointer"
            />
            <span className="leading-relaxed">
              Dichiaro che le foto, i video e i testi caricati sono di mia proprietà o che ne possiedo licenza e consenso delle persone ritratte, assumendomi ogni responsabilità e sollevando GentiLuna da qualsiasi pretesa di terzi. Accetto i{" "}
              <Link href="/terms" target="_blank" className="underline font-semibold text-stone-900">
                Termini e Condizioni
              </Link>{" "}
              e la{" "}
              <Link href="/privacy" target="_blank" className="underline font-semibold text-stone-900">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          <Button
            type="submit"
            className="w-full h-14 text-lg rounded-full shadow-lg text-white hover:opacity-90"
            disabled={files.length === 0 || uploading || !acceptedLegal}
            style={{ backgroundColor: buttonColor || "#000" }}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                {progressText || "Caricamento in corso..."}
              </>
            ) : (
              <>
                <Camera className="mr-2 h-6 w-6" />
                Carica {files.length} {files.length === 1 ? "file" : "file"}
              </>
            )}
          </Button>

          <div className="text-center mt-4">
            <Link href={`/w/${slug}`} className="text-stone-500 text-sm hover:underline">
              Annulla e torna indietro
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
