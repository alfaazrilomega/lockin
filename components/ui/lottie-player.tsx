'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

export interface LottiePlayerProps {
  src?: string;
  animationData?: Record<string, unknown>;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  style?: React.CSSProperties;
  width?: string | number;
  height?: string | number;
  speed?: number;
}

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
  width?: string | number;
  height?: string | number;
}

// ─── Loading Indicator Component ─────────────────────────────────────────────
// Renders a neat, responsive skeleton placeholder that prevents UI layout shift.
export function LottieLoadingSkeleton({
  className = '',
  style,
  width,
  height,
}: SkeletonProps) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-xl bg-muted/40 border border-border/40 overflow-hidden ${className}`}
      style={{
        width: width ?? '100%',
        height: height ?? '100%',
        minHeight: height ? undefined : '140px',
        ...style,
      }}
      aria-label="Loading animation"
    >
      <Skeleton className="w-full h-full absolute inset-0 bg-muted/60 animate-pulse" />
      <div className="relative z-10 flex flex-col items-center gap-2 p-4 text-muted-foreground/70">
        <div className="w-5 h-5 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
        <span className="text-[11px] font-outfit uppercase tracking-widest font-semibold">
          Loading Animation
        </span>
      </div>
    </div>
  );
}

// ─── Internal Player Core ───────────────────────────────────────────────────
function LottieInternalPlayer({
  src,
  animationData,
  loop = true,
  autoplay = true,
  className = '',
  style = {},
  width,
  height,
  speed = 1,
}: LottiePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animInstanceRef = useRef<import('lottie-web').AnimationItem | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function initLottie() {
      try {
        const lottie = (await import('lottie-web')).default;

        if (isCancelled || !containerRef.current) return;

        let data = animationData;

        if (!data && src) {
          const res = await fetch(src);
          if (!res.ok) {
            throw new Error(`Failed to load Lottie file (${res.status}): ${src}`);
          }
          data = await res.json();
        }

        if (isCancelled || !containerRef.current || !data) return;

        if (animInstanceRef.current) {
          animInstanceRef.current.destroy();
        }

        const anim = lottie.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop,
          autoplay,
          animationData: data,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid meet',
          },
        });

        if (speed !== 1) {
          anim.setSpeed(speed);
        }

        animInstanceRef.current = anim;
        setIsLoaded(true);
      } catch (err: unknown) {
        if (!isCancelled) {
          const msg = err instanceof Error ? err.message : 'Animation loading error';
          console.error('LottiePlayer error:', msg);
          setError(msg);
        }
      }
    }

    initLottie();

    return () => {
      isCancelled = true;
      if (animInstanceRef.current) {
        animInstanceRef.current.destroy();
        animInstanceRef.current = null;
      }
    };
  }, [src, animationData, loop, autoplay, speed]);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width: width ?? '100%',
        height: height ?? '100%',
        ...style,
      }}
    >
      {!isLoaded && !error && (
        <LottieLoadingSkeleton width={width} height={height} className={className} style={style} />
      )}
      {error && (
        <div className="flex items-center justify-center p-4 text-xs text-destructive bg-destructive/10 rounded-xl h-full">
          Failed to load animation
        </div>
      )}
      <div
        ref={containerRef}
        className={`w-full h-full transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'
        }`}
      />
    </div>
  );
}

// ─── Lazy Loaded Dynamic Component Export ───────────────────────────────────
export const LottiePlayer = dynamic<LottiePlayerProps>(
  () => Promise.resolve(LottieInternalPlayer),
  {
    ssr: false,
    loading: () => <LottieLoadingSkeleton />,
  }
);

export default LottiePlayer;
