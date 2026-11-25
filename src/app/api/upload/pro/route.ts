import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createSignedUploadSlot, uploadFile } from "@/lib/storage";

function sanitizeFileName(rawName: string): string {
  const safe = (rawName || "photo.jpg").replace(/[^a-zA-Z0-9.-]/g, "_").slice(-80);
  return safe || "photo.jpg";
}

function isAllowedImageMime(mimeType: string, fileName: string): boolean {
  if (mimeType && mimeType.startsWith("image/")) return true;
  const lower = (fileName || "").toLowerCase();
  return (
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".png") ||
    lower.endsWith(".webp") ||
    lower.endsWith(".gif") ||
    lower.endsWith(".heic") ||
    lower.endsWith(".heif") ||
    lower.endsWith(".tif") ||
    lower.endsWith(".tiff")
  );
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !["PHOTOGRAPHER", "ADMIN"].includes(session.role)) {
      return NextResponse.json(
        { success: false, error: "Sessione non valida. Effettua nuovamente l'accesso." },
        { status: 401 }
      );
    }

    const contentType = req.headers.get("content-type") || "";

    // MODALITÀ 1: JSON Init -> genera Signed Upload URL diretto su Supabase Storage (bypassa limite 4.5MB Vercel)
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const fileName = sanitizeFileName(body.fileName || "photo.jpg");
      const mimeType = String(body.mimeType || "image/jpeg");
      const size = Number(body.size || 0);

      if (!isAllowedImageMime(mimeType, fileName)) {
        return NextResponse.json(
          { success: false, error: "Sono consentite solo immagini (JPG, PNG, WebP, HEIC, TIFF)." },
          { status: 400 }
        );
      }

      if (size > 40 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: "Immagine troppo grande (massimo 40 MB)." },
          { status: 400 }
        );
      }

      const uniqueName = `pro-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 7)}-${fileName}`;

      const slot = await createSignedUploadSlot(`pro-${session.userId}`, uniqueName);
      const publicProxyUrl = `/api/media/pro?path=${encodeURIComponent(slot.filePath)}`;

      if (slot.signedUrl) {
        return NextResponse.json({
          success: true,
          cloudDirect: true,
          signedUrl: slot.signedUrl,
          storagePath: slot.filePath,
          publicProxyUrl,
        });
      }

      return NextResponse.json({
        success: true,
        cloudDirect: false,
        storagePath: slot.filePath,
        publicProxyUrl,
      });
    }

    // MODALITÀ 2: Fallback Multipart FormData (file già ottimizzato lato client < 4MB)
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file || file.size === 0) {
      return NextResponse.json(
        { success: false, error: "Nessun file selezionato." },
        { status: 400 }
      );
    }

    if (!isAllowedImageMime(file.type, file.name)) {
      return NextResponse.json(
        { success: false, error: "Formato non valido. Usa JPG, PNG, WebP, HEIC o TIFF." },
        { status: 400 }
      );
    }

    if (file.size > 40 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Immagine troppo grande (massimo 40 MB)." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const magic = buffer.toString("hex", 0, 4).toUpperCase();
    const isJPEG = magic.startsWith("FFD8FF");
    const isPNG = magic === "89504E47";
    const isGIF = magic.startsWith("47494638");
    const isWebP =
      magic.startsWith("52494646") && buffer.toString("hex", 8, 12).toUpperCase() === "57454250";
    const isHEIC =
      magic.startsWith("000000") &&
      ["68656963", "6D696631", "68656978", "66747970"].includes(
        buffer.toString("hex", 4, 8).toUpperCase()
      ) ||
      (magic.startsWith("000000") &&
        ["68656963", "6D696631", "68656978"].includes(
          buffer.toString("hex", 8, 12).toUpperCase()
        ));
    const isTIFF = magic.startsWith("49492A00") || magic.startsWith("4D4D002A");

    if (!isJPEG && !isPNG && !isGIF && !isWebP && !isHEIC && !isTIFF) {
      return NextResponse.json(
        { success: false, error: "Il file selezionato non è un'immagine valida." },
        { status: 400 }
      );
    }

    const uniqueName = `pro-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 7)}-${sanitizeFileName(file.name)}`;

    const resolvedMime =
      file.type && file.type !== "application/octet-stream" ? file.type : "image/jpeg";
    const storagePath = await uploadFile(`pro-${session.userId}`, uniqueName, buffer, resolvedMime);

    return NextResponse.json({
      success: true,
      url: `/api/media/pro?path=${encodeURIComponent(storagePath)}`,
    });
  } catch (err: any) {
    console.error("Errore /api/upload/pro:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Errore durante il caricamento dell'immagine.",
      },
      { status: 500 }
    );
  }
}
