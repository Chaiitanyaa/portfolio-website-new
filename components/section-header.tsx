"use client"

import type { ReactNode } from "react"

/**
 * Section masthead: number, name, rule, and an optional note on the right.
 *
 * The number encodes reading order, which is real information — it tells you
 * where you are in the page and how much is left.
 */
export function SectionHeader({
  index,
  label,
  meta,
  title,
  accent,
  children,
}: {
  index: string
  label: string
  meta?: string
  /** Plain half of the headline. */
  title: string
  /** Italic half, set in the editorial face. */
  accent?: string
  children?: ReactNode
}) {
  return (
    <div className="mb-12 md:mb-16">
      <div className="mb-6 flex items-center gap-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
          {index}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          {label}
        </span>
        <span className="h-px flex-1 bg-border" />
        {meta && (
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground sm:block">
            {meta}
          </span>
        )}
      </div>

      <h2 className="display-wide flex flex-wrap items-baseline gap-x-[0.28em] font-display text-5xl font-medium leading-[0.95] tracking-[-0.02em] text-foreground md:text-7xl lg:text-8xl">
        <span>{title}</span>
        {accent && <span className="font-normal italic">{accent}</span>}
      </h2>

      {children}
    </div>
  )
}
