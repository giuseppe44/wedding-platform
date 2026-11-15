import { prisma } from "./prisma";

export const BASE_FEATURES = {
  maxChapters: 1,
  maxPhotos: 20,
  maxStorageGB: 3,
  canManageSeating: false,
  canUploadPhotos: false,
  canUseLiveProjection: false,
  canExportSeatingPDF: false,
  canCustomizeTableau: false,
  hasUnlimitedInvites: false
};

export const PREMIUM_FEATURES = {
  maxChapters: 15,
  maxPhotos: 500,
  maxStorageGB: 5,
  canManageSeating: true,
  canUploadPhotos: true,
  canUseLiveProjection: false,
  canExportSeatingPDF: false,
  canCustomizeTableau: false,
  hasUnlimitedInvites: true
};

export const DIAMOND_FEATURES = {
  maxChapters: 30,
  maxPhotos: 99999, // Unspecified, effectively unlimited relative to storage
  maxStorageGB: 50,
  canManageSeating: true,
  canUploadPhotos: true,
  canUseLiveProjection: true,
  canExportSeatingPDF: true,
  canCustomizeTableau: true,
  hasUnlimitedInvites: true
};

export async function getUserEntitlements(userId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: { 
      userId,
      status: "ACTIVE",
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
    },
    include: { plan: true },
    orderBy: { createdAt: "desc" }
  });

  if (!subscription) {
    return BASE_FEATURES; // Default fallback is BASE
  }

  const planName = subscription.plan.name.toUpperCase();
  if (planName.includes("DIAMOND")) return DIAMOND_FEATURES;
  if (planName.includes("PREMIUM") || planName.includes("PRO_FOUNDERS") || planName === "PRO_299") return PREMIUM_FEATURES;
  if (planName.includes("BASE") || planName.includes("ENTRY")) return BASE_FEATURES;

  try {
    if (subscription.plan.features) {
      const parsed = JSON.parse(subscription.plan.features);
      if (parsed && typeof parsed.maxChapters === "number") {
        return parsed;
      }
    }
  } catch (err) {}

  return BASE_FEATURES;
}

export async function checkFeatureAccess(userId: string, feature: keyof typeof BASE_FEATURES, requiredValue?: any) {
  const entitlements = await getUserEntitlements(userId);
  
  if (typeof entitlements[feature] === "boolean") {
    return entitlements[feature] === true;
  }
  
  if (typeof entitlements[feature] === "number" && typeof requiredValue === "number") {
    return requiredValue <= entitlements[feature];
  }

  return false;
}
