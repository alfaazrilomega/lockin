import React from 'react'

export default function WorksSlider() {
  return (
      <div className="slider-wrapper absolute inset-0 z-40 opacity-0 pointer-events-none">
        {/* Background Images */}
        <div className="absolute inset-0 z-0">
          <div className="proj-bg-1 absolute inset-0" style={{ clipPath: "inset(100% 0 0 0)" }}>
            <img src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=2000" alt="Triadlight" className="w-full h-full object-cover" />
          </div>
          <div className="proj-bg-2 absolute inset-0" style={{ clipPath: "inset(100% 0 0 0)" }}>
            <img src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=2000" alt="Itmatters" className="w-full h-full object-cover" />
          </div>
          <div className="proj-bg-3 absolute inset-0" style={{ clipPath: "inset(100% 0 0 0)" }}>
            <img src="https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&q=80&w=2000" alt="Lynice" className="w-full h-full object-cover" />
          </div>
        </div>
        
        {/* UI OVERLAY */}
        <div className="absolute inset-0 z-10 flex justify-between items-center px-12 md:px-24 py-12 text-[#f4f4f4]">
          {/* Left Title */}
          <div className="text-5xl md:text-8xl font-bold tracking-tight relative uppercase w-1/2 h-full">
            {/* Proj 1 (Starts hidden so it can wipe in) */}
            <div className="proj-title-wrapper-1 absolute top-1/2 -translate-y-1/2 left-0 w-full" style={{ clipPath: "inset(0 100% 0 0)" }}>
              <span className="text-[#333333] block">Triadlight</span>
              <span className="absolute top-0 left-0 text-[#f4f4f4] w-full h-full" style={{ clipPath: "inset(0 0 0 0)" }}>Triadlight</span>
            </div>
            {/* Proj 2 (Hidden initially) */}
            <div className="proj-title-wrapper-2 absolute top-1/2 -translate-y-1/2 left-0 w-full" style={{ clipPath: "inset(0 100% 0 0)" }}>
              <span className="text-[#333333] block">Itmatters</span>
              <span className="absolute top-0 left-0 text-[#f4f4f4] w-full h-full" style={{ clipPath: "inset(0 0 0 0)" }}>Itmatters</span>
            </div>
            {/* Proj 3 (Hidden initially) */}
            <div className="proj-title-wrapper-3 absolute top-1/2 -translate-y-1/2 left-0 w-full" style={{ clipPath: "inset(0 100% 0 0)" }}>
              <span className="text-[#333333] block">Lynice</span>
              <span className="absolute top-0 left-0 text-[#f4f4f4] w-full h-full" style={{ clipPath: "inset(0 0 0 0)" }}>Lynice</span>
            </div>
          </div>
          
          {/* Right Nav */}
          <div className="flex gap-8 md:gap-16 items-center">
            {/* Scroll Timeline */}
            <div className="flex gap-6 items-center">
              <div className="relative h-24 w-[2px] bg-[#333333]">
                {/* Scroll Dot */}
                <div className="proj-dot absolute top-0 left-0 w-full h-1/3 bg-[#f4f4f4]" />
              </div>
              <div className="flex flex-col justify-between h-24 uppercase text-xs tracking-widest text-[#888888]">
                <div>Triadlight</div>
                <div>Itmatters</div>
                <div>Lynice</div>
              </div>
            </div>

            {/* Number */}
            <div className="text-4xl md:text-6xl font-medium relative w-20 h-24">
              {/* Num 1 */}
              <div className="proj-num-wrapper-1 absolute top-1/2 -translate-y-1/2 right-0 w-full" style={{ clipPath: "inset(0 100% 0 0)" }}>
                <span className="text-[#333333] block text-right">01</span>
                <span className="absolute top-0 left-0 text-[#f4f4f4] w-full h-full text-right" style={{ clipPath: "inset(0 0 0 0)" }}>01</span>
              </div>
              {/* Num 2 (Hidden initially) */}
              <div className="proj-num-wrapper-2 absolute top-1/2 -translate-y-1/2 right-0 w-full" style={{ clipPath: "inset(0 100% 0 0)" }}>
                <span className="text-[#333333] block text-right">02</span>
                <span className="absolute top-0 left-0 text-[#f4f4f4] w-full h-full text-right" style={{ clipPath: "inset(0 0 0 0)" }}>02</span>
              </div>
              {/* Num 3 (Hidden initially) */}
              <div className="proj-num-wrapper-3 absolute top-1/2 -translate-y-1/2 right-0 w-full" style={{ clipPath: "inset(0 100% 0 0)" }}>
                <span className="text-[#333333] block text-right">03</span>
                <span className="absolute top-0 left-0 text-[#f4f4f4] w-full h-full text-right" style={{ clipPath: "inset(0 0 0 0)" }}>03</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
