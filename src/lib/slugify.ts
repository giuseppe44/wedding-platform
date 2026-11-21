import { prisma } from "@/lib/prisma";

export const EVENT_SLUG_ABBR: Record<string, string> = {
  WEDDING: "nozze",
  ANNIVERSARY: "anniversario",
  TRAVEL: "viaggio",
  BIRTH: "nascita",
  BAPTISM: "battesimo",
  BIRTHDAY: "compleanno",
  FAMILY: "famiglia",
  MEMORY: "ricordo",
  CUSTOM: "evento",
};

export function slugifyText(input: string): string {
  return (input || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export async function ensureUniqueTimelineSlug(baseSlug: string, excludeId?: string): Promise<string> {
  const cleanBase = slugifyText(baseSlug) || "evento-gentiluna";
  let candidate = cleanBase;
  let counter = 2;

  while (true) {
    const existing = await prisma.timelineItem.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || (excludeId && existing.id === excludeId)) {
      return candidate;
    }
    candidate = `${cleanBase}-${counter}`;
    counter++;
  }
}

export async function generateFriendlyWeddingSlug(
  brideName: string,
  groomName: string,
  type: string = "WEDDING",
  excludeId?: string
): Promise<string> {
  const b = slugifyText(brideName);
  const g = slugifyText(groomName);
  const abbr = EVENT_SLUG_ABBR[type] || "evento";

  let base = "";
  if (b && g && g !== "sposo" && g !== "partner-2") {
    base = `${b}-e-${g}-${abbr}`;
  } else if (b) {
    base = `${b}-${abbr}`;
  } else {
    base = `${abbr}-gentiluna`;
  }

  return ensureUniqueTimelineSlug(base, excludeId);
}

export async function generateFriendlyChapterSlug(
  brideName: string,
  groomName: string,
  title: string,
  type: string,
  excludeId?: string
): Promise<string> {
  const b = slugifyText(brideName);
  const g = slugifyText(groomName);
  const t = slugifyText(title);
  const abbr = EVENT_SLUG_ABBR[type] || "evento";

  const couplePrefix = b && g && g !== "sposo" && g !== "partner-2" ? `${b}-e-${g}` : b || "";
  const label = t && t !== "il-nostro-evento" ? t : abbr;
  const base = couplePrefix ? `${couplePrefix}-${label}` : label;

  return ensureUniqueTimelineSlug(base, excludeId);
}

/**
 * Risolve i vecchi slug nel formato legacy `nozze-<6caratteriUserId>`
 * trovando il matrimonio corrispondente nel DB per effettuare un redirect permanente 308
 * senza mai invalidare i link già condivisi dagli sposi.
 */
export async function resolveLegacyTimelineSlug(slug: string): Promise<string | null> {
  const match = slug.match(/^nozze-([a-z0-9]{6})$/i);
  if (!match) return null;

  const idPrefix = match[1];
  const found = await prisma.timelineItem.findFirst({
    where: {
      type: "WEDDING",
      OR: [
        { ownerId: { startsWith: idPrefix } },
        { coupleId: { startsWith: idPrefix } },
      ],
    },
    select: { slug: true },
  });

  if (found && found.slug !== slug) {
    return found.slug;
  }
  return null;
}
