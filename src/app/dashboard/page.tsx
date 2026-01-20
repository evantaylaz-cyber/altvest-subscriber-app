import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/");

  let user = await prisma.user.findUnique({ where: { clerkId: clerkUser.id } });
  if (!user) {
    user = await prisma.user.create({
      data: { clerkId: clerkUser.id, email: clerkUser.emailAddresses[0]?.emailAddress || "" }
    });
  }

  const isPremium = user.subscriptionTier === "premium";

  return (
    <div className="min-h-screen">
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">AltVest</Link>
          <div className="flex items-center gap-4">
            <span className={"px-3 py-1 rounded-full text-sm " + (isPremium ? "bg-primary" : "bg-gray-700")}>
              {isPremium ? "Premium" : "Free"}
            </span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Welcome back!</h1>
        
        {!isPremium && (
          <div className="bg-gray-900 border border-primary/50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-2">Upgrade to Premium</h2>
            <p className="text-gray-400 mb-4">Get access to all courses and live coaching sessions.</p>
            <Link href="/subscribe" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90">
              View Plans
            </Link>
          </div>
        )}
        
        {isPremium && (
          <div className="bg-gray-900 border border-primary/50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-2">Premium Member</h2>
            <p className="text-gray-400 mb-4">You have full access to all content and coaching.</p>
            <Link href="/billing" className="text-primary hover:underline">Manage Subscription</Link>
          </div>
        )}
        
        <h2 className="text-2xl font-semibold mb-4">Your Content</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a href="/The-AltVest-Handbook.pdf" target="_blank" rel="noopener noreferrer" className="block">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:border-primary transition-colors cursor-pointer">
              <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
              <span className="text-sm text-gray-500">Free</span>
              <p className="text-gray-400 mt-2 text-sm">📘 The AltVest Handbook</p>
            </div>
          </a>
          <ContentCard title="Advanced Strategies" tier="premium" userTier={user.subscriptionTier} />
          <ContentCard title="Live Coaching" tier="premium" userTier={user.subscriptionTier} />
        </div>
      </main>
    </div>
  );
}

function ContentCard({ title, tier, userTier }: { title: string; tier: string; userTier: string }) {
  const locked = tier === "premium" && userTier !== "premium";
  return (
    <div className={"bg-gray-900 border rounded-xl p-6 " + (locked ? "border-gray-800" : "border-gray-700")}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <span className={"text-sm " + (tier === "premium" ? "text-primary" : "text-gray-500")}>
        {tier === "premium" ? "Premium" : "Free"}
      </span>
      {locked && <p className="text-gray-500 mt-2 text-sm">Upgrade to access</p>}
    </div>
  );
}
