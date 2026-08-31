"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth, setSession } from "@/lib/auth";

export async function loginAction(role: string) {
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
  
  if (role === "PHOTOGRAPHER") {
    await setSession(user.id, "PHOTOGRAPHER");
  } else {
    // For MVP Demo Couple mode, any user can act as couple (would be wedding specific in prod)
    await setSession("couple-demo-id", "COUPLE");
  }
}


export async function createWedding(formData: FormData) {
  const session = await requireAuth(["PHOTOGRAPHER"]);
  const brideName = formData.get("brideName") as string;
  const groomName = formData.get("groomName") as string;
  const location = formData.get("location") as string;
  const dateStr = formData.get("date") as string;

  const slug = `${brideName.toLowerCase()}-e-${groomName.toLowerCase()}`.replace(/\s+/g, '-');
  
  const wedding = await prisma.wedding.create({
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
        weddingId: wedding.id
      }
    });
  }

  revalidatePath("/dashboard");
}

export async function approveMedia(mediaId: string) {
  await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  await prisma.media.update({
    where: { id: mediaId },
    data: { status: "APPROVED" },
  });
  revalidatePath("/couple/[slug]", "page");
}

export async function rejectMedia(mediaId: string) {
  await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  await prisma.media.update({
    where: { id: mediaId },
    data: { status: "REJECTED" },
  });
  revalidatePath("/couple/[slug]", "page");
}
