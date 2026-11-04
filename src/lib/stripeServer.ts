import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { PLANS_CATALOG, getCatalogPlan } from "@/lib/plans";
import { BASE_FEATURES, PREMIUM_FEATURES, DIAMOND_FEATURES } from "@/lib/entitlementHelper";

export const MASKED_SECRET_PLACEHOLDER = "••••••••••••••••••••••••";

function getFeaturesForTier(tier: "BASE" | "PREMIUM" | "DIAMOND") {
  if (tier === "DIAMOND") return JSON.stringify(DIAMOND_FEATURES);
  if (tier === "PREMIUM") return JSON.stringify(PREMIUM_FEATURES);
  return JSON.stringify(BASE_FEATURES);
}

/**
 * Modulo strettamente server-side (privo di `"use server"`, quindi MAI invocabile dal browser).
 * Assicura che tutti i piani del catalogo esistano nella tabella Plan del DB.
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
 * Legge la configurazione Stripe riservata al server (NON passa mai direttamente ai client component).
 */
export async function getServerStripeConfig() {
  await ensureCatalogPlansInDb();
  const plans = await prisma.plan.findMany();
  const links: Record<string, string> = {};
  for (const p of plans) {
    if (p.stripePriceId && p.name !== "__STRIPE_KEYS__") {
      links[p.name] = p.stripePriceId;
    }
  }

  let secretKey = "";
  let publishableKey =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_live_51NlK6iAuYhdNmyvmNtSkYPOi3lO9Gk8IljYOquHzm9QBfshj9f9hMRrszC4mfEymiqdgCgFVb7YDnOnghh1FW4AW00c4UXZQpk";
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

  const envSecretKey =
    process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes("placeholder")
      ? process.env.STRIPE_SECRET_KEY
      : "";

  return {
    links,
    secretKey,
    activeSecretKey: secretKey || envSecretKey,
    publishableKey,
    webhookSecret,
    activeWebhookSecret: webhookSecret || process.env.STRIPE_WEBHOOK_SECRET || "",
    hasEnvSecretKey: Boolean(envSecretKey),
  };
}

/**
 * Restituisce la configurazione Stripe mascherata per il pannello Admin Client,
 * evitando di serializzare `sk_live_...` o `whsec_...` nell'HTML del browser.
 */
export async function getMaskedStripeConfigForAdminUI() {
  const cfg = await getServerStripeConfig();
  return {
    links: cfg.links,
    secretKey: cfg.secretKey ? MASKED_SECRET_PLACEHOLDER : "",
    publishableKey: cfg.publishableKey,
    webhookSecret: cfg.webhookSecret ? MASKED_SECRET_PLACEHOLDER : "",
    hasEnvSecretKey: cfg.hasEnvSecretKey,
    hasSavedSecretKey: Boolean(cfg.secretKey),
    hasSavedWebhookSecret: Boolean(cfg.webhookSecret),
  };
}

/**
 * Attiva un piano nel DB per un utente (invocabile SOLO da codice server verificato: Webhook / Admin / Verifica Sessione Stripe).
 */
export async function activateUserPlanInDb(
  userId: string,
  planCode: string,
  stripeCustomerId?: string,
  stripeSubscriptionId?: string
) {
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

/**
 * Verifica crittograficamente tramite API Stripe che il pagamento sia realmente avvenuto
 * prima di attivare il piano al redirect su `/dashboard/billing?success=true`.
 * Impedisce qualsiasi manomissione manuale dell'URL (`?success=true&plan=DIAMOND_ANNUAL`).
 */
export async function verifyAndActivateStripeReturn(params: {
  userId: string;
  userEmail?: string | null;
  planCode: string;
  sessionId?: string;
}): Promise<boolean> {
  const { userId, userEmail, planCode, sessionId } = params;
  const stripeCfg = await getServerStripeConfig();

  if (!stripeCfg.activeSecretKey) {
    // Senza chiave segreta API, l'attivazione può avvenire solo tramite Webhook o Admin
    return false;
  }

  const stripeClient = new Stripe(stripeCfg.activeSecretKey, {
    apiVersion: "2023-10-16" as any,
  });

  try {
    if (sessionId) {
      const checkoutSession = await stripeClient.checkout.sessions.retrieve(sessionId);
      const isPaid = checkoutSession.payment_status === "paid";
      const refMatches =
        checkoutSession.metadata?.userId === userId ||
        (checkoutSession.client_reference_id || "").startsWith(`${userId}__`) ||
        (Boolean(userEmail) &&
          (checkoutSession.customer_details?.email?.toLowerCase() === userEmail?.toLowerCase() ||
            checkoutSession.customer_email?.toLowerCase() === userEmail?.toLowerCase()));

      if (isPaid && refMatches) {
        const verifiedPlan = checkoutSession.metadata?.planCode || planCode;
        const customerId = typeof checkoutSession.customer === "string" ? checkoutSession.customer : undefined;
        const subId = typeof checkoutSession.subscription === "string" ? checkoutSession.subscription : undefined;
        await activateUserPlanInDb(userId, verifiedPlan, customerId, subId);
        return true;
      }
      return false;
    }

    // Fallback sicuro per Payment Links diretti (senza `{CHECKOUT_SESSION_ID}` nell'URL di redirect):
    // Controlla le ultime sessioni di checkout effettivamente pagate su Stripe per questo utente nelle ultime 24h
    const recentSessions = await stripeClient.checkout.sessions.list({ limit: 15 });
    const oneDayAgo = Math.floor(Date.now() / 1000) - 86400;

    const matchingSession = recentSessions.data.find((s) => {
      if (s.payment_status !== "paid" || s.created < oneDayAgo) return false;
      if ((s.client_reference_id || "") === `${userId}__${planCode}`) return true;
      if (s.metadata?.userId === userId) return true;
      const sEmail = s.customer_details?.email || s.customer_email;
      if (userEmail && sEmail && sEmail.toLowerCase() === userEmail.toLowerCase()) return true;
      return false;
    });

    if (matchingSession) {
      const customerId = typeof matchingSession.customer === "string" ? matchingSession.customer : undefined;
      const subId = typeof matchingSession.subscription === "string" ? matchingSession.subscription : undefined;
      await activateUserPlanInDb(userId, planCode, customerId, subId);
      return true;
    }
  } catch (err) {
    console.error("Errore verifica sessione Stripe:", err);
  }

  return false;
}
