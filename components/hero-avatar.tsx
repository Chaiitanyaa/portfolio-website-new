"use client"

import { useCallback, useEffect, useState } from "react"
import dynamic from "next/dynamic"

/* The disc the figure stands on, as fractions of the square stage. */
const DISC = { cx: 0.5, cy: 0.6, r: 0.4 }

function greetingFor(hour: number) {
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

/** Shown until WebGL is ready, and instead of it under reduced motion. */
function StaticMemoji() {
  return (
    <img
      src="/memoji/memoji.png"
      alt="Chaiitanyaa's memoji"
      width={420}
      height={420}
      draggable={false}
      className="absolute inset-0 h-full w-full select-none object-contain"
    />
  )
}

const AvatarCanvas = dynamic(() => import("./three/avatar-canvas"), {
  ssr: false,
  loading: () => <StaticMemoji />,
})

/**
 * The hero avatar.
 *
 * A real-time 3D figure whose arm is a joint chain, so the wave turns and
 * foreshortens properly — the flat cut-out it replaces could only spin a
 * picture of a hand around a pivot, which is why it looked wrong.
 *
 * WebGL is loaded only in the browser and only when it's wanted: readers who
 * ask for reduced motion, and anything without WebGL, get the original memoji
 * still instead. Clicking waves again and advances the speech bubble.
 */
export function HeroAvatar({ className = "" }: { className?: string }) {
  const [greeting, setGreeting] = useState("Hello")
  const [line, setLine] = useState(0)
  const [waveNonce, setWaveNonce] = useState(0)
  const [touched, setTouched] = useState(false)
  const [mode, setMode] = useState<"still" | "3d">("still")

  useEffect(() => {
    setGreeting(greetingFor(new Date().getHours()))

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // A cheap probe: if the context can't be created, stay on the still.
    let webgl = false
    try {
      const canvas = document.createElement("canvas")
      webgl = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"))
    } catch {
      webgl = false
    }

    // The model is ~2.4MB. Don't spend that on a metered connection or a
    // device that will struggle to render it.
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string }
      deviceMemory?: number
    }
    const thrifty =
      nav.connection?.saveData === true ||
      /^(slow-)?2g$/.test(nav.connection?.effectiveType ?? "") ||
      (nav.deviceMemory ?? 8) < 4

    if (!still && webgl && !thrifty) setMode("3d")
  }, [])

  const lines = [
    `${greeting}! Thanks for stopping by.`,
    "I build full-stack systems — the work is just below.",
    "Off the clock it’s cars, sneakers and games.",
    "Want to build something? reachme@chaiitanyaa.com",
  ]

  const wave = useCallback(() => {
    setWaveNonce((n) => n + 1)
    setLine((l) => (l + 1) % lines.length)
    setTouched(true)
  }, [lines.length])

  const discStyle = {
    left: `${(DISC.cx - DISC.r) * 100}%`,
    top: `${(DISC.cy - DISC.r) * 100}%`,
    width: `${DISC.r * 2 * 100}%`,
    height: `${DISC.r * 2 * 100}%`,
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className="pointer-events-none absolute z-10 max-lg:left-[104%] max-lg:top-[20%] max-lg:w-[min(11rem,calc(100vw_-_2.5rem_-_min(10rem,40vw)_*_1.04))] lg:right-[97%] lg:top-[16%] lg:w-[14rem]"
        aria-live="polite"
      >
        <p
          key={`${line}-${greeting}`}
          className="animate-bubble-in relative border border-foreground/80 bg-background px-3.5 py-3 text-[13px] leading-snug text-foreground shadow-[4px_4px_0_hsl(var(--accent))] [overflow-wrap:anywhere] lg:px-4 lg:text-sm"
        >
          {lines[line]}
          {!touched && (
            <span className="mt-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              Click me to wave
            </span>
          )}
          <span
            aria-hidden
            className="absolute h-3 w-3 rotate-45 border-foreground/80 bg-background max-lg:-left-[7px] max-lg:top-4 max-lg:border-b max-lg:border-l lg:-right-[7px] lg:bottom-auto lg:left-auto lg:top-7 lg:border-r lg:border-t lg:border-b-0 lg:border-l-0"
          />
        </p>
      </div>

      <button
        type="button"
        onClick={wave}
        className="group relative block w-full cursor-pointer outline-offset-8"
        aria-label="Chaiitanyaa’s avatar — click to wave hello"
      >
        <div className="relative aspect-square w-full">
          <span aria-hidden className="memoji-disc absolute rounded-full" style={discStyle} />
          {mode === "3d" ? (
            /* The model is a full body but the stage only shows the top of it,
               so the bottom is faded out rather than left on a hard cut. */
            <div className="avatar-stage absolute inset-0">
              <AvatarCanvas waveNonce={waveNonce} />
            </div>
          ) : (
            <StaticMemoji />
          )}
        </div>
      </button>
    </div>
  )
}
