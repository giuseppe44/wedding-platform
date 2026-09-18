"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download, File, Trash2, Plus, Loader2 } from "lucide-react";
import { uploadTravelDocumentAction, deleteTravelDocumentAction } from "@/app/travelActions";

export default function WalletManager({ documents, weddingId, isProOrAdmin }: { documents: any[], weddingId: string, isProOrAdmin: boolean }) {
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const title = formData.get("title") as string;
      if (!title) throw new Error("Inserisci il nome del documento");
      await uploadTravelDocumentAction(weddingId, title, formData);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      alert(err.message || "Errore durante l'upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo documento?")) return;
    setDeletingId(id);
    try {
      await deleteTravelDocumentAction(id);
    } catch (err: any) {
      alert(err.message || "Errore");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {isProOrAdmin && (
        <div className="bg-stone-50 border border-stone-200 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-stone-800 mb-4 font-serif">Carica Nuovo Documento</h3>
          <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-4">
            <Input name="title" placeholder="Nome doc (es. Biglietti Aerei)" required className="bg-white" />
            <Input type="file" name="file" required className="bg-white file:text-stone-700" />
            <Button type="submit" disabled={isUploading} className="shrink-0">
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              Carica
            </Button>
          </form>
        </div>
      )}

      {(!documents || documents.length === 0) ? (
        <div className="text-center py-20 border border-dashed border-stone-200 rounded-2xl">
          <File className="w-16 h-16 text-stone-200 mx-auto mb-4" />
          <p className="text-stone-500 font-medium">Nessun documento caricato.</p>
          <p className="text-stone-400 text-sm mt-2">I biglietti e i voucher appariranno qui.</p>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-serif text-stone-800 mb-6">I tuoi Documenti di Viaggio</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-white border border-stone-200 p-4 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                  <FileText className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-stone-800 truncate">{doc.title}</p>
                  <p className="text-xs text-stone-400">Aggiunto {new Date(doc.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    <Button size="icon" variant="outline" className="rounded-full hover:bg-stone-100" type="button">
                      <Download className="w-4 h-4" />
                    </Button>
                  </a>
                  {isProOrAdmin && (
                    <Button 
                      size="icon" 
                      variant="destructive" 
                      className="rounded-full" 
                      onClick={() => handleDelete(doc.id)}
                      disabled={deletingId === doc.id}
                    >
                      {deletingId === doc.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
