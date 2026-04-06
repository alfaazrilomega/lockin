"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
    PopoverFooter,
} from "@/components/ui/popover";

interface SupabaseAuthUser {
    email?: string;
    user_metadata?: { full_name?: string; avatar_url?: string };
}

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
    const { user, loading, signOut } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section className="relative h-[100svh] w-full overflow-hidden bg-white font-sans text-black">
        
            {/* ─── FIXED NAVBAR (z-50) ─────────────────────────────────────── */}
            <div className="animate-fade-in-down fixed top-0 inset-x-0 z-50 flex items-center justify-between p-6 md:p-10 pointer-events-auto transition-all duration-500" style={{ animationDelay: '4.5s' }}>
                
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
                    <div className="h-8 w-8 text-black transition-transform duration-500 ease-out hover:scale-105 active:scale-95">
                        <svg 
                            viewBox="0 0 24 26" 
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-full w-full fill-current"
                        >
                            <path d="M 18.229 15.111 L 23.201 7.527 C 24.749 5.172 23.974 1.991 21.518 0.621 C 17.877 -1.409 13.559 1.844 14.479 5.926 L 16.413 14.508 C 16.418 14.54 16.423 14.573 16.428 14.607 C 16.511 14.939 16.961 16.482 16.588 17.583 C 15.746 20.071 12.335 20.429 10.098 19.18 C 9.555 18.81 8.572 17.97 8.049 16.479 C 7.981 16.285 7.913 16.124 7.846 15.992 L 7.846 15.992 L 5.641 10.356 C 4.746 8.067 1.615 7.832 0.392 9.962 C -0.405 11.349 0.052 13.123 1.419 13.947 L 7.445 17.583 L 7.445 17.583 C 7.924 17.904 8.793 18.587 9.243 19.563 L 10.82 23.595 C 12.514 27.925 18.985 25.924 17.962 21.385 L 17.464 18.841 C 17.373 18.305 17.416 17.69 17.485 17.2 C 17.571 16.592 17.79 16.016 18.055 15.463 C 18.142 15.281 18.213 15.134 18.229 15.111 Z" />
                            <path d="M 5.813 23.069 C 5.813 24.688 4.511 26 2.906 26 C 1.301 26 0 24.688 0 23.069 C 0 21.45 1.301 20.137 2.906 20.137 C 4.511 20.137 5.813 21.45 5.813 23.069 Z" />
                        </svg>
                    </div>
                </Link>

                {/* Center glass pill (Dynamic Scroll State) */}
                <div className={`hidden lg:flex items-center gap-10 rounded-full px-10 py-3.5 transition-all duration-500 border absolute left-1/2 -translate-x-1/2 ${
                    isScrolled 
                        ? "bg-white/20 border-white/40 backdrop-blur-md shadow-sm"
                        : "bg-transparent border-transparent backdrop-blur-none shadow-none"
                }`}>
                    {[
                        { name: "Features", href: "#features" },
                        { name: "Contact", href: "/contact" },
                        { name: "Workspace", href: "/dashboard" },
                    ].map((item) => (
                        <Link key={item.name} href={item.href} className="text-sm font-medium text-slate-800 hover:text-black transition-colors">
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Auth */}
                <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
                    {!loading && user ? (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" className="h-10 w-10 rounded-full p-0 flex-shrink-0 cursor-pointer">
                                    <Avatar className="h-10 w-10 ring-2 ring-white/60 hover:ring-white transition-all shadow-sm">
                                        <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} className="object-cover" />
                                        <AvatarFallback className="bg-slate-100 text-slate-800 font-semibold text-sm">
                                            {(user as SupabaseAuthUser).user_metadata?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 z-[60] bg-white/90 backdrop-blur-xl border border-slate-200/50 text-black shadow-xl rounded-xl pointer-events-auto">
                                <PopoverHeader className="border-black/5">
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="h-10 w-10 border border-black/5">
                                            <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} className="object-cover" />
                                            <AvatarFallback className="bg-slate-100 text-slate-800 font-semibold text-sm">
                                                {(user as SupabaseAuthUser).user_metadata?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <PopoverTitle className="text-black font-semibold">{(user as SupabaseAuthUser).user_metadata?.full_name || "User Profile"}</PopoverTitle>
                                            <PopoverDescription className="text-xs text-black/60">{user.email}</PopoverDescription>
                                        </div>
                                    </div>
                                </PopoverHeader>
                                <PopoverBody className="space-y-1 px-2 py-1 mt-2">
                                    <Button variant="ghost" className="w-full justify-start text-black/70 hover:text-black hover:bg-black/5 transition-colors" size="sm" asChild>
                                        <Link href="/dashboard"><User className="mr-2 h-4 w-4" />View Profile</Link>
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start text-black/70 hover:text-black hover:bg-black/5 transition-colors" size="sm" asChild>
                                        <Link href="/dashboard/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link>
                                    </Button>
                                </PopoverBody>
                                <PopoverFooter className="border-black/5 mt-2 pt-2">
                                    <Button variant="outline" className="w-full bg-transparent border-black/20 text-black hover:bg-black hover:text-white transition-colors shadow-none" size="sm"
                                        onClick={async () => { await signOut(); window.location.reload(); }}>
                                        <LogOut className="mr-2 h-4 w-4" />Sign Out
                                    </Button>
                                </PopoverFooter>
                            </PopoverContent>
                        </Popover>
                    ) : (
                        <>
                            <Link href="/auth/sign-in" className="hidden sm:block text-sm font-medium text-slate-700 hover:text-black transition-colors">Log in</Link>
                            <Link href="/auth/sign-in" className="rounded-full bg-black text-white px-5 py-2.5 text-sm font-bold shadow-md hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all duration-200">Sign up</Link>
                        </>
                    )}
                </div>
            </div>

            {/* ─── LAYER 0: Bright Sky Background ──────────────────────────── */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/white-them-BG_hero.png"
                    alt="Bright Atmospheric Sky"
                    fill
                    className="object-cover object-center"
                    priority
                    unoptimized
                />
                {/* Light frosted gradient — keeps bottom HUD legible */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/90 pointer-events-none" />
            </div>

            {/* ─── LAYER 10: Giant 3D Typography ───────────────────────────────
                  .hero-text-brush wrapper: clip-path wipes L→R via textBrush @keyframe.
                  The h1 inside is UNTOUCHED — mask-image, mix-blend, tracking all preserved. */}
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <div className="hero-text-brush">
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
                        unoptimized
                        className="w-full h-auto drop-shadow-2xl origin-bottom scale-[1.42]"
                        style={{ animation: 'buildingRise 1s cubic-bezier(0.22, 1, 0.36, 1) both', animationDelay: '4.5s' }}
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
                            unoptimized
                            className="w-full h-auto object-bottom drop-shadow-2xl translate-x-[10px]"
                            style={{ animation: 'buildingRise 1s cubic-bezier(0.22, 1, 0.36, 1) both', animationDelay: '4.65s' }}
                        />
                    </div>

                    {/* RIGHT WING — Anchored strictly to the RIGHT side of the middle */}
                    <div className="absolute bottom-0 left-[37%] w-full z-[-1]">
                        {/* TWEAK `-translate-x-[Xpx]` to close any remaining gap */}
                        <Image
                            src="/images/Half-Rigth-Hero-section.png"
                            alt="Building Right"
                            width={1200}
                            height={1200}
                            priority
                            unoptimized
                            className="w-full h-auto object-bottom drop-shadow-2xl -translate-x-[10px]"
                            style={{ animation: 'buildingRise 1s cubic-bezier(0.22, 1, 0.36, 1) both', animationDelay: '4.8s' }}
                        />
                    </div>
                </div>

                {/* Ground fade */}
                <div className="absolute inset-x-0 bottom-0 h-[25vh] bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none" />
            </div>

            {/* ─── LAYER 30: UI HUD (Stats + Scroll) ─────────────────── */}
            <div className="absolute inset-0 z-30 flex flex-col justify-end pointer-events-none">

                {/* ── Bottom HUD — fades in at 4800ms ──────────────────────── */}
                <div className="hero-ui-fade-bottom flex flex-col md:flex-row items-center md:items-end w-full justify-between p-6 md:p-10 lg:p-14 gap-10 md:gap-0 pointer-events-auto">

                    {/* Left: Stats + CTA */}
                    <div className="flex flex-col gap-6">
                        {/* Stats row */}
                        <div className="flex flex-row items-start gap-8 md:gap-12">
                            <div className="flex flex-col gap-1 animate-fade-in-up" style={{ animationDelay: '4.6s' }}>
                                <h3 className="font-outfit text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">10K<span className="text-slate-400">+</span></h3>
                                <p className="font-satoshi text-[10px] font-medium text-slate-500 tracking-[0.2em] uppercase mt-1">Active Users</p>
                            </div>
                            <div className="flex flex-col gap-1 animate-fade-in-up" style={{ animationDelay: '4.7s' }}>
                                <h3 className="font-outfit text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">99.9<span className="text-slate-400">%</span></h3>
                                <p className="font-satoshi text-[10px] font-medium text-slate-500 tracking-[0.2em] uppercase mt-1">Uptime</p>
                            </div>
                            <div className="flex flex-col gap-1 animate-fade-in-up" style={{ animationDelay: '4.8s' }}>
                                <h3 className="font-outfit text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">24/7</h3>
                                <p className="font-satoshi text-[10px] font-medium text-slate-500 tracking-[0.2em] uppercase mt-1">Support</p>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col gap-4 mt-8 animate-fade-in-up" style={{ animationDelay: '4.9s' }}>
                            <Link href="/dashboard" className="inline-flex items-center gap-3 self-start rounded-full bg-black pl-6 pr-2 py-2 text-sm font-bold tracking-wide text-white hover:bg-black/80 hover:scale-[1.03] active:scale-95 transition-all duration-300 shadow-xl">
                                Get Started
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </Link>
                            {/* Apple blur reveal at 5000ms */}
                            <p className="hero-blur-reveal font-satoshi text-sm font-normal text-slate-600 leading-relaxed max-w-md">
                                LockIn brings together the intelligence of AI with the timeless art of high-performance management. Your definitive workspace.
                            </p>
                        </div>
                    </div>

                    {/* Right: Awwwards Scroll Indicator */}
                    <div className="hidden md:flex flex-col items-center gap-3 self-end pb-1 animate-fade-in" style={{ animationDelay: '5.2s' }}>
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
