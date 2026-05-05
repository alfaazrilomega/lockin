'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const TESTIMONIALS = [
  {
    quote: 'Working with MINO has been an inspiring experience. Their deep knowledge of the real estate sector, combined with a dynamic and creative team, authentically captures the essence of our brand and amplifies our communication.',
    author: 'Catarina Pita',
    company: 'Alma Development (Panhard)',
  },
  {
    quote: "We've been working with MINO on several projects, and the experience has been excellent. They have a solid understanding of architectural design and always deliver renders with precise lighting, materials, and composition.",
    author: 'Discovery Land',
    company: 'CostaTerra',
  },
  {
    quote: 'Excellent work, communication with Mino was always super easy and efficient. They really made our job easy!',
    author: 'Madalena Abecasis',
    company: 'JLL',
  },
  {
    quote: 'Working with Mino was a great experience. Their art direction and sensibility were outstanding, capturing the essence of the design with clarity and style.',
    author: 'Isaac Safdie',
    company: 'Isaac Safdie Architects',
  },
]

export default function TestimonialsSection() {
  const [active, setActive] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const quoteRef   = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const timer = setInterval(() => setActive(i => (i + 1) % TESTIMONIALS.length), 5500)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!quoteRef.current) return
    gsap.fromTo(quoteRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
  }, [active])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.ttest-heading', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const t = TESTIMONIALS[active]

  return (
    <section ref={sectionRef} style={{
      background: '#ffffff',
      width: '100%',
      padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)',
      borderTop: '1px solid #E9E9E7',
    }}>
      <h2 className="ttest-heading" style={{
        fontFamily: "'Space Grotesk',sans-serif",
        fontSize: 'clamp(40px,5.5vw,80px)',
        fontWeight: 700,
        letterSpacing: '-0.025em',
        lineHeight: 1,
        color: '#0A0A0A',
        marginBottom: 'clamp(48px,7vw,80px)',
      }}>
        We build trust.
      </h2>

      <div style={{ maxWidth: '760px' }}>
        <p ref={quoteRef} style={{
          fontFamily: "'Space Grotesk',sans-serif",
          fontSize: 'clamp(18px,2.2vw,26px)',
          fontWeight: 400,
          color: '#0A0A0A',
          lineHeight: 1.6,
          marginBottom: '32px',
        }}>
          &ldquo;{t.quote}&rdquo;
        </p>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '14px', fontWeight: 600, color: '#0A0A0A' }}>
            {t.author}
          </span>
          <span style={{ width: '1px', height: '12px', background: 'rgba(10,10,10,0.25)' }} />
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '13px', color: 'rgba(10,10,10,0.5)' }}>
            {t.company}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '40px' }}>
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              width: i === active ? '24px' : '8px',
              height: '8px',
              borderRadius: '100px',
              background: i === active ? '#0A0A0A' : 'rgba(10,10,10,0.18)',
              border: 'none',
              cursor: 'pointer',
              transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1), background 0.3s ease',
              padding: 0,
            }} aria-label={`Testimonial ${i + 1}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
