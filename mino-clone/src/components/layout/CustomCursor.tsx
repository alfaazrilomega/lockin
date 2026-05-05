'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return

    let targetX = 0, targetY = 0
    let currentX = 0, currentY = 0

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
    }

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n

    const animate = () => {
      currentX = lerp(currentX, targetX, 0.12)
      currentY = lerp(currentY, targetY, 0.12)
      if (dot) {
        dot.style.transform = `translate(${currentX - (dot.offsetWidth / 2)}px, ${currentY - (dot.offsetHeight / 2)}px)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    const onEnter = () => dot?.classList.add('hovered')
    const onLeave = () => dot?.classList.remove('hovered')
    const onDown  = () => dot?.classList.add('clicking')
    const onUp    = () => dot?.classList.remove('clicking')

    const interactiveEls = () =>
      document.querySelectorAll('a, button, [data-cursor-hover]')

    const attachHover = () => {
      interactiveEls().forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    attachHover()
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
}
