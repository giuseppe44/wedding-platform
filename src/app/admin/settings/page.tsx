import { requireAuth } from "@/lib/auth";
import { getSystemConfig } from "../settingsActions";
import { getStripeAdminConfig } from "@/app/stripeActions";
import SettingsClient from "./SettingsClient";
import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";

export default async function SettingsPage() {
  await requireAuth(["ADMIN"]);
  const config = await getSystemConfig();
  const stripeConfig = await getStripeAdminConfig();

  return (
    <div className="min-h-screen bg-stone-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="p-2 hover:bg-stone-200 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-stone-600" />
          </Link>
          <h1 className="text-3xl font-serif text-stone-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-rose-500" /> Impostazioni di Sistema & Stripe
          </h1>
        </div>

        <SettingsClient initialConfig={config} initialStripeConfig={stripeConfig} />
      </div>
    </div>
  );
}
