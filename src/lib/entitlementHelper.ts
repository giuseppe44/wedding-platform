import { prisma } from "./prisma";

export const DEFAULT_FREE_FEATURES = {
  maxChapters: 3,
  maxGuests: 50,
  maxMedia: 200,
  canUseCustomColors: false,
  canRemoveBranding: false,
};

export const PREMIUM_FEATURES = {
  maxChapters: 10,
  maxGuests: 200,
  maxMedia: 1000,
  canUseCustomColors: true,
  canRemoveBranding: false,
};

export const DIAMOND_FEATURES = {
  maxChapters: 999,
  maxGuests: 9999,
  maxMedia: 99999,
  canUseCustomColors: true,
  canRemoveBranding: true,
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
    return DEFAULT_FREE_FEATURES;
  }

  // Parse features from Plan model if it exists, otherwise use hardcoded maps based on plan name
  try {
    if (subscription.plan.features) {
      return JSON.parse(subscription.plan.features);
    }
  } catch (err) {}

  switch (subscription.plan.name.toUpperCase()) {
    case "DIAMOND": return DIAMOND_FEATURES;
    case "PREMIUM": return PREMIUM_FEATURES;
    default: return DEFAULT_FREE_FEATURES;
  }
}

export async function checkFeatureAccess(userId: string, feature: keyof typeof DEFAULT_FREE_FEATURES, requiredValue?: any) {
  const entitlements = await getUserEntitlements(userId);
  
  if (typeof entitlements[feature] === "boolean") {
    return entitlements[feature] === true;
  }
  
  if (typeof entitlements[feature] === "number" && typeof requiredValue === "number") {
    return requiredValue <= entitlements[feature];
  }

  return false;
}
