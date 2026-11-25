import { prisma } from "@/lib/prisma";
import { getProCategoryLabel } from "@/lib/proCategories";

export const PARTNER_DISCOUNT_PERCENT = 15;
export const PARTNER_LOYALTY_HALF_TARGET = 5; // 5 matrimoni = -50% rinnovo annuale
export const PARTNER_LOYALTY_FREE_TARGET = 10; // 10 matrimoni = 100% rinnovo annuale GRATIS

export const CATEGORY_CODE_PREFIX: Record<string, string> = {
  PHOTOGRAPHER: "F",
  WEDDING_PLANNER: "W",
  VIDEOMAKER: "V",
  RESTAURANT: "R",
  LOCATION: "L",
  CATERING: "C",
  PASTRY_CAKE: "P",
  TRAVEL_AGENCY: "T",
  NCC_CARS: "N",
  HOTEL_HOSPITALITY: "H",
  DJ: "DJ",
  MUSICIAN: "M",
  FLORIST: "FL",
  STATIONERY_FAVORS: "TP",
  ATELIER_JEWELRY: "AT",
  MAKEUP_ARTIST: "MU",
  HAIR_STYLIST: "HS",
  PHOTO_BOOTH: "PB",
  BAR_EXPERIENCE: "OB",
  OTHER: "GP",
};

export function getCategoryCodePrefix(category?: string | null): string {
  if (!category) return "GP";
  return CATEGORY_CODE_PREFIX[category.toUpperCase()] || "GP";
}

export function formatShortPartnerCode(prefix: string, num: number): string {
  const padded = num < 100 ? String(num).padStart(2, "0") : String(num);
  return `${prefix.toUpperCase()}${padded}`;
}

export function normalizeShortCodeInput(raw: string): string {
  const upper = raw.trim().toUpperCase().replace(/\s+/g, "");
  const m = upper.match(/^([A-Z]{1,3})0*(\d{1,4})$/);
  if (!m) return upper;
  const [, letters, digits] = m;
  const n = parseInt(digits, 10);
  if (isNaN(n) || n <= 0) return upper;
  return formatShortPartnerCode(letters, n);
}

/**
 * Legacy fallback code (`GL-...`) mantenuto per piena retrocompatibilità con email già inviate.
 */
export function buildPartnerInviteCode(slug: string, partnerCode?: string | null): string {
  if (partnerCode && partnerCode.trim()) {
    return partnerCode.trim().toUpperCase();
  }
  const clean = slug
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]+/g, "")
    .slice(0, 22)
    .replace(/-+$/g, "");
  return `GL-${clean || "PARTNER"}`;
}

/**
 * Assegna e salva in modo deterministico il Codice Identificativo Fornitore (es. F01, F02, W01, R01...)
 * fino a 1000 per categoria. Garantisce priorità F01 al profilo fondatore Michele Melis se presente.
 */
export async function ensurePartnerShortCode(proId: string): Promise<string> {
  try {
    const target = await prisma.professionalProfile.findUnique({
      where: { id: proId },
      select: { id: true, category: true, slug: true, partnerCode: true },
    });
    if (!target) return "F01";
    if (target.partnerCode && target.partnerCode.trim()) {
      return target.partnerCode.trim().toUpperCase();
    }

    const prefix = getCategoryCodePrefix(target.category);
    const sameCategory = await prisma.professionalProfile.findMany({
      where: { category: target.category },
      select: { id: true, slug: true, partnerCode: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    // Ordina mettendo eventuale profilo fondatore michele-melis per primo come F01
    sameCategory.sort((a, b) => {
      const aFounder = a.slug.includes("michele-melis") ? -1 : 0;
      const bFounder = b.slug.includes("michele-melis") ? -1 : 0;
      if (aFounder !== bFounder) return aFounder - bFounder;
      return a.createdAt.getTime() - b.createdAt.getTime();
    });

    const usedCodes = new Set<string>(
      sameCategory
        .map((p) => p.partnerCode?.trim().toUpperCase())
        .filter((c): c is string => Boolean(c))
    );

    let assignedForTarget = "";
    let counter = 1;

    for (const p of sameCategory) {
      if (p.partnerCode && p.partnerCode.trim()) {
        if (p.id === proId) assignedForTarget = p.partnerCode.trim().toUpperCase();
        continue;
      }
      while (counter <= 1000 && usedCodes.has(formatShortPartnerCode(prefix, counter))) {
        counter++;
      }
      const nextCode = formatShortPartnerCode(prefix, counter);
      usedCodes.add(nextCode);
      counter++;

      await prisma.professionalProfile.update({
        where: { id: p.id },
        data: { partnerCode: nextCode },
      });

      if (p.id === proId) {
        assignedForTarget = nextCode;
      }
    }

    return assignedForTarget || formatShortPartnerCode(prefix, 1);
  } catch {
    return "F01";
  }
}

export function calculatePartnerDiscountedCents(originalCents: number): number {
  return Math.round((originalCents * (100 - PARTNER_DISCOUNT_PERCENT)) / 100);
}

export function formatEuroFromCents(cents: number): string {
  return (
    (cents / 100).toLocaleString("it-IT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " €"
  );
}

export interface PartnerLoyaltyStatus {
  convertedCount: number;
  registeredCount: number;
  unlockedHalfOff: boolean;
  unlockedFreeYear: boolean;
  renewalDiscountPercent: 0 | 50 | 100;
  nextMilestone: number;
  remainingForNext: number;
}

export function computePartnerLoyaltyStatus(
  convertedCount: number,
  registeredCount: number = 0
): PartnerLoyaltyStatus {
  const unlockedFreeYear = convertedCount >= PARTNER_LOYALTY_FREE_TARGET;
  const unlockedHalfOff = convertedCount >= PARTNER_LOYALTY_HALF_TARGET;
  const renewalDiscountPercent: 0 | 50 | 100 = unlockedFreeYear
    ? 100
    : unlockedHalfOff
    ? 50
    : 0;
  const nextMilestone =
    convertedCount < PARTNER_LOYALTY_HALF_TARGET
      ? PARTNER_LOYALTY_HALF_TARGET
      : PARTNER_LOYALTY_FREE_TARGET;
  const remainingForNext = Math.max(0, nextMilestone - convertedCount);

  return {
    convertedCount,
    registeredCount,
    unlockedHalfOff,
    unlockedFreeYear,
    renewalDiscountPercent,
    nextMilestone,
    remainingForNext,
  };
}

export interface ResolvedPartnerReferral {
  proId: string;
  userId: string;
  slug: string;
  businessName: string;
  categoryLabel: string;
  inviteCode: string;
  discountPercent: number;
}

export async function resolvePartnerByInviteCode(
  rawCode?: string | null
): Promise<ResolvedPartnerReferral | null> {
  if (!rawCode) return null;
  const trimmed = rawCode.trim().toUpperCase();
  if (trimmed.length < 2) return null;

  const normalizedShort = normalizeShortCodeInput(trimmed);

  const normalizedSlugPart = trimmed
    .replace(/^GL-/, "")
    .replace(/^PRO-/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/^-+|-+$/g, "");

  try {
    const candidates = await prisma.professionalProfile.findMany({
      where: { isActive: true },
      select: {
        id: true,
        userId: true,
        parentUserId: true,
        slug: true,
        businessName: true,
        category: true,
        partnerCode: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // 1. Match diretto su partnerCode salvato (es. F01, W01, R01)
    let matched = candidates.find(
      (p) =>
        p.partnerCode &&
        (p.partnerCode.toUpperCase() === trimmed ||
          p.partnerCode.toUpperCase() === normalizedShort)
    );

    // 2. Se l'utente digita es. F01 o W01 prima che i codici siano stati materializzati, genera i codici di quella categoria e ricontrolla
    if (!matched && /^[A-Z]{1,3}\d{1,4}$/.test(normalizedShort)) {
      const prefixEntry = Object.entries(CATEGORY_CODE_PREFIX).find(
        (entry) =>
          normalizedShort.startsWith(entry[1]) &&
          /^\d+$/.test(normalizedShort.slice(entry[1].length))
      );
      if (prefixEntry) {
        const [catKey] = prefixEntry;
        const firstInCat = candidates.find((c) => c.category === catKey);
        if (firstInCat) {
          await ensurePartnerShortCode(firstInCat.id);
          const refreshed = await prisma.professionalProfile.findFirst({
            where: {
              isActive: true,
              partnerCode: normalizedShort,
            },
            select: {
              id: true,
              userId: true,
              parentUserId: true,
              slug: true,
              businessName: true,
              category: true,
              partnerCode: true,
              createdAt: true,
            },
          });
          if (refreshed) matched = refreshed;
        }
      }
    }

    // 3. Fallback retrocompatibile su GL-SLUG o slug prefisso
    if (!matched && normalizedSlugPart.length >= 3) {
      matched =
        candidates.find(
          (p) =>
            p.slug.toLowerCase() === normalizedSlugPart ||
            buildPartnerInviteCode(p.slug) === trimmed
        ) ||
        candidates.find((p) => p.slug.toLowerCase().startsWith(normalizedSlugPart));
    }

    if (!matched) return null;

    const officialShort = matched.partnerCode || (await ensurePartnerShortCode(matched.id));

    return {
      proId: matched.id,
      userId: matched.parentUserId || matched.userId,
      slug: matched.slug,
      businessName: matched.businessName,
      categoryLabel: getProCategoryLabel(matched.category),
      inviteCode: officialShort || buildPartnerInviteCode(matched.slug),
      discountPercent: PARTNER_DISCOUNT_PERCENT,
    };
  } catch {
    return null;
  }
}

export async function countPartnerReferralConversions(proId: string): Promise<number> {
  try {
    const yearStart = new Date(new Date().getFullYear(), 0, 1);
    const rows = await prisma.lead.findMany({
      where: {
        intent: "REFERRAL_PARTNER_CONVERTED",
        details: { contains: proId },
        createdAt: { gte: yearStart },
      },
      select: { id: true },
    });
    return rows.length;
  } catch {
    return 0;
  }
}

export async function countPartnerReferralRegistrations(proId: string): Promise<number> {
  try {
    const yearStart = new Date(new Date().getFullYear(), 0, 1);
    const rows = await prisma.lead.findMany({
      where: {
        intent: "REFERRAL_PARTNER_REGISTERED",
        details: { contains: proId },
        createdAt: { gte: yearStart },
      },
      select: { id: true },
    });
    return rows.length;
  } catch {
    return 0;
  }
}
