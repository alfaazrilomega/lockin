import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "LockIn AI — YouTube Automation Dashboard",
  description: "Monitor and control your AI-powered YouTube automation pipeline in real-time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-[#0a0a0f] text-[#e2e8f0] antialiased`}>
        {children}
      </body>
    </html>
  );
}
