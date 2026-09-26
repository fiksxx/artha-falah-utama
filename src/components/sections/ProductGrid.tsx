"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { type MouseEvent, useDeferredValue, useEffect, useMemo, useState } from "react";

import { ProductCard } from "@/components/sections/ProductCard";
import { Button } from "@/components/ui/Button";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { ArrowRightIcon, CloseIcon, FilterIcon, SearchIcon } from "@/components/ui/icons";
import { trackEvent } from "@/lib/analytics";
import {
  CATALOG_INDEX_URL,
  applicationOptionsOf,
  buildSearchIndex,
  catalogSortOptions as sortOptions,
  filterCatalog,
  orderCatalog,
  subcategoriesFor,
  type CatalogCategoryNavItem,
  type CatalogFacets,
  type CatalogItem,
  type CatalogSearchIndex,
  type CatalogSortId as SortId,
} from "@/lib/catalog";
import { cn } from "@/lib/utils";

/**
 * Jumlah kartu produk yang dirender per batch.
 * Harus sama dengan CATALOG_PAGE_SIZE di lib/data/catalog-index.ts.
 */
const PAGE_SIZE = 24;

/**
 * Kunci penyimpanan seed urutan katalog.
 */
const SEED_KEY = "artha-labs-catalog-seed";

/** Seed yang dipakai saat render di server, agar HTML awal selalu sama. */
const SSR_SEED = 1;

/** Jeda sebelum kata kunci pencarian dicatat ke analytics (menunggu user berhenti mengetik). */
const SEARCH_TRACK_DELAY_MS = 800;

/**
 * Jumlah chip subkategori yang tampil sebelum tombol "lainnya" (layar sm ke atas).
 * Di layar kecil semua chip tetap ada dalam satu baris yang bisa digeser.
 */
const SUBCATEGORY_PREVIEW = 8;

/** Gaya tab kategori (Semua / Reagen / Alat Laboratorium). */
const tabClass = (active: boolean) =>
  cn(
    "inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-full border px-5 text-[0.9375rem] font-semibold transition-all duration-200 ease-smooth active:translate-y-px motion-reduce:active:translate-y-0",
    active
      ? "border-brand-700 bg-brand-700 text-white shadow-card"
      : "border-line-strong bg-surface text-ink hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700",
  );

const tabCountClass = (active: boolean) =>
  cn(
    "rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
    active ? "bg-white/15 text-white" : "bg-surface-muted text-ink-subtle",
  );

/** Gaya chip subkategori - lebih kecil dari tab agar hierarki kategori tetap jelas. */
const subChipClass = (active: boolean) =>
  cn(
    "inline-flex min-h-[36px] items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-sm font-medium transition-all duration-200 ease-smooth",
    active
      ? "border-brand-600 bg-brand-50 text-brand-800"
      : "border-line bg-surface text-ink-muted hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700",
  );

/** Baris chip: satu baris yang bisa digeser di layar kecil, membungkus di sm ke atas. */
const chipRowClass =
  "-mx-4 flex gap-2 overflow-x-auto px-4 pb-0.5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden";

/**
 * Tautan kategori/subkategori tetap berupa <a href> asli (bisa dirayapi mesin
 * pencari dan dibuka di tab baru). Klik biasa menyaring katalog di tempat;
 * klik dengan tombol pengubah / tombol tengah tetap mengikuti tautan.
 */
function opensLink(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

type LoadedIndex = {
  items: CatalogItem[];
  search: CatalogSearchIndex;
  /** Opsi filter "Aplikasi" (ribuan entri - sengaja tidak dikirim bersama HTML). */
  applications: string[];
};

type ProductGridProps = {
  /** Batch pertama (urutan seed SSR) - dirender di server, tampil sebelum indeks dimuat. */
  initialItems: CatalogItem[];
  /** Pilihan filter, dihitung di server dari data produk. */
  facets: CatalogFacets;
  /** Navigasi kategori & subkategori (dengan tautan halaman kategori), dari server. */
  categoryNav: CatalogCategoryNavItem[];
  /** Jumlah seluruh produk di katalog. */
  total: number;
};

/** Daftar opsi kosong selama indeks belum dimuat. */
const NO_OPTIONS: string[] = [];

/** Indeks kosong untuk kartu awal (pencarian belum dipakai sebelum indeks dimuat). */
const EMPTY_SEARCH_INDEX: CatalogSearchIndex = new Map();

/**
 * Katalog produk dengan filter & pencarian.
 *
 * CATATAN PERFORMA: data katalog lengkap TIDAK dibundel ke JavaScript halaman.
 * 24 kartu pertama datang dari server (props), lalu indeks ringan
 * (/data/katalog.json) diunduh di belakang layar setelah halaman tampil.
 * Filter, pencarian, urutan, dan "Tampilkan lebih banyak" memakai indeks itu;
 * bila pengunjung sudah berinteraksi sebelum indeks siap, tampil keterangan
 * "Memuat katalog lengkap...".
 */
export function ProductGrid({ initialItems, facets, categoryNav, total }: ProductGridProps) {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [brandNames, setBrandIds] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [applications, setApplications] = useState<string[]>([]);
  const [availabilities, setAvailabilities] = useState<string[]>([]);
  const [sort, setSort] = useState<SortId>("katalog");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showAllSubcategories, setShowAllSubcategories] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [seed, setSeed] = useState(SSR_SEED);
  const [seedReady, setSeedReady] = useState(false);
  const [loaded, setLoaded] = useState<LoadedIndex | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
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

  /** Unduh indeks katalog setelah halaman tampil (diulang bila "Coba lagi"). */
  useEffect(() => {
    let cancelled = false;
    setLoadFailed(false);

    fetch(CATALOG_INDEX_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<CatalogItem[]>;
      })
      .then((items) => {
        if (cancelled) return;
        setLoaded({
          items,
          search: buildSearchIndex(items),
          applications: applicationOptionsOf(items),
        });
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [loadAttempt]);

  /** Sebelum indeks siap, katalog = kartu awal dari server (urutan seed SSR). */
  const catalog = useMemo(
    () => (loaded ? orderCatalog(seed, loaded.items) : initialItems),
    [loaded, initialItems, seed],
  );

  const subcategoryOptions = useMemo(
    () => subcategoriesFor(facets, categories),
    [facets, categories],
  );

  /** Kategori yang sedang dibuka lewat tab (katalog hanya memakai satu kategori sekaligus). */
  const activeCategory =
    categories.length === 1
      ? categoryNav.find((item) => item.category === categories[0])
      : undefined;

  /** Chip subkategori: milik kategori aktif, atau seluruh subkategori saat "Semua". */
  const subcategoryChips = useMemo(
    () =>
      activeCategory
        ? activeCategory.subcategories
        : categoryNav
            .flatMap((item) => item.subcategories)
            .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "id")),
    [activeCategory, categoryNav],
  );

  const collapsedSubcategoryCount = showAllSubcategories
    ? 0
    : subcategoryChips.filter(
        (entry, index) => index >= SUBCATEGORY_PREVIEW && !subcategories.includes(entry.name),
      ).length;

  /** Tautan ke halaman kategori/subkategori yang sedang dipilih (bila halamannya ada). */
  const selectedSubcategoryPage =
    subcategories.length === 1
      ? subcategoryChips.find((entry) => entry.name === subcategories[0] && entry.href)
      : undefined;
  const pageLink = selectedSubcategoryPage?.href
    ? { href: selectedSubcategoryPage.href, label: selectedSubcategoryPage.name }
    : activeCategory
      ? { href: activeCategory.href, label: activeCategory.label }
      : null;

  const categoryLabel = (value: string) =>
    categoryNav.find((item) => item.category === value)?.label ?? value;

  const selectCategory = (value: string | null) => {
    setCategories(value ? [value] : []);
  };

  const brandOptions = facets.brands;
  const applicationOptions = loaded?.applications ?? NO_OPTIONS;

  const keyword = query.trim();

  /**
   * Penyaringan memakai nilai yang "tertunda", bukan nilai input langsung.
   * Kolom pencarian tetap merespons seketika saat diketik, sementara React
   * boleh menunda perhitungan daftar produk yang berat - ketikan tidak lagi
   * terasa tersendat pada katalog besar.
   */
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(
    () =>
      filterCatalog(
        catalog,
        {
          query: deferredQuery,
          categories,
          subcategories,
          brands: brandNames,
          types,
          applications,
          availabilities,
          sort,
        },
        loaded?.search ?? EMPTY_SEARCH_INDEX,
      ),
    [
      applications,
      availabilities,
      brandNames,
      catalog,
      categories,
      deferredQuery,
      loaded,
      sort,
      subcategories,
      types,
    ],
  );

  /**
   * Catat kata kunci pencarian ke analytics setelah pengunjung berhenti
   * mengetik. Yang paling berguna dari laporan ini adalah pencarian yang
   * menghasilkan nol produk - itu petunjuk langsung produk apa yang dicari
   * orang tetapi belum ada di katalog.
   */
  useEffect(() => {
    // Jumlah hasil baru bermakna setelah indeks katalog lengkap dimuat.
    if (!loaded) return;
    const term = deferredQuery.trim();
    if (term.length < 3) return;

    const timer = setTimeout(() => {
      trackEvent("catalog_search", {
        search_term: term.toLowerCase(),
        result_count: filtered.length,
      });
    }, SEARCH_TRACK_DELAY_MS);

    return () => clearTimeout(timer);
  }, [deferredQuery, filtered.length, loaded]);

  useEffect(() => {
    setSubcategories((current) => {
      const next = current.filter((item) => subcategoryOptions.includes(item));
      return next.length === current.length ? current : next;
    });
  }, [subcategoryOptions]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [applications, availabilities, brandNames, categories, deferredQuery, sort, subcategories, types]);

  const paged = filtered.slice(0, visibleCount);
  /** Sebelum indeks siap, kartu awal = batch pertama dari seluruh katalog. */
  const resultCount = loaded ? filtered.length : total;
  const remainingCount = resultCount - paged.length;
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

  categories.forEach((value) => {
    chips.push({
      key: `kategori-${value}`,
      label: categoryLabel(value),
      onRemove: () => setCategories(categories.filter((item) => item !== value)),
    });
  });
  pushChips("subkategori", subcategories, setSubcategories);
  pushChips("brand", brandNames, setBrandIds);
  pushChips("jenis", types, setTypes);
  pushChips("aplikasi", applications, setApplications);
  pushChips("stok", availabilities, setAvailabilities);

  const activeFilterCount = chips.length;
  const isFiltered = activeFilterCount > 0;
  /** Hanya tab kategori yang aktif (tanpa pencarian/filter lain). */
  const onlyCategory = Boolean(activeCategory) && activeFilterCount === 1;
  const scopeText = activeCategory ? ` di ${activeCategory.label}` : "";

  /**
   * Pengunjung sudah memakai filter/pencarian/urutan/"Tampilkan lebih banyak"
   * sebelum indeks katalog selesai dimuat: hasil belum bisa dihitung.
   */
  const waitingForIndex =
    !loaded && (isFiltered || sort !== "katalog" || visibleCount > PAGE_SIZE);

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
      {/* PANEL KATALOG: kategori -> subkategori -> pencarian & filter */}
      <div className="rounded-xl border border-line bg-surface p-4 shadow-card sm:p-6">
        {/* Navigasi kategori - bagian dari katalog, bukan section terpisah (Tahap 5F) */}
        <nav id="kategori" aria-label="Kategori produk" className="scroll-mt-24">
          <ul className={chipRowClass}>
            <li className="shrink-0">
              <button
                type="button"
                onClick={() => selectCategory(null)}
                aria-pressed={!activeCategory}
                className={tabClass(!activeCategory)}
              >
                Semua
                <span className={tabCountClass(!activeCategory)}>{total}</span>
              </button>
            </li>
            {categoryNav.map((item) => {
              const isActive = activeCategory?.category === item.category;
              return (
                <li key={item.category} className="shrink-0">
                  <a
                    href={item.href}
                    aria-current={isActive ? "true" : undefined}
                    onClick={(event) => {
                      if (opensLink(event)) return;
                      event.preventDefault();
                      selectCategory(item.category);
                    }}
                    className={tabClass(isActive)}
                  >
                    {item.label}
                    <span className={tabCountClass(isActive)}>{item.count}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          {subcategoryChips.length > 0 ? (
            <ul aria-label="Subkategori" className={cn(chipRowClass, "mt-3")}>
              {subcategoryChips.map((entry, index) => {
                const isActive = subcategories.includes(entry.name);
                const collapsed =
                  !showAllSubcategories && index >= SUBCATEGORY_PREVIEW && !isActive;
                const label = (
                  <>
                    {entry.name}
                    <span className="text-xs font-semibold tabular-nums text-ink-subtle">
                      {entry.count}
                    </span>
                  </>
                );

                return (
                  <li key={entry.name} className={cn("shrink-0", collapsed && "sm:hidden")}>
                    {entry.href ? (
                      <a
                        href={entry.href}
                        aria-current={isActive ? "true" : undefined}
                        onClick={(event) => {
                          if (opensLink(event)) return;
                          event.preventDefault();
                          toggleValue(entry.name, subcategories, setSubcategories);
                        }}
                        className={subChipClass(isActive)}
                      >
                        {label}
                      </a>
                    ) : (
                      <button
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => toggleValue(entry.name, subcategories, setSubcategories)}
                        className={subChipClass(isActive)}
                      >
                        {label}
                      </button>
                    )}
                  </li>
                );
              })}
              {subcategoryChips.length > SUBCATEGORY_PREVIEW &&
              (showAllSubcategories || collapsedSubcategoryCount > 0) ? (
                <li className="hidden shrink-0 sm:block">
                  <button
                    type="button"
                    onClick={() => setShowAllSubcategories((open) => !open)}
                    aria-expanded={showAllSubcategories}
                    className="inline-flex min-h-[36px] items-center px-2 text-sm font-semibold text-brand-700 underline-offset-4 transition-colors duration-200 hover:text-brand-600 hover:underline"
                  >
                    {showAllSubcategories
                      ? "Ringkas subkategori"
                      : `+${collapsedSubcategoryCount} subkategori lainnya`}
                  </button>
                </li>
              ) : null}
            </ul>
          ) : null}

          {pageLink ? (
            <Link
              href={pageLink.href}
              className="group mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors duration-200 hover:text-brand-600"
            >
              Buka halaman {pageLink.label}
              <ArrowRightIcon
                aria-hidden="true"
                width={16}
                height={16}
                className="transition-transform duration-200 ease-smooth group-hover:translate-x-1 motion-reduce:transform-none"
              />
            </Link>
          ) : null}
        </nav>

        {/* Pencarian + urutan (+ tombol filter di layar kecil) */}
        <div className="mt-4 flex flex-wrap gap-3 border-t border-line pt-4 sm:mt-5 sm:pt-5 lg:flex-nowrap">
          <div className="relative min-w-0 basis-full sm:flex-1 sm:basis-auto">
            <label htmlFor="product-search" className="sr-only">
              Cari produk
            </label>
            <SearchIcon
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle"
            />
            <input
              id="product-search"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={
                activeCategory
                  ? `Cari di ${activeCategory.label}: nama, model, brand...`
                  : "Nama produk, model, brand, atau kata kunci..."
              }
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

          <label htmlFor="product-sort" className="sr-only">
            Urutkan
          </label>
          <select
            id="product-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortId)}
            className="h-12 min-w-0 flex-1 rounded-lg border border-line-strong bg-surface px-3.5 text-[0.9375rem] text-ink transition-colors duration-200 hover:border-brand-300 focus:border-brand-500 focus:outline-none sm:w-56 sm:flex-none"
          >
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            aria-expanded={filtersOpen}
            aria-controls="product-filter-panel"
            className={cn(
              "inline-flex h-12 shrink-0 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-all duration-200 ease-smooth lg:hidden",
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

        {/* Filter lainnya: selalu tampil di desktop, dibuka lewat tombol "Filter" di layar kecil */}
        <div
          id="product-filter-panel"
          className={cn("lg:block", filtersOpen ? "block" : "hidden")}
        >
          <div className="mt-4 grid gap-4 border-t border-line pt-4 sm:mt-5 sm:grid-cols-2 sm:pt-5 lg:grid-cols-4 lg:gap-5">
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
              options={facets.types}
              values={types}
              onChange={setTypes}
              searchPlaceholder="Cari jenis produk..."
            />
            <MultiSelect
              id="filter-application"
              label="Aplikasi"
              placeholder="Semua aplikasi"
              noun="aplikasi"
              options={applicationOptions}
              values={applications}
              onChange={setApplications}
              searchPlaceholder="Cari bidang penggunaan..."
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">
                Ketersediaan
              </p>
              <div
                role="group"
                aria-label="Filter ketersediaan produk"
                className="mt-2.5 flex flex-wrap gap-2"
              >
                {facets.availabilities.map((option) => {
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
        </div>

        {/* Chip Filter Aktif */}
        {isFiltered ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4 sm:mt-5 sm:pt-5">
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
      <p aria-live="polite" className="mt-5 text-sm text-ink-subtle">
        {waitingForIndex ? (
          loadFailed ? (
            <>
              Katalog lengkap belum berhasil dimuat.{" "}
              <button
                type="button"
                onClick={() => setLoadAttempt((attempt) => attempt + 1)}
                className="font-semibold text-brand-700 underline-offset-4 transition-colors duration-200 hover:text-brand-600 hover:underline"
              >
                Coba lagi
              </button>
            </>
          ) : (
            "Memuat katalog lengkap..."
          )
        ) : hasMore ? (
          <>
            Menampilkan <span className="font-semibold text-ink">{paged.length}</span> dari{" "}
            {resultCount} produk
            {isFiltered && !onlyCategory ? " yang cocok" : null}
            {scopeText}
          </>
        ) : isFiltered ? (
          onlyCategory ? (
            <>
              <span className="font-semibold text-ink">{resultCount}</span> produk{scopeText}
            </>
          ) : (
            <>
              <span className="font-semibold text-ink">{resultCount}</span> produk cocok
              {scopeText || ` dari ${total} produk`}
            </>
          )
        ) : (
          <>
            <span className="font-semibold text-ink">{total}</span> produk ditemukan
          </>
        )}
      </p>

      {/* Grid Produk */}
      <ul
        aria-busy={waitingForIndex || undefined}
        className={cn(
          "mt-4 grid gap-6 transition-opacity duration-200 sm:grid-cols-2 lg:grid-cols-3",
          waitingForIndex && "opacity-60",
        )}
      >
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
      {hasMore && !waitingForIndex ? (
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
      {filtered.length === 0 && !waitingForIndex ? (
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