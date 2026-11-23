import { prisma } from "@/lib/prisma";
import { getProCategoryLabel } from "@/lib/proCategories";

export const PARTNER_DISCOUNT_PERCENT = 15;

export function buildPartnerInviteCode(slug: string): string {
  const clean = slug
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]+/g, "")
    .slice(0, 22)
    .replace(/-+$/g, "");
  return `GL-${clean || "PARTNER"}`;
}

export function calculatePartnerDiscountedCents(originalCents: number): number {
  return Math.round((originalCents * (100 - PARTNER_DISCOUNT_PERCENT)) / 100);
}

export function formatEuroFromCents(cents: number): string {
  return (cents / 100).toLocaleString("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + " €";
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
  if (trimmed.length < 3) return null;

  const normalizedSlugPart = trimmed
    .replace(/^GL-/, "")
    .replace(/^PRO-/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/^-+|-+$/g, "");

  if (!normalizedSlugPart) return null;

  try {
    const candidates = await prisma.professionalProfile.findMany({
      where: { isActive: true },
      select: {
        id: true,
        userId: true,
        slug: true,
        businessName: true,
        category: true,
      },
    });

    const exact = candidates.find(
      (p) =>
        p.slug.toLowerCase() === normalizedSlugPart ||
        buildPartnerInviteCode(p.slug) === trimmed
    );

    const prefixMatch =
      exact ||
      candidates.find((p) => p.slug.toLowerCase().startsWith(normalizedSlugPart));

    if (!prefixMatch) return null;

    return {
      proId: prefixMatch.id,
      userId: prefixMatch.userId,
      slug: prefixMatch.slug,
      businessName: prefixMatch.businessName,
      categoryLabel: getProCategoryLabel(prefixMatch.category),
      inviteCode: buildPartnerInviteCode(prefixMatch.slug),
      discountPercent: PARTNER_DISCOUNT_PERCENT,
    };
  } catch {
    return null;
  }
}

export async function countPartnerReferralConversions(proId: string): Promise<number> {
  try {
    const rows = await prisma.lead.findMany({
      where: {
        intent: "REFERRAL_PARTNER_CONVERTED",
        details: { contains: proId },
      },
      select: { id: true },
    });
    return rows.length;
  } catch {
    return 0;
  }
}
