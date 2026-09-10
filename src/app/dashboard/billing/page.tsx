import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { BillingButtons } from "./BillingButtons";

export default async function BillingPage() {
  const session = await getSession();
  if (!session || !session.userId) redirect("/login");

  // Verify it's a professional
  const profile = await prisma.professionalProfile.findUnique({
    where: { userId: session.userId }
  });

  if (!profile) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-serif text-stone-800 mb-4">Abbonamenti</h1>
        <p className="text-stone-600">Questa sezione è riservata ai Professionisti del settore. Devi creare un profilo professionale per visualizzare i piani.</p>
      </div>
    );
  }

  // Get active subscription
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.userId },
    include: { plan: true }
  });

  const isActive = subscription?.status === "active";

  // Get available plans (ideally from DB)
  // For MVP, we'll fetch the first premium plan
  const plans = await prisma.plan.findMany({
    where: { price: { gt: 0 } },
    orderBy: { price: 'asc' }
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-serif text-stone-800 mb-2">Piani e Fatturazione</h1>
        <p className="text-stone-600">Gestisci il tuo abbonamento e la visibilità del tuo profilo professionale.</p>
        
        {!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm">
            <strong>Modalità Demo:</strong> I pagamenti non sono ancora attivi. La configurazione di Stripe sarà completata prima del lancio ufficiale.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* CURRENT STATUS */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-2">Stato Attuale</h2>
            <div className="text-2xl font-bold text-stone-800 mb-4">
              {isActive ? subscription.plan?.name : "Piano Base Gratuito"}
            </div>
            {isActive && (
              <p className="text-sm text-emerald-600 font-medium mb-4">
                Abbonamento Attivo (Scadenza: {subscription.currentPeriodEnd?.toLocaleDateString()})
              </p>
            )}
            {!isActive && (
              <ul className="space-y-3 mb-6 text-sm text-stone-600">
                <li>• Nessuna visibilità in evidenza</li>
                <li>• Limite di servizi inseribili</li>
                <li>• I clienti non vedono i contatti diretti</li>
              </ul>
            )}
          </div>
          
          {isActive && (
            <BillingButtons hasActiveSubscription={true} />
          )}
        </div>

        {/* UPGRADE OPTIONS */}
        {!isActive && plans.map(plan => (
          <div key={plan.id} className="bg-stone-50 p-6 rounded-2xl border-2 border-stone-800 shadow-md relative flex flex-col justify-between">
            <div className="absolute top-0 right-0 bg-stone-800 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
              CONSIGLIATO
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-800 mb-2">{plan.name}</h2>
              <div className="text-3xl font-serif text-stone-900 mb-6">
                €{plan.price}<span className="text-sm text-stone-500 font-sans">/{plan.interval === 'month' ? 'mese' : 'anno'}</span>
              </div>
              
              <ul className="space-y-3 mb-8 text-sm text-stone-700 font-medium">
                <li>✓ Posizionamento in evidenza</li>
                <li>✓ Servizi illimitati</li>
                <li>✓ Recapiti diretti sbloccati</li>
                <li>✓ Ricevi contatti dalle coppie</li>
              </ul>
            </div>
            
            <BillingButtons planId={plan.id} hasActiveSubscription={false} />
          </div>
        ))}
      </div>
    </div>
  );
}
