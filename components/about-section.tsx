"use client"

import { SectionReveal } from "./section-reveal"
import { SectionHeader } from "./section-header"

/**
 * Stack, grouped the way it is actually used.
 *
 * Deliberately not self-rated percentages: "JavaScript 95%" is unverifiable,
 * and to the engineers reading this it costs more credibility than it buys.
 * Grouping by role tells a reader what gets reached for and when, which is
 * the thing they were trying to find out.
 */
const STACK = [
  { group: "Languages", items: ["TypeScript", "JavaScript", "Python", "Java", "C++", "C#"] },
  { group: "Frontend", items: ["React", "Next.js", "Vite", "Tailwind CSS"] },
  { group: "Backend", items: ["Node.js", "Express", "REST APIs", "JWT Auth"] },
  { group: "Data", items: ["PostgreSQL", "MongoDB", "Redis", "RabbitMQ"] },
  { group: "Infrastructure", items: ["Docker", "Linux", "CI/CD", "Git"] },
  { group: "Real-time & 3D", items: ["Unity", "Unreal Engine", "Arduino"] },
]

const EXPERIENCE = [
  {
    role: "Contract Web Developer",
    company: "Infinity Outdoor Pvt. Ltd",
    period: "2025",
    detail: "Built and shipped the company's front end in React, Vite and Tailwind CSS.",
  },
  {
    role: "Co-op Project Manager",
    company: "Houle Electric",
    period: "Jan — Aug 2024",
    detail: "Cowichan District Hospital Redevelopment.",
  },
  {
    role: "BSc Computer Science",
    company: "University of Victoria",
    period: "Graduated 2025",
    detail: "Software Systems specialization, business minor. GPA 8.3 / 9.0.",
  },
]

const INTERESTS = ["Cars", "Sneakers", "Gaming", "Clean code", "New tech"]

export function AboutSection() {
  return (
    <section id="about" className="px-6 py-20 md:px-12 md:py-28">
      <SectionReveal>
        <SectionHeader index="03" label="About" meta="Victoria, BC" title="About" />
      </SectionReveal>

      <SectionReveal delay={60}>
        <p className="mb-16 max-w-3xl font-serif text-2xl leading-[1.3] text-foreground md:mb-20 md:text-3xl lg:text-4xl">
          Computer Science graduate from the University of Victoria, specialising
          in Software Systems. I like problems with a hard edge to them — order
          matching, procedural generation, anything where{" "}
          <em className="text-accent">correct</em> is measurable.
        </p>
      </SectionReveal>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
        {/* Stack — set as a spec sheet */}
        <SectionReveal delay={120}>
          <h3 className="mb-8 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Stack
          </h3>
          <dl className="divide-y divide-border border-y border-border">
            {STACK.map(({ group, items }) => (
              <div key={group} className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-support">
                  {group}
                </dt>
                <dd className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-foreground">
                  {items.map((item, i) => (
                    <span key={item} className="flex items-center gap-4">
                      {item}
                      {i < items.length - 1 && (
                        <span aria-hidden className="text-muted-foreground/45">/</span>
                      )}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </SectionReveal>

        <div className="flex flex-col gap-16">
          <SectionReveal delay={180}>
            <h3 className="mb-8 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Track record
            </h3>
            <ol className="relative border-l border-border pl-6">
              {EXPERIENCE.map((exp) => (
                <li key={exp.role} className="relative pb-9 last:pb-0">
                  <span
                    aria-hidden
                    className="absolute -left-[1.83rem] top-1.5 h-2 w-2 bg-accent"
                  />
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {exp.period}
                  </p>
                  <p className="mt-2 font-display text-xl font-medium leading-tight text-foreground">
                    {exp.role}
                  </p>
                  <p className="mt-0.5 font-serif text-base italic text-support">
                    {exp.company}
                  </p>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    {exp.detail}
                  </p>
                </li>
              ))}
            </ol>
          </SectionReveal>

          <SectionReveal delay={240}>
            <h3 className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Off the clock
            </h3>
            <p className="font-serif text-xl italic leading-relaxed text-foreground/80">
              {INTERESTS.join(" · ")}
            </p>
          </SectionReveal>
        </div>
      </div>
    </section>
  )
}
