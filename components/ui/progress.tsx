"use client";

import * as React from "react";

interface ProgressProps {
  value: number;
  className?: string;
  size?: "default" | "sm";
}

export function Progress({ value, className, size = "default", ...props }: ProgressProps) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-full bg-border ${
        size === "sm" ? "h-1.5" : "h-2"
      } ${className}`}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      {...props}
    >
      <div
        className="flex h-full w-full items-center justify-center bg-primary transition-all duration-300"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}