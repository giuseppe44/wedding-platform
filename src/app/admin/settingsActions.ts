"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { MASKED_SECRET_PLACEHOLDER } from "@/lib/stripeServer";
import { revalidatePath } from "next/cache";

export async function getSystemConfig() {
  await requireAuth(["ADMIN"]);
  let config = await prisma.systemConfig.findUnique({ where: { id: "default" } });
  if (!config) {
    config = await prisma.systemConfig.create({ data: { id: "default" } });
  }
  // Maschera smtpPass prima di inviare la configurazione al Client Component Admin
  return {
    ...config,
    smtpPass: config.smtpPass ? MASKED_SECRET_PLACEHOLDER : "",
  };
}

export async function updateSystemConfig(data: {
  smtpHost?: string;
  smtpPort?: string;
  smtpUser?: string;
  smtpPass?: string;
  senderEmail?: string;
}) {
  await requireAuth(["ADMIN"]);
  const existing = await prisma.systemConfig.findUnique({ where: { id: "default" } });

  const resolvedSmtpPass =
    data.smtpPass === MASKED_SECRET_PLACEHOLDER ? existing?.smtpPass ?? "" : data.smtpPass;

  await prisma.systemConfig.upsert({
    where: { id: "default" },
    update: {
      smtpHost: data.smtpHost,
      smtpPort: data.smtpPort,
      smtpUser: data.smtpUser,
      smtpPass: resolvedSmtpPass,
      senderEmail: data.senderEmail,
    },
    create: {
      id: "default",
      smtpHost: data.smtpHost,
      smtpPort: data.smtpPort,
      smtpUser: data.smtpUser,
      smtpPass: resolvedSmtpPass,
      senderEmail: data.senderEmail,
    },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/settings");
}
