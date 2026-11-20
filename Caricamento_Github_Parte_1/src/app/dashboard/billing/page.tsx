import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { BillingButtons } from "./BillingButtons";
import { PLANS_CATALOG, getCatalogPlan } from "@/lib/plans";
import { verifyAndActivateStripeReturn } from "@/lib/stripeServer";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Sparkles, ShieldCheck, AlertCircle, Heart, Camera } from "lucide-react";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  if (!session || !session.userId) redirect("/login");

  const resolvedParams = await searchParams;
  const successParam = resolvedParams.success === "true";
  const canceledParam = resolvedParams.canceled === "true";
  const setupPendingParam = resolvedParams.setup_pending === "true";
  const planParam = typeof resolvedParams.plan === "string" ? resolvedParams.plan.toUpperCase() : "";
  const sessionIdParam = typeof resolvedParams.session_id === "string" ? resolvedParams.session_id : undefined;
  const autoCheckoutParam = resolvedParams.autocheckout === "true" && !setupPendingParam && !successParam && !canceledParam;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      professionalProfile: true,
    },
  });

  if (!user) redirect("/login");

  // Verifica crittografica su Stripe prima di attivare il piano nel DB (anti-tampering URL)
  let verifiedPaymentSuccess = false;
  if (successParam && planParam) {
    verifiedPaymentSuccess = await verifyAndActivateStripeReturn({
      userId: user.id,
      userEmail: user.email,
      planCode: planParam,
      sessionId: sessionIdParam,
    });
  }

  const isPro = user.role === "PHOTOGRAPHER";

  // Trova lo spazio evento se è una coppia
  let coupleSpaceSlug = "demo-chiara-e-matteo";
  if (!isPro) {
    const wedding = await prisma.timelineItem.findFirst({
      where: {
        OR: [{ coupleId: user.id }, { ownerId: user.id }],
      },
      orderBy: { createdAt: "asc" },
    });
    if (wedding) coupleSpaceSlug = wedding.slug;
  }

  const backUrl = isPro ? "/dashboard" : `/couple/${coupleSpaceSlug}`;
  const backLabel = isPro ? "Torna alla Dashboard Pro" : "Torna al tuo Spazio Evento";

  // Abbonamento attivo
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.userId },
    include: { plan: true },
  });

  const isActive =
    subscription?.status?.toUpperCase() === "ACTIVE" &&
    subscription.plan?.name !== "FREE";

  const activeCatalogPlan = getCatalogPlan(subscription?.plan?.name);
  const selectedPlan = getCatalogPlan(planParam);

  // Filtra i piani del catalogo per il ruolo dell'utente
  const rolePlans = Object.values(PLANS_CATALOG).filter(
    (p) => p.role === (isPro ? "PHOTOGRAPHER" : "COUPLE")
  );

  const showVerifiedSuccessBanner = successParam && (verifiedPaymentSuccess || isActive);

  return (
    <div className="min-h-screen bg-[#faf9f8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* TOP NAVIGATION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <Link
            href={backUrl}
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-stone-900 bg-white px-4 py-2 rounded-full border border-stone-200 shadow-sm w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> {backLabel}
          </Link>
          <div className="text-xs text-stone-500">
            Account: <strong className="text-stone-800">{user.email}</strong>
          </div>
        </div>

        {/* BANNER CONFERMA PAGAMENTO */}
        {showVerifiedSuccessBanner && (
          <div className="mb-8 p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-500 text-white rounded-2xl shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-emerald-950 mb-1">
                  Pagamento completato con successo! 🎉
                </h2>
                <p className="text-sm text-emerald-800">
                  Il tuo piano <strong>{activeCatalogPlan?.name || subscription?.plan?.name || planParam}</strong> è ora{" "}
                  <strong>ATTIVO</strong>. Tutte le funzionalità incluse sono state sbloccate sul tuo spazio.
                </p>
              </div>
            </div>
            <Link
              href={backUrl}
              className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-sm transition-colors"
            >
              Vai al tuo Spazio →
            </Link>
          </div>
        )}

        {/* BANNER PAGAMENTO ANNULLATO */}
        {canceledParam && (
          <div className="mb-8 p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              Il pagamento è stato annullato. Puoi riprovare in qualsiasi momento selezionando uno dei piani qui sotto.
            </span>
          </div>
        )}

        {/* BANNER SE STRIPE NON È ANCORA CONFIGURATO PER QUEL PIANO */}
        {setupPendingParam && (
          <div className="mb-8 p-6 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-sm space-y-2">
            <div className="font-bold text-base flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" /> Configurazione Link Stripe in completamento
            </div>
            <p>
              Il link di pagamento Stripe per il piano <strong>{selectedPlan?.name || planParam}</strong> non è ancora stato inserito nel pannello Amministratore (<code>/admin/settings</code>).
            </p>
            <p className="text-xs text-amber-800">
              Se sei l&apos;amministratore, accedi a <Link href="/admin/settings" className="underline font-bold">/admin/settings</Link> e incolla il Payment Link di Stripe o la Chiave Segreta Stripe. Per assistenza clienti scrivi a <a href="mailto:info@gentiluna.com" className="underline font-bold">info@gentiluna.com</a>.
            </p>
          </div>
        )}

        {/* PIANO PRE-SELEZIONATO DALLA REGISTRAZIONE/PREZZI */}
        {selectedPlan && !successParam && (
          <div className="mb-10 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white shadow-xl border border-rose-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-rose-400">
                <Sparkles className="w-4 h-4" /> Piano Selezionato
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold">
                {selectedPlan.name} — <span className="text-amber-400">{selectedPlan.priceDisplay}</span>
              </h2>
              <p className="text-sm text-stone-300">
                {selectedPlan.subtitle} • {selectedPlan.renewalNote}
              </p>
            </div>
            <div className="w-full md:w-auto min-w-[260px]">
              <BillingButtons
                planId={selectedPlan.code}
                planLabel="Completa Pagamento Ora"
                priceDisplay={selectedPlan.priceDisplay}
                hasActiveSubscription={false}
                autoTrigger={autoCheckoutParam}
                variant={isPro ? "amber" : "rose"}
              />
            </div>
          </div>
        )}

        {/* HEADER PAGINA */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-rose-600 mb-2">
              {isPro ? <Camera className="w-4 h-4 text-amber-500" /> : <Heart className="w-4 h-4 text-rose-500" />}
              {isPro ? "Area Professionisti & Partner" : "Area Sposi & Eventi"}
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-stone-900 mb-2">
              Piani, Attivazione e Fatturazione
            </h1>
            <p className="text-stone-600">
              {isPro
                ? "Scegli o gestisci il tuo abbonamento professionale per ricevere contatti e gestire eventi."
                : "Attiva o aggiorna il piano del tuo evento per sbloccare spazio, capitoli, tavoli e condivisione live."}
            </p>
          </div>

          {/* STATO ATTUALE CARD COMPATTA */}
          <div className="bg-white px-6 py-4 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-stone-400">Il tuo Piano Attuale</div>
              <div className="text-lg font-bold text-stone-900">
                {isActive
                  ? activeCatalogPlan?.name || subscription?.plan?.name
                  : "Account Registrato (In attesa di attivazione piano)"}
              </div>
              {isActive && subscription?.currentPeriodEnd && (
                <div className="text-xs text-emerald-600 font-semibold">
                  Valido fino al: {new Date(subscription.currentPeriodEnd).toLocaleDateString("it-IT")}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* GRIGLIA PIANI DISPONIBILI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rolePlans.map((plan) => {
            const isCurrentPlan = isActive && subscription?.plan?.name === plan.code;
            const isHighlighted =
              plan.code === "PREMIUM_ANNUAL" ||
              plan.code === "PREMIUM_TRIENNIAL" ||
              plan.code === "PRO_FOUNDERS_49" ||
              plan.code === "PRO_299";

            return (
              <div
                key={plan.code}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all relative ${
                  isHighlighted
                    ? "bg-stone-900 text-white border-2 border-rose-500/60 shadow-xl"
                    : "bg-white text-stone-900 border border-stone-200 shadow-sm"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 right-6 bg-rose-500 text-white text-[11px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-serif font-bold mb-1">{plan.name}</h3>
                  <p className={`text-xs mb-5 ${isHighlighted ? "text-stone-400" : "text-stone-500"}`}>
                    {plan.subtitle}
                  </p>

                  <div className="mb-1">
                    <span className="text-4xl font-serif font-bold">{plan.priceDisplay}</span>
                    <span className={`text-xs ml-1.5 ${isHighlighted ? "text-stone-400" : "text-stone-500"}`}>
                      ({plan.periodLabel})
                    </span>
                  </div>
                  <p
                    className={`text-xs mb-6 pb-4 border-b ${
                      isHighlighted
                        ? "text-amber-300 border-stone-800"
                        : "text-stone-500 border-stone-100"
                    }`}
                  >
                    {plan.renewalNote}
                  </p>

                  <ul className="space-y-3 mb-8 text-sm">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            isHighlighted ? "text-emerald-400" : "text-emerald-600"
                          }`}
                        />
                        <span className={isHighlighted ? "text-stone-200" : "text-stone-700"}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {isCurrentPlan ? (
                  <div className="w-full py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-center font-bold text-sm">
                    ✓ Piano Attualmente Attivo
                  </div>
                ) : (
                  <BillingButtons
                    planId={plan.code}
                    planLabel="Attiva Ora"
                    priceDisplay={plan.priceDisplay}
                    hasActiveSubscription={false}
                    variant={isHighlighted ? (isPro ? "amber" : "rose") : "primary"}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* FOOTER SICUREZZA */}
        <div className="mt-12 p-6 bg-white rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              Transazioni crittografate SSL a 256-bit gestite direttamente da <strong>Stripe</strong>. GentiLuna non memorizza i dati della tua carta di credito.
            </span>
          </div>
          <div>
            Hai bisogno di supporto o fattura? Scrivi a{" "}
            <a href="mailto:info@gentiluna.com" className="underline font-semibold text-stone-800">
              info@gentiluna.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
