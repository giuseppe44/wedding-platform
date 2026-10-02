"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { uploadFile } from "@/lib/storage";
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
      coverImage: data.coverImage,
      profileImage: data.profileImage,
      gallery: (data.gallery || []).slice(0, 15),
      video1: data.video1,
      video2: data.video2,
      serviceArea: data.serviceArea,
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
      coverImage: data.coverImage,
      profileImage: data.profileImage,
      gallery: (data.gallery || []).slice(0, 15),
      video1: data.video1,
      video2: data.video2,
      serviceArea: data.serviceArea,
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

export async function leavePublicReview(proId: string, rating: number, text: string, data: { email: string, brideName: string, groomName: string, weddingDate?: string }) {
  let user = await prisma.user.findUnique({ where: { email: data.email } });
  if (user) {
    throw new Error('Email gi� registrata. Per favore accedi alla piattaforma per lasciare la recensione dal tuo pannello Sposi.');
  }

  user = await prisma.user.create({
    data: {
      email: data.email,
      password: 'hashed_password',
      name: data.brideName + ' & ' + data.groomName,
      role: 'COUPLE'
    }
  });

  const wedding = await prisma.timelineItem.create({
    data: {
      title: 'Il nostro Matrimonio',
      slug: 'nozze-' + user.id.slice(0,6),
      type: 'WEDDING',
      ownerId: user.id,
      coupleId: user.id,
      brideName: data.brideName,
      groomName: data.groomName,
      date: data.weddingDate ? new Date(data.weddingDate) : new Date(),
    }
  });

  await prisma.review.create({
    data: {
      authorId: user.id,
      rating,
      text,
      timelineItemId: wedding.id,
      professionalProfileId: proId
    }
  });

  revalidatePath('/pro/[slug]', 'layout');
}


export async function uploadProMedia(formData: FormData) {
  const session = await requireAuth(["PHOTOGRAPHER", "ADMIN"]);
  const file = formData.get("file") as File;
  if (!file || file.size === 0) throw new Error("Nessun file selezionato");
  
  if (!file.type.startsWith("image/")) throw new Error("Sono consentite solo immagini");
  if (file.size > 5 * 1024 * 1024) throw new Error("Immagine troppo grande (max 5MB)");
  
  
    const buffer = Buffer.from(await file.arrayBuffer());
    // Basic verification of file signatures
    const magic = buffer.toString('hex', 0, 4).toUpperCase();
    const isJPEG = magic.startsWith('FFD8FF');
    const isPNG = magic === '89504E47';
    const isGIF = magic.startsWith('47494638');
    const isWebP = magic.startsWith('52494646') && buffer.toString('hex', 8, 12).toUpperCase() === '57454250';
    if (!isJPEG && !isPNG && !isGIF && !isWebP) {
      throw new Error("Formato file non supportato o invalido. Verifica che il file sia un'immagine reale.");
    }

  const uniqueName = `pro-${Date.now()}-${Math.random().toString(36).substring(2,7)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  
  // Reuse storage upload. The folder will be uploads/pro-userId/...
  const url = await uploadFile(`pro-${session.userId}`, uniqueName, buffer, file.type);
  
  return url;
}

