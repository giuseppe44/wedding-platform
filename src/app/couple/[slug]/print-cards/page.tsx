import { prisma } from "@/lib/prisma";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth";
import { verifyProAssignment } from "@/app/proAssignmentActions";
import { resolveLegacyTimelineSlug } from "@/lib/slugify";
import PrintTableCardsClient from "./PrintTableCardsClient";

export default async function PrintTableCardsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const headersList = await headers();
  const host =
    headersList.get("x-forwarded-host") || headersList.get("host") || "www.gentiluna.com";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const { slug } = await params;

  const session = await getSession();
  if (!session || !["PHOTOGRAPHER", "COUPLE", "ADMIN"].includes(session.role)) {
    redirect("/login?role=COUPLE");
  }

  const wedding = await prisma.timelineItem.findUnique({
    where: { slug },
  });

  if (!wedding) {
    const newSlug = await resolveLegacyTimelineSlug(slug);
    if (newSlug) {
      permanentRedirect(`/couple/${newSlug}/print-cards`);
    }
    notFound();
  }

  const isOwner =
    wedding.ownerId === session.userId ||
    wedding.coupleId === session.userId ||
    session.role === "ADMIN";
  const isAssigned = await verifyProAssignment(wedding.id, session.userId);

  if (!isOwner && !isAssigned) {
    redirect("/login");
  }

  const coupleNames = `${wedding.brideName} & ${wedding.groomName}`;
  const formattedDate = wedding.date
    ? new Date(wedding.date).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <PrintTableCardsClient
      slug={wedding.slug}
      coupleNames={coupleNames}
      formattedDate={formattedDate}
      baseUrl={baseUrl}
    />
  );
}
