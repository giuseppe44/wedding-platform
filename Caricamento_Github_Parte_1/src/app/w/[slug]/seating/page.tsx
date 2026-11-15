/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react/no-unescaped-entities */
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { verifyTimelineAccess } from "@/lib/accessControl";
import SeatingVisualizer from "@/app/couple/[slug]/chapter/[chapterSlug]/SeatingVisualizer";

export default async function GuestSeatingPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { slug } = await params;
  const resolvedParams = await searchParams;
  const token = resolvedParams?.token;

  const wedding = await prisma.timelineItem.findUnique({
    where: { slug: slug },
  });

  if (!wedding || !wedding.showSeating) notFound();

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
    redirect(/w/ + slug);
  }

  const tables = await prisma.table.findMany({
    where: { timelineItemId: wedding.id }
  });

  // Seleziona esclusivamente nome, cognome e tavolo: MAI esporre token RSVP, email, telefono o note cliniche/allergie nel tableau pubblico
  const guests = await prisma.guest.findMany({
    where: { timelineItemId: wedding.id, tableId: { not: null } },
    select: {
      id: true,
      name: true,
      surname: true,
      tableId: true,
      category: true,
    },
  });

  return (
    <div className="min-h-screen bg-stone-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-stone-800 mb-4">Tableau dei Tavoli</h1>
          <p className="text-stone-600">Scopri la disposizione dei tavoli per il ricevimento di {wedding.brideName} e {wedding.groomName}.</p>
        </div>

        <SeatingVisualizer tables={tables} guests={guests} title={`Ricevimento di ${wedding.brideName} e ${wedding.groomName}`} />
      </div>
    </div>
  );
}
