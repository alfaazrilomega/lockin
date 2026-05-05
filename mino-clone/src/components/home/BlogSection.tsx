import Link from 'next/link'

/**
 * BLOG SECTION — Ground Truth from mino.works
 * ─────────────────────────────────────────────
 * LAYOUT (from live scan):
 *   - White background
 *   - Section label: "Blog" (small caps)
 *   - Large heading: "And don't get FOMO."
 *   - "view all" link → right side, same row as heading
 *   - Two large cards side by side
 *   - Each card: cover image area (dark) + category badge + date + title + excerpt
 *   - Hover: card lifts slightly
 *
 * Cards verified from live site:
 *   1. "Mino Website Earns an Awwwards Honorable Mention" — Apr 15, 2026
 *   2. "Announcing Mino Agency" — Dec 22, 2024
 */

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  publishedAt: string | Date
}

const FALLBACK_POSTS: BlogPost[] = [
  {
    slug: 'mino-website-earns-an-awwwards-honorable-mention',
    title: 'Mino Website Earns an Awwwards Honorable Mention',
    excerpt: "MINO's new website earns an Awwwards Honorable Mention, a reflection on the design, vision, and craft behind it.",
    category: 'MINO NEWS',
    publishedAt: 'Apr 15, 2026',
  },
  {
    slug: 'announcing-mino-agency',
    title: 'Announcing Mino Agency',
    excerpt: 'Hello from your full-service real estate marketing partner.',
    category: 'MINO NEWS',
    publishedAt: 'Dec 22, 2024',
  },
]

export default function BlogSection({ posts = FALLBACK_POSTS }: { posts?: BlogPost[] }) {
  const formatDate = (d: string | Date) =>
    typeof d === 'string' ? d : new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <>
      <style>{`
        .blog-card {
          display: block;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
        }
        .blog-card:hover { transform: translateY(-6px); }
        .blog-cover {
          width: 100%;
          aspect-ratio: 16/9;
          background: #0A0A0A;
          border-radius: 4px;
          margin-bottom: 24px;
          overflow: hidden;
          position: relative;
        }
        .blog-cover-inner {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
          transition: transform 0.6s cubic-bezier(0.16,1,0.3,1);
        }
        .blog-card:hover .blog-cover-inner { transform: scale(1.03); }
        .blog-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 12px;
        }
        .blog-category {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #0A0A0A;
        }
        .blog-date {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 12px;
          font-weight: 400;
          color: rgba(10,10,10,0.45);
        }
        .blog-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(18px, 1.8vw, 24px);
          font-weight: 700;
          color: #0A0A0A;
          line-height: 1.2;
          letter-spacing: -0.01em;
          margin-bottom: 10px;
        }
        .blog-excerpt {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: rgba(10,10,10,0.55);
          line-height: 1.6;
        }
        .blog-view-all {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #0A0A0A;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: opacity 0.2s ease;
        }
        .blog-view-all:hover { opacity: 0.5; }
      `}</style>

      <section style={{
        background: '#ffffff',
        width: '100%',
        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px)',
      }}>
        {/* Header row */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 'clamp(48px, 6vw, 72px)',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'rgba(10,10,10,0.45)',
              marginBottom: '16px',
            }}>
              Blog
            </p>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(32px, 4.5vw, 64px)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: '#0A0A0A',
              lineHeight: 1,
            }}>
              And don&apos;t get FOMO.
            </h2>
          </div>
          <Link href="/blog" className="blog-view-all">view all</Link>
        </div>

        {/* Cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(20px, 3vw, 40px)',
        }}>
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
              {/* Cover image */}
              <div className="blog-cover">
                <div className="blog-cover-inner" />
              </div>

              {/* Meta */}
              <div className="blog-meta">
                <span className="blog-category">{post.category}</span>
                <span className="blog-date">{formatDate(post.publishedAt)}</span>
              </div>

              <h3 className="blog-title">{post.title}</h3>
              <p className="blog-excerpt">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
