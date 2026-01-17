import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AltVest - Trading Education",
  description: "Premium trading education and coaching",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-gray-950 text-white min-h-screen">{children}</body>
      </html>
    </ClerkProvider>
  );
}
