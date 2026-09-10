"use client";

import { useTransition } from "react";
import { createCheckoutSession, createCustomerPortal } from "@/app/stripeActions";

export function BillingButtons({ planId, hasActiveSubscription }: { planId?: string, hasActiveSubscription: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleSubscribe = () => {
    if (!planId) return;
    startTransition(() => {
      createCheckoutSession(planId);
    });
  };

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
        className="w-full bg-stone-100 text-stone-800 border border-stone-300 px-4 py-2 rounded-xl font-medium hover:bg-stone-200 transition-colors disabled:opacity-50"
      >
        {isPending ? "Caricamento..." : "Gestisci Abbonamento"}
      </button>
    );
  }

  return (
    <button 
      onClick={handleSubscribe}
      disabled={isPending || !planId}
      className="w-full bg-stone-900 text-white px-4 py-2 rounded-xl font-medium hover:bg-stone-800 transition-colors shadow-md disabled:opacity-50"
    >
      {isPending ? "Reindirizzamento..." : "Passa a Premium"}
    </button>
  );
}
