"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth, setSession } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(requestedRole: string, email?: string, password?: string, rememberMe: boolean = false) {
  let user;
  
  if (email) {
    user = await prisma.user.findUnique({ where: { email } });
  }

  // Fallback for demo accounts if no email was provided or user not found
  if (!user) {
    if (requestedRole === "PHOTOGRAPHER") {
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
    } else if (requestedRole === "ADMIN") {
      user = await prisma.user.findFirst({ where: { role: "ADMIN" } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: "admin@weddingplatform.com",
            password: "hashed_password",
            role: "ADMIN",
            name: "Super Admin",
          },
        });
      }
    } else {
      user = await prisma.user.findFirst({ where: { role: "COUPLE" } });
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
  const existing = await prisma.user.findFirst({ where: { email: data.email } });
  if (existing) throw new Error("Email gia registrata.");

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: "hashed_password",
      name: data.name || "Nuovo Utente",
      role: role as any,
    }
  });

  if (role === "PHOTOGRAPHER" && data.businessName) {
    await prisma.professionalProfile.create({
      data: {
        userId: user.id,
        businessName: data.businessName,
        slug: data.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + user.id.slice(0,4),
        category: "PHOTOGRAPHER"
      }
    });
  } else if (role === "COUPLE") {
    // Optionally create a dummy wedding space
    await prisma.timelineItem.create({
      data: {
        title: "Il nostro matrimonio",
        slug: "nozze-" + user.id.slice(0,6),
        type: "WEDDING",
        ownerId: user.id,
        coupleId: user.id,
        brideName: data.name.split(" ")[0] || "Sposa",
        groomName: "Sposo",
      }
    });
  }

  await setSession(user.id, role as any, false);
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

