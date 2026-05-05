'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

gsap.registerPlugin()

const TEAM = [
  { name: 'Caio Cavalcanti',  role: 'Creative Director' },
  { name: 'Filipa Valdemar',  role: 'Project Manager'   },
  { name: 'Mateus Pimenta',   role: '3D Artist'         },
  { name: 'Pedro Morais',     role: 'Photographer'      },
  { name: 'Alexandre Victor', role: 'Film Director'     },
  { name: 'Cauã Anderson',    role: 'Brand Designer'    },
  { name: 'Diogo Romero',     role: 'Web Developer'     },
  { name: 'Gabriel Fernandes',role: 'Motion Designer'   },
  { name: 'Gabriel Tamez',    role: '3D Artist'         },
  { name: 'Javiera Alvarez',  role: 'Art Director'      },
  { name: 'Luiz Correa',      role: 'Copywriter'        },
  { name: 'Maria Venâncio',   role: 'Account Manager'   },
  { name: 'Mayumi Amaral',    role: 'UX Designer'       },
  { name: 'Rafael Seiji',     role: 'Photographer'      },
  { name: 'Rafael Moreira',   role: 'Film Producer'     },
  { name: 'Renan Alves',      role: '3D Visualizer'     },
  { name: 'Sabrina Lemes',    role: 'Brand Strategist'  },
  { name: 'Thiago Barbosa',   role: 'Motion Designer'   },
  { name: 'Vitor Thomas',     role: 'Web Designer'      },
  { name: 'William Avila',    role: 'Creative Producer' },
]

export default function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const { gsap: g } = require('gsap')
    const { ScrollTrigger } = require('gsap/ScrollTrigger')
    g.registerPlugin(ScrollTrigger)

    const ctx = g.context(() => {
      g.fromTo(
        '.team-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.7, stagger: 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="section-py"
      style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border)' }}
    >
      <div className="container">
        <p className="text-label" style={{ color: 'var(--text-muted)', marginBottom: '48px' }}>Our Team</p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '2px',
            background: 'var(--border)',
          }}
        >
          {TEAM.map(member => (
            <div
              key={member.name}
              className="team-card"
              data-cursor-hover
              style={{
                background: 'var(--bg-primary)',
                overflow: 'hidden',
                cursor: 'none',
              }}
            >
              {/* Photo area — grayscale, color on hover */}
              <div
                className="team-photo"
                style={{
                  aspectRatio: '3/4',
                  background: 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  color: 'var(--text-muted)',
                  userSelect: 'none',
                }}
              >
                {member.name.charAt(0)}
              </div>

              {/* Info */}
              <div style={{ padding: '16px' }}>
                <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {member.name}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
