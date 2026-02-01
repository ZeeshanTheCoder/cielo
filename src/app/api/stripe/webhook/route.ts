import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import type Stripe from 'stripe';

import { stripe } from '@/lib/stripe';
import { adminFirestore } from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
  const signature = (await headers()).get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'Missing STRIPE_WEBHOOK_SECRET.' },
      { status: 500 }
    );
  }

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header.' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  try {
    switch (event.type) {
      // Fires when the user completes Stripe Checkout.
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const uid = session.metadata?.uid;

        if (uid) {
          await adminFirestore
            .collection('users')
            .doc(uid)
            .set(
              {
                isUpgraded: true,
                stripeCustomerId: session.customer ?? null,
                stripeSubscriptionId: session.subscription ?? null,
                updatedAt: new Date(),
              },
              { merge: true }
            );
        }
        break;
      }

      // Optional: if subscription is canceled, downgrade the user.
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const uid = sub.metadata?.uid;
        if (uid) {
          await adminFirestore
            .collection('users')
            .doc(uid)
            .set(
              {
                isUpgraded: false,
                stripeSubscriptionId: null,
                updatedAt: new Date(),
              },
              { merge: true }
            );
        }
        break;
      }

      default:
        // No-op for other events.
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Stripe webhook handler error:', err);
    return NextResponse.json(
      { error: 'Webhook handler failed.' },
      { status: 500 }
    );
  }
}
