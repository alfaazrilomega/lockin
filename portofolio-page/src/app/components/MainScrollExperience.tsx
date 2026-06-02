"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { CustomEase } from "gsap/CustomEase"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import EntranceSequence from "./scroll/EntranceSequence"
import ChronologicalSequence from "./scroll/ChronologicalSequence"
import GridMatrixSequence from "./scroll/GridMatrixSequence"
import SkillsSection from "./scroll/SkillsSection"
import CoreValues from "./scroll/CoreValues"
import FooterSequence from "./scroll/FooterSequence"

export default function MainScrollExperience() {
  const heroRef = useRef<HTMLDivElement>(null)

  // Entrance Animation Refs
  const preloaderRef    = useRef<HTMLDivElement>(null)
  const counterRef      = useRef<HTMLDivElement>(null)
  const portraitContainerRef = useRef<HTMLDivElement>(null)
  const heroBoxRef      = useRef<HTMLDivElement>(null)

  // Scroll Scrub Refs
  const blackBoxRef          = useRef<HTMLDivElement>(null)
  const heroTextContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(CustomEase, ScrollTrigger)
    }

    document.body.style.overflow = "hidden"
    CustomEase.create("heavyCinematic", "0.76, 0, 0.24, 1")

    const ctx = gsap.context(() => {

      // ══════════════════════════════════════════════════════════════════
      // TIMELINE 1 ─ ENTRANCE (time-based, not scrubbed)
      // ══════════════════════════════════════════════════════════════════
      const entranceTl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "auto"
          const navbar = document.querySelector("#global-navbar")
          if (navbar) {
            gsap.to(navbar, { opacity: 1, duration: 1, ease: "power2.out" })
          }
        },
      })

      const counterObj = { val: 0 }
      entranceTl.to(counterObj, {
        val: 100,
        duration: 2.5,
        ease: "heavyCinematic",
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.innerText = Math.round(counterObj.val).toString()
          }
        },
      })

      entranceTl.to({}, { duration: 0.2 })
      entranceTl.to(preloaderRef.current, { opacity: 0, duration: 1.2, ease: "heavyCinematic" })
      entranceTl.fromTo(
        portraitContainerRef.current,
        { scale: 1.15, opacity: 0, filter: "brightness(0)" },
        { scale: 1, opacity: 1, filter: "brightness(1)", duration: 1.8, ease: "heavyCinematic" },
        "<"
      )
      entranceTl.fromTo(
        heroBoxRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.inOut" },
        "-=0.6"
      )
      entranceTl.to(".block-mask", {
        xPercent: 101,
        duration: 1.2,
        ease: "heavyCinematic",
        stagger: 0.15,
      }, "-=0.2")


      // ══════════════════════════════════════════════════════════════════
      // TIMELINE 2 ─ MASTER PINNED SCRUB  (end: +=28000)
      // ══════════════════════════════════════════════════════════════════
      const scrubTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "+=28000",
          pin: true,
          scrub: 1,
        },
      })

      // ── PHASE 1-4: HERO + CHRONOLOGICAL SEQUENCE ──────────────────────

      scrubTl.to(blackBoxRef.current, { scaleX: 25, scaleY: 25, duration: 1, ease: "power1.inOut" })
      scrubTl.to(heroTextContainerRef.current, { clipPath: "inset(0 0 0 100%)", duration: 1, ease: "none" })
      scrubTl.set(heroTextContainerRef.current, { pointerEvents: "none", opacity: 0 })

      const items = gsap.utils.toArray(".seq-item") as HTMLElement[]
      items.forEach((item, index) => {
        const isText  = item.classList.contains("type-text")
        const isImage = item.classList.contains("type-image")

        scrubTl.to(item, { opacity: 1, duration: 0.2 })

        if (isText) {
          const highlight = item.querySelector(".seq-text-highlight")
          scrubTl.to(highlight, { clipPath: "inset(0 0% 0 0)", duration: 1, ease: "none" })
          scrubTl.to({}, { duration: 0.5 })
          if (index < items.length - 1) {
            scrubTl.to(item, { clipPath: "inset(0 0 0 100%)", duration: 1, ease: "none" })
          }
        } else if (isImage) {
          const imgContainer = item.querySelector(".seq-image-container")
          scrubTl.to(imgContainer, { clipPath: "inset(0% 0 0 0)", duration: 1, ease: "none" })
          scrubTl.to({}, { duration: 0.5 })
          if (index < items.length - 1) {
            scrubTl.to(imgContainer, { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "none" })
          }
        }
        if (index < items.length - 1) scrubTl.set(item, { opacity: 0 })
      })

      // ── TRANSITION OUT OF CHRONOLOGICAL SEQUENCE ──────────────────────
      const lastText = items[items.length - 1]
      scrubTl.to(lastText, { clipPath: "inset(0 0 0 100%)", duration: 1, ease: "none" })


      // ── ARCHITECTURAL GRID MATRIX SEQUENCE ────────────────────────────
      scrubTl.to(".grid-matrix-wrapper", {
        clipPath: "inset(0 0 0 0)",
        duration: 2,
        ease: "power2.inOut",
      })
      // Hold for user to explore the grid sequence
      scrubTl.to({}, { duration: 2 })


      // ── B: SkillsSection card swipes up ───────────────────────────────
      scrubTl.to(".skills-sequence-wrapper", {
        clipPath: "inset(0 0 0 0)",
        duration: 1.5,
        ease: "power2.inOut",
      })
      // ── CINEMATIC PAUSE
      scrubTl.to({}, { duration: 0.8 })

      const skills = [0, 1, 2, 3]
      skills.forEach((index) => {
        scrubTl.addLabel(`skill-${index}`)
        
        // 1. Text turns white
        scrubTl.to(`.skill-text-${index}`, { color: "#ffffff", duration: 1 }, `skill-${index}`)
        
        // 2. Image wipes up from bottom
        scrubTl.to(`.skill-img-${index}`, { clipPath: "inset(0% 0 0 0)", duration: 2, ease: "power2.inOut" }, `skill-${index}`)
        
        // 3. (If not the last item) The text turns back to grey as we move to the next item
        if (index !== skills.length - 1) {
           scrubTl.to(`.skill-text-${index}`, { color: "rgba(255,255,255,0.3)", duration: 1 }, `skill-${index}+=2`)
        }
      })


      // ── C: CoreValues card swipes up ──────────────────────────────────
      scrubTl.to(".core-values-wrapper", {
        clipPath: "inset(0 0 0 0)",
        duration: 1.5,
        ease: "power2.inOut",
      })
      // ── CINEMATIC PAUSE
      scrubTl.to({}, { duration: 0.8 })

      const valCount = 3
      for (let i = 0; i < valCount; i++) {
        scrubTl.to(`.value-text-${i}`, { color: "#ffffff", duration: 0.5 })
        scrubTl.to({}, { duration: 1 })
        if (i < valCount - 1) {
          scrubTl.to(`.value-text-${i}`, { color: "rgba(255,255,255,0.18)", duration: 0.5 })
        }
      }

      // ── Giant "I don't" rises from bottom
      scrubTl.to(".giant-i-dont", { y: "30vh", duration: 2.5, ease: "power2.out" }, "-=2.5")

      // ── Header words pop up with light-grey tint, staggered
      scrubTl.to(".values-header", { opacity: 1, duration: 0.3 }, "<")
      for (let i = 0; i < 5; i++) {
        scrubTl.to(`.wipe-bg-${i}`, { y: 0, duration: 0.4, ease: "power2.out" }, `-=0.25`)
      }

      // ── Hold, then CoreValues exits (next card swipes over it)
      scrubTl.to({}, { duration: 0.8 })


      // ── D: FooterSequence card swipes up (light bg, z-[90]) ───────────
      // Initialize footer element states BEFORE scrubTl reaches this point
      gsap.set(".footer-animated-image", { xPercent: -50, yPercent: -50 })
      // 3D Entrance Initial State
      gsap.set(".footer-sequence-wrapper", { 
        y: "100vh", 
        rotateX: -25, 
        transformOrigin: "top center", 
        transformPerspective: 1500,
        clipPath: "inset(0 0 0 0)" // Remove clipPath hiding, we are using 3D transforms now
      })

      // 1. 3D Paper Sweep Entrance
      scrubTl.to(".footer-sequence-wrapper", { 
        y: "0vh", 
        rotateX: 0, 
        duration: 2.5, 
        ease: "power4.out" 
      })

      // 2. Strict Sequential Chaining: Wait for 3D entrance to complete
      scrubTl.addLabel("footerEntered")

      // 3. Cinematic Pause
      scrubTl.to({}, { duration: 0.5 }, "footerEntered")

      // 4. Image Shrinks to Center
      scrubTl.addLabel("footerShrink", "+=0.5")
      scrubTl.to(".footer-animated-image", { width: "30vw", height: "60vh", duration: 2.5, ease: "power2.inOut" }, "footerShrink")

      // 5. Typography Wipes In (Stepped Block Brushstroke Method)
      scrubTl.addLabel("footerTextReveal")
      // Tween background-position from 100% 0% (transparent zone) to -100% 0% (solid black tail)
      scrubTl.to(".footer-brushstroke-text", { backgroundPosition: "-100% 0%", duration: 2, stagger: 0.1, ease: "none" }, "footerTextReveal")
      
      // 6. Fade in static elements (labels & copyright)
      scrubTl.to([".footer-label-left", ".footer-label-right", ".footer-copyright"], { opacity: 1, duration: 1, stagger: 0.2 }, "footerTextReveal+=0.5")

      // End buffer
      scrubTl.to({}, { duration: 2 })

    }, heroRef)

    return () => {
      document.body.style.overflow = "auto"
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen bg-[#000000] overflow-hidden font-sans"
    >
      <EntranceSequence
        portraitContainerRef={portraitContainerRef}
        heroBoxRef={heroBoxRef}
        blackBoxRef={blackBoxRef}
        heroTextContainerRef={heroTextContainerRef}
        preloaderRef={preloaderRef}
        counterRef={counterRef}
      />

      <ChronologicalSequence />

      {/* Grid Matrix takes over the screen */}
      <div className="grid-matrix-wrapper absolute inset-0 z-[55] bg-black" style={{ clipPath: "inset(100% 0 0 0)" }}>
        <GridMatrixSequence />
      </div>

      {/* z-[60] – [90]: sealed, stacked cards */}
      <SkillsSection />
      <CoreValues />
      <FooterSequence />
    </section>
  )
}
