import { useEffect, useMemo, useRef, useState } from "react";
import { Sun, Zap, PiggyBank, CalendarClock, Leaf, TreePine, Car, ArrowRight } from "lucide-react";
import type { Locale } from "../config/site";
import { site, kwhPriceBGN } from "../config/site";
import { r } from "../i18n/routes";

/* /kalkulator — client-side solar savings calculator with fully transparent
   assumptions (expandable footnote). No contact data needed; the CTA hands
   the numbers to the offer wizard via query params. */

/* ---------- transparent assumptions (also rendered in the footnote) ---------- */
const EUR = site.eurRate;
const PRICE_BGN = kwhPriceBGN; // лв./кВтч from the central config
const YIELD_KWH_PER_KWP = 1150; // annual yield per kWp in Bulgaria
const M2_PER_KWP = 5; // roof area needed per kWp
const SELF_USE = { home: 0.7, business: 0.8, industry: 0.8 } as const; // share of production used on site
const COST_BGN_PER_KWP = { home: 1900, business: 1500, industry: 1500 } as const; // indicative turnkey cost
const CO2_KG_PER_KWH = 0.4;
const TREE_KG_PER_YEAR = 21; // one tree absorbs ~21 kg CO₂/year
const SOFIA_RING_KM = 61; // one lap of the Sofia ring road
const CAR_KG_PER_KM = 0.12; // petrol car ~120 g CO₂/km
const KG_PER_LAP = SOFIA_RING_KM * CAR_KG_PER_KM;

type ObjectType = keyof typeof SELF_USE;
type Mode = "bill" | "kwh";
type Currency = "bgn" | "eur";

const copy = {
  bg: {
    inputsTitle: "Твоите данни",
    modeBill: "Знам месечната си сметка",
    modeKwh: "Знам консумацията в кВтч",
    bill: "Месечна сметка за ток",
    kwh: "Месечна консумация",
    kwhUnit: "кВтч",
    object: "Тип обект",
    objects: { home: "Дом", business: "Бизнес", industry: "Индустрия" },
    area: "Покривна площ в m² (по избор)",
    areaHint: "Ако я знаеш, ще съобразим системата с покрива ти.",
    resultsTitle: "Твоята система, на един поглед",
    empty: "Въведи сметка или консумация и ще изчислим системата ти на момента — без данни за контакт.",
    kwpLabel: "Препоръчана система",
    productionLabel: "Годишно производство",
    savingsLabel: "Годишна икономия",
    paybackLabel: "Срок на откупуване",
    paybackUnit: "години",
    co2Label: "Спестен CO₂ годишно",
    co2Unit: "тона",
    treesPrefix: "колкото",
    treesSuffix: "засадени дървета",
    lapsPrefix: "или",
    lapsSuffix: "обиколки на София с бензинов автомобил по-малко",
    areaCapNote: "Ограничихме системата според посочената покривна площ.",
    cta: "Вземи точна оферта",
    ctaNote: "Оферта за 2 минути · Без ангажимент · Без депозити",
    assumptionsTitle: "Как смятаме? Всички допускания — открито",
    assumptions: [
      `Цена на тока: ${PRICE_BGN.toFixed(3)} лв./кВтч (${(PRICE_BGN / EUR).toFixed(3)} €/кВтч) — публичната ни цена.`,
      `1 kWp фотоволтаици произвежда ~${YIELD_KWH_PER_KWP} кВтч годишно в България.`,
      `1 kWp изисква ~${M2_PER_KWP} m² покривна площ.`,
      "Собствено потребление: 70% за дом (с батерия) и 80% за бизнес/индустрия — останалото се изкупува или губи и не го броим за икономия.",
      "Ориентировъчна цена на система: ~1900 лв./kWp за дом и ~1500 лв./kWp за бизнес — до ключ, преди финансиране.",
      `CO₂: ${CO2_KG_PER_KWH} кг спестен CO₂ на произведен кВтч; 1 дърво поглъща ~${TREE_KG_PER_YEAR} кг CO₂/год; 1 обиколка на околовръстното на София е ~${SOFIA_RING_KM} км при ~120 г CO₂/км за бензинов автомобил.`,
      "Числата са ориентировъчни — точните зависят от покрива, засенчването и профила на потребление. Затова финалната оферта я прави инженер, не калкулатор.",
    ],
    perMonth: "на месец",
  },
  en: {
    inputsTitle: "Your details",
    modeBill: "I know my monthly bill",
    modeKwh: "I know my kWh consumption",
    bill: "Monthly electricity bill",
    kwh: "Monthly consumption",
    kwhUnit: "kWh",
    object: "Site type",
    objects: { home: "Home", business: "Business", industry: "Industry" },
    area: "Roof area in m² (optional)",
    areaHint: "If you know it, we'll size the system to your roof.",
    resultsTitle: "Your system at a glance",
    empty: "Enter a bill or consumption and we'll size your system instantly — no contact details needed.",
    kwpLabel: "Recommended system",
    productionLabel: "Annual production",
    savingsLabel: "Annual savings",
    paybackLabel: "Payback period",
    paybackUnit: "years",
    co2Label: "CO₂ saved per year",
    co2Unit: "tonnes",
    treesPrefix: "like",
    treesSuffix: "planted trees",
    lapsPrefix: "or",
    lapsSuffix: "fewer laps around Sofia in a petrol car",
    areaCapNote: "We capped the system to the roof area you entered.",
    cta: "Get an exact quote",
    ctaNote: "A quote in 2 minutes · No commitment · No deposits",
    assumptionsTitle: "How do we calculate? All assumptions, in the open",
    assumptions: [
      `Electricity price: ${PRICE_BGN.toFixed(3)} BGN/kWh (€${(PRICE_BGN / EUR).toFixed(3)}/kWh) — our published price.`,
      `1 kWp of photovoltaics produces ~${YIELD_KWH_PER_KWP} kWh per year in Bulgaria.`,
      `1 kWp needs ~${M2_PER_KWP} m² of roof area.`,
      "Self-consumption: 70% for a home (with battery) and 80% for business/industry — the rest is sold back or lost, and we don't count it as savings.",
      "Indicative system cost: ~1,900 BGN/kWp for homes and ~1,500 BGN/kWp for business — turnkey, before financing.",
      `CO₂: ${CO2_KG_PER_KWH} kg of CO₂ saved per kWh produced; 1 tree absorbs ~${TREE_KG_PER_YEAR} kg CO₂/year; 1 lap of the Sofia ring road is ~${SOFIA_RING_KM} km at ~120 g CO₂/km for a petrol car.`,
      "These numbers are indicative — the exact ones depend on your roof, shading and consumption profile. That's why the final quote comes from an engineer, not a calculator.",
    ],
    perMonth: "per month",
  },
} as const;

/* ---------- animated number ---------- */
function useCountUp(target: number, decimals = 0): string {
  const [val, setVal] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef(0);

  useEffect(() => {
    const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVal(target);
      fromRef.current = target;
      return;
    }
    const from = fromRef.current;
    const start = performance.now();
    const dur = 550;
    cancelAnimationFrame(rafRef.current);
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(from + (target - from) * eased);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
      else fromRef.current = target;
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target]);

  return val.toLocaleString("bg-BG", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export default function SolarCalculator({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [mode, setMode] = useState<Mode>("bill");
  const [currency, setCurrency] = useState<Currency>("bgn");
  const [bill, setBill] = useState("");
  const [kwh, setKwh] = useState("");
  const [objectType, setObjectType] = useState<ObjectType>("home");
  const [area, setArea] = useState("");

  const res = useMemo(() => {
    const billNum = parseFloat(bill.replace(",", "."));
    const kwhNum = parseFloat(kwh.replace(",", "."));
    const areaNum = parseFloat(area.replace(",", "."));

    const billBGN = mode === "bill" ? (currency === "eur" ? billNum * EUR : billNum) : NaN;
    const monthlyKwh = mode === "bill" ? billBGN / PRICE_BGN : kwhNum;
    if (!Number.isFinite(monthlyKwh) || monthlyKwh <= 0) return null;

    const annualKwh = monthlyKwh * 12;
    let kwp = annualKwh / YIELD_KWH_PER_KWP;
    let capped = false;
    if (Number.isFinite(areaNum) && areaNum > 0 && areaNum / M2_PER_KWP < kwp) {
      kwp = areaNum / M2_PER_KWP;
      capped = true;
    }
    kwp = Math.max(0.5, Math.round(kwp * 2) / 2); // round to 0.5, sensible minimum

    const production = kwp * YIELD_KWH_PER_KWP;
    const useful = Math.min(production * SELF_USE[objectType], annualKwh);
    const savingsBGN = useful * PRICE_BGN;
    const costBGN = kwp * COST_BGN_PER_KWP[objectType];
    const payback = savingsBGN > 0 ? costBGN / savingsBGN : 0;

    const co2Kg = production * CO2_KG_PER_KWH;
    const monthlyBillBGN = mode === "bill" ? billBGN : monthlyKwh * PRICE_BGN;

    return {
      kwp,
      capped,
      production: Math.round(production),
      savingsBGN: Math.round(savingsBGN),
      savingsEUR: Math.round(savingsBGN / EUR),
      payback: Math.round(payback * 10) / 10,
      co2Tons: Math.round((co2Kg / 1000) * 10) / 10,
      trees: Math.max(1, Math.round(co2Kg / TREE_KG_PER_YEAR)),
      laps: Math.max(1, Math.round(co2Kg / KG_PER_LAP)),
      monthlyBillBGN: Math.round(monthlyBillBGN),
    };
  }, [mode, currency, bill, kwh, objectType, area]);

  const aKwp = useCountUp(res?.kwp ?? 0, 1);
  const aProduction = useCountUp(res?.production ?? 0);
  const aSavingsBGN = useCountUp(res?.savingsBGN ?? 0);
  const aSavingsEUR = useCountUp(res?.savingsEUR ?? 0);
  const aPayback = useCountUp(res?.payback ?? 0, 1);
  const aCo2 = useCountUp(res?.co2Tons ?? 0, 1);

  const objectSlugs: Record<ObjectType, string> = { home: "dom", business: "biznes", industry: "industria" };
  const offerBase = r(locale, "oferta");
  const offerHref = res
    ? `${offerBase}?bill=${res.monthlyBillBGN}&object=${objectSlugs[objectType]}&kwp=${res.kwp}`
    : offerBase;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      {/* ------- inputs ------- */}
      <div className="card p-6 md:p-8">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-body">{t.inputsTitle}</h2>

        {/* mode tabs */}
        <div className="mt-5 grid grid-cols-2 gap-2" role="group" aria-label={t.inputsTitle}>
          {([["bill", t.modeBill], ["kwh", t.modeKwh]] as const).map(([m, label]) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all ${mode === m ? "border-accent bg-accent text-white shadow-md" : "border-line bg-surface-alt text-body hover:border-accent/50"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-5">
          {mode === "bill" ? (
            <label className="grid gap-1.5 text-sm font-semibold text-body" htmlFor="calc-bill">
              {t.bill}
              <span className="flex gap-2">
                <input
                  id="calc-bill"
                  className="field"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="10"
                  placeholder={currency === "bgn" ? "напр. 250" : "e.g. 130"}
                  value={bill}
                  onChange={(e) => setBill(e.target.value)}
                />
                <span className="inline-flex overflow-hidden rounded-xl border border-line" role="group" aria-label="лв. / €">
                  {([["bgn", "лв."], ["eur", "€"]] as const).map(([cur, label]) => (
                    <button
                      key={cur}
                      type="button"
                      onClick={() => setCurrency(cur)}
                      aria-pressed={currency === cur}
                      className={`px-3.5 text-sm font-bold transition-colors ${currency === cur ? "bg-accent text-white" : "bg-surface-alt text-muted hover:text-body"}`}
                    >
                      {label}
                    </button>
                  ))}
                </span>
              </span>
              {bill && Number.isFinite(parseFloat(bill)) && parseFloat(bill) > 0 && (
                <span className="text-xs font-normal text-muted">
                  ≈{" "}
                  {currency === "bgn"
                    ? `${(parseFloat(bill.replace(",", ".")) / EUR).toFixed(2)} € ${t.perMonth}`
                    : `${(parseFloat(bill.replace(",", ".")) * EUR).toFixed(2)} лв. ${t.perMonth}`}
                </span>
              )}
            </label>
          ) : (
            <label className="grid gap-1.5 text-sm font-semibold text-body" htmlFor="calc-kwh">
              {t.kwh}
              <span className="flex items-center gap-2">
                <input
                  id="calc-kwh"
                  className="field"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="50"
                  placeholder="напр. 1200"
                  value={kwh}
                  onChange={(e) => setKwh(e.target.value)}
                />
                <span className="text-sm font-bold text-muted">{t.kwhUnit}</span>
              </span>
            </label>
          )}

          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-body">{t.object}</legend>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(t.objects) as ObjectType[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setObjectType(k)}
                  aria-pressed={objectType === k}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all ${objectType === k ? "border-accent bg-accent text-white shadow-md" : "border-line bg-surface-alt text-body hover:border-accent/50"}`}
                >
                  {t.objects[k]}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="grid gap-1.5 text-sm font-semibold text-body" htmlFor="calc-area">
            {t.area}
            <input
              id="calc-area"
              className="field"
              type="number"
              inputMode="decimal"
              min="0"
              step="5"
              placeholder="напр. 60"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
            <span className="text-xs font-normal text-muted">{t.areaHint}</span>
          </label>
        </div>
      </div>

      {/* ------- results ------- */}
      <div className="card flex flex-col overflow-hidden" aria-live="polite">
        <div className="bg-band px-6 py-5 md:px-8">
          <h2 className="flex items-center gap-2.5 font-[family-name:var(--font-display)] text-xl font-bold text-white">
            <Sun className="size-5 text-accent" aria-hidden="true" />
            {t.resultsTitle}
          </h2>
        </div>

        {!res ? (
          <div className="flex flex-1 items-center justify-center p-8 md:p-10">
            <p className="max-w-sm text-center text-muted">{t.empty}</p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-5 p-6 md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-accent/10 p-4">
                <p className="flex items-center gap-2 text-xs font-bold tracking-wide text-accent uppercase">
                  <Zap className="size-3.5" aria-hidden="true" />
                  {t.kwpLabel}
                </p>
                <p className="mt-1.5 font-[family-name:var(--font-display)] text-3xl font-bold text-accent">
                  {aKwp} <span className="text-base font-bold">kWp</span>
                </p>
              </div>
              <div className="rounded-xl bg-surface-alt p-4">
                <p className="flex items-center gap-2 text-xs font-bold tracking-wide text-muted uppercase">
                  <Sun className="size-3.5" aria-hidden="true" />
                  {t.productionLabel}
                </p>
                <p className="mt-1.5 font-[family-name:var(--font-display)] text-3xl font-bold text-body">
                  {aProduction} <span className="text-base font-bold">{t.kwhUnit}</span>
                </p>
              </div>
              <div className="rounded-xl bg-accent/10 p-4">
                <p className="flex items-center gap-2 text-xs font-bold tracking-wide text-accent uppercase">
                  <PiggyBank className="size-3.5" aria-hidden="true" />
                  {t.savingsLabel}
                </p>
                <p className="mt-1.5 font-[family-name:var(--font-display)] text-3xl font-bold text-accent">
                  {aSavingsBGN} <span className="text-base font-bold">лв.</span>
                </p>
                <p className="text-sm font-semibold text-muted">≈ {aSavingsEUR} €</p>
              </div>
              <div className="rounded-xl bg-surface-alt p-4">
                <p className="flex items-center gap-2 text-xs font-bold tracking-wide text-muted uppercase">
                  <CalendarClock className="size-3.5" aria-hidden="true" />
                  {t.paybackLabel}
                </p>
                <p className="mt-1.5 font-[family-name:var(--font-display)] text-3xl font-bold text-body">
                  {aPayback} <span className="text-base font-bold">{t.paybackUnit}</span>
                </p>
              </div>
            </div>

            {res.capped && <p className="rounded-xl bg-accent/10 px-4 py-2.5 text-sm font-medium text-accent">{t.areaCapNote}</p>}

            <div className="rounded-xl border border-accent/25 bg-accent/10 p-4">
              <p className="flex items-center gap-2 text-xs font-bold tracking-wide text-accent uppercase">
                <Leaf className="size-3.5" aria-hidden="true" />
                {t.co2Label}
              </p>
              <p className="mt-1.5 font-[family-name:var(--font-display)] text-2xl font-bold text-body">
                {aCo2} <span className="text-base font-bold">{t.co2Unit}</span>
              </p>
              <ul className="mt-2.5 flex flex-col gap-1.5 text-sm text-muted">
                <li className="flex items-center gap-2">
                  <TreePine className="size-4 shrink-0 text-accent" aria-hidden="true" />
                  {t.treesPrefix} <strong className="text-body">{res.trees.toLocaleString("bg-BG")}</strong> {t.treesSuffix}
                </li>
                <li className="flex items-center gap-2">
                  <Car className="size-4 shrink-0 text-accent" aria-hidden="true" />
                  {t.lapsPrefix} <strong className="text-body">{res.laps.toLocaleString("bg-BG")}</strong> {t.lapsSuffix}
                </li>
              </ul>
            </div>

            <div className="mt-auto flex flex-col items-center gap-2 pt-1">
              <a href={offerHref} className="btn btn-primary w-full !py-4 text-base sm:w-auto sm:!px-10">
                {t.cta}
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
              <p className="text-xs text-muted">{t.ctaNote}</p>
            </div>
          </div>
        )}
      </div>

      {/* ------- assumptions footnote ------- */}
      <details className="faq-item card group px-5 py-4 md:px-6 lg:col-span-2">
        <summary className="flex items-center justify-between gap-4 font-[family-name:var(--font-display)] text-sm font-bold text-body transition-colors hover:text-accent">
          {t.assumptionsTitle}
          <svg viewBox="0 0 24 24" className="chev size-5 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </summary>
        <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-muted">
          {t.assumptions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}
