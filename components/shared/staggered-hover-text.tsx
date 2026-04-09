"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StaggeredHoverTextProps {
    text: string;
    className?: string;
}

export const StaggeredHoverText = ({ text, className }: StaggeredHoverTextProps) => {
    return (
        <span className={cn("relative inline-flex overflow-hidden", className)}>
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
