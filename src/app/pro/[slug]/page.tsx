import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Camera,
  MapPin,
  Lock,
  Star,
  Sparkles,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  ArrowRight,
  Award,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PublicReviewForm from "./PublicReviewForm";
import ProContactBox from "./ProContactBox";
import VideoThumbnail from "./VideoThumbnail";
import ProPortfolioLightbox from "./ProPortfolioLightbox";
import ProShareInviteCard from "./ProShareInviteCard";
import ShareChapterButtons from "@/components/ShareChapterButtons";
import { GentiLunaLogo } from "@/components/GentiLunaLogo";
import Footer from "@/components/Footer";
import { getSession } from "@/lib/auth";
import { getProCategoryLabel } from "@/lib/proCategories";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = await prisma.professionalProfile.findUnique({
    where: { slug, isActive: true },
    select: { businessName: true, category: true, serviceArea: true, description: true },
  });

  if (!profile) {
    return { title: "Professionista non trovato" };
  }

  const catLabel = getProCategoryLabel(profile.category);
  const areaText = profile.serviceArea ? ` a ${profile.serviceArea}` : "";
  const title = `${profile.businessName} – ${catLabel} Matrimonio${areaText}`;
  const description =
    profile.description?.slice(0, 155) ||
    `Scopri il profilo, il portfolio e i servizi di ${profile.businessName} (${catLabel}${areaText}) su GentiLuna.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/pro/${slug}`,
    },
    openGraph: {
      title: `${title} | GentiLuna`,
      description,
      url: `https://www.gentiluna.com/pro/${slug}`,
    },
  };
}

export default async function ProPublicProfile({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const profile = await prisma.professionalProfile.findUnique({
    where: { slug: slug, isActive: true },
    include: { services: true, reviews: { include: { timelineItem: true } } },
  });

  if (!profile) notFound();

  const session = await getSession();

  const sub = await prisma.subscription.findUnique({
    where: { userId: profile.userId },
    include: { plan: true },
  });
  const isPremium =
    sub?.status?.toUpperCase() === "ACTIVE" &&
    sub.plan?.name.toUpperCase() !== "FREE" &&
    sub.plan?.name.toUpperCase() !== "BASE";

  const categoryLabel = getProCategoryLabel(profile.category);
  const services = profile.services?.sort((a, b) => a.order - b.order) || [];
  const resolveProImg = (raw?: string | null) => {
    if (!raw) return "";
    if (raw.startsWith("uploads/pro-") || raw.includes("/object/public/wedding-media/uploads/pro-")) {
      return `/api/media/pro?path=${encodeURIComponent(raw)}`;
    }
    return raw;
  };

  const resolvedGallery = (profile.gallery || []).map((u) => resolveProImg(u)).filter(Boolean);
  const avatarSrc = resolveProImg(profile.profileImage || profile.logoUrl);
  const coverSrc = resolveProImg(profile.coverImage);

  const reviewCount = profile.reviews?.length || 0;
  const avgRating =
    reviewCount > 0
      ? (profile.reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviewCount).toFixed(1)
      : null;

  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans flex flex-col overflow-x-hidden">
      {/* TOP BAR ELEGANTE */}
      <nav className="sticky top-0 z-40 w-full bg-stone-950/95 backdrop-blur-md border-b border-stone-800 px-4 sm:px-6 py-3.5 text-white">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 font-serif text-xl sm:text-2xl text-white">
            <GentiLunaLogo variant="pro" className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" />
            <span>GentiLuna</span>
            <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-amber-400 ml-0.5">
              PRO
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
            <Link
              href="/fornitori"
              className="text-stone-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors font-medium"
            >
              Directory Fornitori
            </Link>
            <Link href="/professionisti#founders" className="hidden sm:inline-block">
              <Button className="rounded-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-4 h-9 text-xs">
                Crea la tua Vetrina
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO EDITORIALE VETRINA */}
      <header className="bg-stone-950 text-stone-100 pt-14 pb-20 px-4 relative overflow-hidden">
        {coverSrc ? (
          <>
            <div className="absolute inset-0">
              <img
                src={coverSrc}
                alt={profile.businessName}
                className="w-full h-full object-cover opacity-35 scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/75 to-stone-950/50" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-950 to-amber-950/30" />
        )}

        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          {/* Avatar / Monogram Crest */}
          <div className="inline-block relative">
            {avatarSrc ? (
              <div className="w-32 h-32 sm:w-36 sm:h-36 mx-auto rounded-full overflow-hidden border-4 border-amber-400/50 shadow-[0_0_40px_rgba(245,158,11,0.25)] bg-stone-900">
                <img src={avatarSrc} alt={profile.businessName} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-32 h-32 sm:w-36 sm:h-36 mx-auto rounded-full border-4 border-amber-400/40 bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center shadow-2xl">
                <span className="font-serif text-5xl text-amber-300">
                  {profile.businessName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 whitespace-nowrap bg-stone-900 border border-amber-400/40 text-amber-300 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
              {isPremium ? (
                <>
                  <Award className="w-3 h-3 text-amber-400" /> VIP Partner
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Partner Verificato
                </>
              )}
            </span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-2 pt-2">
            <span className="inline-flex items-center gap-1.5 bg-white/10 text-white border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase shadow-sm backdrop-blur-sm">
              <Camera className="w-3.5 h-3.5 text-amber-300" />
              {categoryLabel}
            </span>
            {profile.serviceArea && (
              <span className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-200 border border-rose-400/30 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase shadow-sm backdrop-blur-sm">
                <MapPin className="w-3.5 h-3.5" />
                {profile.serviceArea}
              </span>
            )}
            {avgRating && (
              <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-200 border border-amber-400/30 rounded-full px-3.5 py-1.5 text-xs font-bold backdrop-blur-sm">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {avgRating} ({reviewCount} {reviewCount === 1 ? "recensione" : "recensioni"})
              </span>
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white tracking-tight leading-tight">
            {profile.businessName}
          </h1>

          {/* Metriche Vetrina */}
          <div className="flex flex-wrap justify-center gap-3 text-xs text-stone-300">
            <span className="bg-white/5 border border-white/10 rounded-full px-3.5 py-1">
              {resolvedGallery.length} {resolvedGallery.length === 1 ? "foto portfolio" : "foto in portfolio"}
            </span>
            <span className="bg-white/5 border border-white/10 rounded-full px-3.5 py-1">
              {services.length} {services.length === 1 ? "servizio configurato" : "servizi configurati"}
            </span>
            <span className="bg-white/5 border border-white/10 rounded-full px-3.5 py-1">
              0% costi extra sui preventivi
            </span>
          </div>

          {/* Primary CTAs */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <a
              href="#contatta-pro"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold text-sm px-7 py-3.5 rounded-full shadow-lg shadow-rose-900/30 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              Richiedi Preventivo Gratuito
            </a>
            {session?.role === "COUPLE" ? (
              <Link
                href={`/dashboard/messages?proId=${profile.id}`}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 font-medium text-sm px-7 py-3.5 rounded-full backdrop-blur-sm transition-colors"
              >
                Live Chat Protetta
              </Link>
            ) : (
              <a
                href="#contatta-pro"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 font-medium text-sm px-7 py-3.5 rounded-full backdrop-blur-sm transition-colors"
              >
                Live Chat Protetta
              </a>
            )}
          </div>

          {/* Quick Share Strip right in Hero */}
          <div className="pt-4 flex justify-center">
            <div className="inline-flex flex-wrap items-center justify-center bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-4 py-2">
              <ShareChapterButtons
                urlPath={`/pro/${slug}`}
                title={`${profile.businessName} (${categoryLabel}) su GentiLuna`}
                variant="dark"
                label="Condividi vetrina:"
              />
            </div>
          </div>
        </div>
      </header>

      {/* BODY CONTENT */}
      <main className="max-w-6xl mx-auto w-full px-4 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 flex-1">
        {/* Colonna Larga */}
        <div className="lg:col-span-2 space-y-12">
          {/* Chi Siamo */}
          {profile.description && (
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mb-4 flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0" /> Chi Siamo &amp; Filosofia
              </h2>
              <p className="text-stone-600 whitespace-pre-wrap leading-relaxed text-base sm:text-lg font-light">
                {profile.description}
              </p>
            </section>
          )}

          {/* Galleria Interattiva con Lightbox */}
          {resolvedGallery.length > 0 && (
            <section>
              <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-rose-600">Portfolio Selezionato</span>
                  <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mt-1">
                    Gallery Professionale
                  </h2>
                </div>
                <span className="text-xs text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                  Clicca su uno scatto per ingrandirlo
                </span>
              </div>
              <ProPortfolioLightbox images={resolvedGallery} businessName={profile.businessName} />
            </section>
          )}

          {/* Video con Thumbnail reale */}
          {(profile.video1 || profile.video2) && (
            <section>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Showreel &amp; Film</span>
              <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mt-1 mb-6">I Nostri Video</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {profile.video1 && <VideoThumbnail url={profile.video1} />}
                {profile.video2 && <VideoThumbnail url={profile.video2} />}
              </div>
              <p className="text-xs text-stone-400 mt-3 italic">Clicca per riprodurre i video completi.</p>
            </section>
          )}

          {/* Servizi Offerti */}
          <section>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">Listino &amp; Soluzioni</span>
            <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mt-1 mb-6">Servizi Offerti</h2>
            {!isPremium && services.length > 3 ? (
              <div className="space-y-4">
                {services.slice(0, 3).map((s) => (
                  <Card key={s.id} className="border-stone-200/80 shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                        <div className="space-y-2">
                          <h3 className="text-xl font-serif font-semibold text-stone-900">{s.name}</h3>
                          {s.description && <p className="text-stone-600 text-sm whitespace-pre-wrap leading-relaxed">{s.description}</p>}
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                          {s.priceIndicative && (
                            <div className="bg-amber-50 text-amber-900 border border-amber-200 px-3.5 py-1.5 rounded-full text-sm font-bold whitespace-nowrap">
                              {s.priceIndicative}
                            </div>
                          )}
                          <a href="#contatta-pro" className="text-xs font-semibold text-rose-600 hover:underline inline-flex items-center gap-1">
                            Richiedi info <ArrowRight className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <div className="bg-stone-100 border border-stone-200 p-6 rounded-2xl text-center">
                  <p className="text-sm font-semibold text-stone-700 mb-2 flex justify-center items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-600" /> Altri servizi disponibili (Piano Partner PRO)
                  </p>
                  <Link href="/dashboard/billing">
                    <Button variant="outline" size="sm" className="mt-2 text-stone-800 bg-white rounded-full">
                      Scopri come sbloccare servizi illimitati
                    </Button>
                  </Link>
                </div>
              </div>
            ) : services.length > 0 ? (
              <div className="space-y-4">
                {services.map((s) => (
                  <Card key={s.id} className="border-stone-200/80 shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                        <div className="space-y-2">
                          <h3 className="text-xl font-serif font-semibold text-stone-900">{s.name}</h3>
                          {s.description && <p className="text-stone-600 text-sm whitespace-pre-wrap leading-relaxed">{s.description}</p>}
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                          {s.priceIndicative && (
                            <div className="bg-amber-50 text-amber-900 border border-amber-200 px-3.5 py-1.5 rounded-full text-sm font-bold whitespace-nowrap">
                              {s.priceIndicative}
                            </div>
                          )}
                          <a href="#contatta-pro" className="text-xs font-semibold text-rose-600 hover:underline inline-flex items-center gap-1">
                            Chiedi disponibilità <ArrowRight className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 border border-stone-200 text-stone-500 text-sm italic">
                Pacchetti personalizzabili su misura — utilizza il modulo a lato per ricevere un preventivo gratuito.
              </div>
            )}
          </section>

          {/* Vantaggi / Funzioni consigliate GentiLuna incluse */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-600">Ecosistema GentiLuna</span>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mt-1 mb-5">
              Cosa ottieni lavorando con {profile.businessName} su GentiLuna
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: ShieldCheck,
                  title: "Contatto Tracciato & 0% Rincari",
                  text: "Nessuna commissione applicata ai preventivi: parli direttamente con lo studio dentro la piattaforma.",
                },
                {
                  icon: Camera,
                  title: "Consegne & Gallerie in HD",
                  text: "Possibilità di ricevere album digitali ufficiali e foto organizzate per capitoli senza perdite di qualità.",
                },
                {
                  icon: QrCode,
                  title: "QR Code Live per gli Invitati",
                  text: "Collega il professionista al tuo spazio evento così tutti gli ospiti partecipano e ricordano il tuo matrimonio.",
                },
                {
                  icon: CheckCircle2,
                  title: "Recensioni Reali & Trasparenza",
                  text: "Feedback verificati lasciati direttamente dalle coppie che hanno vissuto l'evento.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl bg-stone-50/80 border border-stone-200/70 p-4 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 text-rose-600 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-stone-900">{item.title}</h3>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Condivisione Vetrina, QR Stampabile & Invito Colleghi/Sposi */}
          <ProShareInviteCard
            slug={slug}
            businessName={profile.businessName}
            categoryLabel={categoryLabel}
          />

          {/* Recensioni */}
          <section className="pt-8 border-t border-stone-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif text-stone-900">Dicono di noi</h2>
                {avgRating && (
                  <p className="text-sm text-stone-500 mt-1">
                    Media valutazioni: <strong className="text-stone-900">{avgRating} / 5</strong> su {reviewCount}{" "}
                    {reviewCount === 1 ? "recensione" : "recensioni"}
                  </p>
                )}
              </div>
              <PublicReviewForm proId={profile.id} proName={profile.businessName} />
            </div>

            {profile.reviews && profile.reviews.length > 0 ? (
              <div className="space-y-4">
                {profile.reviews.map((r) => (
                  <Card key={r.id} className="border-stone-200 shadow-sm bg-white rounded-2xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                        <span className="text-sm font-bold text-stone-900">
                          {r.timelineItem?.brideName} &amp; {r.timelineItem?.groomName}
                        </span>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < r.rating ? "text-amber-400 fill-amber-400" : "text-stone-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-stone-600 italic leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 border border-stone-200 text-stone-500 text-sm italic">
                Ancora nessuna recensione pubblica. Hai lavorato con {profile.businessName}? Sii il primo a raccontarlo!
              </div>
            )}
          </section>
        </div>

        {/* Info Laterali - Contatto Protetto 100% Interno a GentiLuna */}
        <div id="contatta-pro" className="space-y-8 scroll-mt-24">
          <ProContactBox
            proId={profile.id}
            proName={profile.businessName}
            serviceArea={profile.serviceArea}
            isLoggedIn={Boolean(session)}
            userRole={session?.role || null}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
