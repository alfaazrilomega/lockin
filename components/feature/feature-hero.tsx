"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FlowHoverButton } from "@/components/ui/flow-hover-button";
import Navbar from "@/components/landing/navbar";

export default function FeatureHero() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const heroRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Delay animation to sync with the initial site preloader
    const isPreloaderDone = typeof window !== 'undefined' && (window as any).__preloaderDone;
    
    if (isPreloaderDone) {
      setMounted(true);
      setHasLoadedOnce(true);
    } else {
      const timer = setTimeout(() => {
        setMounted(true);
        setHasLoadedOnce(true);
      }, 4400);
      return () => {
        window.removeEventListener("scroll", handleScroll);
        clearTimeout(timer);
      };
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedOnce) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio > 0.1) setMounted(true);
      else if (entry.intersectionRatio === 0) setMounted(false);
    }, { threshold: [0, 0.1] });
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, [hasLoadedOnce]);

  return (
    <section ref={heroRef} className="relative w-full min-h-screen bg-[#FDFDFD] flex flex-col items-center">
      {/* Navbar clone */}
      {/* Unified Global Navbar */}
      <Navbar />

      {/* Hero Typography */}
      <div className="flex flex-col items-center justify-center text-center mt-32 md:mt-44 px-6 md:px-12 w-full z-10">
        <h1 className="font-['Aeonik',sans-serif] text-[clamp(2.8rem,7vw,6.5rem)] leading-[1.05] tracking-[-0.04em] font-medium text-black">
          <span className="block overflow-hidden relative pb-1">
            <span className={`block transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] ${mounted ? "translate-y-0" : "translate-y-full"}`}>
              Supercharge Your Workflow
            </span>
          </span>
          <span className="block overflow-hidden relative pb-1">
            <span className={`block transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] delay-[100ms] ${mounted ? "translate-y-0" : "translate-y-full"}`}>
              Depth with Trusted
            </span>
          </span>
          <span className="block overflow-hidden relative pb-1">
            <span className={`block transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] delay-[200ms] ${mounted ? "translate-y-0" : "translate-y-full"}`}>
              Integrations
            </span>
          </span>
        </h1>
      </div>

      {/* Hero Image Banner - Edge to Edge */}
      <div className={`w-full mt-16 md:mt-24 mb-32 z-10 transition-all duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] delay-[400ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}>
        <div className="relative w-full h-[50vh] md:h-[75vh] bg-[#eaeaea] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2850&auto=format&fit=crop"
            alt="Team Collaborating"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </div>
    </section>
  );
}
