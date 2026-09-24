import { ActivityCategoryIcon } from "@/components/sections/ActivityCategoryIcon";
import {
  activities,
  activityCategoryDescription,
  usedActivityCategories,
} from "@/lib/data/activities";

/**
 * Panel "Topik" di sisi kanan hero Activity.
 *
 * Fungsinya sama dengan foto toko di hero Artha Labs: memberi halaman ini
 * karakternya sendiri. Di sini artinya peta isi - tiga jenis tulisan, apa
 * bedanya, dan berapa banyak yang sudah ada. Sengaja hanya informasi
 * (bukan tautan): penyaringan dilakukan pada daftar tulisan di bawahnya.
 *
 * Seluruh isinya dibaca dari data Activity, jadi ikut menyesuaikan sendiri
 * saat kategori atau tulisan bertambah.
 */
export function ActivityTopics() {
  return (
    // Disembunyikan di bawah lg: pada layar sempit, hero cukup teks + tombol, dan
    // kategori sudah tersedia sebagai filter tepat di bawahnya.
    <div className="hidden rounded-xl border border-accent-400/30 bg-brand-950/45 px-6 py-5 backdrop-blur-sm lg:block">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-300">
        Topik yang kami tulis
      </p>

      <ul className="mt-3 divide-y divide-white/10">
        {usedActivityCategories.map((category) => {
          const count = activities.filter((activity) => activity.category === category).length;

          return (
            <li key={category} className="flex items-start gap-4 py-4 first:pt-3 last:pb-1">
              <span
                aria-hidden="true"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-accent-400/30 bg-white/5 text-accent-300"
              >
                <ActivityCategoryIcon category={category} width={20} height={20} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[0.9375rem] font-semibold text-white">{category}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-white/65">
                  {activityCategoryDescription[category]}
                </p>
              </div>

              <span className="shrink-0 pt-0.5 text-xs font-medium tabular-nums text-white/60">
                {count} tulisan
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
