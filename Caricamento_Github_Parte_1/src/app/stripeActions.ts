"use server";

import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getSession, requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { PLANS_CATALOG, getCatalogPlan } from "@/lib/plans";
import {
  ensureCatalogPlansInDb,
  getServerStripeConfig,
  MASKED_SECRET_PLACEHOLDER,
} from "@/lib/stripeServer";
import { revalidatePath } from "next/cache";

/**
 * Salva dal pannello Admin i Link di Pagamento Stripe (Payment Links) o le chiavi API Stripe.
 * Protetto rigorosamente dal ruolo ADMIN. Preserva i segreti già salvati se il campo mostra il placeholder mascherato.
 */
export async function saveStripeAdminConfig(data: {
  links: Record<string, string>;
  secretKey?: string;
  publishableKey?: string;
  webhookSecret?: string;
}) {
  await requireAuth(["ADMIN"]);
  await ensureCatalogPlansInDb();

  for (const [planCode, linkOrPriceId] of Object.entries(data.links)) {
    if (!PLANS_CATALOG[planCode]) continue;
    await prisma.plan.update({
      where: { name: planCode },
      data: { stripePriceId: linkOrPriceId.trim() || null },
    });
  }

  if (
    data.secretKey !== undefined ||
    data.publishableKey !== undefined ||
    data.webhookSecret !== undefined
  ) {
    const current = await getServerStripeConfig();

    const nextSecretKey =
      data.secretKey === MASKED_SECRET_PLACEHOLDER
        ? current.secretKey
        : data.secretKey?.trim() ?? current.secretKey;

    const nextWebhookSecret =
      data.webhookSecret === MASKED_SECRET_PLACEHOLDER
        ? current.webhookSecret
        : data.webhookSecret?.trim() ?? current.webhookSecret;

    const nextPublishableKey = data.publishableKey?.trim() || current.publishableKey;

    await prisma.plan.upsert({
      where: { name: "__STRIPE_KEYS__" },
      update: {
        features: JSON.stringify({
          secretKey: nextSecretKey,
          publishableKey: nextPublishableKey,
          webhookSecret: nextWebhookSecret,
        }),
      },
      create: {
        name: "__STRIPE_KEYS__",
        price: 0,
        interval: "none",
        features: JSON.stringify({
          secretKey: nextSecretKey,
          publishableKey: nextPublishableKey,
          webhookSecret: nextWebhookSecret,
        }),
      },
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/settings");
  revalidatePath("/dashboard/billing");
  revalidatePath("/prezzi");
  revalidatePath("/professionisti");
}

/**
 * Avvia il pagamento per un piano (supporta sia Stripe Payment Links che Stripe Checkout dinamico)
 */
export async function createCheckoutSession(planCodeOrId: string) {
  const session = await getSession();

  if (!session || !session.userId) {
    redirect(`/login?mode=REGISTER&plan=${encodeURIComponent(planCodeOrId)}`);
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) {
    redirect(`/login?mode=REGISTER&plan=${encodeURIComponent(planCodeOrId)}`);
  }

  await ensureCatalogPlansInDb();

  let dbPlan = await prisma.plan.findUnique({ where: { name: planCodeOrId.toUpperCase() } });
  if (!dbPlan) {
    dbPlan = await prisma.plan.findUnique({ where: { id: planCodeOrId } });
  }

  const catalogPlan = getCatalogPlan(dbPlan?.name || planCodeOrId);
  const planCode = catalogPlan?.code || dbPlan?.name || "PREMIUM_ANNUAL";

  const envLink =
    process.env[`STRIPE_LINK_${planCode}`] || process.env[`NEXT_PUBLIC_STRIPE_LINK_${planCode}`];
  const configuredTarget = dbPlan?.stripePriceId?.trim() || envLink?.trim() || "";

  // CASO 1: Stripe Payment Link diretto (https://buy.stripe.com/...)
  if (configuredTarget.startsWith("http://") || configuredTarget.startsWith("https://")) {
    const urlObj = new URL(configuredTarget);
    urlObj.searchParams.set("client_reference_id", `${user.id}__${planCode}`);
    if (user.email) {
      urlObj.searchParams.set("prefilled_email", user.email);
    }
    redirect(urlObj.toString());
  }

  const headersList = await headers();
  const host =
    headersList.get("x-forwarded-host") || headersList.get("host") || "www.gentiluna.com";
  const protocol = host.includes("localhost") ? "http" : "https";
  const appUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

  const adminStripe = await getServerStripeConfig();
  const activeSecretKey = adminStripe.activeSecretKey;

  if (!activeSecretKey) {
    redirect(`/dashboard/billing?plan=${encodeURIComponent(planCode)}&setup_pending=true`);
  }

  const stripeClient = new Stripe(activeSecretKey, {
    apiVersion: "2023-10-16" as any,
  });

  // CASO 2: Price ID di Stripe (price_...)
  if (configuredTarget.startsWith("price_")) {
    const stripeSession = await stripeClient.checkout.sessions.create({
      success_url: `${appUrl}/dashboard/billing?success=true&plan=${encodeURIComponent(planCode)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/dashboard/billing?canceled=true&plan=${encodeURIComponent(planCode)}`,
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: user.email || undefined,
      billing_address_collection: "auto",
      line_items: [{ price: configuredTarget, quantity: 1 }],
      client_reference_id: `${user.id}__${planCode}`,
      metadata: {
        userId: user.id,
        planCode,
      },
    });

    if (stripeSession.url) {
      redirect(stripeSession.url);
    }
  }

  // CASO 3: Creazione automatica del Checkout Stripe con l'importo esatto del piano
  const amountCents = catalogPlan ? catalogPlan.priceCents : dbPlan?.price || 14900;
  const productName = catalogPlan
    ? `GentiLuna - ${catalogPlan.name}`
    : `GentiLuna - Piano ${planCode}`;
  const productDesc = catalogPlan
    ? `${catalogPlan.subtitle} (${catalogPlan.renewalNote})`
    : "Attivazione piano GentiLuna";

  const stripeSession = await stripeClient.checkout.sessions.create({
    success_url: `${appUrl}/dashboard/billing?success=true&plan=${encodeURIComponent(planCode)}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/dashboard/billing?canceled=true&plan=${encodeURIComponent(planCode)}`,
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: user.email || undefined,
    billing_address_collection: "auto",
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: productName,
            description: productDesc,
          },
          unit_amount: amountCents,
        },
        quantity: 1,
      },
    ],
    client_reference_id: `${user.id}__${planCode}`,
    metadata: {
      userId: user.id,
      planCode,
    },
  });

  if (!stripeSession.url) {
    throw new Error("Errore durante la creazione della sessione di pagamento Stripe.");
  }

  redirect(stripeSession.url);
}

export async function createCustomerPortal() {
  const session = await getSession();

  if (!session || !session.userId) {
    throw new Error("Non autorizzato");
  }

  const sub = await prisma.subscription.findUnique({
    where: { userId: session.userId },
  });

  if (!sub || !sub.stripeCustomerId) {
    redirect("/dashboard/billing");
  }

  const adminStripe = await getServerStripeConfig();
  if (!adminStripe.activeSecretKey) {
    redirect("/dashboard/billing");
  }

  const stripeClient = new Stripe(adminStripe.activeSecretKey, {
    apiVersion: "2023-10-16" as any,
  });

  const appUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.gentiluna.com";

  const portalSession = await stripeClient.billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: `${appUrl}/dashboard/billing`,
  });

  redirect(portalSession.url);
}
