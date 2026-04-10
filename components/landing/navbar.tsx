"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { useAuth } from "@/hooks/use-auth";
import { useLenis } from "lenis/react";
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
import { Button } from "@/components/ui/button";
import { LogOut, Settings, User } from "lucide-react";
import { StaggeredHoverText } from "@/components/shared/staggered-hover-text";

export interface SupabaseAuthUser {
    email?: string;
    user_metadata?: { full_name?: string; avatar_url?: string };
}

export default function Navbar({ delay = 0 }: { delay?: number }) {
    const { user, loading, signOut } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [actualDelay, setActualDelay] = useState(delay);
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (typeof window !== 'undefined' && (window as unknown as { __preloaderDone?: boolean }).__preloaderDone) {
                setActualDelay(0);
            } else {
                setActualDelay(delay);
            }
        }, 0);
        return () => clearTimeout(timer);
    }, [delay]);

    const updateNavVisibility = useCallback(() => {
        const nav = navRef.current;
        if (!nav) return;

        const faq = document.querySelector("#faq");
        const mainContentLayer = document.querySelector("#main-content-layer");

        let shouldHide = false;

        // Hide when FAQ is at the top of the viewport
        if (faq) {
            const rect = faq.getBoundingClientRect();
            if (rect.top <= 80 && rect.bottom > 0) {
                shouldHide = true;
            }
        }

        // Hide when the parallax Footer is revealed.
        // Since the footer is sticky behind the main content layer,
        // it is revealed when the bottom of main-content-layer moves above the bottom of the viewport.
        // We trigger it exactly when 20px of the footer is exposed.
        if (mainContentLayer) {
            const rect = mainContentLayer.getBoundingClientRect();
            if (rect.bottom <= window.innerHeight - 20) {
                shouldHide = true;
            }
        }

        nav.style.opacity = shouldHide ? "0" : "1";
        nav.style.transform = shouldHide ? "translateY(-100%)" : "translateY(0)";
        nav.style.pointerEvents = shouldHide ? "none" : "auto";
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", updateNavVisibility, { passive: true });
        return () => window.removeEventListener("scroll", updateNavVisibility);
    }, [updateNavVisibility]);

    useEffect(() => {
        const nav = navRef.current;
        if (!nav) return;
        if (actualDelay === 0) {
            nav.style.animation = "none";
            nav.style.opacity = "1";
            nav.style.transform = "translateY(0)";
            return;
        }
        const onAnimEnd = () => {
            nav.style.animation = "none";
            nav.style.opacity = "1";
            nav.style.transform = "translateY(0)";
        };
        nav.addEventListener("animationend", onAnimEnd);
        return () => nav.removeEventListener("animationend", onAnimEnd);
    }, [actualDelay]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useLenis(updateNavVisibility);

    return (
        <div
            ref={navRef}
            id="main-navbar"
            className={`${actualDelay > 0 ? 'animate-fade-in-down' : ''} fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-10 pointer-events-auto transition-all duration-500 will-change-[padding,background-color,backdrop-filter] ${isScrolled
                ? "py-4 backdrop-blur-lg bg-white/10"
                : "py-6 bg-transparent"
                }`}
            style={{
                animationDelay: actualDelay > 0 ? `${actualDelay}s` : undefined,
                transition: 'padding 400ms cubic-bezier(0.16, 1, 0.3, 1), background-color 400ms, backdrop-filter 400ms, opacity 400ms cubic-bezier(0.16, 1, 0.3, 1), transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
        >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
                <Logo className="h-13 w-13 transition-transform duration-500 ease-out group-hover:scale-105 active:scale-95" />
            </Link>

            {/* Center nav links */}
            <div className="hidden lg:flex items-center gap-10 px-10 py-3.5 absolute left-1/2 -translate-x-1/2">
                {[
                    { name: "Home", href: "/" },
                    { name: "Workspace", href: "/dashboard" },
                    { name: "Feature", href: "/feature" },
                    { name: "Contact", href: "/contact" },
                ].map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="group relative text-sm font-medium text-slate-800 hover:text-black transition-colors py-1 overflow-hidden"
                    >
                        <StaggeredHoverText text={item.name} />
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
                ) : !loading && !user ? (
                    <>
                        <Link href="/auth/sign-in" className="group hidden sm:inline-flex text-sm font-semibold tracking-wide text-black/70 hover:text-black transition-colors px-2 py-1 overflow-hidden">
                            <StaggeredHoverText text="Log in" />
                        </Link>
                        <Link href="/auth/sign-up" className="group inline-flex items-center justify-center rounded-3xl bg-black px-5 py-2.5 text-sm font-semibold tracking-wide text-white hover:bg-black/80 hover:scale-[1.02] active:scale-95 transition-all shadow-md overflow-hidden">
                            <StaggeredHoverText text="Sign up" />
                        </Link>
                    </>
                ) : (
                    <div className="h-10 w-24 animate-pulse bg-slate-200 rounded-full" />
                )}
            </div>
        </div>
    );
}
