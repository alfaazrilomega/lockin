"use client"

import { useState, useEffect } from 'react'
import { ReactLenis } from 'lenis/react'

interface SmoothScrollingProps {
  children: React.ReactNode
}

/**
 * Self-contained SSR guard for ReactLenis.
 * Renders bare children on the server (no Lenis DOM → no hydration mismatch),
 * then swaps in <ReactLenis root> after the client mounts.
 */
export default function SmoothScrolling({ children }: SmoothScrollingProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      {children}
    </ReactLenis>
  )
}
