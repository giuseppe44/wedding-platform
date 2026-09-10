"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";

export async function createTimelineChapter(familyId: string, title: string, type: string, date: Date, description: string, visibility: string, audience: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  
  const family = await prisma.family.findUnique({ where: { id: familyId } });
  if (!family || family.ownerId !== session.userId) {
    throw new Error("Non autorizzato a creare capitoli per questa famiglia");
  }

  const slug = `chapter-${randomBytes(4).toString("hex")}`;

  const chapter = await prisma.timelineItem.create({
    data: {
      type,
      title,
      description,
      date,
      visibility,
      audience,
      slug,
      familyId,
      ownerId: session.userId,
      brideName: "", // Optional for chapters, but required by schema
      groomName: "", // Optional for chapters, but required by schema
    }
  });

  revalidatePath(`/couple/${family.slug}/timeline`, "page");
  return chapter;
}

export async function updateTimelineChapter(chapterId: string, data: any, selectedGuests?: string[]) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  
  const chapter = await prisma.timelineItem.findUnique({ where: { id: chapterId }, include: { family: true } });
  if (!chapter || (chapter.ownerId !== session.userId && chapter.coupleId !== session.userId)) {
    throw new Error("Non autorizzato a modificare questo capitolo");
  }

  await prisma.timelineItem.update({
    where: { id: chapterId },
    data: {
      title: data.title,
      description: data.description,
      date: data.date,
      type: data.type,
      visibility: data.visibility,
      audience: data.audience,
    }
  });

  if (data.audience === "SELECTED_GUESTS" && selectedGuests) {
    // Overwrite selected guests
    await prisma.chapterSelectedGuest.deleteMany({ where: { timelineItemId: chapterId } });
    const inserts = selectedGuests.map(guestId => ({
      timelineItemId: chapterId,
      guestId
    }));
    if (inserts.length > 0) {
      await prisma.chapterSelectedGuest.createMany({ data: inserts });
    }
  } else if (data.audience !== "SELECTED_GUESTS") {
    await prisma.chapterSelectedGuest.deleteMany({ where: { timelineItemId: chapterId } });
  }

  if (chapter.family) {
    revalidatePath(`/couple/${chapter.family.slug}/timeline`, "page");
  }
}

export async function deleteTimelineChapter(chapterId: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  
  const chapter = await prisma.timelineItem.findUnique({ where: { id: chapterId }, include: { family: true } });
  if (!chapter || (chapter.ownerId !== session.userId && chapter.coupleId !== session.userId)) {
    throw new Error("Non autorizzato a eliminare questo capitolo");
  }

  if (chapter.type === "WEDDING") {
    throw new Error("Il capitolo WEDDING è protetto e non può essere eliminato.");
  }

  await prisma.timelineItem.delete({ where: { id: chapterId } });

  if (chapter.family) {
    revalidatePath(`/couple/${chapter.family.slug}/timeline`, "page");
  }
}
