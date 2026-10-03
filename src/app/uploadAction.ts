"use server";

import fs from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadFile, deleteFile } from "@/lib/storage";
import { getSession } from "@/lib/auth";
import { createSystemNotification } from "./notificationActions";

export async function uploadMediaAction(timelineItemId: string, formData: FormData) {
  const wedding = await prisma.timelineItem.findUnique({ where: { id: timelineItemId } });
  if (!wedding) throw new Error("Matrimonio non trovato");

  
  const session = await getSession();

  // --- ENFORCE LIMITS ---
  const { getUserEntitlements } = await import("@/lib/entitlementHelper");
  const entitlements = await getUserEntitlements(wedding.ownerId);
  
  const currentMediaCount = await prisma.media.count({
    where: { timelineItemId }
  });
  
  const currentStorage = await prisma.media.aggregate({
    where: { timelineItemId },
    _sum: { size: true }
  });
  
  const currentStorageGB = (currentStorage._sum.size || 0) / (1024 * 1024 * 1024);
  
  const filesArray = formData.getAll("files") as File[]; let incomingSize = 0;
  for (const f of filesArray) incomingSize += f.size;
  const incomingGB = incomingSize / (1024 * 1024 * 1024);

  if (currentMediaCount + filesArray.length > entitlements.maxPhotos) {
    throw new Error(`Limite raggiunto: Il piano prevede un massimo di ${entitlements.maxPhotos} media. Effettua l'upgrade per caricare altre foto.`);
  }
  
  if (currentStorageGB + incomingGB > entitlements.maxStorageGB) {
    throw new Error(`Limite raggiunto: Il piano prevede un massimo di ${entitlements.maxStorageGB} GB di spazio di archiviazione.`);
  }
  
  // Verify couple upload permissions if uploaded by owner
  const isOwnerCheck = session && (session.userId === wedding.ownerId || session.userId === wedding.coupleId);
  if (isOwnerCheck && !entitlements.canUploadPhotos) {
    // If it's a couple trying to upload their own stuff, check if plan allows it. 
    // BASE plan doesn't allow photo upload by couple. Wait, prompt says: 
    // "Funzione di caricamento delle foto da parte della coppia" is PREMIUM.
    // I should check if BASE really prohibits it. 
    // Yes: "canUploadPhotos: false" in BASE.
    throw new Error("Il caricamento di foto da parte della coppia richiede il piano Premium o superiore.");
  }
  // ----------------------


  if (wedding.visibility === "PRIVATE" && wedding.type !== "WEDDING") {
    if (!session || (session.role !== "PHOTOGRAPHER" && session.role !== "COUPLE")) {
      throw new Error("Non autorizzato");
    }
  }

  // Auto-approval check`n  const isOwner = session && (session.userId === wedding.ownerId || session.userId === wedding.coupleId);`n  const targetStatus = isOwner ? "APPROVED" : "PENDING";

  const albumId = formData.get("albumId") as string | null;
  const guestName = formData.get("guestName") as string | null;
  const guestMessage = formData.get("guestMessage") as string | null;
  const giftOptionId = formData.get("giftOptionId") as string | null;

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
    
          // Controlli di sicurezza e Copyright
      const isAudio = mimeType.startsWith("audio/");
      
      const isPro = session && session.role === "PROFESSIONAL";
      if (isAudio && !isPro) {
         throw new Error("ATTENZIONE: L'upload di file audio (es. MP3) è riservato esclusivamente al professionista incaricato (Fotografo/Videomaker) per tutelare i diritti di copyright e licenze d'uso.");
      }

      if (!mimeType.startsWith("image/") && !mimeType.startsWith("video/") && !isAudio) {
        continue;
      }
    
        const buffer = Buffer.from(await file.arrayBuffer());

    // --- SECURITY: MAGIC NUMBER CHECK ---
    // Basic verification of file signatures to prevent malicious uploads disguised as media
    const magic = buffer.toString('hex', 0, 4).toUpperCase();
    const isJPEG = magic.startsWith('FFD8FF');
    const isPNG = magic === '89504E47';
    const isGIF = magic.startsWith('47494638');
    const isWebP = magic.startsWith('52494646') && buffer.toString('hex', 8, 12).toUpperCase() === '57454250';
    const isMP4 = magic.startsWith('000000') && buffer.toString('hex', 4, 8).toUpperCase() === '66747970';
    const isHEIC = magic.startsWith('000000') && (buffer.toString('hex', 8, 12).toUpperCase() === '68656963' || buffer.toString('hex', 8, 12).toUpperCase() === '6D696631');
    const isMOV = magic.startsWith('000000') && buffer.toString('hex', 4, 8).toUpperCase() === '6D6F6F76' || buffer.toString('hex', 4, 8).toUpperCase() === '66747970';

    if (!isJPEG && !isPNG && !isGIF && !isWebP && !isMP4 && !isHEIC && !isMOV) {
      console.warn("Mime-Type spoofing detectato per il file:", file.name);
      continue;
    }
    // ------------------------------------

    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2,7)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    const fileUrl = await uploadFile(timelineItemId, uniqueName, buffer, mimeType);
    
        const createdMedia = await prisma.media.create({ /* @ts-ignore */
      data: {
        url: fileUrl,
        timelineItemId,
        type: mimeType.startsWith("video/") ? "VIDEO" : (mimeType.startsWith("audio/") ? "AUDIO" : "IMAGE"),
        mimeType: mimeType,
        size: file.size,
        status: isOwnerCheck ? "APPROVED" : "PENDING",
        albumId: albumId || null,
        uploaderName: guestName || null,
        guestMessage: guestMessage || null,
        giftOptionId: giftOptionId || null,
      }
    });

    // --- SECURITY: CONCURRENCY POST-CHECK ---
    const postMediaCount = await prisma.media.count({ where: { timelineItemId } });
    if (postMediaCount > entitlements.maxPhotos) {
      
      try {
        await deleteFile(fileUrl);
        await prisma.media.delete({ where: { id: createdMedia.id } });
      } catch (rollbackError) {
        // Storage failed to delete, so we MUST keep the DB record to avoid orphans.
        await prisma.media.update({
          where: { id: createdMedia.id },
          data: { status: "LIMIT_EXCEEDED" }
        });
        console.error("Storage deletion failed, marked DB record as LIMIT_EXCEEDED to avoid orphans", rollbackError);
      }
      throw new Error("Limite superato durante l'upload simultaneo.");
    }
    const postStorage = await prisma.media.aggregate({ where: { timelineItemId }, _sum: { size: true } });
    if (((postStorage._sum.size || 0) / (1024 * 1024 * 1024)) > entitlements.maxStorageGB) {
      
      try {
        await deleteFile(fileUrl);
        await prisma.media.delete({ where: { id: createdMedia.id } });
      } catch (rollbackError) {
        // Storage failed to delete, so we MUST keep the DB record to avoid orphans.
        await prisma.media.update({
          where: { id: createdMedia.id },
          data: { status: "LIMIT_EXCEEDED" }
        });
        console.error("Storage deletion failed, marked DB record as LIMIT_EXCEEDED to avoid orphans", rollbackError);
      }
      throw new Error("Spazio esaurito durante l'upload simultaneo.");
    }
    // ----------------------------------------
    
    uploadedCount++;
  }

  revalidatePath(`/couple/[slug]`, "layout");
  revalidatePath(`/w/[slug]`, "layout");
  
  return { success: true, count: uploadedCount };
}










