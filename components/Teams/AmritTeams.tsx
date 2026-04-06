"use client";

import React, { useRef, useLayoutEffect } from "react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// AmritTeams — Amaterasu-Style Fluid Wave Transition
//
// Performance Architecture:
//   - ZERO React state / re-renders for the animation loop.
//   - useLayoutEffect + rAF writes --wave-progress DIRECTLY to a DOM node
//     via ref.current.style.setProperty. Pure CSS handles all visual math.
//
// Choreography (0 to 1 scroll progress):
//   Layer 10 (Hero Remnant): Melts via CSS blur and fades out.
//   Layer 20 (Wave Illusion): A tiny dot expands exponentially via transform: scale
//     until its pure white/sky-blue gradient completely consumes the viewport.
//   Layer 30 (Teams UI): Revealed within the whiteout, fading in on top.
//
// Banned: GSAP, Framer Motion, inline <style>. High-perf CSS only.
// ─────────────────────────────────────────────────────────────────────────────

export default function AmritTeams() {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number>(0);

    useLayoutEffect(() => {
        const tick = () => {
            const section = sectionRef.current;
            const container = containerRef.current;
            if (section && container) {
                const { top, height } = section.getBoundingClientRect();
                const viewH = window.innerHeight;
                const raw = -top / (height - viewH);
                const clamped = Math.max(0, Math.min(1, raw));
                
                // Direct DOM mutation for 60FPS fluid wipe
                container.style.setProperty("--wave-progress", String(clamped));
            }
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full z-10"
            style={{ height: "300vh" }}
        >
            {/* ── Sticky Viewport Camera ──────────────────────────────────── */}
            <div
                ref={containerRef}
                className="amrit-wave-sticky sticky top-0 h-[100svh] w-full overflow-hidden"
                style={{ "--wave-progress": "0" } as React.CSSProperties}
            >
                {/* ── Layer 10: The Live Hero Melt ──────────────────────────── */}
                {/* 
                   Because AmritTeams wraps OVER the permanently sticky Hero,
                   we don't need a fake background. This layer simply uses 
                   backdrop-filter to physically melt the actual live Hero.
                */}
                <div className="amrit-wave-hero absolute inset-0 pointer-events-none" />

                {/* ── Layer 20: The Expanding Radial Wave ─────────────────── */}
                {/* Expands from center, perfectly matching Amaterasu scale blur logic */}
                <div className="amrit-wave-element pointer-events-none" />

                {/* ── Layer 30: Incoming Teams UI ─────────────────────────── */}
                <div className="amrit-wave-teams absolute inset-0 flex items-center justify-center px-6 pointer-events-none">
                    <div className="flex flex-col items-center text-center max-w-5xl">
                        
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.25em] mb-8 block">
                            The Teams Protocol
                        </span>

                        <h2 className="font-satoshi uppercase font-black tracking-tighter leading-[0.85] text-slate-900">
                            <span className="block text-6xl md:text-[8rem]">
                                Radical
                            </span>
                            <span className="block text-6xl md:text-[8rem] text-slate-400">
                                Synchronization.
                            </span>
                        </h2>

                        <p className="text-slate-600 font-medium text-lg md:text-xl max-w-2xl mt-10 leading-relaxed text-balance">
                            Stop managing tasks. Start locking in together. Align your
                            team&apos;s deep work schedules and eliminate asynchronous friction.
                        </p>

                        {/* CTA wrapper to restore pointer-events specifically for the button */}
                        <div className="mt-12 pointer-events-auto">
                            <Link
                                href="/auth/sign-in"
                                className="inline-flex items-center gap-3 bg-black text-white rounded-full pl-8 pr-3 py-3 font-bold text-sm tracking-wide hover:bg-slate-800 hover:scale-[1.03] transition-all duration-300 shadow-xl"
                            >
                                Initialize Workspace
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-4 w-4"
                                    >
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
