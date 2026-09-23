"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const PressCanvas = dynamic(() => import("./three/press-canvas"), { ssr: false })

/**
 * The 3D space the page sits in.
 *
 * Fixed behind everything and never interactive: the content above it stays
 * ordinary HTML, so the site reads, ranks and works with WebGL switched off.
 * A scrim in the stock colour sits between the scene and the page, because a
 * portfolio has to stay readable first — the depth is atmosphere, not content.
 */
export function SceneLayer() {
  const [mode, setMode] = useState<"off" | "full" | "light">("off")

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (still) return

    let webgl = false
    try {
      const c = document.createElement("canvas")
      webgl = !!(c.getContext("webgl2") || c.getContext("webgl"))
    } catch {
      webgl = false
    }
    if (!webgl) return

    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string }
      deviceMemory?: number
    }
    if (nav.connection?.saveData === true || (nav.deviceMemory ?? 8) < 4) return

    const small = window.matchMedia("(max-width: 767px)").matches
    setMode(small ? "light" : "full")
  }, [])

  if (mode === "off") return null

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <PressCanvas dots={mode === "light" ? 260 : 650} sheets={mode === "light" ? 4 : 8} />
      <div className="absolute inset-0 bg-background/40" />
    </div>
  )
}
