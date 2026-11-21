"use client";

import { useEffect, useTransition, useRef } from "react";
import { createCheckoutSession, createCustomerPortal } from "@/app/stripeActions";
import { CreditCard, ExternalLink, Loader2 } from "lucide-react";

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
        className={`w-full px-4 py-3.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 whitespace-normal text-center leading-snug ${
          isPending
            ? "bg-stone-900 text-white border border-stone-900 disabled:opacity-95 text-sm"
            : "bg-stone-100 text-stone-800 border border-stone-300 hover:bg-stone-200 text-sm sm:text-base"
        }`}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0 text-white" />
        ) : (
          <ExternalLink className="w-4 h-4 shrink-0" />
        )}
        <span>{isPending ? "Reindirizzamento..." : "Gestisci Fatturazione Stripe"}</span>
      </button>
    );
  }

  const btnColors =
    isPending
      ? "bg-stone-900 text-white border border-amber-400/50 disabled:opacity-95 text-xs sm:text-sm"
      : variant === "rose"
      ? "bg-rose-500 hover:bg-rose-600 text-white text-sm sm:text-base"
      : variant === "amber"
      ? "bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm sm:text-base"
      : "bg-stone-900 hover:bg-stone-800 text-white text-sm sm:text-base";

  return (
    <button
      onClick={handleSubscribe}
      disabled={isPending || !planId}
      className={`w-full min-h-12 px-4 sm:px-5 py-3.5 rounded-xl font-semibold transition-all shadow-md flex items-center justify-center gap-2 whitespace-normal text-center leading-snug cursor-pointer ${btnColors}`}
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0 text-white" />
      ) : (
        <CreditCard className="w-4 h-4 shrink-0" />
      )}
      <span>
        {isPending
          ? "Reindirizzamento..."
          : planLabel
          ? `${planLabel}${priceDisplay ? ` (${priceDisplay})` : ""}`
          : "Procedi al Pagamento su Stripe"}
      </span>
    </button>
  );
}
