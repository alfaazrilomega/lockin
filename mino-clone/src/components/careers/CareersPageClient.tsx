'use client'

import { useState, useRef, useEffect } from 'react'

/* ─────────────────────────── DATA ─────────────────────────── */
const JOBS = [
  {
    id: 'financial-controller',
    title: 'Financial Controller',
    department: 'Finance',
    type: 'Full-time remote',
    description: 'We are looking for a Finance Controller to take control of the company\'s finances in a hands-on, responsible, and structured way. You will be responsible for ensuring that the company\'s financial operations are organized, controlled, and predictable, while also supporting international expansion.',
  },
  {
    id: 'creative-director',
    title: 'Creative Director',
    department: 'Brand/Design',
    type: 'Full-time remote',
    description: 'We are looking for a Creative Director / Lead Brand Designer who can shape distinctive brand worlds with clarity and intention. You will lead the creation of identities that translate architecture, place and vision into coherent visual and narrative systems. Through concept, typography, composition and storytelling, your work will give each development a unique voice and cultural presence. A refined design sensibility and strong strategic thinking are essential.',
  },
  {
    id: 'brand-designer',
    title: 'Designer',
    department: 'Brand/Design',
    type: 'Full-time remote',
    description: 'We are looking for Brand Designers who can shape distinctive brand worlds with clarity and intention. You will contribute to the creation of identities that translate architecture, place and vision into coherent visual and narrative systems. Through concept, typography, composition and storytelling, your work will help give each development a unique voice and cultural presence. A refined design sensibility and strong conceptual thinking are essential.',
  },
  {
    id: 'engineer',
    title: 'Engineer',
    department: 'Brand/Design',
    type: 'Full-time remote',
    description: 'We are looking for Brand Designers who can shape distinctive brand worlds with clarity and intention. You will contribute to the creation of identities that translate architecture, place and vision into coherent visual and narrative systems. Through concept, typography, composition and storytelling, your work will help give each development a unique voice and cultural presence. A refined design sensibility and strong conceptual thinking are essential.',
  },
  {
    id: 'motion-designer',
    title: 'Motion Designer',
    department: 'Film & Motion',
    type: 'Full-time remote',
    description: 'We are looking for a Motion Designer with a passion for architectural storytelling. You will craft cinematic motion pieces — teasers, brand films, and social content — that bring our clients\' developments to life through light, rhythm, and narrative.',
  },
]

const PERKS = [
  {
    title: 'Work on Ambitious Projects',
    description: 'You will work on Real Estate developments across Europe and the Middle East, helping transform architecture into distinctive brands and immersive visual experiences.',
  },
  {
    title: 'Multidisciplinary Collaboration',
    description: 'Our studio brings together brand designers, artists, strategists and technologists. Projects are developed collaboratively, where ideas move fluidly between disciplines.',
  },
  {
    title: 'Craft and Excellence',
    description: 'We care deeply about detail, precision and originality. Every project is an opportunity to raise the standard of how Real Estate is communicated and experienced.',
  },
  {
    title: 'Room to Grow',
    description: 'We value curious minds who want to evolve their craft. At Mino, you will be encouraged to develop your ideas, refine your skills and contribute to the evolution of the studio.',
  },
]

/* ─────────────────────────── HOOK ─────────────────────────── */
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

/* ─────────────────────────── JOB ITEM ─────────────────────────── */
function JobItem({ job, index }: { job: typeof JOBS[0]; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const { ref, inView } = useInView(0.05)

  return (
    <div
      ref={ref}
      style={{
        borderBottom: '1px solid rgba(10,10,10,0.1)',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.6s ease ${index * 0.06}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.06}s`,
      }}
    >
      {/* Header row — always visible */}
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr auto auto',
          alignItems: 'center',
          gap: 24,
          padding: 'clamp(20px,2.5vw,32px) 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <div>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(18px,2vw,26px)',
            fontWeight: 700,
            color: '#0A0A0A',
            letterSpacing: '-0.015em',
            marginBottom: 4,
          }}>{job.title}</p>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '13px', fontWeight: 500,
            color: 'rgba(10,10,10,0.4)',
            letterSpacing: '0.02em',
          }}>{job.department}</p>
        </div>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '12px', fontWeight: 600,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          color: 'rgba(10,10,10,0.4)',
          padding: '5px 12px',
          border: '1px solid rgba(10,10,10,0.15)',
          borderRadius: 100,
          whiteSpace: 'nowrap',
        }}>{job.type}</span>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '20px',
          color: '#0A0A0A',
          transform: expanded ? 'rotate(45deg)' : 'rotate(0)',
          transition: 'transform 0.3s ease',
          display: 'inline-block',
          lineHeight: 1,
        }}>+</span>
      </button>

      {/* Expanded content */}
      <div style={{
        maxHeight: expanded ? 400 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div style={{ padding: '0 0 32px' }}>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(14px,1.1vw,16px)',
            color: 'rgba(10,10,10,0.65)',
            lineHeight: 1.7,
            maxWidth: 640,
            marginBottom: 24,
          }}>{job.description}</p>
          <button style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '13px', fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            padding: '11px 28px',
            background: '#0A0A0A',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            borderRadius: 2,
            transition: 'background 0.2s ease',
          }}>
            Join Us
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────── PAGE ─────────────────────────── */
export default function CareersPageClient() {
  const { ref: heroRef, inView: heroInView } = useInView(0.1)
  const { ref: perksRef, inView: perksInView } = useInView(0.05)

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .careers-hero {
          background: #EEEEF0;
          padding: clamp(110px,14vw,170px) clamp(24px,5vw,80px) clamp(48px,6vw,64px);
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 20px;
        }
        .careers-heading {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(52px,8vw,120px);
          font-weight: 700; color: #0A0A0A;
          letter-spacing: -0.04em; line-height: 0.92;
          display: block;
        }
        .careers-hero-label {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: rgba(10,10,10,0.4);
          align-self: flex-start; padding-top: 8px;
        }
        .careers-subtitle {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(16px,1.6vw,22px);
          font-weight: 400;
          color: rgba(10,10,10,0.55);
          line-height: 1.6;
          max-width: 640px;
          margin-top: 24px;
        }

        /* Jobs list */
        .jobs-section {
          background: #ffffff;
          padding: clamp(48px,6vw,80px) clamp(24px,5vw,80px);
        }
        .jobs-section-label {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 12px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(10,10,10,0.35);
          margin-bottom: 32px;
        }

        /* Perks section */
        .perks-section {
          background: #0A0A0A;
          padding: clamp(64px,8vw,100px) clamp(24px,5vw,80px);
        }
        .perks-heading {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(36px,5vw,72px);
          font-weight: 700; color: #fff;
          letter-spacing: -0.03em; line-height: 1;
          margin-bottom: clamp(40px,5vw,64px);
        }
        .perks-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(24px,3vw,48px);
        }
        .perk-item {
          padding: clamp(24px,3vw,36px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 4px;
        }
        .perk-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(16px,1.6vw,22px);
          font-weight: 700; color: #fff;
          letter-spacing: -0.01em;
          margin-bottom: 12px;
        }
        .perk-desc {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px; font-weight: 400;
          color: rgba(255,255,255,0.55);
          line-height: 1.7;
        }

        /* CTA bottom */
        .careers-cta {
          background: #EEEEF0;
          padding: clamp(48px,6vw,80px) clamp(24px,5vw,80px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
        }
        .careers-cta-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(22px,3vw,40px);
          font-weight: 700; color: #0A0A0A;
          letter-spacing: -0.02em;
        }
        .careers-cta-btn {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase;
          padding: 14px 32px;
          background: #0A0A0A; color: #fff;
          border: none; cursor: pointer;
          border-radius: 2px;
          text-decoration: none;
          transition: background 0.2s ease;
          display: inline-block;
        }
        .careers-cta-btn:hover { background: #333; }

        @media (max-width: 700px) {
          .perks-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="careers-hero">
        <div>
          <div style={{ overflow: 'hidden' }}>
            <h1 className="careers-heading">
              Careers
            </h1>
          </div>
          <p className="careers-subtitle">
            Build the future of real estate communication. We are a remote-first studio working on ambitious projects across Europe and the Middle East.
          </p>
        </div>
        <span className="careers-hero-label">(CAREERS)</span>
      </section>

      {/* ── OPEN POSITIONS ── */}
      <section className="jobs-section">
        <p className="jobs-section-label">Open positions</p>
        {JOBS.map((job, i) => (
          <JobItem key={job.id} job={job} index={i} />
        ))}
      </section>

      {/* ── WHY MINO ── */}
      <section className="perks-section">
        <h2 className="perks-heading">Why Mino?</h2>
        <div
          ref={perksRef}
          className="perks-grid"
        >
          {PERKS.map((perk, i) => (
            <div
              key={perk.title}
              className="perk-item"
              style={{
                opacity: perksInView ? 1 : 0,
                transform: perksInView ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s`,
              }}
            >
              <h3 className="perk-title">{perk.title}</h3>
              <p className="perk-desc">{perk.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DISCOVER CTA ── */}
      <section className="careers-cta">
        <span className="careers-cta-text">Discover who we are</span>
        <a href="/about" className="careers-cta-btn">About Mino →</a>
      </section>
    </>
  )
}
