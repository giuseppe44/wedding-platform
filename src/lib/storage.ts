import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Only used in server functions
const bucketName = 'wedding-media'

export const isCloudStorage = !!(supabaseUrl && supabaseKey)

// Create a single supabase client for interacting with your database
const supabase = isCloudStorage ? createClient(supabaseUrl as string, supabaseKey as string) : null

export async function uploadFile(weddingId: string, uniqueName: string, buffer: Buffer, mimeType: string): Promise<string> {
  const filePath = `uploads/${weddingId}/${uniqueName}`
  
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

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath)
      
    return publicUrlData.publicUrl
  } else {
    // Local fallback
    const localDir = path.join(process.cwd(), "public", "uploads", weddingId)
    await fs.promises.mkdir(localDir, { recursive: true })
    const localPath = path.join(localDir, uniqueName)
    await fs.promises.writeFile(localPath, buffer)
    return `/uploads/${weddingId}/${uniqueName}`
  }
}

export async function downloadFileBuffer(fileUrl: string): Promise<Buffer | null> {
  if (isCloudStorage && fileUrl.startsWith('http')) {
    try {
      const response = await fetch(fileUrl)
      if (!response.ok) throw new Error("Failed to fetch")
      const arrayBuffer = await response.arrayBuffer()
      return Buffer.from(arrayBuffer)
    } catch (e) {
      console.error("Failed to download cloud file", e)
      return null
    }
  } else {
    // Local fallback
    try {
      // url is like `/uploads/[weddingId]/[filename]`
      const localPath = path.join(process.cwd(), "public", fileUrl.replace(/^\//, "").replace(/\//g, path.sep))
      return await fs.promises.readFile(localPath)
    } catch (e) {
      console.error("Failed to read local file", e)
      return null
    }
  }
}
