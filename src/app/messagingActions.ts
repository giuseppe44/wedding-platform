"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth, getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createSystemNotification } from "@/lib/notifications";

export async function getConversations() {
  const session = await getSession();
  if (!session || !["PHOTOGRAPHER", "COUPLE", "ADMIN"].includes(session.role)) {
    return [];
  }

  try {
    if (session.role === "ADMIN") {
      return await prisma.conversation.findMany({
        orderBy: { updatedAt: "desc" },
        take: 50,
        include: {
          timelineItem: true,
          professionalProfile: true,
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });
    }

    if (session.role === "PHOTOGRAPHER") {
      const profiles = await prisma.professionalProfile.findMany({
        where: {
          OR: [{ userId: session.userId }, { parentUserId: session.userId }],
        },
        select: { id: true },
      });
      if (profiles.length === 0) return [];
      const profileIds = profiles.map((p) => p.id);

      return await prisma.conversation.findMany({
        where: { professionalProfileId: { in: profileIds } },
        orderBy: { updatedAt: "desc" },
        include: {
          timelineItem: true,
          professionalProfile: true,
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });
    }

    return await prisma.conversation.findMany({
      where: {
        timelineItem: {
          OR: [{ ownerId: session.userId }, { coupleId: session.userId }],
        },
      },
      orderBy: { updatedAt: "desc" },
      include: {
        timelineItem: true,
        professionalProfile: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });
  } catch (err) {
    console.error("getConversations error:", err);
    return [];
  }
}

export async function getOrCreateConversationForPro(proId: string): Promise<string | null> {
  const session = await getSession();
  if (!session || session.role !== "COUPLE") return null;

  try {
    const pro = await prisma.professionalProfile.findUnique({
      where: { id: proId, isActive: true },
      select: { id: true },
    });
    if (!pro) return null;

    const wedding = await prisma.timelineItem.findFirst({
      where: {
        OR: [{ coupleId: session.userId }, { ownerId: session.userId }],
      },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });
    if (!wedding) return null;

    const existing = await prisma.conversation.findUnique({
      where: {
        timelineItemId_professionalProfileId: {
          timelineItemId: wedding.id,
          professionalProfileId: pro.id,
        },
      },
      select: { id: true },
    });
    if (existing) return existing.id;

    const created = await prisma.conversation.create({
      data: {
        timelineItemId: wedding.id,
        professionalProfileId: pro.id,
      },
      select: { id: true },
    });
    return created.id;
  } catch (err) {
    console.error("getOrCreateConversationForPro error:", err);
    return null;
  }
}

export async function getMessages(conversationId: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE", "ADMIN"]);

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      timelineItem: true,
      professionalProfile: true,
    },
  });

  if (!conversation) throw new Error("Conversazione non trovata");

  const isCouple =
    conversation.timelineItem.ownerId === session.userId ||
    conversation.timelineItem.coupleId === session.userId;
  const isPro =
    conversation.professionalProfile.userId === session.userId ||
    conversation.professionalProfile.parentUserId === session.userId;
  const isAdmin = session.role === "ADMIN";

  if (!isCouple && !isPro && !isAdmin) throw new Error("Accesso negato");

  const assignment = await prisma.eventAssignment.findUnique({
    where: {
      timelineItemId_professionalProfileId: {
        timelineItemId: conversation.timelineItemId,
        professionalProfileId: conversation.professionalProfileId,
      },
    },
  });

  if (assignment && assignment.status !== "ACTIVE" && !isAdmin) {
    throw new Error("La conversazione è stata chiusa o revocata.");
  }

  if (!isAdmin) {
    await prisma.chatMessage.updateMany({
      where: {
        conversationId,
        senderId: { not: session.userId },
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  return await prisma.chatMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });
}

export async function sendMessage(weddingId: string, proId: string, text: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);

  const conversation = await prisma.conversation.findUnique({
    where: {
      timelineItemId_professionalProfileId: {
        timelineItemId: weddingId,
        professionalProfileId: proId,
      },
    },
    include: {
      timelineItem: true,
      professionalProfile: true,
    },
  });

  const assignment = await prisma.eventAssignment.findUnique({
    where: {
      timelineItemId_professionalProfileId: {
        timelineItemId: weddingId,
        professionalProfileId: proId,
      },
    },
    include: {
      timelineItem: true,
      professionalProfile: true,
    },
  });

  if (assignment && assignment.status !== "ACTIVE") {
    throw new Error("Assegnazione revocata. Impossibile inviare messaggi.");
  }

  const timelineItem = assignment?.timelineItem || conversation?.timelineItem;
  const professionalProfile = assignment?.professionalProfile || conversation?.professionalProfile;

  if (!timelineItem || !professionalProfile || !professionalProfile.isActive) {
    throw new Error("Conversazione non attiva. Impossibile inviare messaggi.");
  }

  const isCouple = timelineItem.ownerId === session.userId || timelineItem.coupleId === session.userId;
  const isPro =
    professionalProfile.userId === session.userId ||
    professionalProfile.parentUserId === session.userId;

  if (!isCouple && !isPro) throw new Error("Accesso negato");

  const { inspectAndSanitizeMessage } = await import("@/lib/contactGuard");
  const guard = inspectAndSanitizeMessage(text);
  if (guard.hasPrivateContact) {
    throw new Error(
      `Per la tua sicurezza e per mantenere tracciate le comunicazioni su GentiLuna, non è consentito scambiare contatti diretti in chat (${guard.reasons.join(", ")}). Continua la conversazione qui sulla piattaforma.`
    );
  }

  const activeConversation = await prisma.conversation.upsert({
    where: {
      timelineItemId_professionalProfileId: {
        timelineItemId: weddingId,
        professionalProfileId: proId,
      },
    },
    create: {
      timelineItemId: weddingId,
      professionalProfileId: proId,
    },
    update: { updatedAt: new Date() },
  });

  const proOwnerUserId = professionalProfile.parentUserId || professionalProfile.userId;
  const recipientId = isPro ? timelineItem.ownerId : proOwnerUserId;
  await createSystemNotification(
    recipientId,
    "Nuovo Messaggio",
    `Hai ricevuto un nuovo messaggio da ${isPro ? professionalProfile.businessName : "Sposi"}`,
    "MESSAGE",
    `/dashboard/messages/${activeConversation.id}`
  );

  await prisma.chatMessage.create({
    data: {
      conversationId: activeConversation.id,
      senderId: session.userId,
      text,
    },
  });

  revalidatePath(`/dashboard/messages`);
}
