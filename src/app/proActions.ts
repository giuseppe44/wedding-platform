"use server";

import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { requireAuth, getSession } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { uploadFile } from "@/lib/storage";
import { revalidatePath } from "next/cache";
import { cleanVatNumber, getProvinceMeta, isValidItalianOrEuVat } from "@/lib/provinceQuota";
import { checkProvinceSlotAction } from "@/app/actions/provinceQuotaAction";
import { ensurePartnerShortCode } from "@/lib/partnerReferral";

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.com",
  "10minutemail.com",
  "yopmail.com",
  "guerrillamail.com",
  "sharklasers.com",
  "trashmail.com",
  "fakeinbox.com",
  "maildrop.cc",
]);

async function resolveEditableProProfile(sessionUserId: string, isAdmin: boolean, profileId?: string) {
  if (profileId) {
    const found = await prisma.professionalProfile.findUnique({ where: { id: profileId } });
    if (!found) throw new Error("Vetrina non trovata.");
    if (!isAdmin && found.userId !== sessionUserId && found.parentUserId !== sessionUserId) {
      throw new Error("Non autorizzato a modificare questa vetrina.");
    }
    return found;
  }
  return prisma.professionalProfile.findUnique({ where: { userId: sessionUserId } });
}

export async function upsertProfile(data: any) {
  const session = await requireAuth(["PHOTOGRAPHER", "ADMIN"]);
  const isAdmin = session.role === "ADMIN";

  const cleanSlug = String(data.slug || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");

  if (!cleanSlug) {
    throw new Error("Inserisci uno slug valido per l'URL della vetrina.");
  }

  const targetExisting = await resolveEditableProProfile(
    session.userId,
    isAdmin,
    data.profileId || data.id
  );

  const slugCollision = await prisma.professionalProfile.findUnique({
    where: { slug: cleanSlug },
  });
  if (slugCollision && (!targetExisting || slugCollision.id !== targetExisting.id)) {
    throw new Error("Questo indirizzo vetrina (/pro/...) è già in uso. Scegline un altro.");
  }

  if (data.vatNumber && !isValidItalianOrEuVat(data.vatNumber)) {
    throw new Error(
      "Formato Partita IVA non valido. Inserisci le 11 cifre (es. 02656280902 o IT02656280902) oppure lascia il campo vuoto."
    );
  }
  const normalizedVat = cleanVatNumber(data.vatNumber);
  const provMeta = getProvinceMeta(data.province || data.serviceArea);
  const normalizedProvince = provMeta ? provMeta.code : data.province ? String(data.province).toUpperCase().slice(0, 4) : null;
  const targetCategory = String(data.category || "PHOTOGRAPHER").toUpperCase();

  // Controllo Numero Chiuso per Provincia se attiva o se cambia provincia/categoria
  let nextIsActive = data.isActive ?? true;
  if (nextIsActive && normalizedProvince) {
    const provinceChanged = !targetExisting || targetExisting.province !== normalizedProvince || targetExisting.category !== targetCategory || !targetExisting.isActive;
    if (provinceChanged) {
      const slotCheck = await checkProvinceSlotAction(normalizedProvince, targetCategory);
      if (slotCheck && slotCheck.isFull) {
        nextIsActive = false;
        await prisma.lead.create({
          data: {
            email: data.contactEmail || "partner@gentiluna.com",
            intent: "WAITLIST_NUMERO_CHIUSO",
            details: `Lista d'attesa Numero Chiuso: ${data.businessName} (${targetCategory}) in provincia ${slotCheck.provinceName} (${slotCheck.occupiedSlots}/${slotCheck.maxSlots})`,
          },
        });
      }
    }
  }

  const cleanGallery = Array.isArray(data.gallery)
    ? data.gallery
        .map((u: string) => String(u || "").trim())
        .filter((u: string) => u !== "")
        .slice(0, 15)
    : [];

  const computedServiceArea =
    data.serviceArea?.trim() ||
    (provMeta ? `${provMeta.name} e provincia (${provMeta.region})` : "");

  let profile;
  if (targetExisting) {
    profile = await prisma.professionalProfile.update({
      where: { id: targetExisting.id },
      data: {
        category: targetCategory,
        businessName: data.businessName,
        slug: cleanSlug,
        description: data.description,
        website: data.website,
        whatsapp: data.whatsapp,
        instagram: data.instagram,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        isActive: nextIsActive,
        logoUrl: data.logoUrl,
        coverImage: data.coverImage,
        profileImage: data.profileImage,
        gallery: cleanGallery,
        video1: data.video1,
        video2: data.video2,
        serviceArea: computedServiceArea,
        province: normalizedProvince,
        vatNumber: normalizedVat,
      },
    });
  } else {
    profile = await prisma.professionalProfile.create({
      data: {
        userId: session.userId,
        category: targetCategory,
        businessName: data.businessName,
        slug: cleanSlug,
        description: data.description,
        website: data.website,
        whatsapp: data.whatsapp,
        instagram: data.instagram,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        isActive: nextIsActive,
        logoUrl: data.logoUrl,
        coverImage: data.coverImage,
        profileImage: data.profileImage,
        gallery: cleanGallery,
        video1: data.video1,
        video2: data.video2,
        serviceArea: computedServiceArea,
        province: normalizedProvince,
        vatNumber: normalizedVat,
      },
    });
  }

  // Se l'utente ha aggiornato la Partita IVA sulla vetrina principale, sincronizzala anche sulla eventuale 2ª Vetrina
  if (normalizedVat) {
    await prisma.professionalProfile.updateMany({
      where: {
        OR: [{ userId: session.userId }, { parentUserId: session.userId }],
      },
      data: { vatNumber: normalizedVat },
    });
  }

  // Assicura assegnazione Codice Identificativo Fornitore (es. F01, W01, R01...)
  const shortCode = await ensurePartnerShortCode(profile.id);
  profile = { ...profile, partnerCode: shortCode };

  revalidatePath("/dashboard", "page");
  revalidatePath("/dashboard/profile", "page");
  revalidatePath(`/pro/${profile.slug}`, "page");
  revalidatePath("/fornitori", "page");
  return profile;
}

/**
 * Attiva una 2ª Vetrina collegata allo stesso account / stessa Partita IVA
 * (es. Studio che offre sia Fotografia sia Videomaking, oppure Location + Ristorante).
 */
export async function createSecondShowcase(data: {
  businessName: string;
  category: string;
  province?: string;
  vatNumber?: string;
}) {
  const session = await requireAuth(["PHOTOGRAPHER", "ADMIN"]);

  const existingShowcases = await prisma.professionalProfile.findMany({
    where: {
      OR: [{ userId: session.userId }, { parentUserId: session.userId }],
    },
    orderBy: { createdAt: "asc" },
  });

  if (existingShowcases.length === 0) {
    throw new Error("Completa e salva prima la tua Vetrina Principale (#1).");
  }

  if (existingShowcases.length >= 2) {
    throw new Error("Hai già raggiunto il limite massimo di 2 Vetrine collegate allo stesso account / P.IVA.");
  }

  const primary = existingShowcases[0];
  const rawVat = data.vatNumber || primary.vatNumber || "";
  if (rawVat && !isValidItalianOrEuVat(rawVat)) {
    throw new Error("Inserisci una Partita IVA valida (11 cifre).");
  }
  const finalVat = cleanVatNumber(rawVat);

  const bizName = (data.businessName || "").trim();
  if (bizName.length < 2) {
    throw new Error("Inserisci il nome della 2ª Vetrina / Secondo Brand.");
  }

  const cat = String(data.category || "VIDEOMAKER").toUpperCase();
  const provCode =
    getProvinceMeta(data.province || primary.province || primary.serviceArea)?.code ||
    primary.province ||
    null;
  const provMeta = getProvinceMeta(provCode);

  let isActive = true;
  if (provCode) {
    const slotCheck = await checkProvinceSlotAction(provCode, cat);
    if (slotCheck && slotCheck.isFull) {
      isActive = false;
    }
  }

  // Crea account tecnico interno collegato per rispettare il vincolo @unique su userId senza toccare le relazioni esistenti
  const subEmail = `vetrina2+${session.userId}@partner.gentiluna.internal`;
  let subUser = await prisma.user.findUnique({ where: { email: subEmail } });
  if (!subUser) {
    subUser = await prisma.user.create({
      data: {
        email: subEmail,
        password: hashPassword(crypto.randomUUID()),
        name: `${bizName} (2ª Vetrina)`,
        role: "PHOTOGRAPHER",
      },
    });
  }

  const baseSlug = bizName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const uniqueSlug = `${baseSlug || "vetrina-2"}-${Math.random().toString(36).substring(2, 6)}`;

  if (finalVat && !primary.vatNumber) {
    await prisma.professionalProfile.update({
      where: { id: primary.id },
      data: { vatNumber: finalVat },
    });
  }

  const created = await prisma.professionalProfile.create({
    data: {
      userId: subUser.id,
      parentUserId: session.userId,
      businessName: bizName,
      slug: uniqueSlug,
      category: cat,
      vatNumber: finalVat,
      province: provCode,
      serviceArea:
        primary.serviceArea ||
        (provMeta ? `${provMeta.name} e provincia (${provMeta.region})` : ""),
      contactEmail: primary.contactEmail,
      contactPhone: primary.contactPhone,
      whatsapp: primary.whatsapp,
      website: primary.website,
      instagram: primary.instagram,
      isActive,
      gallery: [],
    },
    include: { services: true },
  });

  const shortCode = await ensurePartnerShortCode(created.id);

  revalidatePath("/dashboard", "page");
  revalidatePath("/dashboard/profile", "page");
  revalidatePath("/fornitori", "page");

  return { ...created, partnerCode: shortCode };
}

/**
 * Auto-salva immediatamente un campo immagine (logo, avatar, copertina o galleria portfolio)
 * appena l'upload su Cloud termina, così il professionista non perde MAI le foto caricate!
 */
export async function saveUploadedProMediaField(params: {
  profileId?: string;
  field: "logoUrl" | "profileImage" | "coverImage" | "gallery";
  value: string | string[];
}) {
  const session = await requireAuth(["PHOTOGRAPHER", "ADMIN"]);
  const isAdmin = session.role === "ADMIN";
  const target = await resolveEditableProProfile(session.userId, isAdmin, params.profileId);
  if (!target) {
    return { savedToDb: false };
  }

  const updateData: any = {};
  if (params.field === "gallery") {
    const arr = Array.isArray(params.value) ? params.value : [params.value];
    updateData.gallery = arr
      .map((u) => String(u || "").trim())
      .filter(Boolean)
      .slice(0, 15);
  } else {
    updateData[params.field] = String(params.value || "").trim();
  }

  const updated = await prisma.professionalProfile.update({
    where: { id: target.id },
    data: updateData,
  });

  revalidatePath("/dashboard/profile", "page");
  revalidatePath(`/pro/${updated.slug}`, "page");
  revalidatePath("/fornitori", "page");
  return { savedToDb: true };
}

export async function createService(data: any, profileId?: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "ADMIN"]);
  const profile = await resolveEditableProProfile(
    session.userId,
    session.role === "ADMIN",
    profileId || data.profileId
  );
  if (!profile) throw new Error("Salva prima le informazioni base della vetrina.");

  await prisma.professionalService.create({
    data: {
      profileId: profile.id,
      name: data.name,
      description: data.description,
      priceIndicative: data.priceIndicative,
      order: parseInt(data.order) || 0,
    },
  });

  revalidatePath("/dashboard/profile", "page");
  revalidatePath(`/pro/${profile.slug}`, "page");
}

export async function updateService(serviceId: string, data: any) {
  const session = await requireAuth(["PHOTOGRAPHER", "ADMIN"]);
  const service = await prisma.professionalService.findUnique({
    where: { id: serviceId },
    include: { profile: true },
  });

  if (
    !service ||
    (session.role !== "ADMIN" &&
      service.profile.userId !== session.userId &&
      service.profile.parentUserId !== session.userId)
  ) {
    throw new Error("Non autorizzato");
  }

  await prisma.professionalService.update({
    where: { id: serviceId },
    data: {
      name: data.name,
      description: data.description,
      priceIndicative: data.priceIndicative,
      order: parseInt(data.order) || 0,
    },
  });

  revalidatePath("/dashboard/profile", "page");
  revalidatePath(`/pro/${service.profile.slug}`, "page");
}

export async function deleteService(serviceId: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "ADMIN"]);
  const service = await prisma.professionalService.findUnique({
    where: { id: serviceId },
    include: { profile: true },
  });

  if (
    !service ||
    (session.role !== "ADMIN" &&
      service.profile.userId !== session.userId &&
      service.profile.parentUserId !== session.userId)
  ) {
    throw new Error("Non autorizzato");
  }

  await prisma.professionalService.delete({ where: { id: serviceId } });

  revalidatePath("/dashboard/profile", "page");
  revalidatePath(`/pro/${service.profile.slug}`, "page");
}

/**
 * Recensioni Verificate & Anti-Falsificazione:
 * 1) Accetta SOLO recensioni di eventi reali avvenuti negli ULTIMI 24 MESI (2 anni) e non futuri.
 * 2) 1 sola recensione consentita per indirizzo email (blocco duplicati e mail temporanee).
 * 3) Vietata auto-recensione con email del fornitore.
 */
export async function leavePublicReview(
  proId: string,
  rating: number,
  text: string,
  data: { email: string; brideName: string; groomName: string; weddingDate?: string }
) {
  const cleanEmail = (data.email || "").trim().toLowerCase();
  const cleanText = (text || "").trim();
  const cleanBride = (data.brideName || "").trim();
  const cleanGroom = (data.groomName || "").trim();

  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw new Error("Inserisci un indirizzo email reale e valido.");
  }

  const emailDomain = cleanEmail.split("@")[1] || "";
  if (DISPOSABLE_EMAIL_DOMAINS.has(emailDomain)) {
    throw new Error("Non sono ammessi indirizzi email temporanei per lasciare recensioni.");
  }

  if (cleanText.length < 25) {
    throw new Error(
      "Racconta la tua esperienza con almeno 25 caratteri per garantire recensioni autentiche e utili alle altre coppie."
    );
  }

  if (!data.weddingDate) {
    throw new Error(
      "Indica la data reale del matrimonio/evento: accettiamo solo recensioni relative agli ultimi 2 anni."
    );
  }

  const parsedDate = new Date(data.weddingDate);
  if (isNaN(parsedDate.getTime())) {
    throw new Error("Data dell'evento non valida.");
  }

  const now = new Date();
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate(), 0, 0, 0);

  if (parsedDate > endOfToday) {
    throw new Error(
      "Puoi lasciare una recensione solo per un matrimonio o evento già celebrato (non con data futura)."
    );
  }

  if (parsedDate < twoYearsAgo) {
    throw new Error(
      "Per garantire la massima attualità e trasparenza, GentiLuna accetta esclusivamente recensioni di eventi svolti negli ultimi 2 anni (24 mesi)."
    );
  }

  const targetPro = await prisma.professionalProfile.findUnique({
    where: { id: proId },
    include: { user: { select: { email: true } } },
  });
  if (!targetPro) {
    throw new Error("Professionista non trovato.");
  }

  if (
    targetPro.contactEmail?.trim().toLowerCase() === cleanEmail ||
    targetPro.user?.email?.trim().toLowerCase() === cleanEmail
  ) {
    throw new Error("Non è consentito lasciare recensioni sulla propria vetrina professionale.");
  }

  // Controllo anti-duplicato rigoroso per email: 1 email = max 1 recensione pubblica
  const existingReviewByEmail = await prisma.review.findFirst({
    where: {
      OR: [
        { authorEmail: { equals: cleanEmail, mode: "insensitive" } },
      ],
    },
  });
  if (existingReviewByEmail) {
    throw new Error(
      "Questo indirizzo email è già stato utilizzato per lasciare una recensione verificata su GentiLuna."
    );
  }

  const session = await getSession();
  let existingUser = await prisma.user.findFirst({
    where: { email: { equals: cleanEmail, mode: "insensitive" } },
  });

  if (existingUser) {
    if (existingUser.role === "PHOTOGRAPHER") {
      throw new Error("Gli account Fornitore non possono inviare recensioni pubbliche.");
    }

    const alreadyReviewedByUser = await prisma.review.findFirst({
      where: { authorId: existingUser.id },
    });
    if (alreadyReviewedByUser) {
      throw new Error(
        "Hai già pubblicato una recensione verificata con questa email. Ogni indirizzo email può lasciare una sola recensione."
      );
    }

    // Se l'utente è già autenticato con la propria email, collega la recensione al suo evento reale
    if (session && session.userId === existingUser.id) {
      let wedding = await prisma.timelineItem.findFirst({
        where: { OR: [{ coupleId: existingUser.id }, { ownerId: existingUser.id }] },
        orderBy: { createdAt: "asc" },
      });
      if (!wedding) {
        const { generateFriendlyWeddingSlug } = await import("@/lib/slugify");
        const slug = await generateFriendlyWeddingSlug(
          cleanBride || "Sposa",
          cleanGroom || "Sposo",
          "WEDDING"
        );
        wedding = await prisma.timelineItem.create({
          data: {
            title: "Il nostro Matrimonio",
            slug,
            type: "WEDDING",
            ownerId: existingUser.id,
            coupleId: existingUser.id,
            brideName: cleanBride || "Sposa",
            groomName: cleanGroom || "Sposo",
            date: parsedDate,
          },
        });
      }

      await prisma.review.create({
        data: {
          authorId: existingUser.id,
          authorEmail: cleanEmail,
          rating: Math.min(5, Math.max(1, Math.round(rating))),
          text: cleanText,
          eventDate: parsedDate,
          timelineItemId: wedding.id,
          professionalProfileId: proId,
        },
      });

      revalidatePath("/pro/[slug]", "layout");
      revalidatePath(`/pro/${targetPro.slug}`, "page");
      return;
    }

    throw new Error(
      "Questa email appartiene a un account già registrato: effettua prima il Login per inviare la tua recensione verificata."
    );
  }

  existingUser = await prisma.user.create({
    data: {
      email: cleanEmail,
      password: hashPassword(crypto.randomUUID()),
      name: cleanGroom ? `${cleanBride} & ${cleanGroom}` : cleanBride,
      role: "COUPLE",
    },
  });

  const { generateFriendlyWeddingSlug } = await import("@/lib/slugify");
  const friendlySlug = await generateFriendlyWeddingSlug(
    cleanBride,
    cleanGroom || "Partner",
    "WEDDING"
  );

  const wedding = await prisma.timelineItem.create({
    data: {
      title: "Il nostro Matrimonio",
      slug: friendlySlug,
      type: "WEDDING",
      ownerId: existingUser.id,
      coupleId: existingUser.id,
      brideName: cleanBride,
      groomName: cleanGroom || "",
      date: parsedDate,
    },
  });

  await prisma.review.create({
    data: {
      authorId: existingUser.id,
      authorEmail: cleanEmail,
      rating: Math.min(5, Math.max(1, Math.round(rating))),
      text: cleanText,
      eventDate: parsedDate,
      timelineItemId: wedding.id,
      professionalProfileId: proId,
    },
  });

  revalidatePath("/pro/[slug]", "layout");
  revalidatePath(`/pro/${targetPro.slug}`, "page");
}

export async function uploadProMedia(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const session = await requireAuth(["PHOTOGRAPHER", "ADMIN"]);
    const file = formData.get("file") as File;
    if (!file || file.size === 0) return { success: false, error: "Nessun file selezionato" };

    if (!file.type.startsWith("image/")) {
      return { success: false, error: "Sono consentite solo immagini (JPEG, PNG, WebP, HEIC, TIFF)" };
    }
    if (file.size > 40 * 1024 * 1024) {
      return { success: false, error: "Immagine troppo grande (massimo 40MB)" };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uniqueName = `pro-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 7)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    const storagePath = await uploadFile(`pro-${session.userId}`, uniqueName, buffer, file.type);

    return { success: true, url: `/api/media/pro?path=${encodeURIComponent(storagePath)}` };
  } catch (err: any) {
    console.error("Errore uploadProMedia:", err);
    return {
      success: false,
      error: err?.message || "Errore durante il caricamento dell'immagine",
    };
  }
}
