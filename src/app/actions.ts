"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth, setSession } from "@/lib/auth";

export async function loginAction(role: string, email?: string, password?: string, rememberMe: boolean = false) {
  if (role === "PHOTOGRAPHER") {
    let user = await prisma.user.findFirst({ where: { role: "PHOTOGRAPHER" } });
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
    await setSession(user.id, "PHOTOGRAPHER", rememberMe);
  } else if (role === "ADMIN") {
    let user = await prisma.user.findFirst({ where: { role: "ADMIN" } });
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
    await setSession(user.id, "ADMIN", rememberMe);
  } else if (role === "COUPLE") {
    // For MVP Demo Couple mode
    let user = await prisma.user.findFirst({ where: { role: "COUPLE" } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "sposi@demo.it",
          password: "hashed_password",
          role: "COUPLE",
          name: "Chiara e Matteo",
        },
      });
      // Try to attach them to the demo wedding if it exists
      await prisma.timelineItem.updateMany({
        where: { slug: "demo-chiara-e-matteo" },
        data: { coupleId: user.id }
      });
    }
    // ensure attachment just in case
    await prisma.timelineItem.updateMany({
      where: { slug: "demo-chiara-e-matteo", coupleId: null },
      data: { coupleId: user.id }
    });
    await setSession(user.id, "COUPLE", rememberMe);
  }
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
