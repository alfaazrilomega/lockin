'use client'

/**
 * FOOTER — mino.works pixel-accurate rebuild
 * ═══════════════════════════════════════════
 *
 * 60% SOURCE: Screenshots confirm:
 *   - position: sticky; bottom: 0; z-index: 0 (content scrolls OVER it)
 *   - height: 100vh (fills full viewport)
 *   - Dark bg: approximately #0A0A0A with a purple/blue/dark video gradient
 *   - LEFT half: Logo → LARGE stacked nav links (~3.5rem font, bold)
 *   - RIGHT half: Contact | Social | Newsletter — stacked vertically
 *   - BOTTOM row: GIANT "mino®" wordmark (fills width ~23vw tall) + copyright bottom-right
 *   - The giant wordmark letters have a video-driven gradient color behind them (clip-path or blended)
 *   - Copyright: small, right-aligned: "MMXXV © MINO. ALL RIGHTS RESERVED"
 *
 * 20% DOM: From LockIn reference (same architectural pattern confirmed):
 *   - footer className: sticky bottom-0 left-0 w-full h-[100vh] z-0 overflow-hidden flex flex-col justify-between
 *   - Giant logo: text-[23vw] font-black leading-[0.75] tracking-tighter -ml-[1vw]
 *   - Nav links: text-4xl lg:text-[2.8rem] font-bold tracking-tight
 *
 * 20% PATTERN: Standard agency footer pattern (e.g. Dogstudio, Basic, Locomotive)
 *   - Sticky footer that content scrolls over = zero-work scroll effect
 *   - Giant wordmark = brand ownership statement
 *
 * DIFFERENCE from LockIn: Background is dark #0A0A0A not video
 */

import Link from 'next/link'
import { useState } from 'react'

const NAV_LINKS = [
  { label: 'Works',    href: '/works'    },
  { label: 'Services', href: '/services' },
  { label: 'About',    href: '/about'    },
  { label: 'Careers',  href: '/careers'  },
  { label: 'Blog',     href: '/blog'     },
]

export default function Footer() {
  const [email, setEmail] = useState('')

  return (
    <footer
      id="site-footer"
      style={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(32px, 4vw, 64px) clamp(24px, 4vw, 64px) clamp(16px, 2.5vw, 32px)',
        background: '#0A0A0A',
        color: '#ffffff',
        fontFamily: "'Space Grotesk', sans-serif",
        boxSizing: 'border-box',
      }}
    >
      {/* ── TOP HALF: Two-column layout ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        flex: 1,
        gap: '40px',
      }}>

        {/* LEFT: Nav links */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          width: '50%',
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(28px, 3.5vw, 48px)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  textDecoration: 'none',
                  lineHeight: 1.1,
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.5')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(28px, 3.5vw, 48px)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#ffffff',
                textDecoration: 'none',
                lineHeight: 1.1,
                transition: 'opacity 0.2s ease',
                marginTop: '8px',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.5')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Get in Touch
            </Link>
          </nav>
        </div>

        {/* RIGHT: Contact + Social + Newsletter */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 'clamp(32px, 5vw, 80px)',
          width: '50%',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
        }}>

          {/* Contact + Newsletter stacked */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {/* Contact */}
            <div>
              <p style={{
                fontSize: '11px', fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '16px',
              }}>
                contact
              </p>
              <a href="tel:351916740305" style={{ display: 'block', fontSize: '15px', fontWeight: 500, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: '6px', transition: 'color 0.2s ease' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
              >PT +351 916 740 305</a>
              <a href="tel:34611851141" style={{ display: 'block', fontSize: '15px', fontWeight: 500, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: '8px', transition: 'color 0.2s ease' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
              >ES +34 611 851 141</a>
              <p style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(255,255,255,0.3)', marginTop: '8px' }}>
                Around the world.
              </p>
            </div>

            {/* Newsletter */}
            <div>
              <p style={{
                fontSize: '11px', fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '16px',
              }}>
                Subscribe to our newsletter
              </p>
              <form
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  borderBottom: '1px solid rgba(255,255,255,0.2)',
                  paddingBottom: '8px',
                }}
                onSubmit={e => { e.preventDefault() }}
              >
                <input
                  type="email"
                  placeholder="Enter your email*"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '14px',
                    fontWeight: 400,
                    color: '#ffffff',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    flexShrink: 0,
                    background: '#ffffff',
                    color: '#0A0A0A',
                    border: 'none',
                    borderRadius: '100px',
                    padding: '6px 16px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    fontFamily: "'Space Grotesk', sans-serif",
                    cursor: 'pointer',
                    transition: 'opacity 0.2s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  SUBSCRIBE
                </button>
              </form>
            </div>
          </div>

          {/* Social */}
          <div>
            <p style={{
              fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '16px',
            }}>
              Our Voice
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a
                href="https://www.instagram.com/mino.works/"
                target="_blank" rel="noopener noreferrer"
                style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
              >Instagram</a>
              <a
                href="https://www.linkedin.com/company/mino-works/"
                target="_blank" rel="noopener noreferrer"
                style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
              >LinkedIn</a>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM: Giant wordmark + copyright ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        width: '100%',
        marginTop: 'auto',
      }}>
        {/*
          Giant mino® — fills full width bottom
          Screenshot confirms: letters take up ~50% of viewport height
          Match LockIn's text-[23vw] font-black leading-[0.75] tracking-tighter -ml-[1vw]
        */}
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(100px, 21vw, 300px)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 0.8,
            color: '#ffffff',
            marginLeft: '-0.5vw',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          mino<span style={{
            fontSize: '6vw',
            verticalAlign: 'super',
            position: 'relative',
            top: '0.5vw',
            fontWeight: 700,
          }}>®</span>
        </h1>

        {/* Copyright — bottom right */}
        <p style={{
          fontSize: '11px',
          fontWeight: 500,
          color: 'rgba(255,255,255,0.45)',
          textAlign: 'right',
          maxWidth: '180px',
          lineHeight: 1.4,
          paddingBottom: '0.5vw',
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
        }}>
          MMXXV © MINO.<br />ALL RIGHTS RESERVED
        </p>
      </div>
    </footer>
  )
}
