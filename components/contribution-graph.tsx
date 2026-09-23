"use client"

import { useMemo, useState } from "react"
import type { ContributionDay } from "@/lib/github"

/* Dot diameter per contribution level, as a share of the cell. Size carries
   the value — the way a halftone screen does — so the ink colour stays flat. */
const DOT = ["16%", "42%", "60%", "78%", "96%"] as const
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const MOBILE_WEEKS = 26

function describe(day: ContributionDay) {
  // Parse as a calendar date, not an instant, so the reader's timezone can't
  // shift it to the day before.
  const [y, m, d] = day.date.split("-").map(Number)
  const label = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
  const what =
    day.count === 0 ? "no contributions" : `${day.count} contribution${day.count === 1 ? "" : "s"}`
  return `${label} — ${what}`
}

function Grid({
  days,
  weeks,
  offset,
  onPick,
  className,
}: {
  days: ContributionDay[]
  weeks: number
  offset: number
  onPick: (d: ContributionDay) => void
  className: string
}) {
  // A month label sits over the first week that starts in that month. A
  // leading partial month too narrow for its label is dropped rather than
  // letting it collide with the next one.
  const months = useMemo(() => {
    const labels: { col: number; name: string }[] = []
    for (const d of days) {
      if (d.row !== 0 || d.col < offset) continue
      const name = MONTHS[Number(d.date.slice(5, 7)) - 1]
      if (labels[labels.length - 1]?.name !== name) labels.push({ col: d.col - offset, name })
    }
    if (labels.length > 1 && labels[1].col - labels[0].col < 3) labels.shift()
    return labels
  }, [days, offset])

  const cols = `repeat(${weeks}, minmax(0, 1fr))`

  return (
    <div className={className}>
      <div className="mb-2 grid font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground" style={{ gridTemplateColumns: cols }}>
        {months.map(({ col, name }) => (
          <span key={`${col}-${name}`} style={{ gridColumn: `${col + 1} / span 3` }}>
            {name}
          </span>
        ))}
      </div>
      <div className="grid gap-px" style={{ gridTemplateColumns: cols, gridTemplateRows: "repeat(7, auto)" }}>
        {days.map((d) => {
          const col = d.col - offset
          if (col < 0) return null
          return (
            <span
              key={d.date}
              onPointerEnter={() => onPick(d)}
              onClick={() => onPick(d)}
              className="flex aspect-square items-center justify-center"
              style={{ gridColumn: col + 1, gridRow: d.row + 1 }}
            >
              <span
                className={`block rounded-full transition-transform duration-200 hover:scale-125 ${
                  d.level === 0 ? "bg-foreground/15" : "bg-accent"
                }`}
                style={{ width: DOT[d.level], height: DOT[d.level] }}
              />
            </span>
          )
        })}
      </div>
    </div>
  )
}

/**
 * A year of commits, set as a halftone screen: one dot per day, dot size by
 * activity. Hovering (or tapping) a dot reads that day out in the ledger line
 * beneath — one quiet readout instead of hundreds of tooltips. Phones get the
 * most recent six months at a size a thumb can actually hit.
 */
export function ContributionGraph({
  days,
  weeks,
  total,
  activeDays,
}: {
  days: ContributionDay[]
  weeks: number
  total: number
  activeDays: number
}) {
  const [picked, setPicked] = useState<ContributionDay | null>(null)
  const mobileOffset = Math.max(0, weeks - MOBILE_WEEKS)
  const summary = `${total} contribution${total === 1 ? "" : "s"} in the last year across ${activeDays} active days`

  return (
    <figure>
      <div role="img" aria-label={`GitHub contribution graph: ${summary}.`}>
        <div aria-hidden>
          <Grid days={days} weeks={weeks} offset={0} onPick={setPicked} className="hidden md:block" />
          <Grid
            days={days}
            weeks={Math.min(weeks, MOBILE_WEEKS)}
            offset={mobileOffset}
            onPick={setPicked}
            className="md:hidden"
          />
        </div>
      </div>

      <figcaption className="mt-5 flex flex-col gap-3 border-t border-border pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span aria-live="polite" className="min-h-[1em] text-foreground">
          {picked ? describe(picked) : summary}
        </span>
        <span className="flex items-center gap-2" aria-hidden>
          Less
          {DOT.map((size, level) => (
            <span key={level} className="flex h-3 w-3 items-center justify-center">
              <span
                className={`block rounded-full ${level === 0 ? "bg-foreground/15" : "bg-accent"}`}
                style={{ width: size, height: size }}
              />
            </span>
          ))}
          More
        </span>
      </figcaption>
    </figure>
  )
}
