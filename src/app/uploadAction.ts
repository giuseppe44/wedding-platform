"use server";

import fs from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadFile } from "@/lib/storage";

export async function uploadMediaAction(weddingId: string, formData: FormData) {
  const wedding = await prisma.wedding.findUnique({ where: { id: weddingId } });
  if (!wedding) throw new Error("Matrimonio non trovato");

  const files = formData.getAll("files") as File[];
  
  if (!files || files.length === 0) {
    throw new Error("Nessun file selezionato");
  }

  let uploadedCount = 0;

  for (const file of files) {
    if (file.size === 0) continue;
    if (file.size > 100 * 1024 * 1024) continue; // max 100MB per file
    
    // Security: Only allow images and videos
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      continue;
    }
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2,7)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    const fileUrl = await uploadFile(weddingId, uniqueName, buffer, file.type);
    
    await prisma.media.create({
      data: {
        url: fileUrl,
        weddingId,
        type: file.type.startsWith("video/") ? "VIDEO" : "IMAGE",
        mimeType: file.type,
        size: file.size,
        status: "PENDING", // Needs approval
      }
    });
    uploadedCount++;
  }

  return { success: true, count: uploadedCount };
}
