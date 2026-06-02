import React from 'react'

const GRADIENT = `linear-gradient(to right, #f6f6f6 0%, #f6f6f6 8%, #e2e2e2 8%, #e2e2e2 16%, #a3a3a3 16%, #a3a3a3 28%, #696969 28%, #696969 40%, #2f2f2f 40%, #2f2f2f 50%, #1e1e1e 50%, #1e1e1e 60%, #2f2f2f 60%, #2f2f2f 72%, #696969 72%, #696969 82%, #a3a3a3 82%, #a3a3a3 91%, #e2e2e2 91%, #e2e2e2 100%)`

const TEXT = "Who's behind the work."

export default function WhiteReveal() {
  return (
    <div
      className="white-reveal-section absolute inset-0 z-[50] bg-[#f4f4f4] flex items-center justify-center pointer-events-none"
      style={{ clipPath: "inset(0 100% 0 0)" }}
    >
      <div className="relative w-full text-center px-8">
        {/* BASE LAYER: dark text — always visible, never animated */}
        <h2 className="text-[#111111] text-5xl md:text-7xl lg:text-[8vw] font-bold tracking-tighter leading-tight select-none">
          {TEXT}
        </h2>

        {/*
         * REVEAL LAYER — Duplicate Clip-Path Method (industry standard)
         * Identical text, but colored via background-clip: text + stepped gradient.
         * Starts clipped: clipPath inset(0 100% 0 0) = hidden to the left.
         * GSAP tweens to: inset(0 0% 0 0) = fully revealed left-to-right.
         * Hardware-accelerated clip-path = zero glitch, zero blend-mode conflict.
         */}
        <h2
          className="stepped-gradient-text absolute inset-0 flex items-center justify-center text-5xl md:text-7xl lg:text-[8vw] font-bold tracking-tighter leading-tight select-none"
          style={{
            backgroundImage: GRADIENT,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextFillColor: "transparent",
            clipPath: "inset(0 100% 0 0)",
          }}
        >
          {TEXT}
        </h2>
      </div>
    </div>
  )
}
