"use client";

import { Printer, Download, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface RestaurantGuestRow {
  id: string;
  name: string;
  surname: string;
  tableId: string;
  tableName: string;
  isAttending: boolean | null;
  allergies: string[];
  dietNotes: string;
}

interface RestaurantPortalClientProps {
  coupleNames: string;
  guests: RestaurantGuestRow[];
}

export default function RestaurantPortalClient({
  coupleNames,
  guests,
}: RestaurantPortalClientProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    const header = ["Nome", "Cognome", "Tavolo", "Stato RSVP", "Allergie", "Note Alimentari"];
    const rows = guests.map((g) => [
      g.name,
      g.surname,
      g.tableName,
      g.isAttending === true ? "Confermato" : g.isAttending === false ? "Rifiutato" : "In Attesa",
      g.allergies.join(" / "),
      g.dietNotes,
    ]);

    const escapeCell = (v: string) => `"${String(v || "").replace(/"/g, '""')}"`;
    const csvContent =
      "\uFEFF" +
      [header.map(escapeCell).join(";"), ...rows.map((r) => r.map(escapeCell).join(";"))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Tavoli_Intolleranze_${coupleNames.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRecommendWhatsapp = () => {
    const text = `Ciao! Sto consultando in diretta i tavoli e le intolleranze del matrimonio di ${coupleNames} su GentiLuna. Uno strumento comodissimo per ristoranti, location, wedding planner e fotografi: https://www.gentiluna.com/professionisti`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5 print:hidden">
      <Button
        type="button"
        onClick={handlePrint}
        className="rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold gap-2 px-4 h-10 cursor-pointer"
      >
        <Printer className="w-4 h-4" /> Stampa / Salva PDF Cucina &amp; Sala
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={handleDownloadCsv}
        className="rounded-full border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs sm:text-sm font-semibold gap-2 px-4 h-10 cursor-pointer"
      >
        <Download className="w-4 h-4 text-emerald-600" /> Esporta Excel (CSV)
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={handleRecommendWhatsapp}
        className="rounded-full border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-semibold gap-2 px-4 h-10 cursor-pointer"
      >
        <MessageCircle className="w-4 h-4" /> Consiglia ad altri Sposi o Colleghi
      </Button>
    </div>
  );
}
