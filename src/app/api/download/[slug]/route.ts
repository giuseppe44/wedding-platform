import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { downloadFileBuffer } from "@/lib/storage";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const archiver = require("archiver");

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const wedding = await prisma.wedding.findUnique({
    where: { slug: slug },
    include: {
      media: {
        where: { status: "APPROVED" }
      }
    }
  });

  if (!wedding) {
    return new NextResponse("Not found", { status: 404 });
  }

  if (wedding.media.length === 0) {
    return new NextResponse("No approved media to download", { status: 400 });
  }

  const zip = archiver('zip', {
    zlib: { level: 5 }
  });

  const stream = new ReadableStream({
    async start(controller) {
      zip.on('data', (chunk: any) => controller.enqueue(chunk));
      zip.on('end', () => controller.close());
      zip.on('error', (err: any) => controller.error(err));
      
      // Process files sequentially to avoid memory overload
      for (const item of wedding.media) {
        const buffer = await downloadFileBuffer(item.url);
        if (buffer) {
          const fileName = item.url.split('/').pop() || `file-${item.id}`;
          zip.append(buffer, { name: fileName });
        }
      }
      
      zip.finalize();
    }
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="Foto_${wedding.brideName}_${wedding.groomName}.zip"`,
    }
  });
}
