"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function searchProfessionals(query: string) {
  if (!query || query.length < 3) return [];
  const q = query.toLowerCase();
  
  // Note: sqlite doesn't support mode: 'insensitive' in Prisma natively without workarounds,
  // so we fetch and filter in JS if needed, or rely on contains which is case-insensitive in some SQLite configs.
  // We'll fetch all active and filter in JS to be safe and cross-db compatible for this project stage.
  const pros = await prisma.professionalProfile.findMany({
    where: { isActive: true },
    select: { id: true, businessName: true, category: true, slug: true, logoUrl: true }
  });

  return pros.filter(p => p.businessName.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)).slice(0, 10);
}

export async function assignProfessional(weddingId: string, proId: string, role: string, serviceId?: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE", "ADMIN"]);
  
  const wedding = await prisma.timelineItem.findUnique({ where: { id: weddingId } });
  if (!wedding) throw new Error("Matrimonio non trovato");
  
  if (wedding.ownerId !== session.userId && wedding.coupleId !== session.userId && session.role !== "ADMIN") {
    throw new Error("Non autorizzato ad assegnare professionisti a questo evento");
  }

  // Upsert assignment to handle re-assignment or update
  await prisma.eventAssignment.upsert({
    where: {
      timelineItemId_professionalProfileId: {
        timelineItemId: weddingId,
        professionalProfileId: proId
      }
    },
    update: {
      status: "ACTIVE",
      role: role || null,
      serviceId: serviceId || null
    },
    create: {
      timelineItemId: weddingId,
      professionalProfileId: proId,
      status: "ACTIVE",
      role: role || null,
      serviceId: serviceId || null
    }
  });

  revalidatePath(`/couple/${wedding.slug}/chapter/[chapterSlug]`, "page");
  revalidatePath(`/w/${wedding.slug}`, "page");
}

export async function revokeAssignment(assignmentId: string, weddingSlug: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE", "ADMIN"]);
  const assignment = await prisma.eventAssignment.findUnique({ 
    where: { id: assignmentId },
    include: { timelineItem: true }
  });
  
  if (!assignment) throw new Error("Assegnazione non trovata");

  if (assignment.timelineItem.ownerId !== session.userId && assignment.timelineItem.coupleId !== session.userId && session.role !== "ADMIN") {
    throw new Error("Non autorizzato a revocare professionisti da questo evento");
  }

  await prisma.eventAssignment.update({
    where: { id: assignmentId },
    data: { status: "REVOKED" }
  });

  revalidatePath(`/couple/${weddingSlug}/chapter/[chapterSlug]`, "page");
  revalidatePath(`/w/${weddingSlug}`, "page");
  revalidatePath(`/dashboard`, "page");
}

export async function createReview(weddingId: string, proId: string, rating: number, text: string, weddingSlug: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE", "ADMIN"]);
  
  const wedding = await prisma.timelineItem.findUnique({ where: { id: weddingId } });
  if (!wedding) throw new Error("Matrimonio non trovato");
  
  if (wedding.ownerId !== session.userId && wedding.coupleId !== session.userId && session.role !== "ADMIN") {
    throw new Error("Solo gli sposi possono recensire");
  }

  // Check if assigned and active
  const assignment = await prisma.eventAssignment.findUnique({
    where: {
      timelineItemId_professionalProfileId: {
        timelineItemId: weddingId,
        professionalProfileId: proId
      }
    }
  });

  if (!assignment || assignment.status !== "ACTIVE") {
    throw new Error("Puoi recensire solo professionisti attivamente assegnati al tuo matrimonio");
  }

  // Prevent self-review if they are somehow both couple and pro
  const proProfile = await prisma.professionalProfile.findUnique({ where: { id: proId } });
  if (proProfile?.userId === session.userId) {
    throw new Error("Non puoi recensire te stesso");
  }

  await prisma.review.upsert({
    where: {
      timelineItemId_professionalProfileId_authorId: {
        timelineItemId: weddingId,
        professionalProfileId: proId,
        authorId: session.userId
      }
    },
    update: {
      rating,
      text
    },
    create: {
      timelineItemId: weddingId,
      professionalProfileId: proId,
      authorId: session.userId,
      rating,
      text
    }
  });

  revalidatePath(`/couple/${weddingSlug}/chapter/[chapterSlug]`, "page");
  revalidatePath(`/pro/${proProfile?.slug}`, "page");
}

export async function verifyProAssignment(weddingId: string, userId: string) {
  const profile = await prisma.professionalProfile.findUnique({ where: { userId } });
  if (!profile) return false;
  const assignment = await prisma.eventAssignment.findUnique({
    where: {
      timelineItemId_professionalProfileId: {
        timelineItemId: weddingId,
        professionalProfileId: profile.id
      }
    }
  });
  return assignment?.status === 'ACTIVE';
}
