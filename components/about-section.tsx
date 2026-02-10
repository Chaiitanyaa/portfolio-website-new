"use client"

import React from "react"

import { SectionReveal } from "./section-reveal"
import { useRef, useState, useCallback } from "react"

const SKILLS = [
  { name: "JavaScript / TypeScript", level: 95 },
  { name: "React / Next.js / Vite", level: 90 },
  { name: "Node.js / Express", level: 88 },
  { name: "Python / Java / C++", level: 85 },
  { name: "MongoDB / PostgreSQL", level: 82 },
  { name: "Docker / Linux / CI-CD", level: 80 },
  { name: "REST APIs / JWT Auth", level: 92 },
  { name: "Unity / Unreal Engine", level: 75 },
]

const EXPERIENCE = [
  {
    role: "Co-op Project Manager",
    company: "Houle Electric",
    period: "Jan 2024 \u2014 Aug 2024",
    detail: "Cowichan District Hospital Redevelopment",
  },
  {
    role: "Contract Web Developer",
    company: "Infinity Outdoor Pvt. Ltd",
    period: "2025",
    detail: "React, Vite, Tailwind CSS",
  },
]

function SkillBar({ name, level }: { name: string; level: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="group flex items-center gap-4 py-2.5 cursor-default"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="font-sans text-sm text-foreground flex-1 group-hover:text-accent transition-colors duration-300">
        {name}
      </span>
      <div className="w-24 md:w-32 h-[2px] bg-border relative overflow-hidden rounded-full">
        <div
          className="absolute top-0 left-0 h-full bg-accent/60 rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ width: isHovered ? `${level}%` : "0%" }}
        />
      </div>
    </div>
  )
}

function MagneticTag({ children }: { children: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setOffset({ x: x * 0.15, y: y * 0.15 })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 })
  }, [])

  return (
    <span
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block font-serif italic text-lg md:text-xl text-muted-foreground hover:text-accent transition-colors duration-300 cursor-default"
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: offset.x === 0 ? "transform 0.4s ease-out, color 0.3s" : "color 0.3s",
      }}
    >
      {children}
    </span>
  )
}

export function AboutSection() {
  const interests = ["cars", "sneakers", "gaming", "clean code", "new tech"]

  return (
    <section id="about" className="px-6 md:px-12 py-24 md:py-40">
      <SectionReveal>
        <div className="mb-20 md:mb-28">
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground block mb-4">
            002
          </span>
          <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight text-foreground">
            About
          </h2>
        </div>
      </SectionReveal>

      {/* Bio - large statement */}
      <SectionReveal delay={100}>
        <p className="font-sans text-xl md:text-2xl lg:text-3xl text-foreground leading-relaxed max-w-4xl mb-20">
          Computer Science graduate from the{" "}
          <span className="font-serif italic text-accent">University of Victoria</span>{" "}
          with a Software Systems specialization and business minor.
          I build production-quality software with ownership and attention to detail.
        </p>
      </SectionReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-24">
        {/* Left: Skills */}
        <SectionReveal delay={200}>
          <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-8">
            Technical Expertise
          </h3>
          <div className="divide-y divide-border/50">
            {SKILLS.map((skill) => (
              <SkillBar key={skill.name} name={skill.name} level={skill.level} />
            ))}
          </div>

          <div className="mt-6">
            <p className="font-mono text-[10px] tracking-widest text-muted-foreground">
              GPA: 8.3 / 9.0
            </p>
          </div>
        </SectionReveal>

        {/* Right: Experience + Interests */}
        <div className="flex flex-col gap-16">
          <SectionReveal delay={300}>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-8">
              Experience
            </h3>
            <div className="space-y-8">
              {EXPERIENCE.map((exp) => (
                <div key={exp.role} className="group">
                  <p className="font-sans text-base text-foreground font-medium group-hover:text-accent transition-colors">
                    {exp.role}
                  </p>
                  <p className="font-sans text-sm text-muted-foreground mt-1">
                    {exp.company}
                  </p>
                  {exp.detail && (
                    <p className="font-sans text-xs text-muted-foreground/60 mt-1 italic">
                      {exp.detail}
                    </p>
                  )}
                  <p className="font-mono text-[10px] tracking-widest text-muted-foreground mt-2">
                    {exp.period}
                  </p>
                </div>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal delay={400}>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
              Beyond Code
            </h3>
            <div className="flex flex-wrap gap-4">
              {interests.map((interest) => (
                <MagneticTag key={interest}>{interest}</MagneticTag>
              ))}
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  )
}
