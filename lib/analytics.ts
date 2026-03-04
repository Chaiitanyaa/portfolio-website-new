declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (method: string, ...args: unknown[]) => void;
  }
}

// ─── Core safe wrappers ───────────────────────────────────────────────────────

const gtag = (...args: unknown[]): void => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(...args);
  }
};

// Tag Clarity sessions with a custom label (e.g. traffic source)
const clarityTag = (key: string, value: string): void => {
  if (typeof window !== "undefined" && typeof window.clarity === "function") {
    window.clarity("set", key, value);
  }
};

// ─── 1. Generic event (backwards-compatible with existing trackEvent calls) ──

export const trackEvent = (
  eventName: string,
  label?: string,
  extra?: Record<string, unknown>
): void => {
  if (typeof window === "undefined") return;
  if (!window.gtag) {
    console.warn("[analytics] gtag not loaded yet");
    return;
  }
  gtag("event", eventName, {
    event_category: "engagement",
    event_label: label,
    ...extra,
  });
};

// ─── 2. Resume PDF download ───────────────────────────────────────────────────

export const trackResumeDownload = (): void => {
  gtag("event", "resume_download", {
    event_category: "engagement",
    event_label: "Resume PDF",
    value: 1,
  });
  clarityTag("resume_download", "true");
};

// ─── 3. Project card / link click ────────────────────────────────────────────

export const trackProjectClick = (
  projectName: string,
  projectCategory?: string
): void => {
  gtag("event", "project_click", {
    event_category: "portfolio",
    event_label: projectName,
    project_category: projectCategory ?? "",
    value: 1,
  });
  clarityTag("last_project_clicked", projectName);
};

// ─── 4. Contact / social link click ──────────────────────────────────────────

export type ContactPlatform = "GitHub" | "LinkedIn" | "Email" | "Resume";

export const trackContactClick = (platform: ContactPlatform): void => {
  gtag("event", "contact_click", {
    event_category: "outbound",
    event_label: platform,
    value: 1,
  });
  clarityTag("contact_platform", platform);
};

// ─── 5. Scroll depth (25 / 50 / 75 / 100%) ───────────────────────────────────

export const initScrollDepthTracking = (): (() => void) => {
  if (typeof window === "undefined") return () => {};

  const milestones = [25, 50, 75, 100];
  const reached = new Set<number>();

  const onScroll = (): void => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    if (docHeight <= 0) return;
    const pct = Math.round((scrollTop / docHeight) * 100);

    for (const m of milestones) {
      if (pct >= m && !reached.has(m)) {
        reached.add(m);
        gtag("event", "scroll_depth", {
          event_category: "engagement",
          event_label: `${m}%`,
          value: m,
        });
      }
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
};

// ─── 6. Engagement timer — fires active seconds on page when user leaves ─────

export const initEngagementTimer = (): (() => void) => {
  if (typeof window === "undefined") return () => {};

  const start = Date.now();
  let hiddenAt: number | null = null;
  let hiddenTotal = 0;

  const onVisibility = (): void => {
    if (document.hidden) {
      hiddenAt = Date.now();
    } else if (hiddenAt !== null) {
      hiddenTotal += Date.now() - hiddenAt;
      hiddenAt = null;
    }
  };

  const onUnload = (): void => {
    const secs = Math.round((Date.now() - start - hiddenTotal) / 1000);
    gtag("event", "time_on_page", {
      event_category: "engagement",
      event_label: "active_seconds",
      value: secs,
    });
  };

  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("beforeunload", onUnload);

  return () => {
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("beforeunload", onUnload);
  };
};

// ─── 7. Section view tracking via IntersectionObserver ───────────────────────

export const initSectionTracking = (
  selectors: string[] = ["#work", "#about", "#contact"]
): (() => void) => {
  if (typeof window === "undefined" || !("IntersectionObserver" in window))
    return () => {};

  const obs = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const label =
            (entry.target as HTMLElement).id ||
            (entry.target as HTMLElement).dataset.section ||
            "unknown";
          gtag("event", "section_view", {
            event_category: "navigation",
            event_label: label,
          });
          obs.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.3 }
  );

  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el) obs.observe(el);
  }

  return () => obs.disconnect();
};

// ─── 8. UTM & referrer capture ────────────────────────────────────────────────

export const captureReferralSource = (): void => {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source");
  const utmMedium = params.get("utm_medium");
  const utmCampaign = params.get("utm_campaign");
  const ref = document.referrer;

  const source: string =
    utmSource ??
    (ref.includes("linkedin.com")
      ? "linkedin"
      : ref.includes("github.com")
      ? "github"
      : ref.includes("google.com")
      ? "google"
      : ref.includes("twitter.com") || ref.includes("t.co")
      ? "twitter"
      : ref
      ? "other_referral"
      : "direct");

  // Persist in session so components can read it if needed
  sessionStorage.setItem("traffic_source", source);
  if (utmCampaign) sessionStorage.setItem("utm_campaign", utmCampaign);

  // Send to GA4 as user properties (filterable in Explore reports)
  gtag("set", "user_properties", {
    traffic_source: source,
    utm_medium: utmMedium ?? "none",
    utm_campaign: utmCampaign ?? "none",
  });

  // Also fire a named event so it shows in the Events report
  gtag("event", "session_start_enriched", {
    event_category: "acquisition",
    traffic_source: source,
    referrer_url: ref || "direct",
  });

  // Tag the Clarity session so recordings are filterable by source
  clarityTag("traffic_source", source);
};