"use server";

import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function createCheckoutSession(planId: string) {
  const session = await getSession();
  
  if (!session || !session.userId) {
    throw new Error("Devi effettuare l'accesso per poterti abbonare.");
  }

  // Find the plan
  const plan = await prisma.plan.findUnique({
    where: { id: planId }
  });

  if (!plan || !plan.stripePriceId) {
    throw new Error("Piano non trovato o ID Prezzo Stripe mancante.");
  }

  // URL per il redirect post-pagamento
  const appUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Crea la sessione di checkout
  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${appUrl}/dashboard/billing?success=true`,
    cancel_url: `${appUrl}/dashboard/billing?canceled=true`,
    payment_method_types: ["card"],
    mode: "subscription",
    billing_address_collection: "auto",
    line_items: [
      {
        price: plan.stripePriceId,
        quantity: 1,
      },
    ],
    client_reference_id: session.userId, // This binds the checkout to our user
  });

  if (!stripeSession.url) {
    throw new Error("Errore durante la creazione della sessione di pagamento.");
  }

  // Redirect to Stripe checkout
  redirect(stripeSession.url);
}

export async function createCustomerPortal() {
  const session = await getSession();
  
  if (!session || !session.userId) {
    throw new Error("Non autorizzato");
  }

  const sub = await prisma.subscription.findUnique({
    where: { userId: session.userId }
  });

  if (!sub || !sub.stripeCustomerId) {
    throw new Error("Nessun abbonamento attivo trovato.");
  }

  const appUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: `${appUrl}/dashboard/billing`,
  });

  redirect(portalSession.url);
}
