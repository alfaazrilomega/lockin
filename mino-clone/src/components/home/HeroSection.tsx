'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * HERO SECTION — Full animation spec:
 *
 * SCAN RESULT — On page load (entrance):
 * ─────────────────────────────────────
 * 1. Hero image: starts at scale(1.08), animates to scale(1.0) over 1.6s — slow Ken Burns settle
 * 2. "Framing": each line slides UP from y:100% inside an overflow:hidden clip mask — 1.0s power3.out
 * 3. "the future": same, stagger 0.12s after first line
 * 4. Square dot: fades in + scales from 0 after text is revealed
 * 5. Scroll hint "(Scroll Down)": fades in last, then has a subtle repeating bounce animation
 *
 * SCAN RESULT — On scroll (parallax):
 * ─────────────────────────────────────
 * 6. Hero image: moves at 0.4x scroll speed (parallax — stays while page scrolls)
 * 7. Hero text block: moves at 0.6x scroll speed (slower than page, faster than image)
 * 8. Scroll hint: fades out as user scrolls
 *
 * SCAN RESULT — No hover effects on hero (it's a fullscreen background, not interactive)
 */
export default function HeroSection() {
  const sectionRef   = useRef<HTMLElement>(null)
  const imgRef       = useRef<HTMLDivElement>(null)
  const textBlockRef = useRef<HTMLDivElement>(null)
  const dotRef       = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ─── 1. Image Ken Burns entrance settle ─── */
      gsap.fromTo(imgRef.current,
        { scale: 1.08 },
        { scale: 1.0, duration: 2.0, ease: 'power2.out', delay: 0 }
      )

      /* ─── 2-3. Text lines clip-mask reveal ─── */
      const tl = gsap.timeline({ delay: 0.25 })
      tl.fromTo('.hero-clip-inner',
        { y: '105%' },
        { y: '0%', duration: 1.0, ease: 'power3.out', stagger: 0.12 }
      )
      /* ─── 4. Square dot ─── */
      .fromTo(dotRef.current,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2.5)' },
        '-=0.15'
      )
      /* ─── 5. Scroll hint fade-in ─── */
      .fromTo(scrollHintRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.1'
      )

      /* ─── 5b. Scroll hint looping bounce ─── */
      gsap.to(scrollHintRef.current, {
        y: -5,
        duration: 1.1,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1.8,
      })

    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        position: 'relative',
        width:    '100%',
        height:   '100vh',
        minHeight: '560px',
        overflow: 'hidden',
      }}
    >
      {/* ── BACKGROUND IMAGE with parallax ref ── */}
      <div
        ref={imgRef}
        style={{
          position: 'absolute',
          inset:    0,
          zIndex:   0,
          backgroundImage:    'url(/hero-bg.jpg)',
          backgroundSize:     'cover',
          backgroundPosition: 'center 35%',
          backgroundRepeat:   'no-repeat',
          willChange:         'transform',
        }}
      />

      {/* ── GRADIENT OVERLAY ── */}
      <div style={{
        position:       'absolute',
        inset:          0,
        zIndex:         1,
        pointerEvents:  'none',
        background: [
          'linear-gradient(to top, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.18) 35%, rgba(0,0,0,0.02) 60%)',
          'linear-gradient(to right, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0) 50%)',
        ].join(', '),
      }} />

      {/* ── HERO TEXT BLOCK — bottom-left, flush ── */}
      <div
        ref={textBlockRef}
        style={{
          position: 'absolute',
          bottom:   0,
          left:     0,
          right:    0,
          zIndex:   2,
          padding:  '0 0 clamp(22px, 3.5vw, 52px) clamp(22px, 3.5vw, 52px)',
          willChange: 'transform',
        }}
      >
        {/* "Framing" — clip mask */}
        <div style={{ overflow: 'hidden', lineHeight: 0.93 }}>
          <div
            className="hero-clip-inner"
            style={{
              fontFamily:    "'Space Grotesk', 'Plus Jakarta Sans', sans-serif",
              fontSize:      'clamp(52px, 8.8vw, 126px)',
              fontWeight:    700,
              letterSpacing: '-0.025em',
              lineHeight:    0.93,
              color:         '#FFFFFF',
              display:       'block',
            }}
          >
            Framing
          </div>
        </div>

        {/* "the future" — clip mask */}
        <div style={{ overflow: 'hidden', lineHeight: 0.93 }}>
          <div
            className="hero-clip-inner"
            style={{
              fontFamily:    "'Space Grotesk', 'Plus Jakarta Sans', sans-serif",
              fontSize:      'clamp(52px, 8.8vw, 126px)',
              fontWeight:    700,
              letterSpacing: '-0.025em',
              lineHeight:    0.93,
              color:         '#FFFFFF',
              display:       'block',
            }}
          >
            the future
          </div>
        </div>

        {/* White square dot */}
        <div
          ref={dotRef}
          style={{
            width:      '9px',
            height:     '9px',
            background: '#FFFFFF',
            marginTop:  '16px',
          }}
        />
      </div>

      {/* ── SCROLL HINT — bottom-right ── */}
      <div
        ref={scrollHintRef}
        style={{
          position:   'absolute',
          bottom:     'clamp(22px, 3.5vw, 52px)',
          right:      'clamp(22px, 3.5vw, 52px)',
          zIndex:     2,
          display:    'flex',
          alignItems: 'center',
          gap:        '6px',
          willChange: 'transform, opacity',
        }}
      >
        <span style={{
          fontFamily:    "'Space Grotesk', sans-serif",
          fontSize:      '11px',
          fontWeight:    500,
          letterSpacing: '0.07em',
          color:         'rgba(255,255,255,0.82)',
        }}>
          (Scroll Down)
        </span>
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path d="M6 1.5v9M2 7l4 4 4-4"
            stroke="rgba(255,255,255,0.82)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  )
}
