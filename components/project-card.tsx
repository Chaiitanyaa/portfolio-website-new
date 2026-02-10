"use client"

import React from "react"

import { useState, useRef, useCallback } from "react"
import { ArrowUpRight } from "lucide-react"

interface ProjectCardProps {
  index: string
  title: string
  category: string
  description: string
  tech: string[]
  href?: string
}

export function ProjectCard({
  index,
  title,
  category,
  description,
  tech,
  href = "#",
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: x * 4, y: y * -4 })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setTilt({ x: 0, y: 0 })
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group border-t border-border"
      style={{
        transform: `perspective(800px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
        transition: isHovered ? "transform 0.1s ease-out" : "transform 0.4s ease-out",
      }}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block py-10 md:py-14"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-0">
          {/* Index */}
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground md:w-16 shrink-0">
            {index}
          </span>

          {/* Title */}
          <div className="flex-1">
            <h3
              className={`font-serif text-4xl md:text-6xl lg:text-7xl tracking-tight transition-colors duration-300 ${
                isHovered ? "text-accent" : "text-foreground"
              }`}
            >
              {title}
            </h3>
          </div>

          {/* Category + Arrow */}
          <div className="flex items-center gap-6 md:gap-10">
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {category}
            </span>
            <div
              className={`transition-all duration-300 ${
                isHovered
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-2"
              }`}
            >
              <ArrowUpRight className="h-5 w-5 text-accent" />
            </div>
          </div>
        </div>

        {/* Expandable details */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isHovered ? "max-h-40 opacity-100 mt-6" : "max-h-0 opacity-0 mt-0"
          }`}
        >
          <div className="flex flex-col md:flex-row gap-6 md:gap-16 md:pl-16">
            <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-md">
              {description}
            </p>
            <div className="flex flex-wrap gap-2">
              {tech.map((t) => (
                <span
                  key={t}
                  className="font-mono text-[10px] uppercase tracking-widest text-accent/80 border border-accent/20 px-3 py-1.5 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </a>
    </div>
  )
}
