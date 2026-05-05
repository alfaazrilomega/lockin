'use client'

/**
 * SERVICES SECTION — matching live mino.works exactly
 * - Full 100vh panel per service with real background photos
 * - Sticky sub-nav tabs at top
 * - Service title bottom-left with superscript number
 * - Tagline below title
 */

import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'

const SERVICES = [
  {
    id:      'brand-identity',
    label:   'Brand Identity',
    number:  '01',
    tagline: "From concept to icon, your brand's journey starts here.",
    year:    null,
    type:    'video',
    src:     'https://framerusercontent.com/assets/Cx0FGEPIVpSuvQRKjxOlaHg2Y04.mp4',
  },
  {
    id:      'images',
    label:   'Images',
    number:  '02',
    tagline: 'Every picture is a narrative.',
    year:    '2024',
    type:    'image',
    src:     'https://framerusercontent.com/images/qZOl9tGVmz3FgyAeo94GeNvyFmI.webp?width=1900&height=1268',
  },
  {
    id:      'film',
    label:   'Film',
    number:  '03',
    tagline: 'From real-world shoots to boundless 3D worlds, every frame tells a story.',
    year:    '2025',
    type:    'video',
    src:     'https://framerusercontent.com/assets/EshoaUDVb5RLjEUUBq62evgqa4.mp4',
  },
  {
    id:      'immersive',
    label:   'Immersive Experience',
    number:  '04',
    tagline: 'Blurring borders between reality and digital.',
    year:    '2025',
    type:    'video',
    src:     'https://framerusercontent.com/assets/3iM2qvDjJhyntHaIHBlZMrlMpBE.mp4',
  },
  {
    id:      'website',
    label:   'Website Design',
    number:  '05',
    tagline: 'Websites that turn plans into pre-sales.',
    year:    '2025',
    type:    'image',
    src:     'https://framerusercontent.com/images/NuiMojUZ02hBmGPaucjk8ZPTRw.webp?width=1900&height=1069',
  },
]

export default function ServicesSection() {
  return (
    <div id="services-wrapper" className="relative w-full bg-black">
      {SERVICES.map((current, index) => (
        <section
          key={current.id}
          id={current.id}
          className="relative w-full h-[100vh] flex flex-col justify-between overflow-hidden"
        >
          {/* ── BACKGROUND MEDIA with Gradient ── */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            {current.type === 'video' ? (
              <video
                src={current.src}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url('${current.src}')` }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
          </div>

          {/* ── CONTENT OVERLAY ── */}
          <div className="relative z-10 w-full h-full flex flex-col justify-between pb-8 pt-[100px] px-6 md:px-12">
            
            {/* Local Section Navigation */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
              {SERVICES.map((s, i) => {
                const isActive = i === index
                return (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className={`whitespace-nowrap text-[13px] md:text-sm font-medium tracking-wide transition-all duration-300 px-4 py-1.5 rounded-full border ${
                      isActive
                        ? 'text-white border-white/60 bg-white/5 backdrop-blur-sm'
                        : 'text-white/60 border-transparent hover:text-white/90'
                    }`}
                  >
                    {s.label}
                  </a>
                )
              })}
            </div>

            {/* Bottom Title & Tagline */}
            <div className="pb-[4vh]">
              <h2 className="text-white text-[3.5rem] md:text-[6rem] lg:text-[7.5vw] font-bold leading-[0.95] tracking-tight mb-4 flex items-start" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {current.label}
                <sup className="text-xl md:text-3xl opacity-80 mt-4 md:mt-8 ml-2 md:ml-4 font-medium tracking-normal">
                  ({current.number})
                </sup>
              </h2>
              <p className="text-white/80 text-sm md:text-[17px] max-w-[500px] font-medium leading-relaxed tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {current.tagline}
              </p>
            </div>
          </div>

          {/* Optional Year */}
          {current.year && (
            <div className="absolute z-10 right-6 md:right-12 bottom-12 md:bottom-[6vh] text-white/50 font-medium tracking-widest text-[11px] uppercase">
              {current.year}
            </div>
          )}
        </section>
      ))}
    </div>
  )
}
