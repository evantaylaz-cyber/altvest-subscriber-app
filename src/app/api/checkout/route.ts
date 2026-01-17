import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { stripe, PREMIUM_PRICE_ID } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST() {
      try {
              const { userId } = await auth();
              const clerkUser = await currentUser();

        if (!userId || !clerkUser) {
                  return new NextResponse("Unauthorized", { status: 401 });
        }

        // Get or create user in database
        let user = await db.user.findUnique({
                  where: { clerkId: userId },
        });

        if (!user) {
                  user = await db.user.create({
                              data: {
                                            clerkId: userId,
                                            email: clerkUser.emailAddresses[0]?.emailAddress || "",
                                            name: clerkUser.firstName || clerkUser.username || "",
                              },
                  });
        }

        // Get or create Stripe customer
        let stripeCustomerId = user.stripeCustomerId;

        if (!stripeCustomerId) {
                  const customer = await stripe.customers.create({
                              email: user.email,
                              name: user.name || undefined,
                              metadata: {
                                            clerkId: userId,
                                            userId: user.id,
                              },
                  });
                  stripeCustomerId = customer.id;

                await db.user.update({
                            where: { id: user.id },
                            data: { stripeCustomerId },
                });
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
                  customer: stripeCustomerId,
                  line_items: [
                      {
                                    price: PREMIUM_PRICE_ID,
                                    quantity: 1,
                      },
                            ],
                  mode: "subscription",
                  success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
                  cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?canceled=true`,
                  metadata: {
                              userId: user.id,
                              clerkId: userId,
                  },
        });

        return NextResponse.json({ url: session.url });
      } catch (error) {
              console.error("[CHECKOUT_ERROR]", error);
              return new NextResponse("Internal Error", { status: 500 });
      }
}
