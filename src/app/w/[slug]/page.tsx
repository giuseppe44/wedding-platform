/* eslint-disable @typescript-eslint/no-explicit-any */

import { prisma } from "@/lib/prisma";
import { notFound, permanentRedirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Camera, Users, QrCode, Sparkles, BookOpen, Tv, ArrowRight } from "lucide-react";
import EnvelopeOpening from "@/components/w/EnvelopeOpening";
import ScratchDate from "@/components/w/ScratchDate";
import MagicCountdownSection from "@/components/w/MagicCountdownSection";
import PublicChapterExperience from "@/components/w/PublicChapterExperience";
import { getUserEntitlements } from "@/lib/entitlementHelper";
import ShareChapterButtons from "@/components/ShareChapterButtons";
import { GentiLunaLogo } from "@/components/GentiLunaLogo";
import Footer from "@/components/Footer";
import { verifyTimelineAccess } from "@/lib/accessControl";
import { resolveLegacyTimelineSlug } from "@/lib/slugify";
import { getLocationPresentation } from "@/lib/locationMeta";
import GuestLogin from "./GuestLogin";

export default async function PublicHubPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const { slug } = await params;
  const resolvedParams = await searchParams;
  const token = resolvedParams?.token ? String(resolvedParams.token) : undefined;
  
  const wedding = await prisma.timelineItem.findUnique({
    where: { slug: slug },
    include: {
      locations: true
    }
  });

  if (!wedding) {
    const newSlug = await resolveLegacyTimelineSlug(slug);
    if (newSlug) {
      permanentRedirect(`/w/${newSlug}${token ? `?token=${encodeURIComponent(token)}` : ""}`);
    }
    return notFound();
  }

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
  const primaryChapterSlug = authorizedChapters[0]?.slug || wedding.slug;
  const uploadUrl = `${baseUrl}/w/${wedding.slug}/upload`;
  const forceHub = resolvedParams?.hub === "1";

  // Flusso diretto ottimizzato: quando gli sposi inviano il link /w/[slug],
  // dopo l'unica busta d'invito gli ospiti atterrano subito sull'evento principale
  // (con ScratchDate, Countdown, Luoghi e Foto) senza dover aprire due volte la busta.
  if (!forceHub) {
    const primaryTarget =
      authorizedChapters.find((c: any) => c.type === "WEDDING") ||
      authorizedChapters[0] ||
      wedding;

    const fullPrimaryChapter: any = await prisma.timelineItem.findUnique({
      where: { id: primaryTarget.id },
      include: {
        locations: true,
        giftOptions: true,
        assignments: { include: { professionalProfile: true } },
        schedule: { orderBy: { order: "asc" } },
        messages: {
          where: { status: "APPROVED" },
          orderBy: { createdAt: "desc" },
        },
        media: {
          where: { status: "APPROVED" },
          orderBy: { createdAt: "desc" },
          take: 31,
        },
      },
    });

    if (fullPrimaryChapter) {
      const entitlements = await getUserEntitlements(fullPrimaryChapter.ownerId);
      return (
        <PublicChapterExperience
          wedding={fullPrimaryChapter}
          mainWedding={{
            title: wedding.title,
            brideName: wedding.brideName,
            groomName: wedding.groomName,
            themeColor,
          }}
          slug={wedding.slug}
          chapterSlug={fullPrimaryChapter.slug}
          baseUrl={baseUrl}
          entitlements={entitlements}
          showHubBackLink={authorizedChapters.length > 1}
        />
      );
    }
  }

  return (
    <EnvelopeOpening
      initials={`${wedding.brideName.charAt(0)}&${wedding.groomName.charAt(0)}`}
      coupleNames={`${wedding.brideName} & ${wedding.groomName}`}
      date={wedding.date}
      sessionKey={wedding.slug}
    >
      <div className="min-h-screen bg-[#faf9f8] font-sans text-stone-800 flex flex-col overflow-x-hidden">
        {/* TOP NAV DISCRETA & CONVENIENTE PER GLI OSPITI */}
        <nav className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 py-3">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2 font-serif text-lg sm:text-xl text-stone-900">
              <GentiLunaLogo className="w-6 h-6 shrink-0" />
              <span>GentiLuna</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href={`/w/${wedding.slug}/upload`}>
                <Button className="rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold px-4 h-9 text-xs sm:text-sm gap-1.5">
                  <Camera className="w-3.5 h-3.5" /> Carica Foto
                </Button>
              </Link>
              <Link href="/sposi" className="hidden sm:inline-block">
                <Button variant="outline" className="rounded-full border-stone-300 text-stone-700 hover:bg-stone-100 px-4 h-9 text-xs">
                  Crea il tuo Evento
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* 1. HERO & PRESENTAZIONE GENERALE */}
        <div className="relative min-h-[64vh] md:min-h-[74vh] flex flex-col items-center justify-center px-4 py-16 sm:p-8 text-center overflow-hidden bg-stone-950 text-white rounded-b-[2.5rem] sm:rounded-b-[3.5rem] shadow-2xl">
          {wedding.coverImage ? (
            <div 
              className="absolute inset-0 z-0 opacity-45 bg-cover bg-center scale-105"
              style={{
                backgroundImage: `url(${
                  wedding.coverImage.startsWith("http") && !wedding.coverImage.includes("supabase.co")
                    ? wedding.coverImage
                    : `/api/media/cover/${wedding.id}`
                })`,
              }}
            />
          ) : (
            <div className="absolute inset-0 z-0 opacity-25 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80')] bg-cover bg-center" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/55 to-stone-950/35 z-0" />
          
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-200 text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5" /> Il Nostro Spazio Evento
            </span>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif mb-6 drop-shadow-lg tracking-tight leading-tight">
              {wedding.brideName} <span className="text-rose-300 italic font-light">&amp;</span> {wedding.groomName}
            </h1>
            
            {wedding.type === 'WEDDING' && wedding.date && (
                <div className="mb-6 w-full">
                  <ScratchDate date={wedding.date} revealKey={wedding.id} />
                </div>
              )}
            
            {wedding.welcomeMessage && (
              <p className="text-base sm:text-xl md:text-2xl text-stone-200 max-w-2xl font-light leading-relaxed drop-shadow-md">
                {wedding.welcomeMessage}
              </p>
            )}

            {wedding.locations && wedding.locations.length > 0 && (
              <div className="mt-6 inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-2 rounded-full text-stone-100 text-sm sm:text-base">
                <MapPin className="w-4 h-4 text-rose-300 shrink-0" />
                <span>{getLocationPresentation(wedding.locations[0]).displayName}</span>
              </div>
            )}

            {/* Quick Guest Hero CTAs */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href={`/w/${wedding.slug}/chapter/${primaryChapterSlug}`}>
                <Button className="min-h-12 h-auto py-3 px-7 rounded-full bg-white text-stone-900 hover:bg-stone-100 font-bold text-sm sm:text-base shadow-xl whitespace-normal text-center">
                  Apri Dettagli &amp; Galleria <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href={`/w/${wedding.slug}/upload`}>
                <Button className="min-h-12 h-auto py-3 px-7 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm sm:text-base shadow-xl whitespace-normal text-center">
                  <Camera className="w-4 h-4 mr-2" /> Invia Foto Ospiti
                </Button>
              </Link>
            </div>

            <div className="mt-7 bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-4 py-2">
              <ShareChapterButtons
                urlPath={`/w/${wedding.slug}`}
                title={`${wedding.brideName} & ${wedding.groomName}`}
                variant="dark"
                label="Condividi e invita:"
              />
            </div>
          </div>
        </div>

        {/* COUNTDOWN EVENTO */}
        {wedding.date && (
          <MagicCountdownSection
            date={wedding.date}
            revealKey={wedding.id}
            waitForScratch={wedding.type === "WEDDING"}
            headline="Manca questo tempo per l'evento"
          />
        )}

        {/* ACCESSI RAPIDI PER GLI INVITATI */}
        <section className="max-w-6xl mx-auto w-full px-4 pt-12 sm:pt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href={`/w/${wedding.slug}/upload`}
              className="group bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm hover:shadow-lg hover:border-rose-300 transition-all flex flex-col justify-between gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">Invia Foto Live</h3>
                <p className="text-xs text-stone-500 mt-1">Condividi subito scatti e ricordi dal tuo cellulare senza scaricare app.</p>
              </div>
            </Link>

            <Link
              href={`/w/${wedding.slug}/chapter/${primaryChapterSlug}`}
              className="group bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm hover:shadow-lg hover:border-amber-300 transition-all flex flex-col justify-between gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">Luoghi &amp; Programma</h3>
                <p className="text-xs text-stone-500 mt-1">Orari cerimonia, ricevimento, indicazioni Google Maps e lista regali.</p>
              </div>
            </Link>

            {wedding.showSeating ? (
              <Link
                href={`/w/${wedding.slug}/seating`}
                className="group bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all flex flex-col justify-between gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900">Trova il tuo Tavolo</h3>
                  <p className="text-xs text-stone-500 mt-1">Cerca il tuo nome nel Tableau de Mariage digitale prima del ricevimento.</p>
                </div>
              </Link>
            ) : (
              <Link
                href={`/w/${wedding.slug}/chapter/${primaryChapterSlug}#dediche`}
                className="group bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm hover:shadow-lg hover:border-fuchsia-300 transition-all flex flex-col justify-between gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900">Lascia una Dedica</h3>
                  <p className="text-xs text-stone-500 mt-1">Scrivi un pensiero speciale agli sposi nel guestbook digitale dell&apos;evento.</p>
                </div>
              </Link>
            )}

            <Link
              href={`/live/${wedding.slug}`}
              target="_blank"
              className="group bg-stone-900 text-white rounded-3xl p-6 border border-stone-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-amber-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Tv className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg">GentiLuna LIVE</h3>
                <p className="text-xs text-stone-400 mt-1">Modalità schermo gigante per proiettare le foto approvate in sala.</p>
              </div>
            </Link>
          </div>
        </section>

        {/* 2. ELENCO CAPITOLI */}
        <div className="max-w-6xl mx-auto w-full px-4 py-16 sm:py-24">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-600">Timeline Interattiva</span>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mt-2 mb-4">I Capitoli della Nostra Storia</h2>
            <p className="text-base sm:text-lg text-stone-500 max-w-2xl mx-auto font-light">
              Sfoglia i momenti speciali del nostro percorso. Clicca su ciascuna card per scoprire dettagli, fotografie e ricordi condivisi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {authorizedChapters.map((c: any, index: number) => {
              const chapConfig = CHAPTER_TYPES[c.type] || CHAPTER_TYPES["CUSTOM"];
              const cTitle = c.type === "WEDDING" ? "Il Matrimonio" : (c.title || chapConfig.type);
              const chapterPublicUrl = `/w/${wedding.slug}/chapter/${c.slug}`;
              
              return (
                <Card key={c.id} className="h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-stone-200 overflow-hidden group">
                  <Link href={chapterPublicUrl} className="block">
                    {c.coverImage ? (
                      <div className="h-48 w-full relative overflow-hidden bg-stone-200">
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                          style={{
                            backgroundImage: `url(${
                              c.coverImage.startsWith("http") && !c.coverImage.includes("supabase.co")
                                ? c.coverImage
                                : `/api/media/cover/${c.id}`
                            })`,
                          }}
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
                  </Link>
                  <CardContent className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-stone-600 line-clamp-3 mb-4">
                        {c.description || `Esplora i dettagli, le foto e i contenuti speciali di questo capitolo.`}
                      </p>
                      <Link href={chapterPublicUrl}>
                        <Button variant="outline" className="w-full justify-between group-hover:bg-stone-900 group-hover:text-white transition-colors">
                          Scopri di più <span className="text-xl">→</span>
                        </Button>
                      </Link>
                    </div>
                    <ShareChapterButtons
                      urlPath={chapterPublicUrl}
                      title={`${cTitle} — ${wedding.brideName} & ${wedding.groomName}`}
                      compact
                      label="Condividi:"
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* SEZIONE INVITA OSPITI, QR UPLOAD E CREA IL TUO EVENTO */}
        <section className="max-w-5xl mx-auto w-full px-4 pb-20 space-y-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 space-y-4 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                <QrCode className="w-3.5 h-3.5" /> Scatti degli Invitati
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                Condividi le tue foto &amp; vecchi ricordi
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed max-w-xl">
                Hai già vecchie foto o ricordi speciali con gli sposi? Puoi condividerli qui fin da subito! E il giorno dell&apos;evento inquadra il QR Code per caricare in diretta tutti gli scatti della giornata.
              </p>
              <div className="pt-1 flex justify-center md:justify-start">
                <ShareChapterButtons
                  urlPath={`/w/${wedding.slug}`}
                  title={`${wedding.brideName} & ${wedding.groomName} — GentiLuna`}
                  label="Invita su WhatsApp / Email:"
                />
              </div>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col items-center shrink-0">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(uploadUrl)}`}
                alt="QR Code Caricamento Foto Evento"
                className="w-36 h-36 object-contain rounded-lg"
              />
              <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500 mt-2">
                Inquadra per caricare foto
              </span>
            </div>
          </div>

          <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h3 className="text-2xl sm:text-4xl font-serif">
                Ti sposi presto o festeggi un traguardo speciale?
              </h3>
              <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed">
                Crea il tuo sito evento elegante su GentiLuna per raccogliere le foto degli invitati, gestire RSVP, intolleranze e tavoli in un unico portale.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <Link href="/funzioni-sposi">
                  <Button className="rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold px-6 h-11">
                    Scopri le Funzioni Sposi
                  </Button>
                </Link>
                <Link href="/login?role=COUPLE&mode=REGISTER">
                  <Button variant="outline" className="rounded-full bg-transparent border-stone-600 text-white hover:bg-white/10 px-6 h-11">
                    Inizia Gratis
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </EnvelopeOpening>
  );
}
