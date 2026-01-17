import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">AltVest</h1>
          <div className="flex gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-gray-300 hover:text-white">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 bg-primary rounded-lg hover:bg-primary/90">Get Started</button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="px-4 py-2 bg-primary rounded-lg hover:bg-primary/90">Dashboard</Link>
            </SignedIn>
          </div>
        </div>
      </nav>
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <h2 className="text-5xl font-bold mb-6">Master the Art of Trading</h2>
          <p className="text-xl text-gray-400 mb-8">Premium trading education and 1-on-1 coaching to help you succeed in the markets.</p>
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="px-8 py-4 bg-primary text-lg rounded-lg hover:bg-primary/90">Start Learning Today</button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="px-8 py-4 bg-primary text-lg rounded-lg hover:bg-primary/90 inline-block">Go to Dashboard</Link>
          </SignedIn>
        </div>
      </main>
    </div>
  );
}
