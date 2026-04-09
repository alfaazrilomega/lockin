"use client"

import { useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { FAQ } from "./faq"

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="rgb(49, 16, 129)" style={{ width: '18px', height: '18px' }}>
    <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z" />
  </svg>
)

// ─────────────────────────────────────────────────────────────────────────────
// Lusion-inspected tokens
// ─────────────────────────────────────────────────────────────────────────────
const ACCENT = "#5162FF"

// ─────────────────────────────────────────────────────────────────────────────
// Magnetic CTA Button — cursor follows the button position
// Inspector Check 1: NO top/left/margin — ONLY x/y transforms
// ─────────────────────────────────────────────────────────────────────────────
function MagneticButton() {
  const ref = useRef<HTMLAnchorElement>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 200, damping: 20 })
  const y = useSpring(rawY, { stiffness: 200, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    rawX.set((e.clientX - cx) * 0.22)
    rawY.set((e.clientY - cy) * 0.22)
  }

  const handleMouseLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <motion.a
      ref={ref}
      href="/auth/sign-up"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
      className="group relative inline-flex items-center gap-4 rounded-full px-10 py-5 text-white transform-gpu select-none cursor-pointer"
      style={{
        x,
        y,
        backgroundColor: ACCENT,
        willChange: "transform",
      }}
    >
      <span className="text-lg font-semibold tracking-tight">Start for free</span>
      <motion.div
        className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20"
        whileHover={{ x: 4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <ArrowRight className="w-4 h-4" />
      </motion.div>
    </motion.a>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// Main section
// ─────────────────────────────────────────────────────────────────────────────
export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative w-full min-h-screen z-10 flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #F0F4FF 50%, #ffffff 100%)',
      }}
    >
      {/* Radial glow behind heading */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(81, 98, 255, 0.08) 0%, transparent 70%)',
        }}
      />

      {/* ── Glass divider — ties back to Hero nav pill ────────────────── */}
      <div className="w-full h-px relative z-10 bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />

      {/* ── Main CTA block ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 md:px-16 pt-24 pb-16 text-center">

        {/* FAQ Section */}
        <FAQ />

        {/* Horizontal CTA Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row items-center justify-center gap-5 mt-5 mb-16 transform-gpu"
        >
          <p className="text-base md:text-lg text-zinc-500 max-w-[280px] md:text-right leading-relaxed m-0">
            Stop switching between apps. LockIn calendar into one
          </p>
          <div className="shrink-0">
            <MagneticButton />
          </div>
          <p className="text-base md:text-lg text-zinc-500 max-w-[280px] md:text-left leading-relaxed m-0">
            brings your tasks, notes, and your Single workspace.
          </p>
        </motion.div>

        {/* Footer Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center pb-12 gap-2"
        >
          <MailIcon />
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: 'rgba(28, 22, 41, 0.6)',
              margin: 0,
            }}
          >
            Feel free to mail us for any enquiries:{' '}
            <a
              href="mailto:hello@lockin.com"
              style={{
                color: 'rgb(49, 16, 129)',
                textDecoration: 'none',
              }}
            >
              hello@lockin.com
            </a>
          </p>
        </motion.div>
      </div>


    </section>
  )
}
