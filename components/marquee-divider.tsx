"use client"

/**
 * The press run passing through — a continuous ink strip between sections.
 * Driven by CSS rather than rAF so it costs nothing on the main thread and
 * settles harmlessly when reduced motion is on.
 */
const WORDS = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "PostgreSQL",
  "MongoDB",
  "Docker",
  "Redis",
  "RabbitMQ",
  "Unity",
  "C++",
]

export function MarqueeDivider() {
  // Two identical tracks: the second covers the seam as the first scrolls out.
  const track = (key: string) => (
    <div key={key} className="flex shrink-0 items-center gap-7 pr-7" aria-hidden={key === "b"}>
      {WORDS.map((word, i) => (
        <span key={`${word}-${i}`} className="flex items-center gap-7">
          <span
            className={`riso-multiply font-display text-2xl font-normal italic tracking-[-0.01em] md:text-4xl ${
              i % 2 === 0 ? "text-accent" : "text-support"
            }`}
          >
            {word}
          </span>
          <span className="h-4 w-px shrink-0 bg-border" aria-hidden />
        </span>
      ))}
    </div>
  )

  return (
    <div
      className="riso-halftone-blue relative overflow-hidden border-y border-border py-7 [background-blend-mode:multiply] [background-position:center] md:py-9"
      role="presentation"
    >
      <div className="flex w-max animate-marquee will-change-transform">
        {track("a")}
        {track("b")}
      </div>
    </div>
  )
}
