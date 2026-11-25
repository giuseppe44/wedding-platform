import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProProfileManager from "./ProProfileManager";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { VideoGuidePlayer } from "@/components/VideoGuidePlayer";
import { GuidedCoachBubble, type CoachTip } from "@/components/GuidedCoachBubble";
import { ensurePartnerShortCode } from "@/lib/partnerReferral";

export default async function ProDashboardProfile() {
  const session = await getSession();
  if (!session || !["PHOTOGRAPHER", "ADMIN"].includes(session.role)) {
    redirect("/login?role=PHOTOGRAPHER");
  }

  const rawProfiles = await prisma.professionalProfile.findMany({
    where: {
      OR: [{ userId: session.userId }, { parentUserId: session.userId }],
    },
    include: { services: true },
    orderBy: { createdAt: "asc" },
  });

  // Assicura che ogni vetrina abbia già il proprio Codice Partner corto (es. F01, W01, R01)
  const profiles = await Promise.all(
    rawProfiles.map(async (p) => {
      const code = p.partnerCode || (await ensurePartnerShortCode(p.id));
      return { ...p, partnerCode: code };
    })
  );

  const profile = profiles[0] || null;

  const hasBio = Boolean(profile?.description?.trim());
  const hasArea = Boolean(profile?.serviceArea?.trim() || profile?.province);
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
      body: "Sono la prima cosa che gli sposi vedono nella directory Fornitori. Ora il caricamento ottimizza in automatico anche scatti grandi da fotocamera e li salva subito!",
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
      body: "Puoi selezionare anche 10–15 scatti ad alta risoluzione tutti insieme (fino a 40 MB l'uno): vengono ottimizzati in Ultra-HD e salvati in automatico.",
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
      id: "prof-dyk-double-showcase",
      kind: "DID_YOU_KNOW",
      title: "Novità: Doppia Vetrina con la stessa Partita IVA",
      body: "Se offri due servizi distinti (es. Fotografia + Videomaking, oppure Location + Ristorante), puoi attivare gratuitamente una 2ª Vetrina separata collegata allo stesso account.",
    }
  );

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen bg-stone-50 overflow-x-hidden">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground h-10 w-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-stone-800 font-serif">
            Profilo &amp; Vetrine Professionali
          </h1>
          <p className="text-stone-500">
            Gestisci la tua vetrina pubblica, eventuale 2ª Vetrina (stessa P.IVA), portfolio HD e servizi.
          </p>
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
      <ProProfileManager initialProfiles={profiles} />
    </div>
  );
}
