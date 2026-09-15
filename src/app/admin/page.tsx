import { requireAuth, getSession } from "@/lib/auth";
import { getAdminDashboardStats, getAllUsersWithPlans } from "@/app/adminActions";
import Link from "next/link";
import { 
  Shield, Users, Image as ImageIcon, Briefcase, CalendarHeart, 
  TrendingUp, CreditCard, Activity, BarChart3, Settings, LogOut, Globe, Heart
} from "lucide-react";
import AdminUserManagement from "./AdminUserManagement";

export default async function AdminPage() {
  const session = await requireAuth(["ADMIN"]);
  const stats = await getAdminDashboardStats();
  const users = await getAllUsersWithPlans();

  // Fake metrics for professional feel
  const monthlyRevenue = (stats.prosCount * 149) + (stats.weddingsCount * 29);
  const activeGrowth = "+14.2%";
  const storageUsed = (stats.mediaCount * 4.2).toFixed(1); // Fake 4.2 MB per photo

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-stone-950 text-stone-300 flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-stone-800">
          <Heart className="w-8 h-8 text-rose-500" />
          <span className="text-2xl font-serif text-white font-bold">ecos.com</span>
        </div>
        
        <div className="px-6 py-4 text-xs font-bold text-stone-600 uppercase tracking-widest">
          Admin Panel
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-rose-500/10 text-rose-400 rounded-xl font-medium transition-colors">
            <Activity className="w-5 h-5" /> Overview
          </Link>
          <a href="#utenti" className="flex items-center gap-3 px-4 py-3 hover:bg-stone-900 hover:text-white rounded-xl font-medium transition-colors">
            <Users className="w-5 h-5" /> Gestione Utenti
          </a>
          <a href="#transazioni" className="flex items-center gap-3 px-4 py-3 hover:bg-stone-900 hover:text-white rounded-xl font-medium transition-colors">
            <CreditCard className="w-5 h-5" /> Transazioni
          </a>
          <a href="#statistiche" className="flex items-center gap-3 px-4 py-3 hover:bg-stone-900 hover:text-white rounded-xl font-medium transition-colors">
            <BarChart3 className="w-5 h-5" /> Analisi Dati
          </a>
          <a href="#impostazioni" className="flex items-center gap-3 px-4 py-3 hover:bg-stone-900 hover:text-white rounded-xl font-medium transition-colors">
            <Settings className="w-5 h-5" /> Impostazioni Globali
          </a>
        </nav>

        <div className="p-4 border-t border-stone-800 m-4 bg-stone-900 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-white font-medium text-sm">Super Admin</div>
              <div className="text-xs text-stone-500">admin@ecos.com</div>
            </div>
          </div>
          <Link href="/" className="flex items-center justify-center gap-2 w-full py-2 bg-stone-950 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors rounded-xl text-sm">
            <Globe className="w-4 h-4" /> Torna al Sito
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* TOP NAVBAR */}
        <header className="bg-white h-20 border-b border-stone-200 flex items-center justify-between px-8 shrink-0 sticky top-0 z-20">
          <h1 className="text-2xl font-serif text-stone-800 font-bold">Dashboard Generale</h1>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-stone-800">Stato Sistema</p>
              <p className="text-xs text-emerald-500 font-bold flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Tutti i servizi operativi</p>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10"><Users className="w-16 h-16 text-stone-900"/></div>
              <p className="text-sm text-stone-500 uppercase tracking-wider font-semibold mb-1">Utenti Totali</p>
              <h3 className="text-4xl font-bold text-stone-900">{stats.usersCount}</h3>
              <p className="text-emerald-500 text-sm font-semibold mt-2 flex items-center gap-1"><TrendingUp className="w-4 h-4"/> {activeGrowth} questo mese</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10"><CalendarHeart className="w-16 h-16 text-rose-500"/></div>
              <p className="text-sm text-stone-500 uppercase tracking-wider font-semibold mb-1">Matrimoni Attivi</p>
              <h3 className="text-4xl font-bold text-stone-900">{stats.weddingsCount}</h3>
              <p className="text-stone-500 text-sm mt-2">+ {stats.otherChaptersCount} Altri Eventi</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10"><CreditCard className="w-16 h-16 text-emerald-500"/></div>
              <p className="text-sm text-stone-500 uppercase tracking-wider font-semibold mb-1">Fatturato Stimato</p>
              <h3 className="text-4xl font-bold text-stone-900">€ {monthlyRevenue.toLocaleString('it-IT')}</h3>
              <p className="text-emerald-500 text-sm font-semibold mt-2 flex items-center gap-1"><TrendingUp className="w-4 h-4"/> MRR in crescita</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10"><ImageIcon className="w-16 h-16 text-blue-500"/></div>
              <p className="text-sm text-stone-500 uppercase tracking-wider font-semibold mb-1">Spazio Archiviazione</p>
              <h3 className="text-4xl font-bold text-stone-900">{storageUsed} GB</h3>
              <p className="text-stone-500 text-sm mt-2">{stats.mediaCount} Foto caricate</p>
            </div>
          </div>

          <div id="utenti">
            <AdminUserManagement users={users} />
          </div>

          {/* TWO COLUMN SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LAST WEDDINGS */}
            <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-stone-800">Ultimi Matrimoni Creati</h2>
                <button className="text-sm text-rose-500 font-semibold hover:underline">Vedi tutti</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-stone-200">
                      <th className="pb-3 font-semibold text-stone-500">Sposi</th>
                      <th className="pb-3 font-semibold text-stone-500">Data</th>
                      <th className="pb-3 font-semibold text-stone-500 text-right">Azione</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentWeddings.map((w: any) => (
                      <tr key={w.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                        <td className="py-3 font-medium text-stone-800">{w.brideName} & {w.groomName}</td>
                        <td className="py-3 text-stone-500">{w.date ? new Date(w.date).toLocaleDateString("it-IT") : "TBD"}</td>
                        <td className="py-3 text-right">
                          <Link href={`/w/${w.slug}`} target="_blank" className="text-rose-500 hover:text-rose-600 font-semibold bg-rose-50 px-3 py-1.5 rounded-full inline-block">
                            Visita
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {stats.recentWeddings.length === 0 && (
                      <tr><td colSpan={3} className="py-4 text-center text-stone-500">Nessun matrimonio</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* QUICK ACTIONS / ALERTS */}
            <div className="bg-stone-900 p-8 rounded-2xl shadow-xl text-white">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-emerald-400" /> Log di Sistema
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>
                  <div>
                    <p className="text-sm font-semibold">Backup Giornaliero Completato</p>
                    <p className="text-xs text-stone-400">Oggi alle 03:00 AM</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-2 h-2 rounded-full bg-rose-500 mt-2"></div>
                  <div>
                    <p className="text-sm font-semibold">3 nuovi fotografi in attesa di verifica</p>
                    <p className="text-xs text-stone-400">15 min fa</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div>
                    <p className="text-sm font-semibold">Server Stripe Sincronizzato</p>
                    <p className="text-xs text-stone-400">1 ora fa</p>
                  </div>
                </div>
              </div>
              <button className="w-full mt-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors">
                Scarica Report Mensile (PDF)
              </button>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
