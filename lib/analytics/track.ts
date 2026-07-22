export const EVENTS = {
  TOOL_STARTED: "tool_started",
  TOOL_COMPLETED: "tool_completed",
  TOOL_DOWNLOADED: "tool_downloaded",
  TOOL_COPIED: "tool_copied",
  TOOL_FAILED: "tool_failed",
  SEARCH_PERFORMED: "search_performed",
  RELATED_TOOL_CLICKED: "related_tool_clicked",
  FAQ_EXPANDED: "faq_expanded",
} as const;

export function track(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", event, params);
}

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}
