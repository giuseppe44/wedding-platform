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

      {/* 2. AREA DI GESTIONE IN PRIMA POSIZIONE (Fulcro Operativo Sposi) */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl p-5 md:p-8 shadow-2xl border border-stone-200/90">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 border-b border-stone-100 pb-6 mb-6">
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" /> Pannello di Controllo Sposi
                </span>
                <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-full">
                  Completamento: <span className={completionPct >= 80 ? "text-emerald-600" : completionPct >= 40 ? "text-amber-600" : "text-rose-600"}>{completionPct}%</span>
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900">Area di Gestione</h2>
              <p className="text-stone-500 text-sm">
                {nextStepHint
                  ? `Prossimo passo consigliato: compila "${nextStepHint}" cliccando sulla scheda colorata qui sotto.`
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

          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 w-full mb-8 bg-transparent p-0 h-auto">
              {isOwner && (
                <TabsTrigger
                  value="dettagli"
                  className="flex items-center justify-between gap-2 py-3.5 px-4 rounded-2xl border border-rose-200 bg-rose-50/70 text-rose-800 hover:bg-rose-100/80 data-[state=active]:bg-rose-600 data-[state=active]:text-white data-[state=active]:border-rose-600 data-[state=active]:shadow-md font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" /> Dettagli &amp; Luoghi</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-rose-800">{chapter.locations?.length || 0}</span>
                </TabsTrigger>
              )}

              {isOwner && (
                <TabsTrigger
                  value="timeline"
                  className="flex items-center justify-between gap-2 py-3.5 px-4 rounded-2xl border border-amber-200 bg-amber-50/70 text-amber-900 hover:bg-amber-100/80 data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:border-amber-500 data-[state=active]:shadow-md font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2"><Clock className="h-4 w-4 shrink-0" /> Programma</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-amber-900">{chapter.schedule?.length || 0}</span>
                </TabsTrigger>
              )}

              <TabsTrigger
                value="photos"
                className="flex items-center justify-between gap-2 py-3.5 px-4 rounded-2xl border border-sky-200 bg-sky-50/70 text-sky-900 hover:bg-sky-100/80 data-[state=active]:bg-sky-600 data-[state=active]:text-white data-[state=active]:border-sky-600 data-[state=active]:shadow-md font-semibold text-xs sm:text-sm transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2"><Camera className="h-4 w-4 shrink-0" /> Foto &amp; Album</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-sky-900">
                  {approvedMedia.length}{pendingMedia.length > 0 ? ` (+${pendingMedia.length})` : ""}
                </span>
              </TabsTrigger>

              {isOwner && (
                <TabsTrigger
                  value="seating"
                  className="flex items-center justify-between gap-2 py-3.5 px-4 rounded-2xl border border-indigo-200 bg-indigo-50/70 text-indigo-900 hover:bg-indigo-100/80 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:border-indigo-600 data-[state=active]:shadow-md font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2"><Users className="h-4 w-4 shrink-0" /> Invitati &amp; Tavoli</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-indigo-900">{chapter.guests?.length || 0}</span>
                </TabsTrigger>
              )}

              {isOwner && (
                <TabsTrigger
                  value="gifts"
                  className="flex items-center justify-between gap-2 py-3.5 px-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 text-emerald-900 hover:bg-emerald-100/80 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:border-emerald-600 data-[state=active]:shadow-md font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2"><Gift className="h-4 w-4 shrink-0" /> Lista Regali</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-emerald-900">{chapter.giftOptions?.length || 0}</span>
                </TabsTrigger>
              )}

              <TabsTrigger
                value="messages"
                className="flex items-center justify-between gap-2 py-3.5 px-4 rounded-2xl border border-violet-200 bg-violet-50/70 text-violet-900 hover:bg-violet-100/80 data-[state=active]:bg-violet-600 data-[state=active]:text-white data-[state=active]:border-violet-600 data-[state=active]:shadow-md font-semibold text-xs sm:text-sm transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2"><MessageSquareHeart className="h-4 w-4 shrink-0" /> Dediche</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-violet-900">
                  {approvedMessages.length}{pendingMessages.length > 0 ? ` (+${pendingMessages.length})` : ""}
                </span>
              </TabsTrigger>

              {isOwner && (
                <TabsTrigger
                  value="wallet"
                  className="flex items-center justify-between gap-2 py-3.5 px-4 rounded-2xl border border-teal-200 bg-teal-50/70 text-teal-900 hover:bg-teal-100/80 data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:border-teal-600 data-[state=active]:shadow-md font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2"><Wallet className="h-4 w-4 shrink-0" /> Documenti</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-teal-900">{chapter.travelDocuments?.length || 0}</span>
                </TabsTrigger>
              )}

              {isOwner && (
                <TabsTrigger
                  value="pros"
                  className="flex items-center justify-between gap-2 py-3.5 px-4 rounded-2xl border border-orange-200 bg-orange-50/70 text-orange-900 hover:bg-orange-100/80 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:border-orange-500 data-[state=active]:shadow-md font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2"><Camera className="h-4 w-4 shrink-0" /> Team Fornitori</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-orange-900">{chapter.assignments?.length || 0}</span>
                </TabsTrigger>
              )}

              {isOwner && (
                <TabsTrigger
                  value="settings"
                  className="flex items-center justify-between gap-2 py-3.5 px-4 rounded-2xl border border-stone-300 bg-stone-100 text-stone-800 hover:bg-stone-200/80 data-[state=active]:bg-stone-900 data-[state=active]:text-white data-[state=active]:border-stone-900 data-[state=active]:shadow-md font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2"><Settings className="h-4 w-4 shrink-0" /> Impostazioni</span>
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
