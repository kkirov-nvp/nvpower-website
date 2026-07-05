import { site } from "../config/site";

/**
 * Submit a lead to the configured endpoint (§3 Forms).
 *
 * The default endpoint "/api/lead" is a [PLACEHOLDER]: until the owner wires
 * a real form service / serverless function (with email to info@nvpower.bg),
 * submissions are logged locally and resolved as success so the UX is testable.
 * Includes honeypot filtering — bots that fill `website` are silently dropped.
 */
export async function submitLead(
  kind: string,
  data: Record<string, unknown>,
  honeypot?: string,
): Promise<boolean> {
  if (honeypot) return true; // bot — pretend success, send nothing

  const payload = { kind, ...data, page: typeof location !== "undefined" ? location.pathname : "", ts: new Date().toISOString() };

  if (site.formEndpoint.startsWith("/api/")) {
    // [PLACEHOLDER] endpoint not configured yet — simulate delivery.
    await new Promise((r) => setTimeout(r, 700));
    console.info("[NV Power] lead (endpoint not configured):", payload);
    return true;
  }

  try {
    const res = await fetch(site.formEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}
