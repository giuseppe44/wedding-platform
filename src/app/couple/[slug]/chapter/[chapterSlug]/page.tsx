import { prisma } from "@/lib/prisma";
import { notFound, permanentRedirect } from "next/navigation";
import { resolveLegacyTimelineSlug } from "@/lib/slugify";
import { verifyProAssignment } from "@/app/proAssignmentActions";
import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, MessageSquareHeart, Settings, Clock, Download, Check, X, ArrowLeft, Trash2, Edit2, Users, Gift, Wallet, MapPin, Sparkles, ExternalLink } from "lucide-react";
import ShareChapterButtons from "@/components/ShareChapterButtons";
import { approveMedia, rejectMedia, deleteMediaAction } from "@/app/actions";
import { updateBranding, addTimelineItem, deleteTimelineItem, updateTimelineItem, approveMessage, rejectMessage } from "@/app/coupleActions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { updateChapter, deleteChapter } from "@/app/chapterActions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ChapterUploader from "./ChapterUploader";
import ChapterGallery from "./ChapterGallery";
import ExtendedDetailsForm from "./ExtendedDetailsForm";
import SeatingManager from "./SeatingManager";
import GiftManager from "./GiftManager";
import WalletManager from "./WalletManager";
import ShareVetrinaButtons from "./ShareVetrinaButtons";
import ProManager from "./ProManager";
import { getUserEntitlements } from "@/lib/entitlementHelper";

export default async function ChapterDetailPage({ params, searchParams }: { params: Promise<{ slug: string, chapterSlug: string }>, searchParams: Promise<{ albumId?: string }> }) {
  const { slug, chapterSlug } = await params;
  const { albumId } = await searchParams;
  
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE", "ADMIN"]);

  // The base wedding for context/slugs
  const wedding = await prisma.timelineItem.findUnique({
    where: { slug: slug },
    include: { guests: { orderBy: { name: "asc" } } },
  });
  
  if (!wedding) {
    const newSlug = await resolveLegacyTimelineSlug(slug);
    const newChap = (await resolveLegacyTimelineSlug(chapterSlug)) || chapterSlug;
    if (newSlug) {
      permanentRedirect(`/couple/${newSlug}/chapter/${newChap}`);
    }
    notFound();
    return;
  }
  const entitlements = await getUserEntitlements(wedding.ownerId);

  if (!wedding) notFound();

  
  const isOwner = wedding.ownerId === session.userId || wedding.coupleId === session.userId || session.role === "ADMIN";
  const isAssigned = await verifyProAssignment(wedding.id, session.userId);

  if (!isOwner && !isAssigned) {
    notFound();
  }

  // The specific chapter
  const chapter = await prisma.timelineItem.findUnique({
    where: { slug: chapterSlug },
    include: {
      media: { where: { status: "PENDING" }, orderBy: { createdAt: "desc" } },
      schedule: { orderBy: { order: "asc" } },
      messages: { orderBy: { createdAt: "desc" } },
      travelDocuments: { orderBy: { createdAt: "desc" } },
      locations: true, guests: true, tables: true, giftOptions: true, assignments: { include: { professionalProfile: true } }, selectedGuests: true,
      albums: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!chapter) notFound();

  // Ensure security (must belong to same family or couple)
  if (chapter.id !== wedding.id && chapter.familyId !== wedding.familyId && chapter.coupleId !== wedding.coupleId) {
    notFound();
  }

  const isWedding = chapter.type === "WEDDING";
  const displayTitle = isWedding ? `${chapter.brideName} & ${chapter.groomName}` : (chapter.title || "Capitolo senza titolo");
  
  const CHAPTER_TYPES: Record<string, string> = {
    "WEDDING": "Matrimonio",
    "ANNIVERSARY": "Anniversario",
    "TRAVEL": "Viaggio",
    "BIRTH": "Nascita",
    "BAPTISM": "Battesimo",
    "BIRTHDAY": "Compleanno",
    "FAMILY": "Famiglia",
    "MEMORY": "Ricordo",
    "CUSTOM": "Altro"
  };
  const displayType = CHAPTER_TYPES[chapter.type] || "Ricordo";

  const pendingMedia = chapter.media;

  const approvedWhere: any = { timelineItemId: chapter.id, status: "APPROVED" };
  if (albumId) approvedWhere.albumId = albumId;

  const rawApprovedMedia = await prisma.media.findMany({
    where: approvedWhere,
    orderBy: { createdAt: "desc" },
    take: 31
  });
  
  const initialHasMore = rawApprovedMedia.length === 31;
  const approvedMedia = initialHasMore ? rawApprovedMedia.slice(0, 30) : rawApprovedMedia;
  const initialCursor = approvedMedia.length > 0 ? approvedMedia[approvedMedia.length - 1].id : null;

  
  const pendingMessages = chapter.messages.filter((m: any) => m.status === "PENDING");
  const approvedMessages = chapter.messages.filter((m: any) => m.status === "APPROVED");

  const completionChecks = [
    { label: "Copertina", done: Boolean(chapter.coverImage) },
    { label: "Location", done: (chapter.locations?.length || 0) > 0 },
    { label: "Programma", done: (chapter.schedule?.length || 0) > 0 },
    { label: "Invitati / Tavoli", done: (chapter.guests?.length || 0) > 0 || (chapter.tables?.length || 0) > 0 },
    { label: "Foto", done: approvedMedia.length > 0 },
    { label: "Lista Regali", done: (chapter.giftOptions?.length || 0) > 0 },
  ];
  const completionPct = Math.round(
    (completionChecks.filter((c) => c.done).length / completionChecks.length) * 100
  );
  const nextStepHint = completionChecks.find((c) => !c.done)?.label;
  const defaultTab =
    isOwner && (chapter.locations?.length || 0) === 0 && approvedMedia.length === 0
      ? "dettagli"
      : "photos";

  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans pb-24">
      {/* 1. Hero Compatta del Capitolo */}
      <div className="relative w-full h-[30vh] md:h-[36vh] bg-stone-900 flex items-center justify-center overflow-hidden">
        {chapter.coverImage ? (
          <img src={`/api/media/cover/${chapter.id}`} className="absolute inset-0 w-full h-full object-cover opacity-55" alt={displayTitle} />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-stone-900 via-rose-950/70 to-amber-900/50 opacity-90" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-amber-200 text-xs md:text-sm font-bold tracking-widest uppercase mb-2">{displayType}</p>
          <h1 className="text-3xl md:text-5xl font-serif text-white tracking-tight mb-2 drop-shadow">{displayTitle}</h1>
          {chapter.date && (
            <p className="text-stone-200 text-base md:text-lg font-light italic">
              {new Date(chapter.date).toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
        </div>

        <Link href={`/couple/${wedding.slug}`} className="absolute top-5 left-5 z-20">
          <Button variant="outline" className="bg-white/15 text-white border-white/25 hover:bg-white/25 backdrop-blur-md rounded-full gap-2">
            <ArrowLeft className="w-4 h-4" /> La Nostra Storia
          </Button>
        </Link>
      </div>

      {/* 2. AREA DI GESTIONE IN PRIMA POSIZIONE (Stile macOS Dock — Fulcro Operativo Sposi) */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] p-5 md:p-8 shadow-[0_24px_60px_rgba(28,25,23,0.12)] border border-stone-200/80">
          {/* macOS Window Top Dots */}
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400 shadow-inner" />
              <span className="w-3 h-3 rounded-full bg-amber-400 shadow-inner" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-inner" />
              <span className="ml-2 text-xs font-semibold text-stone-400 tracking-wide">
                GentiLuna Studio • {displayTitle}
              </span>
            </div>
            <span className="text-xs font-bold text-stone-700 bg-stone-100 border border-stone-200/80 px-3 py-1 rounded-full">
              Completamento:{" "}
              <span className={completionPct >= 80 ? "text-emerald-600" : completionPct >= 40 ? "text-amber-600" : "text-rose-600"}>
                {completionPct}%
              </span>
            </span>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 pb-6 mb-6 border-b border-stone-100">
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" /> Pannello di Controllo Sposi
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900">Area di Gestione</h2>
              <p className="text-stone-500 text-sm">
                {nextStepHint
                  ? `Prossimo passo consigliato: clicca l'icona "${nextStepHint}" nella barra qui sotto.`
                  : "Ottimo lavoro! Il vostro capitolo è completo e pronto da condividere con tutti gli invitati."}
              </p>
              <div className="w-full max-w-md h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200/70">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    completionPct >= 80
                      ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                      : completionPct >= 40
                      ? "bg-gradient-to-r from-amber-500 to-rose-400"
                      : "bg-gradient-to-r from-rose-500 to-pink-500"
                  }`}
                  style={{ width: `${Math.max(completionPct, 8)}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
              <div className="flex gap-2 items-center flex-wrap">
                <Link href={`/w/${wedding.slug}/chapter/${chapter.slug}`} target="_blank">
                  <Button className="bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white rounded-full shadow-md gap-2 font-semibold px-5">
                    <ExternalLink className="w-4 h-4" />
                    Apri Sito Pubblico
                  </Button>
                </Link>

                {!isWedding && (
                <>
                  <Dialog>
                    <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border bg-background shadow-sm rounded-full border-stone-300 text-stone-800 hover:bg-stone-200 h-10 w-10 p-0" title="Modifica">
                      <Edit2 className="w-4 h-4" />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle className="font-serif text-2xl">Modifica Capitolo</DialogTitle>
                      </DialogHeader>
                      <form encType="multipart/form-data" action={updateChapter.bind(null, chapter.id, wedding.slug)} className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Tipo di Evento</Label>
                            <select name="type" defaultValue={chapter.type} className="w-full flex h-10 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-800" required>
                              {Object.entries(CHAPTER_TYPES).filter(([k]) => k !== "WEDDING").map(([val, label]) => (
                                <option key={val} value={val}>{label}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label>Data Evento</Label>
                            <Input type="date" name="date" defaultValue={chapter.date ? new Date(chapter.date).toISOString().split('T')[0] : ''} required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Titolo del Capitolo</Label>
                          <Input name="title" defaultValue={chapter.title || ''} required />
                        </div>
                        <div className="space-y-2">
                          <Label>Descrizione</Label>
                          <textarea name="description" defaultValue={chapter.description || ''} className="w-full min-h-24 p-3 border border-stone-300 rounded-md resize-none text-sm focus:outline-none focus:ring-2 focus:ring-stone-800" />
                        </div>
                        <div className="space-y-2">
                          <Label>Visibilità</Label>
                          <select name="visibility" defaultValue={chapter.visibility || 'PRIVATE'} className="w-full flex h-10 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-800">
                            <option value="PRIVATE">Solo per noi</option>
                            <option value="FAMILY">Condiviso con la famiglia</option>
                            <option value="PUBLIC">Pubblico</option>
                          </select>
                        </div>
                        <div className="space-y-2 pb-4">
                          <Label>Nuova Copertina (opzionale)</Label>
                          <Input name="coverFile" type="file" accept="image/*" />
                        </div>
                        <DialogFooter>
                          <DialogClose type="button" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">Annulla</DialogClose>
                          <Button type="submit" className="bg-stone-800 hover:bg-stone-700 text-white rounded-md">Salva Modifiche</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <form action={deleteChapter.bind(null, chapter.id, wedding.slug)}>
                    <Button type="submit" variant="outline" className="text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full h-10 w-10 p-0" title="Elimina Capitolo">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </form>
                </>
              )}
              </div>

              <ShareChapterButtons
                urlPath={`/w/${wedding.slug}/chapter/${chapter.slug}`}
                title={`${displayTitle} — ${wedding.brideName} & ${wedding.groomName}`}
                label="Condividi:"
              />
            </div>
          </div>

          <Tabs defaultValue={defaultTab} className="w-full flex flex-col gap-8">
            {/* macOS Frosted Glass Dock */}
            <TabsList className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 w-full group-data-horizontal/tabs:h-auto !h-auto bg-stone-100/80 backdrop-blur-xl p-2.5 rounded-3xl border border-stone-200/80 shadow-inner">
              {isOwner && (
                <TabsTrigger
                  value="dettagli"
                  className="group/dock relative flex flex-col items-center justify-center gap-1.5 py-3 px-2 !h-auto rounded-2xl border border-transparent text-stone-600 hover:bg-white/80 hover:-translate-y-0.5 data-active:bg-white data-active:text-stone-900 data-active:shadow-md data-active:border-stone-200/80 data-active:-translate-y-0.5 transition-all cursor-pointer after:hidden"
                >
                  <div className="relative w-11 h-11 rounded-[14px] bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-md shadow-rose-500/25 group-hover/dock:scale-105 transition-transform">
                    <MapPin className="h-5 w-5" />
                    <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-stone-900 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                      {chapter.locations?.length || 0}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">Luoghi &amp; Info</span>
                </TabsTrigger>
              )}

              {isOwner && (
                <TabsTrigger
                  value="timeline"
                  className="group/dock relative flex flex-col items-center justify-center gap-1.5 py-3 px-2 !h-auto rounded-2xl border border-transparent text-stone-600 hover:bg-white/80 hover:-translate-y-0.5 data-active:bg-white data-active:text-stone-900 data-active:shadow-md data-active:border-stone-200/80 data-active:-translate-y-0.5 transition-all cursor-pointer after:hidden"
                >
                  <div className="relative w-11 h-11 rounded-[14px] bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/25 group-hover/dock:scale-105 transition-transform">
                    <Clock className="h-5 w-5" />
                    <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-stone-900 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                      {chapter.schedule?.length || 0}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">Programma</span>
                </TabsTrigger>
              )}

              <TabsTrigger
                value="photos"
                className="group/dock relative flex flex-col items-center justify-center gap-1.5 py-3 px-2 !h-auto rounded-2xl border border-transparent text-stone-600 hover:bg-white/80 hover:-translate-y-0.5 data-active:bg-white data-active:text-stone-900 data-active:shadow-md data-active:border-stone-200/80 data-active:-translate-y-0.5 transition-all cursor-pointer after:hidden"
              >
                <div className="relative w-11 h-11 rounded-[14px] bg-gradient-to-br from-sky-400 to-blue-600 text-white flex items-center justify-center shadow-md shadow-sky-500/25 group-hover/dock:scale-105 transition-transform">
                  <Camera className="h-5 w-5" />
                  <span className={`absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full text-white text-[10px] font-bold flex items-center justify-center border-2 border-white ${pendingMedia.length > 0 ? "bg-rose-500" : "bg-stone-900"}`}>
                    {approvedMedia.length}{pendingMedia.length > 0 ? `+` : ""}
                  </span>
                </div>
                <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">Foto &amp; Album</span>
              </TabsTrigger>

              {isOwner && (
                <TabsTrigger
                  value="seating"
                  className="group/dock relative flex flex-col items-center justify-center gap-1.5 py-3 px-2 !h-auto rounded-2xl border border-transparent text-stone-600 hover:bg-white/80 hover:-translate-y-0.5 data-active:bg-white data-active:text-stone-900 data-active:shadow-md data-active:border-stone-200/80 data-active:-translate-y-0.5 transition-all cursor-pointer after:hidden"
                >
                  <div className="relative w-11 h-11 rounded-[14px] bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover/dock:scale-105 transition-transform">
                    <Users className="h-5 w-5" />
                    <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-stone-900 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                      {chapter.guests?.length || 0}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">Invitati &amp; Tavoli</span>
                </TabsTrigger>
              )}

              {isOwner && (
                <TabsTrigger
                  value="gifts"
                  className="group/dock relative flex flex-col items-center justify-center gap-1.5 py-3 px-2 !h-auto rounded-2xl border border-transparent text-stone-600 hover:bg-white/80 hover:-translate-y-0.5 data-active:bg-white data-active:text-stone-900 data-active:shadow-md data-active:border-stone-200/80 data-active:-translate-y-0.5 transition-all cursor-pointer after:hidden"
                >
                  <div className="relative w-11 h-11 rounded-[14px] bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover/dock:scale-105 transition-transform">
                    <Gift className="h-5 w-5" />
                    <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-stone-900 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                      {chapter.giftOptions?.length || 0}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">Lista Regali</span>
                </TabsTrigger>
              )}

              <TabsTrigger
                value="messages"
                className="group/dock relative flex flex-col items-center justify-center gap-1.5 py-3 px-2 !h-auto rounded-2xl border border-transparent text-stone-600 hover:bg-white/80 hover:-translate-y-0.5 data-active:bg-white data-active:text-stone-900 data-active:shadow-md data-active:border-stone-200/80 data-active:-translate-y-0.5 transition-all cursor-pointer after:hidden"
              >
                <div className="relative w-11 h-11 rounded-[14px] bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-fuchsia-500/25 group-hover/dock:scale-105 transition-transform">
                  <MessageSquareHeart className="h-5 w-5" />
                  <span className={`absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full text-white text-[10px] font-bold flex items-center justify-center border-2 border-white ${pendingMessages.length > 0 ? "bg-rose-500" : "bg-stone-900"}`}>
                    {approvedMessages.length}{pendingMessages.length > 0 ? `+` : ""}
                  </span>
                </div>
                <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">Dediche</span>
              </TabsTrigger>

              {isOwner && (
                <TabsTrigger
                  value="wallet"
                  className="group/dock relative flex flex-col items-center justify-center gap-1.5 py-3 px-2 !h-auto rounded-2xl border border-transparent text-stone-600 hover:bg-white/80 hover:-translate-y-0.5 data-active:bg-white data-active:text-stone-900 data-active:shadow-md data-active:border-stone-200/80 data-active:-translate-y-0.5 transition-all cursor-pointer after:hidden"
                >
                  <div className="relative w-11 h-11 rounded-[14px] bg-gradient-to-br from-cyan-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/25 group-hover/dock:scale-105 transition-transform">
                    <Wallet className="h-5 w-5" />
                    <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-stone-900 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                      {chapter.travelDocuments?.length || 0}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">Documenti</span>
                </TabsTrigger>
              )}

              {isOwner && (
                <TabsTrigger
                  value="pros"
                  className="group/dock relative flex flex-col items-center justify-center gap-1.5 py-3 px-2 !h-auto rounded-2xl border border-transparent text-stone-600 hover:bg-white/80 hover:-translate-y-0.5 data-active:bg-white data-active:text-stone-900 data-active:shadow-md data-active:border-stone-200/80 data-active:-translate-y-0.5 transition-all cursor-pointer after:hidden"
                >
                  <div className="relative w-11 h-11 rounded-[14px] bg-gradient-to-br from-orange-400 to-rose-500 text-white flex items-center justify-center shadow-md shadow-orange-500/25 group-hover/dock:scale-105 transition-transform">
                    <Camera className="h-5 w-5" />
                    <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-stone-900 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                      {chapter.assignments?.length || 0}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">Team</span>
                </TabsTrigger>
              )}

              {isOwner && (
                <TabsTrigger
                  value="settings"
                  className="group/dock relative flex flex-col items-center justify-center gap-1.5 py-3 px-2 !h-auto rounded-2xl border border-transparent text-stone-600 hover:bg-white/80 hover:-translate-y-0.5 data-active:bg-white data-active:text-stone-900 data-active:shadow-md data-active:border-stone-200/80 data-active:-translate-y-0.5 transition-all cursor-pointer after:hidden"
                >
                  <div className="relative w-11 h-11 rounded-[14px] bg-gradient-to-br from-stone-600 to-stone-800 text-white flex items-center justify-center shadow-md shadow-stone-700/25 group-hover/dock:scale-105 transition-transform">
                    <Settings className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">Impostazioni</span>
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="photos" className="space-y-6 animate-in fade-in">
              {pendingMedia.length > 0 && (
                <section className="bg-orange-50 p-6 rounded-xl border border-orange-100 mb-8">
                  <h2 className="text-xl font-semibold mb-4 text-orange-800">Foto da Approvare (Ospiti)</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {pendingMedia.map((m: any) => (
                      <div key={m.id} className="relative group rounded-xl overflow-hidden shadow-sm aspect-square bg-white">
                        <img src={`/api/media/${m.id}`} alt="Da approvare" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <form action={approveMedia.bind(null, m.id)}>
                            <Button type="submit" size="icon" className="bg-green-500 hover:bg-green-600 rounded-full h-10 w-10"><Check className="h-5 w-5" /></Button>
                          </form>
                          <form action={rejectMedia.bind(null, m.id)}>
                            <Button type="submit" variant="destructive" size="icon" className="rounded-full h-10 w-10"><X className="h-5 w-5" /></Button>
                          </form>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <h2 className="text-xl font-serif text-stone-800">Gestione Galleria</h2>
                  <a href={`/api/download/${chapter.slug}`} download>
                    <Button variant="outline" className="gap-2 rounded-full border-stone-300">
                      <Download className="h-4 w-4" /> Scarica (ZIP)
                    </Button>
                  </a>
                </div>
                {approvedMedia.length === 0 ? (
                  <p className="text-stone-500 italic">Nessuna foto approvata al momento.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {approvedMedia.map((m: any) => (
                      <div key={m.id} className="relative group rounded-xl overflow-hidden shadow-sm aspect-square bg-stone-100">
                        <img src={`/api/media/${m.id}`} alt="Approvata" className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          {/* Owner can delete directly from here as well */}
                          <form action={deleteMediaAction.bind(null, m.id)}>
                            <Button type="submit" variant="destructive" size="icon" className="h-8 w-8 rounded-full shadow-lg" title="Elimina"><Trash2 className="h-4 w-4" /></Button>
                          </form>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </TabsContent>

            <TabsContent value="messages" className="space-y-6 animate-in fade-in">
              {pendingMessages.length > 0 && (
                <section className="bg-orange-50 p-6 rounded-xl border border-orange-100 mb-8">
                  <h2 className="text-xl font-semibold mb-4 text-orange-800">Dediche da Approvare</h2>
                  <div className="space-y-4">
                    {pendingMessages.map((msg: any) => (
                      <Card key={msg.id} className="border-orange-200">
                        <CardContent className="p-4 flex justify-between items-center">
                          <div>
                            <p className="italic text-stone-700">"{msg.text}"</p>
                            <p className="text-sm font-semibold mt-1 text-stone-500">— {msg.guestName || "Anonimo"}</p>
                          </div>
                          <div className="flex gap-2 shrink-0 ml-4">
                            <form action={approveMessage.bind(null, msg.id, wedding.slug)}>
                              <Button type="submit" className="bg-green-600 hover:bg-green-700 rounded-full" size="icon"><Check className="h-4 w-4" /></Button>
                            </form>
                            <form action={rejectMessage.bind(null, msg.id, wedding.slug)}>
                              <Button type="submit" variant="destructive" size="icon" className="rounded-full"><X className="h-4 w-4" /></Button>
                            </form>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}
              <section>
                <h2 className="text-xl font-serif text-stone-800 mb-6">Dediche Pubblicate</h2>
                {approvedMessages.length === 0 ? (
                  <p className="text-stone-500 italic">Nessuna dedica pubblicata.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {approvedMessages.map((msg: any) => (
                      <Card key={msg.id} className="border-stone-200 shadow-sm">
                        <CardContent className="p-5 relative group">
                          <p className="italic text-stone-700">"{msg.text}"</p>
                          <p className="text-sm font-semibold mt-3 text-stone-400 text-right">— {msg.guestName || "Anonimo"}</p>
                          <form action={rejectMessage.bind(null, msg.id, wedding.slug)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button type="submit" variant="destructive" size="icon" className="h-6 w-6 rounded-full"><X className="h-3 w-3" /></Button>
                          </form>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </section>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6 animate-in fade-in">
              <Card className="border-stone-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="font-serif">Aggiungi Fase Evento</CardTitle>
                </CardHeader>
                <CardContent>
                  <form action={addTimelineItem.bind(null, chapter.id)} className="flex flex-col md:flex-row gap-4 items-end">
                    <input type="hidden" name="slug" value={chapter.slug} />
                    <div className="w-full md:w-1/4">
                      <Label>Orario / Dettaglio</Label>
                      <Input name="time" type="text" required placeholder="Es. 10:00 o Giorno 1" className="border-stone-300" />
                    </div>
                    <div className="w-full md:w-1/4">
                      <Label>Titolo</Label>
                      <Input name="title" required placeholder="Titolo" className="border-stone-300" />
                    </div>
                    <div className="w-full md:w-2/4">
                      <Label>Descrizione (Opz.)</Label>
                      <Input name="description" placeholder="Descrizione" className="border-stone-300" />
                    </div>
                    <Button type="submit" className="w-full md:w-auto bg-stone-800 hover:bg-stone-700 rounded-lg">Aggiungi</Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {chapter.schedule.map((item: any) => (
                  <Card key={item.id} className="border-stone-200 shadow-sm">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div className="flex gap-6 items-center">
                        <div className="font-serif font-bold text-2xl text-stone-800">{item.time}</div>
                        <div>
                          <h4 className="font-semibold text-stone-800">{item.title}</h4>
                          <p className="text-sm text-stone-500">{item.description}</p>
                        </div>
                      </div>
                      <form action={deleteTimelineItem.bind(null, item.id, wedding.slug)}>
                        <Button type="submit" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full">Elimina</Button>
                      </form>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="animate-in fade-in">
              <Card className="border-stone-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="font-serif">Personalizzazione</CardTitle>
                </CardHeader>
                <CardContent>
                  <form action={updateBranding.bind(null, chapter.id)} className="space-y-6 max-w-md">
                    <input type="hidden" name="slug" value={chapter.slug} />
                    
                    <div className="space-y-2">
                      <Label>Colore Tema Principale</Label>
                      <div className="flex gap-4 items-center">
                        <Input type="color" name="themeColor" defaultValue={chapter.themeColor} className="w-16 p-1 h-10 border-stone-300 rounded-md" />
                        <span className="text-sm text-stone-500">Il colore principale dei bottoni sul sito pubblico.</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Messaggio di Benvenuto</Label>
                      <textarea 
                        name="welcomeMessage" 
                        defaultValue={chapter.welcomeMessage || ""}
                        placeholder="Un breve messaggio per ringraziare chi carica le foto!"
                        className="w-full min-h-24 p-3 border border-stone-300 rounded-md resize-none focus:ring-1 focus:ring-stone-800 outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Link Album Esterno</Label>
                      <Input 
                        type="url" 
                        name="externalGalleryUrl" 
                        defaultValue={chapter.externalGalleryUrl || ""} 
                        placeholder="https://drive.google.com/..." 
                        className="border-stone-300"
                      />
                    </div>

                    <Button type="submit" className="w-full bg-stone-800 hover:bg-stone-700 rounded-lg">Salva Impostazioni</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          
            <TabsContent value="dettagli" className="animate-in fade-in">
              <ExtendedDetailsForm chapter={chapter} locations={chapter.locations || []} />
            </TabsContent>
  
          
            <TabsContent value="seating" className="animate-in fade-in">
              <SeatingManager chapter={chapter} guests={chapter.guests || []} tables={chapter.tables || []} entitlements={entitlements} />
            </TabsContent>
  
          
            <TabsContent value="gifts" className="animate-in fade-in">
              <GiftManager chapter={chapter} giftOptions={chapter.giftOptions || []} />
            </TabsContent>

            <TabsContent value="wallet" className="animate-in fade-in">
              <WalletManager documents={chapter.travelDocuments || []} weddingId={wedding.id} isProOrAdmin={isAssigned || session.role === "ADMIN"} />
            </TabsContent>
  
          
            <TabsContent value="pros" className="animate-in fade-in">
              <ProManager chapter={chapter} assignments={chapter.assignments || []} />
            </TabsContent>
  
          </Tabs>

        </div>
      </div>

      {/* 3. Anteprima Galleria & Upload Rapido Sposi */}
      <div className="max-w-7xl mx-auto px-4 pt-14 pb-8">
        <h2 className="text-3xl font-serif text-stone-800 mb-8 text-center">Le Nostre Fotografie</h2>
        <ChapterGallery approvedMedia={approvedMedia} albums={chapter.albums} chapterId={chapter.id} initialHasMore={initialHasMore} initialCursor={initialCursor} currentAlbumId={albumId || null} />
        <ChapterUploader chapterId={chapter.id} albums={chapter.albums} />
      </div>

      {/* 4. Dediche Approvate */}
      {approvedMessages.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-serif text-stone-800 mb-8 text-center">Le Nostre Parole</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedMessages.map((msg: any) => (
              <div key={msg.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex flex-col justify-between">
                <p className="text-stone-600 italic mb-4 leading-relaxed">&ldquo;{msg.text}&rdquo;</p>
                <p className="text-sm font-bold text-stone-800 text-right">— {msg.guestName || "Anonimo"}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
