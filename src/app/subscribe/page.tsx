"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import Link from "next/link";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Subscribe() {
    const [clientSecret, setClientSecret] = useState<string | null>(null);

  const startCheckout = async () => {
        const res = await fetch("/api/checkout", { method: "POST" });
        const data = await res.json();
        setClientSecret(data.clientSecret);
  };

  return (
        <div className="min-h-screen">
              <nav className="border-b border-gray-800 px-6 py-4">
                      <div className="max-w-6xl mx-auto flex justify-between items-center">
                                <Link href="/" className="text-2xl font-bold text-primary">AltVest</Link>Link>
                                <Link href="/dashboard" className="text-gray-400 hover:text-white">Back to Dashboard</Link>Link>
                      </div>
              </nav>
              <main className="max-w-2xl mx-auto px-6 py-12">
                {!clientSecret ? (
                    <div className="text-center">
                                <h1 className="text-3xl font-bold mb-4">Upgrade to Premium</h1>h1>
                                <p className="text-gray-400 mb-8">Get full access to all trading content and 1-on-1 coaching sessions.</p>p>
                                <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 mb-8">
                                              <h2 className="text-2xl font-bold text-primary mb-2">$500/month</h2>h2>
                                              <ul className="text-left text-gray-300 space-y-2 mb-6">
                                                              <li>- Full access to all trading courses</li>li>
                                                              <li>- Weekly 1-on-1 coaching sessions</li>li>
                                                              <li>- Private Discord community</li>li>
                                                              <li>- Real-time trade alerts</li>li>
                                              </ul>ul>
                                              <button onClick={startCheckout} className="w-full py-4 bg-primary rounded-lg hover:bg-primary/90 text-lg font-semibold">
                                                              Subscribe Now
                                              </button>
                                </div>
                    </div>
                  ) : (
                    <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
                                <EmbeddedCheckout />
                    </EmbeddedCheckoutProvider>EmbeddedCheckoutProvider>
                      )}
              </main>
        </div>
      );
}</div>
