"use client"

import { useRef } from "react"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"

// ─── Design tokens ────────────────────────────────────────────────────────────
const ACCENT      = "#5162FF"
const ACCENT_SOFT = "#A5ADFF"
const SPRING_CFG  = { stiffness: 100, damping: 30, restDelta: 0.001 } as const

// ─── Image Card (browser-frame wrapper around a real screenshot) ──────────────
// Shows actual Refokus project screenshots inside a macOS-style chrome bar.
function ImageCard({ src, label }: { src: string; label: string }) {
  return (
    <div
      className="w-full flex flex-col"
      style={{
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.35)",
      }}
    >
      {/* macOS-style chrome / title bar */}
      <div
        className="flex items-center gap-1.5 px-4 flex-shrink-0"
        style={{
          height: 36,
          background: "#1A1828",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F57" }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FFBD2E" }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28CA41" }} />
        <span className="ml-2 text-white/30 text-xs font-medium tracking-wide">{label}</span>
      </div>
      {/* Screenshot */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={label}
        className="w-full block object-cover object-top"
        style={{ maxHeight: 340 }}
        draggable={false}
      />
    </div>
  )
}

// ─── Feature ticker ───────────────────────────────────────────────────────────
const TICKER_ITEMS = ["Focus Board", "AI Notes", "Smart Calendar", "AI Co-pilot", "Flashcards", "Workspaces"]
const TICKER_DOUBLED = [...TICKER_ITEMS, ...TICKER_ITEMS]

// ─────────────────────────────────────────────────────────────────────────────
// Main section
//
// ARCHITECTURE NOTE: This component MUST live OUTSIDE <ContentWrapper> in
// page.tsx. Adding 400vh inside ContentWrapper stretches the FlowingThread SVG.
// ─────────────────────────────────────────────────────────────────────────────
export default function WorkspaceSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })
  const smooth = useSpring(scrollYProgress, SPRING_CFG)

  // ── Phase 1: Opposing text [0.00 → 0.22] ──────────────────────────────────
  const topX        = useTransform(smooth, [0, 0.22], ["-110vw", "0vw"])
  const bottomX     = useTransform(smooth, [0, 0.22], ["110vw",  "0vw"])
  const textOpacity = useTransform(smooth, [0.18, 0.27], [1, 0])

  // ── Phase 2: Staggered 4-block reveal ─────────────────────────────────────
  // Pair A (TR + BL) expands first: [0.22 → 0.40]
  const blockA = useTransform(smooth, [0.22, 0.40], [0, 1])
  // Pair B (TL + BR) expands second: [0.30 → 0.48]
  const blockB = useTransform(smooth, [0.30, 0.48], [0, 1])

  // ── Phase 3: Sequential cards ─────────────────────────────────────────────
  //
  // KEY DESIGN: Each card is independently invisible (opacity:0) until its
  // phase window begins. This guarantees no card bleeds through earlier phases,
  // even if transform clipping is unreliable in certain scroll contexts.
  //
  // Cards travel from +1400px (far below screen) to their settled position.
  // All values are pure px — no vh/vw mixing to avoid unit conversion bugs.
  //
  // STACK: Later cards land ON TOP and earlier cards get pushed UP + scaled down.
  //
  //  Card 1: enters [0.48 → 0.57], pushed as 2, 3, 4 land
  //  Card 2: enters [0.57 → 0.66], pushed as 3, 4 land
  //  Card 3: enters [0.66 → 0.75], pushed as 4 lands
  //  Card 4: enters [0.75 → 0.84], stays on top

  // ── Card 1
  const c1Opacity = useTransform(smooth, [0.46, 0.49], [0, 1])
  const c1Y = useTransform(
    smooth,
    [0.48, 0.57,  0.57, 0.66,  0.66, 0.75,  0.75, 0.84],
    [1400, 0,     0,    -16,    -16,  -26,    -26,  -32]
  )
  const c1Scale = useTransform(
    smooth,
    [0.48, 0.57, 0.66, 0.75, 0.84],
    [1,    1,    0.88, 0.82, 0.78]
  )

  // ── Card 2
  const c2Opacity = useTransform(smooth, [0.55, 0.58], [0, 1])
  const c2Y = useTransform(
    smooth,
    [0.57, 0.66,  0.66, 0.75,  0.75, 0.84],
    [1400, 0,     0,    -12,    -12,  -18]
  )
  const c2Scale = useTransform(
    smooth,
    [0.57, 0.66, 0.75, 0.84],
    [1,    1,    0.92, 0.88]
  )

  // ── Card 3
  const c3Opacity = useTransform(smooth, [0.64, 0.67], [0, 1])
  const c3Y = useTransform(
    smooth,
    [0.66, 0.75, 0.75, 0.84],
    [1400, 0,    0,    -7]
  )
  const c3Scale = useTransform(smooth, [0.66, 0.75, 0.84], [1, 1, 0.96])

  // ── Card 4
  const c4Opacity = useTransform(smooth, [0.73, 0.76], [0, 1])
  const c4Y       = useTransform(smooth, [0.75, 0.84], [1400, 0])

  // Group fade-out when entering Phase 4
  const cardsGroupOpacity = useTransform(smooth, [0.84, 0.90], [1, 0])

  // ── Phase 4: Cinematic text reveal [0.88 → 1.00] ──────────────────────────
  const finalOpacity = useTransform(smooth, [0.88, 1.0], [0, 1])
  const finalY       = useTransform(smooth, [0.88, 1.0], [60, 0])

  return (
    <div
      id="workspace"
      ref={containerRef}
      className="relative w-full"
      style={{ height: "400vh" }}
    >
      {/* ── Sticky pinned viewport ─────────────────────────────────────────── */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ background: "#07061A" }}
      >

        {/* ── Dot grid overlay (always visible, z-index above everything) ─── */}
        <div
          className="absolute inset-0 z-[60] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* ── PHASE 1: Opposing text ──────────────────────────────────────── */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ opacity: textOpacity }}
        >
          {/* Upper half — "the best" from left */}
          <div className="absolute top-0 left-0 w-full h-1/2 flex items-center overflow-hidden px-[7vw]">
            <motion.p
              className="font-outfit font-black text-white transform-gpu select-none"
              style={{
                fontSize: "clamp(3.5rem, 11vw, 9rem)",
                letterSpacing: "-0.035em",
                lineHeight: 1,
                x: topX,
                willChange: "transform",
              }}
            >
              the best
            </motion.p>
          </div>

          {/* Lower half — "workspace" from right */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 flex items-center justify-end overflow-hidden px-[7vw]">
            <motion.p
              className="font-outfit font-black text-white transform-gpu select-none"
              style={{
                fontSize: "clamp(3.5rem, 11vw, 9rem)",
                letterSpacing: "-0.035em",
                lineHeight: 1,
                x: bottomX,
                willChange: "transform",
              }}
            >
              workspace
            </motion.p>
          </div>
        </motion.div>

        {/* ── PHASE 2: Staggered 4-block quadrant reveal ──────────────────── */}
        {/*
          FIX: originX/originY MUST be in Framer style prop.
          CSS origin-* classes are silently ignored by Framer's transform matrix.

          Blocks sized 50.5vw × 50.5vh (0.5% overlap) — prevents center seam gap.
          Pair A (TR+BL) expands from center outward FIRST.
          Pair B (TL+BR) follows 0.08 progress later — creates staggered diagonal feel.
        */}

        {/* Pair A — TOP-RIGHT */}
        <motion.div
          className="absolute top-0 right-0 z-20 transform-gpu"
          style={{ width: "50.5vw", height: "50.5vh", background: ACCENT, scale: blockA, originX: 0, originY: 1, willChange: "transform" }}
        />
        {/* Pair A — BOTTOM-LEFT */}
        <motion.div
          className="absolute bottom-0 left-0 z-20 transform-gpu"
          style={{ width: "50.5vw", height: "50.5vh", background: ACCENT, scale: blockA, originX: 1, originY: 0, willChange: "transform" }}
        />
        {/* Pair B — TOP-LEFT */}
        <motion.div
          className="absolute top-0 left-0 z-20 transform-gpu"
          style={{ width: "50.5vw", height: "50.5vh", background: ACCENT, scale: blockB, originX: 1, originY: 1, willChange: "transform" }}
        />
        {/* Pair B — BOTTOM-RIGHT */}
        <motion.div
          className="absolute bottom-0 right-0 z-20 transform-gpu"
          style={{ width: "50.5vw", height: "50.5vh", background: ACCENT, scale: blockB, originX: 0, originY: 0, willChange: "transform" }}
        />

        {/* ── PHASE 3: Sequential card arrivals ───────────────────────────── */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-30"
          style={{ opacity: cardsGroupOpacity }}
        >
          {/*
            Each card has its own cXOpacity that keeps it invisible (opacity:0)
            until its specific phase starts. This is the hard guarantee that
            no card is visible before its turn, even if transform clipping fails.
          */}

          {/* Card 1 — Rainfall (Fintech dark): first to arrive, ends deep in the stack */}
          <motion.div
            className="absolute w-[clamp(260px,62vw,760px)] transform-gpu"
            style={{ y: c1Y, scale: c1Scale, opacity: c1Opacity, willChange: "transform, opacity" }}
          >
            <ImageCard src="/images/platform/card1.png" label="rainfall.io" />
          </motion.div>

          {/* Card 2 — Remind (Light educational): second to arrive */}
          <motion.div
            className="absolute w-[clamp(260px,62vw,760px)] transform-gpu"
            style={{ y: c2Y, scale: c2Scale, opacity: c2Opacity, willChange: "transform, opacity" }}
          >
            <ImageCard src="/images/platform/card2.png" label="remind.com" />
          </motion.div>

          {/* Card 3 — Maisie Wilen (Bold colorful): third to arrive */}
          <motion.div
            className="absolute w-[clamp(260px,62vw,760px)] transform-gpu"
            style={{ y: c3Y, scale: c3Scale, opacity: c3Opacity, willChange: "transform, opacity" }}
          >
            <ImageCard src="/images/platform/card3.png" label="maisiewilen.com" />
          </motion.div>

          {/* Card 4 — Weglot (Translation SaaS): last to arrive, stays on top */}
          <motion.div
            className="absolute w-[clamp(260px,62vw,760px)] transform-gpu"
            style={{ y: c4Y, scale: 1, opacity: c4Opacity, willChange: "transform, opacity" }}
          >
            <ImageCard src="/images/platform/card4.png" label="weglot.com" />
          </motion.div>
        </motion.div>

        {/* ── PHASE 4: Cinematic final text + feature ticker ───────────────── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center z-40 pointer-events-none transform-gpu"
          style={{
            opacity: finalOpacity,
            y: finalY,
            willChange: "opacity, transform",
          }}
        >
          <div className="px-8 text-center max-w-4xl">
            <p
              className="font-satoshi font-medium text-white leading-tight"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3.5rem)" }}
            >
              While focus for our users is what matters most, it&rsquo;s nice to build something{" "}
              <span style={{ color: ACCENT_SOFT }}>truly remarkable.</span>
            </p>
          </div>

          {/* Scrolling feature ticker */}
          <div
            className="mt-14 w-full overflow-hidden"
            style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: "20px" }}
          >
            <div
              className="flex gap-16 whitespace-nowrap"
              style={{ animation: "platform-marquee 18s linear infinite", width: "max-content" }}
            >
              {TICKER_DOUBLED.map((item, i) => (
                <span key={i} className="text-sm font-outfit uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.28)" }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
