"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth, setSession } from "@/lib/auth";
import { verifyTimelineAccess } from "@/lib/accessControl";
import { hashPassword, verifyPassword } from "@/lib/password";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(
  requestedRole: string,
  email?: string,
  password?: string,
  rememberMe: boolean = false
) {
  const cleanEmail = email?.trim().toLowerCase();
  if (!cleanEmail || !password) {
    throw new Error("Inserisci email e password per accedere.");
  }

  const masterPassword = process.env.ADMIN_PASSWORD || "Gentiluna2026!";

  // Account ufficiali Staff / Vetrina
  const isOfficialAdminEmail =
    cleanEmail === "admin@gentiluna.com" || cleanEmail === "info@gentiluna.com";
  const isOfficialShowcasePro =
    cleanEmail === "demo@fotografo.it" || cleanEmail === "pro@gentiluna.com";
  const isOfficialShowcaseCouple =
    cleanEmail === "sposi@demo.it" || cleanEmail === "sposi@gentiluna.com";

  let user = await prisma.user.findFirst({
    where: { email: { equals: cleanEmail, mode: "insensitive" } },
  });

  if (isOfficialAdminEmail) {
    const dbCheck = verifyPassword(password, user?.password);
    if (password !== masterPassword && !dbCheck.valid) {
      throw new Error("Credenziali Amministratore non valide.");
    }
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          password: hashPassword(masterPassword),
          role: "ADMIN",
          name: "Super Admin GentiLuna",
        },
      });
    } else if (user.role !== "ADMIN" || dbCheck.needsRehash) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          role: "ADMIN",
          ...(dbCheck.needsRehash ? { password: hashPassword(password) } : {}),
        },
      });
    }
  } else if (isOfficialShowcasePro) {
    const dbCheck = verifyPassword(password, user?.password);
    if (password !== masterPassword && !dbCheck.valid) {
      throw new Error("Password non corretta.");
    }
    user = (await prisma.user.findFirst({ where: { email: "demo@fotografo.it" } })) || user;
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "demo@fotografo.it",
          password: hashPassword(masterPassword),
          role: "PHOTOGRAPHER",
          name: "Michele Melis Fotografo",
        },
      });
    } else if (dbCheck.needsRehash) {
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashPassword(password) },
      });
    }
  } else if (isOfficialShowcaseCouple) {
    const dbCheck = verifyPassword(password, user?.password);
    if (password !== masterPassword && !dbCheck.valid) {
      throw new Error("Password non corretta.");
    }
    user = (await prisma.user.findFirst({ where: { email: "sposi@demo.it" } })) || user;
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "sposi@demo.it",
          password: hashPassword(masterPassword),
          role: "COUPLE",
          name: "Chiara e Matteo",
        },
      });
    } else if (dbCheck.needsRehash) {
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashPassword(password) },
      });
    }
    await prisma.timelineItem.updateMany({
      where: { slug: "demo-chiara-e-matteo" },
      data: { coupleId: user.id },
    });
  } else {
    if (!user) {
      throw new Error(
        "Nessun account trovato con questa email. Clicca su 'Registrati ora' in basso per creare il tuo account."
      );
    }
    const { valid, needsRehash } = verifyPassword(password, user.password);
    if (!valid) {
      throw new Error("Password non corretta. Riprova.");
    }
    // Migrazione automatica trasparente: converte eventuali password legacy in chiaro in hash scrypt
    if (needsRehash) {
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashPassword(password) },
      });
    }
  }

  const actualRole = user.role;
  await setSession(user.id, actualRole, rememberMe);

  if (actualRole === "ADMIN") {
    return { role: actualRole, redirectUrl: "/admin" };
  }
  if (actualRole === "PHOTOGRAPHER") {
    return { role: actualRole, redirectUrl: "/dashboard" };
  }

  let wedding = await prisma.timelineItem.findFirst({
    where: {
      OR: [{ coupleId: user.id }, { ownerId: user.id }],
    },
    orderBy: { createdAt: "asc" },
  });

  if (!wedding) {
    const { generateFriendlyWeddingSlug } = await import("@/lib/slugify");
    const parts = (user.name || "Sposa e Sposo").split(/\s+(?:e|&)\s+|\s+/i);
    const brideName = parts[0] || "Sposa";
    const groomName = parts[1] || "Sposo";
    const slug = await generateFriendlyWeddingSlug(brideName, groomName, "WEDDING");
    wedding = await prisma.timelineItem.create({
      data: {
        title: "Il nostro evento",
        slug,
        type: "WEDDING",
        ownerId: user.id,
        coupleId: user.id,
        brideName,
        groomName,
      },
    });
  }

  return { role: actualRole, redirectUrl: `/couple/${wedding.slug}` };
}

export async function createWedding(formData: FormData) {
  const session = await requireAuth(["PHOTOGRAPHER"]);
  const brideName = formData.get("brideName") as string;
  const groomName = formData.get("groomName") as string;
  const location = formData.get("location") as string;
  const dateStr = formData.get("date") as string;

  const slug = `${brideName.toLowerCase()}-e-${groomName.toLowerCase()}`.replace(/[^a-z0-9-]+/g, "-");

  const wedding = await prisma.timelineItem.create({
    data: {
      brideName,
      groomName,
      slug,
      date: dateStr ? new Date(dateStr) : null,
      ownerId: session.userId,
    },
  });

  if (location) {
    await prisma.location.create({
      data: {
        name: location,
        timelineItemId: wedding.id,
      },
    });
  }

  revalidatePath("/dashboard");
}

export async function approveMedia(mediaId: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  const media = await prisma.media.findUnique({
    where: { id: mediaId },
    include: { timelineItem: true },
  });
  if (
    media?.timelineItem.ownerId !== session.userId &&
    media?.timelineItem.coupleId !== session.userId
  ) {
    throw new Error("Non autorizzato");
  }
  await prisma.media.update({
    where: { id: mediaId },
    data: { status: "APPROVED" },
  });
  revalidatePath("/couple/[slug]", "page");
}

export async function rejectMedia(mediaId: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  const media = await prisma.media.findUnique({
    where: { id: mediaId },
    include: { timelineItem: true },
  });
  if (
    media?.timelineItem.ownerId !== session.userId &&
    media?.timelineItem.coupleId !== session.userId
  ) {
    throw new Error("Non autorizzato");
  }
  await prisma.media.update({
    where: { id: mediaId },
    data: { status: "REJECTED" },
  });
  revalidatePath("/couple/[slug]", "page");
}

export async function deleteMediaAction(mediaId: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  const media = await prisma.media.findUnique({
    where: { id: mediaId },
    include: { timelineItem: true },
  });
  if (!media) throw new Error("Media non trovato");
  if (
    media.timelineItem.ownerId !== session.userId &&
    media.timelineItem.coupleId !== session.userId
  ) {
    throw new Error("Non autorizzato");
  }
  await prisma.media.delete({ where: { id: mediaId } });
  revalidatePath("/couple/[slug]", "layout");
}

export async function registerAction(role: string, data: any) {
  const cleanEmail = (data.email || "").trim().toLowerCase();
  if (!cleanEmail) throw new Error("Inserisci un indirizzo email valido.");
  if (!data.password || String(data.password).length < 6) {
    throw new Error("La password deve contenere almeno 6 caratteri.");
  }

  // Consenti in auto-registrazione solo ruoli non amministrativi
  const safeRole = role === "PHOTOGRAPHER" ? "PHOTOGRAPHER" : "COUPLE";

  const existing = await prisma.user.findFirst({
    where: { email: { equals: cleanEmail, mode: "insensitive" } },
  });
  if (existing) {
    throw new Error(
      "Questa email è già registrata. Clicca su 'Accedi ora' per entrare col tuo account."
    );
  }

  const user = await prisma.user.create({
    data: {
      email: cleanEmail,
      password: hashPassword(String(data.password)),
      name: data.name || "Nuovo Utente",
      role: safeRole,
    },
  });

  let redirectUrl = "/dashboard";

  if (safeRole === "PHOTOGRAPHER") {
    const { cleanVatNumber, getProvinceMeta, isValidItalianOrEuVat } = await import(
      "@/lib/provinceQuota"
    );
    const { checkProvinceSlotAction } = await import("@/app/actions/provinceQuotaAction");
    const { ensurePartnerShortCode } = await import("@/lib/partnerReferral");

    if (data.vatNumber && !isValidItalianOrEuVat(data.vatNumber)) {
      throw new Error(
        "Formato Partita IVA non valido. Inserisci le 11 cifre (es. 02656280902) oppure lascia il campo vuoto."
      );
    }

    const bizName = data.businessName || data.name || "Studio Professionale";
    const categoryCode = String(data.category || "PHOTOGRAPHER").toUpperCase();
    const provMeta = getProvinceMeta(data.province);
    const provCode = provMeta ? provMeta.code : null;

    let initialActive = true;
    if (provCode) {
      const slotInfo = await checkProvinceSlotAction(provCode, categoryCode);
      if (slotInfo && slotInfo.isFull) {
        initialActive = false;
        await prisma.lead.create({
          data: {
            email: cleanEmail,
            intent: "WAITLIST_NUMERO_CHIUSO",
            details: `Candidatura Lista d'Attesa Numero Chiuso: ${bizName} (${categoryCode}) in provincia ${slotInfo.provinceName}`,
          },
        });
      }
    }

    const createdPro = await prisma.professionalProfile.create({
      data: {
        userId: user.id,
        businessName: bizName,
        slug:
          bizName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") +
          "-" +
          user.id.slice(0, 4),
        category: categoryCode,
        contactEmail: cleanEmail,
        province: provCode,
        serviceArea: provMeta ? `${provMeta.name} e provincia (${provMeta.region})` : null,
        vatNumber: cleanVatNumber(data.vatNumber),
        isActive: initialActive,
      },
    });

    await ensurePartnerShortCode(createdPro.id);
    redirectUrl = "/dashboard";
  } else {
    const { generateFriendlyWeddingSlug } = await import("@/lib/slugify");
    const { resolvePartnerByInviteCode } = await import("@/lib/partnerReferral");
    const parts = (data.name || "Sposa e Sposo").split(/\s+(?:e|&)\s+|\s+/i);
    const brideName = parts[0] || "Partner 1";
    const groomName = parts[1] || "Partner 2";
    const slug = await generateFriendlyWeddingSlug(brideName, groomName, "WEDDING");
    const createdWedding = await prisma.timelineItem.create({
      data: {
        title: "Il nostro evento",
        slug,
        type: "WEDDING",
        ownerId: user.id,
        coupleId: user.id,
        brideName,
        groomName,
      },
    });

    // Se gli sposi si sono iscritti col Codice Identificativo del loro Fornitore (es. F01, W01, R01...)
    let verifiedPartnerCode = "";
    if (data.partnerCode && String(data.partnerCode).trim()) {
      const partnerRef = await resolvePartnerByInviteCode(String(data.partnerCode));
      if (partnerRef) {
        verifiedPartnerCode = partnerRef.inviteCode;
        try {
          await prisma.eventAssignment.upsert({
            where: {
              timelineItemId_professionalProfileId: {
                timelineItemId: createdWedding.id,
                professionalProfileId: partnerRef.proId,
              },
            },
            update: { status: "ACTIVE" },
            create: {
              timelineItemId: createdWedding.id,
              professionalProfileId: partnerRef.proId,
              role: partnerRef.categoryLabel,
              status: "ACTIVE",
            },
          });

          await prisma.lead.create({
            data: {
              email: cleanEmail,
              intent: "REFERRAL_PARTNER_REGISTERED",
              details: JSON.stringify({
                proId: partnerRef.proId,
                partnerCode: partnerRef.inviteCode,
                coupleUserId: user.id,
                weddingId: createdWedding.id,
                weddingSlug: slug,
              }),
            },
          });

          await prisma.notification.create({
            data: {
              userId: partnerRef.userId,
              type: "INFO",
              title: `Nuovi Sposi iscritti col tuo Codice ${partnerRef.inviteCode}!`,
              message: `${brideName} & ${groomName} hanno creato il loro spazio GentiLuna inserendo il tuo Codice Partner (${partnerRef.inviteCode}). Quando attiveranno il piano avranno il -15% e il matrimonio conterà per i tuoi bonus rinnovo (-50% a 5 eventi, 100% gratis a 10 eventi).`,
              link: "/dashboard",
            },
          });
        } catch {}
      }
    }

    redirectUrl = verifiedPartnerCode
      ? `/couple/${slug}?partner=${encodeURIComponent(verifiedPartnerCode)}`
      : `/couple/${slug}`;
  }

  await setSession(user.id, safeRole, true);
  return { role: user.role, redirectUrl };
}

export async function getLiveMedia(slug: string) {
  const wedding = await prisma.timelineItem.findUnique({ where: { slug } });
  if (!wedding) return [];

  const hasAccess = await verifyTimelineAccess(wedding, "VIEW_PUBLIC");
  if (!hasAccess) {
    return [];
  }

  const { getUserEntitlements } = await import("@/lib/entitlementHelper");
  const entitlements = await getUserEntitlements(wedding.ownerId);
  if (!entitlements.canUseLiveProjection) {
    throw new Error("La proiezione live è disponibile solo col piano Diamond.");
  }

  const media = await prisma.media.findMany({
    where: {
      timelineItemId: wedding.id,
      type: "IMAGE",
      status: "APPROVED",
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return media.map((m: any) => ({
    url: m.url.startsWith("http") && !m.url.includes("supabase.co") ? m.url : `/api/media/${m.id}`,
    uploaderName: m.uploaderName,
    guestMessage: m.guestMessage,
  }));
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/");
}
