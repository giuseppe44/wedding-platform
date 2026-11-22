import { prisma } from "@/lib/prisma";
import { notFound, permanentRedirect } from "next/navigation";
import { resolveLegacyTimelineSlug } from "@/lib/slugify";

export default async function LegacyChapterPathFallback({
  params,
}: {
  params: Promise<{ slug: string; chapterSlug: string }>;
}) {
  const { slug, chapterSlug } = await params;

  const mainWedding = await prisma.timelineItem.findUnique({
    where: { slug },
    select: { id: true, slug: true },
  });

  const resolvedSlug = mainWedding?.slug || (await resolveLegacyTimelineSlug(slug));
  if (!resolvedSlug) {
    notFound();
  }

  const chapterMatch = await prisma.timelineItem.findUnique({
    where: { slug: chapterSlug },
    select: { slug: true },
  });

  const resolvedChapter = chapterMatch?.slug || (await resolveLegacyTimelineSlug(chapterSlug));
  if (resolvedChapter) {
    permanentRedirect(`/w/${resolvedSlug}/chapter/${resolvedChapter}`);
  }

  permanentRedirect(`/w/${resolvedSlug}`);
}
