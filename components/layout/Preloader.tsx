'use client';

import React, { useEffect, useRef, useState } from 'react';
import animationData from '../animation-lockin/json/Scene-1.json';
import type { AnimationItem } from 'lottie-web';

// ─── Types & Constants ──────────────────────────────────────────────────────

type LoaderPhase = 'preloading' | 'exiting' | 'done';

interface PreloaderProps {
  children: React.ReactNode;
}

// Exactly match the overall timing from before:
// Original was PHASE1_HOLD(1600) + SWAP(600) + PHASE2_HOLD(1200) + EXIT_DELAY(200) = 3600
const MIN_PRELOAD_DURATION = 3600; 
const STABILIZATION_DELAY = 500; // Extra 0.5s delay as requested
const EXIT_DURATION = 950;

const CINEMATIC_EASE = 'cubic-bezier(0.25, 0.1, 0.25, 1)';

// ─── Component ─────────────────────────────────────────────────────────────

export default function Preloader({ children }: PreloaderProps) {
  // 1. Initial State: Start as preloading
  const [phase, setPhase] = useState<LoaderPhase>('preloading');
  
  const lottieContainerRef = useRef<HTMLDivElement>(null);
  const lottieInstRef = useRef<AnimationItem | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // ─── Styles (Ensuring absolute coverage and stacking) ──────────────────────
  
  const styles = {
    overlay: {
      position: 'fixed' as const,
      inset: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#344ead', // Matches the blue background in Scene-1.json
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: phase === 'exiting' || phase === 'done' ? 0 : 1,
      pointerEvents: (phase === 'exiting' || phase === 'done' ? 'none' : 'auto') as React.CSSProperties['pointerEvents'],
      transition: `opacity ${EXIT_DURATION}ms ${CINEMATIC_EASE}`,
      WebkitFontSmoothing: 'antialiased',
      overflow: 'hidden',
    },
    lottieWrapper: {
      position: 'absolute' as const,
      inset: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }
  };

  // ─── Lifecycle & Animation ──────────────────────────────────────────────────

  useEffect(() => {
    // Lock scroll while preloading
    document.body.style.overflow = 'hidden';
    let isCancelled = false;

    // Dynamically initialize Lottie web to reduce initial bundle blocking
    import('lottie-web').then((lottieModule) => {
      if (isCancelled || !lottieContainerRef.current) return;
      const lottie = lottieModule.default;
      lottieInstRef.current = lottie.loadAnimation({
        container: lottieContainerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        },
      });
    });

    const addTimer = (fn: () => void, delay: number) => {
      const id = setTimeout(fn, delay);
      timersRef.current.push(id);
    };

    // 1. Initial preload phase
    // 2. Freeze animation after MIN_PRELOAD_DURATION
    addTimer(() => {
        if (lottieInstRef.current) {
            lottieInstRef.current.pause(); // Freeze at the last frame
        }
    }, MIN_PRELOAD_DURATION);

    // 3. Start exit transition after stabilization delay
    addTimer(() => setPhase('exiting'), MIN_PRELOAD_DURATION + STABILIZATION_DELAY);
    
    // 4. Cleanup
    addTimer(() => {
      setPhase('done');
      document.body.style.overflow = '';
    }, MIN_PRELOAD_DURATION + STABILIZATION_DELAY + EXIT_DURATION);

    return () => {
      isCancelled = true;
      if (lottieInstRef.current) {
          lottieInstRef.current.destroy();
      }
      const timers = timersRef.current;
      timers.forEach(clearTimeout);
      document.body.style.overflow = '';
    }
  }, []);

  return (
    <>
      {/* Background content renders immediately but is hidden behind the overlay */}
      {children}

      {/* The Preloader Overlay */}
      {phase !== 'done' && (
        <div style={styles.overlay} aria-hidden="true">
            <div style={styles.lottieWrapper} ref={lottieContainerRef}></div>
        </div>
      )}
    </>
  );
}
