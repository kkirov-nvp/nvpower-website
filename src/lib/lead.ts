import { site } from "../config/site";

/**
 * Submit a lead to the configured endpoint (§3 Forms).
 *
 * Sent as multipart FormData rather than JSON so an attached invoice actually
 * reaches the inbox — most form services (Formspree, Web3Forms, a serverless
 * handler) accept files this way.
 *
 * This deliberately never reports success it cannot verify: if no endpoint is
 * configured, the caller gets "unconfigured" and shows the visitor the
 * email/phone fallback. Anything else silently loses real enquiries.
 */
export type LeadResult = "ok" | "error" | "unconfigured";

/** Reject oversized attachments before we waste the visitor's upload. */
export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
export const ACCEPTED_FILE_TYPES = [".pdf", ".jpg", ".jpeg", ".png"];

export function fileError(file: File | null, locale: "bg" | "en"): string | null {
  if (!file) return null;
  const okType = ACCEPTED_FILE_TYPES.some((ext) => file.name.toLowerCase().endsWith(ext));
  if (!okType) {
    return locale === "bg"
      ? "Приемаме само PDF, JPG или PNG файлове."
      : "We accept PDF, JPG or PNG files only.";
  }
  if (file.size > MAX_FILE_BYTES) {
    return locale === "bg"
      ? "Файлът е над 10 MB. Прикачи по-малък или ни го изпрати по имейл."
      : "That file is over 10 MB. Attach a smaller one or email it to us.";
  }
  return null;
}

export async function submitLead(
  kind: string,
  data: Record<string, unknown>,
  honeypot?: string,
  file?: File | null,
): Promise<LeadResult> {
  if (honeypot) return "ok"; // bot — pretend success, send nothing

  const endpoint = site.formEndpoint;

  // Empty is the only "not configured" signal. Do not sniff the path: a
  // same-origin handler at /api/lead is a perfectly valid endpoint, and is in
  // fact the preferred one — it keeps the CSP at form-action 'self'.
  if (!endpoint.trim()) {
    // Loud on purpose: this must be caught before launch, not after.
    console.error(
      `[NV Power] No form endpoint configured — the "${kind}" submission was NOT sent. ` +
        `Set site.formEndpoint in src/config/site.ts to a real form service or serverless URL.`,
      data,
    );
    return "unconfigured";
  }

  const body = new FormData();
  body.append("kind", kind);
  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined || value === "") continue;
    body.append(key, Array.isArray(value) ? value.join(", ") : String(value));
  }
  if (file) body.append("attachment", file, file.name);
  body.append("page", typeof location !== "undefined" ? location.pathname : "");
  body.append("ts", new Date().toISOString());

  try {
    // No Content-Type header — the browser sets the multipart boundary itself.
    const res = await fetch(endpoint, { method: "POST", headers: { Accept: "application/json" }, body });
    return res.ok ? "ok" : "error";
  } catch {
    return "error";
  }
}
