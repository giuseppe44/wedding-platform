"use client";

export interface ImageOptimizeOptions {
  maxDimension?: number;
  quality?: number;
  skipBelowBytes?: number;
}

/**
 * Ottimizzazione immagini lato browser a memoria controllata (usa ObjectURL invece di Base64 DataURL
 * per azzerare i picchi di RAM e i crash su Safari/Chrome anche con 15-20 scatti da 25MB).
 * Se il file è già leggero, oppure è HEIC/TIFF/RAW non decodificabile via Canvas o Video,
 * restituisce in sicurezza il file originale (che verrà caricato via Signed Upload URL diretto).
 */
export async function optimizeImageForUpload(
  file: File,
  options: ImageOptimizeOptions = {}
): Promise<File> {
  const maxDimension = options.maxDimension ?? 2560;
  const quality = options.quality ?? 0.88;
  const skipBelowBytes = options.skipBelowBytes ?? 1.2 * 1024 * 1024; // < 1.2 MB già leggero

  const nameLower = file.name.toLowerCase();
  const isDecodableRaster =
    file.type === "image/jpeg" ||
    file.type === "image/jpg" ||
    file.type === "image/png" ||
    file.type === "image/webp" ||
    nameLower.endsWith(".jpg") ||
    nameLower.endsWith(".jpeg") ||
    nameLower.endsWith(".png") ||
    nameLower.endsWith(".webp");

  if (!isDecodableRaster) {
    return file;
  }

  if (file.size <= skipBelowBytes && (file.type === "image/jpeg" || file.type === "image/webp")) {
    return file;
  }

  return new Promise<File>((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new window.Image();
    let settled = false;

    const finish = (result: File) => {
      if (settled) return;
      settled = true;
      try {
        URL.revokeObjectURL(objectUrl);
      } catch {}
      resolve(result);
    };

    const safetyTimer = window.setTimeout(() => {
      finish(file);
    }, 12000);

    img.onload = () => {
      window.clearTimeout(safetyTimer);
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (!width || !height) {
          finish(file);
          return;
        }

        if (width > maxDimension || height > maxDimension) {
          if (width >= height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          finish(file);
          return;
        }

        // Mantieni trasparenza PNG per loghi piccoli, altrimenti JPEG Ultra-HD
        const keepPngTransparency =
          (file.type === "image/png" || nameLower.endsWith(".png")) && file.size < 4 * 1024 * 1024;

        if (!keepPngTransparency) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
        }
        ctx.drawImage(img, 0, 0, width, height);

        const outMime = keepPngTransparency ? "image/png" : "image/jpeg";
        const outExt = keepPngTransparency ? ".png" : ".jpg";

        canvas.toBlob(
          (blob) => {
            // Libera subito memoria canvas
            canvas.width = 1;
            canvas.height = 1;

            if (!blob || blob.size === 0) {
              finish(file);
              return;
            }
            // Se il blob ricompresso pesa più dell'originale e l'originale è già sotto 3.5MB, tieni l'originale
            if (blob.size >= file.size && file.size < 3.5 * 1024 * 1024) {
              finish(file);
              return;
            }
            const cleanBase = file.name.replace(/\.[^/.]+$/, "") || "photo";
            finish(
              new File([blob], `${cleanBase}${outExt}`, {
                type: outMime,
                lastModified: Date.now(),
              })
            );
          },
          outMime,
          keepPngTransparency ? undefined : quality
        );
      } catch {
        finish(file);
      }
    };

    img.onerror = () => {
      window.clearTimeout(safetyTimer);
      finish(file);
    };

    img.src = objectUrl;
  });
}

/**
 * Carica un'immagine per la Vetrina / Portfolio Fornitore:
 * 1) Ottimizza in Ultra-HD (max 2560px, qualità 88%) senza consumo eccessivo di RAM
 * 2) Richiede Signed Upload URL su Supabase Storage e carica direttamente in cloud (0 limiti 4.5MB Vercel)
 * 3) Fallback automatico su multipart POST /api/upload/pro se ambiente locale o rete ristretta
 */
export async function uploadProImageClient(
  rawFile: File,
  options?: { isLogo?: boolean; profileId?: string }
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    if (!rawFile || rawFile.size === 0) {
      return { success: false, error: "File vuoto o non valido." };
    }
    if (rawFile.size > 40 * 1024 * 1024) {
      return { success: false, error: "L'immagine supera il limite massimo di 40 MB." };
    }

    const optimized = await optimizeImageForUpload(rawFile, {
      maxDimension: options?.isLogo ? 1200 : 2560,
      quality: options?.isLogo ? 0.9 : 0.88,
      skipBelowBytes: options?.isLogo ? 600 * 1024 : 1.2 * 1024 * 1024,
    });

    const mimeType = optimized.type || rawFile.type || "image/jpeg";

    // Step 1: prova caricamento diretto Cloud tramite Signed Upload URL (zero crash e zero limite 4.5MB)
    try {
      const initRes = await fetch("/api/upload/pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "init",
          fileName: optimized.name,
          mimeType,
          size: optimized.size,
          profileId: options?.profileId || undefined,
        }),
      });

      if (initRes.ok) {
        const initData = await initRes.json();
        if (initData.cloudDirect && initData.signedUrl && initData.publicProxyUrl) {
          const putRes = await fetch(initData.signedUrl, {
            method: "PUT",
            headers: {
              "Content-Type": mimeType,
              "x-upsert": "false",
            },
            body: optimized,
          });

          if (putRes.ok) {
            return { success: true, url: initData.publicProxyUrl };
          }
        }
      }
    } catch {
      // Fallback trasparente su multipart qui sotto
    }

    // Step 2: Fallback multipart su API Route JSON (non usa RSC Server Action quindi non fa mai crashare la pagina)
    if (optimized.size > 4.2 * 1024 * 1024) {
      // Ulteriore riduzione di sicurezza se il fallback passa da serverless Vercel
      const smaller = await optimizeImageForUpload(optimized, {
        maxDimension: 1920,
        quality: 0.82,
        skipBelowBytes: 0,
      });
      const fd = new FormData();
      fd.append("file", smaller);
      if (options?.profileId) fd.append("profileId", options.profileId);
      const fbRes = await fetch("/api/upload/pro", { method: "POST", body: fd });
      const fbJson = await fbRes.json().catch(() => null);
      if (!fbRes.ok || !fbJson?.success) {
        return {
          success: false,
          error: fbJson?.error || `Errore caricamento (${fbRes.status}). Riprova con un file JPG/PNG.`,
        };
      }
      return { success: true, url: fbJson.url };
    }

    const formData = new FormData();
    formData.append("file", optimized);
    if (options?.profileId) formData.append("profileId", options.profileId);

    const res = await fetch("/api/upload/pro", {
      method: "POST",
      body: formData,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) {
      return {
        success: false,
        error: data?.error || `Errore caricamento (${res.status}).`,
      };
    }
    return { success: true, url: data.url };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Errore imprevisto durante il caricamento dell'immagine.",
    };
  }
}

/**
 * Carica un singolo file (foto, video o audio) nella galleria di un Evento/Capitolo:
 * elabora 1 file alla volta, usa Signed Upload URL diretto su Supabase (fino a 100MB per video/foto HD)
 * e registra il media nel DB con risposta JSON sicura.
 */
export async function uploadTimelineMediaClient(
  timelineItemId: string,
  rawFile: File,
  meta?: {
    albumId?: string;
    guestName?: string;
    guestMessage?: string;
    giftOptionId?: string;
    highResPro?: boolean;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!rawFile || rawFile.size === 0) {
      return { success: false, error: "File vuoto." };
    }
    if (rawFile.size > 100 * 1024 * 1024) {
      return { success: false, error: `Il file "${rawFile.name}" supera i 100 MB.` };
    }

    const fileToSend = rawFile.type.startsWith("image/")
      ? await optimizeImageForUpload(rawFile, {
          maxDimension: meta?.highResPro ? 2560 : 2048,
          quality: meta?.highResPro ? 0.88 : 0.84,
          skipBelowBytes: 1.1 * 1024 * 1024,
        })
      : rawFile;

    let mimeType = fileToSend.type || rawFile.type;
    const lower = fileToSend.name.toLowerCase();
    if (!mimeType || mimeType === "application/octet-stream") {
      if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) mimeType = "image/jpeg";
      else if (lower.endsWith(".png")) mimeType = "image/png";
      else if (lower.endsWith(".webp")) mimeType = "image/webp";
      else if (lower.endsWith(".heic")) mimeType = "image/heic";
      else if (lower.endsWith(".heif")) mimeType = "image/heif";
      else if (lower.endsWith(".mp4")) mimeType = "video/mp4";
      else if (lower.endsWith(".mov")) mimeType = "video/quicktime";
      else if (lower.endsWith(".mp3")) mimeType = "audio/mpeg";
    }

    // Step 1: Signed Direct Upload su Supabase Storage
    const initRes = await fetch("/api/upload/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "init",
        timelineItemId,
        fileName: fileToSend.name,
        mimeType,
        size: fileToSend.size,
      }),
    });

    const initJson = await initRes.json().catch(() => null);
    if (!initRes.ok) {
      return {
        success: false,
        error: initJson?.error || "Impossibile avviare il caricamento del file.",
      };
    }

    if (initJson?.cloudDirect && initJson?.signedUrl && initJson?.storagePath) {
      const putRes = await fetch(initJson.signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": mimeType || "application/octet-stream",
          "x-upsert": "false",
        },
        body: fileToSend,
      });

      if (putRes.ok) {
        const completeRes = await fetch("/api/upload/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "complete",
            timelineItemId,
            storagePath: initJson.storagePath,
            mimeType,
            size: fileToSend.size,
            albumId: meta?.albumId || null,
            guestName: meta?.guestName || null,
            guestMessage: meta?.guestMessage || null,
            giftOptionId: meta?.giftOptionId || null,
          }),
        });
        const completeJson = await completeRes.json().catch(() => null);
        if (!completeRes.ok || !completeJson?.success) {
          return {
            success: false,
            error: completeJson?.error || "Errore nel salvataggio finale del file.",
          };
        }
        return { success: true };
      }
    }

    // Step 2: Fallback multipart diretto (ambienti locali o se PUT diretto bloccato da firewall)
    const fd = new FormData();
    fd.append("timelineItemId", timelineItemId);
    fd.append("file", fileToSend);
    if (meta?.albumId) fd.append("albumId", meta.albumId);
    if (meta?.guestName) fd.append("guestName", meta.guestName);
    if (meta?.guestMessage) fd.append("guestMessage", meta.guestMessage);
    if (meta?.giftOptionId) fd.append("giftOptionId", meta.giftOptionId);

    const fbRes = await fetch("/api/upload/media", { method: "POST", body: fd });
    const fbJson = await fbRes.json().catch(() => null);
    if (!fbRes.ok || !fbJson?.success) {
      return {
        success: false,
        error: fbJson?.error || `Errore caricamento (${fbRes.status}).`,
      };
    }
    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Errore durante il caricamento.",
    };
  }
}
