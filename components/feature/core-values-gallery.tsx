"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const CORE_VALUES = [
  {
    id: "01",
    title: "Positive\nCulture",
    description: "Creating a fun, supportive, and enjoyable environment.",
    imgUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "02",
    title: "Honesty and\nIntegrity",
    description: "Doing the right thing, even when no one is watching.",
    imgUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "03",
    title: "Respect and\nEmpathy",
    description: "Treating everyone with kindness, understanding, and genuine care.",
    imgUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "04",
    title: "Embracing\nChange",
    description: "Staying flexible, forward-thinking, and open to new possibilities.",
    imgUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "05",
    title: "Exceptional\nService",
    description: "Going above and beyond to deliver value, consistency, and care in every interaction.",
    imgUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1000&auto=format&fit=crop",
  },
];

const StaggeredHoverText = ({ text }: { text: string }) => {
  return (
    <span className="relative inline-flex overflow-hidden">
      {/* Primary Text (Moves up and out on hover) */}
      <span className="flex items-center">
        {text.split("").map((char, i) => (
          <span
            key={`primary-${i}`}
            className="inline-block transition-transform duration-[0.4s] ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:-translate-y-full"
            style={{ transitionDelay: `${i * 15}ms` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
      {/* Secondary Text (Moves up and in from below on hover) */}
      <span className="absolute left-0 top-0 flex items-center h-full">
        {text.split("").map((char, i) => (
          <span
            key={`secondary-${i}`}
            className="inline-block transition-transform duration-[0.4s] ease-[cubic-bezier(0.85,0,0.15,1)] translate-y-full group-hover:translate-y-0"
            style={{ transitionDelay: `${i * 15}ms` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </span>
  );
};

export default function CoreValuesGallery() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isIntroVisible, setIsIntroVisible] = useState(false);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const introRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ob1 = new IntersectionObserver(([e]) => { 
      if (e.intersectionRatio >= 0.1) setIsIntroVisible(true); 
      else if (e.intersectionRatio === 0) setIsIntroVisible(false);
    }, { threshold: [0, 0.1] });
    
    const ob2 = new IntersectionObserver(([e]) => { 
      if (e.intersectionRatio >= 0.2) setIsTitleVisible(true); 
      else if (e.intersectionRatio === 0) setIsTitleVisible(false);
    }, { threshold: [0, 0.2] });
    
    if (introRef.current) ob1.observe(introRef.current);
    if (titleRef.current) ob2.observe(titleRef.current);
    return () => { ob1.disconnect(); ob2.disconnect(); };
  }, []);

  const wordsPart1 = "Our engineering team is as diverse as our clients and as driven as our mission. From experienced engineers and support staff to forward-thinking designers,".split(" ");
  const wordsPart2 = "everyone at LockIn is united in creating meaningful productivity experiences.".split(" ");

  return (
    <section className="w-full bg-white flex flex-col pb-0">
      
      {/* 1. Top Edge-to-Edge Media Block */}
      <div className="w-full h-[50vh] md:h-[65vh] min-h-[400px] relative overflow-hidden bg-black/5">
        <Image 
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2850&auto=format&fit=crop"
          alt="LockIn Leadership Team"
          fill
          className="object-cover object-[50%_30%] hover:scale-105 transition-transform duration-[2s] ease-out will-change-transform"
        />
      </div>

      {/* 2. Intro Statement & Buttons Block */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24 flex flex-col gap-12" ref={introRef}>
        <h3 className="font-['Aeonik',sans-serif] text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.1] font-medium max-w-[90%] tracking-tight flex flex-wrap gap-x-[0.25em] gap-y-[0.1em]">
          {wordsPart1.map((word, i) => (
             <span 
               key={i}
               className={`transition-colors duration-[0.8s] ease-in-out ${isIntroVisible ? "text-[#151717]" : "text-[#151717]/10"}`}
               style={{ transitionDelay: `${i * 30}ms` }}
             >
               {word}
             </span>
          ))}
          {wordsPart2.map((word, i) => (
             <span 
               key={`p2-${i}`}
               className={`transition-colors duration-[0.8s] ease-in-out ${isIntroVisible ? "text-[#b3b3b3]" : "text-[#b3b3b3]/20"}`}
               style={{ transitionDelay: `${(wordsPart1.length + i) * 30}ms` }}
             >
               {word}
             </span>
          ))}
        </h3>

        {/* Exact Replica Buttons Stacked Left */}
        <div className={`flex flex-col sm:flex-row gap-4 shrink-0 transition-opacity duration-1000 ease-in-out mt-2 ${isIntroVisible ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: `${(wordsPart1.length + wordsPart2.length) * 30 + 100}ms` }}>
          <button className="group flex items-center justify-center gap-3 bg-[#151717] text-white py-4 px-8 rounded-full font-['Aeonik',sans-serif] text-[16px] font-medium transition-colors hover:bg-black w-max">
            <StaggeredHoverText text="Learn More About Our Agents" />
            <span className="flex overflow-hidden w-4 h-4 relative">
              <ArrowRight className="w-4 h-4 text-white absolute left-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1" />
            </span>
          </button>

          <button className="group flex items-center justify-center gap-3 bg-white border border-[#DCDCDC] text-[#151717] py-4 px-8 rounded-full font-['Aeonik',sans-serif] text-[16px] font-medium transition-colors hover:border-[#151717]/20 w-max">
            <StaggeredHoverText text="Join Our Team" />
            <span className="flex overflow-hidden w-4 h-4 relative">
              <ArrowRight className="w-4 h-4 text-[#151717] absolute left-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </div>

      {/* 3. The Title Section ("Our Core Values") */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col pb-12 md:pb-20 pt-8" ref={titleRef}>
        <div className="flex flex-col">
          <span className={`font-['Aeonik',sans-serif] text-[clamp(2.5rem,4vw,3.5rem)] font-medium leading-[1.15] tracking-[-0.02em] transition-colors duration-1000 ease-in-out ${isTitleVisible ? "text-[#b3b3b3]" : "text-[#151717]/5"}`}>
            Our
          </span>
          <h2 className={`font-['Aeonik',sans-serif] text-[clamp(4.5rem,10vw,8.5rem)] font-medium leading-[1] tracking-[-0.04em] -mt-2 md:-mt-4 transition-colors duration-1000 delay-150 ease-in-out ${isTitleVisible ? "text-[#151717]" : "text-[#151717]/5"}`}>
             Core Values
          </h2>
          <p className={`mt-6 md:mt-12 text-[#151717] font-medium text-lg md:text-xl font-['Aeonik',sans-serif] transition-opacity duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] delay-300 ${isTitleVisible ? "opacity-100" : "opacity-0"}`}>
            LockIn-certified engineers embody the core values that define our culture:
          </p>
        </div>
      </div>

      {/* The Hover Gallery - Edge to Edge */}
      <div className="w-full h-[60vh] min-h-[500px] flex overflow-hidden bg-[#E9E9E7]">
        {CORE_VALUES.map((item, index) => {
          const isHovered = hoveredIndex === index;
          // Native flex-basis scaling logic for 60fps performance
          const flexStyle = hoveredIndex === null 
            ? { flex: "1 1 0%" } 
            : isHovered 
              ? { flex: "3 1 0%" } 
              : { flex: "0.5 1 0%" };

          return (
            <div
              key={item.id}
              className="relative h-full transition-[flex] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden cursor-pointer will-change-[flex]"
              style={flexStyle}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Background Image Panel */}
              <Image 
                src={item.imgUrl}
                alt={item.title.replace('\n', ' ')}
                fill
                className={`object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] ${isHovered ? "scale-105" : "scale-100"}`}
              />
              
              {/* Gradient Overlay for Text Legibility (Soft bottom fade like reference) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Content Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col justify-end">
                <div className="flex flex-col gap-4 w-full">
                  {/* Title */}
                  <h4 className="text-white font-['Aeonik',sans-serif] text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-tight font-medium tracking-tight whitespace-pre-line break-words min-w-[200px]">
                    {item.title}
                  </h4>

                  {/* Fading Description Text */}
                  <div 
                    className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isHovered ? "max-h-[100px] opacity-100 translate-y-0" : "max-h-0 opacity-0 translate-y-4"}`}
                  >
                    <p className="text-white/90 text-sm md:text-base font-medium leading-tight md:min-w-[250px] max-w-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}
