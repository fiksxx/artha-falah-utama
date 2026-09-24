import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { ActivityCover } from "@/components/sections/ActivityCover";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { isEventActivity } from "@/lib/data/activities";
import { COMPANY_PHOTO } from "@/lib/images";
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
 * Latar, scrim, garis emas, eyebrow, dan garis aksen di bawah judul memakai
 * bahasa yang sama dengan PageHero/About agar terasa satu sistem. Judul memakai
 * skala `text-4xl` yang sama dengan hero halaman lain (turun ke `text-3xl` di
 * layar kecil karena judul artikel berupa kalimat panjang).
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
    <section className="relative isolate overflow-hidden bg-brand-950 text-white">
      {/* Latar foto perusahaan + scrim - sama dengan PageHero dan ProductHeader */}
      <Image
        src={COMPANY_PHOTO}
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      <div aria-hidden="true" className="hero-scrim absolute inset-0 -z-10" />
      <div aria-hidden="true" className="divider-gold absolute inset-x-0 bottom-0 z-10 h-px" />

      <Container width="wide" className="relative py-10 lg:py-14">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <Breadcrumb
            tone="invert"
            items={[
              { label: "Home", href: "/" },
              { label: "Activity", href: "/activity" },
              { label: activity.title },
            ]}
          />
          <Link
            href="/activity"
            className="inline-flex min-h-[40px] items-center gap-2 text-sm font-semibold text-white/80 transition-colors duration-200 hover:text-accent-300"
          >
            <ArrowLeftIcon aria-hidden="true" />
            Kembali ke Activity
          </Link>
        </div>

        <div className="mt-6 grid items-center gap-8 lg:mt-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            {/* Eyebrow: kategori dengan titik emas, gaya yang sama dengan hero About */}
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-accent-300">
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400"
              />
              {activity.category}
              {activity.topic ? (
                <>
                  <span aria-hidden="true" className="text-accent-400/70">
                    /
                  </span>
                  <span className="text-white/75">{activity.topic}</span>
                </>
              ) : null}
            </p>

            <h1 className="mt-5 text-3xl leading-tight text-white sm:text-4xl">{activity.title}</h1>

            <span aria-hidden="true" className="mt-6 block h-1 w-16 rounded-full bg-accent-400" />

            <p className="mt-6 max-w-content text-base leading-relaxed text-white/80 lg:text-lg">
              {activity.excerpt}
            </p>

            {/* Metadata - gaya yang sama dengan ringkasan spesifikasi di ProductHeader */}
            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/15 pt-6">
              {meta.map((item) => (
                <div key={item.label}>
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-300">
                    {item.label}
                  </dt>
                  <dd className="mt-1.5 text-sm text-white">
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
            <div className="relative overflow-hidden rounded-xl border border-accent-400/30 bg-brand-950 shadow-card-hover">
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
