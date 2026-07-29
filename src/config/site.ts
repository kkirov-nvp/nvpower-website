/* ==========================================================================
   NV Power — central business facts (§2 of the build brief)

   ⚠️  EVERY value marked [PLACEHOLDER] must be replaced with the real fact
   before publishing. This is the ONLY file that needs editing — all pages
   read from here. Never publish unverifiable claims.
   ========================================================================== */

export const SITE_URL = "https://nvpower.bg";

export const site = {
  name: "NV Power",
  tagline: { bg: "Енергия за утрешния ден", en: "Energy for tomorrow" },

  /** [PLACEHOLDER] main phone — appears in header, click-to-call */
  phone: "+359 XXXXXXX",
  phoneHref: "+359XXXXXXX",

  email: "info@nvpower.bg",

  /** [PLACEHOLDER] office address */
  address: {
    bg: "гр. София 1404, бул. „България“ 69, ет. 3",
    en: "69 Bulgaria Blvd, fl. 3, 1404 Sofia, Bulgaria",
  },
  /** [PLACEHOLDER] Google Maps embed URL for the office */
  mapsEmbed: "https://www.google.com/maps?q=bul.+Bulgaria+69,+Sofia&output=embed",

  workingHours: { bg: "Пон – Пет: 09:00 – 18:00", en: "Mon – Fri: 09:00 – 18:00" },

  /** [PLACEHOLDER] legal identity — ЕИК, ДДС № */
  legal: {
    bg: "„НВ Пауър“ ЕООД · ЕИК XXXXXXX · ДДС № BGXXXXXXX",
    en: "NV Power Ltd · UIC XXXXXXX · VAT BGXXXXXXX",
  },

  /** [PLACEHOLDER] КЕВР license number (publish the PDF in /documents too) */
  license: {
    bg: "Лицензия за търговия с електрическа енергия № XXXXXXX / КЕВР",
    en: "Electricity trading licence No. XXXXXXX / EWRC",
  },

  /** [PLACEHOLDER] real social profiles — remove any that don't exist */
  socials: {
    facebook: "https://www.facebook.com/nvpower",
    linkedin: "https://www.linkedin.com/company/nvpower",
    instagram: "",
  },

  /** Response promise repeated sitewide (§8): "в рамките на 1 работен ден". */
  responseTime: { bg: "1 работен ден", en: "1 business day" },

  /**
   * Electricity price — published and transparent.
   * Bulgaria joined the euro area in January 2026, so the euro is the only
   * currency quoted anywhere on the site. Do not reintroduce lev pricing.
   */
  price: {
    eurPerKwh: 0.099,
    display: { bg: "0.099 €/кВтч", en: "€0.099/kWh" },
  },

  /** [PLACEHOLDER] §2 [TEAM] — at least founder/manager with a real photo */
  team: [
    {
      name: { bg: "Николай Върбанов", en: "Nikolay Varbanov" }, // [PLACEHOLDER] mock name
      role: { bg: "Управител", en: "Managing Director" },
      photo: "", // /images/team/name.webp
    },
  ],

  /**
   * [PLACEHOLDER] Form endpoint — POST target receiving multipart FormData
   * (e.g. https://formspree.io/f/XXXX, or your own serverless handler).
   * While this is empty every form shows the visitor the email/phone fallback
   * instead of a false "we got it" — see src/lib/lead.ts. Must be set, and the
   * origin added to connect-src + form-action in public/_headers, before launch.
   */
  formEndpoint: "" as string,

  gaMeasurementId: "", // [PLACEHOLDER] GA4 id, e.g. G-XXXXXXX; empty = analytics off
} as const;

export type Locale = "bg" | "en";

export const kwhPriceEUR = site.price.eurPerKwh;
