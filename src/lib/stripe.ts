import Stripe from 'stripe';

const apiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

export const stripe = new Stripe(apiKey, {
  // @ts-ignore
  apiVersion: '2023-10-16', // Use the stable version
  appInfo: {
    name: 'Wedding Platform',
    version: '0.1.0',
  },
});
