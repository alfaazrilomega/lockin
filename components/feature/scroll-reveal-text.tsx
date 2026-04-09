"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealTextProps {
  text: string;
}

export default function ScrollRevealText({ text }: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const words = text.split(" ");

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the element is visible
      // We want it to start transitioning when it enters the bottom quarter of the screen
      // and finish transitioning by the time it reaches the middle of the screen.
      
      const start = windowHeight * 0.75; // 75% down the screen
      const end = windowHeight * 0.25;   // 25% down the screen
      
      let currentProgress = (start - rect.top) / (start - end);
      
      // Clamp between 0 and 1
      currentProgress = Math.max(0, Math.min(1, currentProgress));
      setProgress(currentProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full bg-[#FDFDFD] py-32 px-6 md:px-12 flex justify-center border-t border-black/5">
      <div 
        ref={containerRef}
        className="max-w-[1000px] text-center"
      >
        <p className="font-['Aeonik',sans-serif] text-[clamp(2rem,4vw,3.5rem)] leading-[1.1] font-medium tracking-tight flex flex-wrap justify-center gap-x-[0.25em] gap-y-[0.1em]">
          {words.map((word, i) => {
             // Each word highlights sequentially based on the overall progress.
             // If progress is 0.5, half the words should be black.
             const wordThreshold = i / words.length;
             // Increased multiplier to 9 to ensure "entire" reveals while "ecosystem" stays muted
             const opacity = Math.max(0.15, Math.min(1, (progress - wordThreshold) * 9));
             
             return (
                <span 
                  key={i} 
                  className="transition-opacity duration-100 will-change-opacity"
                  style={{ opacity: opacity === 0.15 ? 0.2 : opacity, color: opacity > 0.5 ? '#000' : '#888' }}
                >
                  {word}
                </span>
             );
          })}
        </p>
      </div>
    </section>
  );
}
