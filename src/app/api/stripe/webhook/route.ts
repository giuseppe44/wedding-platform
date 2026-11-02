import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { activateUserPlanInDb, getStripeAdminConfig } from '@/app/stripeActions';
import { PLANS_CATALOG } from '@/lib/plans';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;
  const adminStripe = await getStripeAdminConfig();
  const webhookSecret = adminStripe.webhookSecret || process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (sig && webhookSecret) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const rawRef = session.client_reference_id || '';
        const customerId = typeof session.customer === 'string' ? session.customer : undefined;
        const subscriptionId = typeof session.subscription === 'string' ? session.subscription : undefined;

        let userId = session.metadata?.userId || rawRef;
        let planCode = session.metadata?.planCode || '';

        if (rawRef.includes('__')) {
          const [refUser, refPlan] = rawRef.split('__');
          userId = refUser;
          planCode = planCode || refPlan;
        }

        // Se non abbiamo userId ma abbiamo l'email del cliente su Stripe, cerchiamo l'utente per email
        const customerEmail = session.customer_details?.email || session.customer_email;
        if (!userId && customerEmail) {
          const userByEmail = await prisma.user.findFirst({
            where: { email: { equals: customerEmail.trim(), mode: 'insensitive' } }
          });
          if (userByEmail) {
            userId = userByEmail.id;
          }
        }

        // Se non abbiamo planCode, deduciamolo dall'importo pagato in centesimi
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
            planCode || 'PREMIUM_ANNUAL',
            customerId,
            subscriptionId
          );
          console.log(`Piano ${planCode || 'PREMIUM_ANNUAL'} attivato per utente ${userId}`);
        }
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        const dbSub = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id }
        });

        if (dbSub) {
          await prisma.subscription.update({
            where: { id: dbSub.id },
            data: {
              status: subscription.status.toUpperCase() === 'ACTIVE' ? 'ACTIVE' : subscription.status.toUpperCase(),
              currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
            }
          });
        }
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error('Error processing webhook event:', error);
    return new NextResponse('Internal Webhook Error', { status: 500 });
  }

  return new NextResponse('OK', { status: 200 });
}
