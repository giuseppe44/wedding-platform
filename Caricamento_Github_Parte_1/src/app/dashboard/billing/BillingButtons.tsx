"use client";

import { useEffect, useTransition, useRef } from "react";
import { createCheckoutSession, createCustomerPortal } from "@/app/stripeActions";
import { CreditCard, ExternalLink } from "lucide-react";

export function BillingButtons({
  planId,
  planLabel,
  priceDisplay,
  hasActiveSubscription,
  autoTrigger = false,
  variant = "primary",
}: {
  planId?: string;
  planLabel?: string;
  priceDisplay?: string;
  hasActiveSubscription: boolean;
  autoTrigger?: boolean;
  variant?: "primary" | "rose" | "amber";
}) {
  const [isPending, startTransition] = useTransition();
  const triggeredRef = useRef(false);

  const handleSubscribe = () => {
    if (!planId) return;
    startTransition(() => {
      createCheckoutSession(planId);
    });
  };

  useEffect(() => {
    if (autoTrigger && planId && !triggeredRef.current) {
      triggeredRef.current = true;
      handleSubscribe();
    }
  }, [autoTrigger, planId]);

  const handlePortal = () => {
    startTransition(() => {
      createCustomerPortal();
    });
  };

  if (hasActiveSubscription) {
    return (
      <button
        onClick={handlePortal}
        disabled={isPending}
        className="w-full bg-stone-100 text-stone-800 border border-stone-300 px-4 py-3 rounded-xl font-medium hover:bg-stone-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <ExternalLink className="w-4 h-4" />
        {isPending ? "Caricamento..." : "Gestisci Fatturazione Stripe"}
      </button>
    );
  }

  const btnColors =
    variant === "rose"
      ? "bg-rose-500 hover:bg-rose-600 text-white"
      : variant === "amber"
      ? "bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold"
      : "bg-stone-900 hover:bg-stone-800 text-white";

  return (
    <button
      onClick={handleSubscribe}
      disabled={isPending || !planId}
      className={`w-full px-5 py-3.5 rounded-xl font-semibold transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 ${btnColors}`}
    >
      <CreditCard className="w-4 h-4" />
      {isPending
        ? "Apertura Checkout Stripe..."
        : planLabel
        ? `${planLabel}${priceDisplay ? ` (${priceDisplay})` : ""}`
        : "Procedi al Pagamento su Stripe"}
    </button>
  );
}
