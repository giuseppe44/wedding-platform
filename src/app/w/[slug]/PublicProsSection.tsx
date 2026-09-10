"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Link from "next/link";

export default function PublicProsSection({ assignments }: { assignments: any[] }) {
  const activeAssignments = assignments.filter(a => a.status === "ACTIVE");
  
  if (activeAssignments.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 border-t border-stone-200">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-serif text-stone-800 mb-4">Il nostro Team</h2>
        <p className="text-stone-600 max-w-2xl mx-auto">
          I professionisti che hanno reso possibile questo giorno indimenticabile.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
        {activeAssignments.map(a => {
          const p = a.professionalProfile;
          if (!p) return null;
          return (
            <Link key={a.id} href={`/pro/${p.slug}`} target="_blank" className="block group">
              <Card className="border border-stone-200 shadow-sm hover:shadow-md transition-shadow h-full">
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  {p.logoUrl ? (
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border border-stone-100 group-hover:ring-2 ring-stone-300 transition-all">
                      <img src={p.logoUrl} alt={p.businessName} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4 font-serif text-2xl group-hover:ring-2 ring-stone-300 transition-all border border-stone-200">
                      {p.businessName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  
                  <h3 className="text-lg font-serif text-stone-800 mb-1 group-hover:text-stone-600 transition-colors">{p.businessName}</h3>
                  <p className="text-stone-500 text-sm">{a.role || p.category}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
