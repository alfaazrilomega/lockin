'use client'

import Link from 'next/link'

const NAV_LINKS = [
  { label: 'WORKS',    href: '/works'    },
  { label: 'SERVICES', href: '/services' },
  { label: 'ABOUT',    href: '/about'    },
  { label: 'CAREERS',  href: '/careers'  },
  { label: 'BLOG',     href: '/blog'     },
]

export default function Navigation() {
  return (
    <>
      <style>{`
        .mino-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 68px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          padding: 0 clamp(24px, 4vw, 52px);
          z-index: 9999;
          background: transparent;
          mix-blend-mode: difference;
        }

        /* LOGO — verified ~62px from pixel measurement (real "mino" = 166px wide at 1016px viewport) */
        .mino-logo {
          font-size: 62px;
          font-weight: 700;
          letter-spacing: -0.04em;
          color: #fff;
          text-decoration: none;
          line-height: 1;
          cursor: pointer;
          font-family: 'Space Grotesk', sans-serif;
        }

        /* NAV LINKS WRAPPER */
        .mino-links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 32px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        /* INDIVIDUAL LINK */
        .mino-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #fff;
          text-decoration: none;
          cursor: pointer;
          font-family: 'Space Grotesk', sans-serif;
          transition: opacity 0.2s ease;
        }
        .mino-link:hover { opacity: 0.7; }

        /* BULLET BOX — solid square slides in before hovered link
           Using width/height box (NOT content:'■') for reliable rendering */
        .mino-link .nav-dot {
          display: inline-block;
          width: 5px;
          height: 5px;
          background: currentColor;
          flex-shrink: 0;
          opacity: 0;
          transform: translateX(-8px);
          margin-right: 0;
          transition:
            opacity 0.2s ease,
            transform 0.2s ease,
            margin-right 0.2s ease;
        }
        .mino-link:hover .nav-dot {
          opacity: 1;
          transform: translateX(0);
          margin-right: 5px;
        }

        /* GET IN TOUCH */
        .mino-cta {
          display: inline-flex;
          align-items: center;
          padding: 9px 22px;
          border-radius: 100px;
          border: 1.5px solid #fff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #fff;
          text-decoration: none;
          background: transparent;
          cursor: pointer;
          white-space: nowrap;
          font-family: 'Space Grotesk', sans-serif;
          transition: opacity 0.2s ease;
        }
        .mino-cta:hover { opacity: 0.7; }
      `}</style>

      <nav className="mino-nav" aria-label="Main navigation">
        <Link href="/" className="mino-logo">mino</Link>

        <ul className="mino-links">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <Link href={link.href} className="mino-link">
                <span className="nav-dot" aria-hidden="true" />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link href="/contact" className="mino-cta">GET IN TOUCH</Link>
        </div>
      </nav>
    </>
  )
}
