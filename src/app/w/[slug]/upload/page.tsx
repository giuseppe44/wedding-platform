import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import UploadClient from "./UploadClient";

export default async function UploadPage({ params }: { params: { slug: string } }) {
  const wedding = await prisma.wedding.findUnique({
    where: { slug: params.slug },
    select: { id: true, brideName: true, groomName: true, slug: true, themeColor: true }
  });

  if (!wedding) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50 p-4 flex items-center justify-center">
      <UploadClient weddingId={wedding.id} names={`${wedding.brideName} & ${wedding.groomName}`} slug={wedding.slug} buttonColor={wedding.themeColor} />
    </div>
  );
}
