"use client"

import { useRef, memo } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion"

// ─────────────────────────────────────────────────────────────────────────────
// Extracted from live DOM inspection of lusion.co
// ─────────────────────────────────────────────────────────────────────────────
const SPRING_CFG = { stiffness: 100, damping: 30, restDelta: 0.001 } as const
const ACCENT = "#5162FF"   // Lusion electric indigo-blue (ribbon color)

// ─────────────────────────────────────────────────────────────────────────────
// Lusion signature crosshair corner marker
// ─────────────────────────────────────────────────────────────────────────────
function Crosshair({ className }: { className: string }) {
  return (
    <div className={`absolute z-20 text-zinc-400 select-none pointer-events-none ${className}`}
      style={{ fontSize: "18px", fontWeight: 300, lineHeight: 1 }}
      aria-hidden="true"
    >
      +
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Project card — 2-column grid (Lusion "Featured Work" style)
// ─────────────────────────────────────────────────────────────────────────────
interface ProjectCardProps {
  label: string
  title: string
  gradient: string
  href: string
  index: number
}

const ProjectCard = memo(function ProjectCard({ label, title, gradient, href, index }: ProjectCardProps) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
      className="group block transform-gpu"
      style={{ willChange: "transform" }}
    >
      {/* Image container */}
      <div
        className="relative w-full overflow-hidden rounded-2xl mb-4"
        style={{ aspectRatio: "16/10" }}
      >
        <div
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
          style={{ background: gradient }}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
      </div>

      {/* Label */}
      <p className="text-[10px] tracking-widest uppercase text-zinc-400 mb-2 font-medium">
        {label}
      </p>

      {/* Title */}
      <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground group-hover:text-muted-foreground transition-colors duration-300">
        {title}
      </h3>
    </motion.a>
  )
})

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function FeaturedSection() {
  return (
    <section id="featured" className="relative w-full z-10 bg-transparent flex flex-col overflow-hidden">
      
      {/* Asymmetric Header Grid */}
      <div className="w-[100vw] relative left-1/2 -translate-x-1/2 px-4 md:px-12 pt-32 pb-4 grid grid-cols-1 md:grid-cols-12 gap-8 z-10">
        
        {/* Mega Heading (Left Column) */}
        <div className="md:col-span-8 flex flex-col justify-end whitespace-nowrap">
          <h2 className="font-['Aeonik',sans-serif] font-normal tracking-tight leading-none text-foreground text-[clamp(4rem,10vw,9rem)]">
            Bold Ideas,
          </h2>
          <h2 className="font-['Aeonik',sans-serif] font-normal tracking-tight leading-none text-foreground text-[clamp(4rem,10vw,9rem)]">
            Brought to Life
          </h2>
        </div>
      </div>

      {/* Media & Button Container */}
      <div className="w-[100vw] relative left-1/2 -translate-x-1/2 px-4 md:px-12 z-10 mb-32 grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch border-t-0">
        {/* Video Box (Left Column) */}
        <div className="md:col-span-8 w-full h-[50vh] md:h-[70vh] bg-primary/10 rounded-[3rem] md:rounded-[4rem] overflow-hidden relative shadow-2xl mt-8 md:mt-12">
          {/* Dashboard preview image */}
          <div className="absolute inset-0">
            <Image
              src="/dashboard-preview.jpg"
              alt="LockIn Dashboard"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
        </div>

        {/* Text and Button (Right Column) */}
        <div className="md:col-span-4 flex flex-col justify-start pt-4 md:pt-12 pl-2 md:pl-4 xl:pl-8 mt-8 md:mt-12">
          <p className="font-satoshi text-lg md:text-xl leading-relaxed text-muted-foreground mb-12 md:mb-16">
            We combine design, motion, 3D, and development to create digital experiences that feel visually striking and technically seamless. From campaign launches to immersive brand worlds, we build work that captures attention and invites interaction.
          </p>

          <div className="flex justify-start">
            <button className="flex items-center gap-3 bg-foreground hover:bg-muted-foreground transition-colors duration-300 text-background rounded-full px-8 py-4 text-sm font-outfit font-bold tracking-widest uppercase shadow-xl hover:scale-105 active:scale-95 transform-gpu">
              <div className="w-2 h-2 bg-background rounded-full" />
              OUR APPROACH
            </button>
          </div>
        </div>
      </div>

      {/* ── Phase 2: Featured Work Grid (Lusion "Featured Work" style) ─── */}
      <div className="w-full bg-transparent pt-20 pb-24 px-8 md:px-16">
        {/* Section header */}
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-80px" }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
           className="flex flex-col md:flex-row md:items-end justify-between mb-16"
        >
          <h2 className="text-[7vw] font-black tracking-tighter text-foreground leading-none uppercase whitespace-nowrap">
            Featured Work
          </h2>
          <p className="text-xs tracking-widest uppercase text-zinc-400 mt-4 md:mt-0 max-w-xs text-right hidden md:block">
            A selection of productivity tools<br />built for ambitious teams.
          </p>
        </motion.div>

        {/* 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          <ProjectCard
            index={0}
            href="/dashboard"
            label="WEB • AI • PRODUCTIVITY"
            title="Smart Task Boards"
            gradient="linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)"
          />
          <ProjectCard
            index={1}
            href="/dashboard/notes"
            label="WEB • AI • VOICE"
            title="AI Voice Transcripts"
            gradient="linear-gradient(135deg, #0f0f1a 0%, #1a0533 40%, #2d1b69 100%)"
          />
          <ProjectCard
            index={2}
            href="/dashboard/notes"
            label="WEB • LEARNING • AI"
            title="Flashcard Engine"
            gradient="linear-gradient(135deg, #0a1628 0%, #0d2137 40%, #1a3a5c 100%)"
          />
          <ProjectCard
            index={3}
            href="/dashboard/projects"
            label="WEB • COLLABORATION"
            title="Project Workspaces"
            gradient="linear-gradient(135deg, #1a1a1a 0%, #2d1a36 40%, #4a1942 100%)"
          />
        </div>

        {/* See all CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center mt-20"
        >
          <Link
            href="/dashboard"
            className="flex items-center gap-3 bg-foreground hover:bg-muted-foreground transition-colors duration-300 text-background rounded-full px-8 py-4 text-sm font-medium tracking-wide"
          >
            <div className="w-2 h-2 bg-background rounded-full" />
            SEE ALL FEATURES
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
