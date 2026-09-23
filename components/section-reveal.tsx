"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

interface SectionRevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

/**
 * Fades a block up as it enters the sheet.
 *
 * Fires slightly before the block reaches the fold, so tall cards on a phone
 * are already printed by the time they are scrolled to rather than fading in
 * under the reader's eyes. Content is always in the DOM — this only animates
 * opacity and transform, so crawlers and no-JS readers get the full page.
 */
export function SectionReveal({ children, className = "", delay = 0 }: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Nothing to choreograph if the reader asked for stillness.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true)
      return
    }

    let timer: ReturnType<typeof setTimeout>
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        timer = setTimeout(() => setVisible(true), delay)
        observer.unobserve(entry.target)
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    )

    observer.observe(el)
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [delay])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  )
}
