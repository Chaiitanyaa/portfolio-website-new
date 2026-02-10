"use client"

import { SectionReveal } from "./section-reveal"
import { LiveClock } from "./live-clock"

export function Footer() {
  return (
    <footer className="px-6 md:px-12 py-16 md:py-24 border-t border-border">
      <SectionReveal>
        <div className="flex flex-col gap-12">
          {/* Large signature */}
          <div className="overflow-hidden">
            <p className="font-serif italic text-6xl md:text-8xl lg:text-9xl text-foreground/[0.06] leading-none select-none">
              cc.
            </p>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-8">
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                &copy; 2025
              </span>
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                Designed & built by Chaiitanyaa
              </span>
            </div>

            <div className="flex items-center gap-6">
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                Victoria, BC
              </span>
              <LiveClock />
            </div>
          </div>
        </div>
      </SectionReveal>
    </footer>
  )
}
