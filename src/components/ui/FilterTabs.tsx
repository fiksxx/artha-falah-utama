"use client";

import { cn } from "@/lib/utils";

type FilterTabsProps<T extends string> = {
  /** Label grup untuk screen reader, mis. "Filter kategori produk". */
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
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
  className,
}: FilterTabsProps<T>) {
  return (
    <div role="group" aria-label={label} className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => {
        const isActive = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={isActive}
            className={cn(
              "inline-flex min-h-[40px] shrink-0 items-center whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-all duration-200 ease-smooth active:translate-y-px motion-reduce:active:translate-y-0",
              isActive
                ? "border-brand-700 bg-brand-700 text-white shadow-card"
                : "border-line-strong bg-surface text-ink-muted hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
