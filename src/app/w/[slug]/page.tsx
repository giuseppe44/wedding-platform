import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Image as ImageIcon, MapPin, Clock, MessageSquareHeart } from "lucide-react";
import GuestbookForm from "./GuestbookForm";

export default async function WeddingPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const wedding = await prisma.wedding.findUnique({
    where: { slug: slug },
    include: {
      media: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
      },
      locations: true,
      timeline: {
        orderBy: { order: "asc" },
      },
      messages: {
        where: { status: "APPROVED" }, // only show approved messages
        orderBy: { createdAt: "desc" },
      }
    },
  });

  if (!wedding) {
    notFound();
  }

  const themeStyle = { backgroundColor: wedding.themeColor || "#000" };

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      {/* Cover */}
      <div className="w-full h-72 relative flex items-center justify-center overflow-hidden" style={themeStyle}>
        {wedding.coverImage ? (
           <img src={wedding.coverImage} alt="Cover" className="object-cover w-full h-full opacity-70" />
        ) : (
           <div className="absolute inset-0 bg-black/40" />
        )}
        <div className="relative z-10 text-center text-white px-4 pt-10">
          <h1 className="text-5xl font-serif drop-shadow-lg">
            {wedding.brideName} & {wedding.groomName}
          </h1>
          {wedding.date && (
            <p className="text-xl mt-4 drop-shadow-md font-light">
              {wedding.date.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-[-3rem] relative z-20">
        
        {/* Call to action principale per caricare foto (Sempre visibile in alto) */}
        <Card className="shadow-xl mb-8 border-none overflow-hidden">
          <CardContent className="p-8 text-center bg-white space-y-4">
            {wedding.welcomeMessage && (
              <p className="text-stone-600 italic font-serif text-lg mb-4">"{wedding.welcomeMessage}"</p>
            )}
            <h2 className="text-2xl font-semibold text-stone-800">Condividi le tue foto e video!</h2>
            <Link href={`/w/${wedding.slug}/upload`}>
              <Button size="lg" className="w-full sm:w-auto text-lg py-6 px-10 rounded-full shadow-md transition-transform hover:scale-105 mt-2" style={{ backgroundColor: wedding.themeColor || '#000' }}>
                <Camera className="mr-2 h-6 w-6" />
                Carica Ricordi
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Tab Navigation per il resto dei contenuti */}
        <Tabs defaultValue="gallery" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white shadow-sm rounded-full p-1 h-14">
            <TabsTrigger value="gallery" className="rounded-full data-[state=active]:bg-stone-100"><ImageIcon className="h-5 w-5" /></TabsTrigger>
            <TabsTrigger value="timeline" className="rounded-full data-[state=active]:bg-stone-100"><Clock className="h-5 w-5" /></TabsTrigger>
            <TabsTrigger value="locations" className="rounded-full data-[state=active]:bg-stone-100"><MapPin className="h-5 w-5" /></TabsTrigger>
            <TabsTrigger value="guestbook" className="rounded-full data-[state=active]:bg-stone-100"><MessageSquareHeart className="h-5 w-5" /></TabsTrigger>
          </TabsList>
          
          <TabsContent value="gallery" className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl font-serif text-center mb-6">Galleria</h3>
            {wedding.media.length === 0 ? (
              <p className="text-center text-stone-500 py-12">Le foto appariranno qui una volta approvate. Sii il primo a caricarle!</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {wedding.media.map((item: any) => (
                  <div key={item.id} className="aspect-square relative rounded-md overflow-hidden bg-stone-200">
                    {item.type === "VIDEO" ? (
                      <video src={item.url} className="object-cover w-full h-full" controls muted playsInline />
                    ) : (
                      <img src={item.url} alt="Wedding memory" className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" loading="lazy" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="timeline" className="animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl font-serif text-center mb-6">Programma della giornata</h3>
            {wedding.timeline.length === 0 ? (
              <p className="text-center text-stone-500 py-12">Programma non ancora pubblicato.</p>
            ) : (
              <div className="space-y-6 max-w-lg mx-auto">
                {wedding.timeline.map((item: any, idx: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="font-bold text-lg w-16 text-right pt-1">{item.time}</div>
                    <div className="relative flex-1 pb-8 border-l-2 border-stone-200 pl-6">
                      <div className="absolute w-4 h-4 rounded-full bg-stone-300 -left-[9px] top-2" style={{ backgroundColor: wedding.themeColor || '#ccc' }}></div>
                      <h4 className="text-xl font-semibold">{item.title}</h4>
                      {item.description && <p className="text-stone-600 mt-1">{item.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="locations" className="animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl font-serif text-center mb-6">Location</h3>
            {wedding.locations.length === 0 ? (
               <p className="text-center text-stone-500 py-12">Location non ancora inserite.</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {wedding.locations.map((loc: any) => (
                  <Card key={loc.id}>
                    <CardContent className="p-6 text-center">
                      <MapPin className="h-8 w-8 mx-auto mb-3 text-stone-400" />
                      <h4 className="font-bold text-lg">{loc.name}</h4>
                      <p className="text-stone-600 mt-2">{loc.address}</p>
                      {loc.address && (
                        <a href={`https://maps.google.com/?q=${encodeURIComponent(loc.address)}`} target="_blank" rel="noreferrer">
                          <Button variant="outline" className="mt-4 w-full">Apri in Google Maps</Button>
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="guestbook" className="animate-in fade-in slide-in-from-bottom-4 space-y-8">
            <h3 className="text-2xl font-serif text-center mb-2">Lascia una dedica</h3>
            <p className="text-center text-stone-500 mb-6">Un pensiero per gli sposi rimarrà per sempre.</p>
            
            <GuestbookForm weddingId={wedding.id} buttonColor={wedding.themeColor} />
            
            <div className="space-y-4 mt-8">
              {wedding.messages.map((msg: any) => (
                <div key={msg.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                  <p className="text-lg italic text-stone-700">"{msg.text}"</p>
                  <p className="text-right text-stone-500 font-medium mt-2">— {msg.guestName || "Anonimo"}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
