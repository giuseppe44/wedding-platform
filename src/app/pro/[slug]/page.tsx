import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Camera, Mail, Phone, MessageCircle, MapPin } from "lucide-react";
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

  const services = profile.services.sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-stone-50 font-sans pb-24">
      {/* Header / Vetrina */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center text-center">
          {profile.logoUrl ? (
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md mb-6">
              <img src={profile.logoUrl} alt={profile.businessName} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-6 font-serif text-3xl shadow-sm border border-stone-200">
              {profile.businessName.charAt(0).toUpperCase()}
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-serif text-stone-800 tracking-tight mb-2">{profile.businessName}</h1>
          <p className="text-stone-500 uppercase tracking-widest text-sm font-semibold mb-8">
            {CATEGORY_LABELS[profile.category] || "Professionista Eventi"}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-full gap-2"><ExternalLink className="w-4 h-4"/> Sito Web</a>
            )}
            {profile.instagram && (
              <a href={`https://instagram.com/${profile.instagram}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-full gap-2 text-pink-600 border-pink-200 hover:bg-pink-50"><Camera className="w-4 h-4"/> @{profile.instagram}</a>
            )}
            {profile.whatsapp && (
              <a href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-full gap-2 text-green-600 border-green-200 hover:bg-green-50"><MessageCircle className="w-4 h-4"/> WhatsApp</a>
            )}
            {profile.contactEmail && (
              <a href={`mailto:${profile.contactEmail}`} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-full gap-2"><Mail className="w-4 h-4"/> Email</a>
            )}
            {profile.contactPhone && (
              <a href={`tel:${profile.contactPhone}`} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-full gap-2"><Phone className="w-4 h-4"/> Chiama</a>
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
            {services.length > 0 ? (
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
                      <div className="flex items-center gap-1 mb-3 text-yellow-500">
                        {Array(5).fill(0).map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < r.rating ? 'fill-current' : 'text-stone-300 fill-current'}`} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        ))}
                      </div>
                      {r.text && <p className="text-stone-600 italic mb-4">"{r.text}"</p>}
                      <p className="text-sm font-semibold text-stone-800">
                        {r.timelineItem.brideName} & {r.timelineItem.groomName}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
  
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card className="border-stone-200 shadow-sm sticky top-8">
            <CardContent className="p-6 flex flex-col gap-4">
              <h3 className="font-serif text-xl text-stone-800 mb-2">Contatti</h3>
              
              {profile.whatsapp && (
                <a href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`} className="flex items-center gap-3 text-stone-600 hover:text-green-600 transition-colors">
                  <MessageCircle className="w-5 h-5 text-stone-400" /> WhatsApp
                </a>
              )}
              {profile.contactPhone && (
                <a href={`tel:${profile.contactPhone}`} className="flex items-center gap-3 text-stone-600 hover:text-stone-900 transition-colors">
                  <Phone className="w-5 h-5 text-stone-400" /> {profile.contactPhone}
                </a>
              )}
              {profile.contactEmail && (
                <a href={`mailto:${profile.contactEmail}`} className="flex items-center gap-3 text-stone-600 hover:text-stone-900 transition-colors break-all">
                  <Mail className="w-5 h-5 text-stone-400 shrink-0" /> {profile.contactEmail}
                </a>
              )}
              {profile.instagram && (
                <a href={`https://instagram.com/${profile.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-stone-600 hover:text-pink-600 transition-colors">
                  <Camera className="w-5 h-5 text-stone-400" /> @{profile.instagram}
                </a>
              )}
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-stone-600 hover:text-stone-900 transition-colors">
                  <ExternalLink className="w-5 h-5 text-stone-400 shrink-0" /> Sito Web
                </a>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
