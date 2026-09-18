
"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { uploadFile } from "@/lib/storage";

export async function uploadTravelDocumentAction(timelineItemId: string, title: string, formData: FormData) {
  const session = await requireAuth(["PHOTOGRAPHER", "ADMIN", "COUPLE"]);
  
  const file = formData.get("file") as File;
  if (!file || file.size === 0) throw new Error("Nessun file");

  const assignment = await prisma.eventAssignment.findFirst({
    where: {
      timelineItemId,
      professionalProfile: { userId: session.userId }
    }
  });

  const wedding = await prisma.timelineItem.findUnique({ where: { id: timelineItemId }});

  if (!assignment && session.role !== "ADMIN" && wedding?.ownerId !== session.userId && wedding?.coupleId !== session.userId) {
    throw new Error("Non autorizzato");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uniqueName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const url = await uploadFile(timelineItemId, uniqueName, buffer, file.type);

  await prisma.travelDocument.create({
    data: {
      title,
      url,
      timelineItemId
    }
  });

  revalidatePath("/pro/dashboard");
  revalidatePath("/couple/[slug]/chapter/[chapterSlug]", "layout");
}

export async function deleteTravelDocumentAction(docId: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "ADMIN", "COUPLE"]);
  
  const doc = await prisma.travelDocument.findUnique({
    where: { id: docId },
    include: {
      timelineItem: {
        include: { assignments: { include: { professionalProfile: true } } }
      }
    }
  });

  if (!doc) throw new Error("Documento non trovato");

  const isAgency = doc.timelineItem.assignments.some((ea: any) => ea.professionalProfile.userId === session.userId);
  const isOwner = doc.timelineItem.ownerId === session.userId || doc.timelineItem.coupleId === session.userId;

  if (!isAgency && !isOwner && session.role !== "ADMIN") {
    throw new Error("Non autorizzato");
  }

  await prisma.travelDocument.delete({ where: { id: docId } });
  revalidatePath("/pro/dashboard");
  revalidatePath("/couple/[slug]/chapter/[chapterSlug]", "layout");
}

