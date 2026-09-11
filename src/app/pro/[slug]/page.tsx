import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Camera, Mail, Phone, MessageCircle, MapPin, Lock, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CATEGORY_LABELS: Record<string, string> = {
  PHOTOGRAPHER: "Fotografo",
  VIDEOMAKER: "Videomaker",
  WEDDING_PLANNER: "Wedding Planner",
  DJ: "DJ",
  MUSICIAN: "Musicista / Band",
  LOCATION: "Location",
  CATERING: "Catering / Ristorante",
  FLORIST: "Fiorista",
  MAKEUP_ARTIST: "Make-up Artist",
  HAIR_STYLIST: "Hair Stylist",
  OTHER: "Professionista Eventi"
};

export default async function ProPublicProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const profile = await prisma.professionalProfile.findUnique({
    where: { slug: slug, isActive: true },
    include: { services: true, reviews: { include: { timelineItem: true } } }
  });

  if (!profile) notFound();

  // Controlla se il professionista ha un piano premium attivo
  const sub = await prisma.subscription.findUnique({
    where: { userId: profile.userId },
    include: { plan: true }
  });
  const isPremium = sub?.status === "active" && sub.plan?.name.toUpperCase() !== "FREE" && sub.plan?.name.toUpperCase() !== "BASE";

  const services = profile.services?.sort((a, b) => a.order - b.order) || [];

  return (
    <div className="min-h-screen bg-[#faf9f8] font-sans pb-24">
      {/* Header Profilo */}
      <div className="bg-stone-900 text-stone-100 pt-24 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
            <rect width="100" height="100" fill="url(#grid)"/>
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          {profile.logoUrl && (
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-stone-800 shadow-2xl mb-6 bg-stone-100">
              <img src={profile.logoUrl} alt={profile.businessName} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="inline-block bg-white/10 text-white border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase shadow-sm">
            {CATEGORY_LABELS[profile.category] || "Professionista"}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-serif">{profile.businessName}</h1>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium pt-4">
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-stone-800/50 hover:bg-stone-700/50 rounded-full px-3 py-1 transition-colors">
                <ExternalLink className="w-4 h-4"/> Sito Web
              </a>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-6">
            {!isPremium ? (
              <div className="bg-stone-800/50 border border-stone-700 p-4 rounded-xl text-center max-w-sm mx-auto w-full">
                <p className="text-sm font-semibold text-stone-300 mb-2 flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" /> Recapiti Diretti Nascosti
                </p>
                <p className="text-xs text-stone-400 mb-3">Questa è una funzione Premium.</p>
                <Link href="/dashboard/billing">
                  <Button variant="secondary" size="sm" className="w-full text-stone-800 bg-white hover:bg-stone-200">
                    Scopri come sbloccarla <ArrowUpRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {profile.whatsapp && (
                  <a href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-full gap-2 text-green-600 border-green-200 hover:bg-green-50"><MessageCircle className="w-4 h-4"/> WhatsApp</a>
                )}
                {profile.contactEmail && (
                  <a href={`mailto:${profile.contactEmail}`} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-full gap-2 text-stone-800"><Mail className="w-4 h-4"/> Email</a>
                )}
                {profile.contactPhone && (
                  <a href={`tel:${profile.contactPhone}`} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-full gap-2 text-stone-800"><Phone className="w-4 h-4"/> Chiama</a>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Descrizione (Colonna Larga) */}
        <div className="md:col-span-2 space-y-12">
          {profile.description && (
            <section>
              <h2 className="text-2xl font-serif text-stone-800 mb-6">Chi Siamo</h2>
              <p className="text-stone-600 whitespace-pre-wrap leading-relaxed">
                {profile.description}
              </p>
            </section>
          )}

          {/* Servizi Offerti */}
          <section>
            <h2 className="text-2xl font-serif text-stone-800 mb-6">Servizi Offerti</h2>
            {!isPremium && services.length > 3 ? (
              <div className="space-y-4">
                {services.slice(0, 3).map(s => (
                  <Card key={s.id} className="border-stone-200 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                        <div>
                          <h3 className="text-xl font-medium text-stone-800 mb-2">{s.name}</h3>
                          {s.description && <p className="text-stone-600 text-sm whitespace-pre-wrap">{s.description}</p>}
                        </div>
                        {s.priceIndicative && (
                          <div className="shrink-0 bg-stone-100 text-stone-700 px-3 py-1.5 rounded-md text-sm font-semibold whitespace-nowrap h-fit">
                            {s.priceIndicative}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <div className="bg-stone-50 border border-stone-200 p-6 rounded-xl text-center">
                   <p className="text-sm font-semibold text-stone-600 mb-2 flex justify-center items-center gap-2"><Lock className="w-4 h-4"/> Altri servizi nascosti (Funzione Premium)</p>
                   <Link href="/dashboard/billing"><Button variant="outline" size="sm" className="mt-2 text-stone-800 bg-white">Scopri come sbloccare servizi illimitati</Button></Link>
                </div>
              </div>
            ) : services.length > 0 ? (
              <div className="space-y-4">
                {services.map(s => (
                  <Card key={s.id} className="border-stone-200 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                        <div>
                          <h3 className="text-xl font-medium text-stone-800 mb-2">{s.name}</h3>
                          {s.description && <p className="text-stone-600 text-sm whitespace-pre-wrap">{s.description}</p>}
                        </div>
                        {s.priceIndicative && (
                          <div className="shrink-0 bg-stone-100 text-stone-700 px-3 py-1.5 rounded-md text-sm font-semibold whitespace-nowrap h-fit">
                            {s.priceIndicative}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-stone-500 italic">Servizi non ancora configurati.</p>
            )}
          </section>

          {/* Recensioni */}
          {profile.reviews && profile.reviews.length > 0 && (
            <section className="mt-12 pt-12 border-t border-stone-200">
              <h2 className="text-2xl font-serif text-stone-800 mb-6">Dicono di noi</h2>
              <div className="space-y-4">
                {profile.reviews.map(r => (
                  <Card key={r.id} className="border-stone-200 shadow-sm bg-stone-50/50">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-4 h-4 ${i < r.rating ? 'text-yellow-400' : 'text-stone-300'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-stone-800">
                          {r.timelineItem?.brideName} & {r.timelineItem?.groomName}
                        </span>
                      </div>
                      <p className="text-stone-600 italic">"{r.text}"</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Info Laterali */}
        <div className="space-y-8">
          <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 shadow-sm sticky top-8">
            <h3 className="font-serif text-lg text-stone-800 mb-6">Contatti</h3>
            
            <div className="space-y-4">
              {!isPremium ? (
                <div className="bg-white border border-stone-200 p-4 rounded-xl text-center">
                  <p className="text-sm font-semibold text-stone-600 mb-2 flex justify-center items-center gap-2"><Lock className="w-4 h-4"/> Contatti Privati</p>
                  <p className="text-xs text-stone-400 mb-3">Contatti in chiaro riservati ai profili Premium.</p>
                  <Link href="/dashboard/billing"><Button variant="outline" size="sm" className="w-full text-stone-800 bg-white">Scopri come sbloccarli</Button></Link>
                </div>
              ) : (
                <>
                  {profile.contactEmail && (
                    <a href={`mailto:${profile.contactEmail}`} className="flex items-center gap-3 text-stone-600 hover:text-stone-900 transition-colors">
                      <Mail className="w-5 h-5 text-stone-400" /> {profile.contactEmail}
                    </a>
                  )}
                  {profile.contactPhone && (
                    <a href={`tel:${profile.contactPhone}`} className="flex items-center gap-3 text-stone-600 hover:text-stone-900 transition-colors">
                      <Phone className="w-5 h-5 text-stone-400" /> {profile.contactPhone}
                    </a>
                  )}
                  {profile.whatsapp && (
                    <a href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-green-600 hover:text-green-700 transition-colors">
                      <MessageCircle className="w-5 h-5 text-green-500" /> WhatsApp
                    </a>
                  )}
                </>
              )}
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-stone-600 hover:text-stone-900 transition-colors">
                  <ExternalLink className="w-5 h-5 text-stone-400" /> Sito Web
                </a>
              )}
              {profile.instagram && (
                <a href={`https://instagram.com/${profile.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-stone-600 hover:text-stone-900 transition-colors">
                  <Camera className="w-5 h-5 text-stone-400" /> Instagram
                </a>
              )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-stone-200">
              <Button className="w-full bg-stone-900 text-white hover:bg-stone-800 rounded-xl">Richiedi Preventivo</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
