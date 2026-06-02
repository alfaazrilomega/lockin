import React from 'react'

// The Stepped Block Brushstroke Gradient
// Leaves text transparent initially, sweeps through bluish-white to dark shadow, 
// and comes to rest with solid black tail enveloping the text.
const STEPPED_BRUSHSTROKE_GRADIENT = `linear-gradient(to right, transparent 0%, transparent 40%, #e0e7ff 40%, #e0e7ff 45%, #d1d5db 45%, #d1d5db 50%, #374151 50%, #374151 55%, #111111 55%, #111111 100%)`

export default function FooterSequence() {
  return (
    <div
      className="footer-sequence-wrapper absolute inset-0 w-full h-screen bg-[#f4f4f4] z-[90] flex items-center justify-center overflow-hidden"
      // Note: Initial state for 3D sweep (y, rotateX, transformPerspective) 
      // is managed strictly via gsap.set in MainScrollExperience.tsx to avoid FOUC.
    >
      {/* ── THE 3-COLUMN STATIC GRID ───────────────────────────────────────── */}
      <div className="w-full max-w-[90vw] flex flex-row items-center justify-between z-10">
        
        {/* LEFT COLUMN */}
        <div className="flex flex-col items-end w-1/3 pr-12">
          <span className="text-[#888888] text-sm tracking-widest mb-2 footer-label-left opacity-0">Special Thanks</span>
          <div className="relative text-black text-6xl md:text-8xl font-bold tracking-tighter">
            <div
              className="footer-brushstroke-text tracking-tighter"
              style={{
                backgroundImage: STEPPED_BRUSHSTROKE_GRADIENT,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
                backgroundSize: "300% 100%",
                backgroundPosition: "100% 0%", // Starts hidden (transparent zone)
              }}
            >
              Codegrid
            </div>
          </div>
        </div>

        {/* CENTER PLACEHOLDER: Holds space for the absolute image */}
        <div className="w-[30vw] h-[60vh] opacity-0 flex-shrink-0" />

        {/* RIGHT COLUMN */}
        <div className="flex flex-col items-start w-1/3 pl-12">
          <span className="text-[#888888] text-sm tracking-widest mb-2 footer-label-right opacity-0">Socials</span>
          <div className="relative text-black text-6xl md:text-8xl font-bold tracking-tighter">
            <div
              className="footer-brushstroke-text tracking-tighter whitespace-nowrap"
              style={{
                backgroundImage: STEPPED_BRUSHSTROKE_GRADIENT,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
                backgroundSize: "300% 100%",
                backgroundPosition: "100% 0%", // Starts hidden (transparent zone)
              }}
            >
              Ig&nbsp;&nbsp;In&nbsp;&nbsp;Be
            </div>
          </div>
        </div>
      </div>

      {/* ── THE ANIMATED IMAGE WRAPPER ─────────────────────────────────────
          Starts at 100vw / 100vh. GSAP centers it via xPercent/yPercent.
          Shrinks to 30vw / 60vh to perfectly cover the placeholder.
      ── */}
      <div
        className="footer-animated-image absolute top-1/2 left-1/2 overflow-hidden z-20"
        style={{ width: "100vw", height: "100vh" }}
      >
        <img
          src="/footer-cat.webp"
          alt="Victor with cat"
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* ── COPYRIGHT ────────────────────────────────────────────────────── */}
      <div className="footer-copyright absolute bottom-8 right-8 text-[#888888] text-xs tracking-widest opacity-0 z-10">
        ©2026 Victor Furuya
      </div>
    </div>
  )
}

