// Crosses the R3F Canvas boundary where Next router context is unavailable.
// R3F components dispatch; the wrapper (normal React tree) listens and pushes.

export const NAVIGATE_EVENT = "codezen:navigate";

export function requestNavigate(href: string): void {
  window.dispatchEvent(new CustomEvent(NAVIGATE_EVENT, { detail: href }));
}
