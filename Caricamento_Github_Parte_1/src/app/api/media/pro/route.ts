import { NextResponse } from "next/server";
import { isCloudStorage, getSignedUrl, downloadFileBuffer, parseStoragePath } from "@/lib/storage";

/**
 * Proxy sicuro per immagini pubbliche del profilo/portfolio Professionisti (`uploads/pro-...`),
 * così il bucket Supabase `wedding-media` può restare completamente PRIVATO (`public = false`).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawPath = searchParams.get("path") || "";
  const cleanPath = parseStoragePath(rawPath);

  // Consenti esclusivamente file nella sottocartella pubblica del portfolio professionisti (`uploads/pro-...`)
  if (!cleanPath || !cleanPath.startsWith("uploads/pro-") || cleanPath.includes("..")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (isCloudStorage) {
    const signedUrl = await getSignedUrl(cleanPath);
    if (!signedUrl) {
      return new NextResponse("Not found", { status: 404 });
    }
    return NextResponse.redirect(signedUrl, 307);
  }

  const buffer = await downloadFileBuffer(cleanPath);
  if (!buffer) {
    return new NextResponse("Not found", { status: 404 });
  }

  const lower = cleanPath.toLowerCase();
  const contentType = lower.endsWith(".webp")
    ? "image/webp"
    : lower.endsWith(".png")
    ? "image/png"
    : lower.endsWith(".gif")
    ? "image/gif"
    : "image/jpeg";

  return new NextResponse(buffer as any, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
