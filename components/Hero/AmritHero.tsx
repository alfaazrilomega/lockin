"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/landing/navbar";

import { StaggeredHoverText } from "@/components/shared/staggered-hover-text";

const ScrollAnimatedStat = ({ endValue, suffix, label, delayMs, isFloat = false, baseDelayOffset = 0 }: { endValue: number, suffix: React.ReactNode, label: string, delayMs: number, isFloat?: boolean, baseDelayOffset?: number }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [hasInitialLoaded, setHasInitialLoaded] = useState(false);

  useEffect(() => {
    // If we've finished the initial cinematic delay (baseDelayOffset), mark as loaded
    const timer = setTimeout(() => setHasInitialLoaded(true), baseDelayOffset * 1000 + 100);
    return () => clearTimeout(timer);
  }, [baseDelayOffset]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio > 0.1) setIsVisible(true);
      else if (entry.intersectionRatio === 0) setIsVisible(false);
    }, { threshold: [0, 0.1] });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) {
      setCount(0);
      return;
    }

    const easeOutExpo = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    let startTime: number;
    let rAF: number;
    
    // Calculate the actual delay: 
    // If not first load, use a fast reveal (100ms + incremental offset)
    // If first load, use the full cinematic delayMs
    const incrementalOffset = delayMs - 4600; // e.g., 4600 -> 0, 4700 -> 100
    const actualDelay = hasInitialLoaded ? (100 + incrementalOffset) : delayMs;

    const timer = setTimeout(() => {
      const tick = (time: number) => {
        if (!startTime) startTime = time;
        const progress = Math.min((time - startTime) / 2000, 1);
        setCount(easeOutExpo(progress) * endValue);
        if (progress < 1) {
          rAF = requestAnimationFrame(tick);
        }
      };
      rAF = requestAnimationFrame(tick);
    }, actualDelay);

    return () => {
      clearTimeout(timer);
      if (rAF) cancelAnimationFrame(rAF);
    };
  }, [isVisible, endValue, delayMs, hasInitialLoaded]);

  const incrementalOffset = delayMs - 4600;
  const actualDelay = hasInitialLoaded ? (100 + incrementalOffset) : delayMs;

  return (
    <div 
      ref={ref} 
      className={`flex flex-col gap-1 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} 
      style={{ transitionDelay: `${actualDelay}ms` }}
    >
        <h3 className="font-outfit text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight flex items-baseline">
          {isFloat ? count.toFixed(1) : Math.floor(count)}
          <span className="text-slate-400">{suffix}</span>
        </h3>
        <p className="font-satoshi text-[10px] font-medium text-slate-500 tracking-[0.2em] uppercase mt-1 overflow-hidden">
          <span className="flex">
            {label.split("").map((char, i) => (
              <span
                key={i}
                className={`inline-block transition-transform duration-[0.6s] ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? "translate-y-0" : "translate-y-[120%]"}`}
                style={{ transitionDelay: `${actualDelay + (i * 15)}ms` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
        </p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// chief-architect-agent Notes:
//
// ALL animation classes (.hero-*) are defined in globals.css — NOT as inline
// style props (Turbopack strips those) and NOT in <style> tags (React unmounts
// those between renders, breaking SSR hydration).
//
// animation-fill-mode: both in globals.css means each element renders at its
// `from` keyframe state (invisible/transformed) BEFORE the delay fires,
// then locks at `to` after completion. No opacity:0 className needed.
//
// Building layout: The three assets are HORIZONTAL SLICES of one panorama.
// They must sit side-by-side in a flex row at the bottom, NOT stacked with
// inset-0 (which overlaps them). Each image gets natural height via aspect
// ratio inside a 1/3-width column.
// ─────────────────────────────────────────────────────────────────────────────

const AmritHero = () => {
    // Simplified logic, Navbar handles its own scroll logic and state.
    const [baseDelay, setBaseDelay] = useState(4.5);

    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).__preloaderDone) {
            setBaseDelay(0);
        }
    }, []);

    return (
        <section className="relative h-[100svh] w-full overflow-hidden bg-white font-sans text-black">

            {/* Unified Global Navbar */}
            <Navbar delay={baseDelay} />

            {/* ─── LAYER 0: Bright Sky Background ──────────────────────────── */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/white-theme-BG_hero.png"
                    alt="Bright Atmospheric Sky"
                    fill
                    className="object-cover object-center"
                    priority
                />
                {/* Light frosted gradient — keeps bottom HUD legible */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/90 pointer-events-none" />
            </div>

            {/* ─── LAYER 10: Giant 3D Typography ───────────────────────────────
                  .hero-text-brush wrapper: clip-path wipes L→R via textBrush @keyframe.
                  The h1 inside is UNTOUCHED — mask-image, mix-blend, tracking all preserved. */}
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <div className="hero-text-brush" style={{ animationDelay: `${baseDelay}s` }}>
                    <h1
                        className="font-satoshi text-[clamp(4rem,15vw,22rem)] font-black leading-none tracking-tighter text-slate-900/60 uppercase mix-blend-multiply select-none mb-[15vh]"
                        style={{
                            maskImage: "linear-gradient(to bottom, black 20%, transparent 100%)",
                            WebkitMaskImage: "linear-gradient(to bottom, black 20%, transparent 100%)",
                        }}
                    >
                        LOCKIN
                    </h1>
                </div>
            </div>

            {/* ─── LAYER 20: Three Building Slices (Stitched Panorama) ────────── */}
            <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none flex justify-center items-end">

                {/* MIDDLE ANCHOR */}
                <div className="relative w-[300px] md:w-[450px] lg:w-[550px] xl:w-[650px] flex justify-center">

                    {/* Swapped 'fill' for w-full h-auto, added scale to match wing heights */}
                    <Image
                        src="/images/Half-Middle-Hero-section.png"
                        alt="Building Centre"
                        width={1200}
                        height={1200}
                        priority
                        className="w-full h-auto drop-shadow-2xl origin-bottom scale-[1.42]"
                        style={{ animation: 'buildingRise 1s cubic-bezier(0.22, 1, 0.36, 1) both', animationDelay: `${baseDelay}s` }}
                    />

                    {/* LEFT WING — Anchored strictly to the LEFT side of the middle */}
                    <div className="absolute bottom-0 right-[37%] w-full z-[-1]">
                        {/* TWEAK `translate-x-[Xpx]` to close any remaining gap */}
                        <Image
                            src="/images/Half-Left-Hero-section.png"
                            alt="Building Left"
                            width={1200}
                            height={1200}
                            priority
                            className="w-full h-auto object-bottom drop-shadow-2xl translate-x-[10px]"
                            style={{ animation: 'buildingRise 1s cubic-bezier(0.22, 1, 0.36, 1) both', animationDelay: `${baseDelay + 0.15}s` }}
                        />
                    </div>

                    {/* RIGHT WING — Anchored strictly to the RIGHT side of the middle */}
                    <div className="absolute bottom-0 left-[37%] w-full z-[-1]">
                        {/* TWEAK `-translate-x-[Xpx]` to close any remaining gap */}
                        <Image
                            src="/images/Half-Right-Hero-section.png"
                            alt="Building Right"
                            width={1200}
                            height={1200}
                            priority
                            className="w-full h-auto object-bottom drop-shadow-2xl -translate-x-[10px]"
                            style={{ animation: 'buildingRise 1s cubic-bezier(0.22, 1, 0.36, 1) both', animationDelay: `${baseDelay + 0.3}s` }}
                        />
                    </div>
                </div>

                {/* Ground fade */}
                <div className="absolute inset-x-0 bottom-0 h-[25vh] bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none" />
            </div>

            {/* ─── LAYER 30: UI HUD (Stats + Scroll) ─────────────────── */}
            <div className="absolute inset-0 z-30 flex flex-col justify-end pointer-events-none">

                {/* ── Bottom HUD — fades in at 4800ms ──────────────────────── */}
                <div 
                  className="hero-ui-fade-bottom flex flex-col md:flex-row items-center md:items-end w-full justify-between p-6 md:p-10 lg:p-14 gap-10 md:gap-0 pointer-events-auto"
                  style={{ animationDelay: `${baseDelay + 0.3}s` }}
                >

                    {/* Left: Stats + CTA */}
                    <div className="flex flex-col gap-6">
                        {/* Stats row */}
                        <div className="flex flex-row items-start gap-8 md:gap-12">
                            <ScrollAnimatedStat endValue={10} suffix="K+" label="Active Users" delayMs={baseDelay * 1000 + 100} baseDelayOffset={baseDelay} />
                            <ScrollAnimatedStat endValue={99.9} suffix="%" label="Uptime" delayMs={baseDelay * 1000 + 200} baseDelayOffset={baseDelay} isFloat={true} />
                            <ScrollAnimatedStat endValue={24} suffix="/7" label="Support" delayMs={baseDelay * 1000 + 300} baseDelayOffset={baseDelay} />
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col gap-4 mt-8 animate-fade-in-up" style={{ animationDelay: `${baseDelay + 0.4}s` }}>
                            <Link href="/dashboard" className="group inline-flex items-center gap-3 self-start rounded-full bg-black pl-6 pr-2 py-2 text-sm font-bold tracking-wide text-white hover:bg-black/80 hover:scale-[1.03] active:scale-95 transition-all duration-300 shadow-xl">
                                <StaggeredHoverText text="Get Started" />
                                <div className="flex overflow-hidden h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white relative">
                                    <ArrowRight className="h-4 w-4 absolute transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1" />
                                </div>
                            </Link>
                            {/* Apple blur reveal at 5000ms */}
                            <p className="hero-blur-reveal font-satoshi text-sm font-normal text-slate-600 leading-relaxed max-w-md" style={{ animationDelay: `${baseDelay + 0.5}s` }}>
                                LockIn brings together the intelligence of AI with the timeless art of high-performance management. Your definitive workspace.
                            </p>
                        </div>
                    </div>

                    {/* Right: Awwwards Scroll Indicator */}
                    <div className="hidden md:flex flex-col items-center gap-3 self-end pb-1 animate-fade-in" style={{ animationDelay: `${baseDelay + 0.7}s` }}>
                        <span
                            className="font-satoshi text-[10px] font-semibold tracking-[0.35em] uppercase text-slate-800/60 select-none"
                            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                        >
                            SCROLL
                        </span>
                        <div className="relative w-[1px] h-20 bg-slate-800/20 overflow-hidden rounded-full">
                            <div className="hero-scroll-track absolute top-0 left-0 w-full h-1/3 bg-slate-800/70 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AmritHero;
