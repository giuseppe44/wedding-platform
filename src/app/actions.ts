"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth, setSession } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(requestedRole: string, email?: string, password?: string, rememberMe: boolean = false) {
  let user;
  const cleanEmail = email?.trim().toLowerCase();
  const isDemoEmail = !cleanEmail || [
    "sposi@demo.it",
    "demo@fotografo.it",
    "admin@gentiluna.com",
    "admin@weddingplatform.com"
  ].includes(cleanEmail);

  if (cleanEmail) {
    user = await prisma.user.findFirst({
      where: { email: { equals: cleanEmail, mode: "insensitive" } }
    });
  }

  // If a real user typed a non-demo email that doesn't exist, show a clear error instead of logging into demo
  if (!user && !isDemoEmail) {
    throw new Error("Nessun account trovato con questa email. Clicca su 'Registrati' in basso per creare il tuo account.");
  }

  // Check password for real users who set a password
  if (user && !isDemoEmail && user.password && user.password !== "hashed_password" && password && user.password !== password) {
    throw new Error("Password non corretta. Riprova.");
  }

  // Fallback for demo accounts if demo email was used
  if (!user) {
    if (requestedRole === "PHOTOGRAPHER" || cleanEmail === "demo@fotografo.it") {
      user = await prisma.user.findFirst({ where: { role: "PHOTOGRAPHER" } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: "demo@fotografo.it",
            password: "hashed_password",
            role: "PHOTOGRAPHER",
            name: "Studio Fotografico Demo",
          },
        });
      }
    } else if (requestedRole === "ADMIN" || cleanEmail === "admin@gentiluna.com" || cleanEmail === "admin@weddingplatform.com") {
      user = await prisma.user.findFirst({ where: { role: "ADMIN" } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: "admin@gentiluna.com",
            password: "hashed_password",
            role: "ADMIN",
            name: "Super Admin",
          },
        });
      }
    } else {
      user = await prisma.user.findFirst({ where: { email: "sposi@demo.it" } }) || await prisma.user.findFirst({ where: { role: "COUPLE" } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: "sposi@demo.it",
            password: "hashed_password",
            role: "COUPLE",
            name: "Chiara e Matteo",
          },
        });
        await prisma.timelineItem.updateMany({
          where: { slug: "demo-chiara-e-matteo" },
          data: { coupleId: user.id }
        });
      }
      await prisma.timelineItem.updateMany({
        where: { slug: "demo-chiara-e-matteo", coupleId: null },
        data: { coupleId: user.id }
      });
    }
  }

  // Authorize based on actual DB role, NOT the requested URL role
  const actualRole = user.role;
  await setSession(user.id, actualRole, rememberMe);

  if (actualRole === "ADMIN") {
    return { role: actualRole, redirectUrl: "/admin" };
  }
  if (actualRole === "PHOTOGRAPHER") {
    return { role: actualRole, redirectUrl: "/dashboard" };
  }

  // Find or create the couple's own event space
  let wedding = await prisma.timelineItem.findFirst({
    where: {
      OR: [
        { coupleId: user.id },
        { ownerId: user.id }
      ]
    },
    orderBy: { createdAt: "asc" }
  });

  if (!wedding) {
    const slug = user.email === "sposi@demo.it" ? "demo-chiara-e-matteo" : `nozze-${user.id.slice(0, 6)}`;
    wedding = await prisma.timelineItem.findUnique({ where: { slug } });
    if (!wedding) {
      const parts = (user.name || "Sposa e Sposo").split(/\s+(?:e|&)\s+|\s+/i);
      wedding = await prisma.timelineItem.create({
        data: {
          title: "Il nostro matrimonio",
          slug,
          type: "WEDDING",
          ownerId: user.id,
          coupleId: user.id,
          brideName: parts[0] || "Sposa",
          groomName: parts[1] || "Sposo",
        }
      });
    }
  }

  return { role: actualRole, redirectUrl: `/couple/${wedding.slug}` };
}


export async function createWedding(formData: FormData) {
  const session = await requireAuth(["PHOTOGRAPHER"]);
  const brideName = formData.get("brideName") as string;
  const groomName = formData.get("groomName") as string;
  const location = formData.get("location") as string;
  const dateStr = formData.get("date") as string;

  const slug = `${brideName.toLowerCase()}-e-${groomName.toLowerCase()}`.replace(/\s+/g, '-');
  
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
        timelineItemId: wedding.id
      }
    });
  }

  revalidatePath("/dashboard");
}

export async function approveMedia(mediaId: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  const media = await prisma.media.findUnique({ where: { id: mediaId }, include: { timelineItem: true } });
  if (media?.timelineItem.ownerId !== session.userId && media?.timelineItem.coupleId !== session.userId) throw new Error("Non autorizzato");
  await prisma.media.update({
    where: { id: mediaId },
    data: { status: "APPROVED" },
  });
  revalidatePath("/couple/[slug]", "page");
}

export async function rejectMedia(mediaId: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  const media = await prisma.media.findUnique({ where: { id: mediaId }, include: { timelineItem: true } });
  if (media?.timelineItem.ownerId !== session.userId && media?.timelineItem.coupleId !== session.userId) throw new Error("Non autorizzato");
  await prisma.media.update({
    where: { id: mediaId },
    data: { status: "REJECTED" },
  });
  revalidatePath("/couple/[slug]", "page");
}

export async function deleteMediaAction(mediaId: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  const media = await prisma.media.findUnique({ where: { id: mediaId }, include: { timelineItem: true } });
  if (!media) throw new Error("Media non trovato");
  if (media.timelineItem.ownerId !== session.userId && media.timelineItem.coupleId !== session.userId) {
    throw new Error("Non autorizzato");
  }
  await prisma.media.delete({ where: { id: mediaId } });
  revalidatePath("/couple/[slug]", "layout");
}
export async function registerAction(role: string, data: any) {
  const cleanEmail = (data.email || "").trim().toLowerCase();
  if (!cleanEmail) throw new Error("Inserisci un indirizzo email valido.");

  const existing = await prisma.user.findFirst({
    where: { email: { equals: cleanEmail, mode: "insensitive" } }
  });
  if (existing) throw new Error("Questa email è già registrata. Clicca su 'Accedi ora' per entrare col tuo account.");

  const user = await prisma.user.create({
    data: {
      email: cleanEmail,
      password: data.password || "hashed_password",
      name: data.name || "Nuovo Utente",
      role: role as any,
    }
  });

  let redirectUrl = "/dashboard";

  if (role === "PHOTOGRAPHER") {
    const bizName = data.businessName || data.name || "Studio Professionale";
    await prisma.professionalProfile.create({
      data: {
        userId: user.id,
        businessName: bizName,
        slug: bizName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + user.id.slice(0, 4),
        category: data.category || "PHOTOGRAPHER",
        contactEmail: cleanEmail
      }
    });
    redirectUrl = "/dashboard";
  } else if (role === "COUPLE") {
    const slug = "nozze-" + user.id.slice(0, 6);
    const parts = (data.name || "Sposa e Sposo").split(/\s+(?:e|&)\s+|\s+/i);
    await prisma.timelineItem.create({
      data: {
        title: "Il nostro evento",
        slug,
        type: "WEDDING",
        ownerId: user.id,
        coupleId: user.id,
        brideName: parts[0] || "Partner 1",
        groomName: parts[1] || "Partner 2",
      }
    });
    redirectUrl = `/couple/${slug}`;
  }

  await setSession(user.id, role as any, true);
  return { role: user.role, redirectUrl };
}

export async function getLiveMedia(slug: string) {
  const wedding = await prisma.timelineItem.findUnique({ where: { slug } });
  if (!wedding) return [];
  
  const { getUserEntitlements } = await import("@/lib/entitlementHelper");
  const entitlements = await getUserEntitlements(wedding.ownerId);
  if (!entitlements.canUseLiveProjection) {
    throw new Error("La proiezione live è disponibile solo col piano Diamond.");
  }
  
  const media = await prisma.media.findMany({
    where: { 
      timelineItemId: wedding.id,
      type: "IMAGE"
    },
    orderBy: { createdAt: "desc" },
    take: 50
  });
  
  return media.map((m: any) => ({
    url: m.url,
    uploaderName: m.uploaderName,
    guestMessage: m.guestMessage
  }));
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  redirect('/');
}

