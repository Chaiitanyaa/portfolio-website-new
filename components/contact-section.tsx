"use client"

import React from "react"

import { SectionReveal } from "./section-reveal"
import { useRef, useState, useCallback } from "react"

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/chaiitanyaa" },
  { label: "LinkedIn", href: "https://linkedin.com/in/chaiitanyaa" },
  { label: "Portfolio", href: "https://www.chaiitanyaa.com" },
  { label: "Email", href: "mailto:reachme@chaiitanyaa.com" },
]

function MagneticLink({ label, href }: { label: string; href: string }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setOffset({ x: x * 0.2, y: y * 0.3 })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 })
  }, [])

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group flex items-center justify-between border-t border-border py-6 md:py-8 transition-colors hover:bg-accent/[0.03]"
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition:
          offset.x === 0
            ? "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s"
            : "background-color 0.3s",
      }}
    >
      <span className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground group-hover:text-accent transition-colors duration-300">
        {label}
      </span>
      <svg
        className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground group-hover:text-accent transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:rotate-0 -rotate-45"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
        />
      </svg>
    </a>
  )
}

export function ContactSection() {
  return (
    <section id="contact" className="px-6 md:px-12 py-24 md:py-40">
      <SectionReveal>
        <div className="mb-16 md:mb-24">
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground block mb-4">
            003
          </span>
          <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight text-foreground text-balance">
            {"Let\u2019s build"}
            <br />
            <span className="italic text-accent">something</span>
          </h2>
        </div>
      </SectionReveal>

      <SectionReveal delay={100}>
        <p className="font-sans text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg mb-16">
          Open to opportunities, collaborations, and conversations.
          Currently available for full-time roles and contract work.
        </p>
      </SectionReveal>

      <SectionReveal delay={200}>
        <div>
          {SOCIALS.map((social) => (
            <MagneticLink key={social.label} {...social} />
          ))}
          <div className="border-t border-border" />
        </div>
      </SectionReveal>
    </section>
  )
}
