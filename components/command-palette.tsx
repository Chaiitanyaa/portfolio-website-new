"use client"

import { useCallback, useEffect, useState, type ComponentType, type SVGProps } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Command } from "cmdk"
import * as Dialog from "@radix-ui/react-dialog"
import { useTheme } from "next-themes"
import {
  ArrowUpRight,
  Check,
  Copy,
  Download,
  FileText,
  Github,
  Globe,
  Hash,
  Linkedin,
  Mail,
  MonitorPlay,
  Moon,
  Sun,
} from "lucide-react"
import { PROJECTS, type ProjectLinks } from "@/lib/projects"
import { trackEvent } from "@/lib/analytics"

const EMAIL = "reachme@chaiitanyaa.com"

type Icon = ComponentType<SVGProps<SVGSVGElement>>

const SECTIONS: { label: string; href: string; hint: string }[] = [
  { label: "Selected work", href: "/#work", hint: "01" },
  { label: "Activity on GitHub", href: "/#activity", hint: "02" },
  { label: "About", href: "/#about", hint: "03" },
  { label: "Contact", href: "/#contact", hint: "04" },
  { label: "Résumé", href: "/resume", hint: "Page" },
]

const LINK_META: Record<keyof ProjectLinks, { label: string; Icon: Icon }> = {
  github: { label: "GitHub", Icon: Github },
  live: { label: "Live site", Icon: Globe },
  demo: { label: "Demo", Icon: MonitorPlay },
}

function Item({
  onSelect,
  Icon,
  children,
  hint,
  keywords,
  external = false,
}: {
  onSelect: () => void
  Icon: Icon
  children: React.ReactNode
  hint?: string
  keywords?: string[]
  external?: boolean
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      keywords={keywords}
      className="group flex min-h-[44px] cursor-pointer items-center gap-3 px-3 text-sm text-foreground data-[selected=true]:bg-accent/10"
    >
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground group-data-[selected=true]:text-accent" aria-hidden />
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {hint && (
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {hint}
        </span>
      )}
      {external && (
        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
      )}
    </Command.Item>
  )
}

const groupClass =
  "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-4 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.25em] [&_[cmdk-group-heading]]:text-accent"

/**
 * ⌘K — everything on the site, one keystroke away: jump to a section, open
 * any project's GitHub / live site / demo, copy the email address, switch
 * theme, grab the résumé. Opens with ⌘K / Ctrl+K anywhere, or from the button
 * in the navigation bar.
 */
export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onOpenChange])

  useEffect(() => {
    if (open) {
      setCopied(false)
      trackEvent("command_palette_open", "palette")
    }
  }, [open])

  const close = useCallback(() => onOpenChange(false), [onOpenChange])

  const go = useCallback(
    (href: string) => {
      close()
      if (href.startsWith("/#") && pathname === "/") {
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        document.getElementById(href.slice(2))?.scrollIntoView({ behavior: still ? "auto" : "smooth" })
        history.replaceState(null, "", href)
      } else {
        router.push(href)
      }
    },
    [close, pathname, router],
  )

  const openExternal = useCallback(
    (url: string, label: string) => {
      trackEvent("command_palette_link", label)
      window.open(url, "_blank", "noopener,noreferrer")
      close()
    },
    [close],
  )

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      trackEvent("email_copied", "command_palette")
      setTimeout(close, 900)
    } catch {
      // Clipboard blocked — fall back to composing an email instead.
      window.location.href = `mailto:${EMAIL}`
      close()
    }
  }, [close])

  const isDark = resolvedTheme === "dark"

  return (
    /* The dialog is built from the app's own Radix copy rather than cmdk's
       Command.Dialog: cmdk bundles a nested Radix, and a Title from a
       different copy can't find its Dialog — it throws on open. */
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-[hsl(228_14%_8%/0.45)] backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-[14vh] z-[71] w-[min(38rem,calc(100vw-2rem))] -translate-x-1/2 border border-foreground/80 bg-background text-foreground shadow-[6px_6px_0_hsl(var(--accent))] focus:outline-none">
          <Dialog.Title className="sr-only">Quick actions</Dialog.Title>
          <Dialog.Description className="sr-only">
            Search sections, projects and actions. Use the arrow keys to move and Enter to open.
          </Dialog.Description>
          <Command label="Quick actions" loop>
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Command.Input
                placeholder="Jump to a section, project or action…"
                className="h-14 w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
              />
              <kbd className="hidden shrink-0 border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted-foreground sm:block">
                Esc
              </kbd>
            </div>

            <Command.List className="max-h-[min(60vh,26rem)] overflow-y-auto overscroll-contain pb-2">
              <Command.Empty className="px-4 py-10 text-center text-sm text-muted-foreground">
                Nothing matches that. Try a project name or “email”.
              </Command.Empty>

              <Command.Group heading="Go to" className={groupClass}>
                {SECTIONS.map((s) => (
                  <Item key={s.href} Icon={s.href === "/resume" ? FileText : Hash} hint={s.hint} onSelect={() => go(s.href)}>
                    {s.label}
                  </Item>
                ))}
              </Command.Group>

              <Command.Group heading="Projects" className={groupClass}>
                {PROJECTS.flatMap((p) =>
                  (Object.keys(LINK_META) as (keyof ProjectLinks)[])
                    .filter((kind) => p.links[kind])
                    .map((kind) => {
                      const { label, Icon } = LINK_META[kind]
                      return (
                        <Item
                          key={`${p.slug}-${kind}`}
                          Icon={Icon}
                          external
                          keywords={[p.category, ...p.tech]}
                          onSelect={() => openExternal(p.links[kind]!, `${p.slug}_${kind}`)}
                        >
                          {p.title} <span className="text-muted-foreground">— {label}</span>
                        </Item>
                      )
                    }),
                )}
              </Command.Group>

              <Command.Group heading="Actions" className={groupClass}>
                <Item Icon={copied ? Check : Copy} keywords={["email", "contact", "address"]} onSelect={copyEmail}>
                  {copied ? "Email address copied" : "Copy email address"}
                </Item>
                <Item
                  Icon={Mail}
                  keywords={["contact", "hire", "message"]}
                  onSelect={() => {
                    window.location.href = `mailto:${EMAIL}`
                    close()
                  }}
                >
                  Write an email
                </Item>
                <Item
                  Icon={isDark ? Sun : Moon}
                  keywords={["theme", "dark", "light", "mode"]}
                  onSelect={() => {
                    setTheme(isDark ? "light" : "dark")
                    close()
                  }}
                >
                  Switch to {isDark ? "light" : "dark"} theme
                </Item>
                <Item
                  Icon={Download}
                  keywords={["cv", "resume", "pdf"]}
                  onSelect={() => {
                    trackEvent("resume_download", "command_palette")
                    const a = document.createElement("a")
                    a.href = "/resume.pdf"
                    a.download = "Chaiitanyaa_Chopraa_Resume.pdf"
                    a.click()
                    close()
                  }}
                >
                  Download résumé (PDF)
                </Item>
              </Command.Group>

              <Command.Group heading="Elsewhere" className={groupClass}>
                <Item Icon={Github} external onSelect={() => openExternal("https://github.com/chaiitanyaa", "github_profile")}>
                  GitHub profile
                </Item>
                <Item
                  Icon={Linkedin}
                  external
                  onSelect={() => openExternal("https://www.linkedin.com/in/chaiitanyaa-chopraa-96ba09229/", "linkedin")}
                >
                  LinkedIn
                </Item>
              </Command.Group>
            </Command.List>

            <div className="flex items-center gap-5 border-t border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <span>↑↓ Move</span>
              <span>↵ Open</span>
              <span className="hidden sm:inline">Esc Close</span>
            </div>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
