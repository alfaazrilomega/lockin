"use client"

import { useRef, useEffect, useState } from "react"

// Letter-by-letter stagger hover — same as "Learn More About Our Agents" button
// Uses named group 'group/btn' to scope hover strictly to the button, not the parent section
const StaggeredHoverText = ({ text }: { text: string }) => {
  return (
    <span className="relative inline-flex overflow-hidden">
      {/* Primary: slides up on hover */}
      <span className="flex items-center">
        {text.split("").map((char, i) => (
          <span
            key={`p-${i}`}
            className="inline-block transition-transform duration-[0.4s] ease-[cubic-bezier(0.85,0,0.15,1)] group-hover/btn:-translate-y-full"
            style={{ transitionDelay: `${i * 15}ms` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
      {/* Secondary: slides in from below on hover */}
      <span className="absolute left-0 top-0 flex items-center h-full">
        {text.split("").map((char, i) => (
          <span
            key={`s-${i}`}
            className="inline-block transition-transform duration-[0.4s] ease-[cubic-bezier(0.85,0,0.15,1)] translate-y-full group-hover/btn:translate-y-0"
            style={{ transitionDelay: `${i * 15}ms` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </span>
  )
}

export default function ContactFormSection() {
  const headingSectionRef = useRef<HTMLDivElement>(null)
  const [preloaderFinished, setPreloaderFinished] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const isPreloaderDone = typeof window !== 'undefined' && (window as Window & { __preloaderDone?: boolean }).__preloaderDone
    if (isPreloaderDone) {
      queueMicrotask(() => setPreloaderFinished(true))
    } else {
      const timer = setTimeout(() => {
        setPreloaderFinished(true)
      }, 4400)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    const headingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsInView(true)
        } else if (entry.intersectionRatio === 0) {
          setIsInView(false)
        }
      })
    }, { 
      threshold: [0, 0.1],
      rootMargin: "0px 0px -10% 0px" 
    })

    if (headingSectionRef.current) {
      headingObserver.observe(headingSectionRef.current)
    }

    return () => headingObserver.disconnect()
  }, [])

  // The actual animation trigger combines scroll visibility and preloader state
  useEffect(() => {
    if (isInView && preloaderFinished && !hasStarted) {
      queueMicrotask(() => setHasStarted(true))
    }
  }, [isInView, preloaderFinished, hasStarted])

  const subtextWords = "Got questions, compliments, or just wanna say hi? Don't be shy. Let's make some magic happen.".split(" ")

  return (
    <section 
      ref={headingSectionRef}
      className={`relative w-full min-h-[90vh] bg-[#F8F9FA] flex flex-col md:flex-row shadow-2xl z-10 group transition-opacity duration-1000 ${preloaderFinished ? 'opacity-100' : 'opacity-0'}`}
    >
      
      {/* ── Left Column: Form ────────────────────────────────────────────── */}
      <div className="w-full md:w-[60%] flex flex-col justify-center px-8 md:px-16 lg:px-24 py-20">
        
        {/* Heading Area */}
        <div className="mb-16 text-black">
          <div className="flex flex-wrap gap-x-4 md:gap-x-6 overflow-hidden pb-4 -mb-4" style={{ lineHeight: 1.1 }}>
            {["Get", "in", "Touch"].map((word, i) => (
              <div key={i} className="overflow-hidden">
                <div 
                  className={`transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] ${hasStarted ? 'translate-y-0 translate-x-0' : 'translate-y-[110%] translate-x-[250px]'}`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <h1 className="font-satoshi text-[clamp(4.2rem,8.5vw,9rem)] font-bold leading-[0.9] tracking-tighter">
                    {word}
                  </h1>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-md mt-8">
            <p className="font-satoshi text-lg md:text-xl text-black/80 leading-snug">
              {subtextWords.map((word, i, arr) => (
                <span key={i} className="inline-block">
                  <span className="inline-block overflow-hidden pb-1 -mb-1 pt-1 -mt-1">
                    <span
                      className={`inline-block transition-transform duration-[0.9s] ease-[cubic-bezier(0.16,1,0.3,1)] ${hasStarted ? 'translate-y-0' : 'translate-y-[110%]'}`}
                      style={{ transitionDelay: `${400 + word.length * 5 + i * 35}ms` }}
                    >
                      {word}
                    </span>
                  </span>
                  {i < arr.length - 1 && <span className="inline-block">&nbsp;</span>}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* Minimalist Form */}
        <form className="max-w-xl flex flex-col gap-12" onSubmit={(e) => e.preventDefault()}>
          {[
            { id: "name", label: "Enter your name*", type: "text" },
            { id: "email", label: "Enter your email*", type: "email" },
            { id: "message", label: "Enter your message*", type: "textarea" },
          ].map((field, idx) => (
            <div 
              key={field.id}
              className="relative group/field overflow-hidden"
            >
              <div 
                className={`transition-transform duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] ${hasStarted ? 'translate-y-0' : 'translate-y-[120%]'}`}
                style={{ transitionDelay: `${800 + idx * 150}ms` }}
              >
                {field.type === "textarea" ? (
                  <textarea 
                    rows={2}
                    required
                    className="w-full bg-transparent border-b border-black/20 py-3 text-lg font-satoshi text-black focus:outline-none focus:border-black transition-colors peer placeholder-transparent resize-y"
                    placeholder={field.label}
                  />
                ) : (
                  <input 
                    type={field.type}
                    required
                    className="w-full bg-transparent border-b border-black/20 py-3 text-lg font-satoshi text-black focus:outline-none focus:border-black transition-colors peer placeholder-transparent"
                    placeholder={field.label}
                  />
                )}
                <label className="absolute left-0 top-3 text-black/60 font-satoshi text-lg transition-all peer-focus:-top-6 peer-focus:text-sm peer-focus:text-black peer-valid:-top-6 peer-valid:text-sm peer-valid:text-black pointer-events-none">
                  {field.label}
                </label>
              </div>
            </div>
          ))}

          <div className="overflow-hidden">
            <div 
              className={`transition-transform duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] ${hasStarted ? 'translate-y-0' : 'translate-y-[120%]'}`}
              style={{ transitionDelay: `${1300}ms` }}
            >
              <button 
                type="submit"
                className="group/btn mt-4 w-full bg-[#111] hover:bg-black text-white font-satoshi font-semibold tracking-wide py-5 rounded-[2rem] transition-colors duration-300 active:scale-[0.98] shadow-lg"
              >
                <StaggeredHoverText text="HIT ME UP!" />
              </button>
            </div>
          </div>
        </form>

      </div>

      {/* ── Right Column: Gradient Mesh ──────────────────────────────────── */}
      <div className="relative w-full md:w-[40%] min-h-[40vh] md:min-h-full overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source src="/video/Gradient-background.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay noise texture (optional but adds premium feel) */}
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay z-10" />
      </div>

    </section>
  )
}
