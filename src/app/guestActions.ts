"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createSystemNotification } from "./notificationActions";
import { getSession } from "@/lib/auth";

export async function addGuestMessage(timelineItemId: string, formData: FormData) {
  const guestName = formData.get("guestName") as string;
  const text = formData.get("text") as string;
  
  if (!text || text.trim().length === 0) return { error: "Messaggio vuoto" };

  const chapter = await prisma.timelineItem.findUnique({ where: { id: timelineItemId } });
  if (chapter?.visibility === "PRIVATE" && chapter?.type !== "WEDDING") {
    const session = await getSession();
    if (!session || (session.role !== "PHOTOGRAPHER" && session.role !== "COUPLE")) {
      throw new Error("Non autorizzato");
    }
  }

  await prisma.message.create({
    data: {
      timelineItemId,
      guestName: guestName || "Anonimo",
      text,
      status: "PENDING", // Couples must approve messages to show up? Or maybe they show up immediately depending on wedding setting.
    }
  });

  // Revalidate to show in dashboard, but public page needs approval
  revalidatePath(`/couple/[slug]`);
  return { success: true };
}
