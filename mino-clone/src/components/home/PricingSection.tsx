'use client'

const PLANS = [
  {
    name: 'Essence',
    tagline: 'Essential tools for a quick launch.',
    features: ['Brand Identity', '3D Images', 'Floor Plans', 'Commercial Booklet', 'Website', 'Photography'],
    isPopular: false,
  },
  {
    name: 'Core',
    tagline: 'For mid-sized enterprises.',
    features: ['Brand Identity', '3D Images', 'Floor Plans', 'Commercial Booklet', 'Website', 'Photography', 'Virtual Tours'],
    isPopular: true,
  },
  {
    name: 'Signature',
    tagline: 'For high-impact, full-scale campaigns.',
    features: ['Brand Identity', '3D Images', 'Floor Plans', 'Commercial Booklet', 'Website', 'Photography', 'Virtual Tours', 'Promotional Film'],
    isPopular: false,
  },
]

export default function PricingSection() {
  return (
    <section style={{
      background: '#ffffff',
      width: '100%',
      padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)',
      borderTop: '1px solid #E9E9E7',
    }}>
      <p style={{
        fontFamily: "'Space Grotesk',sans-serif",
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
        color: 'rgba(10,10,10,0.45)',
        marginBottom: '48px',
      }}>
        Pricing
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1px',
        background: '#E9E9E7',
      }}>
        {PLANS.map((plan) => (
          <div key={plan.name} style={{
            background: plan.isPopular ? '#F7F7F5' : '#ffffff',
            padding: 'clamp(32px,4vw,48px)',
            position: 'relative',
          }}>
            {plan.isPopular && (
              <span style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase' as const,
                color: '#0A0A0A',
              }}>
                POPULAR
              </span>
            )}

            <p style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: '22px',
              fontWeight: 700,
              color: '#0A0A0A',
              marginBottom: '8px',
            }}>{plan.name}</p>

            <p style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: '14px',
              color: 'rgba(10,10,10,0.55)',
              marginBottom: '32px',
              lineHeight: 1.5,
            }}>{plan.tagline}</p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px', padding: 0 }}>
              {plan.features.map(f => (
                <li key={f} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#0A0A0A', flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '14px', color: 'rgba(10,10,10,0.65)' }}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <a href="/contact" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              color: '#0A0A0A',
              textDecoration: 'none',
              border: '1px solid',
              borderColor: plan.isPopular ? '#0A0A0A' : '#D0D0D0',
              borderRadius: '100px',
              padding: '10px 22px',
              transition: 'background 0.2s ease, color 0.2s ease',
            }}>
              KNOW MORE
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
