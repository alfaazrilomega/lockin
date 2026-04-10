"use client"

import Link from "next/link"
import { Logo } from "@/components/shared/Logo"
import { Instagram, Linkedin } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        toast.success("Subscribed successfully! Check your inbox.")
        setEmail("")
      } else {
        toast.error("Failed to subscribe. Please try again.")
      }
    } catch (_error) {
      toast.error("An error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <footer id="site-footer" className="sticky bottom-0 left-0 w-full h-[100vh] z-0 overflow-hidden flex flex-col justify-between pt-16 pb-8 px-8 md:px-16 font-satoshi text-white">

      {/* ── Background Video ────────────────────────────────────────────── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-[-2]"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_015952_e1deeb12-8fb7-4071-a42a-60779fc64ab6.mp4"
      />
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/40 z-[-1]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-[-1]" />

      {/* ── Top Half Layout ─────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between w-full h-full flex-1">

        {/* Left: Nav Links */}
        <div className="flex flex-col gap-6 w-full md:w-1/2">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-6">
            <Logo className="h-16 w-16" />
          </div>

          <nav className="flex flex-col gap-1">
            {['Home', 'Workspace', 'Feature', 'Contact'].map((item) => (
              <Link
                key={item}
                href={item === 'Home' ? '/' : item === 'Workspace' ? '/dashboard' : `/${item.toLowerCase().replace(' ', '-')}`}
                className="font-satoshi text-4xl lg:text-[2.8rem] font-bold tracking-tight hover:opacity-75 transition-opacity"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Info & Newsletter */}
        <div className="flex flex-row gap-12 md:gap-24 w-full md:w-1/2 justify-start md:justify-end mt-12 md:mt-0 font-satoshi">

          <div className="flex flex-col gap-16">
            {/* Contact Details */}
            <div>
              <p className="text-white/60 text-sm mb-4 font-medium uppercase tracking-wider">Contact</p>
              <div className="flex flex-col gap-1 text-[15px] font-medium">
                <p>US +1 916 740 305</p>
                <p>ID +62 811 851 141</p>
                <p className="mt-1">Around the world.</p>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-white/60 text-sm mb-4 font-medium uppercase tracking-wider">Subscribe to our newsletter</p>
              <form className="flex items-center gap-4 border-b border-white/20 pb-2" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Enter your email*"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="bg-transparent text-white placeholder-white/50 text-[15px] focus:outline-none w-full disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="shrink-0 bg-white text-black text-xs font-bold px-4 py-[0.4rem] rounded-full hover:bg-white/90 transition-colors disabled:opacity-70"
                >
                  {isLoading ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
                </button>
              </form>
            </div>
          </div>

          {/* Social */}
          <div>
            <p className="text-white/60 text-sm mb-4 font-medium uppercase tracking-wider">Our Voice</p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="flex items-center justify-center p-3 rounded-full border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all group">
                <Instagram className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="flex items-center justify-center p-3 rounded-full border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all group">
                <Linkedin className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* ── Bottom Half: Giant Logo & Copyright ─────────────────────────── */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-end w-full mt-auto">
        <h1 className="font-satoshi text-[20vw] md:text-[23vw] font-black leading-[0.75] tracking-tighter text-white -ml-[1vw]">
          Lockin<span className="text-[6vw] align-top relative top-[2vw] font-bold">®</span>
        </h1>

        <p className="text-white/50 text-xs md:text-sm font-medium text-right max-w-[200px] leading-snug pb-[2vw]">
          MMXXV © LOCKIN. ALL RIGHTS RESERVED
        </p>
      </div>

    </footer>
  )
}
