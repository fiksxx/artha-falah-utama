"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ChevronDownIcon, SearchIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type MultiSelectProps = {
  id: string;
  /** Label yang tampil di atas dropdown. */
  label: string;
  /** Teks tombol saat belum ada pilihan, mis. "Semua brand". */
  placeholder: string;
  /** Kata benda jamak untuk ringkasan pilihan, mis. "brand" -> "2 brand dipilih". */
  noun: string;
  options: readonly string[];
  values: readonly string[];
  onChange: (values: string[]) => void;
  searchPlaceholder?: string;
  className?: string;
};

/**
 * Dropdown filter multi-pilih.
 *
 * Dirancang untuk katalog yang akan tumbuh besar:
 * - opsi bisa dicari begitu jumlahnya lebih dari 6
 * - pilihan memakai <input type="checkbox"> asli, sehingga pembaca layar dan
 *   navigasi keyboard bekerja tanpa ARIA buatan
 * - panel menutup saat klik di luar atau menekan Escape
 * - tinggi panel dibatasi + scroll, jadi 100 opsi pun tidak memanjangkan halaman
 */
export function MultiSelect({
  id,
  label,
  placeholder,
  noun,
  options,
  values,
  onChange,
  searchPlaceholder = "Cari...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const showSearch = options.length > 6;
  const panelId = `${id}-panel`;

  const filtered = useMemo(() => {
    const keyword = query.toLowerCase().trim();
    if (keyword === "") return options;
    return options.filter((option) => option.toLowerCase().includes(keyword));
  }, [options, query]);

  // Tutup saat klik di luar atau menekan Escape
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const toggle = (option: string) => {
    onChange(
      values.includes(option)
        ? values.filter((value) => value !== option)
        : [...values, option],
    );
  };

  const summary =
    values.length === 0
      ? placeholder
      : values.length === 1
        ? (values[0] as string)
        : `${values.length} ${noun} dipilih`;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle"
      >
        {label}
      </label>

      <button
        ref={buttonRef}
        id={id}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          "mt-2.5 flex h-12 w-full items-center justify-between gap-2 rounded-lg border bg-surface px-3.5 text-left text-[0.9375rem] transition-colors duration-200",
          values.length > 0
            ? "border-brand-500 text-ink"
            : "border-line-strong text-ink-muted hover:border-brand-300",
        )}
      >
        <span className="truncate">{summary}</span>
        <span className="flex shrink-0 items-center gap-1.5">
          {values.length > 1 ? (
            <span className="grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-brand-700 px-1 text-[0.6875rem] font-bold text-white">
              {values.length}
            </span>
          ) : null}
          <ChevronDownIcon
            aria-hidden="true"
            className={cn(
              "text-ink-subtle transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </span>
      </button>

      {open ? (
        <div
          id={panelId}
          className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-lg border border-line-strong bg-surface shadow-card-hover"
        >
          {showSearch ? (
            <div className="border-b border-line p-2.5">
              <div className="relative">
                <SearchIcon
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle"
                  width={16}
                  height={16}
                />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={searchPlaceholder}
                  autoComplete="off"
                  aria-label={`${label}: cari pilihan`}
                  className="h-10 w-full rounded-md border border-line-strong bg-surface pl-9 pr-3 text-sm text-ink placeholder:text-ink-subtle focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>
          ) : null}

          <div className="scrollbar-soft max-h-64 overflow-y-auto p-1.5">
            {filtered.length === 0 ? (
              <p className="px-2.5 py-3 text-sm text-ink-subtle">Pilihan tidak ditemukan.</p>
            ) : (
              filtered.map((option) => {
                const checked = values.includes(option);
                return (
                  <label
                    key={option}
                    className={cn(
                      "flex min-h-[40px] cursor-pointer items-center gap-2.5 rounded-md px-2.5 text-sm transition-colors duration-150",
                      checked ? "bg-brand-50 text-brand-800" : "text-ink-muted hover:bg-surface-muted",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(option)}
                      className="h-4 w-4 shrink-0 accent-brand-700"
                    />
                    <span className="py-2">{option}</span>
                  </label>
                );
              })
            )}
          </div>

          {values.length > 0 ? (
            <div className="border-t border-line p-1.5">
              <button
                type="button"
                onClick={() => onChange([])}
                className="flex min-h-[40px] w-full items-center rounded-md px-2.5 text-sm font-semibold text-brand-700 transition-colors duration-150 hover:bg-brand-50"
              >
                Hapus pilihan {label.toLowerCase()}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
