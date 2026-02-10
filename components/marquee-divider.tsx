"use client"

import { useEffect, useRef } from "react"

const WORDS = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "MongoDB",
  "Docker",
  "REST APIs",
  "Unity",
  "C++",
  "PostgreSQL",
  "Tailwind CSS",
  "Git",
]

export function MarqueeDivider() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let animationId: number
    let position = 0

    const animate = () => {
      position -= 0.5
      if (position <= -(el.scrollWidth / 2)) {
        position = 0
      }
      el.style.transform = `translateX(${position}px)`
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [])

  const items = [...WORDS, ...WORDS, ...WORDS, ...WORDS]

  return (
    <div className="py-12 md:py-16 overflow-hidden border-y border-border">
      <div ref={scrollRef} className="flex items-center gap-8 whitespace-nowrap will-change-transform">
        {items.map((word, i) => (
          <span key={`${word}-${i}`} className="flex items-center gap-8">
            <span className="font-serif text-xl md:text-2xl italic text-muted-foreground/40">
              {word}
            </span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/20 shrink-0" />
          </span>
        ))}
      </div>
    </div>
  )
}
