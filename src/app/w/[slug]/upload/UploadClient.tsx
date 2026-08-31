"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, CheckCircle2, Loader2, UploadCloud, X, Film, Image as ImageIcon } from "lucide-react";
import { uploadMediaAction } from "@/app/uploadAction";
import Link from "next/link";

export default function UploadClient({ weddingId, names, slug, buttonColor }: { weddingId: string, names: string, slug: string, buttonColor?: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      
      const result = await uploadMediaAction(weddingId, formData);
      if (result.success) {
        setSuccess(true);
        setFiles([]);
      }
    } catch (error) {
      console.error("Errore durante l'upload", error);
      alert("C'è stato un problema durante l'upload. Riprova con file più piccoli o meno file alla volta.");
    } finally {
      setUploading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md text-center p-8 shadow-2xl border-none">
        <CheckCircle2 className="mx-auto h-20 w-20 text-green-500 mb-6" />
        <h2 className="text-3xl font-bold mb-4">Grazie! ❤️</h2>
        <p className="text-stone-600 mb-8 text-lg">
          I tuoi ricordi sono stati caricati con successo.
        </p>
        <div className="space-y-4">
          <Button variant="outline" className="w-full py-6 text-lg rounded-full" onClick={() => setSuccess(false)}>
            Carica altre foto
          </Button>
          <Link href={`/w/${slug}`} className="block">
            <Button className="w-full py-6 text-lg rounded-full" style={{ backgroundColor: buttonColor || '#000' }}>
              Torna al Matrimonio
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-2xl border-none overflow-hidden">
      <CardHeader className="text-center bg-stone-100 pb-8 pt-8">
        <CardTitle className="text-2xl font-serif leading-snug">Condividi foto per<br/>{names}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleUpload} className="space-y-6">
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
                Puoi selezionare più foto e video insieme
              </span>
            </div>
          </div>

          {files.length > 0 && (
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {files.map((file, i) => (
                <div key={i} className="flex items-center justify-between bg-stone-100 p-3 rounded-lg">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {file.type.startsWith('video') ? <Film className="text-stone-500 shrink-0" /> : <ImageIcon className="text-stone-500 shrink-0" />}
                    <span className="text-sm truncate w-40">{file.name}</span>
                  </div>
                  <button type="button" onClick={() => removeFile(i)} className="text-stone-400 hover:text-red-500 p-1">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full h-14 text-lg rounded-full shadow-lg" 
            disabled={files.length === 0 || uploading}
            style={{ backgroundColor: buttonColor || '#000' }}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Caricamento in corso...
              </>
            ) : (
              <>
                <Camera className="mr-2 h-6 w-6" />
                Carica {files.length} {files.length === 1 ? 'file' : 'file'}
              </>
            )}
          </Button>
          
          <div className="text-center mt-4">
             <Link href={`/w/${slug}`} className="text-stone-500 text-sm hover:underline">Annulla e torna indietro</Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
