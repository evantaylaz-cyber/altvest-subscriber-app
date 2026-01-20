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
                                <Link href="/" className="text-2xl font-bold text-primary">AltVest</Link>Link>
                                <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1 rounded-full text-sm ${isPremium ? "bg-primary" : "bg-gray-700"}`}>
                                              {isPremium ? "Premium" : "Free"}
                                            </span>span>
                                            <UserButton afterSignOutUrl="/" />
                                </div>div>
                      </div>div>
              </nav>nav>
        
              <main className="max-w-6xl mx-auto px-6 py-12">
                      <h1 className="text-4xl font-bold mb-8">Welcome back!</h1>h1>
                      
                {!isPremium && (
                    <div className="bg-gray-900 border border-primary/50 rounded-xl p-6 mb-8">
                                <h2 className="text-xl font-semibold mb-2">Upgrade to Premium</h2>h2>
                                <p className="text-gray-400 mb-4">Get access to all courses and live coaching sessions.</p>p>
                                <Link href="/pricing" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90">
                                              View Plans
                                </Link>Link>
                    </div>div>
                      )}
              
                {isPremium && (
                    <div className="bg-gray-900 border border-primary/50 rounded-xl p-6 mb-8">
                                <h2 className="text-xl font-semibold mb-2">Premium Member</h2>h2>
                                <p className="text-gray-400 mb-4">You have full access to all content and coaching.</p>p>
                                <Link href="/billing" className="text-primary hover:underline">Manage Subscription</Link>Link>
                    </div>div>
                      )}
              
                      <h2 className="text-2xl font-semibold mb-4">Your Content</h2>h2>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <ContentCard title="Getting Started" tier="free" userTier={user.subscriptionTier} />
                                <ContentCard title="Advanced Strategies" tier="premium" userTier={user.subscriptionTier} />
                                <ContentCard title="Live Coaching" tier="premium" userTier={user.subscriptionTier} />
                      </div>div>
              </main>main>
        </div>div>
      );
}

function ContentCard({ title, tier, userTier }: { title: string; tier: string; userTier: string }) {
    const locked = tier === "premium" && userTier !== "premium";
    return (
          <div className={`bg-gray-900 border ${locked ? "border-gray-800" : "border-gray-700"} rounded-xl p-6`}>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>h3>
                <span className={`text-sm ${tier === "premium" ? "text-primary" : "text-gray-500"}`}>
                  {tier === "premium" ? "Premium" : "Free"}
                </span>span>
            {locked && <p className="text-gray-500 mt-2 text-sm">Upgrade to access</p>p>}
          </div>div>
        );
}</div>
