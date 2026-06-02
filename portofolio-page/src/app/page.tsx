"use client"

import dynamic from "next/dynamic"

// Dynamic imports to avoid SSR issues with GSAP ScrollTrigger
const MainScrollExperience = dynamic(() => import("./components/MainScrollExperience"), { ssr: false })

export default function Home() {
  return (
    <main className="bg-[#000000]">
      {/* ① Master Sequence: cinematic entrance animation and massive scroll scrub */}
      <MainScrollExperience />
    </main>
  )
}
