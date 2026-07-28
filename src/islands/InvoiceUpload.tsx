import { useState } from "react";
import { submitLead } from "../lib/lead";
import type { Locale } from "../config/site";
import { site } from "../config/site";
import { r } from "../i18n/routes";

/* /tok invoice-upload block — send us a recent invoice, get a comparative
   quote. File + phone (+ optional email), GDPR, honeypot. Mirrors the
   ContactForm pattern. */

const copy = {
  bg: {
    file: "Последна фактура за ток (PDF, JPG или PNG) *",
    phone: "Телефон за връзка *",
    email: "Имейл (по избор)",
    gdpr: "Съгласен съм NV Power да обработи данните ми, за да изготви сравнителна оферта, съгласно политиката за поверителност.",
    submit: "Изпрати фактурата",
    sending: "Изпращане…",
    successTitle: "Фактурата е при нас!",
    successText: `Ще получиш сравнителна оферта до 1 работен ден.`,
    required: "Прикачи фактура, попълни телефон и отбележи съгласието.",
    error: "Нещо се обърка. Пиши ни директно на " + site.email + ".",
    fileHint: "Числата от фактурата ни стигат — не ни трябва нищо друго.",
  },
  en: {
    file: "Your latest electricity invoice (PDF, JPG or PNG) *",
    phone: "Contact phone *",
    email: "Email (optional)",
    gdpr: "I agree that NV Power may process my data to prepare a comparative quote, per the privacy policy.",
    submit: "Send the invoice",
    sending: "Sending…",
    successTitle: "We've got your invoice!",
    successText: `You'll receive a comparative quote within 1 business day.`,
    required: "Attach an invoice, fill in your phone and tick the consent box.",
    error: "Something went wrong. Email us directly at " + site.email + ".",
    fileHint: "The numbers on the invoice are all we need — nothing else.",
  },
} as const;

export default function InvoiceUpload({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [fileName, setFileName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gdpr, setGdpr] = useState(false);
  const [hp, setHp] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!fileName || !phone.trim() || !gdpr) {
      setState("err");
      return;
    }
    setState("sending");
    const ok = await submitLead("invoice", { fileName, phone, email, gdpr }, hp);
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
      <label className="grid gap-1.5 text-sm font-semibold text-body">
        {t.file}
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
          className="field cursor-pointer font-normal file:mr-3 file:rounded-lg file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
        />
        <span className="text-xs font-normal text-muted">{t.fileHint}</span>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <input className="field" type="tel" placeholder={t.phone} value={phone} onChange={(e) => setPhone(e.target.value)} aria-label={t.phone} />
        <input className="field" type="email" placeholder={t.email} value={email} onChange={(e) => setEmail(e.target.value)} aria-label={t.email} />
      </div>
      <input type="text" value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" name="website" />
      <label className="flex items-start gap-3 text-sm text-muted">
        <input type="checkbox" checked={gdpr} onChange={(e) => setGdpr(e.target.checked)} className="mt-0.5 size-4 accent-[#007b88]" />
        <span>
          {t.gdpr}{" "}
          <a href={r(locale, "privacy")} className="text-accent underline" target="_blank" rel="noopener noreferrer">→</a>
        </span>
      </label>
      {state === "err" && (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
          {fileName && phone && gdpr ? t.error : t.required}
        </p>
      )}
      <button type="submit" disabled={state === "sending"} className="btn btn-primary justify-self-start disabled:opacity-60">
        {state === "sending" ? t.sending : t.submit}
      </button>
    </form>
  );
}
