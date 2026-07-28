import { useState } from "react";
import { submitLead } from "../lib/lead";
import { useHydrated } from "../lib/useHydrated";
import NoScriptFallback from "./NoScriptFallback";
import type { Locale } from "../config/site";
import { r, type RouteKey } from "../i18n/routes";

/* §7.1 — homepage mini-configurator: 4 branching questions → recommendation
   card + inline mini lead form. Progress dots, „ти" tone. */

type Rec = { title: string; text: string; route: RouteKey; cta: string };

const copy = {
  bg: {
    steps: ["Какво търсиш?", "Разкажи ни повече", "Каква е целта ти?", "Твоята препоръка"],
    q1: "От какво имаш нужда?",
    q1a: [
      { id: "tok", label: "По-евтин ток", hint: "за дома или бизнеса" },
      { id: "solar", label: "Соларна система", hint: "с или без батерия" },
      { id: "both", label: "И двете", hint: "ток днес + централа утре" },
    ],
    q2tok: "Каква е месечната ти сметка за ток?",
    q2tokA: ["До 100 €", "100 – 500 €", "500 – 2 500 €", "Над 2 500 €"],
    q2solar: "За какъв обект е системата?",
    q2solarA: ["Къща / дом", "Бизнес сграда / склад", "Производство / индустрия", "Земеделски имот / терен"],
    q3: "Какво е най-важно за теб?",
    q3a: ["По-ниски сметки", "Енергийна независимост", "Продажба на енергия", "Зарядна за електромобил"],
    back: "Назад",
    recTok: {
      title: "Препоръчваме: смяна на доставчика",
      text: "С цена 0.099 €/кВтч и без скрити такси смяната ще ти спести реални пари — а е безплатна и без прекъсване на тока.",
      route: "tok",
      cta: "Виж плановете за ток",
    },
    recSolarHome: {
      title: "Препоръчваме: хибридна система за дома",
      text: "Соларна централа с батерия покрива дневното и вечерното ти потребление. С гъвкаво финансиране започваш без голяма първоначална инвестиция.",
      route: "solarHome",
      cta: "Соларни системи за дома",
    },
    recSolarBiz: {
      title: "Препоръчваме: соларна централа за бизнеса",
      text: "Системата се изплаща от сметките, които спираш да плащаш. Проектираме, изграждаме и поддържаме — а с лизинг паричният поток остава при теб.",
      route: "solarBiz",
      cta: "Соларни системи за бизнеса",
    },
    recBoth: {
      title: "Препоръчваме: пълния пакет NV Power",
      text: "Купуваш ток на ясна цена днес и изграждаш собствена централа с батерия утре — при един и същ партньор. Точно това правим най-добре.",
      route: "oferta",
      cta: "Вземи комбинирана оферта",
    },
    form: {
      lead: "Остави телефон и ще ти се обадим с конкретни числа:",
      name: "Име",
      phone: "Телефон",
      submit: "Искам да ме потърсите",
      sending: "Изпращане…",
      gdpr: "Съгласен съм NV Power да обработи данните ми, за да отговори на запитването.",
      success: "Готово! Ще ти се обадим в рамките на 1 работен ден.",
      error: "Нещо се обърка. Обади ни се директно.",
      required: "Попълни име и телефон и отбележи съгласието.",
    },
    or: "или",
    fullOffer: "направи си пълна оферта за 2 минути",
  },
  en: {
    steps: ["What do you need?", "Tell us more", "What's your goal?", "Your recommendation"],
    q1: "What do you need?",
    q1a: [
      { id: "tok", label: "Cheaper electricity", hint: "for home or business" },
      { id: "solar", label: "A solar system", hint: "with or without a battery" },
      { id: "both", label: "Both", hint: "power today + a plant tomorrow" },
    ],
    q2tok: "What's your monthly electricity bill?",
    q2tokA: ["Up to €100", "€100 – €500", "€500 – €2,500", "Over €2,500"],
    q2solar: "What kind of site is the system for?",
    q2solarA: ["House / home", "Business building / warehouse", "Manufacturing / industry", "Farmland / free terrain"],
    q3: "What matters most to you?",
    q3a: ["Lower bills", "Energy independence", "Selling energy", "An EV charger"],
    back: "Back",
    recTok: {
      title: "We recommend: switching supplier",
      text: "At €0.099/kWh with no hidden fees, switching saves you real money — and it's free, with no power interruption.",
      route: "tok",
      cta: "See electricity plans",
    },
    recSolarHome: {
      title: "We recommend: a hybrid home system",
      text: "A solar plant with a battery covers your day and evening consumption. With flexible financing you start without a big upfront investment.",
      route: "solarHome",
      cta: "Solar for your home",
    },
    recSolarBiz: {
      title: "We recommend: a solar plant for your business",
      text: "The system pays for itself from the bills you stop paying. We design, build and maintain it — and with leasing your cash flow stays with you.",
      route: "solarBiz",
      cta: "Solar for your business",
    },
    recBoth: {
      title: "We recommend: the full NV Power package",
      text: "Buy electricity at a clear price today and build your own plant with a battery tomorrow — with the same partner. That's exactly what we do best.",
      route: "oferta",
      cta: "Get a combined quote",
    },
    form: {
      lead: "Leave a phone number and we'll call you with real numbers:",
      name: "Name",
      phone: "Phone",
      submit: "Call me back",
      sending: "Sending…",
      gdpr: "I agree that NV Power may process my data to answer this enquiry.",
      success: "Done! We'll call you within 1 business day.",
      error: "Something went wrong. Please call us directly.",
      required: "Fill in name and phone and tick the consent box.",
    },
    or: "or",
    fullOffer: "build a full quote in 2 minutes",
  },
} as const;

export default function MiniConfigurator({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const hydrated = useHydrated();
  const [step, setStep] = useState(0);
  const [need, setNeed] = useState<"tok" | "solar" | "both" | null>(null);
  const [size, setSize] = useState<number | null>(null);
  const [goal, setGoal] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gdpr, setGdpr] = useState(false);
  const [hp, setHp] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");

  const rec: Rec =
    need === "tok" ? t.recTok
    : need === "both" ? t.recBoth
    : size === 0 ? t.recSolarHome
    : t.recSolarBiz;

  const q2 = need === "tok" ? { q: t.q2tok, a: t.q2tokA } : { q: t.q2solar, a: t.q2solarA };

  async function send() {
    if (!name.trim() || !phone.trim() || !gdpr) {
      setState("err");
      return;
    }
    setState("sending");
    const result = await submitLead(
      "mini-configurator",
      { name, phone, need, size: size !== null ? q2.a[size] : null, goal: goal !== null ? t.q3a[goal] : null, gdpr },
      hp,
    );
    setState(result === "ok" ? "ok" : "err");
  }

  const Option = ({ label, hint, onClick }: { label: string; hint?: string; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className="card group flex w-full flex-col items-start gap-0.5 px-5 py-4 text-left transition-all hover:-translate-y-0.5 hover:border-accent"
    >
      <span className="font-[family-name:var(--font-display)] font-bold text-body group-hover:text-accent">{label}</span>
      {hint && <span className="text-sm text-muted">{hint}</span>}
    </button>
  );

  return (
    <div className="card mx-auto max-w-2xl p-6 md:p-8">
      {/* progress dots */}
      <div className="mb-6 flex items-center justify-center gap-2" aria-hidden="true">
        {t.steps.map((_, i) => (
          <span
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${i === step ? "w-8 bg-accent" : i < step ? "w-2 bg-accent/50" : "w-2 bg-line"}`}
          />
        ))}
      </div>
      <p className="mb-5 text-center font-[family-name:var(--font-display)] text-sm font-bold tracking-wide text-accent uppercase">
        {t.steps[step]}
      </p>

      {step === 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="mb-1 text-center text-xl font-bold text-body">{t.q1}</h3>
          {t.q1a.map((o) => (
            <Option key={o.id} label={o.label} hint={o.hint} onClick={() => { setNeed(o.id as typeof need); setStep(o.id === "both" ? 2 : 1); }} />
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-3">
          <h3 className="mb-1 text-center text-xl font-bold text-body">{q2.q}</h3>
          {q2.a.map((label, i) => (
            <Option key={label} label={label} onClick={() => { setSize(i); setStep(2); }} />
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-3">
          <h3 className="mb-1 text-center text-xl font-bold text-body">{t.q3}</h3>
          {t.q3a.map((label, i) => (
            <Option key={label} label={label} onClick={() => { setGoal(i); setStep(3); }} />
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="text-center">
          <h3 className="text-2xl font-bold text-body">{rec.title}</h3>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted">{rec.text}</p>
          <a href={r(locale, rec.route)} className="btn btn-primary mt-5">{rec.cta}</a>

          {state === "ok" ? (
            <p className="mt-6 rounded-xl bg-accent/10 px-4 py-3 text-sm font-medium text-accent">{t.form.success}</p>
          ) : (
            <div className="mt-7 border-t border-line pt-6 text-left">
              <p className="mb-3 text-sm text-muted">{t.form.lead}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-xs font-semibold text-body" htmlFor="mc-name">
                  {t.form.name}
                  <input
                    id="mc-name"
                    name="name"
                    autoComplete="name"
                    aria-required="true"
                    className="field font-normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-body" htmlFor="mc-phone">
                  {t.form.phone}
                  <input
                    id="mc-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    aria-required="true"
                    className="field font-normal"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </label>
              </div>
              {/* honeypot */}
              <input type="text" value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" name="website" />
              <label className="mt-3 flex items-start gap-2.5 text-xs text-muted">
                <input type="checkbox" checked={gdpr} onChange={(e) => setGdpr(e.target.checked)} className="mt-0.5 size-4 accent-accent" />
                {t.form.gdpr}
              </label>
              {state === "err" && (
                <p className="mt-2 text-xs font-medium text-red-600">
                  {!name.trim() || !phone.trim() || !gdpr ? t.form.required : t.form.error}
                </p>
              )}
              <NoScriptFallback locale={locale} />
              <button
                type="button"
                onClick={send}
                disabled={state === "sending" || !hydrated}
                className="btn btn-primary mt-4 w-full disabled:opacity-60"
              >
                {state === "sending" ? t.form.sending : t.form.submit}
              </button>
              <p className="mt-3 text-center text-xs text-muted">
                {t.or}{" "}
                <a href={r(locale, "oferta")} className="text-accent underline">{t.fullOffer}</a>
              </p>
            </div>
          )}
        </div>
      )}

      {step > 0 && step < 3 && (
        <button type="button" onClick={() => setStep(need === "both" && step === 2 ? 0 : step - 1)} className="mt-5 text-sm text-muted underline hover:text-body">
          ← {t.back}
        </button>
      )}
    </div>
  );
}
