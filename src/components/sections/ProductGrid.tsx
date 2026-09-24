"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { ProductCard } from "@/components/sections/ProductCard";
import { Button } from "@/components/ui/Button";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { CloseIcon, FilterIcon, SearchIcon } from "@/components/ui/icons";
import {
  orderedCatalog,
  productApplications,
  productAvailabilities,
  productBrands,
  productCategories,
  productTypes,
  products,
  subcategoriesInCategories,
} from "@/lib/data/products";
import { trackEvent } from "@/lib/analytics";
import { cn, compactText, normalizeText } from "@/lib/utils";
import type { Product } from "@/types";

/**
 * Jumlah kartu produk yang dirender per batch.
 */
const PAGE_SIZE = 24;

/**
 * Kunci penyimpanan seed urutan katalog.
 */
const SEED_KEY = "artha-labs-catalog-seed";

/** Seed yang dipakai saat render di server, agar HTML awal selalu sama. */
const SSR_SEED = 1;

const sortOptions = [
  { id: "katalog", label: "Urutan katalog" },
  { id: "nama-asc", label: "Nama A - Z" },
  { id: "nama-desc", label: "Nama Z - A" },
  { id: "harga-asc", label: "Harga terendah" },
  { id: "harga-desc", label: "Harga tertinggi" },
] as const;

type SortId = (typeof sortOptions)[number]["id"];

/** Semua teks produk yang ikut dicari oleh kolom pencarian. */
const haystackOf = (product: Product) =>
  [
    product.name,
    product.model,
    product.brand,
    product.category,
    product.subcategory,
    product.productType,
    ...(product.applications ?? []),
    ...(product.keywords ?? []),
    // Deskripsi lengkap menggantikan ringkasan pendek yang sudah dihapus,
    // sehingga istilah teknis di dalam deskripsi tetap bisa dicari.
    ...(product.description ?? []),
  ].join(" ");

/**
 * Indeks pencarian, dibangun SEKALI saat modul dimuat.
 *
 * Sebelumnya teks pencarian setiap produk dirangkai dan dinormalisasi ulang
 * pada setiap ketikan. Dengan katalog yang kini berisi ratusan produk, itu
 * berarti ribuan operasi string per huruf yang diketik. Sekarang hasilnya
 * dihitung di muka dan pencarian tinggal membaca dari sini.
 */
const searchIndex: ReadonlyMap<string, { normalized: string; compact: string }> = new Map(
  products.map((product) => {
    const haystack = haystackOf(product);
    return [product.id, { normalized: normalizeText(haystack), compact: compactText(haystack) }];
  }),
);

/** Jeda sebelum kata kunci pencarian dicatat ke analytics (menunggu user berhenti mengetik). */
const SEARCH_TRACK_DELAY_MS = 800;

export function ProductGrid() {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [brandNames, setBrandIds] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [applications, setApplications] = useState<string[]>([]);
  const [availabilities, setAvailabilities] = useState<string[]>([]);
  const [sort, setSort] = useState<SortId>("katalog");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [seed, setSeed] = useState(SSR_SEED);
  const [seedReady, setSeedReady] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    let next = SSR_SEED;

    try {
      const stored = window.sessionStorage.getItem(SEED_KEY);
      if (stored) {
        next = Number(stored) || SSR_SEED;
      } else {
        next = Math.floor(Math.random() * 1_000_000) + 1;
        window.sessionStorage.setItem(SEED_KEY, String(next));
      }
    } catch {
      next = SSR_SEED;
    }

    setSeed(next);
    setSeedReady(true);
  }, []);

  const catalog = useMemo(() => orderedCatalog(seed), [seed]);

  const subcategoryOptions = useMemo(
    () => subcategoriesInCategories(categories),
    [categories],
  );

  const brandOptions = useMemo(() => productBrands.map((brand) => brand.name), []);

  const keyword = query.trim();

  /**
   * Penyaringan memakai nilai yang "tertunda", bukan nilai input langsung.
   * Kolom pencarian tetap merespons seketika saat diketik, sementara React
   * boleh menunda perhitungan daftar produk yang berat - ketikan tidak lagi
   * terasa tersendat pada katalog besar.
   */
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    const needle = normalizeText(deferredQuery);
    const needleCompact = compactText(deferredQuery);

    const result = catalog.filter((product) => {
      if (categories.length > 0 && !categories.includes(product.category)) return false;
      if (subcategories.length > 0 && !subcategories.includes(product.subcategory)) return false;
      if (brandNames.length > 0 && !brandNames.includes(product.brand)) return false;
      if (types.length > 0 && !types.includes(product.productType)) return false;
      if (availabilities.length > 0 && !availabilities.includes(product.availability)) return false;
      if (
        applications.length > 0 &&
        !(product.applications ?? []).some((item) => applications.includes(item))
      ) {
        return false;
      }

      if (needle === "") return true;

      const indexed = searchIndex.get(product.id);
      if (!indexed) return false;

      return (
        indexed.normalized.includes(needle) || indexed.compact.includes(needleCompact)
      );
    });

    if (sort === "katalog") return result;

    const sorted = [...result];
    sorted.sort((a, b) => {
      if (sort === "nama-asc") return a.name.localeCompare(b.name, "id");
      if (sort === "nama-desc") return b.name.localeCompare(a.name, "id");

      return sort === "harga-asc" ? a.price - b.price : b.price - a.price;
    });

    return sorted;
  }, [
    applications,
    availabilities,
    brandNames,
    catalog,
    categories,
    deferredQuery,
    sort,
    subcategories,
    types,
  ]);

  /**
   * Catat kata kunci pencarian ke analytics setelah pengunjung berhenti
   * mengetik. Yang paling berguna dari laporan ini adalah pencarian yang
   * menghasilkan nol produk - itu petunjuk langsung produk apa yang dicari
   * orang tetapi belum ada di katalog.
   */
  useEffect(() => {
    const term = deferredQuery.trim();
    if (term.length < 3) return;

    const timer = setTimeout(() => {
      trackEvent("catalog_search", {
        search_term: term.toLowerCase(),
        result_count: filtered.length,
      });
    }, SEARCH_TRACK_DELAY_MS);

    return () => clearTimeout(timer);
  }, [deferredQuery, filtered.length]);

  useEffect(() => {
    setSubcategories((current) => {
      const allowed = subcategoriesInCategories(categories) as readonly string[];
      const next = current.filter((item) => allowed.includes(item));
      return next.length === current.length ? current : next;
    });
  }, [categories]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [applications, availabilities, brandNames, categories, deferredQuery, sort, subcategories, types]);

  const paged = filtered.slice(0, visibleCount);
  const remainingCount = filtered.length - paged.length;
  const hasMore = remainingCount > 0;

  const chips: Array<{ key: string; label: string; onRemove: () => void }> = [];

  if (keyword !== "") {
    chips.push({
      key: "query",
      label: `Pencarian: ${keyword}`,
      onRemove: () => setQuery(""),
    });
  }

  const pushChips = (
    prefix: string,
    values: string[],
    setValues: (next: string[]) => void,
  ) => {
    values.forEach((value) => {
      chips.push({
        key: `${prefix}-${value}`,
        label: value,
        onRemove: () => setValues(values.filter((item) => item !== value)),
      });
    });
  };

  pushChips("kategori", categories, setCategories);
  pushChips("subkategori", subcategories, setSubcategories);
  pushChips("brand", brandNames, setBrandIds);
  pushChips("jenis", types, setTypes);
  pushChips("aplikasi", applications, setApplications);
  pushChips("stok", availabilities, setAvailabilities);

  const activeFilterCount = chips.length;
  const isFiltered = activeFilterCount > 0;

  const resetFilters = () => {
    setQuery("");
    setCategories([]);
    setSubcategories([]);
    setBrandIds([]);
    setTypes([]);
    setApplications([]);
    setAvailabilities([]);
    setVisibleCount(PAGE_SIZE);
  };

  const toggleValue = (
    value: string,
    values: string[],
    setValues: (next: string[]) => void,
  ) => {
    setValues(
      values.includes(value) ? values.filter((item) => item !== value) : [...values, value],
    );
  };

  return (
    <div>
      {/* PANEL FILTER */}
      <div className="rounded-xl border border-line bg-surface p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-ink">Temukan Produk Anda</h3>
            <span aria-hidden="true" className="mt-2 block h-px w-10 bg-accent-400" />
          </div>
          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            aria-expanded={filtersOpen}
            aria-controls="product-filter-panel"
            className={cn(
              "inline-flex min-h-[40px] items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-all duration-200 ease-smooth lg:hidden",
              filtersOpen || activeFilterCount > 0
                ? "border-accent-400 bg-accent-50 text-accent-700"
                : "border-line-strong bg-surface text-ink-muted hover:border-brand-300 hover:text-brand-700",
            )}
          >
            <FilterIcon aria-hidden="true" width={18} height={18} />
            Filter
            {activeFilterCount > 0 ? (
              <span className="grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-brand-700 px-1 text-[0.6875rem] font-bold text-white">
                {activeFilterCount}
              </span>
            ) : null}
          </button>
        </div>

        {/* Baris 1: Pencarian + Urutan */}
        <div className="mt-4 grid gap-4 lg:grid-cols-12 lg:gap-5">
          <div className="lg:col-span-8">
            <label
              htmlFor="product-search"
              className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle"
            >
              Cari produk
            </label>
            <div className="relative mt-2.5">
              <SearchIcon
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle"
              />
              <input
                id="product-search"
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Nama produk, model, brand, atau kata kunci..."
                autoComplete="off"
                className="h-12 w-full rounded-lg border border-line-strong bg-surface pl-11 pr-12 text-[0.9375rem] text-ink transition-colors duration-200 placeholder:text-ink-subtle hover:border-brand-300 focus:border-brand-500 focus:outline-none"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Hapus kata kunci pencarian"
                  className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md text-ink-subtle transition-colors duration-200 hover:bg-brand-50 hover:text-brand-700"
                >
                  <CloseIcon width={16} height={16} />
                </button>
              ) : null}
            </div>
          </div>

          <div className="lg:col-span-4">
            <label
              htmlFor="product-sort"
              className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle"
            >
              Urutkan
            </label>
            <select
              id="product-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortId)}
              className="mt-2.5 h-12 w-full rounded-lg border border-line-strong bg-surface px-3.5 text-[0.9375rem] text-ink transition-colors duration-200 hover:border-brand-300 focus:border-brand-500 focus:outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Baris 2: Filter Rinci */}
        <div
          id="product-filter-panel"
          className={cn("lg:block", filtersOpen ? "block" : "hidden")}
        >
          {/* Kategori */}
          <div className="mt-5 border-t border-line pt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">
              Kategori
            </p>
            <div role="group" aria-label="Filter kategori produk" className="mt-2.5 flex flex-wrap gap-2">
              {productCategories.map((option) => {
                const isActive = categories.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleValue(option, categories, setCategories)}
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
          </div>

          {/* Subkategori, Brand, Jenis, Aplikasi */}
          <div className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            <MultiSelect
              id="filter-subcategory"
              label="Subkategori"
              placeholder="Semua subkategori"
              noun="subkategori"
              options={subcategoryOptions}
              values={subcategories}
              onChange={setSubcategories}
              searchPlaceholder="Cari subkategori..."
            />
            <MultiSelect
              id="filter-brand"
              label="Brand"
              placeholder="Semua brand"
              noun="brand"
              options={brandOptions}
              values={brandNames}
              onChange={setBrandIds}
              searchPlaceholder="Cari brand..."
            />
            <MultiSelect
              id="filter-type"
              label="Jenis produk"
              placeholder="Semua jenis"
              noun="jenis"
              options={productTypes}
              values={types}
              onChange={setTypes}
              searchPlaceholder="Cari jenis produk..."
            />
            <MultiSelect
              id="filter-application"
              label="Aplikasi"
              placeholder="Semua aplikasi"
              noun="aplikasi"
              options={productApplications}
              values={applications}
              onChange={setApplications}
              searchPlaceholder="Cari bidang penggunaan..."
            />
          </div>

          {/* Ketersediaan */}
          <div className="mt-5 border-t border-line pt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">
              Ketersediaan
            </p>
            <div
              role="group"
              aria-label="Filter ketersediaan produk"
              className="mt-2.5 flex flex-wrap gap-2"
            >
              {productAvailabilities.map((option) => {
                const isActive = availabilities.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleValue(option, availabilities, setAvailabilities)}
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
          </div>
        </div>

        {/* Chip Filter Aktif */}
        {isFiltered ? (
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-5">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">
              Filter aktif
            </span>
            {chips.map((chip) => (
              <ActiveFilterChip
                key={chip.key}
                label={chip.label}
                onRemove={chip.onRemove}
                removeLabel={`Hapus filter ${chip.label}`}
              />
            ))}
            <button
              type="button"
              onClick={resetFilters}
              className="ml-auto inline-flex min-h-[36px] items-center text-sm font-semibold text-brand-700 underline-offset-4 transition-colors duration-200 hover:text-brand-600 hover:underline"
            >
              Hapus semua filter
            </button>
          </div>
        ) : null}
      </div>

      {/* Penghitung Hasil */}
      <p aria-live="polite" className="mt-6 text-sm text-ink-subtle">
        {hasMore ? (
          <>
            Menampilkan <span className="font-semibold text-ink">{paged.length}</span> dari{" "}
            {filtered.length} produk
            {isFiltered ? " yang cocok" : null}
          </>
        ) : isFiltered ? (
          <>
            <span className="font-semibold text-ink">{filtered.length}</span> produk cocok dari{" "}
            {products.length} produk
          </>
        ) : (
          <>
            <span className="font-semibold text-ink">{products.length}</span> produk ditemukan
          </>
        )}
      </p>

      {/* Grid Produk */}
      <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {paged.map((product, index) => (
            <motion.li
              key={product.id}
              layout={!prefersReducedMotion && seedReady}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="group h-full"
            >
              <ProductCard product={product} eager={index < 3} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {/* Tampilkan Lebih Banyak */}
      {hasMore ? (
        <div className="mt-8 flex flex-col items-center gap-2.5">
          <Button type="button" variant="secondary" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
            Tampilkan lebih banyak
          </Button>
          <p className="text-sm text-ink-subtle">
            {remainingCount} produk lainnya belum ditampilkan
          </p>
        </div>
      ) : null}

      {/* Tampilan Kosong */}
      {filtered.length === 0 ? (
        <div className="mt-4 rounded-xl border border-line bg-surface-muted px-6 py-14 text-center">
          <span
            aria-hidden="true"
            className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-700"
          >
            <SearchIcon />
          </span>
          <h3 className="mt-4 text-lg font-semibold text-ink">Produk tidak ditemukan</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
            Coba kurangi filter yang aktif atau ubah kata kunci pencarian Anda.
          </p>
          <Button type="button" variant="secondary" className="mt-6" onClick={resetFilters}>
            Hapus semua filter
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function ActiveFilterChip({
  label,
  onRemove,
  removeLabel,
}: {
  label: string;
  onRemove: () => void;
  removeLabel: string;
}) {
  return (
    <span className="inline-flex min-h-[36px] max-w-full items-center gap-1.5 rounded-full border border-accent-300 bg-accent-50 pl-3 pr-1.5 text-sm font-medium text-accent-700">
      <span className="truncate">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={removeLabel}
        className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-accent-700 transition-colors duration-200 hover:bg-accent-200 hover:text-accent-700"
      >
        <CloseIcon width={14} height={14} />
      </button>
    </span>
  );
}