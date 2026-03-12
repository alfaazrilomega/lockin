"use client";

import * as React from "react";

interface SkeletonProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export function Skeleton({ className, width, height, ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-border rounded-md ${className}`}
      style={{ width, height }}
      {...props}
    />
  );
}