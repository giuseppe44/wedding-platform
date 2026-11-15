"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { verifyTimelineAccess } from "@/lib/accessControl";

export async function addGuestMessage(timelineItemId: string, formData: FormData) {
  const guestName = (formData.get("guestName") as string)?.trim().slice(0, 120);
  const text = (formData.get("text") as string)?.trim().slice(0, 2000);

  if (!text || text.length === 0) return { error: "Messaggio vuoto" };

  const chapter = await prisma.timelineItem.findUnique({ where: { id: timelineItemId } });
  if (!chapter || !chapter.showGuestbook) {
    throw new Error("Non autorizzato");
  }

  const hasAccess = await verifyTimelineAccess(chapter, "VIEW_PUBLIC");
  if (!hasAccess) {
    throw new Error("Non autorizzato");
  }

  await prisma.message.create({
    data: {
      timelineItemId,
      guestName: guestName || "Anonimo",
      text,
      status: "PENDING",
    },
  });

  revalidatePath(`/couple/[slug]`);
  return { success: true };
}
