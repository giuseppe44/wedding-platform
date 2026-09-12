import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { verifyProAssignment } from "@/app/proAssignmentActions";
import { requireAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { createChapter } from "@/app/chapterActions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import Link from "next/link";
import { Plus, ArrowRight, Calendar, Check, X, Camera } from "lucide-react";
import { approveMedia, rejectMedia } from "@/app/actions";
import { PlanWidget } from "@/components/PlanWidget";

export default async function CoupleDashboard({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);
  
  const wedding = await prisma.timelineItem.findUnique({
    where: { slug: slug },
  });

  if (!wedding) notFound();

  
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
      "Timeline illimitata per i capitoli di vita",
      "Foto e Video in altissima qualità e senza limiti",
      "Possibilità di rimuovere il marchio della piattaforma",
      "Gestione avanzata per migliaia di invitati"
    ] : [
      "Fino a 3 capitoli della vostra storia",
      "Raccolta foto da invitati (fino a 200 media)",
      "Gestione Invitati e Tavoli (fino a 50 ospiti)",
      "Digital Guestbook"
    ],
    missing: isCouplePremium ? [] : [
      "Spazio illimitato per migliaia di foto e video ad alta risoluzione",
      "Capitoli di vita infiniti (Viaggi, Anniversari, Famiglia)",
      "Gestione di oltre 50 invitati",
      "Rimozione del logo della piattaforma"
    ]
  };

  const stripeConfigured = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans pb-24">
      {/* 1. Header Emozionale */}
      <div className="bg-white shadow-sm border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-stone-800 tracking-tight mb-4">La Nostra Storia</h1>
          <p className="text-lg text-stone-500 font-light italic max-w-2xl mx-auto">
            Il vostro matrimonio è il primo capitolo. La vostra storia continua qui.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {isOwner && (
          <PlanWidget 
            role="COUPLE"
            currentPlanName={couplePlanName}
            isActive={!!coupleSubscription}
            expiresAt={coupleSubscription?.currentPeriodEnd?.toISOString() || coupleSubscription?.expiresAt?.toISOString()}
            features={coupleFeatures}
            upgradeLink={`/couple/${wedding.slug}/billing`}
            stripeConfigured={stripeConfigured}
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
                  <img src={m.url} alt="Da approvare" className="w-full h-full object-cover" />
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
                
                <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                    {chapter.coverImage && (
                      <div className="absolute inset-0 w-full h-full opacity-[0.15] pointer-events-none transition-opacity group-hover:opacity-20">
                        <img src={chapter.coverImage} className="w-full h-full object-cover" alt="" />
                      </div>
                    )}
                    <div className="relative z-10 flex-1">
                       <div className="text-xs font-bold tracking-widest text-stone-500 mb-2 uppercase">Capitolo {nodeNumber}: {displayType}</div>
                       <h3 className="text-3xl font-serif text-stone-800 mb-2">{displayTitle}</h3>
                       {chapter.date && <p className="text-stone-600 flex items-center gap-2 font-medium"><Calendar className="w-4 h-4"/> {new Date(chapter.date).toLocaleDateString('it-IT')}</p>}
                    </div>
                    
                    <div className="relative z-10 shrink-0">
                      <Link href={`/couple/${wedding.slug}/chapter/${chapter.slug}`}>
                        <Button className="bg-stone-800 hover:bg-stone-700 text-white gap-2 rounded-full px-6 py-6 h-auto text-lg">
                          Apri Capitolo <ArrowRight className="w-5 h-5" />
                        </Button>
                      </Link>
                    </div>
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
                       <Button type="submit" className="bg-stone-800 hover:bg-stone-700 text-white rounded-md">
                         Salva Capitolo
                       </Button>
                     </DialogFooter>
                   </form>
                 </DialogContent>
               </Dialog>
            </div>
          </div>
        </div>

        {/* INVITE PROS SECTION */}
        <div className="mt-16 bg-white border border-stone-200 p-8 md:p-10 rounded-3xl shadow-sm text-center">
          <h3 className="text-2xl font-bold text-stone-800 mb-4 font-serif">Invita il tuo Fotografo</h3>
          <p className="text-stone-500 mb-8 max-w-2xl mx-auto">
            Vuoi che il tuo fotografo ufficiale carichi l'album in alta qualità direttamente nel vostro ecos.com per farlo vedere a tutti gli invitati? Inviagli un link di invito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`https://wa.me/?text=${encodeURIComponent("Ciao! Stiamo organizzando il nostro ecos.com per condividere tutte le foto del matrimonio. Ti andrebbe di iscriverti come nostro fotografo ufficiale? Potrai caricare l'album direttamente lì e mostrare il tuo lavoro a tutti gli invitati! Ecco il link: https://wedding-platform-topwebsitee.vercel.app/professionisti")}`} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-stone-300 text-stone-700 hover:bg-stone-50 rounded-full font-semibold px-8 h-12">
                <span className="text-emerald-500 mr-2">WhatsApp</span> Invia Invito al Fotografo
              </Button>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
