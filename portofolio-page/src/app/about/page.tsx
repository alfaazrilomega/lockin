"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

const EXPERIENCE = [
  {
    role: "Senior Product Designer",
    company: "Google",
    year: "2023 — Present",
  },
  {
    role: "Lead Designer",
    company: "Stripe",
    year: "2020 — 2023",
  },
  {
    role: "Product Designer",
    company: "Framer",
    year: "2018 — 2020",
  },
]

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".reveal-text",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
          delay: 0.2
        }
      )
      
      gsap.fromTo(
        ".reveal-row",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.6
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <main ref={containerRef} className="min-h-screen bg-background pt-40 px-6 pb-24 md:pb-32">
      <div className="max-w-3xl mx-auto flex flex-col gap-24">
        
        {/* Intro */}
        <section>
          <h1 className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed">
            <span className="block overflow-hidden pb-1">
              <span className="reveal-text block text-muted">I&apos;m a multidisciplinary designer</span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span className="reveal-text block text-foreground">currently building digital products</span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span className="reveal-text block text-muted">that merge high-end aesthetics</span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span className="reveal-text block text-foreground">with seamless utility.</span>
            </span>
          </h1>
        </section>

        {/* Experience Table */}
        <section>
          <div className="overflow-hidden pb-8">
            <h2 className="reveal-text text-sm font-medium text-muted uppercase tracking-wider mb-8">Experience</h2>
          </div>
          
          <div className="flex flex-col border-t border-border">
            {EXPERIENCE.map((exp, i) => (
              <div 
                key={i} 
                className="reveal-row flex flex-col md:flex-row justify-between py-6 border-b border-border group"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-medium text-foreground group-hover:text-white transition-colors">{exp.role}</span>
                  <span className="text-sm text-muted">{exp.company}</span>
                </div>
                <div className="mt-4 md:mt-0 text-sm text-muted tabular-nums">
                  {exp.year}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section>
          <div className="overflow-hidden pb-8">
            <h2 className="reveal-text text-sm font-medium text-muted uppercase tracking-wider mb-8">Contact</h2>
          </div>
          <div className="flex flex-col gap-4">
            <a href="mailto:hello@example.com" className="reveal-text text-2xl md:text-4xl font-medium text-foreground hover:text-muted transition-colors w-fit">
              hello@example.com
            </a>
            <div className="flex gap-6 mt-4">
              <a href="#" className="reveal-text text-sm text-muted hover:text-foreground transition-colors">Twitter</a>
              <a href="#" className="reveal-text text-sm text-muted hover:text-foreground transition-colors">LinkedIn</a>
              <a href="#" className="reveal-text text-sm text-muted hover:text-foreground transition-colors">Read.cv</a>
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}
