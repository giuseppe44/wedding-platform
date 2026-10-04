"use server";
import { prisma } from "@/lib/prisma";
import { stringifyDietary } from "@/lib/dietary";
import { revalidatePath } from "next/cache";

export async function updateGuestRSVP(weddingId: string, token: string, isAttending: boolean | null, allergies: string[], notes: string) {
  // Security: only update if token matches exactly.
  const guest = await prisma.guest.findFirst({
    where: { timelineItemId: weddingId, token }
  });

  if (!guest) throw new Error("Utente non trovato o token non valido");

  const dietaryString = stringifyDietary({ allergies, notes });

  await prisma.guest.update({
    where: { id: guest.id },
    data: { 
      isAttending, 
      dietaryNotes: dietaryString 
    }
  });

  revalidatePath(`/couple/${guest.timelineItemId}`); // or wherever they manage guests
}
