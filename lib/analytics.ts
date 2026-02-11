export const trackEvent = (eventName: string, label?: string) => {
  if (typeof window === "undefined") return;

  const gtag = (window as any).gtag;
  if (!gtag) return;

  gtag("event", eventName, {
    event_category: "engagement",
    event_label: label,
  });
};