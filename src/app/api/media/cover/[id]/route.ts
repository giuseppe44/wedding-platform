import { verifyTimelineAccess } from "@/lib/accessControl";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { isCloudStorage, getSignedUrl, downloadFileBuffer } from "@/lib/storage";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const timelineItem = await prisma.timelineItem.findUnique({
    where: { id }
  });

  if (!timelineItem || !timelineItem.coverImage) {
    return new NextResponse("Not found", { status: 404 });
  }

  // PUBLIC check
  const hasAccess = await verifyTimelineAccess(timelineItem, "VIEW_PUBLIC");
  if (!hasAccess) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Generate Cloud Signed URL or Local Stream
  if (isCloudStorage) {
    const signedUrl = await getSignedUrl(timelineItem.coverImage);
    if (!signedUrl) return new NextResponse("Storage error", { status: 500 });
    return NextResponse.redirect(signedUrl, 307);
  } else {
    // Local development proxy stream
    const buffer = await downloadFileBuffer(timelineItem.coverImage);
    if (!buffer) return new NextResponse("File not found locally", { status: 404 });
    return new NextResponse(buffer as any, {
      headers: {
        "Content-Type": "image/jpeg", // Defaulting to jpeg for covers
        "Cache-Control": "public, max-age=3600"
      }
    });
  }
}
