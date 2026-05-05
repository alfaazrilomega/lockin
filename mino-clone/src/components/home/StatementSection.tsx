'use client'

/**
 * StatementSection — ONE pinned section (GSAP pin: true)
 *
 * Timeline (scrub 0→1 over 500% scroll):
 *  [0.00–0.16]  Dark letters: y→0 (clip-mask style, instant opacity, snappy)
 *  [0.14–0.22]  "enough?" letters: y→0 + color → #C44B2F
 *  [0.22–0.40]  HOLD: full text on pure black, "enough?" blazing red
 *  [0.40–0.52]  Dark text block exits up (opacity+y)
 *  [0.48–0.68]  Background: #0A0A0A → #4a4a4a → #717070 → #E8E8EA
 *  [0.64–0.92]  "Full stories are." per-letter blur entrance
 *  [0.93–1.00]  HOLD: full text on light gray
 */

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const DARK_LINE1   = 'What you build is beautiful.'
const DARK_LINE2   = 'But is beauty\u00a0'
const DARK_ENOUGH  = 'enough?'
const LIGHT_TEXT   = 'Full stories are.'

export default function StatementSection() {
  const wrapperRef  = useRef<HTMLDivElement>(null)
  const stickyRef   = useRef<HTMLDivElement>(null)
  const bgRef       = useRef<HTMLDivElement>(null)
  const darkBoxRef  = useRef<HTMLDivElement>(null)
  const enoughRef   = useRef<HTMLSpanElement>(null)
  const lightBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const darkLetters   = darkBoxRef.current?.querySelectorAll<HTMLElement>('.dl')
      const enoughLetters = enoughRef.current?.querySelectorAll<HTMLElement>('.el')
      const lightLetters  = lightBoxRef.current?.querySelectorAll<HTMLElement>('.ll')
      if (!darkLetters || !enoughLetters || !lightLetters) return

      const darkArr   = [...darkLetters]
      const enoughArr = [...enoughLetters]
      const lightArr  = [...lightLetters]

      /* ── Initial states: y-only entrance (opacity stays 1 once visible) ── */
      gsap.set(darkArr,   { y: -100, opacity: 1 })
      gsap.set(enoughArr, { y: -100, opacity: 1, color: 'rgba(255,255,255,0.25)' })
      gsap.set(lightArr,  { y: -28, opacity: 0, filter: 'blur(10px)' })

      /* ── Scrub master timeline ── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          pin: stickyRef.current,
          pinSpacing: true,
          start: 'top top',
          end: '+=500%',
          scrub: 0.8,
        },
      })

      // [0 → 0.16]: Dark letters snap to y=0 (crisp, no opacity fade on black)
      tl.to(darkArr, {
        y: 0,
        stagger: { each: 0.006 },
        duration: 0.08,
        ease: 'power3.out',
      }, 0)

      // [0.26 → 0.34]: "enough?" turns red
      tl.to(enoughArr, {
        color: '#C44B2F',
        stagger: { each: 0.006, from: 'start' },
        duration: 0.08,
        ease: 'power2.out',
      }, 0.26)

      // [0.40 → 0.52]: dark text exits up
      tl.to(darkBoxRef.current, {
        opacity: 0,
        y: -28,
        duration: 0.12,
        ease: 'power2.in',
      }, 0.40)

      // [0.48 → 0.68]: background color cascade (starts AFTER text exits)
      tl.to(bgRef.current, {
        backgroundColor: '#4a4a4a',
        duration: 0.10, ease: 'none',
      }, 0.48)
      .to(bgRef.current, {
        backgroundColor: '#717070',
        duration: 0.10, ease: 'none',
      })
      .to(bgRef.current, {
        backgroundColor: '#E8E8EA',
        duration: 0.12, ease: 'power1.out',
      })

      // [0.64 → 0.92]: "Full stories are." per-letter blur-in, alternating y depth
      lightArr.forEach((el, i) => {
        gsap.set(el, { y: i % 2 === 0 ? -28 : -18 })
        tl.to(el, {
          y: 0, opacity: 1, filter: 'blur(0px)',
          duration: 0.14,
          ease: 'power2.out',
        }, 0.64 + i * 0.015)
      })

    }, wrapperRef)

    return () => ctx.revert()
  }, [])

  const mkLetters = (text: string, cls: string) =>
    text.split('').map((ch, i) => (
      <span key={i} className={cls} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
        {ch}
      </span>
    ))

  return (
    <div ref={wrapperRef}>
      <div
        ref={stickyRef}
        style={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'relative' }}
      >
        {/* Background */}
        <div
          ref={bgRef}
          style={{ position: 'absolute', inset: 0, backgroundColor: '#0A0A0A', zIndex: 0 }}
        />

        {/* ── DARK TEXT ── */}
        <div
          ref={darkBoxRef}
          style={{
            position: 'absolute', inset: 0, zIndex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', textAlign: 'center',
            padding: '0 clamp(24px, 6vw, 120px)',
          }}
        >
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(26px, 3.2vw, 50px)',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.35,
            letterSpacing: '-0.02em',
            margin: 0,
          }}>
            <span style={{ display: 'block', overflow: 'hidden' }}>
              {mkLetters(DARK_LINE1, 'dl')}
            </span>
            <span style={{ display: 'block', overflow: 'hidden' }}>
              {mkLetters(DARK_LINE2, 'dl')}
              <span ref={enoughRef} style={{ display: 'inline-block' }}>
                {mkLetters(DARK_ENOUGH, 'dl el')}
              </span>
            </span>
          </p>
        </div>

        {/* ── LIGHT TEXT ── */}
        <div
          ref={lightBoxRef}
          style={{
            position: 'absolute', inset: 0, zIndex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 clamp(24px, 6vw, 120px)', textAlign: 'center',
          }}
        >
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(40px, 6.5vw, 100px)',
            fontWeight: 700,
            color: '#0A0A0A',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            margin: 0,
          }}>
            {mkLetters(LIGHT_TEXT, 'll')}
          </p>
        </div>
      </div>
    </div>
  )
}
