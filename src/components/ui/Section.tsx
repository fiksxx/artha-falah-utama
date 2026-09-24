import type { ReactNode } from "react";

import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";

type SectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  containerClassName?: string;
  /** Latar section. `soft` = gradien halus putih -> off-white kehijauan. */
  tone?: "default" | "muted" | "soft" | "brand";
  width?: "default" | "narrow" | "wide";
  /** Padding vertikal. */
  spacing?: "sm" | "md" | "lg";
};

const tones = {
  default: "bg-surface",
  muted: "bg-surface-muted",
  soft: "surface-soft",
  brand: "bg-brand-900 text-white",
} as const;

const spacings = {
  sm: "py-12 lg:py-16",
  md: "py-16 lg:py-24",
  lg: "py-20 lg:py-28",
} as const;

/** Pembungkus section standar: latar, padding vertikal, dan container konsisten. */
export function Section({
  children,
  id,
  className,
  containerClassName,
  tone = "default",
  width = "default",
  spacing = "md",
}: SectionProps) {
  return (
    <section id={id} className={cn(tones[tone], spacings[spacing], className)}>
      <Container width={width} className={containerClassName}>
        {children}
      </Container>
    </section>
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "default" | "invert";
  as?: "h1" | "h2" | "h3";
  /**
   * Ukuran judul.
   * - "section" (bawaan): judul di dalam halaman.
   * - "display": judul utama sebuah halaman, mis. judul katalog.
   */
  size?: "section" | "display";
  className?: string;
};

const headingSizes = {
  section: "text-heading font-bold uppercase tracking-[0.08em]",
  display: "text-display font-bold uppercase tracking-[0.06em]",
} as const;

/**
 * Judul section - SATU pola untuk seluruh website.
 *
 * Bentuknya selalu sama, dari atas ke bawah:
 *   eyebrow (opsional) -> judul -> garis emas -> deskripsi (opsional)
 *
 * Sebelumnya pola ini ditulis ulang manual di hampir setiap halaman, sehingga
 * panjang garis, tracking huruf, dan jaraknya sempat berbeda-beda antar
 * halaman. Sekarang semuanya lewat komponen ini: mengubah gaya judul cukup
 * dilakukan di satu tempat dan seluruh halaman ikut.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "default",
  as: Tag = "h2",
  size = "section",
  className,
}: SectionHeadingProps) {
  const invert = tone === "invert";

  return (
    <div className={cn(align === "center" && "flex flex-col items-center text-center", className)}>
      {eyebrow ? (
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.2em]",
            invert ? "text-accent-300" : "text-brand-600",
          )}
        >
          {eyebrow}
        </p>
      ) : null}

      <Tag
        className={cn(
          Tag === "h1" ? "text-display-lg font-bold" : headingSizes[size],
          eyebrow && "mt-3",
          invert ? "text-white" : "text-brand-900",
        )}
      >
        {title}
      </Tag>

      {/* Garis emas: penanda hierarki yang sama di semua judul section */}
      <span
        aria-hidden="true"
        className={cn(
          "mt-3 block h-1 rounded-full bg-accent-400",
          size === "display" ? "w-16" : "w-12",
        )}
      />

      {description ? (
        <p
          className={cn(
            "mt-5 max-w-content text-base leading-relaxed lg:text-[1.0625rem]",
            invert ? "text-white/75" : "text-ink-muted",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
