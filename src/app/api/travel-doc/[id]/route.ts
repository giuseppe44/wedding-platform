import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { isCloudStorage, getSignedUrl, downloadFileBuffer } from "@/lib/storage";

/**
 * Download protetto per i documenti riservati del Travel Wallet (biglietti, voucher, itinerari).
 * Verifica rigorosamente che l'utente sia la coppia proprietaria, il professionista assegnato o Admin.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const doc = await prisma.travelDocument.findUnique({
    where: { id },
    include: {
      timelineItem: {
        include: {
          assignments: {
            where: { status: "ACTIVE" },
            include: { professionalProfile: true },
          },
        },
      },
    },
  });

  if (!doc) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const isOwner =
    doc.timelineItem.ownerId === session.userId ||
    doc.timelineItem.coupleId === session.userId;
  const isAssignedPro = doc.timelineItem.assignments.some(
    (ea) => ea.professionalProfile.userId === session.userId
  );
  const isAdmin = session.role === "ADMIN";

  if (!isOwner && !isAssignedPro && !isAdmin) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (doc.url.startsWith("http") && !doc.url.includes("supabase.co")) {
    return NextResponse.redirect(doc.url, 307);
  }

  if (isCloudStorage) {
    const signedUrl = await getSignedUrl(doc.url);
    if (!signedUrl) {
      return new NextResponse("Storage error", { status: 500 });
    }
    return NextResponse.redirect(signedUrl, 307);
  }

  const buffer = await downloadFileBuffer(doc.url);
  if (!buffer) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const fileName = doc.url.split("/").pop() || "documento.pdf";
  return new NextResponse(buffer as any, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${fileName.replace(/"/g, "")}"`,
    },
  });
}
