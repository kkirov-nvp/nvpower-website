import { useEffect, useMemo, useState } from "react";
import { submitLead } from "../lib/lead";
import { useHydrated } from "../lib/useHydrated";
import NoScriptFallback from "./NoScriptFallback";
import { site, type Locale } from "../config/site";
import { r } from "../i18n/routes";

/* §6.4 — multi-step offer wizard (~60–90 sec). Preserves the original
   questionnaire's expert field logic, rebuilt as a friendly wizard with
   progress bar, branching, GDPR and an explicit success timeline. */

type Answers = Record<string, string | string[]>;

/** Browser autofill hints, keyed by field id. */
const AUTOCOMPLETE: Record<string, string> = {
  name: "name",
  phone: "tel",
  email: "email",
  city: "address-level2",
};

type Step = {
  id: string;
  title: string;
  fields: Field[];
};

type Field =
  | { kind: "choice"; id: string; label?: string; options: string[]; required?: boolean }
  | { kind: "multi"; id: string; label?: string; options: string[] }
  | { kind: "text"; id: string; label: string; type?: string; required?: boolean; placeholder?: string };

const OBLASTI = [
  "Благоевград", "Бургас", "Варна", "Велико Търново", "Видин", "Враца", "Габрово", "Добрич",
  "Кърджали", "Кюстендил", "Ловеч", "Монтана", "Пазарджик", "Перник", "Плевен", "Пловдив",
  "Разград", "Русе", "Силистра", "Сливен", "Смолян", "София-град", "София-област", "Стара Загора",
  "Търговище", "Хасково", "Шумен", "Ямбол",
];

function buildSteps(locale: Locale): { steps: Step[]; strings: Record<string, string> } {
  if (locale === "bg") {
    return {
      strings: {
        heading: "Вземи оферта",
        sub: "7 кратки стъпки · около 90 секунди · без ангажимент",
        next: "Напред",
        back: "Назад",
        submit: "Изпрати запитването",
        sending: "Изпращане…",
        stepOf: "Стъпка",
        of: "от",
        gdpr: "Съгласен съм NV Power да обработи личните ми данни, за да изготви офертата, съгласно политиката за поверителност.",
        gdprRequired: "Отбележи съгласието, за да продължим.",
        requiredField: "Попълни задължителните полета, за да продължиш.",
        successTitle: "Запитването е при нас! 🎉",
        successText: `Ще получиш потвърждение веднага и обаждане от консултант до 1 работен ден (в работно време). Междувременно можеш да разгледаш проектите ни.`,
        successCta: "Виж проектите ни",
        error: "Нещо се обърка при изпращането. Обади ни се директно на " + site.phone + ".",
      },
      steps: [
        {
          id: "object",
          title: "За какъв обект е системата?",
          fields: [
            { kind: "choice", id: "objectType", required: true, options: ["Къща", "Жилищна сграда", "Индустриална сграда", "Склад / логистика", "Земеделски имот", "Свободен терен"] },
          ],
        },
        {
          id: "location",
          title: "Къде се намира обектът?",
          fields: [
            { kind: "text", id: "city", label: "Населено място", required: true, placeholder: "напр. Пловдив" },
            { kind: "choice", id: "oblast", label: "Област", required: true, options: OBLASTI },
          ],
        },
        {
          id: "power",
          title: "Каква е електрическата ти инфраструктура?",
          fields: [
            { kind: "choice", id: "phase", label: "Захранване", required: true, options: ["Монофазно", "Трифазно", "Не съм сигурен"] },
            { kind: "choice", id: "contractedPower", label: "Договорена мощност", options: ["До 15 kW", "15 – 30 kW", "Над 30 kW", "Не знам"] },
            { kind: "choice", id: "consumption", label: "Месечна консумация", required: true, options: ["До 500 кВтч", "500 – 1 000 кВтч", "1 000 – 3 000 кВтч", "3 000 – 5 000 кВтч", "Над 5 000 кВтч"] },
          ],
        },
        {
          id: "goal",
          title: "Каква е целта ти?",
          fields: [
            { kind: "choice", id: "goal", required: true, options: ["По-ниски сметки", "Енергийна независимост", "Продажба на енергия", "Комбинирано", "Електромобилност"] },
            { kind: "choice", id: "battery", label: "Интерес към батерия за съхранение?", required: true, options: ["Да", "Не", "Не съм сигурен"] },
          ],
        },
        {
          id: "system",
          title: "Каква система и какъв монтаж?",
          fields: [
            { kind: "choice", id: "systemType", label: "Тип система", options: ["Мрежова", "Хибридна (с батерия)", "Автономна (off-grid)", "Не съм сигурен"] },
            { kind: "choice", id: "mount", label: "Монтаж", options: ["Скатен покрив", "Плосък покрив", "Конструкция / навес", "На земя"] },
            { kind: "choice", id: "roof", label: "Покривен материал", options: ["Керемиди", "Ламарина / панел", "Битум / мембрана", "Друго / не е покрив"] },
            { kind: "choice", id: "shading", label: "Засенчване на обекта", options: ["Без засенчване", "Частично", "Значително", "Не съм сигурен"] },
          ],
        },
        {
          id: "extras",
          title: "Искаш ли нещо отгоре?",
          fields: [
            { kind: "multi", id: "extras", options: ["Зарядна станция за електромобил", "Smart мониторинг на потреблението", "Финансиране / лизинг", "Изкупуване на произведената енергия"] },
          ],
        },
        {
          id: "contact",
          title: "Как да ти изпратим офертата?",
          fields: [
            { kind: "text", id: "name", label: "Име и фамилия", required: true },
            { kind: "text", id: "phone", label: "Телефон", type: "tel", required: true },
            { kind: "text", id: "email", label: "Имейл", type: "email", required: true },
            { kind: "choice", id: "channel", label: "Предпочитан канал", required: true, options: ["Телефон", "Имейл", "Viber", "WhatsApp"] },
          ],
        },
      ],
    };
  }
  return {
    strings: {
      heading: "Get a quote",
      sub: "7 short steps · about 90 seconds · no commitment",
      next: "Next",
      back: "Back",
      submit: "Send the enquiry",
      sending: "Sending…",
      stepOf: "Step",
      of: "of",
      gdpr: "I agree that NV Power may process my personal data to prepare the quote, per the privacy policy.",
      gdprRequired: "Tick the consent box to continue.",
      requiredField: "Fill in the required fields to continue.",
      successTitle: "Your enquiry is in! 🎉",
      successText: `You'll get an instant confirmation and a call from a consultant within 1 business day (during business hours). Meanwhile, have a look at our projects.`,
      successCta: "See our projects",
      error: "Something went wrong. Please call us directly at " + site.phone + ".",
    },
    steps: [
      { id: "object", title: "What kind of site is the system for?", fields: [{ kind: "choice", id: "objectType", required: true, options: ["House", "Residential building", "Industrial building", "Warehouse / logistics", "Farmland", "Free terrain"] }] },
      {
        id: "location",
        title: "Where is the site?",
        fields: [
          { kind: "text", id: "city", label: "Town / city", required: true, placeholder: "e.g. Plovdiv" },
          { kind: "choice", id: "oblast", label: "District", required: true, options: OBLASTI },
        ],
      },
      {
        id: "power",
        title: "What's your electrical setup?",
        fields: [
          { kind: "choice", id: "phase", label: "Supply", required: true, options: ["Single-phase", "Three-phase", "Not sure"] },
          { kind: "choice", id: "contractedPower", label: "Contracted capacity", options: ["Up to 15 kW", "15 – 30 kW", "Over 30 kW", "I don't know"] },
          { kind: "choice", id: "consumption", label: "Monthly consumption", required: true, options: ["Up to 500 kWh", "500 – 1,000 kWh", "1,000 – 3,000 kWh", "3,000 – 5,000 kWh", "Over 5,000 kWh"] },
        ],
      },
      {
        id: "goal",
        title: "What's your goal?",
        fields: [
          { kind: "choice", id: "goal", required: true, options: ["Lower bills", "Energy independence", "Selling energy", "Combined", "E-mobility"] },
          { kind: "choice", id: "battery", label: "Interested in a storage battery?", required: true, options: ["Yes", "No", "Not sure"] },
        ],
      },
      {
        id: "system",
        title: "What system and mounting?",
        fields: [
          { kind: "choice", id: "systemType", label: "System type", options: ["Grid-tied", "Hybrid (with battery)", "Off-grid", "Not sure"] },
          { kind: "choice", id: "mount", label: "Mounting", options: ["Pitched roof", "Flat roof", "Structure / canopy", "Ground-mounted"] },
          { kind: "choice", id: "roof", label: "Roof material", options: ["Tiles", "Metal sheet / panel", "Bitumen / membrane", "Other / not a roof"] },
          { kind: "choice", id: "shading", label: "Shading at the site", options: ["No shading", "Partial", "Significant", "Not sure"] },
        ],
      },
      { id: "extras", title: "Anything on top?", fields: [{ kind: "multi", id: "extras", options: ["EV charging station", "Smart consumption monitoring", "Financing / leasing", "Buy-back of generated energy"] }] },
      {
        id: "contact",
        title: "Where do we send the quote?",
        fields: [
          { kind: "text", id: "name", label: "Full name", required: true },
          { kind: "text", id: "phone", label: "Phone", type: "tel", required: true },
          { kind: "text", id: "email", label: "Email", type: "email", required: true },
          { kind: "choice", id: "channel", label: "Preferred channel", required: true, options: ["Phone", "Email", "Viber", "WhatsApp"] },
        ],
      },
    ],
  };
}

export default function OfferWizard({ locale }: { locale: Locale }) {
  const hydrated = useHydrated();
  const { steps, strings } = useMemo(() => buildSteps(locale), [locale]);
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [gdpr, setGdpr] = useState(false);
  const [hp, setHp] = useState("");
  const [err, setErr] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "fail">("idle");

  // Pre-fill from /kalkulator (?bill=…&kwp=…&object=…)
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const pre: Answers = {};
    if (p.get("object")) pre.objectType = p.get("object")!;
    if (p.get("kwp")) pre.recommendedKwp = p.get("kwp")!;
    if (p.get("bill")) pre.monthlyBill = p.get("bill")!;
    if (Object.keys(pre).length) setAnswers((a) => ({ ...pre, ...a }));
  }, []);

  const step = steps[stepIdx];
  const isLast = stepIdx === steps.length - 1;
  const progress = ((stepIdx + 1) / steps.length) * 100;

  function set(id: string, value: string | string[]) {
    setAnswers((a) => ({ ...a, [id]: value }));
    setErr("");
  }

  function validate(): boolean {
    for (const f of step.fields) {
      if ("required" in f && f.required) {
        const v = answers[f.id];
        if (!v || (typeof v === "string" && !v.trim())) {
          setErr(strings.requiredField);
          return false;
        }
      }
    }
    if (isLast && !gdpr) {
      setErr(strings.gdprRequired);
      return false;
    }
    return true;
  }

  async function next() {
    if (!validate()) return;
    if (!isLast) {
      setStepIdx((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setState("sending");
    const result = await submitLead("offer-wizard", { ...answers, gdpr }, hp);
    setState(result === "ok" ? "ok" : "fail");
    if (result !== "ok") setErr(strings.error);
  }

  if (state === "ok") {
    return (
      <div className="card mx-auto max-w-2xl p-8 text-center md:p-12">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-accent/10 text-4xl">✓</div>
        <h2 className="mt-5 font-[family-name:var(--font-display)] text-2xl font-bold text-body md:text-3xl">{strings.successTitle}</h2>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted">{strings.successText}</p>
        <a href={r(locale, "proekti")} className="btn btn-primary mt-7">{strings.successCta}</a>
      </div>
    );
  }

  return (
    <div className="card mx-auto max-w-2xl overflow-hidden">
      {/* progress */}
      <div className="bg-band px-6 pt-5 pb-4 md:px-8">
        <div className="flex items-baseline justify-between">
          <p className="font-[family-name:var(--font-display)] text-sm font-bold text-[#4db8c4]">
            {strings.stepOf} {stepIdx + 1} {strings.of} {steps.length}
          </p>
          <p className="text-xs text-white/50">{strings.sub}</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="p-6 md:p-8">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-body md:text-2xl">{step.title}</h2>

        <div className="mt-6 flex flex-col gap-6">
          {step.fields.map((f) => (
            <div key={f.id}>
              {"label" in f && f.label && (
                (() => {
                  const singleControl = f.kind === "text" || (f.kind === "choice" && f.options.length > 8);
                  const content = (
                    <>
                      {f.label}
                      {"required" in f && f.required ? <span className="text-accent"> *</span> : null}
                    </>
                  );
                  return singleControl ? (
                    <label className="mb-2.5 block text-sm font-semibold text-body" htmlFor={f.id}>
                      {content}
                    </label>
                  ) : (
                    <p className="mb-2.5 text-sm font-semibold text-body">{content}</p>
                  );
                })()
              )}

              {f.kind === "choice" && f.options.length > 8 ? (
                <select id={f.id} name={f.id} className="field" value={(answers[f.id] as string) ?? ""} onChange={(e) => set(f.id, e.target.value)} aria-label={f.label ?? step.title}>
                  <option value="" disabled>—</option>
                  {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : f.kind === "choice" ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {f.options.map((o) => {
                    const active = answers[f.id] === o;
                    return (
                      <button
                        key={o}
                        type="button"
                        onClick={() => set(f.id, o)}
                        aria-pressed={active}
                        className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${active ? "border-accent bg-accent text-accent-contrast shadow-md" : "border-line bg-surface-alt text-body hover:border-accent/50"}`}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
              ) : f.kind === "multi" ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {f.options.map((o) => {
                    const arr = (answers[f.id] as string[]) ?? [];
                    const active = arr.includes(o);
                    return (
                      <button
                        key={o}
                        type="button"
                        onClick={() => set(f.id, active ? arr.filter((x) => x !== o) : [...arr, o])}
                        aria-pressed={active}
                        className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${active ? "border-accent bg-accent/10 text-body" : "border-line bg-surface-alt text-body hover:border-accent/50"}`}
                      >
                        <span className={`mr-2 inline-block size-3.5 rounded border align-[-1px] ${active ? "border-accent bg-accent" : "border-line bg-surface"}`} aria-hidden="true" />
                        {o}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <input
                  id={f.id}
                  name={f.id}
                  autoComplete={AUTOCOMPLETE[f.id]}
                  className="field"
                  type={f.type ?? "text"}
                  inputMode={f.type === "tel" ? "tel" : f.type === "email" ? "email" : undefined}
                  placeholder={f.placeholder}
                  value={(answers[f.id] as string) ?? ""}
                  onChange={(e) => set(f.id, e.target.value)}
                  aria-label={f.label}
                  aria-invalid={!!err && f.required && !(answers[f.id] as string)?.trim()}
                />
              )}
            </div>
          ))}

          {isLast && (
            <>
              <input type="text" value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" name="website" />
              <label className="flex items-start gap-3 text-sm text-muted">
                <input type="checkbox" checked={gdpr} onChange={(e) => setGdpr(e.target.checked)} className="mt-0.5 size-4 accent-accent" />
                <span>
                  {strings.gdpr}{" "}
                  <a href={r(locale, "privacy")} className="text-accent underline" target="_blank" rel="noopener noreferrer">
                    {locale === "en" ? "Privacy policy" : "Политика за поверителност"}
                  </a>
                </span>
              </label>
            </>
          )}
        </div>

        {err && <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">{err}</p>}

        <div className="mt-4">
          <NoScriptFallback locale={locale} />
        </div>

        <div className="mt-7 flex items-center justify-between gap-3">
          {stepIdx > 0 ? (
            <button type="button" onClick={() => setStepIdx((i) => i - 1)} className="btn btn-ghost-light !py-3">← {strings.back}</button>
          ) : <span />}
          <button
            type="button"
            onClick={next}
            disabled={state === "sending" || !hydrated}
            className="btn btn-primary !px-8 !py-3 disabled:opacity-60"
          >
            {state === "sending" ? strings.sending : isLast ? strings.submit : strings.next + " →"}
          </button>
        </div>
      </div>
    </div>
  );
}
