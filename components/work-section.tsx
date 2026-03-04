"use client"

import { SectionReveal } from "./section-reveal"
import { ProjectCard } from "./project-card"

const PROJECTS = [
  {
    index: "01",
    title: "Social Spark",
    category: "AI Platform",
    description:
      "An AI-driven platform improving brand-influencer collaboration through intelligent campaign matching, automated content evaluation, and engagement analytics powered by the Gemini API.",
    tech: ["React", "Node.js", "MongoDB", "Gemini API", "Docker"],
    href: "#",
  },
  {
    index: "02",
    title: "SwiftTrade",
    category: "Trading System",
    description:
      "A full-stack day trading system with a custom FIFO-based order matching engine, supporting wallet management, market and limit orders, with containerized deployment.",
    tech: ["Python", "REST APIs", "Docker", "MongoDB", "RabbitMQ", "Redis"],
    href: "#",
  },
  {
    index: "03",
    title: "Procedural Builder",
    category: "Game Development",
    description:
      "A procedural building generation system in Unity enabling automatic creation of modular, scalable building layouts with performance-optimized real-time generation.",
    tech: ["Unity", "C#", "Procedural Generation"],
    href: "https://chaiitanyaa.github.io/Unity-Procedural-City-Building-Generation-Framework/",
  },
  {
    index: "04",
    title: "SceneCraft",
    category: "Interactive Storytelling",
    description:
      "An interactive storytelling tool combining physical object manipulation with AI-generated narrative prompts, designed to support creativity for young users.",
    tech: ["Arduino", "AI", "Physical Interaction"],
    href: "https://chaiitanyaa.github.io/SceneCraft/public/index.html",
  },
  {
    index: "05",
    title: "RhythmBlocks",
    category: "Physical Computing",
    description:
      "A physical music composition system using Arduino and sensor-based inputs to detect musical blocks, integrated with a Teachable Machine model for real-time feedback.",
    tech: ["Arduino", "Teachable Machine", "Sensors"],
    href: "https://chaiitanyaa.github.io/RhythmBlocks/",
  },
]

export function WorkSection() {
  return (
    <section id="work" className="px-6 md:px-12 py-24 md:py-40">
      <SectionReveal>
        <div className="flex items-end justify-between mb-20 md:mb-28">
          <div>
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground block mb-4">
              001
            </span>
            <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight text-foreground">
              Selected <span className="italic">Work</span>
            </h2>
          </div>
          <span className="hidden md:block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {PROJECTS.length} Projects
          </span>
        </div>
      </SectionReveal>

      <div>
        {PROJECTS.map((project, i) => (
          <SectionReveal key={project.index} delay={i * 100}>
            <ProjectCard {...project} />
          </SectionReveal>
        ))}
        {/* Bottom border for last item */}
        <div className="border-t border-border" />
      </div>
    </section>
  )
}
