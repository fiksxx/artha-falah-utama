import { ActivityCard } from "@/components/sections/ActivityCard";
import { LoopCarousel } from "@/components/sections/LoopCarousel";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { activityImageForPosition } from "@/lib/activity-images";
import { activities } from "@/lib/data/activities";

/**
 * Jumlah Activity yang dirotasi. Enam = dua halaman berisi 3 kartu. Angka ini sengaja
 * sama dengan jumlah file gambar bawaan (activity-01.png ... activity-06.png). Bila
 * dinaikkan (pilih kelipatan 3), sediakan file gambar tambahannya.
 */
const CAROUSEL_SIZE = 6;

/** Tiga kartu terlihat sekaligus; setiap 3 detik carousel bergeser satu kartu. */
const INTERVAL_MS = 3000;

/**
 * Activity di halaman About - 3 kartu terlihat, bergeser satu kartu setiap 3 detik.
 * Geraknya bolak-balik: ke kiri sampai kartu terakhir terlihat, lalu ke kanan sampai
 * kartu pertama terlihat, dan seterusnya.
 *
 * Kartu memakai ActivityCard varian "compact" (komponen yang sama dengan halaman
 * Activity), jadi setiap kartu tetap menuju halaman detail tulisannya. Isinya tulisan
 * terbaru kategori Insight dan Panduan, sesuai urutan di lib/data/activities.ts.
 *
 * GAMBAR: Activity ke-N memakai /images/activities/activity-0N.png (lihat
 * lib/activity-images.ts). Timpa file itu dengan gambar Anda dan kartu langsung
 * memakainya - tanpa mengubah kode.
 */
export function ActivityCarousel() {
  const items = activities
    .filter((activity) => activity.category !== "Kegiatan")
    .slice(0, CAROUSEL_SIZE)
    .map(({ body: _body, ...summary }, index) => ({
      ...summary,
      // Urutan ke-(index+1) -> activity-0(index+1).png. Bila file belum ada: sampul brand.
      image: activityImageForPosition(index + 1),
      imageAlt: `Dokumentasi: ${summary.title}`,
    }));

  if (items.length === 0) return null;

  return (
    <Section id="activity" spacing="sm" width="wide">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          title="Activity"
          description="Insight, panduan, dan informasi seputar laboratorium dari tim kami."
        />
        <Button
          href="/activity"
          variant="secondary"
          size="sm"
          className="shrink-0 self-start sm:self-auto"
        >
          Lihat semua
        </Button>
      </div>

      <LoopCarousel
        label="Activity terbaru"
        // eager: keenam gambar dimuat di awal (jumlahnya kecil) agar kartu berikutnya
        // sudah siap saat carousel bergeser - tanpa gambar yang muncul terlambat.
        slides={items.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} variant="compact" eager />
        ))}
        visibleWide={3}
        mode="bounce"
        intervalMs={INTERVAL_MS}
        transitionMs={800}
        className="mt-6"
      />
    </Section>
  );
}
