import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import UploadClient from "./UploadClient";

export default async function UploadPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const wedding = await prisma.timelineItem.findUnique({
    where: { slug: slug },
    select: { id: true, brideName: true, groomName: true, title: true, slug: true, themeColor: true, visibility: true, type: true }
  });

  if (!wedding) {
    notFound();
  }

  if (wedding.visibility === "PRIVATE") {
    const session = await getSession();
    if (!session || (session.role !== "PHOTOGRAPHER" && session.role !== "COUPLE")) {
      notFound();
    }
  }

  const CHAPTER_TYPES: Record<string, { type: string, authors: string }> = {
    "WEDDING": { type: "Il nostro matrimonio", authors: "gli sposi" },
    "ANNIVERSARY": { type: "Anniversario", authors: "la coppia" },
    "TRAVEL": { type: "Il nostro viaggio", authors: "la coppia" },
    "BIRTH": { type: "Una nuova vita", authors: "la famiglia" },
    "BAPTISM": { type: "Battesimo", authors: "la famiglia" },
    "BIRTHDAY": { type: "Compleanno", authors: "il festeggiato" },
    "FAMILY": { type: "La nostra famiglia", authors: "la famiglia" },
    "MEMORY": { type: "Un ricordo", authors: "la famiglia" },
    "CUSTOM": { type: "La nostra storia", authors: "l'autore" }
  };

  const config = CHAPTER_TYPES[wedding.type] || CHAPTER_TYPES["CUSTOM"];
  const displayTitle = wedding.type === "WEDDING" 
    ? `${wedding.brideName} & ${wedding.groomName}` 
    : (wedding.title || config.type);

  return (
    <div className="min-h-screen bg-stone-50 p-4 flex items-center justify-center">
      <UploadClient timelineItemId={wedding.id} displayTitle={displayTitle} displayType={config.type} slug={wedding.slug} buttonColor={wedding.themeColor || undefined} />
    </div>
  );
}
