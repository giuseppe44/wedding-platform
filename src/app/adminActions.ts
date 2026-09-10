"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

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
