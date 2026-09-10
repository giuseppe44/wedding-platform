"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  return await prisma.notification.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" }
  });
}

export async function markNotificationAsRead(id: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  const notification = await prisma.notification.findUnique({ where: { id } });
  
  if (notification?.userId === session.userId) {
    await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
    revalidatePath("/dashboard"); // Or wherever notifications are shown
  }
}

// Internal helper for system events
export async function createSystemNotification(userId: string, title: string, message: string, type: string = "INFO", link?: string) {
  await prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
      link
    }
  });
}
