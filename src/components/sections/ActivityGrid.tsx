"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";

import { FilterTabs } from "@/components/ui/FilterTabs";
import { activityCategories, sortedActivities } from "@/lib/data/activities";
import { formatDateRangeID } from "@/lib/utils";
import type { ActivityCategory } from "@/types";

type Filter = ActivityCategory | "Semua";

const filters: readonly Filter[] = ["Semua", ...activityCategories] as const;

const categoryStyles: Record<ActivityCategory, string> = {
  Pameran: "bg-brand-50 text-brand-700",
  Instalasi: "bg-accent-50 text-accent-700",
  Lainnya: "bg-surface-strong text-ink-muted",
};

/** Grid kegiatan, sudah terurut dari tanggal terbaru ke terlama + filter kategori. */
export function ActivityGrid() {
  const [activeFilter, setActiveFilter] = useState<Filter>("Semua");
  const prefersReducedMotion = useReducedMotion();

  const visibleActivities = useMemo(
    () =>
      activeFilter === "Semua"
        ? sortedActivities
        : sortedActivities.filter((activity) => activity.category === activeFilter),
    [activeFilter],
  );

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs
          label="Filter kategori kegiatan"
          options={filters}
          value={activeFilter}
          onChange={setActiveFilter}
        />
        <p aria-live="polite" className="text-sm text-ink-subtle">
          {visibleActivities.length} kegiatan - terbaru ke terlama
        </p>
      </div>

      <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visibleActivities.map((activity, index) => (
            <motion.li
              key={activity.id}
              layout={!prefersReducedMotion}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-card transition-shadow duration-300 hover:shadow-card-hover">
                <div className="relative aspect-[3/2] overflow-hidden bg-surface-strong">
                  {/* TODO: ganti dengan konten asli */}
                  <Image
                    src={activity.image}
                    alt={activity.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading={index < 3 ? "eager" : "lazy"}
                    className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.03]"
                  />
                  <span
                    className={`absolute left-4 top-4 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${categoryStyles[activity.category]}`}
                  >
                    {activity.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <time
                    dateTime={activity.startDate}
                    className="text-sm font-medium text-brand-600"
                  >
                    {formatDateRangeID(activity.startDate, activity.endDate)}
                  </time>
                  <h3 className="mt-2 text-lg font-semibold text-ink">{activity.title}</h3>
                  {activity.location ? (
                    <p className="mt-1 text-sm text-ink-subtle">{activity.location}</p>
                  ) : null}
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    {activity.description}
                  </p>
                </div>
              </article>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {visibleActivities.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-line-strong bg-surface-muted p-8 text-center text-ink-muted">
          Belum ada kegiatan pada kategori ini.
        </p>
      ) : null}
    </div>
  );
}
