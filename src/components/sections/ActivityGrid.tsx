"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { ActivityCard } from "@/components/sections/ActivityCard";
import { Button } from "@/components/ui/Button";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";
import {
  activities as baseActivities,
  activityCategoryDescription,
  featuredActivity as baseFeaturedActivity,
  guideTopicDescription,
  usedActivityCategories,
  usedGuideTopics,
} from "@/lib/data/activities";
import { normalizeText } from "@/lib/utils";
import type { Activity, ActivityCategory, ActivityTopic } from "@/types";

type Filter = ActivityCategory | "Semua";
type TopicFilter = ActivityTopic | "Semua topik";

type ActivityGridProps = {
  /**
   * Seluruh entri Activity, SUDAH dilengkapi gambar sampul lokal (lihat
   * src/lib/activity-images.ts). Dihitung sekali di Server Component pemanggil
   * (src/app/activity/page.tsx) lalu dioper ke sini - komponen ini "use client"
   * sehingga tidak bisa membaca berkas gambar sendiri.
   */
  activities: Activity[];
};

const filters: readonly Filter[] = ["Semua", ...usedActivityCategories] as const;
const topicFilters: readonly TopicFilter[] = ["Semua topik", ...usedGuideTopics] as const;

/**
 * Jumlah kartu per batch. Kelipatan 3 agar baris grid selalu penuh di desktop.
 * Daftar tumbuh menjadi puluhan tulisan, jadi sisanya dimuat lewat tombol
 * "Tampilkan lebih banyak" - pola yang sama dengan katalog Artha Labs.
 */
const PAGE_SIZE = 9;

/** Jumlah tulisan per kategori - tampil pada tab filter. Dihitung sekali. */
const filterCounts: Record<Filter, number> = {
  Semua: baseActivities.length,
  Insight: 0,
  Panduan: 0,
  Kegiatan: 0,
};
baseActivities.forEach((activity) => {
  filterCounts[activity.category] += 1;
});

/** Jumlah artikel Panduan per topik - tampil pada filter tingkat dua. */
const topicCounts: Partial<Record<TopicFilter, number>> = {
  "Semua topik": filterCounts.Panduan,
};
baseActivities.forEach((activity) => {
  if (activity.topic) topicCounts[activity.topic] = (topicCounts[activity.topic] ?? 0) + 1;
});

/**
 * Indeks pencarian, dibangun SEKALI saat modul dimuat (bukan tiap ketikan).
 * Mencakup judul, ringkasan, kategori, topik Panduan, lokasi, dan tag
 * (tag memuat nama alat, mis. "Micropipette", "pH meter").
 */
const searchIndex: ReadonlyMap<string, string> = new Map(
  baseActivities.map((activity) => [
    activity.id,
    normalizeText(
      [
        activity.title,
        activity.excerpt,
        activity.category,
        activity.topic ?? "",
        activity.location ?? "",
        ...(activity.tags ?? []),
      ].join(" "),
    ),
  ]),
);

/**
 * Daftar konten Activity.
 *
 * Susunannya mengikuti cara orang membaca halaman semacam ini: satu tulisan
 * sorotan di paling atas, lalu alat bantu menemukan (kategori + pencarian),
 * baru daftar selengkapnya. Kartu sorotan hanya muncul pada tampilan "Semua"
 * tanpa kata kunci - begitu pengunjung memilih kategori atau mencari, mereka
 * sedang menelusuri sesuatu yang spesifik, jadi daftar langsung disajikan
 * tanpa perantara dan tanpa ada entri yang tampil dua kali.
 */
export function ActivityGrid({ activities }: ActivityGridProps) {
  const [activeFilter, setActiveFilter] = useState<Filter>("Semua");
  const [activeTopic, setActiveTopic] = useState<TopicFilter>("Semua topik");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const prefersReducedMotion = useReducedMotion();

  /** Penyaringan memakai nilai "tertunda" agar ketikan tetap ringan saat daftar besar. */
  const deferredQuery = useDeferredValue(query);
  const needle = normalizeText(deferredQuery);
  const isSearching = needle !== "";

  /** Filter topik hanya berlaku di dalam kategori Panduan. */
  const showTopics = activeFilter === "Panduan" && topicFilters.length > 2;
  const topicFilter = showTopics ? activeTopic : "Semua topik";

  /** Entri sorotan (dengan gambar lokal) dicari lewat id dari daftar yang diterima lewat props. */
  const featuredActivity = useMemo(
    () => activities.find((item) => item.id === baseFeaturedActivity?.id),
    [activities],
  );

  const matches = useMemo(
    () =>
      activities.filter((activity) => {
        if (activeFilter !== "Semua" && activity.category !== activeFilter) return false;
        if (topicFilter !== "Semua topik" && activity.topic !== topicFilter) return false;
        if (!isSearching) return true;
        return searchIndex.get(activity.id)?.includes(needle) ?? false;
      }),
    [activities, activeFilter, topicFilter, isSearching, needle],
  );

  const selectCategory = (next: Filter) => {
    setActiveFilter(next);
    setActiveTopic("Semua topik");
  };

  const showFeatured = activeFilter === "Semua" && !isSearching && Boolean(featuredActivity);

  // Entri sorotan sudah tampil di atas - jangan diulang di grid.
  const listed = useMemo(
    () => (showFeatured ? matches.filter((item) => item.id !== featuredActivity?.id) : matches),
    [matches, showFeatured, featuredActivity],
  );

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeFilter, topicFilter, needle]);

  const paged = listed.slice(0, visibleCount);
  const remainingCount = listed.length - paged.length;

  const resetAll = () => {
    selectCategory("Semua");
    setQuery("");
  };

  /** Keterangan di bawah filter: topik bila dipilih, kalau tidak kategori. */
  const helperText =
    topicFilter !== "Semua topik"
      ? guideTopicDescription[topicFilter]
      : activeFilter === "Semua"
        ? "Catatan teknis, panduan penggunaan alat, dan rekam jejak kegiatan kami."
        : activityCategoryDescription[activeFilter];

  return (
    <div>
      {showFeatured && featuredActivity ? (
        <div className="mb-6 lg:mb-8">
          <ActivityCard activity={featuredActivity} variant="featured" eager />
        </div>
      ) : null}

      {/* Alat bantu menemukan: kategori di kiri, pencarian di kanan */}
      <div
        className={
          showFeatured
            ? "flex flex-col gap-5 border-t border-line pt-8 lg:flex-row lg:items-center lg:justify-between"
            : "flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"
        }
      >
        <FilterTabs
          label="Filter kategori konten"
          options={filters}
          value={activeFilter}
          onChange={selectCategory}
          counts={filterCounts}
        />

        <div className="relative w-full lg:w-80">
          <label htmlFor="activity-search" className="sr-only">
            Cari tulisan
          </label>
          <SearchIcon
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle"
          />
          <input
            id="activity-search"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari topik atau alat..."
            autoComplete="off"
            className="h-11 w-full rounded-lg border border-line-strong bg-surface pl-11 pr-11 text-[0.9375rem] text-ink transition-colors duration-200 placeholder:text-ink-subtle hover:border-brand-300 focus:border-brand-500 focus:outline-none"
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

      {/* Filter tingkat dua: topik Panduan. Muncul hanya saat kategori Panduan dipilih. */}
      {showTopics ? (
        <div className="mt-4 flex flex-col gap-2 rounded-xl border border-line bg-surface-muted/70 p-4 sm:flex-row sm:items-start sm:gap-4">
          <p className="shrink-0 pt-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">
            Topik
          </p>
          <FilterTabs
            label="Filter topik panduan"
            options={topicFilters}
            value={topicFilter}
            onChange={setActiveTopic}
            counts={topicCounts}
            size="sm"
          />
        </div>
      ) : null}

      {/* Keterangan kategori/topik + jumlah hasil */}
      <div className="mt-4 flex flex-col gap-1 text-sm text-ink-subtle sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <p className="max-w-xl leading-relaxed">{helperText}</p>
        <p aria-live="polite" className="shrink-0">
          <span className="font-semibold text-ink">{matches.length}</span> tulisan
          {isSearching ? <> untuk &ldquo;{deferredQuery.trim()}&rdquo;</> : null}
        </p>
      </div>

      <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {paged.map((activity, index) => (
            <motion.li
              key={activity.id}
              layout={!prefersReducedMotion}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <ActivityCard activity={activity} eager={index < 3 && !showFeatured} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {remainingCount > 0 ? (
        <div className="mt-10 flex flex-col items-center gap-2.5">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          >
            Tampilkan lebih banyak
          </Button>
          <p className="text-sm text-ink-subtle">{remainingCount} tulisan lainnya belum ditampilkan</p>
        </div>
      ) : null}

      {matches.length === 0 ? (
        <div className="mt-8 rounded-xl border border-line bg-surface-muted px-6 py-14 text-center">
          <span
            aria-hidden="true"
            className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-700"
          >
            <SearchIcon />
          </span>
          <h3 className="mt-4 text-lg font-semibold text-ink">Tulisan tidak ditemukan</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
            {isSearching
              ? "Coba kata kunci lain, atau pilih kategori yang berbeda."
              : "Belum ada tulisan pada kategori ini."}
          </p>
          <Button type="button" variant="secondary" className="mt-6" onClick={resetAll}>
            Tampilkan semua tulisan
          </Button>
        </div>
      ) : null}
    </div>
  );
}