import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { stripe, PRICE_ID } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export async function POST() {
    const clerkUser = await currentUser();
    if (!clerkUser) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

  let user = await prisma.user.findUnique({ where: { id: clerkUser.id } });
    if (!user) {
          user = await prisma.user.create({
                  data: { id: clerkUser.id, email: clerkUser.emailAddresses[0]?.emailAddress || "" }
          });
    }

  let customerId = user.stripeCustomerId;
    if (!customerId) {
          const customer = await stripe.customers.create({
                  email: user.email,
                  metadata: { clerkUserId: clerkUser.id }
          });
          customerId = customer.id;
          await prisma.user.update({
                  where: { id: clerkUser.id },
                  data: { stripeCustomerId: customerId }
          });
    }

  const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded",
        customer: customerId,
        line_items: [{ price: PRICE_ID, quantity: 1 }],
        mode: "subscription",
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
  });

  return NextResponse.json({ clientSecret: session.client_secret });
}
