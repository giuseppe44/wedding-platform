"use server";

import fs from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadFile } from "@/lib/storage";
import { getSession } from "@/lib/auth";
import { createSystemNotification } from "./notificationActions";

export async function uploadMediaAction(timelineItemId: string, formData: FormData) {
  const wedding = await prisma.timelineItem.findUnique({ where: { id: timelineItemId } });
  if (!wedding) throw new Error("Matrimonio non trovato");

  const session = await getSession();

  if (wedding.visibility === "PRIVATE" && wedding.type !== "WEDDING") {
    if (!session || (session.role !== "PHOTOGRAPHER" && session.role !== "COUPLE")) {
      throw new Error("Non autorizzato");
    }
  }

  // Auto-approval check
  const isOwner = session && (session.userId === wedding.ownerId || session.userId === wedding.coupleId);
  const targetStatus = isOwner ? "APPROVED" : "PENDING";

  const albumId = formData.get("albumId") as string | null;
  const guestName = formData.get("guestName") as string | null;
  const guestMessage = formData.get("guestMessage") as string | null;

  if (albumId) {
    const album = await prisma.album.findUnique({ where: { id: albumId } });
    if (!album || album.timelineItemId !== timelineItemId) throw new Error("Album non valido o incrociato");
  }

  const files = formData.getAll("files") as File[];
  
  if (!files || files.length === 0) {
    throw new Error("Nessun file selezionato");
  }

  let uploadedCount = 0;

  for (const file of files) {
    if (file.size === 0) continue;
    if (file.size > 100 * 1024 * 1024) continue; // max 100MB per file
    
    let mimeType = file.type;
    const nameLower = file.name.toLowerCase();
    
    // Fix missing mime types for webp/heic/heif from some browsers/devices
    if (!mimeType || mimeType === "application/octet-stream") {
      if (nameLower.endsWith(".webp")) mimeType = "image/webp";
      else if (nameLower.endsWith(".heic")) mimeType = "image/heic";
      else if (nameLower.endsWith(".heif")) mimeType = "image/heif";
      else if (nameLower.endsWith(".jpg") || nameLower.endsWith(".jpeg")) mimeType = "image/jpeg";
      else if (nameLower.endsWith(".png")) mimeType = "image/png";
      else if (nameLower.endsWith(".mp4")) mimeType = "video/mp4";
      else if (nameLower.endsWith(".mov")) mimeType = "video/quicktime";
    }
    
    // Security: Only allow images and videos
    if (!mimeType.startsWith("image/") && !mimeType.startsWith("video/")) {
      continue;
    }
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2,7)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    const fileUrl = await uploadFile(timelineItemId, uniqueName, buffer, mimeType);
    
    await prisma.media.create({ /* @ts-ignore */
      data: { // @ts-ignore `n 
        url: fileUrl,
        timelineItemId,
        type: mimeType.startsWith("video/") ? "VIDEO" : "IMAGE",
        mimeType: mimeType,
        size: file.size,
        status: targetStatus,
        albumId: albumId || null,
        uploaderName: guestName || null,
        guestMessage: guestMessage || null,
      }
    });
    uploadedCount++;
  }

  revalidatePath(`/couple/[slug]`, "layout");
  revalidatePath(`/w/[slug]`, "layout");
  
  return { success: true, count: uploadedCount };
}
