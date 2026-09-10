import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      console.error('Missing stripe signature or webhook secret');
      return new NextResponse('Webhook secret not configured', { status: 400 });
    }
    
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        if (userId && subscriptionId) {
          // Fetch the subscription details from Stripe
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = subscription.items.data[0].price.id;

          // Find the corresponding plan in our DB
          const plan = await prisma.plan.findFirst({
            where: { stripePriceId: priceId }
          });

          if (plan) {
            // Upsert the subscription in our database
            await prisma.subscription.upsert({
              where: { userId },
              update: {
                status: subscription.status,
                planId: plan.id,
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: customerId,
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              },
              create: {
                userId,
                status: subscription.status,
                planId: plan.id,
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: customerId,
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              }
            });
            console.log(`Subscription created/updated for user ${userId}`);
          } else {
            console.error(`Plan not found for stripe price ID: ${priceId}`);
          }
        }
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Find the subscription in our DB
        const dbSub = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id }
        });

        if (dbSub) {
          // Update status and period
          await prisma.subscription.update({
            where: { id: dbSub.id },
            data: {
              status: subscription.status,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            }
          });
          console.log(`Subscription ${dbSub.id} updated to status ${subscription.status}`);
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
