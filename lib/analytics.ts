export const trackEvent = (event: string, label?: string) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", event, {
      event_label: label,
    });
  }
};