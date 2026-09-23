"use client"

import { useEffect, useRef, useState } from "react"
import { Download, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { GrainOverlay } from "@/components/grain-overlay"
import { CropMarks } from "@/components/crop-marks"
import { SectionHeader } from "@/components/section-header"
import {
  trackEvent,
  trackResumeDownload,
  initScrollDepthTracking,
  initEngagementTimer,
} from "@/lib/analytics"

const RESUME_PDF = "/resume.pdf"

type ViewerState = "loading" | "ready" | "failed"

export default function ResumePage() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [viewer, setViewer] = useState<ViewerState>("loading")

  useEffect(() => {
    trackEvent("resume_page_view", "resume_page")
    const cleanupScroll = initScrollDepthTracking()
    const cleanupTimer = initEngagementTimer()
    return () => {
      cleanupScroll()
      cleanupTimer()
    }
  }, [])

  /* An <iframe> fires `load` even when the server returns a 404 page, so the
     load event alone cannot tell a rendered PDF from a missing one. Ask for
     the headers first and fail over to the download card when it is not there. */
  useEffect(() => {
    let cancelled = false
    fetch(RESUME_PDF, { method: "HEAD" })
      .then((res) => {
        if (cancelled || res.ok) return
        setViewer("failed")
        trackEvent("resume_pdf_load_failed", `http_${res.status}`)
      })
      .catch(() => {
        if (cancelled) return
        setViewer("failed")
        trackEvent("resume_pdf_load_failed", "network")
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const onLoad = () => {
      // Never overwrite a failure the HEAD check already established.
      setViewer((current) => (current === "failed" ? current : "ready"))
      trackEvent("resume_pdf_loaded", "iframe")
    }
    iframe.addEventListener("load", onLoad)

    // Some browsers (and most mobile ones) refuse to render a PDF inline and
    // fire no error — fall back to the download card after a fixed wait.
    const timeout = setTimeout(() => {
      setViewer((current) => {
        if (current === "loading") {
          trackEvent("resume_pdf_load_failed", "timeout")
          return "failed"
        }
        return current
      })
    }, 8000)

    return () => {
      iframe.removeEventListener("load", onLoad)
      clearTimeout(timeout)
    }
  }, [])

  const downloadButton = (variant: "solid" | "outline") => (
    <a
      href={RESUME_PDF}
      download="Chaiitanyaa_Chopraa_Resume.pdf"
      onClick={trackResumeDownload}
      className={`inline-flex min-h-[48px] items-center gap-2.5 px-6 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
        variant === "solid"
          ? "bg-foreground text-background hover:bg-accent"
          : "border border-foreground/25 text-foreground hover:border-accent hover:text-accent"
      }`}
    >
      <Download className="h-3.5 w-3.5" aria-hidden />
      Download PDF
    </a>
  )

  return (
    <>
      <GrainOverlay />
      <CropMarks />
      <Navigation />

      <main id="main" className="relative min-h-screen">
        <section className="px-6 pb-10 pt-28 md:px-12 md:pt-32">
          <SectionHeader
            index="05"
            label="Resume"
            meta="Last updated 2025"
            title="The"
            accent="Résumé"
          >
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {downloadButton("solid")}
              <Link
                href="/#work"
                className="inline-flex min-h-[48px] items-center gap-2.5 border border-foreground/25 px-6 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground transition-colors hover:border-support hover:text-support"
                onClick={() => trackEvent("resume_nav_back", "work")}
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                Back to the work
              </Link>
            </div>
          </SectionHeader>
        </section>

        {/* ── Viewer ── */}
        <section className="px-6 pb-20 md:px-12 md:pb-28">
          <div className="relative mx-auto max-w-4xl border border-border bg-card">
            {viewer === "loading" && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-card">
                <div className="flex gap-2" aria-hidden>
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 animate-pulse bg-accent"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
                  role="status"
                >
                  Pulling the sheet
                </p>
              </div>
            )}

            {viewer === "failed" ? (
              <div className="flex flex-col items-center justify-center gap-5 px-8 py-20 text-center">
                <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                  The inline viewer didn’t load — some browsers refuse to render
                  a PDF in place. Download the file or open it in a new tab.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {downloadButton("solid")}
                  <a
                    href={RESUME_PDF}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("resume_pdf_open_tab", "fallback")}
                    className="inline-flex min-h-[48px] items-center border border-foreground/25 px-6 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    Open in new tab
                  </a>
                </div>
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                src={RESUME_PDF}
                title="Chaiitanyaa Chopraa — Resume"
                className="block w-full border-none"
                style={{ height: "85vh", minHeight: 560 }}
              />
            )}
          </div>

          <div className="mx-auto mt-5 flex max-w-4xl flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              PDF · Last updated 2025
            </span>
            {downloadButton("outline")}
          </div>
        </section>
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-6 py-12 md:px-12">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          © {new Date().getFullYear()} Chaiitanyaa Chopraa
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Victoria, BC
        </span>
      </footer>
    </>
  )
}
