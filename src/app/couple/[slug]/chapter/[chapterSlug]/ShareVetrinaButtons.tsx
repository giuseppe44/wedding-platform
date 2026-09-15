"use client";

import { Button } from "@/components/ui/button";
import { Link2, Mail, MessageCircle } from "lucide-react";

export default function ShareVetrinaButtons({ slug }: { slug: string }) {
  const url = typeof window !== 'undefined' ? `${window.location.origin}/w/${slug}` : `https://ecos.com/w/${slug}`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    alert("Link copiato negli appunti!");
  };

  const handleWhatsapp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Guarda la nostra Vetrina su ecos.com! Troverai tutte le info e potrai caricare le tue foto: ${url}`)}`, '_blank');
  };

  const handleEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent("La nostra Vetrina su ecos.com")}&body=${encodeURIComponent(`Guarda la nostra Vetrina su ecos.com! Troverai tutte le info e potrai caricare le tue foto:\n\n${url}`)}`);
  };

  return (
    <div className="flex items-center gap-2 border-l border-stone-300 pl-4 ml-2">
      <span className="text-xs text-stone-500 uppercase tracking-wider font-bold hidden sm:block mr-2">Condividi:</span>
      <Button type="button" variant="outline" size="icon" className="rounded-full text-stone-600 hover:text-stone-900 border-stone-300 bg-white shadow-sm" onClick={handleCopy} title="Copia Link">
        <Link2 className="w-4 h-4" />
      </Button>
      <Button type="button" variant="outline" size="icon" className="rounded-full text-emerald-600 hover:text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 shadow-sm" onClick={handleWhatsapp} title="Invia su WhatsApp">
        <MessageCircle className="w-4 h-4" />
      </Button>
      <Button type="button" variant="outline" size="icon" className="rounded-full text-blue-600 hover:text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100 shadow-sm" onClick={handleEmail} title="Invia via Email">
        <Mail className="w-4 h-4" />
      </Button>
    </div>
  );
}
