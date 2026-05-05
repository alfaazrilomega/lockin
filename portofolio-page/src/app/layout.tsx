import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Victor Furuya — Multidisciplinary Designer",
  description: "Portfolio of Victor Furuya",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}

function Navbar() {
  return (
    <header id="global-navbar" className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 pointer-events-none opacity-0">
      <div className="flex items-center pointer-events-auto">
        <a href="/" className="text-sm font-medium tracking-tight text-white/90 hover:opacity-70 transition-opacity">
          Victor Furuya
        </a>
      </div>
      <nav className="flex items-center gap-4 pointer-events-auto">
        <a href="#works" className="text-sm font-medium tracking-tight text-white/90 hover:opacity-70 transition-opacity">Works,</a>
        <a href="/about" className="text-sm font-medium tracking-tight text-white/90 hover:opacity-70 transition-opacity">About,</a>
        <a href="#contact" className="text-sm font-medium tracking-tight text-white/90 hover:opacity-70 transition-opacity">Reach out</a>
      </nav>
    </header>
  )
}
