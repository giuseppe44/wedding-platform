import { prisma } from "@/lib/prisma";
import { verifyTimelineAccess } from "@/lib/accessControl";
import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CHAPTER_TYPES: Record<string, string> = {
  "WEDDING": "Matrimonio",
  "ANNIVERSARY": "Anniversario",
  "TRAVEL": "Viaggio",
  "BIRTH": "Nascita",
  "BAPTISM": "Battesimo",
  "BIRTHDAY": "Compleanno",
  "FAMILY": "Famiglia",
  "MEMORY": "Ricordo",
  "CUSTOM": "Altro"
};

export default async function TimelineSection({ familyId, currentChapterId }: { familyId: string | null, currentChapterId: string }) {
  if (!familyId) return null;

  const allChapters = await prisma.timelineItem.findMany({
    where: { familyId },
    orderBy: { date: "asc" }
  });

  if (allChapters.length <= 1) return null;

  // Filter based on authorization
  const authorizedChapters = [];
  for (const chapter of allChapters) {
    const hasAccess = await verifyTimelineAccess(chapter, "VIEW_PUBLIC");
    if (hasAccess) {
      authorizedChapters.push(chapter);
    }
  }

  // If only one chapter is visible (the current one), don't show the timeline section
  if (authorizedChapters.length <= 1) return null;

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 border-t border-stone-200">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-serif text-stone-800 mb-4">La Nostra Storia</h2>
        <p className="text-stone-600 max-w-2xl mx-auto">
          Scopri i capitoli della nostra vita.
        </p>
      </div>

      <div className="relative border-l-2 border-stone-200 ml-4 md:ml-8 pl-8 md:pl-12 pb-8 space-y-12">
        {authorizedChapters.map((chapter, index) => {
          const isCurrent = chapter.id === currentChapterId;
          const displayTitle = chapter.type === "WEDDING" ? `${chapter.brideName} & ${chapter.groomName}` : (chapter.title || "Capitolo senza titolo");
          const displayType = CHAPTER_TYPES[chapter.type] || "Ricordo";
          const nodeNumber = index + 1;

          return (
            <div key={chapter.id} className="relative group">
              <div className={`absolute -left-[41px] md:-left-[57px] flex items-center justify-center w-8 h-8 rounded-full border-4 border-[#faf9f8] ${isCurrent ? 'bg-stone-800 text-white' : 'bg-white border-stone-300 text-stone-400'} text-sm font-serif z-10 shadow-sm transition-transform group-hover:scale-110`}>
                {nodeNumber}
              </div>
              
              <div className={`bg-white rounded-2xl shadow-sm border ${isCurrent ? 'border-stone-800 ring-1 ring-stone-800' : 'border-stone-200'} overflow-hidden hover:shadow-md transition-shadow`}>
                <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                  {chapter.coverImage && (
                    <div className="absolute inset-0 w-full h-full opacity-[0.10] pointer-events-none transition-opacity group-hover:opacity-20">
                      <img src={chapter.coverImage} className="w-full h-full object-cover" alt="" />
                    </div>
                  )}
                  <div className="relative z-10 flex-1">
                     <div className="text-xs font-bold tracking-widest text-stone-500 mb-2 uppercase">Capitolo {nodeNumber}: {displayType}</div>
                     <h3 className="text-2xl font-serif text-stone-800 mb-2">{displayTitle}</h3>
                     {chapter.date && <p className="text-stone-600 flex items-center gap-2 font-medium text-sm"><Calendar className="w-4 h-4"/> {new Date(chapter.date).toLocaleDateString('it-IT')}</p>}
                  </div>
                  
                  {!isCurrent && (
                    <div className="relative z-10 shrink-0 mt-4 md:mt-0">
                      <Link href={`/w/${chapter.slug}`}>
                        <Button variant="outline" className="border-stone-300 hover:bg-stone-100 text-stone-800 gap-2 rounded-full px-6">
                          Apri <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
