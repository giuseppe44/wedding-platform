import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { activateUserPlanInDb, getServerStripeConfig } from "@/lib/stripeServer";
import { PLANS_CATALOG } from "@/lib/plans";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const adminStripe = await getServerStripeConfig();
  const webhookSecret = adminStripe.activeWebhookSecret;
  const activeSecretKey = adminStripe.activeSecretKey;

  if (!activeSecretKey && !webhookSecret) {
    return new NextResponse("Stripe non configurato", { status: 503 });
  }

  const stripeClient = new Stripe(activeSecretKey || "sk_test_unused", {
    apiVersion: "2023-10-16" as any,
  });

  let event: Stripe.Event;

  try {
    if (webhookSecret) {
      if (!sig) {
        return new NextResponse("Missing stripe-signature header", { status: 401 });
      }
      event = stripeClient.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      // Se il Webhook Secret non è ancora impostato, verifica l'autenticità dell'evento
      // interrogando direttamente le API ufficiali di Stripe tramite la Secret Key!
      // Impedisce al 100% chiamate POST contraffatte su `/api/stripe/webhook`.
      if (!activeSecretKey) {
        return new NextResponse("Unauthorized webhook", { status: 401 });
      }
      const parsed = JSON.parse(body) as { id?: string };
      if (!parsed?.id || !parsed.id.startsWith("evt_")) {
        return new NextResponse("Invalid Stripe event ID", { status: 400 });
      }
      event = await stripeClient.events.retrieve(parsed.id);
    }
  } catch (err: any) {
    console.error(`Webhook Verification Error: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.payment_status && session.payment_status !== "paid") {
          break;
        }

        const rawRef = session.client_reference_id || "";
        const customerId = typeof session.customer === "string" ? session.customer : undefined;
        const subscriptionId =
          typeof session.subscription === "string" ? session.subscription : undefined;

        let userId = session.metadata?.userId || rawRef;
        let planCode = session.metadata?.planCode || "";

        if (rawRef.includes("__")) {
          const [refUser, refPlan] = rawRef.split("__");
          userId = refUser;
          planCode = planCode || refPlan;
        }

        const customerEmail = session.customer_details?.email || session.customer_email;
        if (!userId && customerEmail) {
          const userByEmail = await prisma.user.findFirst({
            where: { email: { equals: customerEmail.trim(), mode: "insensitive" } },
          });
          if (userByEmail) {
            userId = userByEmail.id;
          }
        }

        if (!planCode && session.amount_total) {
          const matchedPlan = Object.values(PLANS_CATALOG).find(
            (p) => p.priceCents === session.amount_total
          );
          if (matchedPlan) {
            planCode = matchedPlan.code;
          }
        }

        if (userId) {
          await activateUserPlanInDb(
            userId,
            planCode || "PREMIUM_ANNUAL",
            customerId,
            subscriptionId
          );
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const dbSub = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (dbSub) {
          await prisma.subscription.update({
            where: { id: dbSub.id },
            data: {
              status:
                subscription.status.toUpperCase() === "ACTIVE"
                  ? "ACTIVE"
                  : subscription.status.toUpperCase(),
              currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
            },
          });
        }
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.error("Error processing webhook event:", error);
    return new NextResponse("Internal Webhook Error", { status: 500 });
  }

  return new NextResponse("OK", { status: 200 });
}
