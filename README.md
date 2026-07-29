# NV Power — nvpower.bg

**🇧🇬 [Български](#български) · 🇬🇧 [English](#english)**

Двуезичен маркетингов сайт за **NV Power** — търговия с електроенергия и
фотоволтаични централи с батерии.
Bilingual marketing site for **NV Power** — electricity trading and solar plants
with battery storage.

**„Енергия за утрешния ден" / "Energy for tomorrow"**

---

## Български

Пълен двуезичен сайт (BG основен, EN огледален) с **30 индексируеми страници**: ток на ясна
цена за бизнеса и дома, изкупуване на ток от ВЕИ производители, проектиране и
изграждане на фотоволтаични централи с батерии и гъвкаво финансиране.

### Стек

- **Astro 7** — изцяло статичен изход, целият текст е в началния HTML (SEO)
- **Tailwind CSS v4** — дизайн токени в `src/styles/global.css` (`@theme inline`)
- **React islands** — само за интерактивното (wizard, калкулатор, форми)
- **Montserrat + Inter** (self-hosted чрез Fontsource), **Lucide** икони

### Команди

```bash
npm run dev      # http://localhost:4321
npm run build    # статичен build в dist/
npm run preview
npx astro check  # типова проверка
```

### ⚠️ Преди публикуване — задължително

**1. Бизнес факти.** Всичко е централизирано в **`src/config/site.ts`**, маркирано
с `[PLACEHOLDER]`. Телефонът, ЕИК, ДДС № и КЕВР лицензът са умишлено маскирани
като `XXXXXXX`, за да не бъдат сбъркани с истински. Замени също адрес, екип,
социални профили и GA4 id.

**2. Примерни проекти.** `src/data/projects.ts` — записите са флагнати със
`sample: true`. Замени с реални или изтрий; сайтът показва честно „очаквайте
скоро", ако списъкът е празен.

**3. Форми — единственият реален блокер.** Формите POST-ват
`multipart/form-data` (включително прикачения файл) към `site.formEndpoint`.
**Докато е празен низ, нищо не се изпраща:** посетителят вижда телефон и имейл
като резервен вариант, а в конзолата се логва грешка. Никога не се показва
фалшиво потвърждение — по-добре честен провал, отколкото загубен клиент.

Свържи form service (напр. Formspree) или собствена serverless функция с имейл
до info@nvpower.bg, и попълни `site.formEndpoint`.

> **CSP:** ако endpoint-ът е на **друг домейн**, добави origin-а му към
> `connect-src` и `form-action` — на Vercel това е в **`vercel.json`**.
> Endpoint на **същия домейн** (напр. `/api/lead`) не изисква промяна.

### Хостинг (Vercel)

Статичен build в `dist/`. Деплойва се на **Vercel**, затова `public/_headers` и
`public/_redirects` (Netlify / Cloudflare Pages формат) **не се четат** —
реалните HTTP хедъри и 301 редиректите идват от **`vercel.json`**. Файловете за
Netlify са запазени само за преносимост; **промениш ли едното, промени и другото**.

`vercel.json` съдържа: security хедъри (CSP, HSTS, X-Frame-Options,
Permissions-Policy), кеширане на `/_astro/*`, `trailingSlash: true` и 301
редиректи от старите английски адреси към новите.

### Маршрути и двуезичност

**`src/i18n/routes.ts` е единственият източник на истина.** Българските slug-ове
са каноничните; английските живеят под `/en/` със **свои английски slug-ове**
(`/tok/` → `/en/electricity/`), описани в `EN_SLUGS`.

От тази карта се генерират навигацията, езиковият превключвател, `canonical`,
`hreflang` двойките и sitemap-ът. **Липсващ запис чупи всичките наведнъж** — ако
добавяш страница, добави и slug-а.

### Валута

**Само евро.** България е в еврозоната от януари 2026 г.; цените в лева са
премахнати изцяло. Цената на тока е в `site.price` (€/кВтч), а формулите за
изкупуване са в €/MWh. Не връщай лева.

### Структура

```
src/
├── config/site.ts            # ⚠️ всички бизнес факти ([PLACEHOLDER])
├── i18n/
│   ├── routes.ts             # ⚠️ маршрути + EN slug карта + hreflang помощници
│   └── ui.ts                 # споделени UI низове (re-export на routes)
├── styles/global.css         # дизайн токени + utility класове (btn, card, field…)
├── layouts/BaseLayout.astro  # SEO head, hreflang, JSON-LD, consent, reveals
├── components/               # Header, Footer, CtaBand, BackToTop, CookieConsent…
├── islands/                  # React: OfferWizard, SolarCalculator, форми
├── lib/
│   ├── lead.ts               # изпращане на заявки (FormData + файл)
│   └── useHydrated.ts        # заключва submit до хидратация
├── templates/                # по един шаблон на страница (bg+en копи вътре)
├── pages/                    # тънки route файлове; /en/* е огледало
└── data/projects.ts          # проекти (sample данни за замяна)
```

### Достъпност и тема

- Светлата тема е по подразбиране; тъмната се включва от хедъра и се пази в
  `localStorage`.
- Контрастът покрива **WCAG AA** в двете теми. `--accent` е ярък за текст върху
  тъмно, а `--accent-contrast` дава преден план за всичко **върху** accent
  (бутони). Ползвай токена, не `text-white`.
- Формите имат видими `<label>`, `autocomplete`, и `<noscript>` резервен вариант.
- Бутонът „нагоре" се появява в края на страницата и връща фокуса в хедъра.

### Език и тон

Целият сайт е на приятелско-неформално **„ти"** (никога „Вие"). Английската
версия е **пълно огледало**, не резюме. Обещанието за отговор е **3 работни дни**
и се повтаря навсякъде — сменя се от `site.responseTime`.

---

## English

A complete bilingual site (Bulgarian primary, English mirror) of **30 indexable pages**:
electricity supply at a clear price for business and home, electricity buy-back
from renewable producers, and turnkey solar plants with battery storage and
flexible financing.

### Stack

- **Astro 7** — fully static output; all copy is in the initial HTML (SEO)
- **Tailwind CSS v4** — design tokens in `src/styles/global.css` (`@theme inline`)
- **React islands** — only for the interactive parts (wizard, calculator, forms)
- **Montserrat + Inter** (self-hosted via Fontsource), **Lucide** icons

### Commands

```bash
npm run dev      # http://localhost:4321
npm run build    # static build into dist/
npm run preview
npx astro check  # type check
```

### ⚠️ Before going live — required

**1. Business facts.** All centralised in **`src/config/site.ts`** and marked
`[PLACEHOLDER]`. The phone number, company ID (ЕИК), VAT number and the EWRC
licence are deliberately masked as `XXXXXXX` so invented identifiers can never
be mistaken for real ones. Also replace the address, team, socials and GA4 id.

**2. Sample projects.** `src/data/projects.ts` — entries are flagged
`sample: true`. Replace with real installations or delete them; the site renders
an honest "coming soon" state when the list is empty.

**3. Forms — the one real blocker.** Forms POST `multipart/form-data`
(attachment included) to `site.formEndpoint`. **While it is an empty string
nothing is sent:** the visitor gets the phone/email fallback and the console logs
an error. A false confirmation is never shown — an honest failure beats a lost
lead.

Wire a form service (e.g. Formspree) or your own serverless function that emails
info@nvpower.bg, then set `site.formEndpoint`.

> **CSP:** if the endpoint is on **another domain**, add its origin to
> `connect-src` and `form-action` — on Vercel that lives in **`vercel.json`**.
> A **same-origin** endpoint (e.g. `/api/lead`) needs no change.

### Hosting (Vercel)

Static build in `dist/`. Deployed on **Vercel**, which means `public/_headers`
and `public/_redirects` (Netlify / Cloudflare Pages formats) **are ignored** —
the live HTTP headers and 301s come from **`vercel.json`**. The Netlify files are
kept only for portability; **change one, change the other**.

`vercel.json` holds the security headers (CSP, HSTS, X-Frame-Options,
Permissions-Policy), `/_astro/*` immutable caching, `trailingSlash: true`, and
301s from the old English URLs to the current ones.

### Routing and i18n

**`src/i18n/routes.ts` is the single source of truth.** Bulgarian slugs are
canonical; English pages live under `/en/` with **their own English slugs**
(`/tok/` → `/en/electricity/`), declared in `EN_SLUGS`.

Navigation, the language switcher, `canonical`, the `hreflang` pair and the
sitemap are all derived from that map. **A missing entry breaks all of them at
once** — when you add a page, add its slug too.

### Currency

**Euro only.** Bulgaria joined the euro area in January 2026; lev pricing has
been removed entirely. The electricity price lives in `site.price` (€/kWh) and
the buy-back formulas are in €/MWh. Do not reintroduce the lev.

### Structure

```
src/
├── config/site.ts            # ⚠️ every business fact ([PLACEHOLDER])
├── i18n/
│   ├── routes.ts             # ⚠️ routes + EN slug map + hreflang helpers
│   └── ui.ts                 # shared UI strings (re-exports routes)
├── styles/global.css         # design tokens + utilities (btn, card, field…)
├── layouts/BaseLayout.astro  # SEO head, hreflang, JSON-LD, consent, reveals
├── components/               # Header, Footer, CtaBand, BackToTop, CookieConsent…
├── islands/                  # React: OfferWizard, SolarCalculator, forms
├── lib/
│   ├── lead.ts               # lead submission (FormData + file)
│   └── useHydrated.ts        # gates submit until hydration
├── templates/                # one template per page (bg+en copy inside)
├── pages/                    # thin route files; /en/* mirrors the tree
└── data/projects.ts          # projects (sample data to replace)
```

### Accessibility and theming

- Light theme is the default; dark is toggled from the header and persisted in
  `localStorage`.
- Contrast meets **WCAG AA** in both themes. `--accent` is bright enough for text
  on dark, and `--accent-contrast` supplies the foreground for anything sitting
  **on** accent (buttons). Use the token, not `text-white`.
- Forms have visible `<label>`s, `autocomplete`, and a `<noscript>` fallback.
- The back-to-top control appears near the page end and returns focus to the
  header, not just the viewport.

### Voice

The Bulgarian copy uses the informal **„ти"** throughout, never „Вие". The
English version is a **full mirror**, not a summary. The response promise is
**3 business days**, repeated sitewide — change it in `site.responseTime`.
