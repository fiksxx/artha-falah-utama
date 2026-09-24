"use client";

import { cn } from "@/lib/utils";

type FilterTabsProps<T extends string> = {
  /** Label grup untuk screen reader, mis. "Filter kategori produk". */
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  /** Jumlah entri per opsi (opsional) - tampil sebagai angka kecil di dalam tab. */
  counts?: Partial<Record<T, number>>;
  /** "sm" untuk filter tingkat dua (di bawah filter utama) - lebih ringan secara visual. */
  size?: "default" | "sm";
  className?: string;
};

/**
 * Filter berbentuk badge/tab. Aksesibel:
 * - dibungkus role="group" + aria-label
 * - state aktif memakai aria-pressed (bukan hanya warna)
 * - target sentuh minimal 40px, fokus keyboard terlihat
 */
export function FilterTabs<T extends string>({
  label,
  options,
  value,
  onChange,
  counts,
  size = "default",
  className,
}: FilterTabsProps<T>) {
  const isSmall = size === "sm";

  return (
    <div role="group" aria-label={label} className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => {
        const isActive = option === value;
        const count = counts?.[option];
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={isActive}
            className={cn(
              "inline-flex shrink-0 items-center whitespace-nowrap rounded-full border font-medium transition-all duration-200 ease-smooth active:translate-y-px motion-reduce:active:translate-y-0",
              isSmall ? "min-h-[36px] px-3.5 text-[0.8125rem]" : "min-h-[40px] px-4 text-sm",
              isActive
                ? isSmall
                  ? "border-brand-300 bg-brand-50 text-brand-800"
                  : "border-brand-700 bg-brand-700 text-white shadow-card"
                : "border-line-strong bg-surface text-ink-muted hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700",
            )}
          >
            {option}
            {typeof count === "number" ? (
              <span
                className={cn(
                  "ml-2 text-xs tabular-nums",
                  isActive && !isSmall ? "text-white/70" : "text-ink-subtle",
                )}
              >
                {count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
