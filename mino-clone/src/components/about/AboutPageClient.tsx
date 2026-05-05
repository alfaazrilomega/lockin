'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

/* ════════════════════════════════════════════════
   DATA
════════════════════════════════════════════════ */
const TEAM = [
  { name: 'Caio Cavalcanti',   bio: 'Caio is the creative compass of the team, guiding every project with vision and precision. His passion for storytelling transforms raw ideas into iconic imagery.', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=533&fit=crop&q=80' },
  { name: 'Filipa Valdemar',   bio: 'Filipa is the backbone of every project, orchestrating timelines and relationships with an effortless calm that keeps the team moving forward.', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=533&fit=crop&q=80' },
  { name: 'Mateus Pimenta',    bio: 'Mateus breathes life into architecture through pixels. His 3D renderings are not just accurate — they are aspirational.', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=533&fit=crop&q=80' },
  { name: 'Pedro Morais',      bio: 'Pedro builds the digital foundations that make great design accessible. His code is as clean as the visuals it powers.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=533&fit=crop&q=80' },
  { name: 'Alexandre Victor',  bio: 'Alê is the light-hearted spirit of the team, always bringing fun and good humor, even during the toughest deadlines. Thoughtful and independent, he enjoys helping and cares about the team.', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=533&fit=crop&q=80' },
  { name: 'Cauã Anderson',     bio: 'Cauã has a natural eye for light and composition. His photography captures the soul of every space he enters.', img: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=533&fit=crop&q=80' },
  { name: 'Diogo Romero',      bio: 'Diogo crafts identities that endure. His brand systems are built with logic but expressed with poetry.', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=533&fit=crop&q=80' },
  { name: 'Gabriel Fernandes', bio: 'Gabriel translates blueprints into beautiful realities. His visualizations help clients fall in love with spaces before they exist.', img: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=533&fit=crop&q=80' },
  { name: 'Gabriel Tamez',     bio: "Gabriel's work is detail-obsessed. He finds the micro moments — the texture of stone, the fall of afternoon light — that make renders feel lived-in.", img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=533&fit=crop&q=80' },
  { name: 'Javiera Alvarez',   bio: 'Javiera leads with instinct and refines with intelligence. Her art direction brings a rare poetic clarity to every campaign.', img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=533&fit=crop&q=80' },
  { name: 'Luiz Correa',       bio: 'Luiz is a visual storyteller in motion. His camera captures movement the way great writers capture feeling — with intention.', img: 'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?w=400&h=533&fit=crop&q=80' },
  { name: 'Maria Venâncio',    bio: 'Maria is the bridge between ambition and reality. She listens first, then builds the path that gets clients exactly where they want to go.', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=533&fit=crop&q=80' },
  { name: 'Mayumi Amaral',     bio: 'Mayumi designs interfaces the way a good host arranges a room — everything exactly where it should be, nothing extraneous.', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=533&fit=crop&q=80' },
  { name: 'Rafael Seiji',      bio: 'Rafael approaches visualization as sculpture. Every render he produces has weight, atmosphere, and soul.', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=533&fit=crop&q=80' },
  { name: 'Rafael Moreira',    bio: 'Rafael connects the dots between culture, market, and audience. His strategic thinking is the compass that keeps the team pointed toward what matters.', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=533&fit=crop&q=80' },
  { name: 'Renan Alves',       bio: 'Renan treats motion as a language. His animations speak clearly, even when they move in silence.', img: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=533&fit=crop&q=80' },
  { name: 'Sabrina Lemes',     bio: 'A beach lover whose soul is fueled by concerts, horror films, and anime marathons with friends. Whether gaming with her crew or lighting up karaoke nights, Sabrina brings energy to everything she does.', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=533&fit=crop&q=80' },
  { name: 'Thiago Barbosa',    bio: 'Thiago is relentlessly curious. He builds systems that are robust and elegant in equal measure.', img: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=533&fit=crop&q=80' },
  { name: 'Vitor Thomas',      bio: "Vitor's photography has a cinematic patience to it — he waits for the moment, then captures it perfectly.", img: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=533&fit=crop&q=80' },
  { name: 'William Avila',     bio: 'William is the engine room of every production. His ability to coordinate complexity while keeping the creative vision intact is unmatched.', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=533&fit=crop&q=80' },
]

// Ordered exactly like mino.works screenshot (left col → right col)
const PARTNERS_LEFT = [
  'Autonomy Capital (uk)', 'Aires Mateus (pt)', 'Astet Studio (es)',
  'Civilria (pt)', 'CostaTerra (pt)', 'Dekalo Real Estate (isr)',
  'Discovery Land (usa)', 'Dominio Capital (pt)', 'Emerge (pt)',
  'Eva Architects (cn)', 'Francisco Tojal (pt)', 'Gulf Craft (uae)',
  'Isaac Safdie (br)',
]
const PARTNERS_RIGHT = [
  'Joppe Kusters (nl)', 'Rawajeh Group (ksa)', 'Nomad Capital (pt)',
  'Masslab (pt)', 'Maven Investment (pt)', 'Morim Hummitzsch (no)',
  'OODA (pt)', 'Risco (pt)', 'Saraiva e Associados (pt)',
  'Souto de Moura (pt)', 'Tabnit S.A. (pt)', 'Ventura + Partners (pt)',
  'Wayne (ch)',
]

/* ════════════════════════════════════════════════
   HOOK — IntersectionObserver for scroll animations
════════════════════════════════════════════════ */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return { ref, inView }
}

/* ════════════════════════════════════════════════
   ATOM: TeamCard
════════════════════════════════════════════════ */
function TeamCard({ member }: { member: typeof TEAM[0] }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      style={{ position: 'relative', width: '100%', paddingBottom: '133.33%', overflow: 'hidden', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: 'absolute', inset: 0, filter: 'grayscale(100%) contrast(1.05)' }}>
        <Image src={member.img} alt={member.name} fill sizes="25vw"
          style={{ objectFit: 'cover', objectPosition: 'center top' }} unoptimized />
      </div>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, #3B2FC9 0%, #C44B2F 100%)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.35s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: 'clamp(16px, 2vw, 28px)',
      }}>
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(18px, 1.8vw, 26px)',
          fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '10px',
          transform: hovered ? 'translateY(0)' : 'translateY(8px)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1) 0.05s',
        }}>{member.name}</p>
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(10px, 1vw, 13px)',
          fontWeight: 400, color: 'rgba(255,255,255,0.82)', lineHeight: 1.55,
          transform: hovered ? 'translateY(0)' : 'translateY(12px)',
          transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1) 0.08s',
        }}>{member.bio}</p>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════
   ATOM: Animated heading (clip-path reveal)
   Matches mino.works: text is clipped and slides up from below
════════════════════════════════════════════════ */
function AnimatedHeading({
  text, className, tag: Tag = 'h2', immediate = false,
}: { text: string; className: string; tag?: 'h1' | 'h2'; immediate?: boolean }) {
  const { ref, inView } = useInView(0.1)
  const visible = immediate || inView
  return (
    <div ref={immediate ? undefined : ref} style={{ overflow: 'hidden' }}>
      <Tag
        className={className}
        style={{
          transform: visible ? 'translateY(0)' : 'translateY(110%)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.9s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ease',
          display: 'block',
        }}
      >
        {text}
      </Tag>
    </div>
  )
}

/* ════════════════════════════════════════════════
   ATOM: WorldMap — SVG with gradient country blobs
   Inline so no extra dependency, styled like mino.works
════════════════════════════════════════════════ */
function WorldMap() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 320 }}>
      {/* Base: gray world map SVG from Wikipedia (free, no tiles needed) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
        alt="World map"
        style={{ width: '100%', height: '100%', objectFit: 'contain',
          filter: 'grayscale(1) contrast(0.55) brightness(1.2)', opacity: 0.6 }}
      />
      {/* Gradient blobs on partner regions */}
      <svg viewBox="0 0 1000 500" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <defs>
          <radialGradient id="g-eu" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B2FC9" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#C44B2F" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="g-us" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B2FC9" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#3B2FC9" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="g-br" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C44B2F" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#C44B2F" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="g-me" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C44B2F" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#C44B2F" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="g-cn" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B2FC9" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#3B2FC9" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Europe cluster: PT, ES, GB, NL, NO, CH */}
        <ellipse cx="476" cy="170" rx="60" ry="45" fill="url(#g-eu)" />
        {/* USA */}
        <ellipse cx="215" cy="190" rx="75" ry="50" fill="url(#g-us)" />
        {/* Brazil */}
        <ellipse cx="298" cy="315" rx="55" ry="50" fill="url(#g-br)" />
        {/* Middle East: UAE, Saudi, Israel */}
        <ellipse cx="570" cy="218" rx="50" ry="38" fill="url(#g-me)" />
        {/* China */}
        <ellipse cx="728" cy="188" rx="52" ry="40" fill="url(#g-cn)" />
      </svg>
    </div>
  )
}

/* ════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════ */
export default function AboutPageClient() {
  const { ref: teamRef, inView: teamInView } = useInView(0.05)
  const { ref: partnersRef, inView: partnersInView } = useInView(0.05)
  const { ref: whyRef, inView: whyInView } = useInView(0.2)

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        /* ── HERO ── */
        .about-hero {
          background: #EEEEF0;
          width: 100%;
          min-height: 85vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: clamp(40px, 5vw, 72px);
          padding: clamp(120px, 14vw, 180px) clamp(24px, 5vw, 80px) clamp(64px, 8vw, 100px);
        }
        .hero-block-1 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(24px, 3.2vw, 46px);
          font-weight: 700;
          color: #0A0A0A;
          letter-spacing: -0.025em;
          line-height: 1.12;
          max-width: 90%;
        }
        .hero-block-2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(20px, 2.6vw, 38px);
          font-weight: 700;
          color: #0A0A0A;
          letter-spacing: -0.025em;
          line-height: 1.15;
          margin-left: clamp(20px, 8vw, 120px);
          max-width: 90%;
        }

        /* ── TEAM ── */
        .team-section { background: #ffffff; width: 100%; }

        /* Heading wrapper — overflow hidden for clip animation */
        .team-heading-wrap { overflow: hidden; padding: clamp(48px, 6vw, 80px) clamp(24px, 5vw, 80px) 0; }
        .team-heading {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(64px, 10vw, 140px);
          font-weight: 700;
          color: #0A0A0A;
          letter-spacing: -0.04em;
          line-height: 0.9;
          padding-bottom: clamp(32px, 4vw, 56px);
          display: block;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          width: 100%;
        }

        /* ── PARTNERS ── */
        .partners-section {
          background: #F5F5F3;
          width: 100%;
        }

        /* "Our Partners" — HUGE display heading like mino.works */
        .partners-heading-wrap {
          overflow: hidden;
          padding: clamp(56px, 7vw, 100px) clamp(24px, 5vw, 80px) 0;
        }
        .partners-heading {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(64px, 9vw, 130px);
          font-weight: 700;
          color: #0A0A0A;
          letter-spacing: -0.04em;
          line-height: 0.92;
          display: block;
        }

        /* Map + list layout (left: map, right: 2-col partner list) */
        .partners-body {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(32px, 4vw, 60px);
          align-items: start;
          padding: clamp(40px, 5vw, 72px) clamp(24px, 5vw, 80px) clamp(56px, 7vw, 100px);
        }

        .partners-map-wrap {
          width: 100%;
          aspect-ratio: 16/9;
        }

        /* Two-column partner list on the right */
        .partners-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          align-content: start;
        }

        .partner-item {
          font-family: 'Space Grotesk', sans-serif !important;
          font-size: clamp(12px, 1.1vw, 15px);
          font-weight: 400 !important;
          color: #0A0A0A !important;
          padding: 10px 0;
          border-bottom: 1px solid rgba(10,10,10,0.08);
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.5s ease, transform 0.5s ease, color 0.2s ease;
          text-decoration: none !important;
        }
        .partner-item * { color: #0A0A0A !important; }
        .partner-item:hover { color: rgba(10,10,10,0.38) !important; opacity: 0.38; }
        .partner-item.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* "Why not you as well?" — bottom line */
        .why-wrap {
          overflow: hidden;
          padding: 0 clamp(24px, 5vw, 80px) clamp(56px, 7vw, 100px);
          border-top: 1px solid rgba(10,10,10,0.1);
          padding-top: clamp(32px, 4vw, 56px);
        }
        .why-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(28px, 4vw, 56px);
          font-weight: 700;
          color: #0A0A0A;
          letter-spacing: -0.03em;
          line-height: 1;
          display: block;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .team-grid { grid-template-columns: repeat(2, 1fr); }
          .partners-body { grid-template-columns: 1fr; }
          .hero-block-2 { margin-left: 0; }
        }
        @media (max-width: 500px) {
          .team-grid { grid-template-columns: repeat(2, 1fr); }
          .partners-list { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ═══ SECTION 1: HERO ═══ */}
      <section className="about-hero">
        <p className="hero-block-1">
          We are more than creators; we are passionate about the journey.
          Storytellers, innovators, and artists from diverse fields and backgrounds,
          united by a singular purpose: to redefine how your projects are perceived.
        </p>
        <p className="hero-block-2">
          As part of Devotion Group, we fuse strategic insight with the art of visual
          storytelling, crafting narratives that elevate your projects to the next level.
          Guided by a humanistic perspective, committed partners for the long term.
        </p>
      </section>

      {/* ═══ SECTION 2: THE TEAM ═══ */}
      <section className="team-section">
        {/* Animated heading — clip-path slide-up on scroll */}
        <div ref={teamRef} className="team-heading-wrap">
          <span
            className="team-heading"
            style={{
              transform: teamInView ? 'translateY(0)' : 'translateY(110%)',
              opacity: teamInView ? 1 : 0,
              transition: 'transform 0.95s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease',
            }}
          >
            The Team
          </span>
        </div>

        <div className="team-grid">
          {TEAM.map((m) => <TeamCard key={m.name} member={m} />)}
        </div>
      </section>

      {/* ═══ SECTION 3: OUR PARTNERS ═══ */}
      <section className="partners-section">
        {/* "Our Partners" — huge heading, scroll-animated */}
        <div ref={partnersRef} className="partners-heading-wrap">
          <span
            className="partners-heading"
            style={{
              transform: partnersInView ? 'translateY(0)' : 'translateY(110%)',
              opacity: partnersInView ? 1 : 0,
              transition: 'transform 0.95s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease',
            }}
          >
            Our Partners
          </span>
        </div>

        {/* Body: map LEFT, partner list RIGHT */}
        <div className="partners-body">
          {/* World map */}
          <div className="partners-map-wrap">
            <WorldMap />
          </div>

          {/* Two-column partner list */}
          <div className="partners-list">
            {/* Left column */}
            <div>
              {PARTNERS_LEFT.map((p, i) => (
                <div
                  key={p}
                  className={`partner-item ${partnersInView ? 'visible' : ''}`}
                  style={{
                    transitionDelay: partnersInView ? `${i * 40}ms` : '0ms',
                    transitionDuration: '0.5s',
                    color: '#0A0A0A',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  <span style={{ color: '#0A0A0A', fontFamily: "'Space Grotesk', sans-serif" }}>{p}</span>
                </div>
              ))}
            </div>
            {/* Right column */}
            <div>
              {PARTNERS_RIGHT.map((p, i) => (
                <div
                  key={p}
                  className={`partner-item ${partnersInView ? 'visible' : ''}`}
                  style={{
                    transitionDelay: partnersInView ? `${i * 40 + 100}ms` : '0ms',
                    transitionDuration: '0.5s',
                    color: '#0A0A0A',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  <span style={{ color: '#0A0A0A', fontFamily: "'Space Grotesk', sans-serif" }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* "Why not you as well?" */}
        <div ref={whyRef} className="why-wrap">
          <span
            className="why-text"
            style={{
              transform: whyInView ? 'translateY(0)' : 'translateY(110%)',
              opacity: whyInView ? 1 : 0,
              transition: 'transform 0.9s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease',
            }}
          >
            Why not you as well?
          </span>
        </div>
      </section>
    </>
  )
}
