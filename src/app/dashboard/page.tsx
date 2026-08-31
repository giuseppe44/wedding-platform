import { prisma } from "@/lib/prisma";
import { createWedding } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Camera, HardDrive, Users, Settings } from "lucide-react";

export default async function DashboardPage() {
  const weddings = await prisma.wedding.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      media: true,
      guests: true,
    }
  });

  const totalStorage = weddings.reduce((acc, w) => acc + w.media.reduce((mAcc, m) => mAcc + m.size, 0), 0);
  const formattedStorage = (totalStorage / (1024 * 1024)).toFixed(2) + " MB";

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen bg-stone-50">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
        <div>
          <h1 className="text-3xl font-bold">Area Professionisti</h1>
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
            <Link href="/">
              <Button variant="outline" className="rounded-full">Esci</Button>
            </Link>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 h-fit shadow-md border-none">
          <CardHeader className="bg-stone-800 text-white rounded-t-xl">
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
              {weddings.map((w) => {
                const wStorage = (w.media.reduce((acc, m) => acc + m.size, 0) / (1024 * 1024)).toFixed(1);
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
