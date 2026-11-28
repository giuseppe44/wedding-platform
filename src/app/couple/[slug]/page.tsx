import { prisma } from "@/lib/prisma";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { verifyProAssignment } from "@/app/proAssignmentActions";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth";
import { resolveLegacyTimelineSlug } from "@/lib/slugify";
import ShareChapterButtons from "@/components/ShareChapterButtons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import Link from "next/link";
import { createChapter, deleteChapter, updateChapter } from "@/app/chapterActions";
import { Plus, ArrowRight, Calendar, Check, X, Camera, QrCode, Trash2, Edit2, LogOut } from "lucide-react";
import { approveMedia, rejectMedia, logoutAction } from "@/app/actions";
import { PlanWidget } from "@/components/PlanWidget";
import { SubmitButton } from "@/components/SubmitButton";
import { VideoGuidePlayer } from "@/components/VideoGuidePlayer";
import { GuidedCoachBubble, type CoachTip } from "@/components/GuidedCoachBubble";
import { RestaurantShareCard } from "@/components/couple/RestaurantShareCard";
import { createRestaurantPortalToken } from "@/lib/restaurantAccess";

export default async function CoupleDashboard({ params }: { params: Promise<{ slug: string }> }) {
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const { slug } = await params;
  
  const session = await getSession();
  if (!session || !["PHOTOGRAPHER", "COUPLE", "ADMIN"].includes(session.role)) {
    redirect("/login?role=COUPLE");
  }
  
  const wedding = await prisma.timelineItem.findUnique({
    where: { slug: slug },
  });

  if (!wedding) {
    const newSlug = await resolveLegacyTimelineSlug(slug);
    if (newSlug) {
      permanentRedirect(`/couple/${newSlug}`);
    }
    notFound();
  }

  
  const isOwner = wedding.ownerId === session.userId || wedding.coupleId === session.userId || session.role === "ADMIN";
  const isAssigned = await verifyProAssignment(wedding.id, session.userId);
  
  if (!isOwner && !isAssigned) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Non hai i permessi per accedere a questo matrimonio.</p>
      </div>
    );
  }
    
  let allChapters = [wedding];
  if (wedding.familyId) {
    allChapters = await prisma.timelineItem.findMany({
      where: { familyId: wedding.familyId },
      orderBy: { date: "asc" },
    });
  } else if (wedding.coupleId) {
    allChapters = await prisma.timelineItem.findMany({
      where: { coupleId: wedding.coupleId },
      orderBy: { date: "asc" },
    });
  }
  
  if (!allChapters.find(c => c.id === wedding.id)) {
    allChapters.unshift(wedding);
  }
  
  allChapters.sort((a, b) => {
    if (a.type === "WEDDING") return -1;
    if (b.type === "WEDDING") return 1;
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateA - dateB;
  });

  const pendingMediaGlobally = await prisma.media.findMany({
    where: {
      timelineItemId: { in: allChapters.map(c => c.id) },
      status: "PENDING"
    },
    include: {
      timelineItem: true
    }
  });

  const CHAPTER_TYPES: Record<string, string> = {
    "ANNIVERSARY": "Anniversario",
    "TRAVEL": "Viaggio",
    "BIRTH": "Nascita",
    "BAPTISM": "Battesimo",
    "BIRTHDAY": "Compleanno",
    "FAMILY": "Famiglia",
    "MEMORY": "Ricordo",
    "CUSTOM": "Altro"
  };

  const coupleSubscription = await prisma.subscription.findFirst({
    where: { userId: session.userId, status: "ACTIVE" },
    include: { plan: true },
    orderBy: { createdAt: "desc" }
  });

  const isCouplePremium = !!coupleSubscription && coupleSubscription.plan?.name.toUpperCase() !== "FREE" && coupleSubscription.plan?.name.toUpperCase() !== "BASE";
  const couplePlanName = isCouplePremium ? coupleSubscription.plan.name : "Piano Base (Incluso)";

  const coupleFeatures = {
    included: isCouplePremium ? [
      "Tutti i Capitoli sbloccati (Viaggi, Anniversari, Eventi)",
      "10 GB per migliaia di foto e video ad alta risoluzione",
      "Possibilità di rimuovere il marchio della piattaforma",
      "Gestione avanzata per migliaia di invitati"
    ] : [
      "Fino a 3 capitoli della vostra storia",
      "Raccolta foto da invitati (fino a 200 media)",
      "Gestione Invitati e Tavoli (fino a 50 ospiti)",
      "Digital Guestbook"
    ],
    missing: isCouplePremium ? [] : [
      "10 GB per migliaia di foto e video ad alta risoluzione",
      "Capitoli di vita infiniti (Viaggi, Anniversari, Famiglia)",
      "Gestione di oltre 50 invitati",
      "Rimozione del logo della piattaforma"
    ]
  };

  const stripeConfigured = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  const weddingCounts = await prisma.timelineItem.findUnique({
    where: { id: wedding.id },
    select: {
      _count: {
        select: {
          locations: true,
          schedule: true,
          guests: true,
          tables: true,
          giftOptions: true,
          media: true,
          assignments: true,
        },
      },
    },
  });

  const receptionLocation = await prisma.location.findFirst({
    where: { timelineItemId: wedding.id, type: "RECEPTION" },
    select: { name: true },
  });

  const restaurantToken = createRestaurantPortalToken(wedding.id);
  const restaurantPortalUrl = `${baseUrl}/w/${wedding.slug}/ristorante?key=${restaurantToken}`;
  const coupleNamesText = `${wedding.brideName} & ${wedding.groomName}`;
  const eventDateText = wedding.date
    ? new Date(wedding.date).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : undefined;

  const weddingStats = weddingCounts?._count ?? {
    locations: 0,
    schedule: 0,
    guests: 0,
    tables: 0,
    giftOptions: 0,
    media: 0,
    assignments: 0,
  };
  const coupleProgress = [
    Boolean(wedding.coverImage),
    (weddingStats.locations || 0) > 0,
    (weddingStats.schedule || 0) > 0,
    (weddingStats.guests || 0) > 0,
    (weddingStats.media || 0) > 0,
  ];
  const coupleDoneCount = coupleProgress.filter(Boolean).length;

  const coupleCoachTips: CoachTip[] = [];
  if ((weddingStats.locations || 0) === 0) {
    coupleCoachTips.push({
      id: "hub-todo-locs",
      kind: "TODO",
      title: "Aggiungi le Location del matrimonio (Chiesa & Ricevimento)",
      body: "Apri il tuo capitolo principale e compila indirizzi, orari e indicazioni stradali per gli invitati.",
      ctaLabel: "Apri Luoghi & Info",
      ctaHref: `/couple/${wedding.slug}/chapter/${wedding.slug}?tab=dettagli#dock-area`,
    });
  } else {
    coupleCoachTips.push({
      id: "hub-done-locs",
      kind: "DONE",
      title: "Hai completato i Luoghi dell'evento",
      body: "Chiesa e location del ricevimento sono già salvati e pronti da consultare sul sito pubblico.",
    });
  }

  if ((weddingStats.guests || 0) === 0) {
    coupleCoachTips.push({
      id: "hub-todo-guests",
      kind: "TODO",
      title: "Inserisci la lista degli Invitati e prepara i Tavoli",
      body: "Raccogli conferme RSVP, intolleranze alimentari e organizza il Tableau de Mariage in poche mosse.",
      ctaLabel: "Vai a Invitati & Tavoli",
      ctaHref: `/couple/${wedding.slug}/chapter/${wedding.slug}?tab=seating#dock-area`,
    });
  } else {
    coupleCoachTips.push({
      id: "hub-done-guests",
      kind: "DONE",
      title: `Hai già caricato ${weddingStats.guests} invitati nel tuo evento`,
      body: "Puoi inviare loro il link RSVP personale o stampare il riepilogo tavoli per la location.",
    });
  }

  if (pendingMediaGlobally.length > 0) {
    coupleCoachTips.push({
      id: "hub-todo-pending",
      kind: "TODO",
      title: `Ci sono ${pendingMediaGlobally.length} foto in attesa di approvazione`,
      body: "Scorri subito qui sotto per decidere quali scatti degli invitati pubblicare nella galleria!",
    });
  }

  coupleCoachTips.push(
    {
      id: "hub-sug-restaurant",
      kind: "SUGGESTION",
      title: "Invia al Ristorante il link riservato per Tavoli & Intolleranze",
      body: "Usa il riquadro verde qui sotto per avvisare su WhatsApp o Email il ristorante che gestite tutto su GentiLuna e dar loro accesso diretto a tavoli e allergie.",
    },
    {
      id: "hub-sug-whatsapp",
      kind: "SUGGESTION",
      title: "Condividi il link con i tasti WhatsApp sotto ogni capitolo",
      body: "Puoi inviare anche un singolo capitolo specifico (es. solo il Matrimonio o solo il Viaggio di Nozze) con la comoda barra di condivisione rapida.",
      ctaLabel: "Vedi Sito Pubblico",
      ctaHref: `/w/${wedding.slug}`,
    },
    {
      id: "hub-dyk-qr",
      kind: "DID_YOU_KNOW",
      title: "Stampa il QR Code in fondo a questa pagina e mettilo sui tavoli",
      body: "Gli ospiti inquadrano il QR Code con la fotocamera del telefono e caricano foto e video in diretta — senza scaricare alcuna app!",
    },
    {
      id: "hub-dyk-chapters",
      kind: "DID_YOU_KNOW",
      title: "Puoi aggiungere nuovi capitoli dopo le nozze in qualunque momento",
      body: `Al momento avete ${allChapters.length} capitol${allChapters.length === 1 ? "o" : "i"}. Potete aggiungerne per Viaggio di Nozze, Anniversari, Nascite o Feste in famiglia.`,
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 font-sans pb-24 relative">
      {/* Top Navbar */}
      <div className="absolute top-0 right-0 w-full z-20 flex justify-end p-4">
        <form action={logoutAction}>
          <Button type="submit" variant="ghost" className="text-stone-600 hover:text-stone-900 bg-white/50 backdrop-blur-sm gap-2 font-medium rounded-full hover:bg-white/80">
            <LogOut className="w-4 h-4" /> Esci
          </Button>
        </form>
      </div>

      {/* 1. Header Emozionale */}
      <div className="bg-white/60 backdrop-blur-md shadow-sm border-b border-rose-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center relative z-10">
          <div className="inline-flex items-center justify-center p-3 bg-rose-100 rounded-full mb-6 text-rose-500 shadow-inner">
             <span className="text-3xl">✨</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-stone-800 tracking-tight mb-4 drop-shadow-sm">
            La Vostra Storia
          </h1>
          <p className="text-lg md:text-xl text-stone-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Il matrimonio è solo il primo, bellissimo capitolo.<br />Da qui inizia la magia di tutta una vita insieme.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <VideoGuidePlayer role="COUPLE" />
        {isOwner && (
          <GuidedCoachBubble
            role="COUPLE"
            storageKey={`couple_hub_${wedding.id}`}
            completedCount={coupleDoneCount}
            totalSteps={coupleProgress.length}
            tips={coupleCoachTips}
          />
        )}
        {isOwner && (
          <RestaurantShareCard
            coupleNames={coupleNamesText}
            eventDateText={eventDateText}
            defaultVenueName={receptionLocation?.name || ""}
            portalUrl={restaurantPortalUrl}
          />
        )}
        {isOwner && (
          <div className="mb-6 rounded-3xl bg-white/90 border border-amber-200/90 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full mb-1">
                Strumento Gratuito Sposi
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                Bussola Budget &amp; Idee Organizzative
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                Simula un&apos;ipotesi di spesa per le nozze o per i prossimi capitoli, confronta Ristorante vs Villa e condividi il piano su WhatsApp.
              </p>
            </div>
            <Link href="/budget-matrimonio" className="shrink-0 w-full sm:w-auto">
              <Button className="w-full sm:w-auto rounded-full bg-stone-900 hover:bg-stone-800 text-amber-300 font-semibold px-5 h-10 text-xs sm:text-sm">
                Apri Simulatore Budget <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        )}
        {isOwner && (
          <PlanWidget 
            role="COUPLE"
            currentPlanName={couplePlanName}
            isActive={!!coupleSubscription}
            expiresAt={coupleSubscription?.currentPeriodEnd?.toISOString() || coupleSubscription?.expiresAt?.toISOString()}
            features={coupleFeatures}
            upgradeLink="/dashboard/billing"
            stripeConfigured={true}
          />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {isOwner && pendingMediaGlobally.length > 0 && (
          <div className="bg-white rounded-3xl border border-rose-200 p-8 shadow-sm mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <h3 className="text-2xl font-serif text-stone-900">Foto in attesa di approvazione</h3>
                <p className="text-stone-500">I vostri invitati hanno caricato {pendingMediaGlobally.length} nuove foto! Scegliete quali rendere pubbliche nell'album.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {pendingMediaGlobally.map((m: any) => (
                <div key={m.id} className="relative group rounded-2xl overflow-hidden shadow-sm aspect-square bg-stone-100">
                  <img src={`/api/media/${m.id}`} alt="Da approvare" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                    <span className="text-white text-xs font-bold px-2 py-1 bg-black/40 rounded-full mb-1">
                      {m.timelineItem.title || "Evento"}
                    </span>
                    <div className="flex gap-2">
                      <form action={approveMedia.bind(null, m.id)}>
                        <Button type="submit" size="icon" className="bg-emerald-500 hover:bg-emerald-600 rounded-full h-10 w-10 text-white"><Check className="h-5 w-5" /></Button>
                      </form>
                      <form action={rejectMedia.bind(null, m.id)}>
                        <Button type="submit" variant="destructive" size="icon" className="rounded-full h-10 w-10"><X className="h-5 w-5" /></Button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <h2 className="text-2xl font-serif text-stone-800 mb-12 text-center md:text-left">I Vostri Capitoli</h2>

        {/* 2. Cronostoria (Timeline Verticale) */}
        <div className="relative border-l-2 border-stone-200 ml-4 md:ml-8 pl-8 md:pl-12 pb-12 space-y-20">
          
          {allChapters.map((chapter, index) => {
            const isWedding = chapter.type === "WEDDING";
            const displayTitle = isWedding ? `${chapter.brideName} & ${chapter.groomName}` : (chapter.title || "Capitolo senza titolo");
            const displayType = isWedding ? "Matrimonio" : (CHAPTER_TYPES[chapter.type] || "Ricordo");
            const nodeNumber = index + 1;

            return (
              <div key={chapter.id} className="relative group">
                <div className="absolute -left-[49px] md:-left-[65px] flex items-center justify-center w-8 h-8 rounded-full border-4 border-[#faf9f8] bg-stone-800 text-white text-sm font-serif z-10 shadow-sm transition-transform group-hover:scale-110">{nodeNumber}</div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-rose-100 overflow-hidden hover:shadow-md transition-shadow hover:border-rose-200">
                  <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                    {chapter.coverImage && (
                      <div className="absolute inset-0 w-full h-full opacity-[0.15] pointer-events-none transition-opacity group-hover:opacity-20">
                        <img src={`/api/media/cover/${chapter.id}`} className="w-full h-full object-cover" alt="" />
                      </div>
                    )}
                    <div className="relative z-10 flex-1">
                       <div className="text-xs font-bold tracking-widest text-stone-500 mb-2 uppercase">Capitolo {nodeNumber}: {displayType}</div>
                       <h3 className="text-3xl font-serif text-stone-800 mb-2">{displayTitle}</h3>
                       {chapter.date && <p className="text-stone-600 flex items-center gap-2 font-medium"><Calendar className="w-4 h-4"/> {new Date(chapter.date).toLocaleDateString('it-IT')}</p>}
                    </div>
                    
                      <div className="relative z-10 shrink-0 flex items-center gap-3">
                        <Dialog>
                          <DialogTrigger>
                            <Button variant="outline" size="icon" className="h-14 w-14 rounded-full border-stone-300 hover:bg-stone-50 hover:border-stone-400">
                              <Edit2 className="w-5 h-5 text-stone-600" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle className="font-serif text-2xl">{isWedding ? "Impostazioni Matrimonio" : "Modifica Capitolo"}</DialogTitle>
                            </DialogHeader>
                            <form encType="multipart/form-data" action={updateChapter.bind(null, chapter.id, wedding.slug)} className="space-y-4 pt-4">
                              {isWedding ? (
                                <>
                                  <input type="hidden" name="type" value="WEDDING" />
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Nome Sposo/a 1</Label>
                                      <Input name="brideName" defaultValue={chapter.brideName} required />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Nome Sposo/a 2</Label>
                                      <Input name="groomName" defaultValue={chapter.groomName} required />
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="space-y-2">
                                  <Label>Tipo di Evento</Label>
                                  <select name="type" defaultValue={chapter.type} className="w-full flex h-10 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-800" required>
                                    {Object.entries(CHAPTER_TYPES).map(([val, label]) => (
                                      <option key={val} value={val}>{label}</option>
                                    ))}
                                  </select>
                                </div>
                              )}
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Data Evento</Label>
                                  <Input type="date" name="date" defaultValue={chapter.date ? new Date(chapter.date).toISOString().split('T')[0] : ''} required />
                                </div>
                                <div className="space-y-2">
                                  <Label>Visibilità</Label>
                                  <select name="visibility" defaultValue={chapter.visibility} className="w-full flex h-10 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-800">
                                    <option value="PRIVATE">Solo per noi</option>
                                    <option value="FAMILY">Condiviso con la famiglia</option>
                                    <option value="PUBLIC">Pubblico</option>
                                  </select>
                                </div>
                              </div>
                              
                              {!isWedding && (
                                <div className="space-y-2">
                                  <Label>Titolo del Capitolo</Label>
                                  <Input name="title" defaultValue={chapter.title || ''} required />
                                </div>
                              )}
                              <div className="space-y-2">
                                <Label>Descrizione (opzionale)</Label>
                                <textarea name="description" defaultValue={chapter.description || ''} className="w-full min-h-24 p-3 border border-stone-300 rounded-md resize-none text-sm focus:outline-none focus:ring-2 focus:ring-stone-800" />
                              </div>
                              <div className="space-y-2 pb-4">
                                <Label>{isWedding ? "Immagine di Sfondo (Vetrina Pubblica)" : "Nuova Immagine di Copertina"} (opzionale)</Label>
                                <Input name="coverFile" type="file" accept="image/*" />
                              </div>
                              <DialogFooter>
                                <DialogClose type="button" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                                  Annulla
                                </DialogClose>
                                <SubmitButton defaultText="Salva Modifiche" loadingText="Salvataggio..." className="bg-stone-800 hover:bg-stone-700 text-white rounded-md" />
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>

                        {!isWedding && (
                          <form action={deleteChapter.bind(null, chapter.id, wedding.slug)}>
                            <SubmitButton 
                              variant="outline" 
                              size="icon" 
                              defaultText={<Trash2 className="w-5 h-5 text-rose-500" />} 
                              loadingText={<Trash2 className="w-5 h-5 text-stone-300 animate-pulse" />} 
                              className="h-14 w-14 rounded-full border-stone-300 hover:bg-rose-50 hover:border-rose-200"
                            />
                          </form>
                        )}
                      <Link href={`/couple/${wedding.slug}/chapter/${chapter.slug}`}>
                        <Button className="bg-stone-800 hover:bg-stone-700 text-white gap-2 rounded-full px-6 py-6 h-auto text-lg">
                          Apri Capitolo <ArrowRight className="w-5 h-5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-stone-100">
                    <ShareChapterButtons
                      urlPath={`/w/${wedding.slug}/chapter/${chapter.slug}`}
                      title={`${isWedding ? "Il Matrimonio" : (chapter.title || CHAPTER_TYPES[chapter.type] || "Capitolo")} — ${wedding.brideName} & ${wedding.groomName}`}
                      label="Condividi questo capitolo:"
                    />
                  </div>
                </div>
              </div>
            );
          })}

          <div className="relative pt-8">
            <div className="absolute -left-[49px] md:-left-[65px] flex items-center justify-center w-8 h-8 rounded-full border-4 border-[#faf9f8] bg-stone-300 text-stone-600 text-lg font-serif z-10 shadow-sm">+</div>
            
            <div className="border-2 border-dashed border-stone-300 rounded-3xl p-10 md:p-16 text-center bg-transparent transition-all hover:border-stone-400 hover:bg-stone-100/50">
               <h3 className="text-2xl font-serif text-stone-700 mb-4">La storia continua</h3>
               <p className="text-stone-500 mb-8 max-w-md mx-auto leading-relaxed">
                 Questa storia può continuare con nuovi ricordi, viaggi, anniversari e momenti importanti da custodire per sempre.
               </p>
               
               <Dialog>
                 <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border bg-background shadow-sm rounded-full border-stone-300 text-stone-800 hover:bg-stone-200 h-11 px-6 py-2">
                   <Plus className="w-5 h-5 mr-2" /> Aggiungi un capitolo
                 </DialogTrigger>
                 <DialogContent className="sm:max-w-[500px]">
                   <DialogHeader>
                     <DialogTitle className="font-serif text-2xl">Aggiungi un nuovo capitolo</DialogTitle>
                   </DialogHeader>
                   <form encType="multipart/form-data" action={createChapter.bind(null, wedding.id)} className="space-y-4 pt-4">
                     
                     <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <Label>Tipo di Evento</Label>
                         <select name="type" className="w-full flex h-10 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-800" required>
                           {Object.entries(CHAPTER_TYPES).map(([val, label]) => (
                             <option key={val} value={val}>{label}</option>
                           ))}
                         </select>
                       </div>
                       <div className="space-y-2">
                         <Label>Data Evento</Label>
                         <Input type="date" name="date" required />
                       </div>
                     </div>

                     <div className="space-y-2">
                       <Label>Titolo del Capitolo</Label>
                       <Input name="title" placeholder="Es. Viaggio di Nozze in Giappone" required />
                     </div>

                     <div className="space-y-2">
                       <Label>Descrizione (opzionale)</Label>
                       <textarea 
                         name="description" 
                         className="w-full min-h-24 p-3 border border-stone-300 rounded-md resize-none text-sm focus:outline-none focus:ring-2 focus:ring-stone-800"
                         placeholder="Racconta brevemente questo momento..."
                       />
                     </div>
                     
                     <div className="space-y-2">
                       <Label>Visibilità</Label>
                       <select name="visibility" className="w-full flex h-10 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-800">
                         <option value="PRIVATE">Solo per noi</option>
                         <option value="FAMILY">Condiviso con la famiglia</option>
                         <option value="PUBLIC">Pubblico</option>
                       </select>
                     </div>

                     <div className="space-y-2 pb-4">
                       <Label>Immagine di Copertina (opzionale)</Label>
                       <Input name="coverFile" type="file" accept="image/*" />
                     </div>

                     <DialogFooter>
                       <DialogClose type="button" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                         Annulla
                       </DialogClose>
                       <SubmitButton 
                         defaultText="Salva Capitolo" 
                         loadingText="Salvataggio..." 
                         className="bg-stone-800 hover:bg-stone-700 text-white rounded-md" 
                       />
                     </DialogFooter>
                   </form>
                 </DialogContent>
               </Dialog>
            </div>
          </div>
        </div>

        {/* QR CODE DA TAVOLO SECTION */}
        <div className="mt-16 bg-white border border-stone-200 p-8 md:p-10 rounded-3xl shadow-sm">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-stone-800 mb-2 font-serif">QR Code per i Tavoli</h3>
              <p className="text-stone-500 max-w-lg mb-6">
                Salva questo QR code o stampalo per metterlo sui tavoli del tuo matrimonio. I tuoi invitati dovranno semplicemente inquadrarlo con il loro telefono per inviarvi foto e video in diretta!
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center md:justify-start">
                <Link href={`/couple/${wedding.slug}/print-cards`}>
                  <Button size="lg" className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-full font-bold px-7 h-12 shadow-md border-none">
                    <QrCode className="mr-2 h-5 w-5" /> Stampa Cartoncini QR da Tavolo (A4)
                  </Button>
                </Link>
                <a 
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${baseUrl}/w/${wedding.slug}/upload`}
                  download="QR_Code_Matrimonio.png"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600 text-white rounded-full font-semibold px-7 h-12 shadow-md">
                    Scarica Solo PNG
                  </Button>
                </a>
                <Link href={`/live/${wedding.slug}`} target="_blank">
                  <Button size="lg" className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 text-white rounded-full font-semibold px-7 h-12 shadow-md border-2 border-stone-800 hover:border-stone-700">
                    Avvia GentiLuna LIVE 🚀
                  </Button>
                </Link>
              </div>
            </div>
            <div className="shrink-0 bg-stone-50 p-4 rounded-2xl border border-stone-200 shadow-inner flex flex-col items-center">
              <div className="w-40 h-40 relative">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${baseUrl}/w/${wedding.slug}/upload`}
                  alt="QR Code Matrimonio"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs text-stone-400 mt-3 font-semibold uppercase tracking-widest">Anteprima</span>
            </div>
          </div>
        </div>

        {/* INVITE PROS SECTION */}
        <div className="mt-8 bg-white border border-stone-200 p-8 md:p-10 rounded-3xl shadow-sm text-center">
          <h3 className="text-2xl font-bold text-stone-800 mb-3 font-serif">
            Invita i tuoi Professionisti (Fotografo, Planner, Location...)
          </h3>
          <p className="text-stone-500 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
            Vuoi che il tuo fotografo ufficiale, videomaker o wedding planner collabori su questo spazio su GentiLuna e carichi l&apos;album in alta qualità per gli invitati? Inviagli subito l&apos;invito diretto.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Ciao! Stiamo organizzando il nostro matrimonio su GentiLuna (${baseUrl}/w/${wedding.slug}) per raccogliere le foto e coordinare i dettagli. Ci farebbe piacere averti come nostro professionista ufficiale collegato allo spazio! Registrati o entra da qui: ${baseUrl}/professionisti`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold px-6 h-11">
                Invia Invito ai Professionisti (WhatsApp)
              </Button>
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent(`Invito collaborazione matrimonio ${coupleNamesText} su GentiLuna`)}&body=${encodeURIComponent(`Ciao!\n\nStiamo usando GentiLuna (${baseUrl}/w/${wedding.slug}) per il nostro matrimonio.\nPuoi attivare la tua vetrina e collaborare direttamente sul nostro spazio da qui: ${baseUrl}/professionisti\n\nA presto!\n${coupleNamesText}`)}`}
            >
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-stone-300 text-stone-700 hover:bg-stone-50 rounded-full font-semibold px-6 h-11">
                Invia via Email
              </Button>
            </a>
            <Link href="/fornitori">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-amber-300 text-amber-800 hover:bg-amber-50 rounded-full font-semibold px-6 h-11">
                Cerca tra i Professionisti già Iscritti
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
