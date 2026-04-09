"use client"

import { motion, MotionValue, useTransform } from "framer-motion"

// Extracted from D:\lockincapstone\lockin\public\svg\squiggle.svg
const PATH_D = "M-24.5 101C285 315 5.86278 448.291 144.223 631.238C239.404 757.091 559.515 782.846 608.808 617.456C658.101 452.067 497.627 367.073 406.298 426.797C314.968 486.521 263.347 612.858 322.909 865.537C384.086 1125.06 79.3992 1007.94 100 1261.99C144.222 1807.35 819 1325 513 1142.5C152.717 927.625 -45 1916.5 1191.5 1852"

interface FlowingThreadProps {
  progress: MotionValue<number>
}

// Approximate calculated total length for the svg path to hide/reveal fully
const PATH_LENGTH = 6000

export default function FlowingThread({ progress }: FlowingThreadProps) {
  // ── HIDDEN — using Vector 1.svg inline in FeaturedSection instead ──
  // To restore scroll-draw animation, remove the return null below and uncomment:
  //   const dashoffset = useTransform(progress, [0, 1], [PATH_LENGTH, 0])
  //   const opacity = useTransform(progress, [0, 0.05], [0, 0.6])
  void progress // suppress unused-param warning
  return null

  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
      <svg
        className="w-full h-full transform-gpu"
        viewBox="0 0 1000 2000"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d={PATH_D}
          stroke="#5162FF"
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray={PATH_LENGTH}
          style={{
            strokeDashoffset: dashoffset,
            opacity: opacity,
            willChange: "stroke-dashoffset",
          }}
        />
      </svg>
    </div>
  )
}
