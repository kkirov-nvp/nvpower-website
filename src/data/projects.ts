import type { Locale } from "../config/site";

/* ==========================================================================
   ⚠️  SAMPLE DATA — §2 [PROJECTS]. Replace with REAL completed installations
   before publishing (location, kWp, battery, photo, client type, savings).
   Never publish fake projects. Delete entries you can't verify — the site
   renders an honest "coming soon" state when this list is empty.
   ========================================================================== */

export type Project = {
  slug: string;
  title: Record<Locale, string>;
  segment: "home" | "business" | "industry" | "agri";
  location: Record<Locale, string>;
  kwp: number;
  batteryKwh: number | null;
  year: number;
  status: Record<Locale, string>;
  annualSavings: Record<Locale, string>;
  story: Record<Locale, string>;
  quote?: { text: Record<Locale, string>; author: Record<Locale, string> };
  image: string; // /images/projects/*.webp — real photos only
  featured: boolean;
  sample: true; // remove this flag on real entries
};

export const projects: Project[] = [
  {
    slug: "primer-sklad-plovdiv",
    title: { bg: "Фотоволтаична система за склад (примерен проект)", en: "PV system for a warehouse (sample project)" },
    segment: "business",
    location: { bg: "Пловдив", en: "Plovdiv" },
    kwp: 120,
    batteryKwh: 100,
    year: 2025,
    status: { bg: "В експлоатация", en: "Operational" },
    annualSavings: { bg: "≈ 38 000 лв. годишно", en: "≈ €19,400 per year" },
    story: {
      bg: "Хибридна система върху плосък покрив с батерия за покриване на вечерните смени. Примерен запис — замени с реален проект.",
      en: "Hybrid flat-roof system with a battery covering evening shifts. Sample entry — replace with a real project.",
    },
    image: "",
    featured: true,
    sample: true,
  },
  {
    slug: "primer-dom-sofia",
    title: { bg: "Хибридна система за къща (примерен проект)", en: "Hybrid system for a house (sample project)" },
    segment: "home",
    location: { bg: "София", en: "Sofia" },
    kwp: 10,
    batteryKwh: 10,
    year: 2025,
    status: { bg: "В експлоатация", en: "Operational" },
    annualSavings: { bg: "≈ 2 900 лв. годишно", en: "≈ €1,480 per year" },
    story: {
      bg: "Скатен покрив юг, 10 kWp + 10 kWh батерия, зарядна станция за електромобил. Примерен запис — замени с реален проект.",
      en: "South-facing pitched roof, 10 kWp + 10 kWh battery, EV charger. Sample entry — replace with a real project.",
    },
    image: "",
    featured: true,
    sample: true,
  },
  {
    slug: "primer-ferma-dobrich",
    title: { bg: "Централа за земеделско стопанство (примерен проект)", en: "Plant for a farm (sample project)" },
    segment: "agri",
    location: { bg: "Добрич", en: "Dobrich" },
    kwp: 200,
    batteryKwh: null,
    year: 2024,
    status: { bg: "В експлоатация", en: "Operational" },
    annualSavings: { bg: "≈ 61 000 лв. годишно", en: "≈ €31,200 per year" },
    story: {
      bg: "Наземна конструкция върху свободен терен, захранва напоителна система и хладилни складове. Примерен запис — замени с реален проект.",
      en: "Ground-mounted on free terrain, powering irrigation and cold storage. Sample entry — replace with a real project.",
    },
    image: "",
    featured: true,
    sample: true,
  },
];

export const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

export const segmentLabels: Record<Project["segment"], Record<Locale, string>> = {
  home: { bg: "Дом", en: "Home" },
  business: { bg: "Бизнес", en: "Business" },
  industry: { bg: "Индустрия", en: "Industry" },
  agri: { bg: "Земеделие", en: "Agriculture" },
};
