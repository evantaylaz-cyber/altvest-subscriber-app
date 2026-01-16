import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
    try {
          event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch {
          return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

  if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        await prisma.user.update({
                where: { stripeCustomerId: session.customer as string },
                data: { tier: "premium", stripeSubscriptionId: session.subscription as string }
        });
  }

  if (event.type === "customer.subscription.deleted") {
        const subscription = event.data.object as Stripe.Subscription;
        await prisma.user.update({
                where: { stripeCustomerId: subscription.customer as string },
                data: { tier: "free", stripeSubscriptionId: null }
        });
  }

  return NextResponse.json({ received: true });
}
