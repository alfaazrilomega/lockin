import React from 'react'

export default function AboutSequence() {
  return (
    <div
      className="about-sequence-wrapper absolute inset-0 z-[60] bg-black overflow-hidden text-white"
      style={{ clipPath: "inset(100% 0 0 0)" }}
    >
      {/*
       * PORTRAIT — starts 30vw×40vh centered.
       * top/left are raw CSS — NO Tailwind translate (GSAP owns the transform).
       * gsap.set(".portrait-outer-wrapper", { xPercent: -50, yPercent: -50 }) in master.
       * Step 1 (startExpansion): width→100vw, height→100vh via GSAP.
       * Step 2 (startCollapse): clipPath inset(0% 0% 100% 0%) via GSAP.
       */}
      <div
        className="portrait-outer-wrapper absolute overflow-hidden"
        style={{ top: "50%", left: "50%", width: "30vw", height: "40vh", opacity: 0 }}
      >
        <img
          src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=2000"
          alt="Carve it into memory"
          className="portrait-img w-full h-full object-cover"
          style={{ objectPosition: "50% 20%" }}
        />
      </div>

      {/* CARVE TEXT — flanks the small portrait, wipes in then fades out during expansion */}
      <div className="absolute inset-0 flex items-center justify-between px-[8vw] pointer-events-none z-10">
        <span
          className="carve-text-left text-3xl md:text-4xl lg:text-[3.5vw] font-bold tracking-tighter"
          style={{ clipPath: "inset(0 100% 0 0)" }}
        >
          Carve it into
        </span>
        <span className="w-[32vw] flex-shrink-0" />
        <span
          className="carve-text-right text-3xl md:text-4xl lg:text-[3.5vw] font-bold tracking-tighter"
          style={{ clipPath: "inset(0 100% 0 0)" }}
        >
          memory.
        </span>
      </div>

      {/* BIO TEXT — initial state owned entirely by GSAP (gsap.set before scrubTl) */}
      <div className="bio-text-wrapper absolute bottom-0 left-0 w-full px-[8vw] pb-16 z-10" style={{ opacity: 0 }}>
        <p className="text-xl md:text-2xl max-w-2xl text-white/80 font-medium leading-relaxed">
          Based in Dublin, shaping the essence of brands through thoughtful design.
          Every detail crafted to ensure the narrative is carved into memory.
        </p>
      </div>

      {/*
       * CONVERGE TEXT — "Make it" and "Matter." slide in from opposite edges.
       * z-[90] ensures they sit above the fullscreen portrait during collapse.
       * Initial x is set by gsap.set BEFORE scrubTl:
       *   gsap.set(".make-it-text", { x: "-80vw", opacity: 0 })
       *   gsap.set(".matter-text",  { x:  "80vw", opacity: 0 })
       * startCollapse label tweens both to x: 0 in sync with portrait collapse.
       */}
      <div className="absolute inset-0 flex items-center justify-between px-[6vw] pointer-events-none z-[90]">
        <span
          className="make-it-text text-5xl md:text-7xl lg:text-[8vw] font-black tracking-tighter"
          style={{ opacity: 0 }}
        >
          Make it
        </span>
        <span
          className="matter-text text-5xl md:text-7xl lg:text-[8vw] font-black tracking-tighter"
          style={{ opacity: 0 }}
        >
          Matter.
        </span>
      </div>
    </div>
  )
}
