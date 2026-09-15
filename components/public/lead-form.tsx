"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { submitLead } from "@/lib/actions/leads";
import { getDictionary } from "@/lib/i18n/dictionary";
import { asLocale, type Locale } from "@/lib/i18n/config";
import { leadSchema, type LeadInput } from "@/lib/leads";

type Props = {
  locale: Locale | string;
  interestedProduct?: string;
  utmSource?: string;
};

export function LeadForm({ locale, interestedProduct = "", utmSource = "" }: Props) {
  const lang = asLocale(locale);
  const copy = getDictionary(lang);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      company: "",
      interested_product: interestedProduct,
      language: lang,
      utm_source: utmSource,
    },
  });

  useEffect(() => {
    if (utmSource) return;
    const found = new URLSearchParams(window.location.search).get("utm_source");
    if (found) form.setValue("utm_source", found);
  }, [form, utmSource]);

  async function onSubmit(values: LeadInput) {
    setError("");
    const result = await submitLead(values);
    if (!result.ok) {
      setError(copy.form.error);
      return;
    }
    setDone(true);
    form.reset({ ...values, full_name: "", phone: "", company: "", interested_product: interestedProduct });
  }

  if (done) {
    return <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{copy.quote.success}</p>;
  }

  return (
    <form className="grid gap-4 font-sans" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <input type="hidden" {...form.register("language")} />
      <input type="hidden" {...form.register("utm_source")} />
      <label className="grid gap-1 text-sm">
        <span className="font-medium">{copy.form.fullName}</span>
        <input className="admin-input" {...form.register("full_name")} autoComplete="name" />
        {form.formState.errors.full_name ? <span className="text-xs text-red-600">{copy.form.required}</span> : null}
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium">{copy.form.phone}</span>
        <input className="admin-input" {...form.register("phone")} autoComplete="tel" />
        {form.formState.errors.phone ? <span className="text-xs text-red-600">{copy.form.required}</span> : null}
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium">{copy.form.company}</span>
        <input className="admin-input" {...form.register("company")} autoComplete="organization" />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium">{copy.form.product}</span>
        <input className="admin-input" {...form.register("interested_product")} />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="w-fit rounded-lg bg-[var(--lf-625)] px-4 py-2 font-semibold text-white disabled:opacity-60"
      >
        {form.formState.isSubmitting ? copy.form.sending : copy.quote.submit}
      </button>
    </form>
  );
}
