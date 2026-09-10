import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Only used in server functions
const bucketName = 'wedding-media'

export const isCloudStorage = !!(supabaseUrl && supabaseKey)

// Create a single supabase client for interacting with your database
const supabase = isCloudStorage ? createClient(supabaseUrl as string, supabaseKey as string) : null

// Check if running on Vercel
const isVercel = process.env.VERCEL === "1" || process.env.NEXT_PUBLIC_VERCEL_ENV === "production" || process.env.NODE_ENV === "production";

/**
 * Normalizes legacy and new URLs to a standard relative filePath.
 * E.g. "https://.../object/public/wedding-media/uploads/123/file.jpg" -> "uploads/123/file.jpg"
 * E.g. "/uploads/123/file.jpg" -> "uploads/123/file.jpg"
 */
export function parseStoragePath(rawUrl: string): string {
  if (!rawUrl) return "";
  
  // Extract path from Supabase public URL
  if (rawUrl.includes(`/object/public/${bucketName}/`)) {
    return rawUrl.split(`/object/public/${bucketName}/`).pop() || "";
  }
  
  // Handle local absolute path
  if (rawUrl.startsWith("/uploads/")) {
    return rawUrl.substring(1);
  }
  
  // Already relative or new format
  return rawUrl;
}

export async function uploadFile(timelineItemId: string, uniqueName: string, buffer: Buffer, mimeType: string): Promise<string> {
  const filePath = `uploads/${timelineItemId}/${uniqueName}`
  
  if (isCloudStorage && supabase) {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: mimeType,
        upsert: false
      })

    if (error) {
      console.error("Supabase upload error:", error)
      throw new Error("Failed to upload to cloud storage")
    }

    // P12: We no longer return the public URL, but the filePath.
    return filePath;
  } else {
    // P0.2 - HARD BLOCK FOR VERCEL
    if (process.env.VERCEL === "1") {
      throw new Error("HARD BLOCK: L'ambiente Vercel richiede obbligatoriamente Supabase Storage. Il fallback locale in /public non è supportato in produzione in quanto il filesystem è effimero. Configura NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.");
    }
    
    // P12: Local fallback in .data/uploads/ instead of public/uploads/
    const localDir = path.join(process.cwd(), ".data", "uploads", timelineItemId)
    await fs.promises.mkdir(localDir, { recursive: true })
    const localPath = path.join(localDir, uniqueName)
    await fs.promises.writeFile(localPath, buffer)
    
    return filePath;
  }
}

export async function getSignedUrl(rawUrl: string): Promise<string | null> {
  if (!isCloudStorage || !supabase) return null;
  const filePath = parseStoragePath(rawUrl);
  if (!filePath) return null;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(filePath, 3600); // 1 hour

  if (error || !data) {
    console.error("Failed to generate signed URL:", error);
    return null;
  }
  
  return data.signedUrl;
}

export async function downloadFileBuffer(rawUrl: string): Promise<Buffer | null> {
  const filePath = parseStoragePath(rawUrl);
  if (!filePath) return null;

  if (isCloudStorage && supabase) {
    try {
      // P12: Use server-side download to bypass private bucket restrictions
      const { data, error } = await supabase.storage.from(bucketName).download(filePath);
      if (error || !data) throw error;
      const arrayBuffer = await data.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (e) {
      console.error("Failed to download cloud file", e)
      return null;
    }
  } else {
    // Local fallback
    try {
      // Check .data/uploads first (new architecture)
      const newDataPath = path.join(process.cwd(), ".data", filePath.replace(/\//g, path.sep));
      if (fs.existsSync(newDataPath)) {
        return await fs.promises.readFile(newDataPath);
      }
      
      // Fallback to public/uploads (RC 1.0 compatibility)
      const oldDataPath = path.join(process.cwd(), "public", filePath.replace(/\//g, path.sep));
      if (fs.existsSync(oldDataPath)) {
        return await fs.promises.readFile(oldDataPath);
      }
      
      return null;
    } catch (e) {
      console.error("Failed to read local file", e)
      return null;
    }
  }
}
