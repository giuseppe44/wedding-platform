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
    take: 50,
    select: {
      id: true,
      slug: true,
      brideName: true,
      groomName: true,
      date: true,
      coverImage: true,
      welcomeMessage: true,
      dressCode: true,
      usefulInfo: true,
      isPublic: true,
      createdAt: true,
      owner: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      },
      couple: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      _count: {
        select: {
          media: true,
          guests: true,
          locations: true,
          schedule: true,
          tables: true,
          giftOptions: true,
          messages: true,
          albums: true,
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
      professionalProfile: {
        include: {
          _count: {
            select: {
              services: true,
              assignments: true,
              reviews: true,
            },
          },
        },
      },
      timelineItemsOwned: {
        select: {
          id: true,
          slug: true,
          type: true,
          brideName: true,
          groomName: true,
          date: true,
          coverImage: true,
          welcomeMessage: true,
          dressCode: true,
          usefulInfo: true,
          _count: {
            select: {
              media: true,
              guests: true,
              locations: true,
              schedule: true,
              tables: true,
              giftOptions: true,
              messages: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      timelineItemsAsCouple: {
        select: {
          id: true,
          slug: true,
          type: true,
          brideName: true,
          groomName: true,
          date: true,
          coverImage: true,
          welcomeMessage: true,
          dressCode: true,
          usefulInfo: true,
          _count: {
            select: {
              media: true,
              guests: true,
              locations: true,
              schedule: true,
              tables: true,
              giftOptions: true,
              messages: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
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

export async function migrateLegacyWeddingSlugs() {
  await requireAuth(["ADMIN"]);
  const { generateFriendlyWeddingSlug } = await import("@/lib/slugify");

  const legacyItems = await prisma.timelineItem.findMany({
    where: {
      type: "WEDDING",
      slug: { startsWith: "nozze-" },
    },
    select: {
      id: true,
      slug: true,
      brideName: true,
      groomName: true,
      type: true,
    },
  });

  const updated: { oldSlug: string; newSlug: string }[] = [];

  for (const item of legacyItems) {
    // Converti solo gli slug nel vecchio formato `nozze-<6caratteri>`
    if (!/^nozze-[a-z0-9]{6}$/i.test(item.slug)) continue;
    // Salta account di test con nomi segnaposto
    const b = (item.brideName || "").trim();
    const g = (item.groomName || "").trim();
    if (!b || b.toLowerCase().includes("test")) continue;

    const newSlug = await generateFriendlyWeddingSlug(b, g, item.type, item.id);
    if (newSlug && newSlug !== item.slug) {
      await prisma.timelineItem.update({
        where: { id: item.id },
        data: { slug: newSlug },
      });
      updated.push({ oldSlug: item.slug, newSlug });
    }
  }

  revalidatePath("/admin");
  return { count: updated.length, updated };
}
