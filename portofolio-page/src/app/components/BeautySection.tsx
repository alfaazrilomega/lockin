"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

function ScrollFillText({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // We target the white duplicate text layer which starts at opacity 0
    const fillLayers = containerRef.current?.querySelectorAll(".word-fill")
    if (!fillLayers) return

    const ctx = gsap.context(() => {
      // Scrub the opacity from 0 to 1 as the user scrolls
      gsap.to(fillLayers, {
        opacity: 1,
        stagger: 0.1, // Staggers the fill so it happens word-by-word
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "center center",
          scrub: true,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="flex flex-wrap leading-tight tracking-tight">
      {text.split(" ").map((word, i) => (
        <span key={i} className="relative mr-3 md:mr-5 xl:mr-6 mt-2">
          {/* Base dark grey text that blends into the background */}
          <span className="text-[#333333]">{word}</span>
          
          {/* Pure white text that overlays the grey and fades in on scrub */}
          <span className="word-fill text-[#f4f4f4] absolute left-0 top-0 opacity-0">
            {word}
          </span>
        </span>
      ))}
    </div>
  )
}

export default function BeautySection() {
  return (
    <section className="relative w-full min-h-screen bg-[#000000] flex items-center justify-center overflow-hidden font-sans py-40">
      <div className="px-8 sm:px-16 md:px-24 flex flex-col gap-1 max-w-6xl w-full">
        <div className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium max-w-5xl">
          <ScrollFillText text="Unforgettable memories are not defined by details." />
        </div>
      </div>
    </section>
  )
}
