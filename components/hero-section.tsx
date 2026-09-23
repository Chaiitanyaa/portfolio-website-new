"use client"

import React, { useEffect, useState } from "react"
import { ArrowDown } from "lucide-react"
import { HeroAvatar } from "./hero-avatar"

/** The three things a visitor most often wants to know up front. */
const FACTS = [
  { k: "Based in", v: "Victoria, BC", dot: "bg-accent" },
  { k: "Focus", v: "Full-stack & systems", dot: "bg-support" },
  { k: "Status", v: "Open to work", dot: "bg-foreground/30" },
]

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const enter = (delay: string) =>
    `transition-all duration-700 ${delay} ease-[cubic-bezier(0.16,1,0.3,1)] ${
      mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
    }`

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center gap-0 px-6 pb-16 pt-32 md:px-12 md:pb-14 md:pt-36">
      {/* Sheet header */}
      <div className={`flex items-center gap-3 ${enter("delay-100")}`}>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Software Developer — Victoria, BC
        </p>
      </div>

      {/* Name and memoji. On wide screens the memoji stands to the right with
          its disc resting on the rule; on phones it greets you above the name.
          The name stays first in the DOM so it is the first thing read. */}
      <div className="mt-5 flex flex-col gap-6 md:mt-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        {/* The name. Roman forename, italic surname — one Didone, two voices. */}
        <h1 className="order-2 select-none lg:order-1">
          <span className="block overflow-hidden pb-[0.04em]">
            <span
              className={`display-wide block font-display text-[clamp(3.1rem,12.5vw,11.5rem)] font-medium lg:text-[clamp(4.5rem,8.6vw,8.8rem)] leading-[0.9] tracking-[-0.025em] text-foreground transition-[opacity,transform] duration-1000 delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
              }`}
            >
              Chaiitanyaa
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span
              className={`display-wide block pl-[0.04em] font-display text-[clamp(3.1rem,12.5vw,11.5rem)] font-normal italic lg:text-[clamp(4.5rem,8.6vw,8.8rem)] leading-[0.95] tracking-[-0.02em] text-foreground transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
              }`}
              style={{ transitionDelay: "340ms" }}
            >
              Chopraa
            </span>
          </span>
        </h1>

        <div
          className={`order-1 w-[min(10rem,40vw)] shrink-0 origin-bottom transition-all duration-1000 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:order-2 lg:-mb-8 lg:w-[clamp(12rem,19vw,17rem)] ${
            mounted ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
        >
          <HeroAvatar />
        </div>
      </div>

      <div className={`mt-8 h-px w-full bg-border ${enter("delay-500")}`} />

      {/* Statement left, quick facts right */}
      <div className={`mt-8 flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between ${enter("delay-500")}`}>
        <div className="max-w-md">
          <p className="text-balance text-lg leading-snug text-foreground md:text-xl">
            I build full-stack systems — trading engines, AI platforms and
            procedural tooling — and care about how they hold up under load.
          </p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            University of Victoria · BSc Computer Science
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="inline-flex min-h-[48px] items-center gap-2.5 bg-foreground px-6 font-mono text-[11px] uppercase tracking-[0.2em] text-background transition-colors hover:bg-accent"
            >
              See the work
              <ArrowDown className="h-3.5 w-3.5" aria-hidden />
            </a>
            <a
              href="mailto:reachme@chaiitanyaa.com"
              className="inline-flex min-h-[48px] items-center border border-foreground/25 px-6 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              Email me
            </a>
          </div>
        </div>

        <dl className="hidden shrink-0 gap-x-6 gap-y-2.5 lg:grid lg:grid-cols-[auto_1fr]">
          {FACTS.map(({ k, v, dot }) => (
            <React.Fragment key={k}>
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {k}
              </dt>
              <dd className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
                <span aria-hidden className={`h-2 w-2 shrink-0 ${dot}`} />
                {v}
              </dd>
            </React.Fragment>
          ))}
        </dl>
      </div>

      {/* Sheet footer */}
      <div className={`mt-10 flex items-end justify-between md:mt-12 ${enter("delay-700")}`}>
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 bg-accent" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Available for work
          </span>
        </div>

        <a
          href="#work"
          className="group hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground sm:flex"
        >
          <span>Scroll</span>
          <span className="inline-block h-px w-5 bg-muted-foreground transition-all group-hover:w-9 group-hover:bg-foreground" />
        </a>
      </div>
    </section>
  )
}
