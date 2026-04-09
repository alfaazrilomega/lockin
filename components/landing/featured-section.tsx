"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { FlowHoverButton } from "@/components/ui/flow-hover-button"
import { ArrowRight } from "lucide-react"
import { VideoModal } from "@/components/landing/video-modal"

// ─────────────────────────────────────────────────────────────────────────────
// Project Data — LockIn features as "projects"
// ─────────────────────────────────────────────────────────────────────────────
const projects = [
  {
    id: 1,
    name: "Smart Task Boards",
    category: "AI · Productivity",
    href: "/dashboard",
    image: "https://dennissnellenberg.com/media/pages/work/twice/0ab7e43954-1710404752/thumbnail-twice-810x810-crop-q72.jpg",
    imageBg: "#f1f1f1",
  },
  {
    id: 2,
    name: "AI Voice Transcripts",
    category: "AI · Voice",
    href: "/dashboard/notes",
    image: "https://dennissnellenberg.com/media/pages/work/the-damai/b511d32d21-1710452224/thumbnail-thedamai-v2-810x810-crop-q72.jpg",
    imageBg: "#E0D9D1",
  },
  {
    id: 3,
    name: "Flashcard Engine",
    category: "Learning · AI",
    href: "/dashboard/notes",
    image: "https://dennissnellenberg.com/media/pages/work/fabric/ac07564a5f-1688453092/thumbnail-fabric-darkgray-810x810-crop-q72.jpg",
    imageBg: "#48494A",
  },
  {
    id: 4,
    name: "Project Workspaces",
    category: "Collaboration",
    href: "/dashboard/projects",
    image: "https://dennissnellenberg.com/media/pages/work/aanstekelijk/441187fb44-1687423090/thumbnail-aanstekelijk-810x810-crop-q72.jpg",
    imageBg: "#101010",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Rolling reel variants — slot-machine style, no opacity
// ─────────────────────────────────────────────────────────────────────────────
const REEL_EASE = [0.76, 0, 0.24, 1] as const
const REEL_DUR = 0.55

const reelVariants = {
  enter: (dir: number) => ({ y: dir > 0 ? "100%" : "-100%" }),
  visible: { y: "0%", transition: { duration: REEL_DUR, ease: REEL_EASE } },
  exit: (dir: number) => ({
    y: dir > 0 ? "-100%" : "100%",
    transition: { duration: REEL_DUR, ease: REEL_EASE },
  }),
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function FeaturedSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [activeProject, setActiveProject] = useState(projects[0])
  const [direction, setDirection] = useState<1 | -1>(1)
  const [isPlayingHovered, setIsPlayingHovered] = useState(false)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  const posRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingSectionRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const lerpRef = useRef({ x: 0, y: 0, init: false })
  const rafRef = useRef<number | null>(null)
  const hoveredIdRef = useRef<number | null>(null)
  const lastIdxRef = useRef<number>(-1)

  useEffect(() => {
    hoveredIdRef.current = hoveredId
  }, [hoveredId])

  useEffect(() => {
    const headingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.intersectionRatio >= 0.15) {
          entry.target.classList.add('is-visible')
        } else if (entry.intersectionRatio === 0) {
          entry.target.classList.remove('is-visible')
        }
      })
    }, { threshold: [0, 0.15] })

    if (headingSectionRef.current) {
      headingObserver.observe(headingSectionRef.current)
    }

    return () => headingObserver.disconnect()
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (hoveredIdRef.current === null || !sectionRef.current) return
      const { top, bottom, left, right } = sectionRef.current.getBoundingClientRect()
      const { x, y } = mouseRef.current
      if (y < top || y > bottom || x < left || x > right) setHoveredId(null)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const LERP = 0.085

    const tick = () => {
      const { x: mx, y: my } = mouseRef.current
      if (!lerpRef.current.init && mx !== 0) {
        lerpRef.current = { x: mx, y: my, init: true }
      }
      lerpRef.current.x += (mx - lerpRef.current.x) * LERP
      lerpRef.current.y += (my - lerpRef.current.y) * LERP

      if (posRef.current) {
        posRef.current.style.transform = `translate(${lerpRef.current.x}px, ${lerpRef.current.y}px) translate(-50%, -53%)`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  const handleEnter = useCallback((id: number) => {
    const newIdx = projects.findIndex(p => p.id === id)
    if (newIdx !== lastIdxRef.current) {
      setDirection(newIdx > lastIdxRef.current ? 1 : -1)
      lastIdxRef.current = newIdx
      setActiveProject(projects[newIdx])
    }
    setHoveredId(id)
  }, [])

  const handleListLeave = useCallback(() => {
    setHoveredId(null)
  }, [])

  const isHovering = hoveredId !== null

  return (
    <section id="featured" className="relative w-full z-10 bg-[#ffffff] text-[#1c1629] flex flex-col overflow-hidden">




      {/* ── Phase 1: Mega Heading & Video ───────────────────────────────── */}
      <div
        ref={headingSectionRef}
        className="w-[100vw] relative left-1/2 -translate-x-1/2 px-4 md:px-12 pt-32 pb-8 grid grid-cols-1 md:grid-cols-12 gap-8 z-10 items-end border-t-0 group"
      >
        <div className="md:col-span-8 flex flex-col justify-end whitespace-nowrap">
          <div className="overflow-hidden pb-4 -mb-4" style={{ lineHeight: 1.1 }}>
            <div className="translate-y-[110%] group-[.is-visible]:translate-y-0 transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)]">
              <h2 className="font-['Aeonik',sans-serif] font-normal tracking-tight leading-none text-[clamp(4rem,10vw,9rem)] translate-x-[15vw] md:translate-x-[250px] lg:translate-x-[300px] group-[.is-visible]:translate-x-0 transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] delay-[1000ms]">
                Bold Ideas,
              </h2>
            </div>
          </div>
          <div className="flex gap-[1.2em]" style={{ lineHeight: 1.1 }}>
            <div className="overflow-hidden pb-6 -mb-6 pt-2 -mt-2">
              <h2 className="font-['Aeonik',sans-serif] font-normal tracking-tight leading-none text-[clamp(4rem,10vw,9rem)] -translate-y-[110%] group-[.is-visible]:translate-y-0 transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] delay-[100ms]">
                Brought
              </h2>
            </div>
            <div className="overflow-hidden pb-6 -mb-6 pt-2 -mt-2">
              <h2 className="font-['Aeonik',sans-serif] font-normal tracking-tight leading-none text-[clamp(4rem,10vw,9rem)] -translate-y-[110%] group-[.is-visible]:translate-y-0 transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] delay-[500ms]">
                to
              </h2>
            </div>
            <div className="overflow-hidden pb-6 -mb-6 pt-2 -mt-2">
              <h2 className="font-['Aeonik',sans-serif] font-normal tracking-tight leading-none text-[clamp(4rem,10vw,9rem)] -translate-y-[110%] group-[.is-visible]:translate-y-0 transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] delay-[900ms]">
                Life
              </h2>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 flex flex-col justify-end pb-4 pl-2 md:pl-4 xl:pl-8">
          <p className="font-['Aeonik',sans-serif] font-normal text-[18px] md:text-[20px] leading-[1.6] text-[#1c1629]/90 mb-8 md:mb-12">
            {"LockIn brings your most ambitious projects to life with an AI-driven workspace where intelligent task management, real-time collaboration, and limitless productivity converge.".split(" ").map((word, i, arr) => (
              <span key={i}>
                <span className="inline-block overflow-hidden pb-1 -mb-1 pt-1 -mt-1">
                  <span
                    className="inline-block translate-y-[110%] group-[.is-visible]:translate-y-0 transition-transform duration-[0.9s] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ transitionDelay: `${200 + i * 35}ms` }}
                  >
                    {word}
                  </span>
                </span>
                {i < arr.length - 1 && " "}
              </span>
            ))}
          </p>

          <div className="flex justify-start overflow-hidden py-4 -my-4 px-4 -mx-4 mt-2">
            <div className="translate-y-[150%] translate-x-[50px] group-[.is-visible]:translate-y-0 group-[.is-visible]:translate-x-0 transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] delay-[800ms]">
              <FlowHoverButton icon={<ArrowRight className="w-4 h-4" />}>
                OUR APPROACH
              </FlowHoverButton>
            </div>
          </div>
        </div>
      </div>

      {/* Media Container (Lusion Style Video) */}
      <div className="w-[100vw] relative left-1/2 -translate-x-1/2 px-4 md:px-12 z-10 mb-32 pt-8 pb-8">

        {/* Outer Bounding Box */}
        <div className="relative w-full h-[50vh] md:h-[65vh] max-h-[700px] mx-auto">

          {/* Tracker Crosses & Marquee (Top Row) */}
          <div className="absolute -top-8 left-0 w-full flex items-center justify-between text-[#1c1629] z-0 select-none overflow-hidden h-8">
            {/* The + marks */}
            <div className={`absolute inset-0 w-full flex items-center justify-between transition-opacity duration-500 px-2 font-light text-xl ${isPlayingHovered ? 'opacity-0' : 'opacity-60'}`}>
              <span>+</span><span>+</span><span>+</span><span>+</span><span>+</span>
            </div>

            {/* Top Marquee (Right to Left) */}
            <div className={`absolute inset-0 w-full flex items-center translate-y-[2px] transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isPlayingHovered ? 'opacity-100' : 'opacity-0'}`}>
              <motion.div
                className="flex items-center whitespace-nowrap h-full will-change-transform"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ ease: "linear", duration: 8, repeat: Infinity }}
              >
                <div className="flex shrink-0 w-max">
                  {/* First identical half */}
                  <div className="flex shrink-0">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center justify-center w-[25vw] min-w-[25vw] gap-2 md:gap-4 text-[#1c1629] font-satoshi font-medium tracking-widest text-[0.65rem] md:text-lg uppercase h-full overflow-hidden">
                        <span className="flex">
                          {"PLAY REEL".split('').map((char, index) => (
                            <span
                              key={index}
                              className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pb-1"
                              style={{
                                transform: isPlayingHovered ? 'translateY(0)' : 'translateY(110%)',
                                transitionDelay: isPlayingHovered ? `${index * 30}ms` : '0ms'
                              }}
                            >
                              {char === ' ' ? '\u00A0' : char}
                            </span>
                          ))}
                        </span>
                        <Image
                          src="/svg/Arrow-Path.svg"
                          alt="Arrows"
                          width={16}
                          height={16}
                          className="h-2 w-auto md:h-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                          style={{
                            transform: isPlayingHovered ? 'translateY(0)' : 'translateY(150%)',
                            transitionDelay: isPlayingHovered ? `${9 * 30}ms` : '0ms'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  {/* Second identical half (for perfect -50% loop) */}
                  <div className="flex shrink-0">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center justify-center w-[25vw] min-w-[25vw] gap-2 md:gap-4 text-[#1c1629] font-satoshi font-medium tracking-widest text-[0.65rem] md:text-lg uppercase h-full overflow-hidden">
                        <span className="flex">
                          {"PLAY REEL".split('').map((char, index) => (
                            <span
                              key={index}
                              className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pb-1"
                              style={{
                                transform: isPlayingHovered ? 'translateY(0)' : 'translateY(110%)',
                                transitionDelay: isPlayingHovered ? `${index * 30}ms` : '0ms'
                              }}
                            >
                              {char === ' ' ? '\u00A0' : char}
                            </span>
                          ))}
                        </span>
                        <Image
                          src="/svg/Arrow-Path.svg"
                          alt="Arrows"
                          width={16}
                          height={16}
                          className="h-2 w-auto md:h-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                          style={{
                            transform: isPlayingHovered ? 'translateY(0)' : 'translateY(150%)',
                            transitionDelay: isPlayingHovered ? `${9 * 30}ms` : '0ms'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Tracker Crosses & Marquee (Bottom Row) */}
          <div className="absolute -bottom-8 left-0 w-full flex items-center justify-between text-[#1c1629] z-0 select-none overflow-hidden h-8">
            {/* The + marks */}
            <div className={`absolute inset-0 w-full flex items-center justify-between transition-opacity duration-500 px-2 font-light text-xl ${isPlayingHovered ? 'opacity-0' : 'opacity-60'}`}>
              <span>+</span><span>+</span><span>+</span><span>+</span><span>+</span>
            </div>

            {/* Bottom Marquee (Left to Right) */}
            <div className={`absolute inset-0 w-full flex items-center translate-y-[2px] transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isPlayingHovered ? 'opacity-100' : 'opacity-0'}`}>
              <motion.div
                className="flex items-center whitespace-nowrap h-full will-change-transform"
                animate={{ x: ["-50%", "0%"] }}
                transition={{ ease: "linear", duration: 8, repeat: Infinity }}
              >
                <div className="flex shrink-0 w-max">
                  {/* First identical half */}
                  <div className="flex shrink-0">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center justify-center w-[25vw] min-w-[25vw] gap-2 md:gap-4 text-[#1c1629] font-satoshi font-medium tracking-widest text-[0.65rem] md:text-lg uppercase h-full overflow-hidden">
                        <span className="flex">
                          {"PLAY REEL".split('').map((char, index) => (
                            <span
                              key={index}
                              className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pb-1"
                              style={{
                                transform: isPlayingHovered ? 'translateY(0)' : 'translateY(110%)',
                                transitionDelay: isPlayingHovered ? `${index * 30}ms` : '0ms'
                              }}
                            >
                              {char === ' ' ? '\u00A0' : char}
                            </span>
                          ))}
                        </span>
                        <Image
                          src="/svg/Arrow-Path.svg"
                          alt="Arrows"
                          width={16}
                          height={16}
                          className="h-2 w-auto md:h-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                          style={{
                            transform: isPlayingHovered ? 'translateY(0)' : 'translateY(150%)',
                            transitionDelay: isPlayingHovered ? `${9 * 30}ms` : '0ms'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  {/* Second identical half (for perfect -50% loop) */}
                  <div className="flex shrink-0">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center justify-center w-[25vw] min-w-[25vw] gap-2 md:gap-4 text-[#1c1629] font-satoshi font-medium tracking-widest text-[0.65rem] md:text-lg uppercase h-full overflow-hidden">
                        <span className="flex">
                          {"PLAY REEL".split('').map((char, index) => (
                            <span
                              key={index}
                              className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pb-1"
                              style={{
                                transform: isPlayingHovered ? 'translateY(0)' : 'translateY(110%)',
                                transitionDelay: isPlayingHovered ? `${index * 30}ms` : '0ms'
                              }}
                            >
                              {char === ' ' ? '\u00A0' : char}
                            </span>
                          ))}
                        </span>
                        <Image
                          src="/svg/Arrow-Path.svg"
                          alt="Arrows"
                          width={16}
                          height={16}
                          className="h-2 w-auto md:h-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                          style={{
                            transform: isPlayingHovered ? 'translateY(0)' : 'translateY(150%)',
                            transitionDelay: isPlayingHovered ? `${9 * 30}ms` : '0ms'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Video Container with rounded corners */}
          <div className={`w-full h-full bg-[#1c1629] rounded-[2rem] md:rounded-[3rem] overflow-hidden relative shadow-2xl z-10 transition-transform duration-700 will-change-transform ${isPlayingHovered ? 'scale-[1.015]' : 'scale-100'}`}>

            {/* Background Video */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover will-change-transform"
            >
              <source src="/video/Video-Showcase-Test.mp4" type="video/mp4" />
            </video>

            {/* Center "PLAY (btn) REEL" Overlay */}
            <div className="absolute inset-0 flex items-center justify-center p-4 z-30 pointer-events-none">
              <div className="flex items-center gap-4 md:gap-10 pointer-events-auto">
                <span className="text-white font-satoshi font-bold text-4xl md:text-7xl lg:text-[7rem] tracking-tight drop-shadow-lg">
                  PLAY
                </span>

                {/* Pill Button */}
                <div
                  className="relative w-24 h-14 md:w-40 md:h-24 bg-white rounded-full flex items-center justify-center overflow-hidden transition-all duration-500 ease-out hover:scale-[1.05] hover:shadow-2xl cursor-pointer"
                  onMouseEnter={() => setIsPlayingHovered(true)}
                  onMouseLeave={() => setIsPlayingHovered(false)}
                  onClick={() => setIsVideoModalOpen(true)}
                >
                  {/* Blue sweep background from bottom */}
                  <div className={`absolute inset-0 bg-[#2383E2] transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${isPlayingHovered ? 'translate-y-0' : 'translate-y-[101%]'}`} />

                  {/* Play Icon (Black -> White on hover) */}
                  <svg
                    className={`w-6 h-6 md:w-10 md:h-10 relative z-10 transition-colors duration-500 ml-1 md:ml-2 ${isPlayingHovered ? 'text-white' : 'text-black'}`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>

                <span className="text-white font-satoshi font-bold text-4xl md:text-7xl lg:text-[7rem] tracking-tight drop-shadow-lg">
                  REEL
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Phase 2: Interactive Reel List ──────────────────────────────── */}
      <div className="relative w-full pt-10 pb-24" ref={sectionRef}>

        {/* Floating Reel Container */}
        <div
          ref={posRef}
          className="pointer-events-none fixed z-[9999]"
          style={{ top: 0, left: 0 }}
        >
          <motion.div
            animate={isHovering ? { scale: 1, opacity: 1 } : { scale: 0.55, opacity: 0 }}
            transition={{
              scale: { duration: isHovering ? 0.45 : 0.4, ease: isHovering ? [0.16, 1, 0.3, 1] : [0.7, 0, 0.84, 0] },
              opacity: { duration: isHovering ? 0.25 : 0.35, ease: isHovering ? "easeOut" : "easeIn" },
            }}
          >
            <div style={{ width: "300px", height: "300px", borderRadius: "8px", overflow: "hidden", position: "relative" }}>
              <AnimatePresence initial={false} custom={direction} mode="sync">
                <motion.div
                  key={activeProject.id}
                  custom={direction}
                  variants={reelVariants}
                  initial="enter"
                  animate="visible"
                  exit="exit"
                  style={{ position: "absolute", inset: 0, backgroundColor: activeProject.imageBg, willChange: "transform" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={activeProject.image} alt={activeProject.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </motion.div>
              </AnimatePresence>

              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, pointerEvents: "none" }}>
                <div style={{ background: "#3B67F5", color: "#fff", borderRadius: "999px", padding: "10px 26px", fontFamily: "Satoshi, Inter, sans-serif", fontSize: "16px", fontWeight: 500 }}>
                  View
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Content Container */}
        <div className="mx-auto" style={{ maxWidth: "1200px", paddingLeft: "40px", paddingRight: "40px" }}>

          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: "40px" }}
          >
            {/* <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(28, 22, 41, 0.4)" }}>
              Featured work
            </span> */}
          </motion.div>

          <ul style={{ listStyle: "none", margin: 0, padding: 0 }} onMouseLeave={handleListLeave}>
            {projects.map((project, index) => {
              const isActive = hoveredId === project.id
              return (
                <motion.li
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: index * 0.07 }}
                  onMouseEnter={() => handleEnter(project.id)}
                  style={{ position: "relative" }}
                >
                  <div style={{ height: "1px", background: "rgba(28, 22, 41, 0.12)" }} />

                  <Link href={project.href} style={{ textDecoration: "none", display: "block", cursor: "none" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 0" }}>
                      <h4
                        style={{
                          fontFamily: "Satoshi, Inter, sans-serif",
                          fontSize: "clamp(34px, 4.8vw, 72px)",
                          fontWeight: 500,
                          lineHeight: 1,
                          letterSpacing: "-0.02em",
                          margin: 0,
                          color: isHovering && !isActive ? "rgba(28,22,41,0.2)" : "rgba(28,22,41,1)",
                          transform: isActive ? "translateY(-2px)" : "translateY(0)",
                          transition: "color 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)",
                        }}
                      >
                        {project.name}
                      </h4>

                      <p
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          fontWeight: 400,
                          margin: 0,
                          whiteSpace: "nowrap",
                          paddingLeft: "24px",
                          flexShrink: 0,
                          color: isHovering && !isActive ? "rgba(28,22,41,0.12)" : "rgba(28,22,41,0.45)",
                          transition: "color 0.4s ease",
                        }}
                      >
                        {project.category}
                      </p>
                    </div>
                  </Link>
                </motion.li>
              )
            })}
            <div style={{ height: "1px", background: "rgba(28, 22, 41, 0.12)" }} />
          </ul>

        </div>
      </div>

      {/* Video Modal Overlay */}
      <VideoModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
        videoSrc="/video/Video-Showcase-Test.mp4" 
      />
    </section>
  )
}
