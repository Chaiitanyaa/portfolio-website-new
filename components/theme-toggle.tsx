"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

/**
 * Light / dark theme switch.
 *
 * Renders a fixed-width placeholder before mount so the bar never reflows when
 * the resolved theme arrives.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={
        mounted
          ? `Switch to ${isDark ? "light" : "dark"} theme`
          : "Switch colour theme"
      }
      className={`group inline-flex min-h-[44px] items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground ${className}`}
    >
      <span
        aria-hidden
        className={`h-2.5 w-2.5 shrink-0 border transition-colors duration-300 ${
          mounted && isDark
            ? "border-accent bg-accent"
            : "border-support bg-transparent"
        }`}
      />
      <span className="w-[3.2rem] whitespace-nowrap text-left">
        {mounted ? (isDark ? "Dark" : "Light") : ""}
      </span>
    </button>
  )
}
