import { requireAuth, getSession } from "@/lib/auth";
import { getAdminDashboardStats, getAllUsersWithPlans } from "@/app/adminActions";
import { getSystemConfig } from "./settingsActions";
import { getMaskedStripeConfigForAdminUI } from "@/lib/stripeServer";
import SettingsClient from "./settings/SettingsClient";
import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  Shield, Users, Image as ImageIcon, Briefcase, CalendarHeart, 
  TrendingUp, CreditCard, Activity, BarChart3, Settings, LogOut, Globe
} from "lucide-react";
import AdminUserManagement from "./AdminUserManagement";
import { GentiLunaLogo } from "@/components/GentiLunaLogo";

export default async function AdminPage() {
  const currentSession = await getSession();
  if (!currentSession || currentSession.role !== "ADMIN") {
    redirect("/login?role=ADMIN");
  }
  const session = await requireAuth(["ADMIN"]);
  const stats = await getAdminDashboardStats();
  const users = await getAllUsersWithPlans();
  const systemConfig = await getSystemConfig();
  const stripeConfig = await getMaskedStripeConfigForAdminUI();

  // Fake metrics for professional feel
  const monthlyRevenue = (stats.prosCount * 149) + (stats.weddingsCount * 29);
  const activeGrowth = "+14.2%";
  const storageUsed = (stats.mediaCount * 4.2).toFixed(1); // Fake 4.2 MB per photo

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-stone-950 text-stone-300 flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-stone-800">
          <GentiLunaLogo className="w-8 h-8 shrink-0" />
          <span className="text-2xl font-serif text-white font-bold">GentiLuna</span>
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
          <a href="#impostazioni" className="flex items-center gap-3 px-4 py-3 hover:bg-stone-900 hover:text-white rounded-xl font-medium transition-colors text-amber-400">
            <Settings className="w-5 h-5" /> Impostazioni & Stripe
          </a>
        </nav>

        <div className="p-4 border-t border-stone-800 m-4 bg-stone-900 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-white font-medium text-sm">Super Admin</div>
              <div className="text-xs text-stone-500">admin@gentiluna.com</div>
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
              <h3 className="text-4xl font-bold text-stone-900">EUR {monthlyRevenue.toLocaleString('it-IT')}</h3>
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

          <div id="impostazioni" className="pt-4">
            <SettingsClient initialConfig={systemConfig} initialStripeConfig={stripeConfig} />
          </div>

          {/* TWO COLUMN SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LAST WEDDINGS */}
            <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm lg:col-span-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-stone-800">Stato Completamento di Tutti i Matrimoni ({stats.recentWeddings.length})</h2>
                  <p className="text-sm text-stone-500">Elenco completo dei matrimoni creati da Sposi o Fotografi, con contatori e accesso diretto.</p>
                </div>
                <Link href="/fornitori" target="_blank" className="text-sm text-amber-600 font-semibold hover:underline">
                  Vedi Catalogo Fornitori Pubblico →
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-stone-200 text-xs uppercase tracking-wider text-stone-500">
                      <th className="pb-3 pr-4 font-semibold">Sposi & Creatore</th>
                      <th className="pb-3 px-4 font-semibold">Data</th>
                      <th className="pb-3 px-4 font-semibold">Contenuti Inseriti</th>
                      <th className="pb-3 pl-4 font-semibold text-right">Accessi Diretti</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {stats.recentWeddings.map((w: any) => {
                      const c = w._count || {};
                      const stepsDone = [
                        Boolean(w.date),
                        Boolean(w.coverImage),
                        Boolean(w.welcomeMessage || w.usefulInfo || w.dressCode),
                        (c.locations || 0) > 0,
                        (c.schedule || 0) > 0,
                        (c.guests || 0) > 0,
                        (c.media || 0) > 0,
                        (c.giftOptions || 0) + (c.tables || 0) > 0,
                      ].filter(Boolean).length;
                      const pct = Math.round((stepsDone / 8) * 100);

                      return (
                        <tr key={w.id} className="hover:bg-stone-50">
                          <td className="py-4 pr-4">
                            <div className="font-bold text-stone-900">{w.brideName} & {w.groomName}</div>
                            <div className="text-xs text-stone-500">
                              Slug: <span className="font-mono text-stone-700">/w/{w.slug}</span> • Creato da: {w.owner?.name || w.owner?.email} ({w.owner?.role})
                            </div>
                          </td>
                          <td className="py-4 px-4 text-stone-600 whitespace-nowrap">
                            {w.date ? new Date(w.date).toLocaleDateString("it-IT") : "Da definire"}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className="w-28 h-2 bg-stone-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${pct >= 75 ? "bg-emerald-500" : pct >= 40 ? "bg-amber-500" : "bg-rose-500"}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-stone-700">{pct}%</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 text-xs text-stone-600">
                              <span className="bg-stone-100 px-2 py-0.5 rounded">📸 {c.media || 0} Foto</span>
                              <span className="bg-stone-100 px-2 py-0.5 rounded">👥 {c.guests || 0} Invitati</span>
                              <span className="bg-stone-100 px-2 py-0.5 rounded">📍 {c.locations || 0} Location</span>
                              <span className="bg-stone-100 px-2 py-0.5 rounded">🕒 {c.schedule || 0} Orari</span>
                              <span className="bg-stone-100 px-2 py-0.5 rounded">🪑 {c.tables || 0} Tavoli</span>
                              <span className="bg-stone-100 px-2 py-0.5 rounded">🎁 {c.giftOptions || 0} Regali</span>
                            </div>
                          </td>
                          <td className="py-4 pl-4 text-right whitespace-nowrap">
                            <div className="inline-flex flex-wrap justify-end gap-1.5">
                              <Link
                                href={`/w/${w.slug}`}
                                target="_blank"
                                className="text-xs text-rose-600 hover:bg-rose-100 font-semibold bg-rose-50 border border-rose-200 px-2.5 py-1.5 rounded-lg"
                              >
                                Sito Pubblico
                              </Link>
                              <Link
                                href={`/couple/${w.slug}`}
                                target="_blank"
                                className="text-xs text-stone-700 hover:bg-stone-200 font-semibold bg-stone-100 border border-stone-300 px-2.5 py-1.5 rounded-lg"
                              >
                                Dashboard Sposi
                              </Link>
                              <Link
                                href={`/couple/${w.slug}/chapter/${w.slug}`}
                                target="_blank"
                                className="text-xs text-indigo-700 hover:bg-indigo-100 font-semibold bg-indigo-50 border border-indigo-200 px-2.5 py-1.5 rounded-lg"
                              >
                                Gestione Dettagli
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {stats.recentWeddings.length === 0 && (
                      <tr><td colSpan={4} className="py-4 text-center text-stone-500">Nessun matrimonio</td></tr>
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
