import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

type CheckoutBody = {
  uid: string;
  email: string;
  priceId?: string;
  lookupKey?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutBody;

    if (!body?.uid || !body?.email) {
      return NextResponse.json(
        { error: "Missing uid or email." },
        { status: 400 },
      );
    }

    const priceId = body.priceId || process.env.STRIPE_PRICE_ID || undefined;

    // If you prefer Stripe Lookup Keys, you can pass lookupKey from the client.
    // Price ID is the most straightforward.
    if (!priceId && !body.lookupKey) {
      return NextResponse.json(
        {
          error:
            "Missing Stripe price configuration (STRIPE_PRICE_ID or lookupKey).",
        },
        { status: 500 },
      );
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const line_items = priceId
      ? [{ price: priceId, quantity: 1 }]
      : [
          {
            price: await resolvePriceIdFromLookupKey(body.lookupKey!),
            quantity: 1,
          },
        ];

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: body.email,
      line_items,
      success_url: `${origin}/pricing?success=1`,
      cancel_url: `${origin}/pricing?canceled=1`,
      // Keep the user id so webhook can upgrade the correct account.
      metadata: {
        uid: body.uid,
      },
      subscription_data: {
        metadata: {
          uid: body.uid,
        },
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create checkout session.",
      },
      { status: 500 },
    );
  }
}

async function resolvePriceIdFromLookupKey(lookupKey: string): Promise<string> {
  const prices = await stripe.prices.list({
    lookup_keys: [lookupKey],
    expand: ["data.product"],
    active: true,
    limit: 1,
  });

  const price = prices.data[0];
  if (!price?.id) {
    throw new Error(
      `No active Stripe price found for lookup key: ${lookupKey}`,
    );
  }
  return price.id;
}
