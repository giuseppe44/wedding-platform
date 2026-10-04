"use client";
import { useState } from "react";
import { updateSystemConfig } from "../settingsActions";
import { Mail, Save } from "lucide-react";

export default function SettingsClient({ initialConfig }: { initialConfig: any }) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [form, setForm] = useState({
    smtpHost: initialConfig.smtpHost || "",
    smtpPort: initialConfig.smtpPort || "587",
    smtpUser: initialConfig.smtpUser || "",
    smtpPass: initialConfig.smtpPass || "",
    senderEmail: initialConfig.senderEmail || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSystemConfig(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert("Errore durante il salvataggio");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-stone-200 p-8">
      <div className="flex items-center gap-3 mb-6 border-b border-stone-100 pb-4">
        <Mail className="w-6 h-6 text-stone-700" />
        <h2 className="text-xl font-semibold text-stone-800">Configurazione SMTP (Mailtrap / Email)</h2>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Host SMTP</label>
            <input 
              name="smtpHost" value={form.smtpHost} onChange={handleChange}
              placeholder="es. sandbox.smtp.mailtrap.io"
              className="w-full border border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Porta SMTP</label>
            <input 
              name="smtpPort" value={form.smtpPort} onChange={handleChange}
              placeholder="es. 587"
              className="w-full border border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Username SMTP</label>
            <input 
              name="smtpUser" value={form.smtpUser} onChange={handleChange}
              placeholder="Username"
              className="w-full border border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Password SMTP</label>
            <input 
              type="password" name="smtpPass" value={form.smtpPass} onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-stone-100">
          <label className="text-sm font-medium text-stone-700">Email Mittente (Da cui partono le email)</label>
          <input 
            name="senderEmail" value={form.senderEmail} onChange={handleChange}
            placeholder="es. info@ecos.com"
            className="w-full border border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 outline-none max-w-md block"
          />
          <p className="text-xs text-stone-500">Queste impostazioni sovrascriveranno quelle nel file .env (se presenti).</p>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-stone-800 disabled:opacity-50 transition-all"
        >
          <Save className="w-5 h-5" />
          {loading ? "Salvataggio..." : saved ? "Salvato! ✓" : "Salva Impostazioni"}
        </button>
      </form>
    </div>
  );
}
