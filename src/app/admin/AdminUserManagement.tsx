"use client";

import { useState } from "react";
import { updateUserPlan } from "@/app/adminActions";
import { Button } from "@/components/ui/button";

export default function AdminUserManagement({ users }: { users: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

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

  return (
    <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm mt-8">
      <h2 className="text-xl font-semibold text-stone-800 mb-6">Gestione Utenti e Piani (Upgrade)</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-stone-200">
              <th className="pb-3 text-sm font-medium text-stone-500">Utente / Attività</th>
              <th className="pb-3 text-sm font-medium text-stone-500">Ruolo</th>
              <th className="pb-3 text-sm font-medium text-stone-500">Piano Attuale</th>
              <th className="pb-3 text-sm font-medium text-stone-500">Azioni (Cambia Piano)</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => {
              const currentPlan = u.Subscription?.[0]?.plan?.name || "FREE";
              const isPro = u.role === "PHOTOGRAPHER";
              return (
                <tr key={u.id} className="border-b border-stone-100 last:border-0">
                  <td className="py-4">
                    <div className="font-medium text-stone-800">
                      {isPro ? u.professionalProfile?.businessName || u.name : u.name}
                    </div>
                    <div className="text-xs text-stone-500">{u.email}</div>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${isPro ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"}`}>
                      {isPro ? "PROFESSIONISTA" : "SPOSI"}
                    </span>
                  </td>
                  <td className="py-4 font-bold text-stone-700">
                    {currentPlan}
                  </td>
                  <td className="py-4">
                    <select
                      className="border border-stone-300 rounded-md p-2 text-sm bg-stone-50 disabled:opacity-50"
                      value={currentPlan}
                      disabled={loadingId === u.id}
                      onChange={(e) => handlePlanChange(u.id, e.target.value)}
                    >
                      <option value="FREE">FREE</option>
                      <option value="PREMIUM">PRO / PREMIUM</option>
                      <option value="DIAMOND">DIAMOND / WHITE-LABEL</option>
                    </select>
                    {loadingId === u.id && <span className="ml-2 text-xs text-stone-400">Aggiornamento...</span>}
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-center text-stone-500">Nessun utente trovato.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
