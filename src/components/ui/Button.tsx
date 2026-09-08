import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "accent" | "ghost" | "inverted";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex select-none items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 ease-smooth active:translate-y-px disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-line disabled:bg-surface-strong disabled:text-ink-subtle disabled:shadow-none motion-reduce:active:translate-y-0";

/**
 * State setiap variant: default -> hover -> active -> disabled.
 * Hijau untuk aksi utama, gold untuk aksi aksen di atas permukaan gelap.
 */
const variants: Record<Variant, string> = {
  // Kontras teks/background semuanya >= 4.5:1 (WCAG AA)
  primary: "bg-brand-700 text-white shadow-card hover:bg-brand-600 active:bg-brand-800",
  secondary:
    "border border-line-strong bg-surface text-ink hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 active:bg-brand-100",
  accent: "bg-accent-400 text-brand-950 shadow-card hover:bg-accent-300 active:bg-accent-500",
  ghost: "text-brand-700 hover:bg-brand-50 active:bg-brand-100",
  inverted:
    "border border-white/25 bg-white/5 text-white hover:border-accent-400/60 hover:bg-white/10 active:bg-white/20",
};

const sizes: Record<Size, string> = {
  // min-height 44px agar target sentuh nyaman di mobile
  sm: "min-h-[40px] px-4 text-sm",
  md: "min-h-[44px] px-5 text-[0.9375rem]",
  lg: "min-h-[48px] px-6 text-base",
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & { href?: never };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { children, variant = "primary", size = "md", className } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href) {
    const { href, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
    const isExternal = /^(https?:|mailto:|tel:)/.test(href);

    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          rel="noopener noreferrer"
          target={href.startsWith("http") ? "_blank" : undefined}
          {...rest}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } =
    props as ButtonAsButton;

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
