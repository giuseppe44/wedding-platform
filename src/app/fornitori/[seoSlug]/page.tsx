import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Award,
  Star,
  UserPlus,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { GentiLunaLogo } from "@/components/GentiLunaLogo";
import PortalSearch from "@/components/PortalSearch";
import {
  LOCAL_SEO_AREAS,
  LOCAL_SEO_VERTICALS,
  parseLocalSeoSlug,
} from "@/lib/localSeoData";
import { getProCategoryLabel, getProCategoryMeta } from "@/lib/proCategories";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ seoSlug: string }>;
}): Promise<Metadata> {
  const { seoSlug } = await params;
  const parsed = parseLocalSeoSlug(seoSlug);
  if (!parsed) {
    return { title: "Directory Fornitori | GentiLuna" };
  }

  const { vertical, area } = parsed;
  const title = `${vertical.titlePlural} ${area.name} | Preventivi & Vetrina GentiLuna`;
  const description = `Cerchi ${vertical.titlePlural.toLowerCase()} ${area.prepositionName}? Confronta i partner verificati su GentiLuna, richiedi fino a 3 proposte gratuite a 0% commissioni o iscrivi gratis la tua attività.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/fornitori/${seoSlug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.gentiluna.com/fornitori/${seoSlug}`,
      locale: "it_IT",
      type: "website",
    },
  };
}

export default async function LocalSeoDirectoryPage({
  params,
}: {
  params: Promise<{ seoSlug: string }>;
}) {
  const { seoSlug } = await params;
  const parsed = parseLocalSeoSlug(seoSlug);
  if (!parsed) {
    notFound();
  }

  const { vertical, area } = parsed;

  let matchedPros: {
    id: string;
    slug: string;
    businessName: string;
    categoryLabel: string;
    serviceArea: string | null;
    description: string;
    coverUrl: string | null;
    avatarUrl: string | null;
    avgRating: string | null;
    reviewCount: number;
    isLocalMatch: boolean;
  }[] = [];

  try {
    const rawProfiles = await prisma.professionalProfile.findMany({
      where: {
        isActive: true,
        category: { in: vertical.acceptedCategories },
      },
      include: {
        services: { take: 2 },
        reviews: { select: { rating: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    matchedPros = rawProfiles
      .filter((p) => {
        const cleanName = (p.businessName || "").trim();
        if (!cleanName || PLACEHOLDER_NAMES.test(cleanName)) return false;
        return (
          Boolean(p.description && p.description.trim().length >= 15) ||
          Boolean(p.coverImage || p.profileImage || p.logoUrl) ||
          (Array.isArray(p.gallery) && p.gallery.length > 0) ||
          p.services.length > 0
        );
      })
      .map((p) => {
        const areaText = (p.serviceArea || "").toLowerCase();
        const isLocalMatch =
          area.matchTerms.some((term) => areaText.includes(term)) ||
          areaText.includes("italia") ||
          areaText === "";
        const reviewCount = p.reviews.length;
        const avgRating =
          reviewCount > 0
            ? (
                p.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
              ).toFixed(1)
            : null;
        const meta = getProCategoryMeta(p.category);

        return {
          id: p.id,
          slug: p.slug,
          businessName: p.businessName,
          categoryLabel: getProCategoryLabel(p.category),
          serviceArea: p.serviceArea,
          description:
            p.description || meta.publicFallbackDescription(p.businessName),
          coverUrl:
            resolveProImg(p.coverImage) || resolveProImg(p.gallery?.[0]),
          avatarUrl: resolveProImg(p.profileImage || p.logoUrl),
          avgRating,
          reviewCount,
          isLocalMatch,
        };
      })
      .sort((a, b) => Number(b.isLocalMatch) - Number(a.isLocalMatch));
  } catch {}

  const faqs = [
    {
      q: `Come richiedere preventivi per ${vertical.titlePlural.toLowerCase()} ${area.prepositionName}?`,
      a: `Ti basta compilare il box di ricerca gratuito qui sopra indicando data e preferenze: riceverai fino a 3 proposte mirate dai migliori professionisti disponibili ${area.prepositionName}, senza alcun costo o commissione.`,
    },
    {
      q: `Come iscrivere gratis la mia attività (${vertical.singularLabel}) ${area.prepositionName}?`,
      a: `Su GentiLuna ogni struttura o professionista può attivare subito la Vetrina Base Gratuita (0€) selezionando la categoria ${vertical.singularLabel}, ricevendo contatti diretti e potendo poi sbloccare i piani VIP PRO quando desidera.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  const otherCategoriesInSameArea = LOCAL_SEO_VERTICALS.filter(
    (v) => v.slugPrefix !== vertical.slugPrefix
  ).slice(0, 5);
  const sameCategoryInOtherAreas = LOCAL_SEO_AREAS.filter(
    (a) => a.areaSlug !== area.areaSlug
  ).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans text-stone-900 flex flex-col overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200/70 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 font-serif text-xl sm:text-2xl text-stone-900">
            <GentiLunaLogo className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" />
            <span>GentiLuna</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <Link href="/fornitori">
              <Button variant="outline" className="rounded-full h-9 px-4 text-xs font-semibold">
                Tutti i Fornitori
              </Button>
            </Link>
            <Link
              href={`/login?role=PHOTOGRAPHER&mode=REGISTER&category=${vertical.primaryCategoryCode}`}
            >
              <Button className="rounded-full bg-stone-900 text-white hover:bg-stone-800 h-9 px-4 text-xs font-semibold">
                Iscrivi Attività Gratis (0€)
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-16">
        {/* HERO LOCAL SEO */}
        <header className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300/80 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-amber-700" />
            Selezione Ufficiale • {area.name}
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif text-stone-900 leading-tight">
            <span className="block">{vertical.titlePlural}</span>
            <span className="inline-block px-2 -mx-2 box-decoration-clone italic text-transparent bg-clip-text bg-gradient-to-r from-amber-800 via-rose-600 to-amber-700">
              {area.prepositionName}
            </span>
          </h1>
          <p className="text-stone-600 text-base sm:text-lg font-light leading-relaxed">
            {vertical.adviceIntro}
          </p>
        </header>

        {/* MATCHMAKER PRE-IMPOSTATO SULLA ZONA */}
        <section className="bg-white p-5 sm:p-8 rounded-[2.25rem] border border-amber-200/80 shadow-lg">
          <PortalSearch
            initialQuery={`Cerco ${vertical.singularLabel.toLowerCase()} ${area.prepositionName}`}
          />
        </section>

        {/* GRIGLIA PROFESSIONISTI + INVITO LOCALE GRATUITO */}
        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Vetrine Disponibili &amp; Selezione Partner {area.prepositionName}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {matchedPros.map((pro) => (
              <article
                key={pro.id}
                className="bg-white rounded-[2rem] border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col"
              >
                <div className="relative h-48 bg-stone-900 overflow-hidden">
                  {pro.coverUrl && (
                    <img
                      src={pro.coverUrl}
                      alt={pro.businessName}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Verificato
                  </div>
                  <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-950/80 text-amber-200 text-[11px] font-semibold">
                    <Award className="w-3 h-3 text-amber-400" /> {pro.categoryLabel}
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="font-serif text-xl font-bold truncate">
                      {pro.businessName}
                    </h3>
                    <p className="text-xs text-stone-200 truncate">
                      📍 {pro.serviceArea || "Disponibile in tutta Italia"}
                    </p>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    {pro.avgRating && (
                      <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full mb-2">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        {pro.avgRating} ({pro.reviewCount})
                      </div>
                    )}
                    <p className="text-sm text-stone-600 line-clamp-3 leading-relaxed">
                      {pro.description}
                    </p>
                  </div>
                  <Link href={`/pro/${pro.slug}`}>
                    <Button className="w-full rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold h-11">
                      Visita Vetrina <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </article>
            ))}

            {/* CARD INVITO ATTIVITÀ LOCALE GRATUITA */}
            <div className="rounded-[2rem] border-2 border-dashed border-amber-300 bg-gradient-to-br from-[#fffbf2] via-white to-[#fff7ed] p-6 sm:p-7 flex flex-col justify-between gap-5">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-bold mb-4">
                  <UserPlus className="w-3.5 h-3.5" />
                  Posti Liberi • {area.name}
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">
                  Qui potresti esserci tu ({area.name})!
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {vertical.partnerPitch}
                </p>
              </div>
              <div className="space-y-2">
                <Link
                  href={`/login?role=PHOTOGRAPHER&mode=REGISTER&category=${vertical.primaryCategoryCode}`}
                  className="block"
                >
                  <Button className="w-full h-11 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold">
                    Crea Vetrina Gratis (0€) <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
                <Link
                  href="/partner"
                  className="block text-center text-xs font-bold text-amber-800 hover:underline py-1"
                >
                  Scopri anche i vantaggi VIP PRO (49€/anno) →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* DOMANDE FREQUENTI LOCALI */}
        <section className="bg-white rounded-3xl p-6 sm:p-9 border border-stone-200 space-y-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600">
            <Sparkles className="w-4 h-4" /> Domande Frequenti • {area.name}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((f) => (
              <div key={f.q} className="space-y-1.5">
                <h3 className="font-serif font-bold text-lg text-stone-900">{f.q}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CROSS-LINKING SEO INTERNO */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="bg-stone-100/80 rounded-3xl p-6 border border-stone-200/80">
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-3">
              Altre categorie per il tuo evento {area.prepositionName}
            </h3>
            <div className="flex flex-wrap gap-2">
              {otherCategoriesInSameArea.map((v) => (
                <Link
                  key={v.slugPrefix}
                  href={`/fornitori/${v.slugPrefix}-${area.areaSlug}`}
                  className="px-3 py-1.5 rounded-full bg-white border border-stone-200 text-xs font-medium text-stone-700 hover:border-amber-400 hover:text-stone-950 transition-colors"
                >
                  {v.titlePlural.split(",")[0]} {area.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-stone-100/80 rounded-3xl p-6 border border-stone-200/80">
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-3">
              {vertical.titlePlural.split(",")[0]} nelle altre regioni
            </h3>
            <div className="flex flex-wrap gap-2">
              {sameCategoryInOtherAreas.map((a) => (
                <Link
                  key={a.areaSlug}
                  href={`/fornitori/${vertical.slugPrefix}-${a.areaSlug}`}
                  className="px-3 py-1.5 rounded-full bg-white border border-stone-200 text-xs font-medium text-stone-700 hover:border-amber-400 hover:text-stone-950 transition-colors"
                >
                  {a.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
