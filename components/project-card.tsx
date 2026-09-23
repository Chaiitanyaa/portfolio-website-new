"use client"

import { useState, type ComponentType, type SVGProps } from "react"
import { ArrowUpRight, Github, Globe, MonitorPlay } from "lucide-react"
import type { Project, ProjectLinks } from "@/lib/projects"
import { ProjectMedia } from "./project-media"

type LinkKind = keyof ProjectLinks

/** One entry per link type, in the order they appear on the card. */
const LINK_KINDS: {
  kind: LinkKind
  label: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  /** How a screen reader should finish "Social Spark …". */
  spoken: string
}[] = [
  { kind: "github", label: "GitHub", Icon: Github, spoken: "source code on GitHub" },
  { kind: "live", label: "Live site", Icon: Globe, spoken: "live site" },
  { kind: "demo", label: "Demo", Icon: MonitorPlay, spoken: "demo" },
]

/**
 * One project.
 *
 * The screenshot runs through a two-ink duotone (see .duotone in globals) and
 * sits on two offset outlines that shift apart on hover. Cards alternate sides
 * so the run reads as a spread rather than a list.
 * Everything a visitor needs is on the page at rest: nothing important hides
 * behind a hover, because half of them are on a phone.
 */
export function ProjectCard({
  project,
  flip = false,
}: {
  project: Project
  flip?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const { index, title, category, summary, description, tech, links, linkNote, credit } = project

  const available = LINK_KINDS.filter(({ kind }) => links[kind])

  const visual = (
    <div className="relative">
      {/* Two offset outlines, for depth */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 border border-accent/50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: hovered ? "translate(-8px, -8px)" : "translate(-4px, -4px)" }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 border border-support/50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: hovered ? "translate(8px, 8px)" : "translate(4px, 4px)" }}
      />

      <ProjectMedia project={project} />
    </div>
  )

  const copy = (
    <div className="flex flex-col justify-center">
      <div className="mb-5 flex items-baseline gap-4">
        <span className="font-mono text-[11px] tracking-[0.2em] text-accent">{index}</span>
        <span className="h-px flex-1 bg-border" />
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {category}
        </span>
      </div>

      <h3 className="display-wide font-display text-4xl font-medium leading-[0.98] tracking-[-0.02em] text-foreground md:text-5xl lg:text-6xl">
        {title}
      </h3>

      {credit && (
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {credit}
        </p>
      )}

      <p className="mt-4 max-w-md font-serif text-lg italic leading-snug text-foreground/75 md:text-xl">
        {summary}
      </p>

      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      <ul className="mt-6 flex flex-wrap gap-1.5" aria-label={`${title} tech stack`}>
        {tech.map((t) => (
          <li
            key={t}
            className="border border-border px-2.5 py-1 font-mono text-[10px] uppercase leading-none tracking-[0.12em] text-muted-foreground"
          >
            {t}
          </li>
        ))}
      </ul>

      {available.length > 0 && (
        <div className="mt-8">
          <ul className="flex flex-wrap gap-2" aria-label={`${title} links`}>
            {available.map(({ kind, label, Icon, spoken }) => (
              <li key={kind}>
                <a
                  href={links[kind]}
                  target="_blank"
                  rel="noopener noreferrer"
                  onFocus={() => setHovered(true)}
                  onBlur={() => setHovered(false)}
                  className="group/link inline-flex min-h-[44px] items-center gap-2.5 border border-foreground/20 px-4 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  <span>{label}</span>
                  <ArrowUpRight
                    className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-all duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:text-accent"
                    aria-hidden
                  />
                  <span className="sr-only">
                    — {title} {spoken} (opens in a new tab)
                  </span>
                </a>
              </li>
            ))}
          </ul>

          {linkNote && (
            <p className="mt-3 max-w-md text-xs leading-relaxed text-muted-foreground">
              {linkNote}
            </p>
          )}
        </div>
      )}
    </div>
  )

  return (
    <article
      className="group grid grid-cols-1 items-center gap-10 md:gap-14 lg:grid-cols-2 lg:gap-20"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Alternate sides on wide screens; always image-first when stacked. */}
      <div className={flip ? "lg:order-2" : ""}>{visual}</div>
      <div className={flip ? "lg:order-1" : ""}>{copy}</div>
    </article>
  )
}
