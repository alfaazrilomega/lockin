import React from 'react'

interface EntranceSequenceProps {
  portraitContainerRef: React.RefObject<HTMLDivElement | null>
  heroBoxRef: React.RefObject<HTMLDivElement | null>
  blackBoxRef: React.RefObject<HTMLDivElement | null>
  heroTextContainerRef: React.RefObject<HTMLDivElement | null>
  preloaderRef: React.RefObject<HTMLDivElement | null>
  counterRef: React.RefObject<HTMLDivElement | null>
}

export default function EntranceSequence({
  portraitContainerRef,
  heroBoxRef,
  blackBoxRef,
  heroTextContainerRef,
  preloaderRef,
  counterRef
}: EntranceSequenceProps) {
  return (
    <>
      {/* ENTRANCE PORTRAIT CONTAINER */}
      <div ref={portraitContainerRef} className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2000&auto=format&fit=crop" 
          alt="Victor Furuya Portrait" 
          className="w-full h-full object-cover grayscale"
        />
      </div>

      {/* MASTER CENTRAL BOX */}
      <div 
        ref={heroBoxRef} 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col justify-between" 
        style={{ 
          width: "min(380px, 28vw)", 
          aspectRatio: "3/4", 
          padding: "clamp(1.5rem, 2.5vw, 3rem)" 
        }}
      >
        {/* THE SCALABLE BLACK BOX BACKGROUND */}
        <div 
          ref={blackBoxRef} 
          className="absolute inset-0 bg-[#000000]" 
          style={{ transformOrigin: "center center" }}
        />

        {/* ORIGINAL HERO TEXT (Sweeps out) */}
        <div ref={heroTextContainerRef} className="relative z-10 w-full h-full flex flex-col justify-between text-[#f4f4f4]" style={{ clipPath: "inset(0 0 0 0)" }}>
          {/* Top Left: Subtitle */}
          <div className="relative overflow-hidden w-fit">
            <div className="block-mask absolute inset-0 bg-[#000000] z-10 w-full h-full" />
            <span className="text-[#888888] text-[10px] sm:text-xs font-medium tracking-[0.05em] uppercase relative z-0">
              Multidisciplinary Designer
            </span>
          </div>

          {/* Middle Left: Massive Typography */}
          <div className="font-bold text-[#f4f4f4]" style={{ fontSize: "clamp(3.5rem, 6vw, 5.5rem)", lineHeight: 0.85, letterSpacing: "-0.04em" }}>
            <div className="relative overflow-hidden w-fit">
              <div className="block-mask absolute inset-0 bg-[#000000] z-10 w-full h-full" />
              <span className="relative z-0 block pr-2">Make It</span>
            </div>
            <div className="relative overflow-hidden w-fit mt-1">
              <div className="block-mask absolute inset-0 bg-[#000000] z-10 w-full h-full" />
              <span className="relative z-0 block pr-2">Last</span>
            </div>
          </div>

          {/* Bottom Right: '26 */}
          <div className="flex flex-col items-end text-right">
            <div className="relative overflow-hidden w-fit">
              <div className="block-mask absolute inset-0 bg-[#000000] z-10 w-full h-full" />
              <span className="text-[#888888] text-[10px] sm:text-xs tracking-[0.05em] uppercase relative z-0 font-medium">
                Portfolio
              </span>
            </div>
            <div className="relative overflow-hidden w-fit mt-[-0.2em]">
              <div className="block-mask absolute inset-0 bg-[#000000] z-10 w-full h-full" />
              <span className="font-light relative z-0 block pr-2" style={{ fontSize: "clamp(4rem, 8vw, 7rem)", lineHeight: 0.85, letterSpacing: "-0.04em" }}>
                &apos;26
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ENTRANCE PRELOADER CONTAINER */}
      <div ref={preloaderRef} className="absolute inset-0 z-50 bg-[#000000] flex items-center justify-center pointer-events-none">
        <div 
          ref={counterRef} 
          className="text-[#f4f4f4] font-medium tracking-tighter" 
          style={{ fontSize: "clamp(6rem, 12vw, 10rem)" }}
        >
          0
        </div>
      </div>
    </>
  )
}
