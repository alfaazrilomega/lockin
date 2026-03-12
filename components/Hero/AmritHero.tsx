"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, Star } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { BlurReveal } from "@/components/ui/blur-reveal";
import { AvatarCircles } from "@/components/ui/avatar-circles";

// ... inside imports add useAuth and Popover UI
import { useAuth } from "@/hooks/use-auth";
import { User, Settings, LogOut } from "lucide-react";

interface SupabaseAuthUser {
  email?: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
}
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
import { createClientComponentClient } from "@/lib/supabase/client";

const avatarUrls = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&h=256&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=crop"
];

const AmritHero = () => {
    const visionStatement = "LockIn is the definitive workspace for leaders who demand clarity and precision. We bring together the intelligence of AI with the timeless art of high-performance management.";
    const { user, loading } = useAuth();
    
    // Smooth Parallax for the Background Image
    const { scrollY } = useScroll();
    const bgY = useTransform(scrollY, [0, 1000], ["0%", "30%"]);

    return (
        <section className="relative h-screen w-full overflow-hidden bg-black font-sans text-[#FDF8F1]">
            {/* Background Image with Overlay */}
            <motion.div 
                style={{ y: bgY }}
                className="absolute inset-x-0 -top-[15%] -bottom-[15%] z-0"
            >
                <Image
                    src="/images/hero-bg.png"
                    alt="Luxury Boardroom"
                    fill
                    className="object-cover object-center"
                    priority
                />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
            </motion.div>

            {/* Top Navbar */}
            <motion.nav
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="absolute top-0 left-0 right-0 z-50 flex h-24 items-center justify-between px-8 md:px-12"
            >
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-10 w-10 text-[#D18E4E]">
                        <svg viewBox="0 0 100 100" className="h-full w-full fill-current">
                            <path d="M50 10L90 90H10L50 10Z" fill="none" stroke="currentColor" strokeWidth="4" />
                            <path d="M30 40L70 40M40 60L60 60" stroke="currentColor" strokeWidth="4" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-widest text-[#D18E4E]">LOCKIN</span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden items-center gap-8 text-sm font-medium tracking-wide md:flex">
                    {["PROJECTS", "TEAMS", "CONTACT"].map((item) => (
                        <Link key={item} href={`/${item.toLowerCase()}`} className="hover:text-[#D18E4E] transition-colors">
                            {item}
                        </Link>
                    ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-2 group cursor-pointer">
                        <span className="text-sm font-bold tracking-widest">WORKSPACE</span>
                        <div className="relative h-12 w-12 flex items-center justify-center bg-[#E28C44] text-black">
                            <LayoutDashboard className="h-5 w-5" />
                        </div>
                    </Link>
                    <div className="h-12 w-[1px] bg-[#FDF8F1]/20 mx-2" />
                    
                    {!loading && user ? (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" className="h-10 w-10 rounded-full p-0 flex-shrink-0">
                                    <Avatar className="h-10 w-10 border border-[#D18E4E]/50">
                                        <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} />
                                        <AvatarFallback className="bg-black text-[#D18E4E]">{(user as SupabaseAuthUser).user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 z-[60] bg-black/95 border-[#D18E4E]/30 text-[#FDF8F1] backdrop-blur-md">
                                <PopoverHeader className="border-[#FDF8F1]/10">
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} />
                                            <AvatarFallback className="bg-black text-[#D18E4E]">{(user as SupabaseAuthUser).user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <PopoverTitle className="text-[#FDF8F1]">{(user as SupabaseAuthUser).user_metadata?.full_name || "User Profile"}</PopoverTitle>
                                            <PopoverDescription className="text-xs text-[#FDF8F1]/60">{user.email}</PopoverDescription>
                                        </div>
                                    </div>
                                </PopoverHeader>
                                <PopoverBody className="space-y-1 px-2 py-1">
                                    <Button variant="ghost" className="w-full justify-start text-[#FDF8F1] hover:text-[#D18E4E] hover:bg-[#FDF8F1]/5" size="sm" asChild>
                                        <Link href="/dashboard">
                                            <User className="mr-2 h-4 w-4" />
                                            View Profile
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start text-[#FDF8F1] hover:text-[#D18E4E] hover:bg-[#FDF8F1]/5" size="sm" asChild>
                                        <Link href="/dashboard/settings">
                                            <Settings className="mr-2 h-4 w-4" />
                                            Settings
                                        </Link>
                                    </Button>
                                </PopoverBody>
                                <PopoverFooter className="border-[#FDF8F1]/10">
                                    <Button variant="outline" className="w-full bg-transparent border-[#D18E4E]/30 text-[#D18E4E] hover:bg-[#D18E4E] hover:text-black transition-colors" size="sm" onClick={async () => {
                                        const supabase = createClientComponentClient();
                                        await supabase.auth.signOut();
                                        window.location.reload();
                                    }}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Sign Out
                                    </Button>
                                </PopoverFooter>
                            </PopoverContent>
                        </Popover>
                    ) : (
                        <Link href="/auth/sign-in" className="flex items-center gap-2 group cursor-pointer group-hover:opacity-80 transition-opacity">
                            <span className="text-sm font-bold tracking-widest text-[#D18E4E]">LOGIN</span>
                        </Link>
                    )}
                </div>
            </motion.nav>

            {/* Center Hero Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
                <div className="relative">
                    {/* Decorative Labels */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="absolute top-1/2 left-0 -translate-y-1/2 pr-4 md:pr-12 lg:pr-16"
                    >
                        <span className="text-[10px] md:text-[11px] font-normal tracking-[0.5em] text-[#FDF8F1]/80 whitespace-nowrap">
                            SERVING GLOBAL TEAMS
                        </span>
                    </motion.div>

                    <BlurReveal
                        as="h1"
                        className="font-serif text-6xl font-medium leading-[1.05] tracking-tight md:text-9xl uppercase text-center"
                        delay={0.2}
                        speedReveal={1.2}
                    >
                        ORCHESTRATE EXCELLENCE
                    </BlurReveal>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="absolute top-1/2 right-0 -translate-y-1/2 pl-4 md:pl-12 lg:pl-16"
                    >
                        <span className="text-[10px] md:text-[11px] font-normal tracking-[0.5em] text-[#FDF8F1]/80 whitespace-nowrap">
                            ESTABLISHED 2024
                        </span>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Accessories */}
            <div className="absolute bottom-12 left-0 right-0 z-10 flex items-end justify-between px-8 md:px-12">
                {/* Vision Statement (Animated per letter staggered by word) */}
                <div className="max-w-md text-xs font-medium leading-relaxed tracking-wide text-[#FDF8F1]/80 md:text-sm">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: {
                                transition: {
                                    staggerChildren: 0.015,
                                    delayChildren: 1.5,
                                }
                            }
                        }}
                    >
                        {visionStatement.split(" ").map((word, wordIndex) => (
                            <span key={wordIndex} className="inline-block mr-[0.25em] whitespace-nowrap">
                                {word.split("").map((char, charIndex) => (
                                    <motion.span
                                        key={charIndex}
                                        variants={{
                                            hidden: { opacity: 0, y: 5 },
                                            visible: { opacity: 1, y: 0 }
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="inline-block"
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </span>
                        ))}
                    </motion.div>
                </div>

                {/* Review Widget (New AvatarCircles Design) */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 2 }}
                    className="hidden flex-col items-end gap-3 md:flex"
                >
                    <AvatarCircles numPeople={3572} avatarUrls={avatarUrls} />
                    <div className="flex flex-col items-end text-right">
                        <div className="flex items-center gap-1 text-[#D18E4E] mb-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-current" />
                            ))}
                            <span className="ml-2 text-lg font-bold text-[#FDF8F1]">4.7</span>
                        </div>
                        <p className="text-[10px] font-bold tracking-widest text-[#FDF8F1]/60 uppercase">
                            TRUSTED BY 3,576+ GLOBAL LEADERS
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AmritHero;
