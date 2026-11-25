"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Camera, CheckCircle2, Loader2, Plus, AlertCircle } from "lucide-react";
import { uploadTimelineMediaClient } from "@/lib/clientImageOptimizer";

export default function ChapterUploader({
  chapterId,
  albums,
}: {
  chapterId: string;
  albums: any[];
}) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>("");
  const [acceptedRights, setAcceptedRights] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    if (selected.length === 0) return;

    if (!acceptedRights) {
      setStatusMessage({
        type: "error",
        text: "Spunta prima la casella di conferma dei diritti d'autore e accettazione dei Termini.",
      });
      e.target.value = "";
      return;
    }

    setIsUploading(true);
    setStatusMessage(null);

    let okCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < selected.length; i++) {
      const file = selected[i];
      setProgressText(`Caricamento ${i + 1} di ${selected.length} (${file.name})...`);
      const res = await uploadTimelineMediaClient(chapterId, file, {
        albumId: selectedAlbumId || undefined,
        highResPro: true,
      });
      if (res.success) {
        okCount++;
      } else {
        errors.push(`${file.name}: ${res.error || "errore"}`);
      }
    }

    setIsUploading(false);
    setProgressText("");
    e.target.value = "";

    if (okCount > 0) {
      router.refresh();
    }

    if (errors.length === 0) {
      setStatusMessage({
        type: "success",
        text: `${okCount} ${okCount === 1 ? "file caricato" : "file caricati"} in alta qualità con successo!`,
      });
    } else {
      setStatusMessage({
        type: "error",
        text:
          okCount > 0
            ? `Caricati ${okCount} file. Non riusciti (${errors.length}): ${errors[0]}`
            : `Caricamento non riuscito: ${errors[0]}`,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-stone-300 bg-stone-50 rounded-2xl transition-colors hover:bg-stone-100 hover:border-stone-400">
      {isUploading ? (
        <div className="flex flex-col items-center gap-3 text-stone-700 py-4">
          <Loader2 className="w-9 h-9 animate-spin text-amber-600" />
          <p className="font-serif text-base font-semibold">{progressText || "Ottimizzazione HD e caricamento..."}</p>
          <p className="text-xs text-stone-500">
            Non chiudere la pagina: stiamo caricando gli scatti uno alla volta senza perdita di nitidezza.
          </p>
        </div>
      ) : (
        <>
          <Camera className="w-10 h-10 text-stone-400 mb-4" />
          <p className="text-stone-600 font-serif text-lg mb-2 text-center max-w-md">
            Questa storia si riempie dei vostri ricordi. Aggiungi fotografie, video o brani audio.
          </p>
          <p className="text-xs text-stone-500 mb-6 text-center max-w-md">
            Supporta caricamento multiplo anche di file pesanti ad alta risoluzione (fino a 40 MB per foto e 100 MB per video).
          </p>

          {statusMessage && (
            <div
              className={`mb-5 w-full max-w-md rounded-xl p-3.5 text-xs sm:text-sm flex items-start gap-2.5 border ${
                statusMessage.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {albums.length > 0 && (
            <div className="mb-6 w-full max-w-xs">
              <select
                value={selectedAlbumId}
                onChange={(e) => setSelectedAlbumId(e.target.value)}
                className="w-full flex h-10 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-800"
              >
                <option value="">Carica in: Tutte le foto</option>
                {albums.map((a) => (
                  <option key={a.id} value={a.id}>
                    Carica in: {a.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <label className="flex items-start gap-2.5 max-w-md mb-5 text-xs text-stone-600 cursor-pointer bg-white p-3 rounded-xl border border-stone-200">
            <input
              type="checkbox"
              checked={acceptedRights}
              onChange={(e) => setAcceptedRights(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-stone-900 shrink-0 cursor-pointer"
            />
            <span className="leading-relaxed">
              Confermo sotto la mia esclusiva responsabilità di essere proprietario o avere regolare licenza d&apos;uso e consenso per tutte le foto, video, brani audio e file caricati, accettando i{" "}
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

          <div className="relative">
            <input
              type="file"
              multiple
              accept="image/*,video/*,audio/*"
              onChange={handleUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading || !acceptedRights}
            />
            <Button
              disabled={!acceptedRights}
              className="bg-stone-800 hover:bg-stone-700 text-white rounded-full gap-2 px-8 disabled:opacity-50"
            >
              <Plus className="w-5 h-5" /> Aggiungi fotografie / media
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
