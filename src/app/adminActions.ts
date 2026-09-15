"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
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
  
  const recentWeddings = await prisma.timelineItem.findMany({
    where: { type: "WEDDING" },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { owner: true }
  });

  return {
    usersCount,
    familiesCount,
    weddingsCount,
    otherChaptersCount,
    prosCount,
    mediaCount,
    guestsCount,
    recentWeddings
  };
}

export async function getAllUsersWithPlans() {
  await requireAuth(["ADMIN"]);
  
  // Ensure basic plans exist
  const planNames = ["FREE", "PREMIUM", "DIAMOND"];
  for (const name of planNames) {
    await prisma.plan.upsert({
      where: { name },
      update: {},
      create: { name, features: "{}", price: name === "FREE" ? 0 : name === "PREMIUM" ? 15000 : 49000 }
    });
  }

  const users = await prisma.user.findMany({
    where: { role: { in: ["COUPLE", "PHOTOGRAPHER"] } },
    include: {
      professionalProfile: true,
      Subscription: {
        include: { plan: true },
        where: { status: "ACTIVE" }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return users;
}

export async function updateUserPlan(userId: string, planName: string) {
  await requireAuth(["ADMIN"]);
  
  const plan = await prisma.plan.findUnique({ where: { name: planName } });
  if (!plan) throw new Error("Plan not found");

  // Upsert subscription
  await prisma.subscription.upsert({
    where: { userId },
    update: {
      planId: plan.id,
      status: "ACTIVE"
    },
    create: {
      userId,
      planId: plan.id,
      status: "ACTIVE"
    }
  });

  revalidatePath("/admin");
}
