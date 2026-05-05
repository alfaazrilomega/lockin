'use client'

/**
 * MISSION SECTION — Ground Truth from mino.works
 * ─────────────────────────────────────────────────
 * LAYOUT: White bg, full width container
 * Content structure (from live site scan):
 *   - "Our Mission" label (small caps, muted)
 *   - Large rotating word: "We design with [partnership/intention]"
 *   - Second line: "presenting your project as an icon in the market."
 *   - Two-column body text below
 *
 * ANIMATION (GSAP):
 *   - Word swap: each letter reveals from y:60%→0 with stagger
 *   - Scroll entrance: all content fades up on enter
 */

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const WORDS = ['partnership', 'intention']

export default function MissionSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const wordRef     = useRef<HTMLSpanElement>(null)
  const [wordIdx, setWordIdx] = useState(0)

  // Rotate word every 2.8s
  useEffect(() => {
    const timer = setInterval(() => setWordIdx(i => (i + 1) % WORDS.length), 2800)
    return () => clearInterval(timer)
  }, [])

  // Animate each character on word change
  useEffect(() => {
    if (!wordRef.current) return
    const chars = wordRef.current.querySelectorAll('.ch')
    gsap.fromTo(chars,
      { y: '60%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 0.5, stagger: 0.035, ease: 'power2.out' }
    )
  }, [wordIdx])

  // Scroll entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.mission-line',
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0, duration: 0.85, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', once: true },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const word = WORDS[wordIdx]

  return (
    <section ref={sectionRef} style={{
      background: '#ffffff',
      width: '100%',
      padding: 'clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px)',
    }}>

      {/* Section label */}
      <p className="mission-line" style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '11px', fontWeight: 600,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'rgba(10,10,10,0.45)',
        marginBottom: '48px',
      }}>
        Our Mission
      </p>

      {/* Line 1: "We design with [word]" */}
      <div className="mission-line" style={{ overflow: 'hidden', marginBottom: '4px' }}>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(36px, 5.5vw, 80px)',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          lineHeight: 1,
          color: '#0A0A0A',
          display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '0.25em',
        }}>
          <span>We design with</span>
          {/* Rotating animated word */}
          <span
            ref={wordRef}
            style={{ display: 'inline-flex', color: '#0A0A0A', overflow: 'hidden' }}
          >
            {word.split('').map((char, i) => (
              <span key={`${wordIdx}-${i}`} className="ch" style={{ display: 'inline-block' }}>
                {char}
              </span>
            ))}
          </span>
        </h2>
      </div>

      {/* Line 2 */}
      <div className="mission-line" style={{ overflow: 'hidden', marginBottom: 'clamp(48px, 7vw, 96px)' }}>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(36px, 5.5vw, 80px)',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          lineHeight: 1,
          color: '#0A0A0A',
        }}>
          presenting your project as an icon in the market.
        </h2>
      </div>

      {/* Body text — two columns */}
      <div className="mission-line" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'clamp(24px, 4vw, 56px)',
        maxWidth: '900px',
      }}>
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(15px, 1.4vw, 18px)',
          fontWeight: 400,
          color: 'rgba(10,10,10,0.65)',
          lineHeight: 1.65,
        }}>
          Art + Technology + Strategy are the pillars that sustain our relentless pursuit
          to showcase our clients&apos; projects at the highest level of the global market.
        </p>
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(15px, 1.4vw, 18px)',
          fontWeight: 400,
          color: 'rgba(10,10,10,0.65)',
          lineHeight: 1.65,
        }}>
          Regardless of historical heritage, architectural iconicity, or price range,
          any product can stand out in the market when presented the right way.
        </p>
      </div>
    </section>
  )
}
