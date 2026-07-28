import { useEffect, useState } from "react";

/**
 * False during server render and until React has hydrated on the client.
 *
 * Forms use this to keep their submit button disabled until the click handler
 * is actually live. Without it, a click landing before hydration (these islands
 * are `client:visible`, so that window is real) triggers a *native* form
 * submission: the page reloads, the visitor's input is silently discarded and
 * nothing is ever sent.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
