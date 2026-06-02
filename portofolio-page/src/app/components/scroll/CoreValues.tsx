import React from 'react'

const VALUES = [
  "Made by people. Shaped for people. Brands aren\u2019t explanations, they\u2019re history.",
  "Because you only get one chance to be remembered.",
  "Don\u2019t change the essence, change the way you present it.",
]

const HEADER_WORDS = ["Why.", "What.", "Who.", "Why.", "How."]

export default function CoreValues() {
  return (
    /*
     * SEALED LAYER: bg-black, z-[80] sits above SkillsSection (z-[70]).
     * INITIAL STATE: clip-path: inset(100% 0 0 0) = card hidden below.
     * GSAP: card swipes up, then children animate inside.
     */
    <div
      className="core-values-wrapper absolute inset-0 z-[80] bg-black w-full h-screen text-white overflow-hidden"
      style={{ clipPath: "inset(100% 0 0 0)" }}
    >
      {/* ── TOP HEADER ROW ─────────────────────────────────────────────
          Words start hidden behind their own clip-path.
          GSAP reveals them one-by-one with stagger + light grey pop bg.
          Initial: opacity-0 so the row is invisible until the right moment.
      ── */}
      <div className="values-header absolute top-6 left-0 w-full px-8 flex gap-8 opacity-0 z-10">
        {HEADER_WORDS.map((word, i) => (
          <div key={i} className={`wipe-word-${i} relative overflow-hidden`}>
            <span
              className="text-base md:text-lg text-white/30 font-medium relative z-10 block"
            >
              {word}
            </span>
            {/* Light grey pop-up tint that slides up behind the word */}
            <div
              className={`wipe-bg-${i} absolute inset-0 bg-white/10`}
              style={{ transform: "translateY(100%)" }}
            />
          </div>
        ))}
      </div>

      {/* ── MAIN LAYOUT ────────────────────────────────────────────────── */}
      <div className="absolute inset-0 flex items-center px-8 md:px-16">
        {/* Left: Large heading (What. / Who.) */}
        <div className="w-[38%] flex-shrink-0">
          <h1 className="text-[16vw] font-bold tracking-tighter leading-none">
            What.
          </h1>
        </div>

        {/* Right: Value list — all start at low-opacity grey */}
        <div className="w-[62%] flex flex-col gap-6 pl-8">
          {VALUES.map((val, i) => (
            <p
              key={i}
              className={`value-text-${i} text-2xl md:text-3xl font-medium leading-snug`}
              style={{ color: "rgba(255,255,255,0.18)" }}
            >
              {val}
            </p>
          ))}
        </div>
      </div>

      {/* ── GIANT "I DON'T" ───────────────────────────────────────────────
          Starts entirely below the viewport. GSAP scrubs it upward to
          roughly y: 30vh, occupying ~60-70% of the screen height.
          mix-blend-screen lets it overlay text without full coverage.
      ── */}
      <div
        className="giant-i-dont absolute bottom-0 left-0 w-full text-center select-none z-0"
        style={{ transform: "translateY(100%)" }}
      >
        <span className="text-[28vw] leading-none font-black tracking-tighter text-white/[0.07] mix-blend-screen whitespace-nowrap">
          I don&apos;t
        </span>
      </div>
    </div>
  )
}
