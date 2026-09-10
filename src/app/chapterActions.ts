"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { uploadFile } from "@/lib/storage";

async function processCoverUpload(weddingId: string, file: File | null): Promise<string | undefined> {
  if (!file || file.size === 0) return undefined;
  if (!file.type.startsWith("image/")) throw new Error("Only images are allowed for covers");
  if (file.size > 20 * 1024 * 1024) throw new Error("Cover image too large");
  
  const buffer = Buffer.from(await file.arrayBuffer());
  const uniqueName = `cover-${Date.now()}-${Math.random().toString(36).substring(2,7)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  return await uploadFile(weddingId, uniqueName, buffer, file.type);
}

export async function createChapter(weddingId: string, formData: FormData) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  
  let baseWedding = await prisma.timelineItem.findUnique({
    where: { id: weddingId }
  });
  
  if (!baseWedding) throw new Error("Base wedding not found");
  if (baseWedding.ownerId !== session.userId && baseWedding.coupleId !== session.userId) throw new Error("Non autorizzato");

  let familyId = baseWedding.familyId;
  if (!familyId) {
    const familySlug = `${baseWedding.brideName}-${baseWedding.groomName}-family-${Date.now()}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newFamily = await prisma.family.create({
      data: {
        name: `Famiglia ${baseWedding.groomName} & ${baseWedding.brideName}`,
        slug: familySlug,
        ownerId: baseWedding.ownerId,
      }
    });
    familyId = newFamily.id;
    await prisma.timelineItem.update({
      where: { id: weddingId },
      data: { familyId }
    });
  }

  const type = formData.get("type") as string || "MEMORY";
  const title = formData.get("title") as string;
  const dateStr = formData.get("date") as string;
  const description = formData.get("description") as string;
  const visibility = formData.get("visibility") as string || "PRIVATE";
  const audience = formData.get("audience") as string || "ALL_GUESTS";
  const selectedGuestIds = formData.getAll("selectedGuests[]") as string[];
  const isPublic = visibility === "PUBLIC" || visibility === "INVITED"; 
  
  const baseSlug = (title || type).toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);

  let coverImage = "";
  const coverFile = formData.get("coverFile") as File | null;
  if (coverFile && coverFile.size > 0) {
    const url = await processCoverUpload(weddingId, coverFile);
    if (url) coverImage = url;
  }

  const newChapter = await prisma.timelineItem.create({
    data: {
      type,
      title,
      date: dateStr ? new Date(dateStr) : null,
      description,
      coverImage,
      slug: baseSlug,
      isPublic,
      visibility,
      audience,
      brideName: baseWedding.brideName,
      groomName: baseWedding.groomName,
      ownerId: baseWedding.ownerId,
      coupleId: baseWedding.coupleId,
      familyId: familyId,
    },
  });

  if (audience === "SELECTED_GUESTS" && selectedGuestIds.length > 0) {
    await prisma.chapterSelectedGuest.createMany({
      data: selectedGuestIds.map((id: string) => ({ timelineItemId: newChapter.id, guestId: id }))
    });
  }

  revalidatePath(`/couple/${baseWedding.slug}`, "layout");
}

export async function updateChapter(chapterId: string, baseSlug: string, formData: FormData) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  
  const chapter = await prisma.timelineItem.findUnique({ where: { id: chapterId } });
  if (!chapter) throw new Error("Capitolo non trovato");
  if (chapter.ownerId !== session.userId && chapter.coupleId !== session.userId) throw new Error("Non autorizzato");

  const type = formData.get("type") as string;
  const title = formData.get("title") as string;
  const dateStr = formData.get("date") as string;
  const description = formData.get("description") as string;
  const visibility = formData.get("visibility") as string;
  const audience = formData.get("audience") as string;
  const selectedGuestIds = formData.getAll("selectedGuests[]") as string[];
  const isPublic = visibility === "PUBLIC" || visibility === "INVITED";
  
  const dataToUpdate: any = {
    title,
    date: dateStr ? new Date(dateStr) : null,
    description,
    isPublic,
    visibility,
    audience,
  };
  
  if (chapter.type !== "WEDDING" && type) {
    dataToUpdate.type = type;
  }

  const coverFile = formData.get("coverFile") as File | null;
  if (coverFile && coverFile.size > 0) {
    const url = await processCoverUpload(chapterId, coverFile);
    if (url) dataToUpdate.coverImage = url;
  }

  await prisma.timelineItem.update({
    where: { id: chapterId },
    data: dataToUpdate,
  });

  if (audience === "SELECTED_GUESTS" && selectedGuestIds.length > 0) {
    await prisma.chapterSelectedGuest.deleteMany({ where: { timelineItemId: chapterId } });
    await prisma.chapterSelectedGuest.createMany({
      data: selectedGuestIds.map((id: string) => ({ timelineItemId: chapterId, guestId: id }))
    });
  } else if (audience) {
    await prisma.chapterSelectedGuest.deleteMany({ where: { timelineItemId: chapterId } });
  }

  revalidatePath(`/couple/${baseSlug}`, "layout");
}

export async function deleteChapter(chapterId: string, baseSlug: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  
  const chapter = await prisma.timelineItem.findUnique({ where: { id: chapterId } });
  if (!chapter) throw new Error("Capitolo non trovato");
  if (chapter.ownerId !== session.userId && chapter.coupleId !== session.userId) throw new Error("Non autorizzato");
  
  if (chapter.type === "WEDDING") {
    throw new Error("Cannot delete the main wedding chapter.");
  }
  
  await prisma.timelineItem.delete({
    where: { id: chapterId },
  });

  revalidatePath(`/couple/${baseSlug}`, "layout");
  redirect(`/couple/${baseSlug}`);
}
