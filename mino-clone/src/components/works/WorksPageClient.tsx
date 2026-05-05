'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

/* ─────────────────────────── DATA ─────────────────────────── */
const PROJECTS = [
  {
    id: 'palacio-do-comercio',
    title: 'Palácio do Comércio',
    subtitle: 'Luxury set in Heritage.',
    category: 'Brand Identity · Images · Film',
    img: 'https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=1400&h=900&fit=crop&q=85',
  },
  {
    id: 'le-mirage',
    title: 'Le Mirage',
    subtitle: 'Glimpse into the unseen.',
    category: 'Brand Identity · Film · Website',
    img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1400&h=900&fit=crop&q=85',
  },
  {
    id: 'west-island',
    title: 'West Island',
    subtitle: 'An exclusive collection of luxury waterfront villas in the Maldives, where architecture meets ocean serenity.',
    category: 'Brand Identity · 3D Images · Website',
    img: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1400&h=900&fit=crop&q=85',
  },
  {
    id: 'nomad-eden',
    title: 'Nomad Eden',
    subtitle: 'Where nature and luxury converge.',
    category: 'Brand Identity · Images · Immersive Experience',
    img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1400&h=900&fit=crop&q=85',
  },
  {
    id: 'civitala',
    title: 'Civitala',
    subtitle: 'Modern living, timeless character.',
    category: 'Brand Identity · Website Design',
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&h=900&fit=crop&q=85',
  },
  {
    id: 'herdade-da-aroeira',
    title: 'Herdade da Aroeira',
    subtitle: 'Golf, nature, and coastal living.',
    category: 'Images · Film',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=900&fit=crop&q=85',
  },
  {
    id: 'costa-terra',
    title: 'CostaTerra',
    subtitle: "Portugal's finest coastal resort.",
    category: 'Brand Identity · Images · Film · Website',
    img: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1400&h=900&fit=crop&q=85',
  },
  {
    id: 'golden-bay',
    title: 'Golden Bay',
    subtitle: 'A new landmark in Mediterranean living.',
    category: 'Brand Identity · 3D Images',
    img: 'https://images.unsplash.com/photo-1537944434965-cf4679d1a598?w=1400&h=900&fit=crop&q=85',
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

/* ─────────────────────────── PROJECT ITEM ─────────────────────────── */
function ProjectItem({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const [hovered, setHovered] = useState(false)
  const { ref, inView } = useInView(0.05)

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        cursor: 'pointer',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.8s ease ${index * 0.1}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${index * 0.1}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Full-bleed image */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/7', overflow: 'hidden' }}>
        <Image
          src={project.img}
          alt={project.title}
          fill
          sizes="100vw"
          style={{
            objectFit: 'cover',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)',
          }}
          unoptimized
        />
        {/* Dark overlay on hover */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.28)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }} />
        {/* Title overlay — bottom left */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: 'clamp(20px,3vw,40px)',
          background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
        }}>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(22px,3vw,42px)',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginBottom: 6,
          }}>{project.title}</p>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(12px,1.1vw,15px)',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.78)',
            lineHeight: 1.4,
            maxWidth: 600,
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.35s ease, transform 0.35s ease',
          }}>{project.subtitle}</p>
        </div>
      </div>

      {/* Category tag below image */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px clamp(16px,2vw,32px)',
        borderBottom: '1px solid rgba(10,10,10,0.1)',
        background: '#EEEEF0',
      }}>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'rgba(10,10,10,0.45)',
        }}>{project.category}</span>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          color: 'rgba(10,10,10,0.35)',
          transform: hovered ? 'translateX(4px)' : 'translateX(0)',
          transition: 'transform 0.3s ease',
        }}>→</span>
      </div>
    </div>
  )
}

/* ─────────────────────────── PAGE ─────────────────────────── */
export default function WorksPageClient() {
  const { ref: heroRef, inView: heroInView } = useInView(0.1)

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        .works-hero {
          background: #EEEEF0;
          padding: clamp(110px,14vw,170px) clamp(24px,5vw,80px) clamp(40px,5vw,60px);
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          flex-wrap: wrap;
        }
        .works-hero-label {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(12px,1vw,14px);
          font-weight: 500;
          letter-spacing: 0.08em;
          color: rgba(10,10,10,0.4);
          text-transform: uppercase;
          align-self: flex-start;
          padding-top: 8px;
        }
        .works-hero-heading {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(52px,8vw,120px);
          font-weight: 700;
          color: #0A0A0A;
          letter-spacing: -0.04em;
          line-height: 0.92;
          display: block;
        }
        .works-list { background: #EEEEF0; }
        @media (max-width: 600px) {
          .works-hero { flex-direction: column; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="works-hero">
        <div style={{ overflow: 'hidden' }}>
          <h1 className="works-hero-heading">Selected Works</h1>
        </div>
        <span className="works-hero-label">(WORKS)</span>
      </section>

      {/* ── PROJECT LIST ── */}
      <section className="works-list">
        {PROJECTS.map((project, i) => (
          <ProjectItem key={project.id} project={project} index={i} />
        ))}
      </section>
    </>
  )
}
