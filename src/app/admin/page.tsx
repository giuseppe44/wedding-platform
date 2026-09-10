import { requireAuth } from "@/lib/auth";
import { getAdminDashboardStats } from "@/app/adminActions";
import Link from "next/link";
import { Shield, Users, Image as ImageIcon, Briefcase, CalendarHeart } from "lucide-react";

export default async function AdminPage() {
  await requireAuth(["ADMIN"]);
  
  const stats = await getAdminDashboardStats();

  return (
    <div className="min-h-screen bg-stone-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center gap-4 mb-12 border-b border-stone-200 pb-6">
          <Shield className="w-10 h-10 text-stone-800" />
          <div>
            <h1 className="text-3xl font-serif text-stone-800">Pannello Amministrazione</h1>
            <p className="text-stone-500">Supervisione globale della piattaforma</p>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col items-center text-center">
            <Users className="w-8 h-8 text-stone-400 mb-2" />
            <h3 className="text-3xl font-bold text-stone-800">{stats.usersCount}</h3>
            <p className="text-sm text-stone-500 uppercase tracking-wider mt-1">Utenti Registrati</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col items-center text-center">
            <CalendarHeart className="w-8 h-8 text-stone-400 mb-2" />
            <h3 className="text-3xl font-bold text-stone-800">{stats.weddingsCount}</h3>
            <p className="text-sm text-stone-500 uppercase tracking-wider mt-1">Matrimoni (Famiglie: {stats.familiesCount})</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col items-center text-center">
            <Briefcase className="w-8 h-8 text-stone-400 mb-2" />
            <h3 className="text-3xl font-bold text-stone-800">{stats.prosCount}</h3>
            <p className="text-sm text-stone-500 uppercase tracking-wider mt-1">Professionisti</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col items-center text-center">
            <ImageIcon className="w-8 h-8 text-stone-400 mb-2" />
            <h3 className="text-3xl font-bold text-stone-800">{stats.mediaCount}</h3>
            <p className="text-sm text-stone-500 uppercase tracking-wider mt-1">Media Caricati</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm">
          <h2 className="text-xl font-semibold text-stone-800 mb-6">Ultimi Matrimoni Creati</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="pb-3 text-sm font-medium text-stone-500">Slug / Titolo</th>
                  <th className="pb-3 text-sm font-medium text-stone-500">Sposi</th>
                  <th className="pb-3 text-sm font-medium text-stone-500">Data</th>
                  <th className="pb-3 text-sm font-medium text-stone-500">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentWeddings.map((w: any) => (
                  <tr key={w.id} className="border-b border-stone-100 last:border-0">
                    <td className="py-4">
                      <div className="font-medium text-stone-800">{w.slug}</div>
                      <div className="text-xs text-stone-500">{w.id}</div>
                    </td>
                    <td className="py-4 text-stone-700">{w.brideName} & {w.groomName}</td>
                    <td className="py-4 text-stone-600">{new Date(w.createdAt).toLocaleDateString("it-IT")}</td>
                    <td className="py-4">
                      <Link href={`/w/${w.slug}`} target="_blank" className="text-stone-800 hover:underline text-sm font-medium">
                        Vedi Pubblico
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
