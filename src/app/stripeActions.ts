"use server";

import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getSession, requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { PLANS_CATALOG, getCatalogPlan } from "@/lib/plans";
import { BASE_FEATURES, PREMIUM_FEATURES, DIAMOND_FEATURES } from "@/lib/entitlementHelper";
import { revalidatePath } from "next/cache";

function getFeaturesForTier(tier: "BASE" | "PREMIUM" | "DIAMOND") {
  if (tier === "DIAMOND") return JSON.stringify(DIAMOND_FEATURES);
  if (tier === "PREMIUM") return JSON.stringify(PREMIUM_FEATURES);
  return JSON.stringify(BASE_FEATURES);
}

/**
 * Assicura che tutti i piani del catalogo esistano nella tabella Plan del DB
 */
export async function ensureCatalogPlansInDb() {
  for (const plan of Object.values(PLANS_CATALOG)) {
    await prisma.plan.upsert({
      where: { name: plan.code },
      update: {
        price: plan.priceCents,
        interval: plan.isTriennial ? "3years" : "year",
        features: getFeaturesForTier(plan.tier),
      },
      create: {
        name: plan.code,
        price: plan.priceCents,
        interval: plan.isTriennial ? "3years" : "year",
        features: getFeaturesForTier(plan.tier),
      },
    });
  }
}

/**
 * Legge la configurazione Stripe salvata da Admin (Payment Links + eventuali chiavi API)
 */
export async function getStripeAdminConfig() {
  await ensureCatalogPlansInDb();
  const plans = await prisma.plan.findMany();
  const links: Record<string, string> = {};
  for (const p of plans) {
    if (p.stripePriceId) {
      links[p.name] = p.stripePriceId;
    }
  }

  let secretKey = "";
  let publishableKey = "pk_live_51NlK6iAuYhdNmyvmNtSkYPOi3lO9Gk8IljYOquHzm9QBfshj9f9hMRrszC4mfEymiqdgCgFVb7YDnOnghh1FW4AW00c4UXZQpk";
  let webhookSecret = "";
  const configRow = plans.find((p) => p.name === "__STRIPE_KEYS__");
  if (configRow?.features) {
    try {
      const parsed = JSON.parse(configRow.features);
      secretKey = parsed.secretKey || "";
      publishableKey = parsed.publishableKey || publishableKey;
      webhookSecret = parsed.webhookSecret || "";
    } catch {}
  }

  return {
    links,
    secretKey,
    publishableKey,
    webhookSecret,
    hasEnvSecretKey: !!(process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes("placeholder")),
  };
}

/**
 * Salva dal pannello Admin i Link di Pagamento Stripe (Payment Links) o le chiavi API Stripe
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

  if (data.secretKey !== undefined || data.publishableKey !== undefined || data.webhookSecret !== undefined) {
    await prisma.plan.upsert({
      where: { name: "__STRIPE_KEYS__" },
      update: {
        features: JSON.stringify({
          secretKey: data.secretKey?.trim() || "",
          publishableKey: data.publishableKey?.trim() || "",
          webhookSecret: data.webhookSecret?.trim() || "",
        }),
      },
      create: {
        name: "__STRIPE_KEYS__",
        price: 0,
        interval: "none",
        features: JSON.stringify({
          secretKey: data.secretKey?.trim() || "",
          publishableKey: data.publishableKey?.trim() || "",
          webhookSecret: data.webhookSecret?.trim() || "",
        }),
      },
    });
  }

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

  // Trova il piano per codice (es. PREMIUM_ANNUAL) o per id nel DB
  let dbPlan = await prisma.plan.findUnique({ where: { name: planCodeOrId.toUpperCase() } });
  if (!dbPlan) {
    dbPlan = await prisma.plan.findUnique({ where: { id: planCodeOrId } });
  }

  const catalogPlan = getCatalogPlan(dbPlan?.name || planCodeOrId);
  const planCode = catalogPlan?.code || dbPlan?.name || "PREMIUM_ANNUAL";

  // Controlla se esiste un Payment Link configurato nel DB o nelle variabili d'ambiente
  const envLink = process.env[`STRIPE_LINK_${planCode}`] || process.env[`NEXT_PUBLIC_STRIPE_LINK_${planCode}`];
  const configuredTarget = dbPlan?.stripePriceId?.trim() || envLink?.trim() || "";

  // CASO 1: È stato inserito un Link di Pagamento Stripe (https://buy.stripe.com/...)
  if (configuredTarget.startsWith("http://") || configuredTarget.startsWith("https://")) {
    const urlObj = new URL(configuredTarget);
    urlObj.searchParams.set("client_reference_id", `${user.id}__${planCode}`);
    if (user.email) {
      urlObj.searchParams.set("prefilled_email", user.email);
    }
    redirect(urlObj.toString());
  }

  // Determina l'URL base del sito
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host") || "www.gentiluna.com";
  const protocol = host.includes("localhost") ? "http" : "https";
  const appUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

  // Determina la chiave segreta Stripe (da DB Admin oppure da variabile d'ambiente Vercel)
  const adminStripe = await getStripeAdminConfig();
  const activeSecretKey =
    adminStripe.secretKey ||
    (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes("placeholder")
      ? process.env.STRIPE_SECRET_KEY
      : "");

  if (!activeSecretKey) {
    redirect(`/dashboard/billing?plan=${encodeURIComponent(planCode)}&setup_pending=true`);
  }

  const stripeClient = new Stripe(activeSecretKey, {
    apiVersion: "2023-10-16" as any,
  });

  // CASO 2: È stato configurato un Price ID di Stripe (price_...)
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

  // CASO 3: Creazione automatica del Checkout Stripe con l'importo esatto del piano (senza bisogno di creare Price ID a mano!)
  const amountCents = catalogPlan ? catalogPlan.priceCents : dbPlan?.price || 14900;
  const productName = catalogPlan ? `GentiLuna - ${catalogPlan.name}` : `GentiLuna - Piano ${planCode}`;
  const productDesc = catalogPlan ? `${catalogPlan.subtitle} (${catalogPlan.renewalNote})` : "Attivazione piano GentiLuna";

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

/**
 * Attiva il piano nel DB per un utente (chiamato al ritorno dal pagamento con successo o dal webhook)
 */
export async function activateUserPlanInDb(userId: string, planCode: string, stripeCustomerId?: string, stripeSubscriptionId?: string) {
  await ensureCatalogPlansInDb();
  const catalogPlan = getCatalogPlan(planCode) || PLANS_CATALOG.PREMIUM_ANNUAL;

  const dbPlan = await prisma.plan.findUnique({ where: { name: catalogPlan.code } });
  if (!dbPlan) return;

  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + (catalogPlan.durationMonths || 12));

  await prisma.subscription.upsert({
    where: { userId },
    update: {
      planId: dbPlan.id,
      status: "ACTIVE",
      currentPeriodEnd: expiresAt,
      expiresAt,
      ...(stripeCustomerId ? { stripeCustomerId } : {}),
      ...(stripeSubscriptionId ? { stripeSubscriptionId } : {}),
    },
    create: {
      userId,
      planId: dbPlan.id,
      status: "ACTIVE",
      currentPeriodEnd: expiresAt,
      expiresAt,
      ...(stripeCustomerId ? { stripeCustomerId } : {}),
      ...(stripeSubscriptionId ? { stripeSubscriptionId } : {}),
    },
  });
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

  const adminStripe = await getStripeAdminConfig();
  const activeSecretKey = adminStripe.secretKey || process.env.STRIPE_SECRET_KEY || "";
  if (!activeSecretKey || activeSecretKey.includes("placeholder")) {
    redirect("/dashboard/billing");
  }

  const stripeClient = new Stripe(activeSecretKey, {
    apiVersion: "2023-10-16" as any,
  });

  const appUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.gentiluna.com";

  const portalSession = await stripeClient.billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: `${appUrl}/dashboard/billing`,
  });

  redirect(portalSession.url);
}
