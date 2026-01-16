import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Billing() {
    const clerkUser = await currentUser();
    if (!clerkUser) redirect("/");

  const user = await prisma.user.findUnique({ where: { id: clerkUser.id } });
    if (!user || !user.stripeCustomerId) redirect("/dashboard");

  const portalSession = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });

  redirect(portalSession.url);
}
