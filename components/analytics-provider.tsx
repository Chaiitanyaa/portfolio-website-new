"use client";

// ─────────────────────────────────────────────────────────────────────────────
// components/analytics-provider.tsx
//
// Initializes all passive trackers (scroll depth, engagement timer,
// section views, UTM capture) once on mount. Wrap your layout or page with this.
//
// Usage in app/layout.tsx:
//   import { AnalyticsProvider } from "@/components/analytics-provider"
//   ...
//   <body>
//     <AnalyticsProvider />
//     {children}
//   </body>
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from "react";
import {
  captureReferralSource,
  initScrollDepthTracking,
  initEngagementTimer,
  initSectionTracking,
} from "@/lib/analytics";   // ← adjust path if your analytics.ts lives elsewhere

export function AnalyticsProvider() {
  useEffect(() => {
    captureReferralSource();

    const cleanScroll = initScrollDepthTracking();
    const cleanTimer = initEngagementTimer();
    const cleanSections = initSectionTracking(["#work", "#about", "#contact"]);

    return () => {
      cleanScroll();
      cleanTimer();
      cleanSections();
    };
  }, []);

  // Renders nothing — purely a side-effect component
  return null;
}