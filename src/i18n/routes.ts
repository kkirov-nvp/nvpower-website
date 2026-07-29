import type { Locale } from "../config/site";

/**
 * Route map – BG slugs are canonical (§5).
 *
 * EN mirrors live under /en/ and use *English* slugs, not the BG ones, so the
 * English site reads naturally and ranks on English terms. Keep EN_SLUGS in
 * sync with the filenames under src/pages/en/ – a missing entry silently
 * produces a 404 in the nav, the language switcher, the canonical tag and the
 * hreflang pair all at once.
 */
export const routes = {
  home: "/",
  tok: "/tok/",
  solar: "/solar/",
  solarHome: "/solar/za-doma/",
  solarBiz: "/solar/za-biznesa/",
  oferta: "/oferta/",
  kalkulator: "/kalkulator/",
  proekti: "/proekti/",
  zaNas: "/za-nas/",
  info: "/info/",
  kontakti: "/kontakti/",
  privacy: "/politika-poveritelnost/",
  terms: "/obshti-usloviya/",
  aiInfo: "/ai-info/",
} as const;

export type RouteKey = keyof typeof routes;

/** BG-canonical path → EN slug. Paths absent here are identical in both. */
const EN_SLUGS: Record<string, string> = {
  "/tok/": "/electricity/",
  "/solar/za-doma/": "/solar/residential/",
  "/solar/za-biznesa/": "/solar/for-business/",
  "/oferta/": "/request-a-quote/",
  "/kalkulator/": "/calculator/",
  "/proekti/": "/projects/",
  "/za-nas/": "/about/",
  "/info/": "/resources/",
  "/kontakti/": "/contact/",
  "/politika-poveritelnost/": "/privacy/",
  "/obshti-usloviya/": "/terms/",
};

/** The EN twin of a BG-canonical path, e.g. "/tok/" → "/en/electricity/". */
export function enPath(path: string): string {
  return `/en${EN_SLUGS[path] ?? path}`;
}

/** Localize an internal path: bg → as-is, en → /en + translated slug. */
export function href(locale: Locale, path: string): string {
  return locale === "en" ? enPath(path) : path;
}

export function r(locale: Locale, key: RouteKey): string {
  return href(locale, routes[key]);
}

/** Given the BG-canonical path of the current page, produce hreflang pairs. */
export function alternates(path: string) {
  return { bg: path, en: enPath(path) };
}
