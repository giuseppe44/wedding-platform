import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { verifyTimelineAccess } from "@/lib/accessControl";
import { getUserEntitlements } from "@/lib/entitlementHelper";
import { createSignedUploadSlot, uploadFile, deleteFile } from "@/lib/storage";

function normalizeMime(rawMime: string, fileName: string): string {
  if (rawMime && rawMime !== "application/octet-stream") return rawMime;
  const lower = (fileName || "").toLowerCase();
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".heic")) return "image/heic";
  if (lower.endsWith(".heif")) return "image/heif";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".mp4")) return "video/mp4";
  if (lower.endsWith(".mov")) return "video/quicktime";
  if (lower.endsWith(".mp3")) return "audio/mpeg";
  if (lower.endsWith(".wav")) return "audio/wav";
  return rawMime || "image/jpeg";
}

async function checkWeddingUploadPermissions(timelineItemId: string, incomingSize: number, mimeType: string) {
  const wedding = await prisma.timelineItem.findUnique({
    where: { id: timelineItemId },
    include: {
      assignments: {
        where: { status: "ACTIVE" },
        include: { professionalProfile: { select: { userId: true, parentUserId: true } } },
      },
    },
  });
  if (!wedding) {
    return { ok: false as const, status: 404, error: "Evento non trovato." };
  }

  const session = await getSession();
  const sessionUserId = session?.userId || "";
  const isOwnerOrCouple = Boolean(
    session &&
      (sessionUserId === wedding.ownerId ||
        sessionUserId === wedding.coupleId ||
        session.role === "ADMIN")
  );
  const isAssignedPro = Boolean(
    session &&
      session.role === "PHOTOGRAPHER" &&
      (wedding.ownerId === sessionUserId ||
        wedding.assignments.some(
          (a) =>
            a.professionalProfile.userId === sessionUserId ||
            a.professionalProfile.parentUserId === sessionUserId
        ))
  );

  if (wedding.visibility !== "PUBLIC" && !isOwnerOrCouple && !isAssignedPro) {
    const canAccess = await verifyTimelineAccess(wedding, "VIEW_PUBLIC");
    if (!canAccess) {
      return { ok: false as const, status: 401, error: "Non autorizzato a caricare su questo evento." };
    }
  }

  const isAudio = mimeType.startsWith("audio/");
  const isProRole = Boolean(session && (session.role === "PHOTOGRAPHER" || session.role === "ADMIN"));
  if (isAudio && !isProRole) {
    return {
      ok: false as const,
      status: 403,
      error:
        "L'upload di file audio (es. MP3) è riservato al professionista incaricato per tutelare i diritti di copyright.",
    };
  }

  if (!mimeType.startsWith("image/") && !mimeType.startsWith("video/") && !isAudio) {
    return { ok: false as const, status: 400, error: "Formato file non supportato." };
  }

  const entitlements = await getUserEntitlements(wedding.ownerId);
  const currentMediaCount = await prisma.media.count({ where: { timelineItemId } });
  const currentStorage = await prisma.media.aggregate({
    where: { timelineItemId },
    _sum: { size: true },
  });

  const currentStorageGB = (currentStorage._sum.size || 0) / (1024 * 1024 * 1024);
  const incomingGB = incomingSize / (1024 * 1024 * 1024);

  // I fotografi/partner incaricati hanno sempre margine operativo di consegna, oppure si applica il piano dell'evento
  const effectiveMaxPhotos = isProRole ? Math.max(entitlements.maxPhotos, 500) : entitlements.maxPhotos;
  const effectiveMaxGB = isProRole ? Math.max(entitlements.maxStorageGB, 10) : entitlements.maxStorageGB;

  if (currentMediaCount + 1 > effectiveMaxPhotos) {
    return {
      ok: false as const,
      status: 403,
      error: `Limite raggiunto (${effectiveMaxPhotos} media). Effettua l'upgrade del piano per caricare altre foto.`,
    };
  }

  if (currentStorageGB + incomingGB > effectiveMaxGB) {
    return {
      ok: false as const,
      status: 403,
      error: `Spazio esaurito (massimo ${effectiveMaxGB} GB per il piano attuale).`,
    };
  }

  const autoApprove = isOwnerOrCouple || isAssignedPro;
  return {
    ok: true as const,
    wedding,
    autoApprove,
    effectiveMaxPhotos,
    effectiveMaxGB,
  };
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      const mode = body.mode;

      if (mode === "init") {
        const timelineItemId = String(body.timelineItemId || "");
        const fileName = String(body.fileName || "media.jpg")
          .replace(/[^a-zA-Z0-9.-]/g, "_")
          .slice(-80);
        const size = Number(body.size || 0);
        const mimeType = normalizeMime(String(body.mimeType || ""), fileName);

        if (!timelineItemId || size <= 0) {
          return NextResponse.json({ success: false, error: "Parametri non validi." }, { status: 400 });
        }
        if (size > 100 * 1024 * 1024) {
          return NextResponse.json({ success: false, error: "File superiore a 100 MB." }, { status: 400 });
        }

        const perm = await checkWeddingUploadPermissions(timelineItemId, size, mimeType);
        if (!perm.ok) {
          return NextResponse.json({ success: false, error: perm.error }, { status: perm.status });
        }

        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${fileName}`;
        const slot = await createSignedUploadSlot(timelineItemId, uniqueName);

        return NextResponse.json({
          success: true,
          cloudDirect: Boolean(slot.signedUrl),
          signedUrl: slot.signedUrl,
          storagePath: slot.filePath,
        });
      }

      if (mode === "complete") {
        const timelineItemId = String(body.timelineItemId || "");
        const storagePath = String(body.storagePath || "");
        const size = Number(body.size || 0);
        const mimeType = normalizeMime(String(body.mimeType || ""), storagePath);
        const albumId = body.albumId ? String(body.albumId) : null;
        const guestName = body.guestName ? String(body.guestName).slice(0, 100) : null;
        const guestMessage = body.guestMessage ? String(body.guestMessage).slice(0, 500) : null;
        const giftOptionId = body.giftOptionId ? String(body.giftOptionId) : null;

        if (
          !timelineItemId ||
          !storagePath.startsWith(`uploads/${timelineItemId}/`) ||
          storagePath.includes("..")
        ) {
          return NextResponse.json({ success: false, error: "Percorso storage non valido." }, { status: 400 });
        }

        const perm = await checkWeddingUploadPermissions(timelineItemId, size, mimeType);
        if (!perm.ok) {
          try {
            await deleteFile(storagePath);
          } catch {}
          return NextResponse.json({ success: false, error: perm.error }, { status: perm.status });
        }

        if (albumId) {
          const album = await prisma.album.findUnique({ where: { id: albumId } });
          if (!album || album.timelineItemId !== timelineItemId) {
            return NextResponse.json({ success: false, error: "Album non valido." }, { status: 400 });
          }
        }

        const created = await prisma.media.create({
          data: {
            url: storagePath,
            timelineItemId,
            type: mimeType.startsWith("video/")
              ? "VIDEO"
              : mimeType.startsWith("audio/")
              ? "AUDIO"
              : "IMAGE",
            mimeType,
            size,
            status: perm.autoApprove ? "APPROVED" : "PENDING",
            albumId,
            uploaderName: guestName,
            guestMessage,
            giftOptionId,
          },
        });

        revalidatePath(`/couple/[slug]`, "layout");
        revalidatePath(`/w/[slug]`, "layout");

        return NextResponse.json({ success: true, mediaId: created.id });
      }
    }

    // Fallback Multipart per singolo file
    const formData = await req.formData();
    const timelineItemId = String(formData.get("timelineItemId") || "");
    const file = formData.get("file") as File | null;
    const albumId = (formData.get("albumId") as string | null) || null;
    const guestName = (formData.get("guestName") as string | null) || null;
    const guestMessage = (formData.get("guestMessage") as string | null) || null;
    const giftOptionId = (formData.get("giftOptionId") as string | null) || null;

    if (!timelineItemId || !file || file.size === 0) {
      return NextResponse.json({ success: false, error: "File o evento mancante." }, { status: 400 });
    }

    const mimeType = normalizeMime(file.type, file.name);
    const perm = await checkWeddingUploadPermissions(timelineItemId, file.size, mimeType);
    if (!perm.ok) {
      return NextResponse.json({ success: false, error: perm.error }, { status: perm.status });
    }

    if (albumId) {
      const album = await prisma.album.findUnique({ where: { id: albumId } });
      if (!album || album.timelineItemId !== timelineItemId) {
        return NextResponse.json({ success: false, error: "Album non valido." }, { status: 400 });
      }
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").slice(-80);
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${safeName}`;
    const fileUrl = await uploadFile(timelineItemId, uniqueName, buffer, mimeType);

    const created = await prisma.media.create({
      data: {
        url: fileUrl,
        timelineItemId,
        type: mimeType.startsWith("video/")
          ? "VIDEO"
          : mimeType.startsWith("audio/")
          ? "AUDIO"
          : "IMAGE",
        mimeType,
        size: file.size,
        status: perm.autoApprove ? "APPROVED" : "PENDING",
        albumId,
        uploaderName: guestName,
        guestMessage,
        giftOptionId,
      },
    });

    revalidatePath(`/couple/[slug]`, "layout");
    revalidatePath(`/w/[slug]`, "layout");

    return NextResponse.json({ success: true, mediaId: created.id });
  } catch (err: any) {
    console.error("Errore /api/upload/media:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Errore durante il caricamento." },
      { status: 500 }
    );
  }
}
