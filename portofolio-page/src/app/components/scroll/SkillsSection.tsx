import React from 'react'

const SKILLS = [
  { label: "Branding", src: "https://images.unsplash.com/photo-1522345511391-49b015112fc7?q=80&w=1000&auto=format&fit=crop" }, // Hiker/Mountain
  { label: "Art direction", src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop" }, // Moody portrait/window
  { label: "Digital design", src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop" }, // Skyscrapers/Architecture
  { label: "Web development", src: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1000&auto=format&fit=crop" }, // Web UI/Code
]

export default function SkillsSection() {
  return (
    /*
     * SEALED LAYER: bg-black, z-[70] sits above AboutSequence (z-[60]).
     * INITIAL STATE: clip-path: inset(100% 0 0 0) = card hidden below.
     * GSAP: card swipes up to inset(0 0 0 0), then children animate inside.
     */
    <div
      className="skills-sequence-wrapper absolute inset-0 z-[70] bg-black w-full h-screen text-white overflow-hidden flex"
      style={{ clipPath: "inset(100% 0 0 0)" }}
    >
      <div className="w-full h-full flex flex-row">
        
        {/* ── LEFT: The Image Stack ──────────────────────────────────────────
            Each image is absolutely stacked full-bleed.
            GSAP reveals them via clip-path: inset(100% 0 0 0) → inset(0 0 0 0).
            They stack on top of each other permanently.
        ── */}
        <div className="skills-images relative w-1/2 h-full overflow-hidden">
          {SKILLS.map((skill, i) => (
            <img
              key={i}
              src={skill.src}
              alt={skill.label}
              className={`skill-img-${i} absolute inset-0 w-full h-full object-cover`}
              style={{ 
                clipPath: "inset(100% 0 0 0)", 
                zIndex: (i + 1) * 10 // z-10, z-20, z-30, z-40
              }}
            />
          ))}
        </div>

        {/* ── RIGHT: Skill List ────────────────────────────────────────────
            All labels start at low-opacity grey (inactive state).
            GSAP scrubs the active one to full white, then back to grey.
        ── */}
        <div className="skills-list w-1/2 flex flex-col justify-center px-12 md:px-24">
          <p className="text-xs uppercase tracking-[0.2em] text-[#888888] mb-12">
            Area of focus
          </p>
          {SKILLS.map((skill, i) => (
            <h2
              key={i}
              className={`skill-text-${i} text-4xl md:text-6xl lg:text-7xl font-bold mb-4 transition-colors duration-300`}
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              {skill.label}
            </h2>
          ))}
        </div>
      </div>
    </div>
  )
}
