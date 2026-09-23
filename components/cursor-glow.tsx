"use client"

import { useEffect, useRef, useState } from "react"

/**
 * A soft two-ink wash following the cursor — the drum's light bleeding
 * through the sheet. Skipped entirely on touch and under reduced motion.
 */
export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    setEnabled(fine && !still)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const glow = glowRef.current
    if (!glow) return

    let mouseX = 0, mouseY = 0, x = 0, y = 0, frame = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    const animate = () => {
      x += (mouseX - x) * 0.08
      y += (mouseY - y) * 0.08
      glow.style.transform = `translate3d(${x - 220}px, ${y - 220}px, 0)`
      frame = requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    frame = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(frame)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={glowRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[55] h-[440px] w-[440px] rounded-full"
      style={{
        background:
          "radial-gradient(circle, hsl(var(--accent) / 0.10) 0%, hsl(var(--support) / 0.06) 45%, transparent 70%)",
        mixBlendMode: "var(--riso-blend)" as React.CSSProperties["mixBlendMode"],
        willChange: "transform",
      }}
    />
  )
}
