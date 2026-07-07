import { useState } from "react";
import { submitLead } from "../lib/lead";
import type { Locale } from "../config/site";
import { site } from "../config/site";

/* §6.10 contact form — interest dropdown + monthly-bill bracket (silent lead
   scoring), optional file, GDPR, honeypot. */

const copy = {
  bg: {
    name: "Име и фамилия *",
    company: "Фирма (по избор)",
    email: "Имейл *",
    phone: "Телефон *",
    interest: "От какво се интересуваш? *",
    interests: ["Ток за бизнеса / дома", "Соларна система", "Батерии за съхранение", "Изкупуване на енергия", "Консултация"],
    bill: "Месечна сметка за ток (по избор)",
    bills: ["До 200 лв.", "200 – 1 000 лв.", "1 000 – 5 000 лв.", "Над 5 000 лв."],
    message: "Съобщение *",
    messagePh: "Разкажи ни накратко за обекта или въпроса си…",
    file: "Прикачи файл (по избор — напр. фактура)",
    gdpr: "Съгласен съм NV Power да обработи данните ми, за да отговори на запитването, съгласно политиката за поверителност.",
    submit: "Изпрати запитването",
    sending: "Изпращане…",
    successTitle: "Получихме съобщението ти!",
    successText: `Ще ти отговорим до 1 работен ден в работно време.`,
    required: "Попълни задължителните полета и отбележи съгласието.",
    error: "Нещо се обърка. Пиши ни директно на " + site.email + ".",
    select: "Избери…",
  },
  en: {
    name: "Full name *",
    company: "Company (optional)",
    email: "Email *",
    phone: "Phone *",
    interest: "What are you interested in? *",
    interests: ["Electricity for business / home", "A solar system", "Storage batteries", "Energy buy-back", "Consultation"],
    bill: "Monthly electricity bill (optional)",
    bills: ["Up to €100", "€100 – €500", "€500 – €2,500", "Over €2,500"],
    message: "Message *",
    messagePh: "Tell us briefly about your site or question…",
    file: "Attach a file (optional — e.g. an invoice)",
    gdpr: "I agree that NV Power may process my data to answer this enquiry, per the privacy policy.",
    submit: "Send the enquiry",
    sending: "Sending…",
    successTitle: "We got your message!",
    successText: `We'll reply within 1 business day during business hours.`,
    required: "Fill in the required fields and tick the consent box.",
    error: "Something went wrong. Email us directly at " + site.email + ".",
    select: "Select…",
  },
} as const;

export default function ContactForm({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [v, setV] = useState({ name: "", company: "", email: "", phone: "", interest: "", bill: "", message: "" });
  const [gdpr, setGdpr] = useState(false);
  const [fileName, setFileName] = useState("");
  const [hp, setHp] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");

  const setField = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setV((s) => ({ ...s, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!v.name.trim() || !v.email.trim() || !v.phone.trim() || !v.interest || !v.message.trim() || !gdpr) {
      setState("err");
      return;
    }
    setState("sending");
    const ok = await submitLead("contact", { ...v, fileName, gdpr }, hp);
    setState(ok ? "ok" : "err");
  }

  if (state === "ok") {
    return (
      <div className="card p-8 text-center md:p-10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent/10 text-3xl">✓</div>
        <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl font-bold text-body">{t.successTitle}</h3>
        <p className="mt-2 text-muted">{t.successText}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="card grid gap-4 p-6 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <input className="field" placeholder={t.name} value={v.name} onChange={setField("name")} aria-label={t.name} />
        <input className="field" placeholder={t.company} value={v.company} onChange={setField("company")} aria-label={t.company} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input className="field" type="email" placeholder={t.email} value={v.email} onChange={setField("email")} aria-label={t.email} />
        <input className="field" type="tel" placeholder={t.phone} value={v.phone} onChange={setField("phone")} aria-label={t.phone} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-semibold text-body">
          {t.interest}
          <select className="field font-normal" value={v.interest} onChange={setField("interest")}>
            <option value="" disabled>{t.select}</option>
            {t.interests.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-body">
          {t.bill}
          <select className="field font-normal" value={v.bill} onChange={setField("bill")}>
            <option value="">{t.select}</option>
            {t.bills.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </label>
      </div>
      <textarea className="field min-h-28" placeholder={t.messagePh} value={v.message} onChange={setField("message")} aria-label={t.message} />
      <label className="grid gap-1.5 text-sm font-semibold text-body">
        {t.file}
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
          className="field cursor-pointer font-normal file:mr-3 file:rounded-lg file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
        />
      </label>
      <input type="text" value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" name="website" />
      <label className="flex items-start gap-3 text-sm text-muted">
        <input type="checkbox" checked={gdpr} onChange={(e) => setGdpr(e.target.checked)} className="mt-0.5 size-4 accent-[#007b88]" />
        <span>
          {t.gdpr}{" "}
          <a href={locale === "en" ? "/en/politika-poveritelnost/" : "/politika-poveritelnost/"} className="text-accent underline" target="_blank" rel="noopener noreferrer">→</a>
        </span>
      </label>
      {state === "err" && (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
          {v.name && v.email && v.phone && v.interest && v.message && gdpr ? t.error : t.required}
        </p>
      )}
      <button type="submit" disabled={state === "sending"} className="btn btn-primary justify-self-start disabled:opacity-60">
        {state === "sending" ? t.sending : t.submit}
      </button>
    </form>
  );
}
