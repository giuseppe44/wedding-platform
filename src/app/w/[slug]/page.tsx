/* eslint-disable @typescript-eslint/no-explicit-any */

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import EnvelopeOpening from "@/components/w/EnvelopeOpening";
import ScratchDate from "@/components/w/ScratchDate";
import { verifyTimelineAccess } from "@/lib/accessControl";
import GuestLogin from "./GuestLogin";

export default async function PublicHubPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { slug } = await params;
  const resolvedParams = await searchParams;
  const token = resolvedParams?.token ? String(resolvedParams.token) : undefined;
  
  const wedding = await prisma.timelineItem.findUnique({
    where: { slug: slug },
    include: {
      locations: true
    }
  });

  if (!wedding) { return notFound(); }

  const hasAccess = await verifyTimelineAccess(wedding, "VIEW_PUBLIC");
  if (!hasAccess) {
    if (wedding.visibility === "PRIVATE" || wedding.passwordHash) {
      return <GuestLogin slug={slug} title={wedding.title || `${wedding.brideName} & ${wedding.groomName}`} token={token} />;
    } else {
      notFound();
    }
  }

  let allChapters: any[] = [];
  if (wedding.familyId) {
    allChapters = await prisma.timelineItem.findMany({
      where: { familyId: wedding.familyId },
      orderBy: { date: "asc" }
    });
  } else if (wedding.coupleId) {
    allChapters = await prisma.timelineItem.findMany({
      where: { coupleId: wedding.coupleId },
      orderBy: { date: "asc" }
    });
  }
  
  if (!allChapters.find((c: any) => c.id === wedding.id)) {
    allChapters.unshift(wedding);
  }

  const authorizedChapters = [];
  for (const chap of allChapters) {
    const chapAccess = await verifyTimelineAccess(chap, "VIEW_PUBLIC");
    if (chapAccess) {
      authorizedChapters.push(chap);
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

  const themeColor = wedding.themeColor || "#1c1917"; // stone-900

  return (
    <EnvelopeOpening initials={`${wedding.brideName.charAt(0)}&${wedding.groomName.charAt(0)}`}>
      <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
        
        {/* 1. HERO & PRESENTAZIONE GENERALE */}
        <div className="relative min-h-[60vh] md:min-h-[70vh] flex flex-col items-center justify-center p-6 text-center overflow-hidden bg-stone-900 text-white rounded-b-[3rem] shadow-xl">
          {wedding.coverImage ? (
            <div 
              className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
              style={{ backgroundImage: `url(${wedding.coverImage})` }}
            />
          ) : (
            <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80')] bg-cover bg-center" />
          )}
          
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-6 drop-shadow-lg tracking-tight">
              {wedding.brideName} <span style={{ color: themeColor }}>&</span> {wedding.groomName}
            </h1>
            
            {wedding.type === 'WEDDING' && wedding.date && (
                <div className="mb-8">
                  <ScratchDate date={wedding.date} />
                </div>
              )}
            
            {wedding.welcomeMessage && (
              <p className="text-lg md:text-2xl text-stone-200 max-w-2xl font-light leading-relaxed drop-shadow-md">
                {wedding.welcomeMessage}
              </p>
            )}

            {wedding.locations && wedding.locations.length > 0 && (
              <div className="mt-8 flex items-center justify-center gap-2 text-stone-300">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{wedding.locations[0].name}</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. ELENCO CAPITOLI */}
        <div className="max-w-6xl mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6">La nostra storia</h2>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto">
              Sfoglia i capitoli della nostra vita. Clicca su ciascuna card per scoprire tutti i dettagli, le foto e i ricordi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {authorizedChapters.map((c: any, index: number) => {
              const chapConfig = CHAPTER_TYPES[c.type] || CHAPTER_TYPES["CUSTOM"];
              const cTitle = c.type === "WEDDING" ? "Il Matrimonio" : (c.title || chapConfig.type);
              
              return (
                <Link key={c.id} href={`/w/${slug}/chapter/${c.slug}`}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-stone-200 overflow-hidden group cursor-pointer">
                    {c.coverImage ? (
                      <div className="h-48 w-full relative overflow-hidden bg-stone-200">
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                          style={{ backgroundImage: `url(${c.coverImage})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <span className="text-xs font-bold tracking-wider uppercase opacity-90 block mb-1">Capitolo {index + 1}</span>
                          <h3 className="text-2xl font-serif">{cTitle}</h3>
                        </div>
                      </div>
                    ) : (
                      <div className="h-48 w-full bg-stone-100 flex flex-col justify-end p-4">
                        <span className="text-xs font-bold tracking-wider text-stone-500 uppercase block mb-1">Capitolo {index + 1}</span>
                        <h3 className="text-2xl font-serif text-stone-800">{cTitle}</h3>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <p className="text-stone-600 line-clamp-3 mb-4">
                        {c.description || `Esplora i dettagli, le foto e i contenuti speciali di questo capitolo.`}
                      </p>
                      <Button variant="outline" className="w-full justify-between group-hover:bg-stone-900 group-hover:text-white transition-colors">
                        Scopri di più <span className="text-xl">→</span>
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </EnvelopeOpening>
  );
}
