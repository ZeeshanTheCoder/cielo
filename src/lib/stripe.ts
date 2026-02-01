import 'server-only';

import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error('Missing STRIPE_SECRET_KEY in environment variables.');
}

// Reuse the Stripe instance across hot reloads in dev.
const globalForStripe = globalThis as unknown as { __stripe?: Stripe };

export const stripe =
  globalForStripe.__stripe ??
  new Stripe(secretKey, {
    apiVersion: '2024-06-20',
  });

globalForStripe.__stripe = stripe;
