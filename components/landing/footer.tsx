"use client"

import Link from "next/link"
import { Instagram, Linkedin } from "lucide-react"

export default function Footer() {
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
          <div className="mb-4">
            <svg viewBox="0 0 24 26" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 fill-white">
              <path d="M 18.229 15.111 L 23.201 7.527 C 24.749 5.172 23.974 1.991 21.518 0.621 C 17.877 -1.409 13.559 1.844 14.479 5.926 L 16.413 14.508 C 16.418 14.54 16.423 14.573 16.428 14.607 C 16.511 14.939 16.961 16.482 16.588 17.583 C 15.746 20.071 12.335 20.429 10.098 19.18 C 9.555 18.81 8.572 17.97 8.049 16.479 C 7.981 16.285 7.913 16.124 7.846 15.992 L 7.846 15.992 L 5.641 10.356 C 4.746 8.067 1.615 7.832 0.392 9.962 C -0.405 11.349 0.052 13.123 1.419 13.947 L 7.445 17.583 L 7.445 17.583 C 7.924 17.904 8.793 18.587 9.243 19.563 L 10.82 23.595 C 12.514 27.925 18.985 25.924 17.962 21.385 L 17.464 18.841 C 17.373 18.305 17.416 17.69 17.485 17.2 C 17.571 16.592 17.79 16.016 18.055 15.463 C 18.142 15.281 18.213 15.134 18.229 15.111 Z" />
              <path d="M 5.813 23.069 C 5.813 24.688 4.511 26 2.906 26 C 1.301 26 0 24.688 0 23.069 C 0 21.45 1.301 20.137 2.906 20.137 C 4.511 20.137 5.813 21.45 5.813 23.069 Z" />
            </svg>
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
              <form className="flex items-center gap-4 border-b border-white/20 pb-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email*"
                  required
                  className="bg-transparent text-white placeholder-white/50 text-[15px] focus:outline-none w-full"
                />
                <button type="submit" className="shrink-0 bg-white text-black text-xs font-bold px-4 py-[0.4rem] rounded-full hover:bg-white/90 transition-colors">
                  SUBSCRIBE
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
