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
  phone: "+359 88 000 0000",
  phoneHref: "+359880000000",

  email: "info@nvpower.bg",

  /** [PLACEHOLDER] office address */
  address: {
    bg: "гр. София, ул. „Пример“ 1",
    en: "1 Primer St, Sofia, Bulgaria",
  },
  /** [PLACEHOLDER] Google Maps embed URL for the office */
  mapsEmbed: "https://www.google.com/maps?q=Sofia,Bulgaria&output=embed",

  workingHours: { bg: "Пон – Пет: 09:00 – 18:00", en: "Mon – Fri: 09:00 – 18:00" },

  /** [PLACEHOLDER] legal identity — ЕИК, ДДС № */
  legal: {
    bg: "„НВ Пауър“ ЕООД · ЕИК 000000000 · ДДС № BG000000000",
    en: "NV Power Ltd · UIC 000000000 · VAT BG000000000",
  },

  /** [PLACEHOLDER] КЕВР license number (publish the PDF in /documents too) */
  license: {
    bg: "Лицензия за търговия с електрическа енергия № Л-000-15 / КЕВР",
    en: "Electricity trading licence No. L-000-15 / EWRC",
  },

  /** [PLACEHOLDER] real social profiles — remove any that don't exist */
  socials: {
    facebook: "https://www.facebook.com/nvpower",
    linkedin: "https://www.linkedin.com/company/nvpower",
    instagram: "",
  },

  /** Response promise repeated sitewide (§8): "в рамките на 1 работен ден". */
  responseTime: { bg: "1 работен ден", en: "1 business day" },

  /** Electricity price — published, transparent, dual currency (€ primary). */
  price: {
    eurPerKwh: 0.099,
    bgnPerKwh: 0.194,
    display: { bg: "0.099 €/кВтч (0.194 лв./кВтч)", en: "€0.099/kWh (0.194 BGN/kWh)" },
  },

  /** BGN/EUR fixed conversion rate (Eurozone transition) */
  eurRate: 1.95583,

  /** [PLACEHOLDER] §2 [TEAM] — at least founder/manager with a real photo */
  team: [
    {
      name: { bg: "Име Фамилия", en: "Full Name" },
      role: { bg: "Управител", en: "Managing Director" },
      photo: "", // /images/team/name.webp
    },
  ],

  /** Form endpoint — POST target (form service / serverless). [PLACEHOLDER] */
  formEndpoint: "/api/lead", // e.g. https://formspree.io/f/XXXX

  gaMeasurementId: "", // [PLACEHOLDER] GA4 id, e.g. G-XXXXXXX; empty = analytics off
} as const;

export type Locale = "bg" | "en";

export const kwhPriceEUR = site.price.eurPerKwh;
export const kwhPriceBGN = site.price.bgnPerKwh;
