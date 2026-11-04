"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { hashPassword } from "@/lib/password";

export async function updateBranding(timelineItemId: string, formData: FormData) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE", "ADMIN"]);
  const wedding = await prisma.timelineItem.findUnique({ where: { id: timelineItemId } });
  if (!wedding) throw new Error("Evento non trovato");

  if (
    wedding.ownerId !== session.userId &&
    wedding.coupleId !== session.userId &&
    session.role !== "ADMIN"
  ) {
    throw new Error("Non autorizzato");
  }

  const { getUserEntitlements } = await import("@/lib/entitlementHelper");
  const entitlements = await getUserEntitlements(wedding.ownerId);
  if (!entitlements.canCustomizeTableau) {
    throw new Error("La personalizzazione dei colori e della vetrina richiede il piano Diamond.");
  }

  const themeColor = formData.get("themeColor") as string;
  const welcomeMessage = formData.get("welcomeMessage") as string;
  const externalGalleryUrl = formData.get("externalGalleryUrl") as string;
  const slug = formData.get("slug") as string;

  await prisma.timelineItem.update({
    where: { id: timelineItemId },
    data: { themeColor, welcomeMessage, externalGalleryUrl },
  });

  revalidatePath(`/couple/${slug}`, "page");
  revalidatePath(`/w/${slug}`, "page");
}

export async function addTimelineItem(timelineItemId: string, formData: FormData) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE", "ADMIN"]);
  const wedding = await prisma.timelineItem.findUnique({ where: { id: timelineItemId } });
  if (!wedding) throw new Error("Evento non trovato");

  if (
    wedding.ownerId !== session.userId &&
    wedding.coupleId !== session.userId &&
    session.role !== "ADMIN"
  ) {
    throw new Error("Non autorizzato");
  }

  const time = formData.get("time") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const slug = formData.get("slug") as string;

  await prisma.scheduleItem.create({
    data: {
      timelineItemId,
      time,
      title,
      description,
      order: parseInt((time || "").replace(":", "")) || 0,
    },
  });

  revalidatePath(`/couple/${slug}`, "page");
  revalidatePath(`/w/${slug}`, "page");
}

export async function deleteTimelineItem(itemId: string, slug: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE", "ADMIN"]);
  const item = await prisma.scheduleItem.findUnique({
    where: { id: itemId },
    include: { timelineItem: true },
  });
  if (
    !item ||
    (item.timelineItem.ownerId !== session.userId &&
      item.timelineItem.coupleId !== session.userId &&
      session.role !== "ADMIN")
  ) {
    throw new Error("Non autorizzato");
  }
  await prisma.scheduleItem.delete({ where: { id: itemId } });
  revalidatePath(`/couple/${slug}`, "page");
  revalidatePath(`/w/${slug}`, "page");
}

export async function approveMessage(messageId: string, slug: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE", "ADMIN"]);
  const msg = await prisma.message.findUnique({
    where: { id: messageId },
    include: { timelineItem: true },
  });
  if (
    !msg ||
    (msg.timelineItem.ownerId !== session.userId &&
      msg.timelineItem.coupleId !== session.userId &&
      session.role !== "ADMIN")
  ) {
    throw new Error("Non autorizzato");
  }
  await prisma.message.update({ where: { id: messageId }, data: { status: "APPROVED" } });
  revalidatePath(`/couple/${slug}`, "page");
  revalidatePath(`/w/${slug}`, "page");
}

export async function rejectMessage(messageId: string, slug: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE", "ADMIN"]);
  const msg = await prisma.message.findUnique({
    where: { id: messageId },
    include: { timelineItem: true },
  });
  if (
    !msg ||
    (msg.timelineItem.ownerId !== session.userId &&
      msg.timelineItem.coupleId !== session.userId &&
      session.role !== "ADMIN")
  ) {
    throw new Error("Non autorizzato");
  }
  await prisma.message.update({ where: { id: messageId }, data: { status: "REJECTED" } });
  revalidatePath(`/couple/${slug}`, "page");
}

export async function updateEventPassword(
  timelineItemId: string,
  rawPassword: string | null,
  slug: string
) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE", "ADMIN"]);
  const wedding = await prisma.timelineItem.findUnique({ where: { id: timelineItemId } });

  if (!wedding) throw new Error("Not found");
  if (
    wedding.ownerId !== session.userId &&
    wedding.coupleId !== session.userId &&
    session.role !== "ADMIN"
  ) {
    throw new Error("Non autorizzato");
  }

  const storedHash = rawPassword && rawPassword.trim() ? hashPassword(rawPassword.trim()) : null;

  await prisma.timelineItem.update({
    where: { id: timelineItemId },
    data: { passwordHash: storedHash },
  });

  revalidatePath(`/couple/${slug}`, "page");
  revalidatePath(`/w/${slug}`, "page");
}

export async function updateExtendedDetails(timelineItemId: string, data: any, slug: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE", "ADMIN"]);
  const wedding = await prisma.timelineItem.findUnique({ where: { id: timelineItemId } });

  if (!wedding) throw new Error("Not found");
  if (
    wedding.ownerId !== session.userId &&
    wedding.coupleId !== session.userId &&
    session.role !== "ADMIN"
  ) {
    throw new Error("Non autorizzato");
  }

  await prisma.timelineItem.update({
    where: { id: timelineItemId },
    data: {
      startTime: data.startTime,
      endTime: data.endTime,
      dressCode: data.dressCode,
      usefulInfo: data.usefulInfo,
      ceremonyType: data.ceremonyType || "CIVIL",
      professionalsJson: data.professionalsJson,
      showGuestbook: data.showGuestbook ?? true,
      showSeating: data.showSeating ?? false,
      showGifts: data.showGifts ?? true,
    },
  });

  const locations = data.locations || [];
  const typesToManage = ["BRIDE_PREP", "GROOM_PREP", "CEREMONY", "RECEPTION"];

  await prisma.location.deleteMany({
    where: {
      timelineItemId,
      type: { in: typesToManage },
    },
  });

  for (const loc of locations) {
    if (loc.name || loc.address || loc.city) {
      await prisma.location.create({
        data: {
          timelineItemId,
          type: loc.type,
          name: loc.name || "",
          address: loc.address,
          city: loc.city,
          notes: loc.notes,
          coordinates: loc.coordinates,
        },
      });
    }
  }

  revalidatePath(`/couple/${slug}`, "page");
  revalidatePath(`/w/${slug}`, "page");
}

export async function updateTimelineItem(itemId: string, slug: string, formData: FormData) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE", "ADMIN"]);
  const item = await prisma.scheduleItem.findUnique({
    where: { id: itemId },
    include: { timelineItem: true },
  });
  if (
    !item ||
    (item.timelineItem.ownerId !== session.userId &&
      item.timelineItem.coupleId !== session.userId &&
      session.role !== "ADMIN")
  ) {
    throw new Error("Non autorizzato");
  }

  const time = formData.get("time") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  await prisma.scheduleItem.update({
    where: { id: itemId },
    data: { time, title, description },
  });

  revalidatePath(`/couple/${slug}/chapter/${item.timelineItem.slug}`, "page");
  revalidatePath(`/couple/${slug}`, "page");
  revalidatePath(`/w/${slug}`, "page");
}
