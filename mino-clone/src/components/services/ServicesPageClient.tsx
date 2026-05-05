'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

/* ─────────────────────────── DATA ─────────────────────────── */
const SERVICES = [
  {
    id: 'brand-identity',
    number: '01',
    title: 'Brand Identity',
    description: 'Your brand is the silent ambassador of your project. It shapes perception, builds trust, and creates a visual language that audiences recognize and remember at another level. We develop brand identities that are intentional, timeless, and aligned with your architectural and commercial goals. Built to elevate every touchpoint.',
    steps: ['Define', 'Design', 'Apply'],
    works: [
      { name: 'West Island', img: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&h=400&fit=crop&q=80' },
      { name: 'Palácio do Comércio', img: 'https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=600&h=400&fit=crop&q=80' },
    ],
  },
  {
    id: 'images',
    number: '02',
    title: 'Images',
    description: 'Still images are often your audience\'s first encounter, and there\'s only one chance to make it unforgettable. From architectural photography to meticulously crafted CGI, we create visuals that capture both precision and emotion. By blending artistic direction with technical mastery, every image we produce feels cinematic, authentic, and deeply aligned with your vision.',
    steps: ['Concept', 'Model & Light', 'Refine', 'Deliver'],
    works: [
      { name: 'Nomad Eden', img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop&q=80' },
      { name: 'West Island', img: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&h=400&fit=crop&q=80' },
    ],
  },
  {
    id: 'film',
    number: '03',
    title: 'Film',
    description: 'Film activates emotion like no other medium. It brings architecture to life, allowing viewers to feel a space, not just see it. We create short films, teasers, and documentaries that blend rhythm, light, and narrative, designed to move audiences and amplify your project\'s impact.',
    steps: ['Concept', 'Script & Styleframe', 'Production', 'Delivery'],
    works: [
      { name: 'Palácio do Comércio', img: 'https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=600&h=400&fit=crop&q=80' },
      { name: 'Le Mirage', img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&h=400&fit=crop&q=80' },
    ],
  },
  {
    id: 'immersive-experience',
    number: '04',
    title: 'Immersive Experience',
    description: 'Interaction transforms viewers into active participants. Our bespoke applications deliver immersive journeys where users can navigate layouts, switch units, and explore finishes in real time, experiencing the project as if it were already theirs. Every interface is designed to turn complexity into clarity, uniting refined aesthetics with intelligent functionality to elevate sales, launches, and engagement.',
    steps: ['UX Planning', 'Interface Design', 'Development', 'Launch Support'],
    works: [
      { name: 'Nomad Eden', img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop&q=80' },
      { name: 'Le Mirage', img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&h=400&fit=crop&q=80' },
    ],
  },
  {
    id: 'website-design',
    number: '05',
    title: 'Website Design',
    description: 'Your website is more than a digital brochure; it is your brand\'s flagship. When built with purpose, it informs, persuades, and converts. We craft custom-designed websites with seamless UX, striking visuals, and a clear narrative that positions your project for genuine impact.',
    steps: ['Structure', 'Design', 'Development', 'Launch'],
    works: [
      { name: 'Le Mirage', img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&h=400&fit=crop&q=80' },
    ],
  },
  {
    id: 'marketing-consultancy',
    number: '06',
    title: 'Marketing Consultancy',
    description: 'Behind every great project there is a sharp strategy. We help define positioning, audience, and messaging that align with your vision and market potential. Through research, insight, and creative planning, we develop strategic roadmaps that enhance visibility, drive engagement, and prepare your launch for lasting impact.',
    steps: ['Discovery & Research', 'Brand Positioning', 'Strategic Roadmap', 'Execution Support'],
    works: [],
  },
]

const PRICING = [
  {
    name: 'Essence',
    tagline: 'Essential tools for a quick launch.',
    featured: false,
    features: ['Brand Identity', '3D Images', 'Floor Plans', 'Commercial Booklet', 'Website', 'Photography'],
  },
  {
    name: 'Signature',
    tagline: 'For high-impact, full-scale campaigns.',
    featured: true,
    features: ['Brand Identity', '3D Images', 'Floor Plans', 'Commercial Booklet', 'Website', 'Photography', 'Virtual Tours', 'Promotional Film'],
  },
  {
    name: 'Core',
    tagline: 'For mid-sized enterprises.',
    featured: false,
    features: ['Brand Identity', '3D Images', 'Floor Plans', 'Commercial Booklet', 'Website', 'Photography', 'Virtual Tours'],
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

/* ─────────────────────────── SERVICE SECTION ─────────────────────────── */
function ServiceSection({ service, index }: { service: typeof SERVICES[0]; index: number }) {
  const { ref, inView } = useInView(0.08)
  const isEven = index % 2 === 0

  return (
    <div
      ref={ref}
      id={service.id}
      style={{
        borderTop: '1px solid rgba(10,10,10,0.1)',
        padding: 'clamp(48px,6vw,80px) clamp(24px,5vw,80px)',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)',
        background: isEven ? '#ffffff' : '#F9F9F7',
      }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(32px,5vw,80px)',
        alignItems: 'start',
      }}>
        {/* LEFT: number + title + description + steps */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 24 }}>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '12px', fontWeight: 600,
              letterSpacing: '0.08em', color: 'rgba(10,10,10,0.35)',
              textTransform: 'uppercase',
            }}>{service.number}</span>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(28px,3.5vw,52px)',
              fontWeight: 700,
              color: '#0A0A0A',
              letterSpacing: '-0.025em',
              lineHeight: 1.05,
            }}>{service.title}</h2>
          </div>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(14px,1.1vw,16px)',
            color: 'rgba(10,10,10,0.6)',
            lineHeight: 1.7,
            marginBottom: 32,
            maxWidth: 520,
          }}>{service.description}</p>

          {/* Process steps */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {service.steps.map((step, i) => (
              <span key={step} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px', fontWeight: 600,
                letterSpacing: '0.05em', textTransform: 'uppercase',
                color: '#0A0A0A',
                padding: '6px 14px',
                border: '1px solid rgba(10,10,10,0.15)',
                borderRadius: 100,
              }}>
                <span style={{ color: 'rgba(10,10,10,0.35)', fontSize: '10px' }}>0{i + 1}</span>
                {step}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT: work thumbnails */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {service.works.length > 0 ? (
            service.works.map((work) => (
              <div key={work.name} style={{ position: 'relative', overflow: 'hidden', borderRadius: 4 }}>
                <Image
                  src={work.img}
                  alt={work.name}
                  width={600} height={340}
                  style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block' }}
                  unoptimized
                />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '16px 20px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
                }}>
                  <span style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '14px', fontWeight: 600, color: '#fff',
                  }}>{work.name}</span>
                </div>
              </div>
            ))
          ) : (
            <div style={{
              height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px dashed rgba(10,10,10,0.15)', borderRadius: 4,
              color: 'rgba(10,10,10,0.3)',
              fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px',
            }}>
              Strategy-first — no fixed visuals
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────── PAGE ─────────────────────────── */
export default function ServicesPageClient() {
  const { ref: heroRef, inView: heroInView } = useInView(0.1)
  const { ref: pricingRef, inView: pricingInView } = useInView(0.05)

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .services-hero {
          background: #EEEEF0;
          padding: clamp(110px,14vw,170px) clamp(24px,5vw,80px) 0;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 20px;
        }
        .services-hero-label {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: rgba(10,10,10,0.4);
          align-self: flex-start; padding-top: 8px;
        }
        .services-heading {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(52px,8vw,120px);
          font-weight: 700; color: #0A0A0A;
          letter-spacing: -0.04em; line-height: 0.92;
          display: block;
        }

        /* Tab nav */
        .services-tabs {
          background: #EEEEF0;
          padding: clamp(32px,4vw,52px) clamp(24px,5vw,80px) 0;
          display: flex; gap: 24px; flex-wrap: wrap;
          border-bottom: 1px solid rgba(10,10,10,0.1);
        }
        .tab-link {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px; font-weight: 600;
          letter-spacing: 0.05em; text-transform: uppercase;
          color: rgba(10,10,10,0.4);
          padding-bottom: 14px;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: color 0.2s ease, border-color 0.2s ease;
          text-decoration: none;
        }
        .tab-link:hover { color: #0A0A0A; border-bottom-color: #0A0A0A; }

        /* Pricing */
        .pricing-section {
          background: #EEEEF0;
          padding: clamp(64px,8vw,100px) clamp(24px,5vw,80px);
        }
        .pricing-label {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 12px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(10,10,10,0.35); margin-bottom: 8px;
        }
        .pricing-heading {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(36px,5vw,72px);
          font-weight: 700; color: #0A0A0A;
          letter-spacing: -0.03em; line-height: 1;
          margin-bottom: clamp(40px,5vw,64px);
          display: block;
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          border: 1px solid rgba(10,10,10,0.12);
          border-radius: 4px;
          overflow: hidden;
        }
        .pricing-card {
          padding: clamp(24px,3vw,40px);
          border-right: 1px solid rgba(10,10,10,0.12);
          background: #ffffff;
        }
        .pricing-card:last-child { border-right: none; }
        .pricing-card.featured {
          background: #0A0A0A;
        }
        .pricing-card-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(20px,2.2vw,28px);
          font-weight: 700;
          letterSpacing: -0.02em;
          margin-bottom: 8px;
        }
        .pricing-card-tagline {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px; font-weight: 400;
          line-height: 1.5;
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(10,10,10,0.1);
        }
        .pricing-card.featured .pricing-card-tagline {
          border-bottom-color: rgba(255,255,255,0.15);
        }
        .pricing-feature {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px; font-weight: 400;
          padding: 8px 0;
          border-bottom: 1px solid rgba(10,10,10,0.06);
        }
        .pricing-card.featured .pricing-feature {
          border-bottom-color: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.85);
        }
        .pricing-feature:last-of-type { border-bottom: none; }
        .pricing-check { font-size: 14px; color: rgba(10,10,10,0.35); }
        .pricing-card.featured .pricing-check { color: rgba(255,255,255,0.45); }
        .pricing-cta {
          display: block; width: 100%;
          margin-top: 24px;
          padding: 12px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase;
          text-align: center;
          border: 1.5px solid #0A0A0A;
          background: transparent;
          color: #0A0A0A;
          cursor: pointer;
          transition: background 0.25s ease, color 0.25s ease;
        }
        .pricing-cta:hover { background: #0A0A0A; color: #fff; }
        .pricing-card.featured .pricing-cta {
          border-color: #fff; color: #fff; background: transparent;
        }
        .pricing-card.featured .pricing-cta:hover {
          background: #fff; color: #0A0A0A;
        }

        @media (max-width: 900px) {
          .pricing-grid { grid-template-columns: 1fr; }
          .pricing-card { border-right: none; border-bottom: 1px solid rgba(10,10,10,0.12); }
          .pricing-card:last-child { border-bottom: none; }
          /* service section cols */
          .service-cols { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="services-hero">
        <div style={{ overflow: 'hidden' }}>
          <h1 className="services-heading">Services</h1>
        </div>
        <span className="services-hero-label">(SERVICES)</span>
      </section>

      {/* ── ANCHOR NAV TABS ── */}
      <nav className="services-tabs">
        {SERVICES.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="tab-link">{s.title}</a>
        ))}
      </nav>

      {/* ── SERVICE SECTIONS ── */}
      {SERVICES.map((service, i) => (
        <ServiceSection key={service.id} service={service} index={i} />
      ))}

      {/* ── PRICING ── */}
      <section className="pricing-section">
        <div ref={pricingRef}>
          <p className="pricing-label">Pricing</p>
          <span
            className="pricing-heading"
            style={{
              display: 'block',
              transform: pricingInView ? 'translateY(0)' : 'translateY(20px)',
              opacity: pricingInView ? 1 : 0,
              transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ease',
            }}
          >
            Let&apos;s frame<br />your vision
          </span>
        </div>

        <div className="pricing-grid">
          {PRICING.map((plan) => (
            <div key={plan.name} className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
              <h3
                className="pricing-card-name"
                style={{ color: plan.featured ? '#fff' : '#0A0A0A' }}
              >
                {plan.name}
              </h3>
              <p
                className="pricing-card-tagline"
                style={{ color: plan.featured ? 'rgba(255,255,255,0.6)' : 'rgba(10,10,10,0.5)' }}
              >
                {plan.tagline}
              </p>
              {plan.features.map((f) => (
                <div key={f} className="pricing-feature">
                  <span className="pricing-check">✓</span>
                  <span>{f}</span>
                </div>
              ))}
              <button className="pricing-cta">Know More</button>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
