import { ArrowUpRight, Github } from "lucide-react"
import { getGitHubActivity } from "@/lib/github"
import { ContributionGraph } from "./contribution-graph"
import { SectionHeader } from "./section-header"
import { SectionReveal } from "./section-reveal"

/* Language share bar: the two inks first, then the key at falling strengths. */
const LANGUAGE_INKS = [
  "bg-accent",
  "bg-support",
  "bg-accent/55",
  "bg-support/55",
  "bg-foreground/45",
  "bg-foreground/30",
  "bg-foreground/15",
]

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}

/**
 * The commit log, printed on black stock.
 *
 * Everything here is pulled from GitHub at build time (refreshed daily): the
 * contribution year, the repos most recently pushed to, the language mix and
 * the profile's own bio line. If GitHub can't be reached the whole section is left out
 * rather than shown half-empty.
 */
export async function ActivitySection() {
  const data = await getGitHubActivity()
  if (!data) return null

  const languageTotal = data.languages.reduce((sum, l) => sum + l.repos, 0)
  const languages = data.languages.slice(0, LANGUAGE_INKS.length)

  return (
    <section id="activity" className="night-panel px-6 py-20 md:px-12 md:py-28">
      <SectionReveal>
        <SectionHeader
          index="02"
          label="Activity"
          meta={`Synced from GitHub · ${shortDate(data.fetchedAt)}`}
          title="In the"
          accent="commit log"
        />
      </SectionReveal>

      <SectionReveal delay={60}>
        <ContributionGraph
          days={data.days}
          weeks={data.weeks}
          total={data.total}
          activeDays={data.activeDays}
        />
      </SectionReveal>

      <div className="mt-16 grid grid-cols-1 gap-12 md:mt-20 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        {/* Recently pushed */}
        <SectionReveal delay={120}>
          <h3 className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Recently pushed
          </h3>
          <ul className="divide-y divide-border border-y border-border">
            {data.repos.map((repo) => (
              <li key={repo.name}>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start justify-between gap-4 py-4"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-mono text-[13px] text-foreground transition-colors group-hover:text-accent">
                      {repo.name}
                    </span>
                    {repo.description && (
                      <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-muted-foreground">
                        {repo.description}
                      </span>
                    )}
                    <span className="mt-2 flex flex-wrap gap-x-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {repo.language && <span className="text-support">{repo.language}</span>}
                      <span>Pushed {shortDate(repo.pushedAt)}</span>
                    </span>
                  </span>
                  <ArrowUpRight
                    className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    aria-hidden
                  />
                  <span className="sr-only">(opens GitHub in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </SectionReveal>

        {/* Language mix */}
        <SectionReveal delay={180}>
          <h3 className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Languages · {languageTotal} repos
          </h3>
          <div className="flex h-3 w-full gap-px" aria-hidden>
            {languages.map((l, i) => (
              <span
                key={l.name}
                className={LANGUAGE_INKS[i]}
                style={{ flexGrow: l.repos, flexBasis: 0 }}
              />
            ))}
          </div>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5">
            {languages.map((l, i) => (
              <li key={l.name} className="flex items-center gap-2.5 text-sm text-foreground">
                <span aria-hidden className={`h-2.5 w-2.5 shrink-0 ${LANGUAGE_INKS[i]}`} />
                <span className="truncate">{l.name}</span>
                <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                  {l.repos}
                </span>
              </li>
            ))}
          </ul>
        </SectionReveal>

        {/* In their own words */}
        <SectionReveal delay={240}>
          <h3 className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            From the profile
          </h3>
          {data.bio && (
            <blockquote className="font-display text-2xl font-normal italic leading-snug text-foreground md:text-3xl">
              “{data.bio}”
            </blockquote>
          )}
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {data.publicRepos} public repositories
          </p>
          <a
            href={data.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-[44px] items-center gap-2.5 border border-foreground/25 px-4 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            <Github className="h-4 w-4" aria-hidden />
            Follow on GitHub
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </SectionReveal>
      </div>
    </section>
  )
}
