"use client"

import React from "react"

import { useEffect, useState, useRef, useCallback } from "react"

function useGreeting() {
  const [greeting, setGreeting] = useState("Hello")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  return greeting
}

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const greeting = useGreeting()
  const nameRef = useRef<HTMLDivElement>(null)
  const [letterOffsets, setLetterOffsets] = useState<{ x: number; y: number }[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Magnetic letter effect on name
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!nameRef.current) return
    const letters = nameRef.current.querySelectorAll<HTMLElement>("[data-letter]")
    const newOffsets: { x: number; y: number }[] = []

    letters.forEach((letter) => {
      const rect = letter.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distX = e.clientX - centerX
      const distY = e.clientY - centerY
      const dist = Math.sqrt(distX * distX + distY * distY)
      const maxDist = 300
      const strength = Math.max(0, 1 - dist / maxDist)
      newOffsets.push({
        x: distX * strength * 0.06,
        y: distY * strength * 0.06,
      })
    })

    setLetterOffsets(newOffsets)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setLetterOffsets([])
  }, [])

  const firstName = "Chaiitanyaa"
  const lastName = "Chopraa"

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 md:px-12"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Centered greeting */}
      <div
        className={`absolute top-32 left-1/2 -translate-x-1/2 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <p className="font-sans text-xs uppercase tracking-[0.4em] text-muted-foreground text-center whitespace-nowrap">
          {greeting}
        </p>
      </div>

      {/* Giant centered name */}
      <div ref={nameRef} className="select-none text-center">
        <div className="overflow-hidden">
          <h1
            className={`font-serif text-[clamp(3.5rem,13vw,12rem)] leading-[0.85] tracking-[-0.02em] text-foreground transition-all duration-1000 delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
            }`}
          >
            {firstName.split("").map((char, i) => (
              <span
                key={`first-${i}`}
                data-letter
                className="inline-block transition-transform duration-300 ease-out hover:text-accent"
                style={{
                  transform:
                    letterOffsets[i]
                      ? `translate(${letterOffsets[i].x}px, ${letterOffsets[i].y}px)`
                      : "translate(0, 0)",
                }}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1
            className={`font-serif italic text-[clamp(3.5rem,13vw,12rem)] leading-[0.85] tracking-[-0.02em] text-foreground transition-all duration-1000 delay-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
            }`}
          >
            {lastName.split("").map((char, i) => {
              const idx = firstName.length + i
              return (
                <span
                  key={`last-${i}`}
                  data-letter
                  className="inline-block transition-transform duration-300 ease-out hover:text-accent"
                  style={{
                    transform:
                      letterOffsets[idx]
                        ? `translate(${letterOffsets[idx].x}px, ${letterOffsets[idx].y}px)`
                        : "translate(0, 0)",
                  }}
                >
                  {char}
                </span>
              )
            })}
          </h1>
        </div>
      </div>

      {/* Subtitle beneath name */}
      <div
        className={`mt-8 text-center transition-all duration-700 delay-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <p className="font-sans text-sm md:text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
          Software developer crafting clean, purposeful systems.
          <br />
          <span className="text-xs">University of Victoria &middot; BSc Computer Science</span>
        </p>
      </div>

      {/* Bottom bar */}
      <div
        className={`absolute bottom-8 left-6 md:left-12 right-6 md:right-12 flex items-end justify-between transition-all duration-700 delay-800 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Available for work
          </span>
        </div>

        <a
          href="#work"
          className="group flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>Scroll</span>
          <span className="inline-block w-4 h-px bg-muted-foreground group-hover:w-8 group-hover:bg-foreground transition-all" />
        </a>
      </div>
    </section>
  )
}
