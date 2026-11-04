"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { ensureCatalogPlansInDb, activateUserPlanInDb } from "@/lib/stripeServer";
import { revalidatePath } from "next/cache";

export async function getAdminDashboardStats() {
  await requireAuth(["ADMIN"]);

  const usersCount = await prisma.user.count();
  const familiesCount = await prisma.family.count();
  const weddingsCount = await prisma.timelineItem.count({ where: { type: "WEDDING" } });
  const otherChaptersCount = await prisma.timelineItem.count({ where: { type: { not: "WEDDING" } } });
  const prosCount = await prisma.professionalProfile.count();
  const mediaCount = await prisma.media.count();
  const guestsCount = await prisma.guest.count();

  // Seleziona esplicitamente solo colonne non sensibili (mai password o passwordHash!)
  const recentWeddings = await prisma.timelineItem.findMany({
    where: { type: "WEDDING" },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      slug: true,
      brideName: true,
      groomName: true,
      date: true,
      createdAt: true,
      owner: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      },
    },
  });

  return {
    usersCount,
    familiesCount,
    weddingsCount,
    otherChaptersCount,
    prosCount,
    mediaCount,
    guestsCount,
    recentWeddings,
  };
}

export async function getAllUsersWithPlans() {
  await requireAuth(["ADMIN"]);

  const planNames = ["FREE", "PREMIUM", "DIAMOND"];
  for (const name of planNames) {
    await prisma.plan.upsert({
      where: { name },
      update: {},
      create: {
        name,
        features: "{}",
        price: name === "FREE" ? 0 : name === "PREMIUM" ? 15000 : 49000,
      },
    });
  }

  // Non esportare mai `password` verso i Client Components del pannello Admin
  const users = await prisma.user.findMany({
    where: { role: { in: ["COUPLE", "PHOTOGRAPHER"] } },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      professionalProfile: true,
      Subscription: {
        include: { plan: true },
        where: { status: "ACTIVE" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return users;
}

export async function updateUserPlan(userId: string, planName: string) {
  await requireAuth(["ADMIN"]);
  await ensureCatalogPlansInDb();

  if (planName === "FREE") {
    const freePlan = await prisma.plan.upsert({
      where: { name: "FREE" },
      update: {},
      create: { name: "FREE", features: "{}", price: 0 },
    });
    await prisma.subscription.upsert({
      where: { userId },
      update: { planId: freePlan.id, status: "ACTIVE" },
      create: { userId, planId: freePlan.id, status: "ACTIVE" },
    });
  } else {
    await activateUserPlanInDb(userId, planName);
  }

  revalidatePath("/admin");
}
