"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const partners = [
  { name: "Pentagram", url: "#" },
  { name: "Wolff Olins", url: "#" },
  { name: "Sagmeister & Walsh", url: "#" },
  { name: "Moving Brands", url: "#" },
  { name: "Base Design", url: "#" },
  { name: "Landor & Fitch", url: "#" },
]

export default function PartnersSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!listRef.current) return
      const items = listRef.current.querySelectorAll("li")

      // Each partner name slides up from below on scroll
      gsap.fromTo(
        items,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="bg-[#f5f0ea] px-8 md:px-20 py-24 border-t border-[#e0dbd4]"
    >
      <div className="flex flex-col md:flex-row gap-16 items-start">
        {/* Left label */}
        <div className="md:w-1/3">
          <p className="text-[#9a9a9a] text-xs tracking-widest uppercase font-medium sticky top-24">
            Our Partners
          </p>
        </div>

        {/* Right: Partner list */}
        <ul ref={listRef} className="flex-1 flex flex-col divide-y divide-[#e0dbd4]">
          {partners.map((partner, i) => (
            <li key={i}>
              <a
                href={partner.url}
                className="group flex items-center justify-between py-6 transition-all duration-300"
              >
                <span className="text-[#1a1a1a] text-2xl md:text-3xl font-medium tracking-tight group-hover:opacity-60 transition-opacity duration-300">
                  {partner.name}
                </span>
                {/* Arrow on hover */}
                <span className="text-[#9a9a9a] text-sm opacity-0 group-hover:opacity-100 translate-x-[-8px] group-hover:translate-x-0 transition-all duration-300">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
