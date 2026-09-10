"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { verifyTimelineAccess } from "@/lib/accessControl";

export async function createGiftOption(timelineItemId: string, data: any, slug: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  const wedding = await prisma.timelineItem.findUnique({ where: { id: timelineItemId } });
  if (!wedding || (wedding.ownerId !== session.userId && wedding.coupleId !== session.userId && session.role !== "ADMIN")) throw new Error("Non autorizzato");

  await prisma.giftOption.create({
    data: {
      timelineItemId,
      type: data.type || "CASH_GIFT",
      title: data.title,
      description: data.description,
      iban: data.iban,
      paypalLink: data.paypalLink,
      externalLink: data.externalLink,
      isActive: data.isActive ?? true,
      order: parseInt(data.order) || 0
    }
  });

  revalidatePath(`/couple/${slug}/chapter/[chapterSlug]`, "page");
  revalidatePath(`/w/${slug}`, "page");
}

export async function updateGiftOption(optionId: string, data: any, slug: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  const option = await prisma.giftOption.findUnique({ where: { id: optionId }, include: { timelineItem: true } });
  if (!option || (option.timelineItem.ownerId !== session.userId && option.timelineItem.coupleId !== session.userId && session.role !== "ADMIN")) throw new Error("Non autorizzato");

  await prisma.giftOption.update({
    where: { id: optionId },
    data: {
      type: data.type,
      title: data.title,
      description: data.description,
      iban: data.iban,
      paypalLink: data.paypalLink,
      externalLink: data.externalLink,
      isActive: data.isActive,
      order: parseInt(data.order) || 0
    }
  });

  revalidatePath(`/couple/${slug}/chapter/[chapterSlug]`, "page");
  revalidatePath(`/w/${slug}`, "page");
}

export async function deleteGiftOption(optionId: string, slug: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  const option = await prisma.giftOption.findUnique({ where: { id: optionId }, include: { timelineItem: true } });
  if (!option || (option.timelineItem.ownerId !== session.userId && option.timelineItem.coupleId !== session.userId && session.role !== "ADMIN")) throw new Error("Non autorizzato");

  await prisma.giftOption.delete({ where: { id: optionId } });
  revalidatePath(`/couple/${slug}/chapter/[chapterSlug]`, "page");
  revalidatePath(`/w/${slug}`, "page");
}

export async function toggleGiftOption(optionId: string, isActive: boolean, slug: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  const option = await prisma.giftOption.findUnique({ where: { id: optionId }, include: { timelineItem: true } });
  if (!option || (option.timelineItem.ownerId !== session.userId && option.timelineItem.coupleId !== session.userId && session.role !== "ADMIN")) throw new Error("Non autorizzato");

  await prisma.giftOption.update({
    where: { id: optionId },
    data: { isActive }
  });

  revalidatePath(`/couple/${slug}/chapter/[chapterSlug]`, "page");
  revalidatePath(`/w/${slug}`, "page");
}

export async function revealIban(optionId: string, slug: string) {
  const wedding = await prisma.timelineItem.findUnique({ where: { slug } });
  if (!wedding) throw new Error("Evento non trovato");

  const hasAccess = await verifyTimelineAccess(wedding, "VIEW_PUBLIC");
  if (!hasAccess) throw new Error("Accesso negato");

  const option = await prisma.giftOption.findUnique({ where: { id: optionId } });
  if (!option || option.timelineItemId !== wedding.id) throw new Error("Opzione non valida");

  return option.iban;
}
