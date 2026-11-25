"use server";

import { resolvePartnerByInviteCode } from "@/lib/partnerReferral";

export async function validatePartnerCodeAction(rawCode: string) {
  const resolved = await resolvePartnerByInviteCode(rawCode);
  if (!resolved) {
    return {
      valid: false as const,
      error: "Codice invito non trovato. Verifica di averlo scritto correttamente (es. F01, W01, R01 o codice Partner).",
    };
  }

  return {
    valid: true as const,
    code: resolved.inviteCode,
    businessName: resolved.businessName,
    categoryLabel: resolved.categoryLabel,
    slug: resolved.slug,
    discountPercent: resolved.discountPercent,
  };
}
