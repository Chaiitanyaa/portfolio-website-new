"use client"

import { SectionReveal } from "./section-reveal"
import { SectionHeader } from "./section-header"
import { ProjectCard } from "./project-card"
import { PROJECTS } from "@/lib/projects"

export function WorkSection() {
  return (
    <section id="work" className="px-6 py-20 md:px-12 md:py-28">
      <SectionReveal>
        <SectionHeader
          index="01"
          label="Work"
          meta={`${PROJECTS.length} projects · 2023—2025`}
          title="Selected"
          accent="Work"
        />
      </SectionReveal>

      <div className="flex flex-col gap-20 md:gap-28">
        {PROJECTS.map((project, i) => (
          <SectionReveal key={project.slug} delay={i === 0 ? 0 : 60}>
            <ProjectCard project={project} flip={i % 2 === 1} />
          </SectionReveal>
        ))}
      </div>
    </section>
  )
}
