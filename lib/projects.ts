/**
 * Selected work.
 *
 * ── Adding media ───────────────────────────────────────────────────────────
 * `image` — a still at `public/projects/<slug>.jpg`, roughly 16:10.
 * `video` — a short silent loop beside it. The still becomes its poster, so
 *   set both: the poster shows immediately and the clip only downloads once
 *   the card is near the viewport.
 *
 * Loops are cut from the full demo recordings with scripts/clip-demo.swift —
 * keep them under ~2.5MB and 10–15s, with no audio track.
 *
 * With neither set, the card shows a marked placeholder rather than a gap.
 */

/**
 * Where a visitor can go next. Each one renders as its own labelled button, and
 * only when it is set — nothing shows a dead or greyed-out slot.
 *
 *   github — the source repository
 *   live   — a deployed site or web app people can use
 *   demo   — something to try or watch that is not the product itself
 *            (a playable build, a video walkthrough)
 */
export interface ProjectLinks {
  github?: string
  live?: string
  demo?: string
}

export interface Project {
  /** Sequence number in the selected-work run. */
  index: string
  slug: string
  title: string
  category: string
  /** One line a recruiter can read at a glance. */
  summary: string
  description: string
  tech: string[]
  links: ProjectLinks
  /** What someone should know before clicking through — e.g. hardware needed. */
  linkNote?: string
  /** Still image. Used alone, or as the poster frame when `video` is set. */
  image?: string
  /** Short silent loop, played when the card scrolls into view. */
  video?: string
  /** Anyone this was built with. Left off for solo work. */
  credit?: string
}

export const PROJECTS: Project[] = [
  {
    index: "01",
    slug: "social-spark",
    title: "Social Spark",
    category: "AI Platform",
    summary: "Matches brands to influencers and grades the content automatically.",
    description:
      "An AI-driven platform improving brand-influencer collaboration through intelligent campaign matching, automated content evaluation, and engagement analytics powered by the Gemini API.",
    tech: ["React", "Node.js", "MongoDB", "Gemini API", "Docker"],
    links: {
      github: "https://github.com/Chaiitanyaa/Social-Spark",
    },
    // image: "/projects/social-spark.png",
  },
  {
    index: "02",
    slug: "swifttrade",
    title: "SwiftTrade",
    category: "Trading System",
    summary: "A day-trading stack built around a FIFO order-matching engine I wrote from scratch.",
    description:
      "A full-stack day trading system with a custom FIFO-based order matching engine, supporting wallet management, market and limit orders, with containerized deployment.",
    tech: ["Python", "REST APIs", "Docker", "MongoDB", "RabbitMQ", "Redis"],
    links: {
      github: "https://github.com/Chaiitanyaa/SwiftTrade/tree/Test-run-3",
    },
    // image: "/projects/swifttrade.png",
  },
  {
    index: "03",
    slug: "procedural-builder",
    title: "Procedural Builder",
    category: "Game Development",
    summary: "Generates modular buildings in Unity at runtime, without hand-placing a single wall.",
    description:
      "A procedural building generation system in Unity enabling automatic creation of modular, scalable building layouts with performance-optimized real-time generation.",
    tech: ["Unity", "C#", "Procedural Generation"],
    links: {
      github: "https://github.com/Chaiitanyaa/Unity-Procedural-City-Building-Generation-Framework",
      demo: "https://chaiitanyaa.github.io/Unity-Procedural-City-Building-Generation-Framework/",
    },
    linkNote: "The demo is a Unity WebGL build that runs in the browser — best on desktop.",
    image: "/projects/procedural-builder.png",
  },
  {
    index: "04",
    slug: "scenecraft",
    title: "SceneCraft",
    category: "Interactive Storytelling",
    summary: "Kids move physical objects; the story writes itself around them.",
    description:
      "An interactive storytelling tool combining physical object manipulation with AI-generated narrative prompts, designed to support creativity for young users.",
    tech: ["Arduino", "AI", "Physical Interaction"],
    links: {
      github: "https://github.com/Chaiitanyaa/SceneCraft",
      live: "https://chaiitanyaa.github.io/SceneCraft/public/index.html",
    },
    linkNote: "The live site is the companion app for the physical story board.",
    image: "/projects/scenecraft.jpg",
    video: "/projects/scenecraft.mp4",
  },
  {
    index: "05",
    slug: "rhythmblocks",
    title: "RhythmBlocks",
    category: "Physical Computing",
    summary: "Wooden blocks a machine-learning model listens to and scores in real time.",
    description:
      "A physical music composition system using Arduino and sensor-based inputs to detect musical blocks, integrated with a Teachable Machine model for real-time feedback.",
    tech: ["Arduino", "Teachable Machine", "Sensors"],
    links: {
      github: "https://github.com/Chaiitanyaa/RhythmBlocks",
      live: "https://chaiitanyaa.github.io/RhythmBlocks/",
    },
    linkNote: "The live site connects to the Arduino block board to play sequences.",
    image: "/projects/rhythmblocks.jpg",
    video: "/projects/rhythmblocks.mp4",
  },
  {
    index: "06",
    slug: "braillebeats",
    title: "BrailleBeats",
    category: "Assistive Interface",
    summary: "Six buttons, one Braille cell — press a note, hear it played.",
    description:
      "A tangible interface for Braille music. Six push buttons stand in for the six dots of a Braille cell; entering a notation plays the matching note through a piezo buzzer at its correct pitch and duration, so visually impaired musicians can practise Braille music notation by ear and by touch at once.",
    tech: ["Arduino", "C++", "Tangible UI", "Accessibility"],
    links: {
      github: "https://github.com/Chaiitanyaa/BraileBeats",
    },
    image: "/projects/braillebeats.jpg",
    video: "/projects/braillebeats.mp4",
    credit: "With Aimee Le",
  },
]
