import { prisma } from "@/lib/prisma";
import {
  getProCategoryLabel,
  getProCategoryMeta,
  getProFilterGroup,
} from "@/lib/proCategories";
import FornitoriDirectoryClient, {
  type DirectoryProItem,
} from "./FornitoriDirectoryClient";

export const dynamic = "force-dynamic";

function resolveProImg(raw?: string | null): string | null {
  if (!raw || !raw.trim()) return null;
  if (
    raw.startsWith("uploads/pro-") ||
    raw.includes("/object/public/wedding-media/uploads/pro-")
  ) {
    return `/api/media/pro?path=${encodeURIComponent(raw)}`;
  }
  return raw;
}

const PLACEHOLDER_NAMES =
  /^(studio professionale|nuovo utente|test|prova|demo|utente)$/i;

export default async function FornitoriPage() {
  let pros: DirectoryProItem[] = [];

  try {
    const rawProfiles = await prisma.professionalProfile.findMany({
      where: { isActive: true },
      include: {
        services: { orderBy: { order: "asc" }, take: 3 },
        reviews: { select: { rating: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    const compiledProfiles = rawProfiles
      .filter((p) => {
        const cleanName = (p.businessName || "").trim();
        if (!cleanName || PLACEHOLDER_NAMES.test(cleanName)) {
          return false;
        }
        const hasDesc = Boolean(p.description && p.description.trim().length >= 15);
        const hasImages =
          Boolean(p.coverImage || p.profileImage || p.logoUrl) ||
          (Array.isArray(p.gallery) && p.gallery.length > 0);
        const hasServices = Array.isArray(p.services) && p.services.length > 0;
        const hasDetails = Boolean(
          (p.serviceArea && p.serviceArea.trim().length >= 2) ||
            p.website ||
            p.instagram ||
            p.whatsapp
        );
        return hasDesc || hasImages || hasServices || hasDetails;
      })
      .map((p) => {
        let score = 0;
        if (p.coverImage) score += 3;
        if (Array.isArray(p.gallery) && p.gallery.length > 0) score += 3;
        if (p.profileImage || p.logoUrl) score += 2;
        if (p.description && p.description.trim().length >= 15) score += 2;
        if (p.serviceArea) score += 1;
        if (p.services.length > 0) score += 1;
        if (p.reviews.length > 0) score += 2;
        return { profile: p, score };
      })
      .sort((a, b) => b.score - a.score);

    pros = compiledProfiles.map(({ profile: p }) => {
      const reviewCount = p.reviews.length;
      const avgRating =
        reviewCount > 0
          ? (
              p.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
            ).toFixed(1)
          : null;

      const galleryPreview = (p.gallery || [])
        .map((url) => resolveProImg(url))
        .filter((u): u is string => Boolean(u))
        .slice(0, 3);

      const meta = getProCategoryMeta(p.category);

      return {
        id: p.id,
        slug: p.slug,
        businessName: p.businessName,
        category: p.category,
        categoryLabel: getProCategoryLabel(p.category),
        filterGroup: getProFilterGroup(p.category),
        description: p.description || meta.publicFallbackDescription(p.businessName),
        serviceArea: p.serviceArea,
        coverUrl: resolveProImg(p.coverImage),
        avatarUrl: resolveProImg(p.profileImage || p.logoUrl),
        galleryPreview,
        serviceNames: p.services.map((s) => s.name).slice(0, 3),
        reviewCount,
        avgRating,
      };
    });
  } catch (err) {
    console.error("Errore caricamento fornitori:", err);
  }

  return <FornitoriDirectoryClient pros={pros} />;
}
