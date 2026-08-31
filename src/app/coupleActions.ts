"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";

export async function updateBranding(weddingId: string, formData: FormData) {
  await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  const themeColor = formData.get("themeColor") as string;
  const welcomeMessage = formData.get("welcomeMessage") as string;
  const slug = formData.get("slug") as string;

  await prisma.wedding.update({
    where: { id: weddingId },
    data: { themeColor, welcomeMessage },
  });

  revalidatePath(`/couple/${slug}`, "page");
  revalidatePath(`/w/${slug}`, "page");
}

export async function addTimelineItem(weddingId: string, formData: FormData) {
  await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  const time = formData.get("time") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const slug = formData.get("slug") as string;

  await prisma.timelineItem.create({
    data: {
      weddingId,
      time,
      title,
      description,
      order: parseInt(time.replace(':', '')) || 0, // basic sort
    },
  });

  revalidatePath(`/couple/${slug}`, "page");
  revalidatePath(`/w/${slug}`, "page");
}

export async function deleteTimelineItem(itemId: string, slug: string) {
  await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  await prisma.timelineItem.delete({ where: { id: itemId } });
  revalidatePath(`/couple/${slug}`, "page");
  revalidatePath(`/w/${slug}`, "page");
}

export async function approveMessage(messageId: string, slug: string) {
  await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  await prisma.message.update({ where: { id: messageId }, data: { status: "APPROVED" } });
  revalidatePath(`/couple/${slug}`, "page");
  revalidatePath(`/w/${slug}`, "page");
}

export async function rejectMessage(messageId: string, slug: string) {
  await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  await prisma.message.update({ where: { id: messageId }, data: { status: "REJECTED" } });
  revalidatePath(`/couple/${slug}`, "page");
}
