"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import {
  trackEvent,
  trackResumeDownload,
  initScrollDepthTracking,
  initEngagementTimer,
} from "@/lib/analytics"

const RESUME_PDF = "/resume.pdf"

export default function ResumePage() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const loaderRef = useRef<HTMLDivElement>(null)

  // ── Analytics init ──────────────────────────────────────────────────────────
  useEffect(() => {
    // Page view
    trackEvent("resume_page_view", "resume_page")

    // Reuse existing scroll depth + engagement timer from lib/analytics
    const cleanupScroll = initScrollDepthTracking()
    const cleanupTimer = initEngagementTimer()

    return () => {
      cleanupScroll()
      cleanupTimer()
    }
  }, [])

  // ── iframe load / fallback ──────────────────────────────────────────────────
  useEffect(() => {
    const iframe = iframeRef.current
    const loader = loaderRef.current
    if (!iframe || !loader) return

    const onLoad = () => {
      loader.style.opacity = "0"
      loader.style.pointerEvents = "none"
      trackEvent("resume_pdf_loaded", "iframe")
    }

    iframe.addEventListener("load", onLoad)

    // Show fallback if PDF doesn't load in 8 s
    const timeout = setTimeout(() => {
      if (loader.style.opacity !== "0") {
        loader.style.opacity = "0"
        loader.style.pointerEvents = "none"
        const fallback = document.getElementById("pdf-fallback")
        if (fallback) {
          fallback.style.display = "flex"
          iframe.style.display = "none"
        }
        trackEvent("resume_pdf_load_failed", "timeout")
      }
    }, 8000)

    return () => {
      iframe.removeEventListener("load", onLoad)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <main className="relative min-h-screen bg-background text-foreground">

      {/* ── NAV ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <nav className="flex items-center justify-between px-6 md:px-12 py-5">
          <Link
            href="/"
            className="font-serif text-lg italic tracking-tight text-foreground hover:text-accent transition-colors"
            onClick={() => trackEvent("resume_nav_back", "logo")}
          >
            cc.
          </Link>

          <div className="hidden md:flex items-center gap-10 ml-auto mr-auto">
            {[
              { label: "Work", href: "/#work" },
              { label: "About", href: "/#about" },
              { label: "Contact", href: "/#contact" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => trackEvent("resume_nav_back", item.label.toLowerCase())}
                className="group relative font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <a
            href={RESUME_PDF}
            download="Chaiitanyaa_Chopraa_Resume.pdf"
            onClick={trackResumeDownload}
            className="font-sans text-xs uppercase tracking-[0.2em] text-accent border border-accent/30 bg-accent/5 px-3 py-1.5 rounded-sm hover:bg-accent/10 transition-colors"
          >
            Download PDF
          </a>
        </nav>
      </header>

      {/* ── PAGE HEADER ── */}
      <section className="pt-32 pb-8 px-6 md:px-12 flex items-end justify-between">
        <div>
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground block mb-4">
            004
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight text-foreground">
            My <span className="italic text-accent">Resume</span>
          </h1>
        </div>
        <span className="hidden md:block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground text-right">
          Chaiitanyaa Chopraa<br />
          <span className="mt-1 block">Software Developer</span>
        </span>
      </section>

      <div className="border-t border-border mx-6 md:mx-12" />

      {/* ── PDF VIEWER ── */}
      <section className="px-6 md:px-12 py-10">
        <div className="relative max-w-4xl mx-auto border border-border rounded-sm overflow-hidden bg-card shadow-2xl">

          {/* Loader */}
          <div
            ref={loaderRef}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-card transition-opacity duration-400"
          >
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
              Loading resume
            </p>
          </div>

          {/* PDF iframe */}
          <iframe
            ref={iframeRef}
            src={RESUME_PDF}
            title="Chaiitanyaa Chopraa — Resume"
            className="block w-full border-none"
            style={{ height: "85vh", minHeight: 600 }}
          />

          {/* Fallback */}
          <div
            id="pdf-fallback"
            className="hidden flex-col items-center justify-center gap-4 py-16 px-8 text-center"
          >
            <p className="font-sans text-sm text-muted-foreground leading-relaxed">
              Your browser couldn&apos;t display the PDF inline.
            </p>
            <a
              href={RESUME_PDF}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackResumeDownload}
              className="font-sans text-xs uppercase tracking-[0.2em] text-accent border border-accent/30 bg-accent/5 px-4 py-2 rounded-sm hover:bg-accent/10 transition-colors"
            >
              Open PDF
            </a>
          </div>
        </div>

        {/* Download CTA */}
        <div className="max-w-4xl mx-auto mt-5 flex items-center justify-between flex-wrap gap-3">
          <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
            Last updated 2025
          </span>
          <a
            href={RESUME_PDF}
            download="Chaiitanyaa_Chopraa_Resume.pdf"
            onClick={trackResumeDownload}
            className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-accent border border-accent/30 bg-accent/5 px-4 py-2 rounded-sm hover:bg-accent/10 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download PDF
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border px-6 md:px-12 py-12 flex items-center justify-between flex-wrap gap-4">
        <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
          © 2025 Chaiitanyaa Chopraa
        </span>
        <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
          Victoria, BC
        </span>
      </footer>
    </main>
  )
}