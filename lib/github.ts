/**
 * Public GitHub activity, fetched on the server at build time and refreshed
 * daily. Nothing here runs in the browser.
 *
 * The contribution calendar has no public REST endpoint, so it is read from
 * the same HTML fragment github.com renders on the profile page. If GitHub
 * changes that markup — or the build machine is rate-limited — every function
 * returns null and the activity section simply doesn't render. The build never
 * fails because of it.
 *
 * Set GITHUB_TOKEN (a fine-grained token with no scopes is enough) in the
 * deploy environment to lift the unauthenticated 60-requests-an-hour limit,
 * which shared CI machines can exhaust.
 */

export const GITHUB_USER = "Chaiitanyaa"

const REVALIDATE = 60 * 60 * 24 // one day

export interface ContributionDay {
  date: string // YYYY-MM-DD
  level: 0 | 1 | 2 | 3 | 4
  count: number
  /** Weekday row, 0 = Sunday. */
  row: number
  /** Week column, 0 = oldest. */
  col: number
}

export interface RecentRepo {
  name: string
  url: string
  description: string | null
  language: string | null
  pushedAt: string
}

export interface GitHubActivity {
  total: number
  activeDays: number
  weeks: number
  days: ContributionDay[]
  repos: RecentRepo[]
  languages: { name: string; repos: number }[]
  publicRepos: number
  bio: string | null
  profileUrl: string
  fetchedAt: string
}

function apiHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "chaiitanyaa-portfolio",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function getJSON<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { headers: apiHeaders(), next: { revalidate: REVALIDATE } })
    return res.ok ? ((await res.json()) as T) : null
  } catch {
    return null
  }
}

async function getContributions(): Promise<{ total: number; days: ContributionDay[] } | null> {
  try {
    const res = await fetch(`https://github.com/users/${GITHUB_USER}/contributions`, {
      headers: { "User-Agent": "Mozilla/5.0 (portfolio build)" },
      next: { revalidate: REVALIDATE },
    })
    if (!res.ok) return null
    const html = await res.text()

    // Tooltips carry the exact count: "3 contributions on May 2nd." / "No contributions on …"
    const counts = new Map<string, number>()
    for (const m of html.matchAll(/<tool-tip[^>]*for="(contribution-day-component-[\d-]+)"[^>]*>\s*([^<]+?)\s*<\/tool-tip>/g)) {
      const n = /^(\d+)\s+contribution/.exec(m[2])
      counts.set(m[1], n ? Number(n[1]) : 0)
    }

    const days: ContributionDay[] = []
    for (const m of html.matchAll(/<td\b[^>]*class="ContributionCalendar-day"[^>]*>/g)) {
      const tag = m[0]
      const date = /data-date="([\d-]+)"/.exec(tag)?.[1]
      const id = /id="(contribution-day-component-(\d+)-(\d+))"/.exec(tag)
      const level = /data-level="(\d)"/.exec(tag)?.[1]
      if (!date || !id || level === undefined) continue
      days.push({
        date,
        level: Math.min(4, Number(level)) as ContributionDay["level"],
        count: counts.get(id[1]) ?? 0,
        row: Number(id[2]),
        col: Number(id[3]),
      })
    }
    if (days.length < 7 * 20) return null // markup changed; don't render a broken graph

    const totalMatch = /([\d,]+)\s+contributions?\s+in the last year/.exec(html)
    const total = totalMatch
      ? Number(totalMatch[1].replace(/,/g, ""))
      : days.reduce((sum, d) => sum + d.count, 0)

    days.sort((a, b) => a.date.localeCompare(b.date))
    return { total, days }
  } catch {
    return null
  }
}

interface ApiUser {
  public_repos: number
  bio: string | null
  html_url: string
}

interface ApiRepo {
  name: string
  html_url: string
  description: string | null
  language: string | null
  pushed_at: string
  fork: boolean
  archived: boolean
}

export async function getGitHubActivity(): Promise<GitHubActivity | null> {
  const [contrib, user, repos] = await Promise.all([
    getContributions(),
    getJSON<ApiUser>(`https://api.github.com/users/${GITHUB_USER}`),
    getJSON<ApiRepo[]>(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`),
  ])
  if (!contrib || !user || !repos) return null

  // The profile-README repo shares the username; it isn't a project.
  const own = repos.filter(
    (r) => !r.fork && !r.archived && r.name.toLowerCase() !== GITHUB_USER.toLowerCase(),
  )

  const languageCounts = new Map<string, number>()
  for (const r of own) {
    if (r.language) languageCounts.set(r.language, (languageCounts.get(r.language) ?? 0) + 1)
  }

  return {
    total: contrib.total,
    activeDays: contrib.days.filter((d) => d.count > 0 || d.level > 0).length,
    weeks: Math.max(...contrib.days.map((d) => d.col)) + 1,
    days: contrib.days,
    repos: own
      .filter((r) => r.language || r.description)
      .slice(0, 4)
      .map((r) => ({
        name: r.name,
        url: r.html_url,
        description: r.description,
        language: r.language,
        pushedAt: r.pushed_at,
      })),
    languages: [...languageCounts.entries()]
      .map(([name, count]) => ({ name, repos: count }))
      .sort((a, b) => b.repos - a.repos || a.name.localeCompare(b.name)),
    publicRepos: user.public_repos,
    bio: user.bio?.trim() || null,
    profileUrl: user.html_url,
    fetchedAt: new Date().toISOString(),
  }
}
