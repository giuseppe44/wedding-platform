"use server";

import { prisma } from "@/lib/prisma";
import { setGuestSession } from "@/lib/accessControl";
import { revalidatePath } from "next/cache";

export async function authenticateGuestAction(slug: string, passwordAttempt: string) {
  try {
    const wedding = await prisma.timelineItem.findUnique({
      where: { slug }
    });

    if (!wedding) {
      return { success: false, error: "Evento non trovato" };
    }

    if (!wedding.passwordHash) {
      return { success: false, error: "Questo evento non è protetto da password" };
    }

    if (wedding.passwordHash !== passwordAttempt) {
      return { success: false, error: "Password errata" };
    }

    // Pass passwordHash as pwdVer for stateless revocation check
    await setGuestSession(wedding.id, "OTHER", undefined, wedding.passwordHash);

    revalidatePath(`/w/${slug}`);
    return { success: true };
  } catch (error) {
    console.error("Auth error:", error);
    return { success: false, error: "Errore di sistema" };
  }
}

export async function authenticateGuestByTokenAction(slug: string, token: string) {
  try {
    const wedding = await prisma.timelineItem.findUnique({
      where: { slug }
    });

    if (!wedding) {
      return { success: false, error: "Evento non trovato" };
    }

    const guest = await prisma.guest.findFirst({
      where: { timelineItemId: wedding.id, token, hasAccess: true }
    });

    if (!guest) {
      return { success: false, error: "Link di invito non valido o revocato" };
    }

    await setGuestSession(wedding.id, guest.category, guest.id);

    revalidatePath(`/w/${slug}`);
    return { success: true };
  } catch (error) {
    console.error("Auth token error:", error);
    return { success: false, error: "Errore di sistema" };
  }
}
