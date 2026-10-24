"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, Plus } from "lucide-react";
import { uploadMediaAction } from "@/app/uploadAction";

export default function ChapterUploader({ chapterId, albums }: { chapterId: string, albums: any[] }) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>("");
  const [acceptedRights, setAcceptedRights] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    if (!acceptedRights) {
      alert("Prima di caricare file devi spuntare la casella di conferma dei diritti d'autore, licenze e accettazione dei Termini e Condizioni.");
      e.target.value = "";
      return;
    }
    
    setIsUploading(true);
    const formData = new FormData();
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append("files", e.target.files[i]);
    }
    
    if (selectedAlbumId) {
      formData.append("albumId", selectedAlbumId);
    }

    try {
      await uploadMediaAction(chapterId, formData);
    } catch (error) {
      console.error(error);
      alert("Errore durante il caricamento.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-stone-300 bg-stone-50 rounded-2xl transition-colors hover:bg-stone-100 hover:border-stone-400">
      {isUploading ? (
        <div className="flex flex-col items-center gap-3 text-stone-500">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="font-serif">Caricamento in corso...</p>
        </div>
      ) : (
        <>
          <Camera className="w-10 h-10 text-stone-400 mb-4" />
          <p className="text-stone-600 font-serif text-lg mb-6 text-center max-w-sm">
            Questa storia si riempie dei vostri ricordi. Aggiungi le tue fotografie.
          </p>
          
          {albums.length > 0 && (
            <div className="mb-6 w-full max-w-xs">
              <select 
                value={selectedAlbumId} 
                onChange={(e) => setSelectedAlbumId(e.target.value)}
                className="w-full flex h-10 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-800"
              >
                <option value="">Carica in: Tutte le foto</option>
                {albums.map(a => (
                  <option key={a.id} value={a.id}>Carica in: {a.name}</option>
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
              <Link href="/terms" target="_blank" className="underline font-semibold text-stone-900">Termini e Condizioni</Link>{" "}
              e la{" "}
              <Link href="/privacy" target="_blank" className="underline font-semibold text-stone-900">Privacy Policy</Link>.
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
            <Button disabled={!acceptedRights} className="bg-stone-800 hover:bg-stone-700 text-white rounded-full gap-2 px-8 disabled:opacity-50">
              <Plus className="w-5 h-5" /> Aggiungi fotografie
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
