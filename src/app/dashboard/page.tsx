import { prisma } from "@/lib/prisma";
import { createWedding } from "@/app/actions";
import { requireAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Camera, HardDrive, Users, Settings, CreditCard } from "lucide-react";
import { PlanWidget } from "@/components/PlanWidget";

export default async function DashboardPage() {
  const session = await requireAuth(["PHOTOGRAPHER"]);

  const weddings = await prisma.timelineItem.findMany({
    where: { 
      OR: [
        { ownerId: session.userId },
        { assignments: { some: { professionalProfile: { userId: session.userId }, status: 'ACTIVE' } } }
      ]
    },
    orderBy: { createdAt: "desc" },
    include: {
      media: true,
      guests: true,
    }
  });

  const totalStorage = weddings.reduce((acc: any, w: any) => acc + w.media.reduce((mAcc: any, m: any) => mAcc + m.size, 0), 0);
  const formattedStorage = (totalStorage / (1024 * 1024)).toFixed(2) + " MB";

  // Widget Logic
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.userId },
    include: { plan: true }
  });

  const isPremium = subscription?.status === "active" && subscription.plan?.name.toUpperCase() !== "FREE" && subscription.plan?.name.toUpperCase() !== "BASE";
  const currentPlanName = isPremium ? subscription.plan.name : "Piano Base Gratuito";
  
  const features = {
    included: isPremium ? [
      "Posizionamento in evidenza",
      "Servizi illimitati inseribili",
      "Recapiti diretti sbloccati per i clienti",
      "Spazio di archiviazione espanso"
    ] : [
      "Accesso alla piattaforma",
      "Gestione limitata dei matrimoni",
      "Profilo Base (senza contatti diretti)"
    ],
    missing: isPremium ? [] : [
      "Posizionamento in evidenza per attirare coppie",
      "Servizi illimitati e recapiti diretti",
      "Visibilità prioritaria nelle ricerche"
    ]
  };

  const stripeConfigured = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen bg-stone-50">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
        <div>
          <h1 className="text-3xl font-bold font-serif">Area Professionisti</h1>
          <p className="text-stone-500">Gestisci i matrimoni e le consegne digitali.</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="text-right">
            <p className="text-sm text-stone-500 font-semibold uppercase tracking-wider">Spazio Usato</p>
            <p className="font-bold flex items-center justify-end gap-1"><HardDrive className="h-4 w-4" /> {formattedStorage}</p>
          </div>
          <form action={async () => {
            "use server";
          }}>
            <Link href="/dashboard/profile">
              <Button variant="outline" className="rounded-full bg-stone-100 hover:bg-stone-200">Il Mio Profilo</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="rounded-full ml-2">Esci</Button>
            </Link>
          </form>
        </div>
      </div>

      <div className="mb-6 bg-gradient-to-r from-amber-500/10 to-amber-700/10 border border-amber-200/50 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 justify-between">
        <div>
          <h3 className="text-lg font-bold text-amber-900 font-serif flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-700" /> Trasforma i matrimoni in nuovi clienti
          </h3>
          <p className="text-amber-800/80 text-sm mt-1 max-w-2xl">
            Ricorda: ogni spazio digitale che crei e condividi con gli sposi sarà visto da centinaia di invitati. È la tua vetrina perfetta. Completa il tuo profilo pubblico per convertire quegli ospiti nei tuoi prossimi clienti!
          </p>
        </div>
        <Link href="/dashboard/profile">
          <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-full font-bold shadow-md whitespace-nowrap">
            Completa la Vetrina
          </Button>
        </Link>
      </div>

      {/* REFERRAL SYSTEM: ESPANDI IL TUO NETWORK */}
      <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-bold text-lg text-stone-800 mb-2 font-serif">Invita gli Sposi</h3>
          <p className="text-stone-500 text-sm mb-6">Fai registrare i tuoi prossimi sposi per creare il loro spazio su WeddingSpace. Sarai impostato come fotografo ufficiale.</p>
          <a href={`https://wa.me/?text=${encodeURIComponent("Ciao! Per il vostro matrimonio useremo WeddingSpace, una piattaforma per raccogliere le foto di tutti gli invitati e la mia galleria ufficiale. Registratevi qui per creare il vostro spazio: https://wedding-platform-topwebsitee.vercel.app/sposi")}`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full border-stone-300 text-stone-700 hover:bg-stone-50 rounded-full font-semibold">
              <span className="text-emerald-500 mr-2">WhatsApp</span> Invia Link agli Sposi
            </Button>
          </a>
        </div>
        <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-bold text-lg text-stone-800 mb-2 font-serif">Invita un Collaboratore</h3>
          <p className="text-stone-500 text-sm mb-6">Conosci altri fotografi o professionisti del wedding? Fai scoprire loro come generare contatti da ogni evento.</p>
          <a href={`https://wa.me/?text=${encodeURIComponent("Ciao! Sto usando WeddingSpace per gestire le gallerie dei miei matrimoni e ricevere contatti dagli invitati. Dacci un'occhiata: https://wedding-platform-topwebsitee.vercel.app/professionisti")}`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full border-stone-300 text-stone-700 hover:bg-stone-50 rounded-full font-semibold">
              <span className="text-emerald-500 mr-2">WhatsApp</span> Invia Link al Collega
            </Button>
          </a>
        </div>
      </div>

      <div className="mb-8">
        <PlanWidget 
          role="PHOTOGRAPHER" 
          currentPlanName={currentPlanName} 
          isActive={!!subscription && subscription.status === "active"} 
          expiresAt={subscription?.currentPeriodEnd?.toISOString() || subscription?.expiresAt?.toISOString()} 
          features={features} 
          upgradeLink="/dashboard/billing" 
          stripeConfigured={stripeConfigured}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          {/* Profile Quick Link */}
          <Card className="shadow-md border-none bg-stone-900 text-white">
            <CardHeader className="rounded-t-xl pb-2">
              <CardTitle className="text-xl">Vetrina Pubblica</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-stone-400 mb-4">Completa il tuo profilo pubblico e inserisci i tuoi servizi.</p>
              <Link href="/dashboard/profile">
                <Button className="w-full bg-white text-stone-900 hover:bg-stone-200">
                  Modifica Profilo Pubblico
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Nuovo Matrimonio */}
          <Card className="shadow-md border-none">
            <CardHeader className="bg-stone-100 text-stone-800 rounded-t-xl">
              <CardTitle>Nuovo Matrimonio</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form action={createWedding} className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome Sposa</Label>
                  <Input name="brideName" required placeholder="Es. Laura" className="bg-stone-50" />
                </div>
                <div className="space-y-2">
                  <Label>Nome Sposo</Label>
                  <Input name="groomName" required placeholder="Es. Mario" className="bg-stone-50" />
                </div>
              <div className="space-y-2">
                <Label>Data</Label>
                <Input name="date" type="date" required className="bg-stone-50" />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input name="location" placeholder="Villa Esempio" className="bg-stone-50" />
              </div>
              <Button type="submit" className="w-full h-12 rounded-full text-lg">Crea Spazio Digitale</Button>
            </form>
          </CardContent>
        </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2"><Users className="h-6 w-6"/> I tuoi Clienti</h2>
          {weddings.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-stone-100">
              <Camera className="h-12 w-12 mx-auto text-stone-300 mb-4" />
              <h3 className="text-xl font-bold text-stone-700">Nessun matrimonio</h3>
              <p className="text-stone-500">Crea il tuo primo evento per iniziare a raccogliere foto.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weddings.map((w: any) => {
                const wStorage = (w.media.reduce((acc: any, m: any) => acc + m.size, 0) / (1024 * 1024)).toFixed(1);
                return (
                  <Card key={w.id} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{w.brideName} & {w.groomName}</h3>
                          <p className="text-sm text-stone-500">{w.date?.toLocaleDateString()}</p>
                        </div>
                        <span className="text-xs font-semibold bg-stone-100 text-stone-600 px-2 py-1 rounded-full">{wStorage} MB</span>
                      </div>
                      
                      <div className="flex justify-between items-center bg-stone-50 p-3 rounded-lg mb-4">
                        <span className="text-sm font-semibold text-stone-600">{w.media.length} File totali</span>
                        <Link href={`/w/${w.slug}`} target="_blank" className="text-blue-600 text-sm hover:underline font-medium">Vedi Sito</Link>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Link href={`/couple/${w.slug}`} className="col-span-2">
                          <Button variant="secondary" className="w-full bg-stone-200 hover:bg-stone-300 text-stone-800">
                            <Settings className="w-4 h-4 mr-2" /> Gestisci & Consegna
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
