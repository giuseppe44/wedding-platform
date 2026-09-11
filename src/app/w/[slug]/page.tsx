import GuestLogin from "./GuestLogin";
import { verifyTimelineAccess } from "@/lib/accessControl";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, MapPin, MessageSquare } from "lucide-react";
import GuestbookForm from "./GuestbookForm";
import GuestRegistrationForm from "./GuestRegistrationForm";
import { getSession } from "@/lib/auth";
import LoadMoreGallery from "@/components/LoadMoreGallery";
import WeddingDetails from "./WeddingDetails";
import GiftSection from "./GiftSection";
import PublicProsSection from "./PublicProsSection";
import TimelineSection from "./TimelineSection";

export default async function PublicTimelinePage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { slug } = await params;
  const resolvedParams = await searchParams;
  const token = resolvedParams?.token ? String(resolvedParams.token) : undefined;
  
  const wedding = await prisma.timelineItem.findUnique({
    where: { slug: slug },
    include: {
      locations: true, giftOptions: true, assignments: { include: { professionalProfile: true } },
      schedule: { orderBy: { order: "asc" } },
      messages: { 
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" } 
      },
      media: { 
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        take: 31
      }
    }
  });

  if (!wedding) {
    notFound();
  }

  const hasAccess = await verifyTimelineAccess(wedding, "VIEW_PUBLIC");
  if (!hasAccess) {
    if (wedding.visibility === "PRIVATE" || wedding.passwordHash) {
      return <GuestLogin slug={slug} title={wedding.title || `${wedding.brideName} & ${wedding.groomName}`} token={token} />;
    } else {
      notFound();
    }
  }

  const CHAPTER_TYPES: Record<string, { type: string, authors: string }> = {
    "WEDDING": { type: "Il nostro matrimonio", authors: "gli sposi" },
    "ANNIVERSARY": { type: "Anniversario", authors: "la coppia" },
    "TRAVEL": { type: "Il nostro viaggio", authors: "la coppia" },
    "BIRTH": { type: "Una nuova vita", authors: "la famiglia" },
    "BAPTISM": { type: "Battesimo", authors: "la famiglia" },
    "BIRTHDAY": { type: "Compleanno", authors: "il festeggiato" },
    "FAMILY": { type: "La nostra famiglia", authors: "la famiglia" },
    "MEMORY": { type: "Un ricordo", authors: "la famiglia" },
    "CUSTOM": { type: "La nostra storia", authors: "l'autore" }
  };

  const config = CHAPTER_TYPES[wedding.type] || CHAPTER_TYPES["CUSTOM"];
  const displayTitle = wedding.type === "WEDDING" 
    ? `${wedding.brideName} & ${wedding.groomName}` 
    : (wedding.title || config.type);

  const themeColor = wedding.themeColor || "#1c1917"; // stone-900

  const initialHasMore = wedding.media.length === 31;
  const initialMedia = initialHasMore ? wedding.media.slice(0, 30) : wedding.media;
  const initialCursor = initialMedia.length > 0 ? initialMedia[initialMedia.length - 1].id : null;

  const mainPro = wedding.assignments?.find((a: any) => a.status === "ACTIVE" && a.professionalProfile?.category === "PHOTOGRAPHER")?.professionalProfile || wedding.assignments?.find((a: any) => a.status === "ACTIVE")?.professionalProfile;

  let canLeaveMessage = true;
  if (wedding.type === "WEDDING" && wedding.date) {
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const eventDate = new Date(wedding.date.getFullYear(), wedding.date.getMonth(), wedding.date.getDate());
    
    // Il form messaggi si abilita solo dal giorno successivo all'evento
    if (todayDate <= eventDate) {
      canLeaveMessage = false;
    }
  }

  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans pb-24">
      {/* 1. HERO */}
      <div className="relative w-full h-[60vh] md:h-[70vh] bg-stone-900 flex items-center justify-center overflow-hidden">
        {wedding.coverImage ? (
           <Image src={`/api/media/cover/${wedding.id}`} alt="Cover" fill className="absolute inset-0 object-cover w-full h-full opacity-60" priority sizes="100vw" />
        ) : (
           <div className="absolute inset-0 bg-gradient-to-tr from-stone-800 to-stone-600 opacity-80" />
        )}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-stone-200 text-sm md:text-base font-bold tracking-widest uppercase mb-4 drop-shadow-md">
            {config.type}
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-white tracking-tight mb-6 drop-shadow-lg">
            {displayTitle}
          </h1>
          {wedding.date && (
            <p className="text-stone-200 text-lg md:text-xl font-light italic drop-shadow-md">
              {new Date(wedding.date).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-[-3rem] relative z-20">
        <Card className="shadow-2xl border-none overflow-hidden rounded-2xl">
          <CardContent className="p-8 md:p-12 text-center bg-white space-y-6">
            {wedding.welcomeMessage ? (
              <p className="text-stone-600 italic font-serif text-xl md:text-2xl leading-relaxed">
                "{wedding.welcomeMessage}"
              </p>
            ) : (
              <p className="text-stone-600 italic font-serif text-xl md:text-2xl leading-relaxed">
                Condividi i tuoi ricordi di questo momento speciale.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* REGISTRAZIONE OSPITI (LEAD GENERATION) */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <GuestRegistrationForm buttonColor={themeColor} />
      </div>

      {/* 2. STORIA */}
      {wedding.description && (
        <div className="max-w-3xl mx-auto px-4 pt-24 text-center">
          <h2 className="text-3xl font-serif text-stone-800 mb-8">La Storia</h2>
          <p className="text-lg md:text-xl text-stone-600 leading-relaxed font-light">
            {wedding.description}
          </p>
        </div>
      )}

      {/* 3. PROGRAMMA */}
      {wedding.schedule.length > 0 && (
        <div className="max-w-3xl mx-auto px-4 pt-24">
          <h2 className="text-3xl font-serif text-stone-800 mb-12 text-center">Programma</h2>
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-stone-300 before:to-transparent">
            {wedding.schedule.map((item: any, idx: number) => (
              <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-stone-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" style={{ backgroundColor: themeColor }}></div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                  <div className="font-bold text-xl mb-1" style={{ color: themeColor }}>{item.time}</div>
                  <h4 className="text-xl font-semibold text-stone-800 mb-2">{item.title}</h4>
                  {item.description && <p className="text-stone-500 leading-relaxed">{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. LOCATION */}
      {wedding.locations.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 pt-24">
          <h2 className="text-3xl font-serif text-stone-800 mb-12 text-center">Luoghi</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {wedding.locations.map((loc: any) => (
              <div key={loc.id} className="bg-white p-8 rounded-3xl text-center shadow-sm border border-stone-100 transition-transform hover:-translate-y-1">
                <MapPin className="h-10 w-10 mx-auto mb-4 text-stone-400" />
                <h4 className="font-serif text-2xl text-stone-800 mb-2">{loc.name}</h4>
                <p className="text-stone-500 mb-6">{loc.address}</p>
                {loc.address && (
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(loc.address)}`} target="_blank" rel="noreferrer">
                    <Button variant="outline" className="w-full rounded-full border-stone-300 hover:bg-stone-50">Apri in Google Maps</Button>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. GALLERIA & UPLOAD BANNER */}
      <div className="max-w-7xl mx-auto px-4 pt-24">
        
        <div className="bg-white border border-stone-100 shadow-xl rounded-3xl p-8 md:p-12 mb-16 max-w-4xl mx-auto text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: themeColor }} />
          <h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-4">Condividi le tue foto</h2>
          <p className="text-stone-500 mb-8 font-serif italic text-lg max-w-2xl mx-auto">
            Aiuta gli sposi a collezionare ogni singolo istante. Scatta, carica e fai parte di questa storia.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-10">
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col items-center">
               <div className="w-32 h-32 relative">
                 <Image 
                   src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://wedding-platform-topwebsitee.vercel.app/w/${wedding.slug}/upload`} 
                   alt="QR Code per caricare foto" 
                   fill
                   className="object-contain"
                 />
               </div>
               <span className="text-xs text-stone-400 mt-3 font-semibold uppercase tracking-wider">Inquadra per caricare</span>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-stone-400 font-serif italic hidden md:block">- oppure -</span>
              <Link href={`/w/${wedding.slug}/upload`}>
                <Button size="lg" className="w-full sm:w-auto text-xl py-8 px-12 rounded-full shadow-2xl hover:scale-105 transition-transform text-white font-bold" style={{ backgroundColor: themeColor }}>
                  <Camera className="mr-3 h-8 w-8" />
                  + Condividi le tue foto
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <h3 className="text-3xl font-serif text-stone-800 mb-4 text-center">I vostri ricordi</h3>
        <p className="text-center text-stone-500 mb-12 font-serif italic max-w-2xl mx-auto">
          Ogni fotografia è un pezzo di questa storia.
        </p>

        {mainPro && (
          <div className="max-w-2xl mx-auto mb-12 bg-amber-50/50 border border-amber-100 rounded-2xl p-6 text-center">
            <h4 className="font-serif text-xl text-stone-800 mb-2">Vuoi stampare questi ricordi?</h4>
            <p className="text-stone-600 text-sm mb-4">Richiedi stampe ad alta qualità o l'album fotografico ufficiale direttamente a {mainPro.businessName}.</p>
            <a href={mainPro.contactEmail ? `mailto:${mainPro.contactEmail}?subject=Richiesta stampe - ${displayTitle}` : `/pro/${mainPro.slug}`}>
              <Button variant="outline" className="rounded-full border-amber-200 hover:bg-amber-100 text-amber-900">
                Richiedi Stampe
              </Button>
            </a>
          </div>
        )}

        {wedding.externalGalleryUrl && (
          <div className="flex justify-center mb-12">
            <a href={wedding.externalGalleryUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="rounded-full shadow-lg text-white" style={{ backgroundColor: themeColor }}>
                📸 Guarda l'Album Ufficiale
              </Button>
            </a>
          </div>
        )}

        {wedding.media.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-100 shadow-sm">
            <Camera className="w-16 h-16 mx-auto text-stone-200 mb-4" />
            <p className="text-stone-400 font-serif text-xl">Sii il primo a condividere un momento.</p>
          </div>
        ) : (
          <LoadMoreGallery 
            initialMedia={initialMedia} 
            initialHasMore={initialHasMore} 
            initialCursor={initialCursor} 
            timelineItemId={wedding.id} 
            isPublicView={true} 
          />
        )}
      </div>

      {/* 6. DEDICHE */}
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-12">
        <h2 className="text-3xl font-serif text-stone-800 mb-4 text-center">Lascia un messaggio</h2>
        <p className="text-center text-stone-500 mb-12 font-serif italic">
          Scrivi un pensiero da conservare nella storia.
        </p>
        
        <div className="mb-16">
          {canLeaveMessage ? (
            <GuestbookForm timelineItemId={wedding.id} buttonColor={themeColor} displayAuthorsLabel={config.authors} />
          ) : (
            <div className="bg-white border border-stone-100 shadow-sm rounded-3xl p-10 text-center text-stone-600 max-w-2xl mx-auto">
               <MessageSquare className="w-10 h-10 mx-auto text-stone-300 mb-6" />
               <h3 className="font-serif text-2xl text-stone-800 mb-2">Sezione in anteprima</h3>
               <p className="text-lg mb-4">In questa sezione, dal giorno dopo il matrimonio, potrete dedicare un'ulteriore dedica agli sposi.</p>
               <p className="text-sm text-stone-400">Riceverete una notifica quando la raccolta dei messaggi sarà ufficialmente aperta!</p>
            </div>
          )}
        </div>

        {wedding.messages.length > 0 && (
          <div className="space-y-8">
            {wedding.messages.map((msg: any) => (
              <div key={msg.id} className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 relative">
                <p className="text-xl italic text-stone-700 font-serif leading-relaxed">"{msg.text}"</p>
                <p className="text-right text-stone-400 font-medium mt-4">— {msg.guestName || "Anonimo"}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. REVIEWS & CTA FINALE */}
      <div className="max-w-4xl mx-auto px-4 pt-12 pb-24 text-center border-t border-stone-200 mt-12">
        {mainPro && (
          <div className="mb-16 bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
            <h3 className="text-2xl font-serif text-stone-800 mb-2">Ti è piaciuto il racconto di questa giornata?</h3>
            <p className="text-stone-500 mb-6 max-w-lg mx-auto">
              Supporta il lavoro di <strong className="text-stone-700">{mainPro.businessName}</strong> lasciando una recensione sulla sua vetrina. Ci vorrà solo un minuto!
            </p>
            <Link href={`/pro/${mainPro.slug}`}>
              <Button variant="outline" className="rounded-full">
                Lascia una recensione
              </Button>
            </Link>
          </div>
        )}

        <h3 className="text-2xl font-serif text-stone-800 mb-6">Grazie per essere parte di questa storia.</h3>
        <Link href={`/w/${wedding.slug}/upload`}>
          <Button size="lg" className="rounded-full shadow-lg text-white" style={{ backgroundColor: themeColor }}>
            <Camera className="mr-2 h-5 w-5" /> Condividi altri ricordi
          </Button>
        </Link>
      </div>

      {/* VIRAL LOOP BANNER (LATO INVITATI -> NUOVI UTENTI) */}
      <div className="max-w-5xl mx-auto px-4 pb-24">
        <div className="bg-stone-900 text-white p-10 md:p-14 rounded-3xl text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop')] opacity-10 object-cover" />
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-serif mb-4">La storia non finisce qui.</h3>
            <p className="text-stone-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto font-light">
              Il prossimo grande evento potrebbe essere il tuo. Crea uno spazio per un Matrimonio, un Battesimo, una Laurea o un Anniversario, e inizia a collezionare ricordi.
            </p>
            <Link href="/sposi">
              <Button size="lg" className="bg-white text-stone-900 hover:bg-stone-200 rounded-full h-14 px-8 text-lg font-bold shadow-xl transition-transform hover:scale-105">
                Crea il tuo Spazio
              </Button>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
