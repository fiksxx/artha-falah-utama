import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { ActivityCover } from "@/components/sections/ActivityCover";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { isEventActivity } from "@/lib/data/activities";
import { cn, formatDateID, formatDateRangeID } from "@/lib/utils";
import type { Activity } from "@/types";

/**
 * Header halaman detail Activity.
 *
 * Komposisinya dua kolom di layar besar - teks di kiri, sampul di kanan -
 * mengikuti pola ProductHeader. Sampul mengisi ruang yang sebelumnya kosong,
 * dan gambar tidak lagi muncul dua kali (di header dan di awal isi artikel).
 *
 *   Desktop : [ kategori, judul, ringkasan, meta ] | [ sampul ]
 *   Mobile  : kategori, judul, ringkasan, meta, lalu sampul
 *
 * Tahap R5A: latar terang tanpa foto gedung, mengikuti header halaman produk.
 * Kategori dan topik ditulis dengan huruf biasa; tanggal, lokasi, dan waktu
 * baca tetap dari data artikel.
 */
export function ActivityHeader({ activity }: { activity: Activity }) {
  const isEvent = isEventActivity(activity);

  const dateLabel = activity.endDate
    ? formatDateRangeID(activity.date, activity.endDate)
    : formatDateID(activity.date);

  /** Ringkasan metadata. Hanya field yang benar-benar ada di data yang ditampilkan. */
  const meta: Array<{ label: string; value: string; dateTime?: string }> = [
    { label: isEvent ? "Tanggal" : "Diterbitkan", value: dateLabel, dateTime: activity.date },
  ];
  if (activity.location) meta.push({ label: "Lokasi", value: activity.location });
  if (!isEvent) meta.push({ label: "Waktu baca", value: `${activity.readingMinutes} menit` });

  return (
    <section className="border-b border-line bg-surface">
      <Container width="wide" className="py-8 lg:py-12">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <Breadcrumb
            items={[
              { label: "Beranda", href: "/" },
              { label: "Aktivitas", href: "/activity" },
              { label: activity.title },
            ]}
          />
          <Link
            href="/activity"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-brand-700 transition-colors duration-200 hover:text-brand-600"
          >
            <ArrowLeftIcon aria-hidden="true" />
            Kembali ke Aktivitas
          </Link>
        </div>

        <div className="mt-6 grid items-center gap-8 lg:mt-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            {/* Eyebrow: kategori dengan titik emas, gaya yang sama dengan hero About */}
            <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.9375rem] font-semibold text-brand-700">
              {activity.category}
              {activity.topic ? (
                <>
                  <span aria-hidden="true" className="text-ink-subtle">
                    /
                  </span>
                  <span className="font-medium text-ink-muted">{activity.topic}</span>
                </>
              ) : null}
            </p>

            <h1 className="mt-3 text-[clamp(1.75rem,1.1rem+2.2vw,2.75rem)] font-semibold leading-[1.14] tracking-[-0.025em] text-ink">
              {activity.title}
            </h1>

            <p className="mt-5 max-w-content text-base leading-relaxed text-ink-muted lg:text-lg">
              {activity.excerpt}
            </p>

            {/* Metadata - gaya yang sama dengan ringkasan spesifikasi di ProductHeader */}
            <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-5">
              {meta.map((item) => (
                <div key={item.label}>
                  <dt className="text-sm text-ink-subtle">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-[0.9375rem] font-medium text-ink">
                    {item.dateTime ? (
                      <time dateTime={item.dateTime}>{item.value}</time>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/*
            Sampul dalam bingkai - pola yang sama dengan foto di hero Artha Labs.
            Sampul brand (tanpa foto) murni dekoratif: di bawah lg ia hanya akan
            mendorong isi artikel ke bawah, jadi baru tampil saat mengisi kolom
            kanan. Foto sungguhan tetap tampil di semua ukuran layar.
          */}
          <div className={cn("lg:col-span-5", !activity.image && "hidden lg:block")}>
            <div className="relative overflow-hidden rounded-xl bg-surface-muted">
              <ActivityCover
                activity={activity}
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="aspect-[16/9] lg:aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
