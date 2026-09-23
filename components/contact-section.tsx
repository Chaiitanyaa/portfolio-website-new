"use client"

import { useCallback, useEffect, useState } from "react"
import { ArrowUpRight, Check, Copy } from "lucide-react"
import { SectionReveal } from "./section-reveal"
import { SectionHeader } from "./section-header"
import { trackEvent } from "@/lib/analytics"

const EMAIL = "reachme@chaiitanyaa.com"

const LINKS = [
  {
    label: "GitHub",
    handle: "@chaiitanyaa",
    href: "https://github.com/chaiitanyaa",
    external: true,
  },
  {
    label: "LinkedIn",
    handle: "Chaiitanyaa Chopraa",
    href: "https://www.linkedin.com/in/chaiitanyaa-chopraa-96ba09229/",
    external: true,
  },
  {
    label: "Resume",
    handle: "PDF · updated 2025",
    href: "/resume",
    external: false,
  },
]

function CopyEmail() {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 2200)
    return () => clearTimeout(t)
  }, [copied])

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      trackEvent("email_copied", "contact_section")
    } catch {
      // Clipboard blocked (insecure context, denied permission) — the address
      // is already on screen and the mailto link beside it still works.
      setCopied(false)
    }
  }, [])

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-[44px] items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-accent" aria-hidden />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden />
      )}
      {copied ? "Copied" : "Copy address"}
      <span aria-live="polite" className="sr-only">
        {copied ? `${EMAIL} copied to clipboard` : ""}
      </span>
    </button>
  )
}

export function ContactSection() {
  return (
    <section id="contact" className="px-6 py-20 md:px-12 md:py-28">
      <SectionReveal>
        <SectionHeader
          index="04"
          label="Contact"
          meta="Open to work"
          title="Let’s build"
          accent="something"
        />
      </SectionReveal>

      <SectionReveal delay={60}>
        <p className="mb-14 max-w-lg text-lg leading-relaxed text-muted-foreground">
          Available for full-time roles and contract work, from Victoria or
          remote. The fastest way to reach me is email — I read everything.
        </p>
      </SectionReveal>

      {/* Primary: the address itself, not a button that hides it */}
      <SectionReveal delay={120}>
        <div className="border-y border-border py-10 md:py-12">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
            Email
          </p>
          <a
            href={`mailto:${EMAIL}`}
            onClick={() => trackEvent("email_clicked", "contact_section")}
            className="group block break-all font-display text-[clamp(1.6rem,5.5vw,4rem)] font-normal italic leading-[1.05] tracking-[-0.015em] text-foreground transition-colors hover:text-accent"
          >
            {EMAIL}
          </a>
          <div className="mt-5">
            <CopyEmail />
          </div>
        </div>
      </SectionReveal>

      {/* Everywhere else */}
      <SectionReveal delay={180}>
        <ul>
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                onClick={() => {
                  if (link.label === "Resume") {
                    trackEvent("resume_download", "contact_section")
                  }
                }}
                className="group flex items-center justify-between gap-6 border-b border-border py-7 transition-colors hover:bg-accent/[0.04] md:py-9"
              >
                <span className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-6">
                  <span className="font-display text-3xl font-medium tracking-[-0.015em] text-foreground transition-colors group-hover:text-accent md:text-5xl">
                    {link.label}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {link.handle}
                  </span>
                </span>
                <ArrowUpRight
                  className="h-6 w-6 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent"
                  aria-hidden
                />
              </a>
            </li>
          ))}
        </ul>
      </SectionReveal>
    </section>
  )
}
