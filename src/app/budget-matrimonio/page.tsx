import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getProCategoryLabel } from "@/lib/proCategories";
import BudgetPlannerClient, {
  type SuggestedBudgetPro,
} from "./BudgetPlannerClient";
import type {
  BudgetEventType,
  BudgetPriorityKey,
  HoneymoonMode,
  SeasonChoice,
  VenueFormula,
} from "@/lib/budgetPlannerEngine";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title:
    "Parti dal Budget & Organizza il Matrimonio – Simulatore & Idee di Budget | GentiLuna",
  description:
    "Hai in mente un budget per il matrimonio o il tuo evento? Inserisci la cifra o esplora 6 idee di budget reali: scopri le differenze tra ristorante e villa con catering, chi contattare e come organizzare tutto con onestà.",
  keywords: [
    "budget matrimonio",
    "calcolo budget matrimonio online",
    "organizzare matrimonio con 15000 euro",
    "organizzare matrimonio con 20000 euro",
    "organizzare matrimonio con 30000 euro",
    "differenza ristorante e villa catering matrimonio",
    "quanto costa sposarsi in italia",
    "preventivo matrimonio voci di spesa",
  ],
  alternates: {
    canonical: "/budget-matrimonio",
  },
};

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

export default async function BudgetMatrimonioPage({
  searchParams,
}: {
  searchParams: Promise<{
    b?: string;
    g?: string;
    v?: string;
    e?: string;
    s?: string;
    h?: string;
    p?: string;
    prov?: string;
    tab?: string;
  }>;
}) {
  const sp = await searchParams;

  let pros: SuggestedBudgetPro[] = [];
  try {
    const rawProfiles = await prisma.professionalProfile.findMany({
      where: { isActive: true },
      include: {
        reviews: { select: { rating: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    pros = rawProfiles
      .filter((p) => {
        const cleanName = (p.businessName || "").trim();
        if (!cleanName || PLACEHOLDER_NAMES.test(cleanName)) return false;
        return Boolean(
          (p.description && p.description.trim().length >= 15) ||
            p.coverImage ||
            p.profileImage ||
            p.logoUrl ||
            (Array.isArray(p.gallery) && p.gallery.length > 0)
        );
      })
      .map((p) => {
        const reviewCount = p.reviews.length;
        const avgRating =
          reviewCount > 0
            ? (
                p.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
              ).toFixed(1)
            : null;
        return {
          id: p.id,
          slug: p.slug,
          businessName: p.businessName,
          category: p.category,
          categoryLabel: getProCategoryLabel(p.category),
          province: p.province || null,
          serviceArea: p.serviceArea || null,
          avatarUrl: resolveProImg(p.profileImage || p.logoUrl || p.coverImage),
          reviewCount,
          avgRating,
        };
      });
  } catch (err) {
    console.error("Errore caricamento fornitori suggeriti budget:", err);
  }

  const validEventTypes: BudgetEventType[] = [
    "WEDDING",
    "BAPTISM_COMMUNION",
    "GRADUATION_PARTY",
    "ANNIVERSARY",
  ];
  const validVenues: VenueFormula[] = [
    "RESTAURANT",
    "AGRITURISMO",
    "VILLA_CATERING",
    "DYNAMIC_PARTY",
  ];
  const validSeasons: SeasonChoice[] = ["PEAK_WEEKEND", "SMART_WEEKDAY"];
  const validHoneymoon: HoneymoonMode[] = ["GIFT_FUNDED", "INCLUDED"];
  const validPriorities: BudgetPriorityKey[] = [
    "FOOD_WINE",
    "PHOTO_CINEMA",
    "PARTY_MUSIC",
    "FLOWERS_DESIGN",
    "ATTIRE_BEAUTY",
    "GUEST_EXPERIENCE",
  ];

  const initialEventType = validEventTypes.includes(sp.e as BudgetEventType)
    ? (sp.e as BudgetEventType)
    : "WEDDING";

  const parsedBudget = sp.b ? Number.parseInt(sp.b, 10) : Number.NaN;
  const parsedGuests = sp.g ? Number.parseInt(sp.g, 10) : Number.NaN;

  const initialVenue = validVenues.includes(sp.v as VenueFormula)
    ? (sp.v as VenueFormula)
    : "RESTAURANT";

  const initialSeason = validSeasons.includes(sp.s as SeasonChoice)
    ? (sp.s as SeasonChoice)
    : "PEAK_WEEKEND";

  const initialHoneymoon = validHoneymoon.includes(sp.h as HoneymoonMode)
    ? (sp.h as HoneymoonMode)
    : "GIFT_FUNDED";

  const initialPriorities = sp.p
    ? sp.p
        .split(",")
        .map((x) => x.trim().toUpperCase() as BudgetPriorityKey)
        .filter((x) => validPriorities.includes(x))
        .slice(0, 3)
    : (["FOOD_WINE", "PHOTO_CINEMA"] as BudgetPriorityKey[]);

  const initialTab = sp.tab === "idee" ? "IDEE" : "SIMULATORE";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Simulatore & Idee di Budget Matrimonio GentiLuna",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    description:
      "Strumento gratuito e trasparente per organizzare il matrimonio o un evento partendo dal proprio budget, confrontando ristoranti, ville e professionisti.",
    url: "https://www.gentiluna.com/budget-matrimonio",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BudgetPlannerClient
        pros={pros}
        initialTab={initialTab}
        initialInput={{
          eventType: initialEventType,
          totalBudget: Number.isFinite(parsedBudget) ? parsedBudget : 24000,
          guestsCount: Number.isFinite(parsedGuests) ? parsedGuests : 100,
          venueFormula: initialVenue,
          season: initialSeason,
          honeymoonMode: initialHoneymoon,
          priorities: initialPriorities,
          provinceCode: sp.prov ? sp.prov.toUpperCase() : "",
        }}
      />
    </>
  );
}
