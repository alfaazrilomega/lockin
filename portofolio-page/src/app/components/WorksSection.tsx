"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    id: 1,
    title: "Brand Identity",
    category: "Brand Identity",
    year: "2025",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Images",
    category: "Images",
    year: "2025",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Film",
    category: "Film",
    year: "2024",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Immersive Experience",
    category: "Immersive Experience",
    year: "2024",
    image: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Website Design",
    category: "Website Design",
    year: "2024",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1600&auto=format&fit=crop",
  },
]

export default function WorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const imageParallaxRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [imgSrc, setImgSrc] = useState(projects[0].image)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Update image on hover
  const handleProjectHover = (index: number) => {
    if (index === activeIndex) return
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveIndex(index)
      setImgSrc(projects[index].image)
      setIsTransitioning(false)
    }, 200)
  }

  // Scroll-linked image position with GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageParallaxRef.current,
        { y: -60 },
        {
          y: 60,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="works"
      className="relative bg-[#f5f0ea] min-h-screen flex flex-col justify-center px-8 md:px-20 py-24 text-[#1a1a1a]"
    >
      <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-start">

        {/* Left: Strict CSS Grid Links */}
        <div className="flex-1 w-full pt-4">
          <p className="text-[#9a9a9a] text-xs font-medium tracking-widest uppercase mb-12">
            Selected Works
          </p>
          <div className="flex flex-col">
            {/* Table Header (optional, implicitly defined by the first item's top border) */}
            <div className="border-t border-[#1a1a1a]/20"></div>

            {projects.map((project, i) => (
              <div
                key={project.id}
                onMouseEnter={() => handleProjectHover(i)}
                className={`group grid grid-cols-12 gap-4 items-center cursor-pointer border-b border-[#1a1a1a]/20 py-6 transition-opacity duration-300 ${
                  activeIndex === i ? "opacity-100" : "opacity-40"
                }`}
              >
                {/* 01, 02... */}
                <div className="col-span-2 md:col-span-2 text-[#9a9a9a] text-xs font-medium">
                  0{project.id}
                </div>
                
                {/* Title */}
                <div className="col-span-8 md:col-span-8 text-xl md:text-3xl font-medium tracking-tighter group-hover:translate-x-3 transition-transform duration-500" style={{ transitionTimingFunction: "cubic-bezier(0.76, 0, 0.24, 1)" }}>
                  {project.category}
                </div>
                
                {/* Year */}
                <div className="col-span-2 md:col-span-2 text-right text-[#9a9a9a] text-xs font-medium">
                  {project.year}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Scroll-linked image that changes per project */}
        <div className="flex-1 relative w-full h-[60vh] md:h-[80vh] overflow-hidden rounded-sm">
          <div
            ref={imageParallaxRef}
            className="absolute -top-20 -bottom-20 left-0 right-0"
          >
            <img
              src={imgSrc}
              alt={projects[activeIndex].category}
              className={`w-full h-full object-cover grayscale transition-opacity duration-500 ${
                isTransitioning ? "opacity-0" : "opacity-100"
              }`}
              style={{ transitionTimingFunction: "cubic-bezier(0.76, 0, 0.24, 1)" }}
            />
            {/* Subtle overlay label */}
            <div className="absolute bottom-24 left-6 text-white text-sm font-medium tracking-widest uppercase">
              {projects[activeIndex].category}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
