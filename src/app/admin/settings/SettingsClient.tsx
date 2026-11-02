"use client";

import { useState } from "react";
import { updateSystemConfig } from "../settingsActions";
import { saveStripeAdminConfig } from "@/app/stripeActions";
import { PLANS_CATALOG } from "@/lib/plans";
import { Mail, Save, CreditCard, CheckCircle2, KeyRound, Link2 } from "lucide-react";

export default function SettingsClient({
  initialConfig,
  initialStripeConfig,
}: {
  initialConfig: any;
  initialStripeConfig: {
    links: Record<string, string>;
    secretKey: string;
    publishableKey: string;
    webhookSecret: string;
    hasEnvSecretKey: boolean;
  };
}) {
  const [loadingSmtp, setLoadingSmtp] = useState(false);
  const [savedSmtp, setSavedSmtp] = useState(false);

  const [loadingStripe, setLoadingStripe] = useState(false);
  const [savedStripe, setSavedStripe] = useState(false);

  const [form, setForm] = useState({
    smtpHost: initialConfig.smtpHost || "",
    smtpPort: initialConfig.smtpPort || "587",
    smtpUser: initialConfig.smtpUser || "",
    smtpPass: initialConfig.smtpPass || "",
    senderEmail: initialConfig.senderEmail || "",
  });

  const [stripeLinks, setStripeLinks] = useState<Record<string, string>>(
    initialStripeConfig.links || {}
  );
  const [secretKey, setSecretKey] = useState(initialStripeConfig.secretKey || "");
  const [publishableKey, setPublishableKey] = useState(initialStripeConfig.publishableKey || "");
  const [webhookSecret, setWebhookSecret] = useState(initialStripeConfig.webhookSecret || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSaveSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSmtp(true);
    try {
      await updateSystemConfig(form);
      setSavedSmtp(true);
      setTimeout(() => setSavedSmtp(false), 3000);
    } catch {
      alert("Errore durante il salvataggio SMTP");
    }
    setLoadingSmtp(false);
  };

  const handleSaveStripe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingStripe(true);
    try {
      await saveStripeAdminConfig({
        links: stripeLinks,
        secretKey,
        publishableKey,
        webhookSecret,
      });
      setSavedStripe(true);
      setTimeout(() => setSavedStripe(false), 3000);
    } catch {
      alert("Errore durante il salvataggio configurazione Stripe");
    }
    setLoadingStripe(false);
  };

  const couplePlans = Object.values(PLANS_CATALOG).filter((p) => p.role === "COUPLE");
  const proPlans = Object.values(PLANS_CATALOG).filter((p) => p.role === "PHOTOGRAPHER");

  return (
    <div className="space-y-10">
      {/* SEZIONE 1: PAGAMENTI STRIPE */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-stone-200 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4 border-b border-stone-100 pb-4">
          <CreditCard className="w-6 h-6 text-rose-500" />
          <div>
            <h2 className="text-xl font-semibold text-stone-800">
              Configurazione Pagamenti Stripe (Payment Links & Chiavi API)
            </h2>
            <p className="text-xs text-stone-500">
              Puoi incollare i Link di Pagamento Stripe (<code>https://buy.stripe.com/...</code>) per ogni piano oppure inserire la Chiave Segreta Stripe (<code>sk_live_...</code>) per generare i pagamenti in automatico.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveStripe} className="space-y-8">
          {/* OPZIONE RAPIDA: CHIAVI API STRIPE */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
            <div className="flex items-center gap-2 font-bold text-stone-800 text-sm">
              <KeyRound className="w-4 h-4 text-amber-600" /> Modalità Automatica (Consigliata): Chiavi API Stripe
            </div>
            <p className="text-xs text-stone-600">
              Inserendo la <strong>Stripe Secret Key</strong> (<code>sk_live_...</code> o <code>sk_test_...</code>), GentiLuna crea automaticamente il Checkout Stripe con l&apos;importo esatto per tutti i 10 piani, anche senza creare i singoli Payment Link!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Stripe Secret Key (sk_live_... / sk_test_...)
                </label>
                <input
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="sk_live_..."
                  className="w-full border border-stone-200 bg-white rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Stripe Publishable Key (pk_live_...)
                </label>
                <input
                  type="text"
                  value={publishableKey}
                  onChange={(e) => setPublishableKey(e.target.value)}
                  placeholder="pk_live_..."
                  className="w-full border border-stone-200 bg-white rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Webhook Secret (whsec_... opzionale)
                </label>
                <input
                  type="password"
                  value={webhookSecret}
                  onChange={(e) => setWebhookSecret(e.target.value)}
                  placeholder="whsec_..."
                  className="w-full border border-stone-200 bg-white rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* LINK DI PAGAMENTO PER SINGOLO PIANO */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 font-bold text-stone-800 text-sm">
              <Link2 className="w-4 h-4 text-rose-500" /> Link di Pagamento Diretti (Stripe Payment Links per singolo piano)
            </div>
            <p className="text-xs text-stone-500 -mt-4">
              Se preferisci usare i <strong>Payment Links</strong> creati nella dashboard di Stripe, incolla qui sotto l&apos;URL <code>https://buy.stripe.com/...</code> corrispondente a ciascun piano.
            </p>

            {/* PIANI SPOSI */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-600 mb-3">
                Piani Sposi & Eventi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {couplePlans.map((plan) => (
                  <div key={plan.code} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-stone-800">{plan.name}</label>
                      <span className="text-xs font-bold bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full">
                        {plan.priceDisplay}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Redirect post-pagamento consigliato:{" "}
                      <code className="bg-stone-200/70 px-1 rounded">
                        https://www.gentiluna.com/dashboard/billing?success=true&plan={plan.code}
                      </code>
                    </p>
                    <input
                      type="text"
                      value={stripeLinks[plan.code] || ""}
                      onChange={(e) =>
                        setStripeLinks({ ...stripeLinks, [plan.code]: e.target.value })
                      }
                      placeholder="https://buy.stripe.com/... (oppure price_...)"
                      className="w-full border border-stone-200 bg-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* PIANI PROFESSIONISTI */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600 mb-3">
                Piani Professionisti
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {proPlans.map((plan) => (
                  <div key={plan.code} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-stone-800">{plan.name}</label>
                      <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                        {plan.priceDisplay}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Redirect post-pagamento consigliato:{" "}
                      <code className="bg-stone-200/70 px-1 rounded">
                        https://www.gentiluna.com/dashboard/billing?success=true&plan={plan.code}
                      </code>
                    </p>
                    <input
                      type="text"
                      value={stripeLinks[plan.code] || ""}
                      onChange={(e) =>
                        setStripeLinks({ ...stripeLinks, [plan.code]: e.target.value })
                      }
                      placeholder="https://buy.stripe.com/... (oppure price_...)"
                      className="w-full border border-stone-200 bg-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loadingStripe}
            className="flex items-center gap-2 bg-rose-500 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-rose-600 disabled:opacity-50 transition-all shadow-md"
          >
            {savedStripe ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            {loadingStripe
              ? "Salvataggio Stripe in corso..."
              : savedStripe
              ? "Configurazione Stripe Salvata! ✓"
              : "Salva Configurazione Stripe"}
          </button>
        </form>
      </div>

      {/* SEZIONE 2: CONFIGURAZIONE SMTP */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-stone-200 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-stone-100 pb-4">
          <Mail className="w-6 h-6 text-stone-700" />
          <h2 className="text-xl font-semibold text-stone-800">Configurazione SMTP (Email di Sistema)</h2>
        </div>

        <form onSubmit={handleSaveSmtp} className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Host SMTP</label>
              <input
                name="smtpHost"
                value={form.smtpHost}
                onChange={handleChange}
                placeholder="es. smtp.register.it"
                className="w-full border border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Porta SMTP</label>
              <input
                name="smtpPort"
                value={form.smtpPort}
                onChange={handleChange}
                placeholder="es. 587"
                className="w-full border border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Username SMTP</label>
              <input
                name="smtpUser"
                value={form.smtpUser}
                onChange={handleChange}
                placeholder="info@gentiluna.com"
                className="w-full border border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Password SMTP</label>
              <input
                type="password"
                name="smtpPass"
                value={form.smtpPass}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full border border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-stone-100">
            <label className="text-sm font-medium text-stone-700">
              Email Mittente (Da cui partono le email)
            </label>
            <input
              name="senderEmail"
              value={form.senderEmail}
              onChange={handleChange}
              placeholder="es. info@gentiluna.com"
              className="w-full border border-stone-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 outline-none max-w-md block"
            />
          </div>

          <button
            type="submit"
            disabled={loadingSmtp}
            className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-stone-800 disabled:opacity-50 transition-all"
          >
            <Save className="w-5 h-5" />
            {loadingSmtp ? "Salvataggio..." : savedSmtp ? "Salvato! ✓" : "Salva Impostazioni SMTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
