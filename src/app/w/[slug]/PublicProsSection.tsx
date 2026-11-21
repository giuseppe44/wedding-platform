/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react/no-unescaped-entities */
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

const CATEGORY_IT: Record<string, string> = {
  PHOTOGRAPHER: "Fotografo",
  VIDEOMAKER: "Videomaker",
  WEDDING_PLANNER: "Wedding Planner",
  DJ: "DJ",
  MUSICIAN: "Musicista / Band",
  LOCATION: "Location",
  CATERING: "Catering / Ristorante",
  FLORIST: "Fiorista",
  MAKEUP_ARTIST: "Make-up Artist",
  HAIR_STYLIST: "Hair Stylist",
  OTHER: "Professionista Eventi",
};

function resolveLogo(raw?: string | null) {
  if (!raw) return "";
  if (raw.startsWith("uploads/pro-") || raw.includes("/object/public/wedding-media/uploads/pro-")) {
    return `/api/media/pro?path=${encodeURIComponent(raw)}`;
  }
  return raw;
}

export default function PublicProsSection({ assignments }: { assignments: any[] }) {
  const activeAssignments = assignments.filter(a => a.status === "ACTIVE");
  
  if (activeAssignments.length === 0) return null;

  return (
    <div className="max-w-5xl mx-auto py-16 px-4 border-t border-stone-200">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full mb-3">
          <ShieldCheck className="w-3.5 h-3.5" /> Partner Ufficiali dell&apos;Evento
        </span>
        <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-3">Il Nostro Team di Professionisti</h2>
        <p className="text-stone-600 max-w-2xl mx-auto font-light">
          I fornitori che hanno contribuito a rendere unico questo evento. Visita la loro vetrina su GentiLuna per vedere il portfolio o richiedere un preventivo per il tuo prossimo evento.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
        {activeAssignments.map(a => {
          const p = a.professionalProfile;
          if (!p) return null;
          const img = resolveLogo(p.profileImage || p.logoUrl);
          return (
            <Link key={a.id} href={`/pro/${p.slug}`} target="_blank" className="block group">
              <Card className="border border-stone-200/80 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 h-full rounded-3xl overflow-hidden bg-white group-hover:-translate-y-1">
                <CardContent className="p-6 flex flex-col items-center text-center h-full justify-between gap-4">
                  <div className="flex flex-col items-center">
                    {img ? (
                      <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-amber-200 shadow-md group-hover:scale-105 transition-transform">
                        <img src={img} alt={p.businessName} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-stone-900 flex items-center justify-center text-amber-300 mb-4 font-serif text-3xl border-2 border-amber-200 shadow-md">
                        {p.businessName.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 mb-1">
                      {a.role || CATEGORY_IT[p.category] || p.category}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-stone-900 group-hover:text-rose-600 transition-colors">
                      {p.businessName}
                    </h3>
                    {p.serviceArea && (
                      <p className="text-xs text-stone-400 mt-1">{p.serviceArea}</p>
                    )}
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-800 bg-stone-100 group-hover:bg-stone-900 group-hover:text-white px-4 py-2 rounded-full transition-colors">
                    Vedi Vetrina &amp; Preventivo <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
