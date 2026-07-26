"use client"

import React, { useState, useEffect } from 'react'

interface SmoothScrollingProps {
  children: React.ReactNode
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ReactLenisComponent: any = null

export default function SmoothScrolling({ children }: SmoothScrollingProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        ReactLenisComponent = require('lenis/react').ReactLenis
        setMounted(true)
      } catch (err) {
        console.error('Lenis load error:', err)
      }
    }
  }, [])

  if (!mounted || !ReactLenisComponent) {
    return <>{children}</>
  }

  const LenisComp = ReactLenisComponent

  return (
    <LenisComp root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      {children}
    </LenisComp>
  )
}
