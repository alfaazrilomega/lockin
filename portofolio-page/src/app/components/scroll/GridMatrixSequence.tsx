import React, { useEffect, useState } from 'react'

export default function GridMatrixSequence() {
  const [time, setTime] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      // JetBrains Mono fixed width format HH : MM : SS
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/:/g, ' : '))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="grid-matrix-sequence relative w-full bg-background text-foreground overflow-hidden">
      {/* Noise Overlay */}
      <div 
        className="pointer-events-none absolute inset-0 z-50 opacity-5 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Hero Section (The Grid) */}
      <section className="h-[100vh] w-full grid grid-cols-2 grid-rows-2">
        <div className="border-r border-b border-border relative overflow-hidden group">
          <h1 className="absolute bottom-[-1vw] left-[-1vw] font-display font-black uppercase text-[clamp(5rem,24vw,24vw)] leading-none tracking-tightest group-hover:text-accent transition-colors duration-300">LO</h1>
        </div>
        <div className="border-b border-border relative overflow-hidden group">
          <h1 className="absolute top-[-2vw] left-[-1vw] font-display font-black uppercase text-[clamp(5rem,24vw,24vw)] leading-none tracking-tightest group-hover:text-accent transition-colors duration-300">CK</h1>
        </div>
        <div className="border-r border-border relative overflow-hidden group">
          <h1 className="absolute bottom-[-1vw] left-[-1vw] font-display font-black uppercase text-[clamp(5rem,24vw,24vw)] leading-none tracking-tightest group-hover:text-accent transition-colors duration-300">IN</h1>
        </div>
        <div className="relative overflow-hidden group flex items-start">
          <h1 className="absolute top-[-2vw] left-[-1vw] font-display font-black uppercase text-[clamp(5rem,24vw,24vw)] leading-none tracking-tightest group-hover:text-accent transition-colors duration-300">__</h1>
        </div>
      </section>

      {/* Command Bar */}
      <section className="w-full h-auto md:h-24 border-t border-b border-border grid grid-cols-1 md:grid-cols-4 relative z-10 bg-background">
        <div className="border-b md:border-b-0 md:border-r border-border p-6 flex items-center">
          <input 
            type="text" 
            placeholder="ENTER_EMAIL" 
            className="w-full bg-transparent font-mono text-xs outline-none text-foreground placeholder:text-muted/50 tracking-widest uppercase"
          />
        </div>
        <div className="border-b md:border-b-0 md:border-r border-border flex items-stretch">
          <button className="w-full h-full py-4 px-6 bg-foreground text-background font-mono font-bold tracking-[0.3em] text-xs hover:bg-accent hover:text-white transition-colors duration-300 uppercase">
            JOIN BETA
          </button>
        </div>
        <div className="border-b md:border-b-0 md:border-r border-border p-6 flex items-center justify-center">
          <div className="font-mono text-[24px] text-foreground font-medium tracking-widest flex items-center gap-2">
            {time.split(' : ').map((part, i) => (
              <React.Fragment key={i}>
                <span>{part}</span>
                {i < 2 && <span className="opacity-20">:</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="p-6 flex flex-col justify-center gap-1 font-mono text-[8px] tracking-[0.4em] text-muted/60 uppercase">
          <div>STATUS_AVAILABLE</div>
          <div>ROLE_FULL_STACK</div>
          <div>SYS_LOCKIN_V1</div>
        </div>
      </section>

      {/* Bento Feature Grid */}
      <section className="w-full grid grid-cols-1 md:grid-cols-3 border-b border-border relative z-10 bg-background">
        {/* Card 1 */}
        <div className="h-[400px] border-b md:border-b-0 md:border-r border-border relative group hover:bg-[#ffffff05] transition-colors duration-300 flex flex-col p-8">
          <div className="font-mono text-[10px] tracking-[0.3em] text-muted/50 uppercase">SYSTEM_01</div>
          
          <div className="flex-1 flex items-center justify-center opacity-20 group-hover:opacity-100 transition-opacity duration-300">
            {/* Interactive Geometric Card: Code brackets <> */}
            <div className="font-mono text-6xl text-foreground font-light tracking-widest flex gap-4 transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-110">
              <span>&lt;</span><span>&gt;</span>
            </div>
          </div>

          <div className="mt-auto">
            <h2 className="font-display font-black text-[24px] uppercase tracking-tighter mb-2 leading-none text-foreground">LOCK IN</h2>
            <p className="font-sans text-[14px] text-muted/40 font-normal leading-relaxed">The most beautiful build and AI workflow workspace I&apos;ve ever created.</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="h-[400px] border-b md:border-b-0 md:border-r border-border relative group hover:bg-[#ffffff05] transition-colors duration-300 flex flex-col p-8">
          <div className="font-mono text-[10px] tracking-[0.3em] text-muted/50 uppercase">SYSTEM_02</div>
          
          <div className="flex-1 flex items-center justify-center opacity-20 group-hover:opacity-100 transition-opacity duration-300">
             {/* Interactive Geometric Card: Square */}
             <div className="w-16 h-16 bg-foreground/20 border border-border group-hover:bg-foreground/40 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:rotate-90 group-hover:scale-110" />
          </div>

          <div className="mt-auto">
            <h2 className="font-display font-black text-[24px] uppercase tracking-tighter mb-2 leading-none text-foreground">CV 3D</h2>
            <p className="font-sans text-[14px] text-muted/40 font-normal leading-relaxed">Immersive 3D model portfolio and spatial web experiences.</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="h-[400px] relative group hover:bg-[#ffffff05] transition-colors duration-300 flex flex-col p-8">
          <div className="font-mono text-[10px] tracking-[0.3em] text-muted/50 uppercase">SYSTEM_03</div>
          
          <div className="flex-1 flex items-center justify-center opacity-20 group-hover:opacity-100 transition-opacity duration-300">
            {/* Interactive Geometric Card: Rectangle */}
            <div className="w-24 h-12 border-[0.5px] border-foreground/50 flex items-center justify-center group-hover:border-foreground transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-y-150">
              <div className="w-full h-[0.5px] bg-foreground/50 group-hover:bg-foreground transition-colors duration-700" />
            </div>
          </div>

          <div className="mt-auto">
            <h2 className="font-display font-black text-[24px] uppercase tracking-tighter mb-2 leading-none text-foreground">ARCHITECTURE</h2>
            <p className="font-sans text-[14px] text-muted/40 font-normal leading-relaxed">Strict monochrome layouts, zero latency, and absolute precision.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
