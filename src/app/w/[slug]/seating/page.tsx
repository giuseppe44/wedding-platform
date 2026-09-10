import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { verifyTimelineAccess } from "@/lib/accessControl";
import SeatingSearchClient from "./SeatingSearchClient";

export default async function GuestSeatingPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { slug } = await params;
  const resolvedParams = await searchParams;
  const token = resolvedParams?.token;

  const wedding = await prisma.timelineItem.findUnique({
    where: { slug: slug },
  });

  if (!wedding) notFound();

  // Seating requires authorization
  let hasAccess = await verifyTimelineAccess(wedding, "VIEW_PUBLIC");
  
  if (!hasAccess && token) {
    const guest = await prisma.guest.findFirst({
      where: { timelineItemId: wedding.id, token: String(token), hasAccess: true }
    });
    if (guest) {
      hasAccess = true;
    }
  }

  if (!hasAccess) {
    redirect(`/w/${slug}`);
  }

  return (
    <div className="min-h-screen bg-stone-50 py-16 px-4">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-serif text-stone-800 mb-4">Trova il tuo Tavolo</h1>
        <p className="text-stone-600">Inserisci il tuo nome e cognome per scoprire dove sei seduto al ricevimento di {wedding.brideName} e {wedding.groomName}.</p>
      </div>

      <SeatingSearchClient timelineItemId={wedding.id} />
    </div>
  );
}
