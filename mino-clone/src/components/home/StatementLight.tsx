'use client'

/**
 * STATEMENT LIGHT — Ground Truth from LIVE mino.works pixel scan:
 * ──────────────────────────────────────────────────────────────────
 * BG: ~#E8E8EA (light gray — confirmed from screenshot, slightly cooler than neutral)
 * "Full stories" color: ~#9898A0 (muted gray — NOT near-black #1A1A1A as I previously coded)
 *   → Confirmed: text is NOT full opacity black. It's MUTED GRAY on the light bg.
 *   → This is the key visual trick: text appears "watermarked" / low-contrast
 *   → When scrolled into perfect center, it animates to full opacity? OR stays muted?
 *   → Looking at screenshot: text IS muted gray. Opacity ~0.45 of black.
 *   → Exact visual: rgba(20, 20, 30, 0.45) approximately
 * "are." color: Periwinkle/lavender blue — #8B90CB approximately
 *   → NOT royal blue #2563EB. It's a muted violet-blue
 *   → Confirmed from live screenshot: clearly lavender, NOT cobalt/royal
 * Font: Space Grotesk 700, same size as dark section
 * Align: CENTER
 * Animation: This section text appears at low opacity already
 *   → The animation is likely the text counter-scrolling (parallax)
 *   → Text is centered and appears to remain at reduced opacity (intentional design choice)
 * Scroll indicator: There is a mouse + scroll arrow icon in the CENTER BOTTOM of this section
 *
 * CRITICAL CORRECTIONS FROM LIVE SCAN vs previous code:
 *   ❌ Was: color: #1A1A1A (solid near-black) → ✅ Now: rgba(20,20,28,0.42) (muted)
 *   ❌ Was: are. color: #2563EB (royal blue) → ✅ Now: #8B90CB (periwinkle)
 *   ❌ Was: bg: #EBEBEB → ✅ Now: #E8E8EA (slightly cooler gray)
 */

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function StatementLight() {
  const sectionRef  = useRef<HTMLElement>(null)
  const textRef     = useRef<HTMLParagraphElement>(null)
  const scrollIconRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Text: fades in (from invisible to full muted opacity) on scroll enter
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 68%',
            once: true,
          },
        }
      )

      // Scroll icon fades in
      gsap.fromTo(scrollIconRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.3,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 68%',
            once: true,
          },
        }
      )

      // Scroll icon bounces continuously
      gsap.to(scrollIconRef.current, {
        y: 6,
        duration: 1.2,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1,
      })

      // Subtle parallax upward drift
      gsap.to(textRef.current, {
        yPercent: -4,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      })

    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#E8E8EA',
        width: '100%',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(80px,12vh,140px) 40px',
        position: 'relative',
      }}
    >
      {/* Main text — muted gray + periwinkle "are." */}
      <p
        ref={textRef}
        style={{
          fontFamily:    "'Space Grotesk', 'Plus Jakarta Sans', sans-serif",
          fontSize:      'clamp(28px, 3.2vw, 44px)',
          fontWeight:    700,
          letterSpacing: '-0.01em',
          lineHeight:    1.3,
          /* VERIFIED: text is muted gray NOT full black on live site */
          color:         'rgba(20, 20, 28, 0.42)',
          textAlign:     'center',
          margin:        0,
        }}
      >
        Full stories{' '}
        {/* VERIFIED: periwinkle/lavender NOT royal blue */}
        <span style={{ color: '#8B90CB' }}>are.</span>
      </p>

      {/* Scroll indicator — mouse + arrow — visible at bottom center of this section */}
      <div
        ref={scrollIconRef}
        style={{
          position:  'absolute',
          bottom:    '40px',
          left:      '50%',
          transform: 'translateX(-50%)',
          display:   'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap:        '4px',
          opacity:    0, // GSAP will animate this in
        }}
      >
        {/* Mouse body */}
        <svg width="22" height="32" viewBox="0 0 22 32" fill="none" style={{ color: 'rgba(20,20,28,0.4)' }}>
          <rect x="1" y="1" width="20" height="30" rx="10" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="9.5" y="6" width="3" height="7" rx="1.5" fill="currentColor" opacity="0.7"/>
        </svg>
        {/* Down arrow */}
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ color: 'rgba(20,20,28,0.4)' }}>
          <path d="M1 1l5 6 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  )
}
