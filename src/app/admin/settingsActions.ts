"use server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getSystemConfig() {
  await requireAuth(["ADMIN"]);
  let config = await prisma.systemConfig.findUnique({ where: { id: "default" } });
  if (!config) {
    config = await prisma.systemConfig.create({ data: { id: "default" } });
  }
  return config;
}

export async function updateSystemConfig(data: { smtpHost?: string, smtpPort?: string, smtpUser?: string, smtpPass?: string, senderEmail?: string }) {
  await requireAuth(["ADMIN"]);
  await prisma.systemConfig.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data }
  });
  revalidatePath("/admin/settings");
}
