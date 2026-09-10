import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import ProProfileManager from "./ProProfileManager";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ProDashboardProfile() {
  const session = await requireAuth(["PHOTOGRAPHER", "ADMIN"]);

  const profile = await prisma.professionalProfile.findUnique({
    where: { userId: session.userId },
    include: { services: true }
  });

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen bg-stone-50">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/dashboard" className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Profilo Professionale</h1>
          <p className="text-stone-500">Gestisci la tua vetrina pubblica e i tuoi servizi.</p>
        </div>
      </div>

      <ProProfileManager initialProfile={profile} />
    </div>
  );
}
