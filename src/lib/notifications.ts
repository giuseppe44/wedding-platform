import { prisma } from "@/lib/prisma";

/**
 * Helper esclusivamente server-side (NON esposto come `"use server"` endpoint HTTP!)
 * per creare notifiche di sistema senza consentire iniezioni da chiamate esterne non autenticate.
 */
export async function createSystemNotification(
  userId: string,
  title: string,
  message: string,
  type: string = "INFO",
  link?: string
) {
  await prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
      link,
    },
  });
}
