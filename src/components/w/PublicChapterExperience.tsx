/* eslint-disable @typescript-eslint/no-explicit-any, react/no-unescaped-entities */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Camera, MapPin, MessageSquare, Users, Sparkles, BookOpen } from "lucide-react";
import GuestbookForm from "@/app/w/[slug]/GuestbookForm";
import GuestRegistrationForm from "@/app/w/[slug]/GuestRegistrationForm";
import LoadMoreGallery from "@/components/LoadMoreGallery";
import ShareChapterButtons from "@/components/ShareChapterButtons";
import { GentiLunaLogo } from "@/components/GentiLunaLogo";
import Footer from "@/components/Footer";
import GiftSection from "@/app/w/[slug]/GiftSection";
import PublicProsSection from "@/app/w/[slug]/PublicProsSection";
import TimelineSection from "@/app/w/[slug]/TimelineSection";
import EnvelopeOpening from "@/components/w/EnvelopeOpening";
import ScratchDate from "@/components/w/ScratchDate";
import MagicCountdownSection from "@/components/w/MagicCountdownSection";
import MusicPlayer from "@/components/w/MusicPlayer";
import ScrollReveal from "@/components/w/ScrollReveal";
import { parseDressCode } from "@/lib/dressCode";
import { getLocationPresentation } from "@/lib/locationMeta";

interface PublicChapterExperienceProps {
  wedding: any;
  mainWedding: {
    title: string | null;
    brideName: string;
    groomName: string;
    themeColor: string;
  };
  slug: string;
  chapterSlug: string;
  baseUrl: string;
  entitlements: {
    canManageSeating: boolean;
  };
  showHubBackLink?: boolean;
}

export default function PublicChapterExperience({
  wedding,
  mainWedding,
  slug,
  chapterSlug,
  baseUrl,
  entitlements,
  showHubBackLink = true,
}: PublicChapterExperienceProps) {
  const mainPro =
    wedding?.assignments?.find(
      (a: any) => a.status === "ACTIVE" && a.professionalProfile?.category === "PHOTOGRAPHER"
    )?.professionalProfile ||
    wedding?.assignments?.find((a: any) => a.status === "ACTIVE")?.professionalProfile;

  const initialHasMore = wedding?.media?.length === 31;
  const initialMedia = initialHasMore ? wedding.media.slice(0, 30) : wedding?.media || [];
  const initialCursor =
    initialMedia && initialMedia.length > 0 ? initialMedia[initialMedia.length - 1].id : null;

  const coupleNames = `${wedding.brideName} & ${wedding.groomName}`;
  const isWeddingChapter = wedding.type === "WEDDING";
  const displayTitle = wedding.title || (isWeddingChapter ? coupleNames : "Capitolo");
  const config = { authors: "gli sposi" };
  const themeColor = wedding.themeColor || "#1c1917";
  const sharePath = slug === chapterSlug ? `/w/${slug}` : `/w/${slug}/chapter/${chapterSlug}`;

  const parsedDressCode = parseDressCode(wedding.dressCode);

  const presentedLocations = (wedding.locations || []).map((loc: any) => ({
    raw: loc,
    meta: getLocationPresentation(loc),
  }));

  return (
    <EnvelopeOpening
      initials={`${wedding.brideName.charAt(0)}&${wedding.groomName.charAt(0)}`}
      coupleNames={coupleNames}
      date={wedding.date}
      sessionKey={slug}
    >
      <div className="min-h-screen bg-stone-50 font-sans text-stone-800 flex flex-col overflow-x-hidden">
        <div className="bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-2 shadow-sm sticky top-0 z-40">
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-1.5 font-serif text-base sm:text-lg text-stone-900 shrink-0"
            >
              <GentiLunaLogo className="w-5 h-5 shrink-0" />
              <span>GentiLuna</span>
            </Link>
            {showHubBackLink && (
              <Link href={`/w/${slug}?hub=1`} className="hidden sm:inline-block">
                <Button
                  variant="ghost"
                  className="gap-1 text-stone-600 hover:text-stone-900 rounded-full text-xs h-8 px-2.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Storia</span>
                </Button>
              </Link>
            )}
          </div>
          <div className="flex items-center shrink-0">
            <ShareChapterButtons
              urlPath={sharePath}
              title={`${displayTitle} — ${coupleNames}`}
              label="Condividi:"
            />
          </div>
        </div>

        {/* 1. HERO DEL CAPITOLO */}
        <div className="relative min-h-[54vh] md:min-h-[64vh] flex flex-col items-center justify-center p-6 py-12 text-center overflow-hidden bg-stone-900 text-white shadow-xl">
          {wedding.coverImage ? (
            <div
              className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
              style={{ backgroundImage: `url(/api/media/cover/${wedding.id})` }}
            />
          ) : (
            <div className="absolute inset-0 z-0 opacity-20 bg-gradient-to-tr from-stone-800 to-stone-600" />
          )}
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-stone-950/80 via-stone-900/45 to-stone-950/40" />

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-amber-200 text-[11px] font-bold uppercase tracking-widest mb-4 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />{" "}
              {isWeddingChapter ? "Il Nostro Matrimonio" : displayTitle}
            </span>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif font-semibold mb-3 drop-shadow-xl tracking-tight leading-none text-white">
              {isWeddingChapter ? (
                <>
                  {wedding.brideName}{" "}
                  <span className="text-amber-200 italic font-light">&amp;</span>{" "}
                  {wedding.groomName}
                </>
              ) : (
                displayTitle
              )}
            </h1>
            {!isWeddingChapter && wedding.brideName && wedding.groomName && (
              <p className="text-xl sm:text-3xl text-stone-200 font-serif italic mt-1 drop-shadow-md">
                {coupleNames}
              </p>
            )}

            {isWeddingChapter && wedding.date && (
              <div className="mt-6 mb-2 w-full">
                <ScratchDate date={wedding.date} revealKey={wedding.id} />
              </div>
            )}

            {wedding.welcomeMessage && (
              <p className="text-lg md:text-2xl text-stone-200 max-w-2xl font-light leading-relaxed drop-shadow-md mt-4">
                {wedding.welcomeMessage}
              </p>
            )}

            {presentedLocations.length > 0 && (
              <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5 text-stone-100">
                {presentedLocations.map(({ raw, meta }: any, idx: number) => (
                  <a
                    key={raw.id || idx}
                    href="#luoghi-evento"
                    className="inline-flex items-center gap-2 bg-black/40 hover:bg-black/55 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-xs sm:text-sm transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-rose-300 shrink-0" />
                    <span className="font-bold text-amber-200">{meta.roleBadge}:</span>
                    <span className="font-medium">{meta.displayName}</span>
                    {meta.cleanAddress && (
                      <span className="font-light opacity-85 hidden sm:inline">
                        — {meta.cleanAddress}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            )}

            <div className="mt-8">
              <ShareChapterButtons
                urlPath={sharePath}
                title={`${displayTitle} — ${coupleNames}`}
                variant="dark"
                label="Condividi questo evento:"
              />
            </div>
          </div>
        </div>

        {/* COUNTDOWN MAGICO POST-SCOPERTA DATA */}
        {wedding.date && (
          <MagicCountdownSection
            date={wedding.date}
            revealKey={wedding.id}
            waitForScratch={isWeddingChapter}
            headline="Manca questo tempo per l'evento"
          />
        )}

        {/* 2. STORIA */}
        {wedding.description && (
          <ScrollReveal>
            <div className="max-w-3xl mx-auto px-4 pt-16 sm:pt-20 text-center">
              <h2 className="text-3xl font-serif text-stone-800 mb-6">La Storia</h2>
              <p className="text-lg md:text-xl text-stone-600 leading-relaxed font-light">
                {wedding.description}
              </p>
            </div>
          </ScrollReveal>
        )}

        {/* 3. PROGRAMMA */}
        {wedding.schedule && wedding.schedule.length > 0 && (
          <div className="max-w-3xl mx-auto px-4 pt-20">
            <ScrollReveal>
              <h2 className="text-3xl font-serif text-stone-800 mb-12 text-center">Programma della Giornata</h2>
            </ScrollReveal>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-stone-300 before:to-transparent">
              {wedding.schedule.map((item: any, idx: number) => (
                <ScrollReveal key={item.id} delay={idx * 0.1}>
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-stone-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"
                      style={{ backgroundColor: themeColor }}
                    />
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                      <div className="font-bold text-xl mb-1" style={{ color: themeColor }}>
                        {item.time}
                      </div>
                      <h4 className="text-xl font-semibold text-stone-800 mb-2">{item.title}</h4>
                      {item.description && (
                        <p className="text-stone-500 leading-relaxed">{item.description}</p>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {/* DRESS CODE (Mostra palette colori SOLO se scelta esplicitamente dagli sposi) */}
        {(parsedDressCode.text || parsedDressCode.colors.length > 0) && (
          <ScrollReveal>
            <div className="max-w-3xl mx-auto px-4 pt-20 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
                Abbigliamento Consigliato
              </span>
              <h2 className="text-3xl font-serif text-stone-800 mt-1 mb-4">Dress Code</h2>
              {parsedDressCode.text && (
                <p className="text-lg text-stone-600 mb-6 font-light">{parsedDressCode.text}</p>
              )}
              {parsedDressCode.colors.length > 0 && (
                <div className="flex flex-wrap justify-center gap-5 pt-2">
                  {parsedDressCode.colors.map((color) => (
                    <div key={color.id} className="flex flex-col items-center gap-1.5">
                      <div
                        className="w-11 h-11 rounded-full border-2 border-stone-200 shadow-sm"
                        style={{ backgroundColor: color.hex }}
                        title={color.label}
                      />
                      <span className="text-xs font-medium text-stone-600">{color.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>
        )}

        {/* 4. LOCATION CON RUOLI E DESCRIZIONI CHIARE */}
        {presentedLocations.length > 0 && (
          <ScrollReveal>
            <div id="luoghi-evento" className="max-w-5xl mx-auto px-4 pt-20 scroll-mt-24">
              <div className="text-center mb-12">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
                  Come Raggiungerci
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif text-stone-800 mt-1">Luoghi dell&apos;Evento</h2>
                <p className="text-stone-500 text-sm sm:text-base mt-2 max-w-xl mx-auto font-light">
                  Tutte le tappe della giornata con il ruolo di ciascun luogo e le indicazioni dirette per il navigatore.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {presentedLocations.map(({ raw: loc, meta }: any) => {
                  const mapsQuery = [meta.displayName, meta.cleanAddress].filter(Boolean).join(", ");
                  return (
                    <div
                      key={loc.id}
                      className="bg-white p-7 sm:p-8 rounded-3xl shadow-sm border border-stone-200/80 flex flex-col justify-between gap-5 transition-transform hover:-translate-y-1"
                    >
                      <div className="space-y-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${meta.badgeClass}`}
                        >
                          <MapPin className="w-3.5 h-3.5" /> {meta.roleBadge}
                        </span>
                        <h3 className="font-serif text-2xl font-bold text-stone-900">{meta.displayName}</h3>
                        <p className="text-sm text-stone-600 leading-relaxed">{meta.roleHelper}</p>
                        {meta.cleanAddress && (
                          <p className="text-sm font-medium text-stone-800 bg-stone-50 border border-stone-200/70 rounded-xl px-3.5 py-2">
                            📍 {meta.cleanAddress}
                          </p>
                        )}
                        {loc.notes && (
                          <p className="text-xs sm:text-sm text-stone-600 italic bg-amber-50/60 border border-amber-200/60 rounded-xl px-3.5 py-2.5 leading-relaxed">
                            Note degli sposi: {loc.notes}
                          </p>
                        )}
                      </div>

                      {mapsQuery && (
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(mapsQuery)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="block"
                        >
                          <Button variant="outline" className="w-full rounded-full border-stone-300 hover:bg-stone-900 hover:text-white transition-colors">
                            Apri in Google Maps
                          </Button>
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* INFO UTILI EXTRA */}
        {wedding.usefulInfo && (
          <div className="max-w-3xl mx-auto px-4 pt-14 w-full">
            <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-sm text-center space-y-2">
              <h3 className="font-serif text-2xl text-stone-800">Informazioni Utili</h3>
              <p className="text-stone-600 whitespace-pre-wrap text-sm sm:text-base leading-relaxed font-light">
                {wedding.usefulInfo}
              </p>
            </div>
          </div>
        )}

        {/* MUSICA DI SOTTOFONDO */}
        <MusicPlayer />

        {/* DISPOSIZIONE TAVOLI (Opzionale) */}
        {wedding.showSeating && entitlements.canManageSeating && (
          <div className="max-w-5xl mx-auto px-4 pt-16 w-full">
            <div className="bg-white border border-stone-100 shadow-sm rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: themeColor }} />
              <Users className="w-12 h-12 mx-auto text-stone-300 mb-4" />
              <h3 className="text-2xl md:text-3xl font-serif text-stone-800 mb-4">Disposizione Tavoli</h3>
              <p className="text-stone-500 mb-8 max-w-xl mx-auto">
                Scopri dove sei stato posizionato per il ricevimento e chi saranno i tuoi compagni di tavolo.
              </p>
              <Link href={`/w/${slug}/seating`}>
                <Button
                  size="lg"
                  className="rounded-full shadow-md text-white px-8"
                  style={{ backgroundColor: themeColor }}
                >
                  Tableau dei tavoli
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* LISTA NOZZE / REGALI */}
        {wedding.showGifts && wedding.giftOptions && wedding.giftOptions.length > 0 && (
          <div className="pt-12">
            <GiftSection
              slug={wedding.slug}
              options={wedding.giftOptions.map((opt: any) => ({
                id: opt.id,
                type: opt.type,
                title: opt.title,
                description: opt.description,
                hasIban: Boolean(opt.iban),
                paypalLink: opt.paypalLink,
                externalLink: opt.externalLink,
                order: opt.order,
                isActive: opt.isActive,
                isTravelStage: opt.isTravelStage,
                stageDate: opt.stageDate,
                location: opt.location,
                targetAmount: opt.targetAmount,
                raisedAmount: opt.raisedAmount,
              }))}
            />
          </div>
        )}

        {/* 5. GALLERIA & UPLOAD BANNER */}
        <div className="max-w-7xl mx-auto px-4 pt-20 w-full">
          <div className="bg-white border border-stone-200/80 shadow-xl rounded-3xl p-7 sm:p-12 mb-16 max-w-4xl mx-auto text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: themeColor }} />
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full mb-4">
              <Camera className="w-3.5 h-3.5" /> Prima &amp; Durante il Matrimonio
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-4">
              Condividi le tue foto &amp; vecchi ricordi
            </h2>
            <p className="text-stone-600 mb-8 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-light">
              <strong className="font-semibold text-stone-800">Hai già vecchi ricordi insieme agli sposi?</strong> Puoi iniziare fin da subito caricando vecchie foto, viaggi o momenti divertenti passati con loro! E il giorno delle nozze inquadra il QR Code o premi il pulsante per condividere dal vivo tutti gli scatti della festa, senza scaricare nessuna app.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-10">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col items-center">
                <div className="w-32 h-32 relative">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                      `${baseUrl}/w/${wedding.slug}/upload`
                    )}`}
                    alt="QR Code per caricare foto"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xs text-stone-400 mt-3 font-semibold uppercase tracking-wider">
                  Inquadra per caricare
                </span>
              </div>

              <div className="flex flex-col gap-4 w-full sm:w-auto">
                <span className="text-stone-400 font-serif italic hidden md:block">- oppure -</span>
                <Link href={`/w/${wedding.slug}/upload`} className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto text-base sm:text-xl min-h-14 h-auto py-4 sm:py-6 px-6 sm:px-10 rounded-full shadow-2xl hover:scale-105 transition-transform text-white font-bold whitespace-normal text-center leading-snug"
                    style={{ backgroundColor: themeColor }}
                  >
                    <Camera className="mr-2 sm:mr-3 h-6 w-6 sm:h-7 sm:w-7 shrink-0" />
                    <span>+ Carica Foto o Vecchi Ricordi</span>
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
              <p className="text-stone-600 text-sm mb-4">
                Richiedi stampe ad alta qualità o l&apos;album fotografico ufficiale direttamente a{" "}
                {mainPro.businessName} tramite la piattaforma.
              </p>
              <Link href={`/pro/${mainPro.slug}#contatta-pro`}>
                <Button
                  variant="outline"
                  className="rounded-full border-amber-200 hover:bg-amber-100 text-amber-900"
                >
                  Richiedi Stampe &amp; Album
                </Button>
              </Link>
            </div>
          )}

          {wedding.externalGalleryUrl && (
            <div className="flex justify-center mb-12">
              <a href={wedding.externalGalleryUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="rounded-full shadow-lg text-white" style={{ backgroundColor: themeColor }}>
                  📸 Guarda l&apos;Album Ufficiale
                </Button>
              </a>
            </div>
          )}

          {(!wedding.media || wedding.media.length === 0) ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-100 shadow-sm">
              <Camera className="w-16 h-16 mx-auto text-stone-200 mb-4" />
              <p className="text-stone-500 font-serif text-xl">
                Sii il primo a condividere un momento o una vecchia foto con {coupleNames}!
              </p>
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
        {wedding.showGuestbook && (
          <div id="dediche" className="max-w-3xl mx-auto px-4 pt-20 pb-12 scroll-mt-20 w-full">
            <h2 className="text-3xl font-serif text-stone-800 mb-4 text-center">Lascia un messaggio</h2>
            <p className="text-center text-stone-500 mb-12 font-serif italic">
              Scrivi un pensiero da conservare nella storia.
            </p>

            <div className="mb-16">
              <GuestbookForm
                timelineItemId={wedding.id}
                buttonColor={themeColor}
                displayAuthorsLabel={config.authors}
              />
            </div>

            {wedding.messages && wedding.messages.length > 0 && (
              <div className="space-y-8">
                {wedding.messages.map((msg: any) => (
                  <div
                    key={msg.id}
                    className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 relative"
                  >
                    <p className="text-xl italic text-stone-700 font-serif leading-relaxed">
                      &ldquo;{msg.text}&rdquo;
                    </p>
                    <p className="text-right text-stone-400 font-medium mt-4">
                      — {msg.guestName || "Anonimo"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TIMELINE DEGLI ALTRI CAPITOLI (SOLO SE ESISTONO ALTRI CAPITOLI AUTORIZZATI) */}
        <TimelineSection familyId={wedding.familyId} currentChapterId={wedding.id} />

        {/* TEAM FORNITORI DELL'EVENTO */}
        <PublicProsSection assignments={wedding.assignments || []} />

        {/* 7. REVIEWS & CTA FINALE */}
        {mainPro && (
          <div className="max-w-4xl mx-auto px-4 pt-12 pb-12 text-center border-t border-stone-200 mt-12 w-full">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
              <h3 className="text-2xl font-serif text-stone-800 mb-2">
                Ti è piaciuto il racconto di questa giornata?
              </h3>
              <p className="text-stone-500 mb-6 max-w-lg mx-auto">
                Supporta il lavoro di <strong className="text-stone-700">{mainPro.businessName}</strong>{" "}
                lasciando una recensione sulla sua vetrina. Ci vorrà solo un minuto!
              </p>
              <Link href={`/pro/${mainPro.slug}`}>
                <Button variant="outline" className="rounded-full">
                  Lascia una recensione
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* REGISTRAZIONE OSPITI + COLLEGAMENTO PROFESSIONISTI & RISTORANTE */}
        <div className="max-w-4xl mx-auto px-4 pb-16 w-full">
          <GuestRegistrationForm
            buttonColor={themeColor}
            timelineItemId={wedding.id}
            weddingSlug={slug}
            coupleNames={coupleNames}
          />
        </div>

        {/* VIRAL LOOP BANNER */}
        <div className="max-w-5xl mx-auto px-4 pb-20 w-full">
          <div className="bg-stone-900 text-white p-10 md:p-14 rounded-3xl text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop')] opacity-10 object-cover" />
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-serif mb-4">
                Questa è la nostra storia. Vuoi raccontare la tua?
              </h3>
              <p className="text-stone-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto font-light">
                Il prossimo grande evento potrebbe essere il tuo. Crea uno spazio per un Matrimonio, un Battesimo, una Laurea o un Anniversario, e inizia a collezionare ricordi.
              </p>
              <Link href="/sposi">
                <Button
                  size="lg"
                  className="bg-white text-stone-900 hover:bg-stone-200 rounded-full h-14 px-8 text-lg font-bold shadow-xl transition-transform hover:scale-105"
                >
                  Crea il tuo Spazio
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </EnvelopeOpening>
  );
}
