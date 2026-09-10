import { verifyTimelineAccess } from "@/lib/accessControl";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { isCloudStorage, getSignedUrl, downloadFileBuffer } from "@/lib/storage";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const media = await prisma.media.findUnique({
    where: { id },
    include: { timelineItem: true }
  });

  if (!media) {
    return new NextResponse("Not found", { status: 404 });
  }

  const { timelineItem } = media;

  // PUBLIC check: only APPROVED media can be seen by anonymous if timeline is public
  if (timelineItem.visibility === "PUBLIC") {
    if (media.status !== "APPROVED") {
      // Pending media in public timeline requires owner/admin
      const session = await getSession();
      if (!session) return new NextResponse("Unauthorized", { status: 401 });
      if (session.role !== "ADMIN" && timelineItem.ownerId !== session.userId && timelineItem.coupleId !== session.userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }
  } else {
    const hasAccess = await verifyTimelineAccess(timelineItem, "VIEW_PUBLIC");
    if (!hasAccess) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  // Handle external Mock URLs (Unsplash)
  if (media.url.startsWith("http") && !media.url.includes("supabase.co")) {
    return NextResponse.redirect(media.url, 307);
  }

  // Generate Cloud Signed URL or Local Stream
  if (isCloudStorage) {
    const signedUrl = await getSignedUrl(media.url);
    if (!signedUrl) return new NextResponse("Storage error", { status: 500 });
    return NextResponse.redirect(signedUrl, 307);
  } else {
    // Local development proxy stream
    const buffer = await downloadFileBuffer(media.url);
    if (!buffer) return new NextResponse("File not found locally", { status: 404 });
    return new NextResponse(buffer as any, {
      headers: {
        "Content-Type": media.mimeType || "application/octet-stream",
        "Cache-Control": "public, max-age=3600"
      }
    });
  }
}
