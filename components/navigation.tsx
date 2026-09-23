"use client"

import { useState, useEffect, useCallback } from "react"
import { LiveClock } from "./live-clock"
import { ThemeToggle } from "./theme-toggle"
import { CommandPalette } from "./command-palette"
import { Command as CommandIcon } from "lucide-react"
import { trackEvent } from "@/lib/analytics"

const NAV_ITEMS = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
  { label: "Resume", href: "/resume" },
]

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  // Show the shortcut the visitor's keyboard actually has.
  const [modKey, setModKey] = useState("⌘")
  useEffect(() => {
    if (!/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) setModKey("Ctrl")
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(window.scrollY > 40)
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Lock the page while the menu is over it, and let Escape close it.
  useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener("keydown", onKey)
    }
  }, [menuOpen])

  const handleNavClick = useCallback((label: string) => {
    if (label === "Resume") trackEvent("resume_download", "nav_resume")
    setMenuOpen(false)
  }, [])

  return (
    <>
      <a href="#main" className="skip-link bg-foreground px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-background">
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled ? "border-b border-border bg-background/85 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        {/* Reading progress. */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-transparent" aria-hidden>
          <div
            className="h-full origin-left bg-gradient-to-r from-accent to-support transition-transform duration-150 ease-out"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>

        <nav className="flex items-center justify-between px-6 py-4 md:px-12" aria-label="Main">
          <a
            href="/#"
            className="group flex items-center gap-2.5 text-foreground transition-colors hover:text-accent"
            aria-label="Chaiitanyaa Chopraa — home"
          >
            <span className="font-display text-lg font-semibold italic tracking-[-0.01em]">CC</span>
          </a>

          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 md:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => handleNavClick(item.label)}
                className="group relative font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="group hidden min-h-[36px] items-center gap-2 border border-border px-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-accent hover:text-foreground md:inline-flex"
              aria-label="Open quick actions"
              aria-keyshortcuts="Meta+K Control+K"
            >
              <span className="text-foreground">{modKey}</span>K
            </button>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="flex h-11 w-11 items-center justify-center text-foreground md:hidden"
              aria-label="Open quick actions"
            >
              <CommandIcon className="h-[18px] w-[18px]" aria-hidden />
            </button>
            <ThemeToggle className="hidden sm:inline-flex" />
            <LiveClock className="hidden md:inline" />

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="-mr-2 flex h-11 w-11 items-center justify-center text-foreground md:hidden"
            >
              <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
              <span aria-hidden className="relative block h-3.5 w-6">
                <span
                  className={`absolute left-0 block h-[1.5px] w-full bg-current transition-transform duration-300 ${
                    menuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-[1.5px] w-full bg-current transition-transform duration-300 ${
                    menuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />

      {/* Full-sheet menu — the only navigation a phone gets, so it carries
          everything: sections, resume, socials and the theme switch. */}
      {/* Toggled with the display class, not the `hidden` attribute: a
          `display: flex` class outranks the UA's `[hidden] { display: none }`,
          so the attribute alone would leave this menu permanently open. */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 flex-col bg-background px-6 pb-10 pt-24 md:hidden ${
          menuOpen ? "flex" : "hidden"
        }`}
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {NAV_ITEMS.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => handleNavClick(item.label)}
              className="group flex items-baseline gap-4 border-b border-border py-5"
            >
              <span className="font-mono text-[10px] tracking-[0.2em] text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-4xl font-medium tracking-[-0.015em] text-foreground">
                {item.label}
              </span>
            </a>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-6 pt-10">
          <ThemeToggle />
          <a
            href="mailto:reachme@chaiitanyaa.com"
            className="font-mono text-xs tracking-[0.1em] text-muted-foreground"
          >
            reachme@chaiitanyaa.com
          </a>
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <span>Victoria, BC</span>
            <LiveClock />
          </div>
        </div>
      </div>
    </>
  )
}
