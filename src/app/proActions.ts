"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function upsertProfile(data: any) {
  const session = await requireAuth(["PHOTOGRAPHER", "ADMIN"]); // Currently pros are photographers
  
  // Verify slug uniqueness
  if (data.slug) {
    const existing = await prisma.professionalProfile.findUnique({ where: { slug: data.slug } });
    if (existing && existing.userId !== session.userId) {
      throw new Error("Slug già in uso");
    }
  }

  const profile = await prisma.professionalProfile.upsert({
    where: { userId: session.userId },
    update: {
      category: data.category,
      businessName: data.businessName,
      slug: data.slug,
      description: data.description,
      website: data.website,
      whatsapp: data.whatsapp,
      instagram: data.instagram,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      isActive: data.isActive ?? true,
      logoUrl: data.logoUrl, // Media upload handled separately via Supabase proxy
    },
    create: {
      userId: session.userId,
      category: data.category || "OTHER",
      businessName: data.businessName,
      slug: data.slug,
      description: data.description,
      website: data.website,
      whatsapp: data.whatsapp,
      instagram: data.instagram,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      isActive: data.isActive ?? true,
      logoUrl: data.logoUrl,
    }
  });

  revalidatePath("/dashboard/profile", "page");
  revalidatePath(`/pro/${profile.slug}`, "page");
  return profile;
}

export async function createService(data: any) {
  const session = await requireAuth(["PHOTOGRAPHER", "ADMIN"]);
  const profile = await prisma.professionalProfile.findUnique({ where: { userId: session.userId } });
  if (!profile) throw new Error("Profilo non trovato");

  await prisma.professionalService.create({
    data: {
      profileId: profile.id,
      name: data.name,
      description: data.description,
      priceIndicative: data.priceIndicative,
      order: parseInt(data.order) || 0
    }
  });

  revalidatePath("/dashboard/profile", "page");
  revalidatePath(`/pro/${profile.slug}`, "page");
}

export async function updateService(serviceId: string, data: any) {
  const session = await requireAuth(["PHOTOGRAPHER", "ADMIN"]);
  const profile = await prisma.professionalProfile.findUnique({ where: { userId: session.userId } });
  const service = await prisma.professionalService.findUnique({ where: { id: serviceId } });
  
  if (!profile || !service || service.profileId !== profile.id) {
    throw new Error("Non autorizzato");
  }

  await prisma.professionalService.update({
    where: { id: serviceId },
    data: {
      name: data.name,
      description: data.description,
      priceIndicative: data.priceIndicative,
      order: parseInt(data.order) || 0
    }
  });

  revalidatePath("/dashboard/profile", "page");
  revalidatePath(`/pro/${profile.slug}`, "page");
}

export async function deleteService(serviceId: string) {
  const session = await requireAuth(["PHOTOGRAPHER", "ADMIN"]);
  const profile = await prisma.professionalProfile.findUnique({ where: { userId: session.userId } });
  const service = await prisma.professionalService.findUnique({ where: { id: serviceId } });
  
  if (!profile || !service || service.profileId !== profile.id) {
    throw new Error("Non autorizzato");
  }

  await prisma.professionalService.delete({ where: { id: serviceId } });

  revalidatePath("/dashboard/profile", "page");
  revalidatePath(`/pro/${profile.slug}`, "page");
}
