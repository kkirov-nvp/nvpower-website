# NV Power — nvpower.bg

Пълен, двуезичен (BG основен / EN огледален) маркетингов сайт за **NV Power** —
ток на ясна цена (0.099 €/кВтч / 0.194 лв./кВтч) + проектиране и изграждане на
фотоволтаични централи с батерии и гъвкаво финансиране.

**„Енергия за утрешния ден" / "Energy for tomorrow"**

## Стек

- **Astro 7** — изцяло статичен изход, целият текст е в началния HTML (SEO)
- **Tailwind CSS v4** — дизайн токени в `src/styles/global.css` (`@theme`)
- **React islands** — само за интерактивните компоненти (wizard, калкулатор, форми)
- **Montserrat + Inter** (self-hosted чрез Fontsource), **Lucide** икони

## Преди публикуване — задължително!

Всички бизнес факти са централизирани в **`src/config/site.ts`** и са маркирани
с `[PLACEHOLDER]`. Замени: телефон, адрес, ЕИК/ДДС, КЕВР лиценз №, статистики,
екип, социални профили, form endpoint, GA4 id. Примерните проекти са в
`src/data/projects.ts` — замени ги с реални (флагнати са със `sample: true`).

**Тема:** светлата (бяла) тема е по подразбиране; тъмната се включва от
превключвателя в хедъра и се пази в `localStorage`.

### Форми — задължително преди launch

Формите POST-ват `multipart/form-data` (включително прикачения файл) към
`site.formEndpoint`. **Докато е празен низ, нищо не се изпраща:** посетителят
вижда телефон и имейл като резервен вариант, а в конзолата се логва грешка.
Никога не се показва фалшиво потвърждение.

Свържи form service (напр. Formspree) или собствена serverless функция, която
праща имейл до info@nvpower.bg, и попълни `site.formEndpoint`.

Ако endpoint-ът е на **друг домейн**, добави origin-а му към `connect-src` и
`form-action` в CSP — на Vercel това е в **`vercel.json`** (и за пренос-
имост, същото в `public/_headers`). Иначе CSP ще блокира заявката. Endpoint на
**същия домейн** (напр. `/api/lead`) не изисква промяна в CSP.

## Хостинг (Vercel)

Сайтът е статичен build в `dist/`. Деплойва се на **Vercel**, затова
`public/_headers` и `public/_redirects` (Netlify / Cloudflare Pages формат)
**не се четат** — реалните HTTP хедъри и 301 редиректите идват от
**`vercel.json`**. Ако промениш едното, промени и другото.

`vercel.json` съдържа: security хедъри (CSP, HSTS, X-Frame-Options…),
кеширане на `/_astro/*`, `trailingSlash: true` и 301 редиректи от старите
английски адреси към новите.

## Команди

```bash
npm run dev      # http://localhost:4321
npm run build    # статичен build в dist/
npm run preview
```

## Структура

```
src/
├── config/site.ts        # ⚠️ всички бизнес факти ([PLACEHOLDER])
├── i18n/ui.ts             # споделени UI низове + маршрути + hreflang помощници
├── styles/global.css      # дизайн токени + utility класове (btn, card, section…)
├── layouts/BaseLayout.astro  # SEO head, hreflang, JSON-LD, consent, reveals
├── components/            # Header, Footer, CtaBand, StatsBand, FaqAccordion…
├── islands/               # React: OfferWizard, SolarCalculator, MiniConfigurator, форми
├── templates/             # по един шаблон на страница (bg+en копи вътре)
├── pages/                 # тънки route файлове; /en/* е огледало
└── data/                  # проекти (sample данни за замяна)
```

## Език и тон

Целият сайт е на приятелско-неформално **„ти"** (никога „Вие"). Английската
версия е пълно огледало — не резюме.
