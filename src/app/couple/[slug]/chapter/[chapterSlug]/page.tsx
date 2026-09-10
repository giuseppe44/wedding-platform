import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { verifyProAssignment } from "@/app/proAssignmentActions";
import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, MessageSquareHeart, Settings, Clock, Download, Check, X, ArrowLeft, Trash2, Edit2, Users, Gift } from "lucide-react";
import { approveMedia, rejectMedia, deleteMediaAction } from "@/app/actions";
import { updateBranding, addTimelineItem, deleteTimelineItem, approveMessage, rejectMessage } from "@/app/coupleActions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { updateChapter, deleteChapter } from "@/app/chapterActions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ChapterUploader from "./ChapterUploader";
import ChapterGallery from "./ChapterGallery";
import ExtendedDetailsForm from "./ExtendedDetailsForm";
import SeatingManager from "./SeatingManager";
import GiftManager from "./GiftManager";
import ProManager from "./ProManager";

export default async function ChapterDetailPage({ params, searchParams }: { params: Promise<{ slug: string, chapterSlug: string }>, searchParams: Promise<{ albumId?: string }> }) {
  const { slug, chapterSlug } = await params;
  const { albumId } = await searchParams;
  
  const session = await requireAuth(["PHOTOGRAPHER", "COUPLE"]);

  // The base wedding for context/slugs
  const wedding = await prisma.timelineItem.findUnique({
    where: { slug: slug },
    include: { guests: { orderBy: { name: "asc" } } },
  });

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

  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans pb-24">
      {/* 1. Hero Narrativa */}
      <div className="relative w-full h-[50vh] md:h-[60vh] bg-stone-900 flex items-center justify-center overflow-hidden">
        {chapter.coverImage ? (
          <img src={`/api/media/cover/${chapter.id}`} className="absolute inset-0 w-full h-full object-cover opacity-60" alt={displayTitle} />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-stone-800 to-stone-600 opacity-80" />
        )}
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-stone-200 text-sm md:text-base font-bold tracking-widest uppercase mb-4">{displayType}</p>
          <h1 className="text-4xl md:text-6xl font-serif text-white tracking-tight mb-6">{displayTitle}</h1>
          {chapter.date && (
            <p className="text-stone-200 text-lg md:text-xl font-light italic">
              {new Date(chapter.date).toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
        </div>

        <Link href={`/couple/${wedding.slug}`} className="absolute top-6 left-6 z-20">
          <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md rounded-full gap-2">
            <ArrowLeft className="w-4 h-4" /> La Nostra Storia
          </Button>
        </Link>
      </div>

      {/* 2. Descrizione */}
      {chapter.description && (
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="text-xl md:text-2xl text-stone-600 font-serif leading-relaxed italic">
            "{chapter.description}"
          </p>
        </div>
      )}

      {/* 3. Media Narrativi (solo approvati) e Upload Privato */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-serif text-stone-800 mb-8 text-center">Le Nostre Fotografie</h2>
        <ChapterGallery approvedMedia={approvedMedia} albums={chapter.albums} chapterId={chapter.id} initialHasMore={initialHasMore} initialCursor={initialCursor} currentAlbumId={albumId || null} />
        
                {/* Componente di Upload per gli Sposi */}
        <ChapterUploader chapterId={chapter.id} albums={chapter.albums} />
      </div>

      {/* 4. Dediche / Messaggi Narrativi (solo approvati) */}
      {approvedMessages.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 py-12">
           <h2 className="text-3xl font-serif text-stone-800 mb-8 text-center">Le Nostre Parole</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {approvedMessages.map((msg: any) => (
               <div key={msg.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex flex-col justify-between">
                 <p className="text-stone-600 italic mb-4 leading-relaxed">"{msg.text}"</p>
                 <p className="text-sm font-bold text-stone-800 text-right">— {msg.guestName || "Anonimo"}</p>
               </div>
             ))}
           </div>
        </div>
      )}

      {/* 5. Area di Gestione (Dashboard Interna del Capitolo) */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-stone-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-stone-100 pb-8">
            <div>
              <h2 className="text-2xl font-serif text-stone-800">Area di Gestione</h2>
              <p className="text-stone-500 text-sm mt-1">Gestisci le foto in attesa, le dediche e le impostazioni del capitolo.</p>
            </div>

            <div className="flex gap-2">
              <Link href={`/w/${chapter.slug}`}>
                <Button className="bg-stone-800 hover:bg-stone-700 text-white rounded-full">
                  Sito Pubblico / Carica
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
          </div>

          <Tabs defaultValue="photos" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-8 mb-8 bg-stone-100 p-1 rounded-xl h-auto">
              <TabsTrigger value="photos" className="gap-2 py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"><Camera className="h-4 w-4"/> Foto</TabsTrigger>
              <TabsTrigger value="messages" className="gap-2 py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <MessageSquareHeart className="h-4 w-4"/> Dediche 
                {pendingMessages.length > 0 && <span className="ml-1 bg-orange-500 text-white rounded-full px-2 text-xs">{pendingMessages.length}</span>}
              </TabsTrigger>

              {isOwner && <TabsTrigger value="timeline" className="gap-2 py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"><Clock className="h-4 w-4"/> Programma</TabsTrigger>}

              {isOwner && <TabsTrigger value="dettagli" className="gap-2 py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"><Edit2 className="h-4 w-4"/> Dettagli</TabsTrigger>}

              {isOwner && <TabsTrigger value="seating" className="gap-2 py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"><Users className="h-4 w-4"/> Tavoli</TabsTrigger>}

              {isOwner && <TabsTrigger value="gifts" className="gap-2 py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"><Gift className="h-4 w-4"/> Regali</TabsTrigger>}

              {isOwner && <TabsTrigger value="pros" className="gap-2 py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"><Camera className="h-4 w-4"/> Team</TabsTrigger>}

              {isOwner && <TabsTrigger value="settings" className="gap-2 py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"><Settings className="h-4 w-4"/> Impostazioni</TabsTrigger>}
            </TabsList>

            <TabsContent value="photos" className="space-y-6 animate-in fade-in">
              {pendingMedia.length > 0 && (
                <section className="bg-orange-50 p-6 rounded-xl border border-orange-100 mb-8">
                  <h2 className="text-xl font-semibold mb-4 text-orange-800">Foto da Approvare (Ospiti)</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {pendingMedia.map((m: any) => (
                      <div key={m.id} className="relative group rounded-xl overflow-hidden shadow-sm aspect-square bg-white">
                        <img src={m.url} alt="Da approvare" className="w-full h-full object-cover" />
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
                        <img src={m.url} alt="Approvata" className="w-full h-full object-cover" />
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
              <SeatingManager chapter={chapter} guests={chapter.guests || []} tables={chapter.tables || []} />
            </TabsContent>
  
          
            <TabsContent value="gifts" className="animate-in fade-in">
              <GiftManager chapter={chapter} giftOptions={chapter.giftOptions || []} />
            </TabsContent>
  
          
            <TabsContent value="pros" className="animate-in fade-in">
              <ProManager chapter={chapter} assignments={chapter.assignments || []} />
            </TabsContent>
  
          </Tabs>

        </div>
      </div>
    </div>
  );
}
