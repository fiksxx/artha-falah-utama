"use client";

import { useSearchParams } from "next/navigation";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { AlertIcon, CheckIcon } from "@/components/ui/icons";
import { trackEvent } from "@/lib/analytics";
import {
  PRODUCT_NAMES_URL,
  QUOTE_PARAMS,
  resolveQuoteRequest,
  type ProductNameMap,
} from "@/lib/quote";
import { contactFormSchema, toFieldErrors } from "@/lib/validation/contact";
import { cn } from "@/lib/utils";
import type { ContactApiResponse, ContactFormValues } from "@/types";

type Status = "idle" | "submitting" | "success" | "error";

const initialValues: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  company: "",
};

const fieldClasses =
  "w-full rounded-lg border bg-surface px-4 py-3 text-base text-ink placeholder:text-ink-subtle/70 transition-colors focus:border-brand-500";

export function ContactForm() {
  const searchParams = useSearchParams();
  const productParam = searchParams.get(QUOTE_PARAMS.product);
  const categoryParam = searchParams.get(QUOTE_PARAMS.category);

  /**
   * Nama produk untuk isian otomatis "Minta Penawaran".
   * Diambil dari JSON kecil (/data/nama-produk.json) HANYA bila halaman dibuka
   * dengan ?product=, sehingga halaman ini tidak perlu mengunduh seluruh data
   * katalog. `lookupKey` = parameter produk yang sudah selesai dicari (berhasil
   * maupun gagal); selama belum selesai, isian otomatis ditunda.
   */
  const [productNames, setProductNames] = useState<ProductNameMap | null>(null);
  const [lookupKey, setLookupKey] = useState<string | null>(null);

  useEffect(() => {
    if (!productParam) return;
    let cancelled = false;

    fetch(PRODUCT_NAMES_URL)
      .then((response) => (response.ok ? (response.json() as Promise<ProductNameMap>) : null))
      .catch(() => null)
      .then((data) => {
        if (cancelled) return;
        if (data) setProductNames(data);
        // Gagal mengunduh tetap dianggap selesai: nama produk dibentuk dari slug.
        setLookupKey(productParam);
      });

    return () => {
      cancelled = true;
    };
  }, [productParam]);

  const lookupDone = !productParam || lookupKey === productParam;

  const quote = useMemo(
    () => (lookupDone ? resolveQuoteRequest(productParam, categoryParam, productNames) : null),
    [lookupDone, productParam, categoryParam, productNames],
  );

  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const appliedQuoteRef = useRef<string | null>(null);

  useEffect(() => {
    if (!quote) return;
    const key = `${quote.productName}|${quote.category ?? ""}`;
    if (appliedQuoteRef.current === key) return;
    appliedQuoteRef.current = key;
    setValues((current) => ({
      ...current,
      subject: quote.subject,
      message: quote.message,
    }));

    // Dicatat sekali per produk: memperlihatkan produk mana yang paling sering
    // dibawa ke form penawaran, termasuk yang akhirnya tidak jadi dikirim.
    trackEvent("quote_request_start", {
      product_slug: searchParams.get(QUOTE_PARAMS.product) ?? "",
      category: quote.category,
    });
  }, [quote, searchParams]);

  const setField = (field: keyof ContactFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));
  };

  const validateField = (field: keyof ContactFormValues) => {
    const result = contactFormSchema.safeParse(values);
    if (result.success) return;
    const fieldErrors = toFieldErrors(result.error);
    if (fieldErrors[field]) {
      setErrors((current) => ({ ...current, [field]: fieldErrors[field] }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback("");

    const result = contactFormSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors = toFieldErrors(result.error);
      setErrors(fieldErrors);
      setStatus("error");
      setFeedback("Mohon periksa kembali isian yang ditandai.");
      const firstField = Object.keys(fieldErrors)[0];
      if (firstField) {
        formRef.current?.querySelector<HTMLElement>(`[name="${firstField}"]`)?.focus();
      }
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const data = (await response.json()) as ContactApiResponse;

      if (!response.ok || !data.ok) {
        setStatus("error");
        setErrors(data.fieldErrors ?? {});
        setFeedback(data.message || "Pesan gagal dikirim. Silakan coba lagi.");
        return;
      }

      setStatus("success");
      setFeedback(data.message);
      setValues(initialValues);
      trackEvent("contact_form_submit", { is_quote_request: Boolean(quote) });
    } catch {
      setStatus("error");
      setFeedback("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
    }
  };

  const isSubmitting = status === "submitting";

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {quote ? (
        <div className="rounded-xl border border-accent-200 bg-accent-50 p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-700">
            Permintaan penawaran untuk
          </p>
          <p className="mt-1.5 text-base font-semibold text-ink">{quote.productName}</p>
          {quote.category ? (
            <p className="mt-0.5 text-sm text-ink-muted">Kategori {quote.category}</p>
          ) : null}
          <p className="mt-2.5 text-xs leading-relaxed text-ink-subtle">
            Subjek dan pesan sudah terisi otomatis - silakan ubah bila perlu sebelum mengirim.
          </p>
        </div>
      ) : null}

      {/* Honeypot */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Perusahaan (jangan diisi)</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(event) => setField("company", event.target.value)}
        />
      </div>

      <Field
        id="name"
        label="Nama lengkap"
        placeholder="Nama Anda"
        autoComplete="name"
        value={values.name}
        error={errors.name}
        disabled={isSubmitting}
        onChange={(value) => setField("name", value)}
        onBlur={() => validateField("name")}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="email"
          type="email"
          label="Email"
          placeholder="nama@perusahaan.com"
          autoComplete="email"
          inputMode="email"
          value={values.email}
          error={errors.email}
          disabled={isSubmitting}
          onChange={(value) => setField("email", value)}
          onBlur={() => validateField("email")}
        />
        <Field
          id="phone"
          type="tel"
          label="Nomor Telepon / WhatsApp"
          placeholder="081234567890"
          autoComplete="tel"
          inputMode="tel"
          value={values.phone}
          error={errors.phone}
          disabled={isSubmitting}
          onChange={(value) => setField("phone", value)}
          onBlur={() => validateField("phone")}
        />
      </div>

      <Field
        id="subject"
        label="Subjek"
        placeholder="Contoh: Permintaan penawaran reagen"
        value={values.subject}
        error={errors.subject}
        disabled={isSubmitting}
        onChange={(value) => setField("subject", value)}
        onBlur={() => validateField("subject")}
      />

      <Field
        id="message"
        label="Pesan"
        placeholder="Tuliskan kebutuhan, spesifikasi, atau pertanyaan Anda..."
        multiline
        value={values.message}
        error={errors.message}
        hint="Minimal 10 karakter"
        disabled={isSubmitting}
        onChange={(value) => setField("message", value)}
        onBlur={() => validateField("message")}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
        </Button>
        <p className="text-sm text-ink-subtle">
          Kami biasanya membalas dalam 1 - 2 hari kerja.
        </p>
      </div>

      {feedback ? (
        <p
          role={status === "error" ? "alert" : "status"}
          aria-live={status === "error" ? "assertive" : "polite"}
          className={cn(
            "flex items-start gap-2.5 rounded-lg border p-4 text-sm",
            status === "success"
              ? "border-brand-200 bg-brand-50 text-brand-900"
              : "border-danger-200 bg-danger-50 text-danger-900",
          )}
        >
          <span className="mt-0.5 shrink-0" aria-hidden="true">
            {status === "success" ? <CheckIcon /> : <AlertIcon />}
          </span>
          {feedback}
        </p>
      ) : null}
    </form>
  );
}

type FieldProps = {
  id: keyof ContactFormValues & string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  hint?: string;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel";
};

function Field({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  hint,
  placeholder,
  type = "text",
  multiline,
  disabled,
  autoComplete,
  inputMode,
}: FieldProps) {
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
    .filter(Boolean)
    .join(" ");

  const sharedProps = {
    id,
    name: id,
    value,
    placeholder,
    disabled,
    autoComplete,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy || undefined,
    onBlur,
    className: cn(
      fieldClasses,
      error ? "border-danger-400" : "border-line-strong",
      disabled && "opacity-60",
    ),
  };

  return (
    <div className={cn(multiline && "sm:col-span-2")}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        <span className="ml-1 text-danger-600" aria-hidden="true">
          *
        </span>
      </label>

      {multiline ? (
        <textarea
          {...sharedProps}
          rows={6}
          onChange={(event) => onChange(event.target.value)}
          className={cn(sharedProps.className, "resize-y")}
        />
      ) : (
        <input
          {...sharedProps}
          type={type}
          inputMode={inputMode}
          onChange={(event) => onChange(event.target.value)}
        />
      )}

      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-subtle">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-danger-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}