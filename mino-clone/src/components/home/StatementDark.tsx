'use client'

/**
 * STATEMENT DARK — Ground Truth from LIVE mino.works pixel scan:
 * ─────────────────────────────────────────────────────────────────
 * BG: #0A0A0A (near-black, confirmed screenshot)
 * Text: rgba(255,255,255,1) white
 * 'enough?' color: #F25F5C (warm coral — confirmed live screenshot pixel color)
 * Font: Space Grotesk 700
 * Size: clamp(28px, 3.2vw, 44px) — medium headline, not display
 * Align: CENTER (confirmed both lines centered)
 * Layout: 100vh section, flex center vertically and horizontally
 * Animation: On scroll enter — words fade up from y:20 opacity:0 with 0.05s stagger
 */

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function StatementDark() {
  const sectionRef = useRef<HTMLElement>(null)
  const line1Ref = useRef<HTMLDivElement>(null)
  const line2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Collect all .sw spans across both lines
      const allWords = sectionRef.current?.querySelectorAll('.sw')
      if (!allWords?.length) return

      gsap.fromTo(allWords,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.055,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        }
      )

      // Subtle upward parallax as section scrolls past
      gsap.to([line1Ref.current, line2Ref.current], {
        yPercent: -5,
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

  const w = (text: string) => (
    <span className="sw" style={{ display: 'inline-block', marginRight: '0.28em' }}>{text}</span>
  )

  const sharedFont: React.CSSProperties = {
    fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif",
    fontSize: 'clamp(28px, 3.2vw, 44px)',
    fontWeight: 700,
    letterSpacing: '-0.01em',
    lineHeight: 1.3,
    color: '#FFFFFF',
    display: 'block',
    textAlign: 'center',
  }

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#0A0A0A',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 40px',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div ref={line1Ref} style={sharedFont}>
          {w('What')} {w('you')} {w('build')} {w('is')} {w('beautiful.')}
        </div>
        <div ref={line2Ref} style={{ ...sharedFont, marginTop: '4px' }}>
          {w('But')} {w('is')} {w('beauty')}{' '}
          <span className="sw" style={{ display: 'inline-block', color: '#F25F5C' }}>enough?</span>
        </div>
      </div>
    </section>
  )
}
