"use client";

import { useState } from "react";
import { updateUserPlan, migrateLegacyWeddingSlugs } from "@/app/adminActions";
import Link from "next/link";
import { ExternalLink, CheckCircle2, XCircle, Camera, Users, MapPin, Clock, Gift, LayoutDashboard, Globe, Sparkles, Wand2 } from "lucide-react";

function computeProCompletion(pro: any) {
  if (!pro) {
    return { percent: 0, steps: [], galleryCount: 0, servicesCount: 0, assignmentsCount: 0 };
  }
  const galleryCount = Array.isArray(pro.gallery) ? pro.gallery.length : 0;
  const servicesCount = pro._count?.services ?? 0;
  const assignmentsCount = pro._count?.assignments ?? 0;

  const steps = [
    { label: "Nome & Categoria", done: Boolean(pro.businessName && pro.category) },
    { label: "Logo / Avatar", done: Boolean(pro.profileImage || pro.logoUrl) },
    { label: "Copertina", done: Boolean(pro.coverImage) },
    { label: "Biografia", done: Boolean(pro.description && pro.description.trim().length > 10) },
    { label: "Zona Operativa", done: Boolean(pro.serviceArea && pro.serviceArea.trim().length > 0) },
    {
      label: "Contatti / Social",
      done: Boolean(pro.contactPhone || pro.whatsapp || pro.contactEmail || pro.instagram || pro.website),
    },
    { label: `Portfolio (${galleryCount} foto)`, done: galleryCount > 0 },
    { label: `Servizi (${servicesCount})`, done: servicesCount > 0 },
  ];

  const doneCount = steps.filter((s) => s.done).length;
  const percent = Math.round((doneCount / steps.length) * 100);
  return { percent, steps, galleryCount, servicesCount, assignmentsCount };
}

function computeWeddingCompletion(w: any) {
  if (!w) {
    return { percent: 0, steps: [], counts: { media: 0, guests: 0, locations: 0, schedule: 0, tables: 0, giftOptions: 0, messages: 0 } };
  }
  const counts = {
    media: w._count?.media ?? 0,
    guests: w._count?.guests ?? 0,
    locations: w._count?.locations ?? 0,
    schedule: w._count?.schedule ?? 0,
    tables: w._count?.tables ?? 0,
    giftOptions: w._count?.giftOptions ?? 0,
    messages: w._count?.messages ?? 0,
  };

  const steps = [
    { label: "Data Evento", done: Boolean(w.date) },
    { label: "Copertina", done: Boolean(w.coverImage) },
    { label: "Benvenuto / Info", done: Boolean(w.welcomeMessage || w.usefulInfo || w.dressCode) },
    { label: `Location (${counts.locations})`, done: counts.locations > 0 },
    { label: `Programma (${counts.schedule})`, done: counts.schedule > 0 },
    { label: `Invitati (${counts.guests})`, done: counts.guests > 0 },
    { label: `Foto (${counts.media})`, done: counts.media > 0 },
    { label: `Regali/Tavoli (${counts.giftOptions + counts.tables})`, done: counts.giftOptions > 0 || counts.tables > 0 },
  ];

  const doneCount = steps.filter((s) => s.done).length;
  const percent = Math.round((doneCount / steps.length) * 100);
  return { percent, steps, counts };
}

export default function AdminUserManagement({ users }: { users: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [migratingSlugs, setMigratingSlugs] = useState(false);
  const [roleFilter, setRoleFilter] = useState<"ALL" | "PHOTOGRAPHER" | "COUPLE">("ALL");
  const [search, setSearch] = useState("");

  const handleMigrateSlugs = async () => {
    setMigratingSlugs(true);
    try {
      const res = await migrateLegacyWeddingSlugs();
      if (res.count === 0) {
        alert("Tutti i link degli sposi sono già personalizzati!");
      } else {
        const list = res.updated.map((u) => `${u.oldSlug} → ${u.newSlug}`).join("\n");
        alert(`Aggiornati ${res.count} link con successo (con redirect automatico dai vecchi URL!):\n\n${list}`);
      }
    } catch (e: any) {
      alert("Errore nella conversione dei link: " + e.message);
    } finally {
      setMigratingSlugs(false);
    }
  };

  const handlePlanChange = async (userId: string, newPlan: string) => {
    setLoadingId(userId);
    try {
      await updateUserPlan(userId, newPlan);
    } catch (e: any) {
      alert("Errore: " + e.message);
    } finally {
      setLoadingId(null);
    }
  };

  const filteredUsers = users.filter((u: any) => {
    if (roleFilter !== "ALL" && u.role !== roleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const nameMatch = (u.name || "").toLowerCase().includes(q);
      const emailMatch = (u.email || "").toLowerCase().includes(q);
      const bizMatch = (u.professionalProfile?.businessName || "").toLowerCase().includes(q);
      return nameMatch || emailMatch || bizMatch;
    }
    return true;
  });

  return (
    <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm mt-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-800">Gestione Utenti, Completamento Profili & Accesso Rapido</h2>
          <p className="text-sm text-stone-500 mt-1">
            Verifica a che punto sono gli Sposi e i Professionisti, accedi alle loro pagine pubbliche o alle dashboard private.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleMigrateSlugs}
            disabled={migratingSlugs}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm disabled:opacity-50 transition-colors cursor-pointer"
            title="Trasforma i vecchi link nozze-xxxxxx in nomi-sposi-nozze mantenendo il redirect automatico 308"
          >
            <Wand2 className="w-3.5 h-3.5" />
            {migratingSlugs ? "Conversione..." : "Personalizza Link Sposi"}
          </button>
          <input
            type="text"
            placeholder="Cerca nome, email, attività..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-stone-300 rounded-xl px-3 py-2 text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <div className="inline-flex rounded-xl bg-stone-100 p-1">
            <button
              type="button"
              onClick={() => setRoleFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                roleFilter === "ALL" ? "bg-stone-900 text-white" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Tutti ({users.length})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter("PHOTOGRAPHER")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                roleFilter === "PHOTOGRAPHER" ? "bg-amber-600 text-white" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Professionisti ({users.filter((u) => u.role === "PHOTOGRAPHER").length})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter("COUPLE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                roleFilter === "COUPLE" ? "bg-rose-600 text-white" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Sposi ({users.filter((u) => u.role === "COUPLE").length})
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-200 text-xs uppercase tracking-wider text-stone-500">
              <th className="pb-3 pr-4 font-semibold">Utente / Attività</th>
              <th className="pb-3 px-4 font-semibold">Stato Completamento & Contenuti</th>
              <th className="pb-3 px-4 font-semibold">Accesso Rapido (Pubblico & Privato)</th>
              <th className="pb-3 pl-4 font-semibold">Piano & Upgrade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredUsers.map((u: any) => {
              const currentPlan = u.Subscription?.[0]?.plan?.name || "FREE";
              const isPro = u.role === "PHOTOGRAPHER";
              const proProfile = u.professionalProfile;

              // Uniamo i matrimoni/capitoli posseduti o collegati alla coppia
              const allItems = [...(u.timelineItemsOwned || []), ...(u.timelineItemsAsCouple || [])];
              const uniqueItems = Array.from(new Map(allItems.map((item: any) => [item.id, item])).values());
              const mainWedding = uniqueItems.find((i: any) => i.type === "WEDDING") || uniqueItems[0];

              const proCompletion = isPro ? computeProCompletion(proProfile) : null;
              const weddingCompletion = !isPro && mainWedding ? computeWeddingCompletion(mainWedding) : null;
              const percent = isPro ? (proCompletion?.percent ?? 0) : (weddingCompletion?.percent ?? 0);

              const barColor =
                percent >= 75 ? "bg-emerald-500" : percent >= 40 ? "bg-amber-500" : "bg-rose-500";

              return (
                <tr key={u.id} className="hover:bg-stone-50/80 align-top">
                  {/* COLONNA 1: UTENTE & RUOLO */}
                  <td className="py-5 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
                          isPro ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {isPro ? "PROFESSIONISTA" : "SPOSI"}
                      </span>
                      {isPro && proProfile?.category && (
                        <span className="text-[11px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
                          {proProfile.category}
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-stone-900 text-base">
                      {isPro ? proProfile?.businessName || u.name || "Senza Nome" : u.name || "Coppia Sposi"}
                    </div>
                    <div className="text-xs text-stone-500">{u.email}</div>
                    {mainWedding && !isPro && (
                      <div className="text-xs text-rose-600 font-medium mt-1">
                        💍 {mainWedding.brideName} & {mainWedding.groomName}{" "}
                        {mainWedding.date ? `(${new Date(mainWedding.date).toLocaleDateString("it-IT")})` : "(Data da definire)"}
                      </div>
                    )}
                    {isPro && uniqueItems.length > 0 && (
                      <div className="text-xs text-stone-500 mt-1">
                        📁 {uniqueItems.length} eventi/matrimoni creati
                      </div>
                    )}
                  </td>

                  {/* COLONNA 2: COMPLETAMENTO % & DETTAGLI */}
                  <td className="py-5 px-4 min-w-[280px]">
                    {isPro ? (
                      proProfile ? (
                        <div>
                          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                            <span className="text-stone-700">Completamento Vetrina</span>
                            <span className={percent >= 75 ? "text-emerald-600" : percent >= 40 ? "text-amber-600" : "text-rose-600"}>
                              {percent}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden mb-3">
                            <div className={`h-full ${barColor} transition-all`} style={{ width: `${percent}%` }} />
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {proCompletion?.steps.map((s, idx) => (
                              <span
                                key={idx}
                                className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-medium ${
                                  s.done ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-stone-100 text-stone-400"
                                }`}
                              >
                                {s.done ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                {s.label}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-rose-500 font-medium">Profilo vetrina non ancora inizializzato (0%)</span>
                      )
                    ) : mainWedding && weddingCompletion ? (
                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                          <span className="text-stone-700">Completamento Matrimonio</span>
                          <span className={percent >= 75 ? "text-emerald-600" : percent >= 40 ? "text-amber-600" : "text-rose-600"}>
                            {percent}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden mb-3">
                          <div className={`h-full ${barColor} transition-all`} style={{ width: `${percent}%` }} />
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {weddingCompletion.steps.map((s, idx) => (
                            <span
                              key={idx}
                              className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-medium ${
                                s.done ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-stone-100 text-stone-400"
                              }`}
                            >
                              {s.done ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              {s.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-stone-400 italic">Nessun matrimonio associato (0%)</span>
                    )}
                  </td>

                  {/* COLONNA 3: LINK DIRETTI LATO PUBBLICO E LATO DASHBOARD */}
                  <td className="py-5 px-4">
                    <div className="flex flex-col gap-2 items-start">
                      {isPro && proProfile?.slug && (
                        <Link
                          href={`/pro/${proProfile.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Globe className="w-3.5 h-3.5" /> Vedi Vetrina Pubblica (/pro/{proProfile.slug})
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}

                      {mainWedding && (
                        <>
                          <Link
                            href={`/w/${mainWedding.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <Globe className="w-3.5 h-3.5" /> Sito Pubblico Sposi (/w/{mainWedding.slug})
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                          <Link
                            href={`/couple/${mainWedding.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard Privata Sposi
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                          <Link
                            href={`/couple/${mainWedding.slug}/chapter/${mainWedding.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <Sparkles className="w-3.5 h-3.5" /> Gestione Foto / Invitati / Tavoli
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </>
                      )}

                      {!isPro && !mainWedding && (
                        <span className="text-xs text-stone-400">Nessuna pagina disponibile</span>
                      )}
                    </div>
                  </td>

                  {/* COLONNA 4: PIANO & UPGRADE */}
                  <td className="py-5 pl-4">
                    <div className="text-xs font-bold text-stone-700 mb-1.5">
                      Piano attivo: <span className="text-rose-600">{currentPlan}</span>
                    </div>
                    <select
                      className="border border-stone-300 rounded-lg p-2 text-xs bg-stone-50 disabled:opacity-50 max-w-[210px]"
                      value={currentPlan}
                      disabled={loadingId === u.id}
                      onChange={(e) => handlePlanChange(u.id, e.target.value)}
                    >
                      <option value="FREE">FREE (Nessun piano)</option>
                      <optgroup label="Piani Sposi / Eventi">
                        <option value="BASE_ANNUAL">Sposi Base Annuale (€149)</option>
                        <option value="BASE_TRIENNIAL">Sposi Base Triennale (€249)</option>
                        <option value="PREMIUM_ANNUAL">Sposi Premium Annuale (€399)</option>
                        <option value="PREMIUM_TRIENNIAL">Sposi Premium Triennale (€499)</option>
                        <option value="DIAMOND_ANNUAL">Sposi Diamond Annuale (€449)</option>
                        <option value="DIAMOND_TRIENNIAL">Sposi Diamond Triennale (€673,50)</option>
                      </optgroup>
                      <optgroup label="Piani Professionisti">
                        <option value="PRO_FOUNDERS_49">Pro Founders Club (€49)</option>
                        <option value="PRO_ENTRY_120">Pro Entry (€120)</option>
                        <option value="PRO_299">Pro Standard (€299)</option>
                        <option value="PRO_DIAMOND_449">Pro Diamond (€449)</option>
                      </optgroup>
                    </select>
                    {loadingId === u.id && (
                      <div className="mt-1 text-xs text-stone-400">Aggiornamento...</div>
                    )}
                  </td>
                </tr>
              );
            })}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-stone-500">
                  Nessun utente trovato con i filtri selezionati.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
