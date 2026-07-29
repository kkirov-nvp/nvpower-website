import type { Locale } from "../config/site";
import { site } from "../config/site";

/**
 * Shown only when scripting is unavailable. These forms are React islands, so
 * without JS the submit button stays disabled by design (see useHydrated) –
 * this makes sure such a visitor still gets a way to reach us instead of
 * staring at a dead control.
 */
export default function NoScriptFallback({ locale }: { locale: Locale }) {
  const text =
    locale === "bg"
      ? "Формата изисква JavaScript. Обади ни се или ни пиши – отговаряме също толкова бързо:"
      : "This form needs JavaScript. Call or email us instead – we reply just as quickly:";

  return (
    <noscript>
      <p className="rounded-xl bg-accent/10 px-4 py-3 text-sm text-body">
        {text}{" "}
        <a href={`tel:${site.phoneHref}`} className="font-semibold text-accent underline">
          {site.phone}
        </a>{" "}
        ·{" "}
        <a href={`mailto:${site.email}`} className="font-semibold text-accent underline">
          {site.email}
        </a>
      </p>
    </noscript>
  );
}
