import Link from "next/link";

import { ActivityCategoryIcon } from "@/components/sections/ActivityCategoryIcon";
import { ActivityCover } from "@/components/sections/ActivityCover";
import { ArrowRightIcon, MapPinIcon } from "@/components/ui/icons";
import { isEventActivity, type ActivityListItem } from "@/lib/activity-meta";
import { cn, formatDateID, formatDateRangeID } from "@/lib/utils";

/**
 * Kartu satu entri Activity.
 *
 * Seluruh area kartu dapat diklik menuju halaman detail. Caranya sama persis
 * dengan ProductCard: tautan pada judul diberi overlay `after:` yang menutupi
 * kartu, sehingga hanya ada SATU tautan di dalam kartu - tidak ada anchor
 * bersarang, dan pembaca layar tetap membaca judul sebagai tujuan tautan.
 *
 * Susunan (atas ke bawah): sampul + badge kategori -> meta -> judul -> ringkasan
 * -> baris penutup (topik + ajakan baca). Judul dan ringkasan dipotong dengan
 * line-clamp agar tinggi kartu seragam berapa pun panjang tulisannya - penting
 * saat daftar tumbuh menjadi puluhan artikel.
 *
 * Hover mengikuti bahasa kartu "Nilai Perusahaan" di About: kartu terangkat
 * sedikit dan garis aksen tipis tumbuh di sisi atas.
 *
 * Dua tampilan:
 * - "default"  : sampul di atas, teks di bawah. Dipakai di grid.
 * - "featured" : dua kolom di layar besar. Dipakai untuk satu tulisan sorotan.
 * - "compact"  : kartu kecil - sampul, kategori, tanggal, dan judul saja. Dipakai
 *                 pada carousel di halaman About agar banyak kartu muat satu layar.
 */
type ActivityCardProps = {
  /** Cukup data kartu (tanpa isi artikel); `Activity` lengkap juga diterima. */
  activity: ActivityListItem;
  variant?: "default" | "featured" | "compact";
  /** Muat gambar lebih awal untuk kartu yang tampil di layar pertama. */
  eager?: boolean;
  className?: string;
};

export function ActivityCard({
  activity,
  variant = "default",
  eager = false,
  className,
}: ActivityCardProps) {
  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";
  const isEvent = isEventActivity(activity);

  /** Kegiatan menampilkan rentang tanggal acara, artikel menampilkan tanggal terbit. */
  const dateLabel = activity.endDate
    ? formatDateRangeID(activity.date, activity.endDate)
    : formatDateID(activity.date);

  /**
   * Chip penutup kartu: topik Panduan bila ada (paling berguna untuk memindai
   * daftar panjang), disusul tag pada kartu sorotan. Tanpa topik: tag pertama.
   */
  const tagList = activity.tags ?? [];
  const chips = activity.topic
    ? [activity.topic, ...(isFeatured ? tagList.slice(0, 2) : [])]
    : tagList.slice(0, isFeatured ? 3 : 1);

  return (
    <article
      className={cn(
        "group/card relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-card transition-all duration-300 ease-smooth hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover focus-within:border-brand-300 focus-within:shadow-card-hover motion-reduce:transform-none",
        isFeatured && "lg:flex-row",
        className,
      )}
    >
      {/* Garis aksen tipis yang tumbuh saat hover - sama dengan kartu nilai di About */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-brand-600 to-accent-400 transition-transform duration-300 ease-smooth group-hover/card:scale-x-100 motion-reduce:transition-none"
      />

      <div className={cn("relative shrink-0", isFeatured && "lg:w-[54%]")}>
        <ActivityCover
          activity={activity}
          eager={eager}
          sizes={
            isFeatured
              ? "(max-width: 1024px) 100vw, 54vw"
              : isCompact
                ? "(max-width: 768px) 100vw, 400px"
                : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          }
          className={cn(
            isCompact ? "aspect-[2/1]" : "aspect-[16/10]",
            isFeatured && "lg:absolute lg:inset-0 lg:aspect-auto",
          )}
        />
        <span
          className={cn(
            "absolute inline-flex items-center gap-1.5 rounded-full border border-accent-400/30 bg-brand-900/85 font-semibold uppercase text-accent-300 backdrop-blur-sm",
            isCompact
              ? "left-2.5 top-2.5 px-2 py-0.5 text-[0.625rem] tracking-[0.1em]"
              : "left-4 top-4 px-2.5 py-1 text-[0.6875rem] tracking-[0.12em]",
          )}
        >
          <ActivityCategoryIcon
            category={activity.category}
            width={isCompact ? 10 : 12}
            height={isCompact ? 10 : 12}
          />
          {activity.category}
        </span>
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col",
          isCompact ? "p-3.5" : "p-5 sm:p-6",
          isFeatured && "lg:justify-center lg:p-10",
        )}
      >
        {/* Meta: tanggal, lalu estimasi waktu baca (khusus artikel) */}
        <div
          className={cn(
            "flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-subtle",
            isCompact ? "text-[0.6875rem]" : "text-xs",
          )}
        >
          <time dateTime={activity.date} className="font-medium text-brand-600">
            {dateLabel}
          </time>
          {!isEvent ? (
            <>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent-400" />
              <span>{activity.readingMinutes} menit baca</span>
            </>
          ) : null}
        </div>

        <h3
          className={cn(
            "font-semibold text-ink",
            isCompact ? "mt-2" : "mt-3",
            isFeatured
              ? "text-xl sm:text-2xl lg:text-[1.75rem] lg:leading-tight"
              : isCompact
                ? "line-clamp-2 text-sm leading-snug"
                : "line-clamp-2 text-lg leading-snug",
          )}
        >
          <Link
            href={`/activity/${activity.slug}`}
            className="rounded transition-colors duration-200 after:absolute after:inset-0 after:content-[''] group-hover/card:text-brand-700"
          >
            {activity.title}
          </Link>
        </h3>

        {!isCompact && activity.location ? (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-subtle">
            <MapPinIcon aria-hidden="true" width={14} height={14} className="shrink-0" />
            {activity.location}
          </p>
        ) : null}

        {!isCompact ? (
          <p
            className={cn(
              "mt-3 leading-relaxed text-ink-muted",
              isFeatured ? "text-base" : "line-clamp-3 text-sm",
            )}
          >
            {activity.excerpt}
          </p>
        ) : null}

        {/* Baris penutup: topik di kiri, ajakan baca di kanan (tidak dipakai pada varian compact) */}
        {!isCompact ? (
        <div className={cn(isFeatured ? "mt-7" : "mt-auto pt-5")}>
          <div className="flex items-center justify-between gap-3 border-t border-line pt-4">
            <ul className="flex min-w-0 flex-wrap gap-1.5" aria-label="Topik">
              {chips.map((chip) => (
                <li
                  key={chip}
                  className="max-w-[10rem] truncate rounded-full border border-line bg-surface-muted px-2.5 py-0.5 text-xs text-ink-muted"
                >
                  {chip}
                </li>
              ))}
            </ul>
            <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors duration-200 group-hover/card:text-brand-600">
              {isEvent ? "Lihat detail" : "Baca artikel"}
              <ArrowRightIcon
                aria-hidden="true"
                className="transition-transform duration-200 ease-smooth group-hover/card:translate-x-1 motion-reduce:transform-none"
              />
            </span>
          </div>
        </div>
        ) : null}
      </div>
    </article>
  );
}
