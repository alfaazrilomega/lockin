"use client"

import { useRef, useEffect, useState, memo } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Mic, BookOpen, Layout, Zap, Clock } from "lucide-react"
import { prepare, layout } from "@chenglou/pretext"

// ─────────────────────────────────────────────────────────────────────────────
// Lusion-inspected accent tokens
// ─────────────────────────────────────────────────────────────────────────────
const ACCENT = "#5162FF"
const ACCENT_CYAN = "#2CEFDD"

// ─────────────────────────────────────────────────────────────────────────────
// @chenglou/pretext hook — DOM-free text height pre-calculation
// Eliminates layout shift before whileInView stagger fires.
// Runs once per card (prepare) + on resize (layout). ~0.0002ms per layout call.
// ─────────────────────────────────────────────────────────────────────────────
function useCardHeight(text: string, font: string, lineHeightPx: number) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [minHeight, setMinHeight] = useState<number | undefined>(undefined)

  useEffect(() => {
    // Segment + measure text once
    const prepared = prepare(text, font)

    function calculate() {
      const el = containerRef.current
      if (!el) return
      const containerWidth = el.getBoundingClientRect().width
      if (containerWidth === 0) return
      // p-8 = 64px total horizontal padding; subtract from card width
      const { height } = layout(prepared, containerWidth - 64, lineHeightPx)
      setMinHeight(height)
    }

    calculate()

    const observer = new ResizeObserver(calculate)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [text, font, lineHeightPx])

  return { containerRef, minHeight }
}

// ─────────────────────────────────────────────────────────────────────────────
// Stagger variants — per PLAN.md physics spec
// ─────────────────────────────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// CapabilityCard — React.memo to prevent re-renders on parent scroll
// ─────────────────────────────────────────────────────────────────────────────
interface CapabilityCardProps {
  icon: React.ReactNode
  title: string
  description: string
  features: string[]
  accentColor: string
}

const CapabilityCard = memo(function CapabilityCard({
  icon,
  title,
  description,
  features,
  accentColor,
}: CapabilityCardProps) {
  // Pretext: "14px Satoshi", 22px line height — matches description text style
  const { containerRef, minHeight } = useCardHeight(description, "14px Satoshi", 22)

  return (
    <motion.div
      ref={containerRef}
      variants={cardVariants}
      whileHover={{ scale: 1.02, transition: { ease: [0.35, 0, 0, 1], duration: 0.5 } }}
      transition={{ duration: 0.4 }}
      className="group relative bg-card border border-border rounded-[0.8em] p-8 shadow-sm hover:shadow-2xl transition-shadow duration-500 transform-gpu cursor-default"
      style={{ willChange: "transform" }}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
        style={{ backgroundColor: `${accentColor}15`, border: `1px solid ${accentColor}30` }}
      >
        <div style={{ color: accentColor }}>{icon}</div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold tracking-tight text-foreground mb-3">
        {title}
      </h3>

      {/* Description — minHeight pre-set by Pretext to prevent CLS during stagger */}
      <p
        className="text-sm text-muted-foreground leading-relaxed mb-6"
        style={{ minHeight: minHeight ? `${minHeight}px` : undefined }}
      >
        {description}
      </p>

      {/* Features */}
      <ul className="space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-xs text-zinc-400">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accentColor }} />
            {f}
          </li>
        ))}
      </ul>

      {/* Corner glow on hover — CSS transition (not motion) to avoid GPU compositing conflict */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top right, ${accentColor}20, transparent 70%)`,
        }}
      />
    </motion.div>
  )
})

// ─────────────────────────────────────────────────────────────────────────────
// Capability data
// ─────────────────────────────────────────────────────────────────────────────
const capabilities = [
  {
    icon: <Layout className="w-5 h-5" />,
    title: "Focus Mode",
    description:
      "Kanban-style project boards that keep your team aligned, your tasks moving, and your deadlines met.",
    features: ["Drag-and-drop Kanban", "Team collaboration", "Deadline tracking"],
    accentColor: ACCENT,
  },
  {
    icon: <Mic className="w-5 h-5" />,
    title: "AI Transcripts",
    description:
      "Record your thoughts, lectures, or meetings. AI converts voice to structured, searchable notes instantly.",
    features: ["Real-time transcription", "AI summarization", "Smart tagging"],
    accentColor: ACCENT_CYAN,
  },
  {
    icon: <BookOpen className="w-5 h-5" />,
    title: "Smart Flashcards",
    description:
      "Transform any note into an adaptive review deck. Spaced repetition science ensures nothing is forgotten.",
    features: ["Spaced repetition", "Auto-generated decks", "Progress tracking"],
    accentColor: "#FF6B6B",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "AI Co-pilot",
    description:
      "An AI assistant embedded across every tool — summarize, explain, brainstorm, and draft at any moment.",
    features: ["Contextual suggestions", "Draft generation", "Research assist"],
    accentColor: "#F59E0B",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: "Calendar Engine",
    description:
      "Visualize your week, schedule tasks, and let LockIn intelligently slot your deep work sessions.",
    features: ["Visual week view", "Smart scheduling", "Time blocking"],
    accentColor: "#10B981",
  },
  {
    icon: <CheckCircle2 className="w-5 h-5" />,
    title: "Project Workspaces",
    description:
      "Dedicated spaces per project — tasks, notes, files, and collaborators living together in one view.",
    features: ["Per-project spaces", "File attachments", "Activity feed"],
    accentColor: "#8B5CF6",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Main section
// ─────────────────────────────────────────────────────────────────────────────
export default function WorkspaceSection() {
  return (
    <section id="workspace" className="relative w-full z-10 bg-transparent overflow-hidden">

      {/* ── Heading block — Lusion "Where Creative Ideas Become..." style ── */}
      <div className="w-full px-8 md:px-16 pt-24 pb-16">
        {/* Tag label — fade in */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-3"
        >
          <p className="text-xs tracking-widest uppercase text-zinc-400 font-medium">
            The Platform
          </p>
        </motion.div>

        {/* ── Text curtain reveal — PLAN.md upgrade: y: "110%" → "0%" clip ── */}
        <div className="overflow-hidden">
          <motion.h2
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
            className="text-[8vw] md:text-[7vw] font-black tracking-tighter text-foreground leading-[0.88] transform-gpu uppercase whitespace-nowrap"
            style={{ willChange: "transform" }}
          >
            Where Deep Work
          </motion.h2>
        </div>
        <div className="overflow-hidden">
          <motion.h2
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.95, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="text-[8vw] md:text-[7vw] font-black tracking-tighter text-foreground leading-[0.88] transform-gpu uppercase whitespace-nowrap"
            style={{ willChange: "transform" }}
          >
            <span style={{ color: ACCENT }}>Becomes</span> Reality.
          </motion.h2>
        </div>

        {/* Accent line — scaleX expand on enter */}
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="h-0.5 w-32 mt-8 rounded-full transform-gpu"
          style={{ backgroundColor: ACCENT, willChange: "transform" }}
        />
      </div>

      {/* ── 3-column stagger grid — container variant drives staggerChildren ── */}
      <div className="px-8 md:px-16 pb-28">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {capabilities.map((cap) => (
            <CapabilityCard key={cap.title} {...cap} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
