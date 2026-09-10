"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createSystemNotification } from "./notificationActions";

export async function getConversations() {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  
  const isPro = session.role === "PHOTOGRAPHER";

  if (isPro) {
    const profile = await prisma.professionalProfile.findUnique({ where: { userId: session.userId }});
    if (!profile) return [];
    
    return await prisma.conversation.findMany({
      where: { professionalProfileId: profile.id },
      include: {
        timelineItem: true,
        professionalProfile: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      }
    });
  } else {
    // Couple
    return await prisma.conversation.findMany({
      where: {
        timelineItem: {
          OR: [
            { ownerId: session.userId },
            { coupleId: session.userId }
          ]
        }
      },
      include: {
        timelineItem: true,
        professionalProfile: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      }
    });
  }
}

export async function getMessages(conversationId: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      timelineItem: true,
      professionalProfile: true
    }
  });

  if (!conversation) throw new Error("Conversazione non trovata");

  const isCouple = conversation.timelineItem.ownerId === session.userId || conversation.timelineItem.coupleId === session.userId;
  const isPro = conversation.professionalProfile.userId === session.userId;

  if (!isCouple && !isPro) throw new Error("Accesso negato");

  const assignment = await prisma.eventAssignment.findUnique({
    where: {
      timelineItemId_professionalProfileId: {
        timelineItemId: conversation.timelineItemId,
        professionalProfileId: conversation.professionalProfileId
      }
    }
  });

  if (!assignment || assignment.status !== "ACTIVE") {
    throw new Error("L'assegnazione è stata revocata. Impossibile accedere alla conversazione.");
  }

  await prisma.chatMessage.updateMany({
    where: {
      conversationId,
      senderId: { not: session.userId },
      isRead: false
    },
    data: { isRead: true }
  });

  return await prisma.chatMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" }
  });
}

export async function sendMessage(weddingId: string, proId: string, text: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);

  const assignment = await prisma.eventAssignment.findUnique({
    where: {
      timelineItemId_professionalProfileId: {
        timelineItemId: weddingId,
        professionalProfileId: proId
      }
    },
    include: {
      timelineItem: true,
      professionalProfile: true
    }
  });

  if (!assignment || assignment.status !== "ACTIVE") {
    throw new Error("Assegnazione non attiva. Impossibile inviare messaggi.");
  }

  const isCouple = assignment.timelineItem.ownerId === session.userId || assignment.timelineItem.coupleId === session.userId;
  const isPro = assignment.professionalProfile.userId === session.userId;

  if (!isCouple && !isPro) throw new Error("Accesso negato");

  const conversation = await prisma.conversation.upsert({
    where: {
      timelineItemId_professionalProfileId: {
        timelineItemId: weddingId,
        professionalProfileId: proId
      }
    },
    create: {
      timelineItemId: weddingId,
      professionalProfileId: proId
    },
    update: { updatedAt: new Date() }
  });

  const recipientId = isPro ? assignment.timelineItem.ownerId : assignment.professionalProfile.userId;
  await createSystemNotification(recipientId, "Nuovo Messaggio", `Hai ricevuto un nuovo messaggio da ${isPro ? assignment.professionalProfile.businessName : "Sposi"}`, "MESSAGE", `/dashboard/messages/${conversation.id}`);

  await prisma.chatMessage.create({
    data: {
      conversationId: conversation.id,
      senderId: session.userId,
      text
    }
  });

  revalidatePath(`/dashboard/messages`);
}
