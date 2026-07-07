import type { Locale } from "../config/site";
import { site } from "../config/site";

/** Route map — BG slugs are canonical; EN mirrors under /en/ (§5). */
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

/** Localize an internal path: bg → as-is, en → /en prefix. */
export function href(locale: Locale, path: string): string {
  return locale === "en" ? `/en${path}` : path;
}

export function r(locale: Locale, key: RouteKey): string {
  return href(locale, routes[key]);
}

/** Given the BG-canonical path of the current page, produce hreflang pairs. */
export function alternates(path: string) {
  return { bg: path, en: `/en${path}` };
}

/* ------------------------------------------------------------------ */


export const ui = {
  bg: {
    nav: {
      tok: "Ток",
      solar: "Соларни системи",
      proekti: "Проекти",
      info: "Инфо",
      kontakti: "Контакти",
      oferta: "Вземи оферта",
    },
    a11y: {
      skip: "Към съдържанието",
      openMenu: "Отвори менюто",
      closeMenu: "Затвори менюто",
      primaryNav: "Основна навигация",
      footerNav: "Навигация в долната част",
      langSwitch: "Switch to English",
      call: "Обади се",
    },
    promises: {
      response: `Отговор до 1 работен ден`,
      noFees: "Без скрити такси",
      offer2min: "Оферта за 2 минути",
      noDeposit: "Без депозити",
      financing: "Възможност за финансиране",
    },
    cta: {
      title: "Готов за енергийна независимост?",
      text: `Вземи оферта за 2 минути или ни се обади — отговаряме до 1 работен ден.`,
      primary: "Вземи оферта",
      call: "Обади се",
    },
    footer: {
      oneLiner:
        "Ток на ясна цена и соларни централи с батерии — от един партньор, който мисли за твоята дългосрочна независимост.",
      services: "Услуги",
      company: "Компания",
      information: "Информация",
      legal: "Правни",
      contact: "Контакти",
      links: {
        tok: "Ток за бизнеса и дома",
        solar: "Соларни системи и батерии",
        solarHome: "Соларна система за дома",
        solarBiz: "Соларна система за бизнеса",
        kalkulator: "Соларен калкулатор",
        oferta: "Вземи оферта",
        zaNas: "За нас",
        proekti: "Проекти",
        kontakti: "Контакти",
        info: "Информационен център",
        privacy: "Политика за поверителност",
        terms: "Общи условия",
        aiInfo: "Информация за AI системи",
      },
      rights: "Всички права запазени.",
    },
    consent: {
      title: "Използваме бисквитки",
      text: "Използваме бисквитки за анализ на трафика и подобряване на сайта. Можеш да приемеш всички или да избереш кои.",
      acceptAll: "Приемам всички",
      rejectAll: "Само необходимите",
      settings: "Настройки",
      save: "Запази избора",
      necessary: "Необходими",
      necessaryText: "Задължителни за работата на сайта. Винаги активни.",
      analytics: "Аналитични",
      analyticsText: "Помагат ни да разберем как се използва сайтът (Google Analytics).",
      privacyLink: "Политика за поверителност",
    },
    misc: {
      readMore: "Прочети още",
      seeAll: "Виж всички",
      backTo: "Обратно към",
      updated: "Последна актуализация",
      licensedTrader: "Лицензиран търговец на електроенергия",
    },
  },
  en: {
    nav: {
      tok: "Electricity",
      solar: "Solar systems",
      proekti: "Projects",
      info: "Info",
      kontakti: "Contact",
      oferta: "Get a quote",
    },
    a11y: {
      skip: "Skip to content",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      primaryNav: "Primary navigation",
      footerNav: "Footer navigation",
      langSwitch: "Превключи на български",
      call: "Call us",
    },
    promises: {
      response: `Reply within 1 business day`,
      noFees: "No hidden fees",
      offer2min: "A quote in 2 minutes",
      noDeposit: "No deposits",
      financing: "Financing available",
    },
    cta: {
      title: "Ready for energy independence?",
      text: `Get a quote in 2 minutes or give us a call — we reply within 1 business day.`,
      primary: "Get a quote",
      call: "Call us",
    },
    footer: {
      oneLiner:
        "Electricity at a clear price and solar plants with batteries — from one partner focused on your long-term independence.",
      services: "Services",
      company: "Company",
      information: "Information",
      legal: "Legal",
      contact: "Contact",
      links: {
        tok: "Electricity for business & home",
        solar: "Solar systems & batteries",
        solarHome: "Solar for your home",
        solarBiz: "Solar for your business",
        kalkulator: "Solar calculator",
        oferta: "Get a quote",
        zaNas: "About us",
        proekti: "Projects",
        kontakti: "Contact",
        info: "Info centre",
        privacy: "Privacy policy",
        terms: "Terms & conditions",
        aiInfo: "Information for AI systems",
      },
      rights: "All rights reserved.",
    },
    consent: {
      title: "We use cookies",
      text: "We use cookies to analyse traffic and improve the site. Accept all or choose which ones.",
      acceptAll: "Accept all",
      rejectAll: "Essential only",
      settings: "Settings",
      save: "Save choices",
      necessary: "Necessary",
      necessaryText: "Required for the site to work. Always active.",
      analytics: "Analytics",
      analyticsText: "Help us understand how the site is used (Google Analytics).",
      privacyLink: "Privacy policy",
    },
    misc: {
      readMore: "Read more",
      seeAll: "See all",
      backTo: "Back to",
      updated: "Last updated",
      licensedTrader: "Licensed electricity trader",
    },
  },
} as const;

export type UIDict = (typeof ui)["bg"];

export function useUI(locale: Locale): UIDict {
  // EN literals differ from BG literals; both share the exact same shape.
  return ui[locale] as UIDict;
}
