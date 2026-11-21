import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProProfileManager from "./ProProfileManager";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoGuidePlayer } from "@/components/VideoGuidePlayer";
import { GuidedCoachBubble, type CoachTip } from "@/components/GuidedCoachBubble";

export default async function ProDashboardProfile() {
  const session = await getSession();
  if (!session || !["PHOTOGRAPHER", "ADMIN"].includes(session.role)) {
    redirect("/login?role=PHOTOGRAPHER");
  }

  const profile = await prisma.professionalProfile.findUnique({
    where: { userId: session.userId },
    include: { services: true }
  });

  const hasBio = Boolean(profile?.description?.trim());
  const hasArea = Boolean(profile?.serviceArea?.trim());
  const hasLogo = Boolean(profile?.profileImage || profile?.logoUrl);
  const hasCover = Boolean(profile?.coverImage);
  const galleryCount = profile?.gallery?.filter((u: string) => u.trim() !== "").length || 0;
  const servicesCount = profile?.services?.length || 0;
  const completedSteps = [
    Boolean(profile?.businessName),
    hasBio && hasArea,
    hasLogo && hasCover,
    galleryCount >= 3,
    servicesCount > 0,
  ].filter(Boolean).length;

  const profileTips: CoachTip[] = [];
  if (!hasLogo || !hasCover) {
    profileTips.push({
      id: "prof-todo-img",
      kind: "TODO",
      title: "Completa Logo Studio e Immagine di Copertina",
      body: "Sono la prima cosa che gli sposi vedono nella directory Fornitori. Carica un logo pulito e una foto di copertina rappresentativa del tuo stile.",
    });
  } else {
    profileTips.push({
      id: "prof-done-img",
      kind: "DONE",
      title: "Hai caricato sia il Logo sia la Copertina",
      body: "La tua testata pubblica è pronta e curata.",
    });
  }

  if (galleryCount < 5) {
    profileTips.push({
      id: "prof-todo-gallery",
      kind: "TODO",
      title: `Arricchisci il Portfolio (ora hai ${galleryCount}/15 foto)`,
      body: "Puoi caricare scatti in alta qualità fino a 25 MB ciascuno nei formati JPG, PNG, WebP, HEIC o TIFF per mostrare il tuo lavoro migliore.",
    });
  } else {
    profileTips.push({
      id: "prof-done-gallery",
      kind: "DONE",
      title: `Portfolio ricco con ${galleryCount} immagini pubblicate`,
      body: "Gli sposi possono sfogliare il tuo stile visivo prima ancora di contattarti.",
    });
  }

  profileTips.push(
    {
      id: "prof-sug-services",
      kind: servicesCount === 0 ? "TODO" : "DONE",
      title:
        servicesCount === 0
          ? "Aggiungi i tuoi Servizi o Pacchetti nella colonna destra"
          : `Hai pubblicato ${servicesCount} serviz${servicesCount === 1 ? "io" : "i"} nel listino`,
      body:
        servicesCount === 0
          ? "Indicare pacchetti chiari con un range indicativo aiuta le coppie a inviarti richieste di preventivo già in target."
          : "Puoi aggiornare o aggiungere pacchetti stagionali in qualunque momento.",
    },
    {
      id: "prof-dyk-security",
      kind: "DID_YOU_KNOW",
      title: "I tuoi contatti privati sono protetti dai bot ma sempre operativi",
      body: "Nella vetrina pubblica gli sposi ti contattano tramite 'Richiedi Preventivo Gratuito' e Live Chat interna: zero spam e tutti i lead tracciati nella tua dashboard.",
      ctaLabel: "Vedi I Miei Messaggi",
      ctaHref: "/dashboard/messages",
    }
  );

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen bg-stone-50 overflow-x-hidden">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/dashboard" className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Profilo Professionale</h1>
          <p className="text-stone-500">Gestisci la tua vetrina pubblica e i tuoi servizi.</p>
        </div>
      </div>

      <VideoGuidePlayer role="PHOTOGRAPHER" />
      <GuidedCoachBubble
        role="PRO"
        storageKey={`pro_profile_${session.userId}`}
        completedCount={completedSteps}
        totalSteps={5}
        tips={profileTips}
      />
      <ProProfileManager initialProfile={profile} />
    </div>
  );
}
