import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { approveMedia, rejectMedia } from "@/app/actions";
import { updateBranding, addTimelineItem, deleteTimelineItem, approveMessage, rejectMessage } from "@/app/coupleActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Check, X, Download, Camera, MessageSquareHeart, Settings, Clock } from "lucide-react";
import Image from "next/image";

export default async function CoupleDashboard({ params }: { params: { slug: string } }) {
  const wedding = await prisma.wedding.findUnique({
    where: { slug: params.slug },
    include: {
      media: { orderBy: { createdAt: "desc" } },
      timeline: { orderBy: { order: "asc" } },
      messages: { orderBy: { createdAt: "desc" } },
      locations: true,
    },
  });

  if (!wedding) notFound();

  const pendingMedia = wedding.media.filter((m: any) => m.status === "PENDING");
  const approvedMedia = wedding.media.filter((m: any) => m.status === "APPROVED");
  const pendingMessages = wedding.messages.filter((m: any) => m.status === "PENDING");
  const approvedMessages = wedding.messages.filter((m: any) => m.status === "APPROVED");

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard: {wedding.brideName} & {wedding.groomName}</h1>
            <p className="text-sm text-gray-500">Gestisci i ricordi del tuo giorno speciale.</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/w/${wedding.slug}`}>
              <Button variant="outline">Vai al Sito Pubblico</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Il tuo QR Code</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'))}/w/${wedding.slug}`} 
                  alt="QR Code" 
                  className="mx-auto mb-4 w-full max-w-[200px]"
                />
                <Button variant="secondary" className="w-full">Stampa QR</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Statistiche</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-stone-500">Foto totali caricate</span>
                  <span className="font-bold">{wedding.media.length}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-stone-500">Foto pubbliche</span>
                  <span className="font-bold text-green-600">{approvedMedia.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Messaggi ricevuti</span>
                  <span className="font-bold">{wedding.messages.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <Tabs defaultValue="photos" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="photos" className="gap-2"><Camera className="h-4 w-4"/> Foto</TabsTrigger>
                <TabsTrigger value="messages" className="gap-2">
                  <MessageSquareHeart className="h-4 w-4"/> Dediche 
                  {pendingMessages.length > 0 && <span className="ml-1 bg-orange-500 text-white rounded-full px-2 text-xs">{pendingMessages.length}</span>}
                </TabsTrigger>
                <TabsTrigger value="timeline" className="gap-2"><Clock className="h-4 w-4"/> Programma</TabsTrigger>
                <TabsTrigger value="settings" className="gap-2"><Settings className="h-4 w-4"/> Impostazioni</TabsTrigger>
              </TabsList>
              
              <TabsContent value="photos" className="space-y-8 animate-in fade-in">
                {pendingMedia.length > 0 && (
                  <section className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                    <h2 className="text-xl font-semibold mb-4 text-orange-800 flex justify-between items-center">
                      Da Approvare ({pendingMedia.length})
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {pendingMedia.map((item: any) => (
                        <Card key={item.id} className="overflow-hidden shadow-sm">
                          <div className="aspect-square bg-gray-200 relative">
                            {item.type === "VIDEO" ? (
                              <video src={item.url} className="object-cover w-full h-full" controls muted playsInline />
                            ) : (
                              <img src={item.url} alt="Media" className="object-cover w-full h-full" />
                            )}
                          </div>
                          <CardContent className="p-2 flex gap-2">
                            <form action={approveMedia.bind(null, item.id)} className="flex-1">
                              <Button type="submit" variant="default" className="w-full bg-green-600 hover:bg-green-700 h-8">
                                <Check className="h-4 w-4" />
                              </Button>
                            </form>
                            <form action={rejectMedia.bind(null, item.id)} className="flex-1">
                              <Button type="submit" variant="destructive" className="w-full h-8">
                                <X className="h-4 w-4" />
                              </Button>
                            </form>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </section>
                )}

                <section>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Galleria Approvata ({approvedMedia.length})</h2>
                    <a href={`/api/download/${wedding.slug}`}>
                      <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" /> Scarica Tutte (ZIP)</Button>
                    </a>
                  </div>
                  {approvedMedia.length === 0 ? (
                    <p className="text-gray-500">Nessuna foto approvata al momento.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {approvedMedia.map((item: any) => (
                        <div key={item.id} className="aspect-square relative rounded-lg overflow-hidden group bg-gray-200">
                           {item.type === "VIDEO" ? (
                              <video src={item.url} className="object-cover w-full h-full" controls muted playsInline />
                            ) : (
                              <img src={item.url} alt="Media" className="object-cover w-full h-full" />
                            )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <form action={rejectMedia.bind(null, item.id)}>
                              <Button type="submit" variant="destructive" size="icon" className="h-8 w-8 rounded-full">
                                <X className="h-4 w-4" />
                              </Button>
                            </form>
                            <a href={item.url} download target="_blank" rel="noreferrer">
                              <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full">
                                <Download className="h-4 w-4" />
                              </Button>
                            </a>
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
                        <Card key={msg.id}>
                          <CardContent className="p-4 flex justify-between items-center">
                            <div>
                              <p className="italic">"{msg.text}"</p>
                              <p className="text-sm font-semibold mt-1 text-stone-500">— {msg.guestName || "Anonimo"}</p>
                            </div>
                            <div className="flex gap-2 shrink-0 ml-4">
                              <form action={approveMessage.bind(null, msg.id, wedding.slug)}>
                                <Button type="submit" className="bg-green-600 hover:bg-green-700" size="icon"><Check className="h-4 w-4" /></Button>
                              </form>
                              <form action={rejectMessage.bind(null, msg.id, wedding.slug)}>
                                <Button type="submit" variant="destructive" size="icon"><X className="h-4 w-4" /></Button>
                              </form>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </section>
                )}

                <section>
                  <h2 className="text-xl font-semibold mb-4">Dediche Pubblicate</h2>
                  {approvedMessages.length === 0 ? (
                    <p className="text-gray-500">Nessuna dedica pubblicata.</p>
                  ) : (
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {approvedMessages.map((msg: any) => (
                        <Card key={msg.id}>
                          <CardContent className="p-4 relative group">
                            <p className="italic text-stone-700">"{msg.text}"</p>
                            <p className="text-sm font-semibold mt-2 text-stone-500 text-right">— {msg.guestName || "Anonimo"}</p>
                            
                            <form action={rejectMessage.bind(null, msg.id, wedding.slug)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button type="submit" variant="destructive" size="icon" className="h-6 w-6"><X className="h-3 w-3" /></Button>
                            </form>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </section>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-6 animate-in fade-in">
                <Card>
                  <CardHeader>
                    <CardTitle>Aggiungi Fase Evento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form action={addTimelineItem.bind(null, wedding.id)} className="flex flex-col md:flex-row gap-4 items-end">
                      <input type="hidden" name="slug" value={wedding.slug} />
                      <div className="w-full md:w-1/4">
                        <Label>Orario</Label>
                        <Input name="time" type="time" required />
                      </div>
                      <div className="w-full md:w-1/4">
                        <Label>Titolo</Label>
                        <Input name="title" required placeholder="Es. Taglio della Torta" />
                      </div>
                      <div className="w-full md:w-2/4">
                        <Label>Descrizione (Opz.)</Label>
                        <Input name="description" placeholder="A bordo piscina" />
                      </div>
                      <Button type="submit" className="w-full md:w-auto">Aggiungi</Button>
                    </form>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {wedding.timeline.map((item: any) => (
                    <Card key={item.id}>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div className="flex gap-4 items-center">
                          <div className="font-bold text-xl">{item.time}</div>
                          <div>
                            <h4 className="font-semibold">{item.title}</h4>
                            <p className="text-sm text-gray-500">{item.description}</p>
                          </div>
                        </div>
                        <form action={deleteTimelineItem.bind(null, item.id, wedding.slug)}>
                          <Button type="submit" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50">Elimina</Button>
                        </form>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="settings" className="animate-in fade-in">
                <Card>
                  <CardHeader>
                    <CardTitle>Personalizzazione Sito Pubblico</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form action={updateBranding.bind(null, wedding.id)} className="space-y-6 max-w-md">
                      <input type="hidden" name="slug" value={wedding.slug} />
                      
                      <div className="space-y-2">
                        <Label>Colore Tema Principale</Label>
                        <div className="flex gap-4 items-center">
                          <Input type="color" name="themeColor" defaultValue={wedding.themeColor} className="w-16 p-1 h-10" />
                          <span className="text-sm text-gray-500">Il colore principale dei bottoni e dei dettagli sul sito pubblico.</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Messaggio di Benvenuto</Label>
                        <textarea 
                          name="welcomeMessage" 
                          defaultValue={wedding.welcomeMessage || ""}
                          placeholder="Un breve messaggio per ringraziare chi carica le foto!"
                          className="w-full min-h-24 p-3 border rounded-md resize-none"
                        />
                      </div>

                      <Button type="submit" className="w-full">Salva Impostazioni</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
