"use server";
import { verifyTimelineAccess } from "@/lib/accessControl";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function fetchMoreMediaAction(
  timelineItemId: string,
  cursor: string,
  albumId?: string,
  isPublicView = false
) {
  // Security Checks
  const chapter = await prisma.timelineItem.findUnique({
    where: { id: timelineItemId }
  });
  
  if (!chapter) throw new Error("Capitolo non trovato");

  if (isPublicView) {
    if (chapter.visibility === "PRIVATE") {
      const session = await getSession();
      if (!session || (session.role !== "ADMIN" && chapter.ownerId !== session.userId && chapter.coupleId !== session.userId)) {
        throw new Error("Non autorizzato");
      }
    }
  } else {
    // Private view requires strictly the owner
    const session = await getSession();
    if (!session || (chapter.ownerId !== session.userId && chapter.coupleId !== session.userId)) {
      throw new Error("Non autorizzato");
    }
  }

  // Cross-link check for Album
  if (albumId) {
    const album = await prisma.album.findUnique({ where: { id: albumId } });
    if (!album || album.timelineItemId !== timelineItemId) {
      throw new Error("Album non valido o incrociato");
    }
  }

  // Build query
  const whereClause: any = { timelineItemId };
  if (albumId) {
    whereClause.albumId = albumId;
  }
  whereClause.status = "APPROVED"; 

  const media = await prisma.media.findMany({
    where: whereClause,
    take: 31,
    skip: 1, // Skip the cursor
    cursor: { id: cursor },
    orderBy: { createdAt: "desc" }
  });

  const hasMore = media.length === 31;
  const returnedMedia = hasMore ? media.slice(0, 30) : media;
  const nextCursor = returnedMedia.length > 0 ? returnedMedia[returnedMedia.length - 1].id : null;

  return { media: returnedMedia, nextCursor, hasMore };
}
