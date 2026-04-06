"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { ArrowRight } from "lucide-react"

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
// Stat item with entrance animation
// ─────────────────────────────────────────────────────────────────────────────
function StatItem({
  value,
  label,
  index,
}: {
  value: string
  label: string
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="text-center transform-gpu"
      style={{ willChange: "transform" }}
    >
      <p
        className="text-5xl md:text-6xl font-black tracking-tighter text-foreground"
      >
        {value}
      </p>
      <p className="text-xs tracking-widest uppercase text-zinc-400 mt-2 font-medium">
        {label}
      </p>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main section
// ─────────────────────────────────────────────────────────────────────────────
export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative w-full min-h-screen z-10 bg-transparent flex flex-col overflow-hidden"
    >
      {/* ── Glass divider — ties back to Hero nav pill ────────────────── */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />

      {/* ── Main CTA block ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 md:px-16 pt-24 pb-16 text-center">

        {/* Tag line */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs tracking-widest uppercase text-zinc-400 font-medium mb-10 transform-gpu"
        >
          Join thousands of focused teams
        </motion.p>

        {/* Maximalist heading — Inspector Check 3: 10vw, font-black, tracking-tighter, zinc-900 */}
        <div className="overflow-hidden mb-10">
          <motion.h2
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[10vw] md:text-[9vw] font-black tracking-tighter text-foreground leading-[0.85] transform-gpu uppercase whitespace-nowrap"
            style={{ willChange: "transform" }}
          >
            Ready to
          </motion.h2>
        </div>
        <div className="overflow-hidden mb-14">
          <motion.h2
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="text-[10vw] md:text-[9vw] font-black tracking-tighter leading-[0.85] transform-gpu uppercase whitespace-nowrap"
            style={{ color: ACCENT, willChange: "transform" }}
          >
            Lock In?
          </motion.h2>
        </div>

        {/* Sub-text */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base md:text-lg text-zinc-500 max-w-md mb-12 leading-relaxed transform-gpu"
        >
          Stop switching between apps. LockIn brings your tasks, notes, and calendar into one razor-sharp workspace.
        </motion.p>

        {/* Magnetic CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <MagneticButton />
        </motion.div>

        {/* Secondary link */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-xs text-zinc-400"
        >
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="text-zinc-700 hover:text-zinc-900 underline underline-offset-2 transition-colors"
          >
            Sign in
          </Link>
        </motion.p>
      </div>

      {/* ── Stats row ─────────────────────────────────────────────────── */}
      <div className="w-full border-t border-zinc-100 py-16 px-8 md:px-16">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8">
          <StatItem value="10K+" label="Active users" index={0} />
          <StatItem value="99.9%" label="Uptime" index={1} />
          <StatItem value="24/7" label="AI available" index={2} />
        </div>
      </div>

      {/* ── Footer bar ────────────────────────────────────────────────── */}
      <div className="w-full border-t border-zinc-100 py-8 px-8 md:px-16 flex items-center justify-between">
        {/* Logo mark */}
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-full"
            style={{ backgroundColor: ACCENT }}
          />
          <span className="text-xs font-semibold tracking-widest uppercase text-foreground">
            LockIn
          </span>
        </div>

        <p className="text-xs text-zinc-400">
          © {new Date().getFullYear()} LockIn · CC26-PS118
        </p>

        {/* Glass pill — Glassmorphism echo of Hero nav */}
        <div className="hidden md:flex items-center gap-6 bg-white/60 backdrop-blur-md border border-zinc-200/60 rounded-full px-6 py-2.5">
          <Link href="#featured" className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
            Features
          </Link>
          <Link href="#workspace" className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
            Workspace
          </Link>
          <Link href="/auth/sign-up" className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
            Sign up
          </Link>
        </div>
      </div>
    </section>
  )
}
