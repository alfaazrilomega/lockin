"use client"

import { useRef } from "react"
import { useScroll, useSpring } from "framer-motion"
import FlowingThread from "./flowing-thread"

const SPRING_CFG = { stiffness: 100, damping: 30, restDelta: 0.001 } as const

export default function ContentWrapper({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Apply Lusion spring physics to the global tracking scroll
  const smoothProgress = useSpring(scrollYProgress, SPRING_CFG)

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden bg-background">
      {/* Global left-margin flowing thread tracking the entire wrapper */}
      <FlowingThread progress={smoothProgress} />
      
      {/* Content Layer -> Must have relative z-10 so backgrounds cover the SVG if needed, but margin areas are transparent */}
      <div className="relative z-10 w-full flex flex-col">
        {children}
      </div>
    </div>
  )
}
