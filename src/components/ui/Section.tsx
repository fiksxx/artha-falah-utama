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
  className?: string;
};

/** Judul section dengan hierarki heading konsisten (eyebrow + h2/h3 + deskripsi). */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "default",
  as: Tag = "h2",
  className,
}: SectionHeadingProps) {
  const invert = tone === "invert";

  return (
    <div
      className={cn(
        "max-w-content",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <div className={cn(align === "center" && "flex flex-col items-center")}>
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-[0.2em]",
              invert ? "text-accent-300" : "text-brand-600",
            )}
          >
            {eyebrow}
          </p>
          {/* Divider gold tipis: penanda hierarki yang konsisten di semua section */}
          <span
            aria-hidden="true"
            className={cn(
              "mt-2.5 block h-px w-10",
              invert ? "bg-accent-400" : "rule-accent",
            )}
          />
        </div>
      ) : null}
      <Tag
        className={cn(
          Tag === "h1" ? "text-display-lg" : "text-display",
          eyebrow && "mt-3",
          invert && "text-white",
        )}
      >
        {title}
      </Tag>
      {description ? (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed lg:text-[1.0625rem]",
            invert ? "text-white/75" : "text-ink-muted",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
