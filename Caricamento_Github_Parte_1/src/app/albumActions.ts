"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";

export async function createAlbumAction(timelineItemId: string, formData: FormData) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  
  const chapter = await prisma.timelineItem.findUnique({ where: { id: timelineItemId } });
  if (!chapter) throw new Error("Capitolo non trovato");
  if (chapter.ownerId !== session.userId && chapter.coupleId !== session.userId) {
    throw new Error("Non autorizzato");
  }

  const name = formData.get("name") as string;
  if (!name || name.trim().length === 0) throw new Error("Nome non valido");
  
  // Check duplicates
  const existing = await prisma.album.findFirst({
    where: { timelineItemId, name: name.trim() }
  });
  if (existing) throw new Error("Raccolta già esistente");

  await prisma.album.create({
    data: {
      name: name.trim(),
      timelineItemId
    }
  });

  revalidatePath("/couple/[slug]", "layout");
}

export async function deleteAlbumAction(albumId: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  
  const album = await prisma.album.findUnique({ 
    where: { id: albumId }, 
    include: { timelineItem: true } 
  });
  if (!album) throw new Error("Album non trovato");
  
  if (album.timelineItem.ownerId !== session.userId && album.timelineItem.coupleId !== session.userId) {
    throw new Error("Non autorizzato");
  }

  // Deleting album automatically sets Media.albumId to null because of onDelete: SetNull in Prisma!
  await prisma.album.delete({ where: { id: albumId } });

  revalidatePath("/couple/[slug]", "layout");
}

export async function assignMediaToAlbumAction(mediaId: string, albumId: string | null) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  
  const media = await prisma.media.findUnique({ where: { id: mediaId }, include: { timelineItem: true } });
  if (!media) throw new Error("Media non trovato");
  
  if (media.timelineItem.ownerId !== session.userId && media.timelineItem.coupleId !== session.userId) {
    throw new Error("Non autorizzato");
  }

  if (albumId) {
    const album = await prisma.album.findUnique({ where: { id: albumId } });
    if (!album) throw new Error("Album non trovato");
    
    // CROSS-LINK PROTECTION!
    if (media.timelineItemId !== album.timelineItemId) {
      throw new Error("Errore di sicurezza: l'album appartiene a un capitolo diverso.");
    }
  }

  await prisma.media.update({
    where: { id: mediaId },
    data: { albumId }
  });

  revalidatePath("/couple/[slug]", "layout");
}
