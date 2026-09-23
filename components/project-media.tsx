"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Pause, Play } from "lucide-react"
import type { Project } from "@/lib/projects"

/**
 * A project's visual: a still, or a short silent loop over its poster frame.
 *
 * The clip is only fetched once the card is near the viewport, plays while it
 * is on screen and pauses the moment it leaves, so a page of demos costs one
 * video's worth of decoding rather than six. The poster is a real still, so
 * something meaningful is on screen before a byte of video arrives.
 *
 * Motion that loops needs a way to stop it (WCAG 2.2.2), hence the control in
 * the corner; readers who ask for reduced motion, or are on a metered
 * connection, get the still and never load the clip at all.
 */
export function ProjectMedia({ project }: { project: Pick<Project, "title" | "category" | "image" | "video"> }) {
  const { title, category, image, video } = project
  const holder = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [wanted, setWanted] = useState(false) // may we download it yet?
  const [visible, setVisible] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [manualPause, setManualPause] = useState(false)

  // Decide once whether this visitor should get video at all.
  const [allowed, setAllowed] = useState(false)
  useEffect(() => {
    if (!video) return
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string }
    }
    const thrifty =
      nav.connection?.saveData === true ||
      /^(slow-)?2g$/.test(nav.connection?.effectiveType ?? "")
    setAllowed(!still && !thrifty)
  }, [video])

  // Two observers, both of which only record intent: one says the clip is
  // close enough to fetch, the other says the card is on screen.
  useEffect(() => {
    const el = holder.current
    if (!el || !allowed) return

    const near = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setWanted(true)
          near.unobserve(e.target)
        }
      },
      { rootMargin: "300px" },
    )
    const onScreen = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.35,
    })
    near.observe(el)
    onScreen.observe(el)
    return () => {
      near.disconnect()
      onScreen.disconnect()
    }
  }, [allowed])

  /* Playback follows that state rather than the observer callbacks. Calling
     play() straight from the observer raced the `src` assignment — the card
     was already on screen, so it fired once with no source, failed, and never
     retried because the card never left the viewport again.

     Browsers also pause muted background video to save power, so returning to
     the tab needs an explicit nudge or the loop stays dead. */
  useEffect(() => {
    const v = videoRef.current
    if (!v || !allowed || !wanted) return

    const sync = () => {
      if (visible && !manualPause && document.visibilityState === "visible") {
        v.play()
          .then(() => setPlaying(true))
          .catch(() => setPlaying(false))
      } else {
        v.pause()
        setPlaying(false)
      }
    }
    sync()
    document.addEventListener("visibilitychange", sync)
    return () => document.removeEventListener("visibilitychange", sync)
  }, [allowed, wanted, visible, manualPause])

  const toggle = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      setManualPause(false)
      v.play().then(() => setPlaying(true)).catch(() => {})
    } else {
      setManualPause(true)
      v.pause()
      setPlaying(false)
    }
  }, [])

  const initials = (title.match(/[A-Z][a-z]*/g) ?? [title])
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  if (!image && !video) {
    return (
      <div className="shot-blank relative flex aspect-[16/10] w-full flex-col items-center justify-center gap-3 border border-border">
        <span className="font-display text-6xl font-medium italic tracking-[-0.02em] text-accent/50 md:text-7xl">
          {initials}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/70">
          Screenshot coming
        </span>
      </div>
    )
  }

  return (
    <div ref={holder} className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
      {video && allowed ? (
        <video
          ref={videoRef}
          // Only set once the card is close, so six demos don't download at once.
          src={wanted ? video : undefined}
          poster={image}
          muted
          loop
          playsInline
          preload="none"
          onCanPlay={() => {
            if (visible && !manualPause && document.visibilityState === "visible") {
              videoRef.current?.play().then(() => setPlaying(true)).catch(() => {})
            }
          }}
          aria-label={`${title} — ${category} demo, silent loop`}
          className="h-full w-full object-cover"
        />
      ) : (
        image && (
          <img
            src={image}
            alt={`${title} — ${category}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        )
      )}

      {video && allowed && wanted && (
        <button
          type="button"
          onClick={toggle}
          className="absolute bottom-3 right-3 flex h-9 items-center gap-1.5 border border-background/30 bg-background/80 px-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground opacity-0 backdrop-blur-sm transition-opacity duration-200 focus-visible:opacity-100 group-hover:opacity-100"
        >
          {playing ? <Pause className="h-3 w-3" aria-hidden /> : <Play className="h-3 w-3" aria-hidden />}
          {playing ? "Pause" : "Play"}
          <span className="sr-only">the {title} demo loop</span>
        </button>
      )}
    </div>
  )
}
