import Image from "next/image";

import { ActivityCategoryIcon } from "@/components/sections/ActivityCategoryIcon";
import { cn } from "@/lib/utils";
import type { Activity } from "@/types";

type ActivityCoverProps = {
  activity: Pick<Activity, "category" | "topic" | "image" | "imageAlt">;
  /** Atribut `sizes` next/image - hanya dipakai bila artikel punya foto. */
  sizes: string;
  /** Preload (LCP) untuk sampul yang tampil di layar pertama, mis. header artikel. */
  priority?: boolean;
  /** Muat segera (tanpa lazy) untuk kartu di layar pertama. */
  eager?: boolean;
  /** Ukuran/rasio ditentukan pemanggil, mis. `aspect-[16/10]`. */
  className?: string;
};

/**
 * Sampul satu entri Activity.
 *
 * - Bila `image` diisi: foto memenuhi area (object-cover).
 * - Bila kosong: sampul bergaya brand (gradien hijau gelap, pola titik, ikon
 *   kategori). Artikel teknis tidak perlu menunggu foto agar tampil rapi, dan
 *   tidak ada kotak abu-abu "foto belum tersedia" di halaman publik.
 *
 * Efek zoom-on-hover mengikuti kartu induk (`group/card`); di header artikel
 * tidak ada grup itu sehingga sampul tetap diam.
 */
export function ActivityCover({
  activity,
  sizes,
  priority = false,
  eager = false,
  className,
}: ActivityCoverProps) {
  return (
    <div className={cn("relative overflow-hidden bg-surface-strong", className)}>
      {activity.image ? (
        <Image
          src={activity.image}
          alt={activity.imageAlt ?? ""}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : eager ? "eager" : "lazy"}
          className="object-cover transition-transform duration-500 ease-smooth group-hover/card:scale-[1.03] motion-reduce:transform-none"
        />
      ) : (
        <div aria-hidden="true" className="surface-brand-deep absolute inset-0">
          <div className="cover-dots absolute inset-0" />

          {/* Ikon besar sebagai watermark, terpotong di sudut kanan-bawah */}
          <div className="absolute -bottom-[14%] -right-[6%] aspect-square h-[88%] text-accent-300/[0.13] transition-transform duration-500 ease-smooth origin-bottom-right group-hover/card:scale-105 motion-reduce:transform-none">
            <ActivityCategoryIcon
              category={activity.category}
              topic={activity.topic}
              strokeWidth={0.8}
              className="h-full w-full"
            />
          </div>

          {/* Ubin ikon kecil - jangkar visual di kiri-bawah */}
          <span className="absolute bottom-5 left-5 grid h-11 w-11 place-items-center rounded-lg border border-accent-400/40 bg-brand-950/40 text-accent-300 sm:h-12 sm:w-12">
            <ActivityCategoryIcon
              category={activity.category}
              topic={activity.topic}
              width={22}
              height={22}
            />
          </span>

          <div className="divider-gold absolute inset-x-0 bottom-0 h-px" />
        </div>
      )}
    </div>
  );
}
