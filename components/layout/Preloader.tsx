'use client';

import React, { useEffect, useRef, useState } from 'react';

// ─── Types & Constants ──────────────────────────────────────────────────────

type LoaderPhase = 'phase1' | 'swapping' | 'phase2' | 'exiting' | 'done';

interface PreloaderProps {
  children: React.ReactNode;
}

// Exactly match the timing and values from the pixel-perfect HTML version
const PHASE1_START_DELAY = 80;
const PHASE1_HOLD = 1600;
const SWAP_HALF = 300; // Half of 600ms swap
const PHASE2_HOLD = 1200;
const PROGRESS_TOTAL = PHASE1_HOLD + SWAP_HALF * 2 + PHASE2_HOLD;
const EXIT_DELAY = 200;
const EXIT_DURATION = 950;

const CINEMATIC_EASE = 'cubic-bezier(0.25, 0.1, 0.25, 1)';

// ─── Component ─────────────────────────────────────────────────────────────

export default function Preloader({ children }: PreloaderProps) {
  // 1. Initial State: Start as preloading
  const [phase, setPhase] = useState<LoaderPhase>('phase1');
  const [progressWidth, setProgressWidth] = useState(0);
  
  const rafRef = useRef<number | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // ─── Styles (Ensuring absolute coverage and stacking) ──────────────────────
  
  const styles = {
    overlay: {
      position: 'fixed' as const,
      inset: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000000',
      zIndex: 99999, // Maximum priority
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
    centerStage: {
      position: 'relative' as const,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    centerText: (visible: boolean, hidden: boolean): React.CSSProperties => ({
      fontFamily: '"Inter Display", sans-serif',
      fontSize: '21.85px',
      fontWeight: 500,
      letterSpacing: '-0.03em',
      lineHeight: 1,
      color: '#ffffff',
      whiteSpace: 'nowrap',
      position: 'absolute',
      opacity: visible && !hidden ? 1 : 0,
      transform: hidden
        ? 'translateY(-10px)'
        : visible
        ? 'translateY(0)'
        : 'translateY(12px)',
      willChange: 'transform, opacity',
      transition: `opacity 0.6s ${CINEMATIC_EASE}, transform 0.6s ${CINEMATIC_EASE}`,
    }),
    centerLogo: (visible: boolean): React.CSSProperties => ({
      width: '44px',
      height: '48px',
      opacity: visible ? 1 : 0,
      transform: visible ? 'scale(1)' : 'scale(0.8)',
      willChange: 'transform, opacity',
      transition: `opacity 0.6s ${CINEMATIC_EASE}, transform 0.6s ${CINEMATIC_EASE}`,
    }),
    bottomWrap: {
      position: 'absolute' as const,
      bottom: '15%',
      left: 0,
      width: '100%',
      textAlign: 'center' as const,
    },
    bottomLabel: (visible: boolean, hidden: boolean): React.CSSProperties => ({
      fontFamily: '"Switzer", sans-serif',
      fontSize: '16px',
      fontWeight: 500,
      letterSpacing: '-0.03em',
      lineHeight: '20px',
      color: '#ffffff',
      whiteSpace: 'nowrap',
      position: 'absolute',
      left: '50%',
      opacity: visible && !hidden ? 1 : 0,
      transform: hidden
        ? 'translateX(-50%) translateY(-10px)'
        : visible
        ? 'translateX(-50%) translateY(0)'
        : 'translateX(-50%) translateY(12px)',
      willChange: 'transform, opacity',
      transition: `opacity 0.5s ${CINEMATIC_EASE}, transform 0.5s ${CINEMATIC_EASE}`,
    }),
    progressTrack: {
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      width: '100%',
      height: '2px',
      background: 'transparent',
    },
    progressFill: {
      height: '100%',
      width: `${progressWidth}%`,
      background: '#ffffff',
      willChange: 'width',
    },
  };

  // ─── Lifecycle & Animation ──────────────────────────────────────────────────

  useEffect(() => {
    // Lock scroll while preloading
    document.body.style.overflow = 'hidden';

    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const raw = Math.min(elapsed / PROGRESS_TOTAL, 1);
      const eased = 1 - Math.pow(1 - raw, 3); // easeOutCubic
      setProgressWidth(eased * 100);
      if (elapsed < PROGRESS_TOTAL) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    const addTimer = (fn: () => void, delay: number) => {
      const id = setTimeout(fn, delay);
      timersRef.current.push(id);
    };

    // Orchestrate phases
    addTimer(() => setPhase('phase1'), PHASE1_START_DELAY);
    addTimer(() => setPhase('swapping'), PHASE1_START_DELAY + PHASE1_HOLD);
    addTimer(() => setPhase('phase2'), PHASE1_START_DELAY + PHASE1_HOLD + SWAP_HALF);
    addTimer(() => setPhase('exiting'), PHASE1_START_DELAY + PROGRESS_TOTAL + EXIT_DELAY);
    
    // Complete cleanup
    addTimer(() => {
      setPhase('done');
      document.body.style.overflow = '';
      if (typeof window !== 'undefined') {
          (window as any).__preloaderDone = true;
      }
    }, PHASE1_START_DELAY + PROGRESS_TOTAL + EXIT_DELAY + EXIT_DURATION);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      // Capture the ref value at cleanup time to avoid stale ref warning
      const timers = timersRef.current
      timers.forEach(clearTimeout)
      document.body.style.overflow = ''
    }
  }, []);

  // ─── Visibility Helpers ─────────────────────────────────────────────────────
  
  const textVisible = phase === 'phase1';
  const textHidden = phase === 'swapping' || phase === 'phase2' || phase === 'exiting' || phase === 'done';
  const logoVisible = phase === 'phase2' || phase === 'exiting';
  const bottom1Visible = phase === 'phase1';
  const bottom2Visible = logoVisible;

  return (
    <>
      {/* Background content renders immediately but is hidden behind the overlay */}
      {children}

      {/* The Preloader Overlay */}
      {phase !== 'done' && (
        <div style={styles.overlay} aria-hidden="true">
          <div style={styles.centerStage}>
            {/* Phase 1: Text */}
            <div style={styles.centerText(textVisible, textHidden)}>
              LockIn
            </div>

            {/* Phase 2: Logo */}
            <svg
              style={styles.centerLogo(logoVisible)}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 26"
            >
              <path
                d="M 18.229 15.111 L 23.201 7.527 C 24.749 5.172 23.974 1.991 21.518 0.621 C 17.877 -1.409 13.559 1.844 14.479 5.926 L 16.413 14.508 C 16.418 14.54 16.423 14.573 16.428 14.607 C 16.511 14.939 16.961 16.482 16.588 17.583 C 15.746 20.071 12.335 20.429 10.098 19.18 C 9.555 18.81 8.572 17.97 8.049 16.479 C 7.981 16.285 7.913 16.124 7.846 15.992 L 7.846 15.992 L 5.641 10.356 C 4.746 8.067 1.615 7.832 0.392 9.962 C -0.405 11.349 0.052 13.123 1.419 13.947 L 7.445 17.583 L 7.445 17.583 C 7.924 17.904 8.793 18.587 9.243 19.563 L 10.82 23.595 C 12.514 27.925 18.985 25.924 17.962 21.385 L 17.464 18.841 C 17.373 18.305 17.416 17.69 17.485 17.2 C 17.571 16.592 17.79 16.016 18.055 15.463 C 18.142 15.281 18.213 15.134 18.229 15.111 Z"
                fill="#ffffff"
              />
              <path
                d="M 5.813 23.069 C 5.813 24.688 4.511 26 2.906 26 C 1.301 26 0 24.688 0 23.069 C 0 21.45 1.301 20.137 2.906 20.137 C 4.511 20.137 5.813 21.45 5.813 23.069 Z"
                fill="#ffffff"
              />
            </svg>
          </div>

          <div style={styles.bottomWrap}>
            <div style={styles.bottomLabel(bottom1Visible, textHidden)}>
              Where Hectic Life
            </div>
            <div style={styles.bottomLabel(bottom2Visible, false)}>
              Meet{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 700 }}>Global</em>
              <br />
              Time Management
            </div>
          </div>

          <div style={styles.progressTrack}>
            <div style={styles.progressFill} />
          </div>
        </div>
      )}

      {/* Global font injection */}
      <style jsx global>{`
        @font-face {
          font-family: "Inter Display";
          src: url("https://framerusercontent.com/assets/iwWTDc49ENF2tCHbqlNARXw6Ug.woff2");
          font-display: swap; font-style: normal; font-weight: 500;
        }
        @font-face {
          font-family: "Switzer";
          src: url("https://framerusercontent.com/third-party-assets/fontshare/wf/OYB4CXKJQXKTNSLJMTDQOIVUL2V5EL7S/WYO2P7DQVV5RNXGMCUO2HL4RJP4VFUAS/6XPIMU23OJVRY676OG5YVJMWEHWICATX.woff2");
          font-display: swap; font-style: normal; font-weight: 500;
        }
        @font-face {
          font-family: "Switzer";
          src: url("https://framerusercontent.com/third-party-assets/fontshare/wf/HBNTRIISA5MEXGL5WPYI7CV2HIWTDV3Q/YDPDINVT673XLXNSTMLG4JNCZZMVVNPN/Y7SCNZJOT2MW5ADSGOFLDGH4TNL4JCQY.woff2");
          font-display: swap; font-style: normal; font-weight: 700;
        }
        @font-face {
          font-family: "Switzer";
          src: url("https://framerusercontent.com/third-party-assets/fontshare/wf/LVPXCMXCWY3V7PSXRMGRQUJDAS2DT47E/BPEVRT2HG7PPVVUS7A67MZQQZW6LR6A5/A7AS3UPAGLC7MDVC67SBNTE5FGF2Z2RG.woff2");
          font-display: swap; font-style: italic; font-weight: 700;
        }
      `}</style>
    </>
  );
}
