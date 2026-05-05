'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

/* ─────────────────────────── DATA ─────────────────────────── */
const CATEGORIES = ['View All', 'Mino News', 'Mino Stories', 'Inside Mino', 'Market Insights']

const POSTS = [
  {
    id: 'nomad-eden-james-edition',
    category: 'Mino News',
    date: 'AUG 8, 2025',
    title: 'Nomad Eden Featured on James Edition',
    excerpt: 'Nomad Eden has been featured by James Edition — a recognition that celebrates our team\'s vision and dedication.',
    img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=530&fit=crop&q=85',
    featured: true,
  },
  {
    id: 'mino-redesign-2025',
    category: 'Inside Mino',
    date: 'JUL 22, 2025',
    title: 'Mino\'s New Website: A Reflection of Who We Are',
    excerpt: 'We redesigned our website from the ground up — a new digital identity that better reflects the quality and vision we bring to every project.',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=530&fit=crop&q=85',
    featured: false,
  },
  {
    id: 'real-estate-visual-storytelling',
    category: 'Market Insights',
    date: 'JUN 5, 2025',
    title: 'Why Visual Storytelling is the New Sales Force in Real Estate',
    excerpt: 'The luxury real estate market has fundamentally changed. Buyers don\'t just buy property — they buy a vision. Here\'s how visuals drive decisions.',
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=530&fit=crop&q=85',
    featured: false,
  },
  {
    id: 'palacio-do-comercio-brand',
    category: 'Mino Stories',
    date: 'MAY 18, 2025',
    title: 'Palácio do Comércio: Building a Brand Around Heritage',
    excerpt: 'When a historic Lisbon palace becomes a luxury hotel, the challenge is clear: how do you honor a century of history while speaking to modern buyers?',
    img: 'https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=800&h=530&fit=crop&q=85',
    featured: false,
  },
  {
    id: 'le-mirage-film',
    category: 'Mino Stories',
    date: 'APR 2, 2025',
    title: 'Le Mirage: The Film That Moved Before the Project Did',
    excerpt: 'We created a cinematic teaser for Le Mirage before construction even began. The goal was to make people feel the project before they could see it.',
    img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=530&fit=crop&q=85',
    featured: false,
  },
  {
    id: 'west-island-maldives',
    category: 'Mino Stories',
    date: 'MAR 14, 2025',
    title: 'West Island: Visualizing Paradise Before It Exists',
    excerpt: 'The Maldives project pushed our 3D team to the limit — replicating crystal-clear waters, tropical vegetation, and architectural precision.',
    img: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&h=530&fit=crop&q=85',
    featured: false,
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

/* ─────────────────────────── POST CARD ─────────────────────────── */
function PostCard({ post, index, large = false }: { post: typeof POSTS[0]; index: number; large?: boolean }) {
  const [hovered, setHovered] = useState(false)
  const { ref, inView } = useInView(0.05)

  return (
    <article
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease ${index * 0.08}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.08}s`,
      }}
    >
      {/* Image */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: large ? '16/9' : '4/3',
        overflow: 'hidden',
        marginBottom: 20,
        borderRadius: 2,
        background: '#e5e5e3',
      }}>
        <Image
          src={post.img}
          alt={post.title}
          fill
          sizes={large ? '100vw' : '33vw'}
          style={{
            objectFit: 'cover',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
          }}
          unoptimized
        />
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '11px', fontWeight: 600,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: '#C44B2F',
        }}>{post.category}</span>
        <span style={{ color: 'rgba(10,10,10,0.25)', fontSize: '10px' }}>▪</span>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '11px', fontWeight: 500,
          color: 'rgba(10,10,10,0.4)',
          letterSpacing: '0.04em',
        }}>{post.date}</span>
      </div>

      {/* Title */}
      <h2 style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: large ? 'clamp(22px,2.5vw,36px)' : 'clamp(18px,1.8vw,24px)',
        fontWeight: 700,
        color: '#0A0A0A',
        letterSpacing: '-0.02em',
        lineHeight: 1.15,
        marginBottom: 10,
        textDecoration: hovered ? 'underline' : 'none',
        textDecorationThickness: 1,
        textUnderlineOffset: 3,
        transition: 'text-decoration 0.2s ease',
      }}>{post.title}</h2>

      {/* Excerpt */}
      <p style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 'clamp(13px,1vw,15px)',
        color: 'rgba(10,10,10,0.55)',
        lineHeight: 1.65,
        maxWidth: large ? 600 : 400,
      }}>{post.excerpt}</p>
    </article>
  )
}

/* ─────────────────────────── PAGE ─────────────────────────── */
export default function BlogPageClient() {
  const [activeCategory, setActiveCategory] = useState('View All')
  const { ref: heroRef, inView: heroInView } = useInView(0.1)

  const filtered = activeCategory === 'View All'
    ? POSTS
    : POSTS.filter((p) => p.category === activeCategory)

  const [featured, ...rest] = filtered

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .blog-hero {
          background: #EEEEF0;
          padding: clamp(110px,14vw,170px) clamp(24px,5vw,80px) 0;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 20px;
        }
        .blog-heading {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(52px,10vw,140px);
          font-weight: 700; color: #0A0A0A;
          letter-spacing: -0.04em; line-height: 0.92;
          display: block;
        }
        .blog-hero-label {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: rgba(10,10,10,0.4);
          align-self: flex-start; padding-top: 8px;
        }

        /* Category tabs */
        .blog-tabs {
          background: #EEEEF0;
          padding: clamp(28px,3.5vw,44px) clamp(24px,5vw,80px) 0;
          display: flex; gap: 8px; flex-wrap: wrap;
          border-bottom: 1px solid rgba(10,10,10,0.1);
        }
        .blog-tab {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px; font-weight: 600;
          letter-spacing: 0.04em;
          padding: 8px 16px;
          padding-bottom: 16px;
          background: none; border: none;
          cursor: pointer;
          color: rgba(10,10,10,0.4);
          border-bottom: 2px solid transparent;
          transition: color 0.2s ease, border-color 0.2s ease;
          position: relative; bottom: -1px;
        }
        .blog-tab.active, .blog-tab:hover {
          color: #0A0A0A;
          border-bottom-color: #0A0A0A;
        }
        .blog-tab.active {
          display: flex; align-items: center; gap: 6px;
        }
        .blog-tab.active::before {
          content: '▪';
          font-size: 8px;
          color: #0A0A0A;
        }

        /* Featured post (full width above grid) */
        .featured-post-wrap {
          padding: clamp(40px,5vw,64px) clamp(24px,5vw,80px);
          background: #F5F5F3;
          border-bottom: 1px solid rgba(10,10,10,0.08);
        }

        /* Post grid */
        .posts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(24px,3vw,48px);
          padding: clamp(40px,5vw,64px) clamp(24px,5vw,80px);
          background: #ffffff;
        }

        @media (max-width: 900px) {
          .posts-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .posts-grid { grid-template-columns: 1fr; }
          .blog-tabs { gap: 0; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="blog-hero">
        <div>
          <h1 className="blog-heading">Blog</h1>
        </div>
        <span className="blog-hero-label">(AND DON'T GET FOMO)</span>
      </section>

      {/* ── CATEGORY TABS ── */}
      <nav className="blog-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`blog-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* ── FEATURED POST ── */}
      {featured && (
        <div className="featured-post-wrap">
          <PostCard post={featured} index={0} large />
        </div>
      )}

      {/* ── POST GRID ── */}
      {rest.length > 0 && (
        <div className="posts-grid">
          {rest.map((post, i) => (
            <PostCard key={post.id} post={post} index={i + 1} />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{
          padding: 'clamp(48px,6vw,80px) clamp(24px,5vw,80px)',
          textAlign: 'center',
          fontFamily: "'Space Grotesk', sans-serif",
          color: 'rgba(10,10,10,0.35)',
          fontSize: '16px',
          background: '#ffffff',
        }}>
          No posts in this category yet.
        </div>
      )}
    </>
  )
}
