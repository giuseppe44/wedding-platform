"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addGuestMessage(weddingId: string, formData: FormData) {
  const guestName = formData.get("guestName") as string;
  const text = formData.get("text") as string;
  
  if (!text || text.trim().length === 0) return { error: "Messaggio vuoto" };

  await prisma.message.create({
    data: {
      weddingId,
      guestName: guestName || "Anonimo",
      text,
      status: "PENDING", // Couples must approve messages to show up? Or maybe they show up immediately depending on wedding setting.
    }
  });

  // Revalidate to show in dashboard, but public page needs approval
  revalidatePath(`/couple/[slug]`);
  return { success: true };
}
