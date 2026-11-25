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
  paypalLink?: string;
  bankIban?: string;
  bankAccountName?: string;
}) {
  await requireAuth(["ADMIN"]);
  const existing = await prisma.systemConfig.findUnique({ where: { id: "default" } });

  const resolvedSmtpPass =
    data.smtpPass === MASKED_SECRET_PLACEHOLDER ? existing?.smtpPass ?? "" : data.smtpPass;

  await prisma.systemConfig.upsert({
    where: { id: "default" },
    update: {
      ...(data.smtpHost !== undefined ? { smtpHost: data.smtpHost } : {}),
      ...(data.smtpPort !== undefined ? { smtpPort: data.smtpPort } : {}),
      ...(data.smtpUser !== undefined ? { smtpUser: data.smtpUser } : {}),
      ...(data.smtpPass !== undefined ? { smtpPass: resolvedSmtpPass } : {}),
      ...(data.senderEmail !== undefined ? { senderEmail: data.senderEmail } : {}),
      ...(data.paypalLink !== undefined ? { paypalLink: data.paypalLink?.trim() || null } : {}),
      ...(data.bankIban !== undefined ? { bankIban: data.bankIban?.trim() || null } : {}),
      ...(data.bankAccountName !== undefined
        ? { bankAccountName: data.bankAccountName?.trim() || null }
        : {}),
    },
    create: {
      id: "default",
      smtpHost: data.smtpHost,
      smtpPort: data.smtpPort,
      smtpUser: data.smtpUser,
      smtpPass: resolvedSmtpPass,
      senderEmail: data.senderEmail,
      paypalLink: data.paypalLink?.trim() || null,
      bankIban: data.bankIban?.trim() || null,
      bankAccountName: data.bankAccountName?.trim() || null,
    },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/settings");
  revalidatePath("/dashboard/billing");
}
