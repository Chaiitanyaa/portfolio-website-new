export const trackEvent = (eventName: string, label?: string) => {
  if (typeof window === "undefined") return;
  const gtag = (window as any).gtag;
  if (!gtag) {
    console.warn("gtag not found yet");
    return;
  }
  gtag("event", eventName, {
    event_category: "engagement",
    event_label: label,
  });
};