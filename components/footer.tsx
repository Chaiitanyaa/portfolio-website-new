"use client"

import { SectionReveal } from "./section-reveal"
import { LiveClock } from "./live-clock"

/**
 * Colophon — a short note on how the site was made.
 *
 * Every portfolio wants to list its stack somewhere; a colophon is the honest
 * place for it, and it beats a bare copyright line at the foot of the page.
 */
export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-14 md:px-12 md:py-20">
      <SectionReveal>
        {/* Ink density strip — the colour bar pulled on every proof sheet */}
        <div className="mb-12 h-2.5 w-full" aria-hidden>
          <div className="ink-bar">
            {[
              "bg-accent",
              "bg-accent/70",
              "bg-accent/40",
              "bg-foreground/15",
              "bg-support/40",
              "bg-support/70",
              "bg-support",
            ].map((c) => (
              <i key={c} className={c} />
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <p className="display-wide select-none font-display text-5xl font-normal italic leading-none tracking-[-0.02em] text-foreground/25 md:text-7xl lg:text-8xl">
            Chopraa
          </p>
        </div>

        <dl className="mt-12 grid grid-cols-1 gap-x-10 gap-y-6 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              k: "Set in",
              v: "Archivo & Spline Sans Mono",
            },
            { k: "Built with", v: "Next.js, TypeScript, Tailwind & three.js" },
            { k: "Colours", v: "Deep teal & ochre" },
            { k: "Based in", v: "Victoria, British Columbia" },
          ].map(({ k, v }) => (
            <div key={k}>
              <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-support">
                {k}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 md:flex-row md:items-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            © {new Date().getFullYear()} Chaiitanyaa Chopraa — designed &amp; built by hand
          </span>
          <span className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Victoria, BC
            <LiveClock />
          </span>
        </div>
      </SectionReveal>
    </footer>
  )
}
