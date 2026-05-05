"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLDivElement>(null)
  const imageWrapperRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const overlayBoxRef = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Disable scrolling during the intro sequence
    document.body.style.overflow = "hidden"
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "auto"
          setIsLoaded(true)
        }
      })

      // 1. Preloader Counter (Simulate 0 to 100)
      const counterObj = { val: 0 }
      tl.to(counterObj, {
        val: 100,
        duration: 2.5,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.innerText = Math.round(counterObj.val).toString()
          }
        }
      })
      // HOLD the "100" on screen for 0.5 seconds so it's fully visible!
      .to({}, { duration: 0.5 })

      // 2. The small image wrapper block WIPES UP, covering the "100"
      .to(imageWrapperRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1,
        ease: "power4.inOut"
      })
      // The image inside scales down slightly for a parallax reveal effect
      .fromTo(imageRef.current,
        { scale: 1.4 },
        { scale: 1, duration: 1, ease: "power4.inOut" },
        "<"
      )
      // The counter fades out right as the block covers it
      .to(counterRef.current, { opacity: 0, duration: 0.3 }, "<0.2")

      // 3. Pause for a split second to let the user see the small portrait
      .to({}, { duration: 0.3 })

      // 4. Expand the image wrapper to fill the whole screen
      .to(imageWrapperRef.current, {
        width: "100vw",
        height: "100vh",
        duration: 1.5,
        ease: "power4.inOut"
      })
      
      // 5. Reveal the Global Navbar! (Using document.querySelector to bypass any scoping issues)
      .to(document.querySelector("#global-navbar"), { opacity: 1, duration: 0.8, ease: "power2.out" }, "-=1.0")

      // 6. Reveal the Black Text Box sliding up
      .fromTo(overlayBoxRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        "-=0.5"
      )

      // 7. Reveal Scroll Down hint
      .fromTo(scrollHintRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        "-=0.4"
      )

    }) // Removed containerRef scope so we can target elements outside main

    return () => {
      document.body.style.overflow = "auto"
      ctx.revert()
    }
  }, [])

  return (
    <main ref={containerRef} className="bg-[#000000] min-h-[200vh]">
      
      {/* Fixed Intro Container */}
      <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">
        
        {/* Preloader Counter */}
        <div 
          ref={counterRef} 
          className="absolute z-10 text-white font-medium text-8xl md:text-[10rem] tracking-tight font-sans"
        >
          0
        </div>

        {/* The Image Container that starts small and wiped, then expands */}
        <div 
          ref={imageWrapperRef} 
          className="relative z-20 w-[20vw] h-[40vh] overflow-hidden bg-[#111]"
          style={{ clipPath: "inset(100% 0% 0% 0%)" }} // Starts hidden at the bottom
        >
          <img 
            ref={imageRef}
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2000&auto=format&fit=crop" 
            alt="Victor Furuya Portrait"
            className="absolute inset-0 w-full h-full object-cover grayscale"
          />

          {/* The Black Overlay Box that fades in */}
          <div 
            ref={overlayBoxRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-[400px] bg-[#0d0d0d] p-8 md:p-12 text-white flex flex-col justify-between opacity-0"
            style={{ aspectRatio: "3/4" }}
          >
            <div className="text-sm text-[#888] font-medium tracking-wide">
              Multidisciplinary Designer
            </div>
            
            <div className="text-[12vw] md:text-[5.5rem] font-medium leading-[0.9] tracking-tighter mt-12 mb-24 text-white">
              Make It<br/>Last
            </div>
            
            <div className="flex flex-col items-end text-right">
              <span className="text-sm text-[#888] mb-[-10px] z-10 relative">Portfolio</span>
              <span className="text-[14vw] md:text-8xl font-medium leading-none tracking-tighter">
                '26
              </span>
            </div>
          </div>
        </div>

        {/* Scroll Down Hint */}
        <div 
          ref={scrollHintRef}
          className="absolute bottom-8 right-8 text-sm text-[#888] font-medium opacity-0"
        >
          Scroll Down
        </div>

      </div>

      {/* spacer to allow scrolling after intro */}
      <div className="h-screen w-full relative z-0"></div>
      
      {/* Following sections will go here... */}
      <div className="h-screen w-full bg-[#111111] relative z-20 p-8 flex items-center justify-center text-white text-2xl">
        (Scroll Content Here)
      </div>

    </main>
  )
}
