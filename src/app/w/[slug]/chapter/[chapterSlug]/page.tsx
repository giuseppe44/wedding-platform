/* eslint-disable @typescript-eslint/no-explicit-any */
import GuestLogin from "../../GuestLogin";
import { verifyTimelineAccess } from "@/lib/accessControl";
import { getUserEntitlements } from "@/lib/entitlementHelper";
import { prisma } from "@/lib/prisma";
import { notFound, permanentRedirect } from "next/navigation";
import { headers } from "next/headers";
import { resolveLegacyTimelineSlug } from "@/lib/slugify";
import PublicChapterExperience from "@/components/w/PublicChapterExperience";

export default async function PublicTimelinePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; chapterSlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const { slug, chapterSlug } = await params;
  const resolvedParams = await searchParams;
  const token = resolvedParams?.token ? String(resolvedParams.token) : undefined;

  const wedding: any = await prisma.timelineItem.findUnique({
    where: { slug: chapterSlug },
    include: {
      locations: true,
      giftOptions: true,
      assignments: { include: { professionalProfile: true } },
      schedule: { orderBy: { order: "asc" } },
      messages: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
      },
      media: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        take: 31,
      },
    },
  });

  const mainWedding = await prisma.timelineItem.findUnique({
    where: { slug: slug },
    select: { title: true, brideName: true, groomName: true, themeColor: true, familyId: true, coupleId: true },
  });

  if (!wedding || !mainWedding) {
    const resolvedSlug = mainWedding ? slug : (await resolveLegacyTimelineSlug(slug)) || slug;
    const resolvedChap = wedding ? chapterSlug : (await resolveLegacyTimelineSlug(chapterSlug)) || chapterSlug;
    if (resolvedSlug !== slug || resolvedChap !== chapterSlug) {
      permanentRedirect(`/w/${resolvedSlug}/chapter/${resolvedChap}${token ? `?token=${encodeURIComponent(token)}` : ""}`);
    }
    if (!wedding || !mainWedding) {
      return notFound();
    }
  }

  const entitlements = await getUserEntitlements(wedding.ownerId);

  const hasAccess = await verifyTimelineAccess(wedding, "VIEW_PUBLIC");
  if (!hasAccess) {
    if (wedding.visibility === "PRIVATE" || wedding.passwordHash) {
      return (
        <GuestLogin
          slug={slug}
          title={wedding.title || `${wedding.brideName} & ${wedding.groomName}`}
          token={token}
        />
      );
    }
    notFound();
  }

  let siblingCount = 1;
  if (mainWedding.familyId) {
    siblingCount = await prisma.timelineItem.count({ where: { familyId: mainWedding.familyId } });
  } else if (mainWedding.coupleId) {
    siblingCount = await prisma.timelineItem.count({ where: { coupleId: mainWedding.coupleId } });
  }

  return (
    <PublicChapterExperience
      wedding={wedding}
      mainWedding={mainWedding}
      slug={slug}
      chapterSlug={chapterSlug}
      baseUrl={baseUrl}
      entitlements={entitlements}
      showHubBackLink={siblingCount > 1}
    />
  );
}
