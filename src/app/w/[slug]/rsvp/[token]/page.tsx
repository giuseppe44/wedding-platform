import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import RSVPClient from "./RSVPClient";

export default async function RSVPPage({ params }: { params: { slug: string, token: string } }) {
  const wedding = await prisma.timelineItem.findUnique({
    where: { slug: params.slug }
  });

  if (!wedding) notFound();

  const guest = await prisma.guest.findFirst({
    where: { timelineItemId: wedding.id, token: params.token }
  });

  if (!guest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <h1 className="text-2xl font-serif text-rose-500 mb-4">Link non valido</h1>
          <p className="text-stone-600">Questo link di conferma non e' valido o e' scaduto. Contatta gli sposi per ricevere un nuovo invito.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 flex flex-col items-center justify-center">
      <RSVPClient wedding={wedding} guest={guest} />
    </div>
  );
}
