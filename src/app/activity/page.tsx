import { ActivityGrid } from "@/components/sections/ActivityGrid";
import { ActivityTopics } from "@/components/sections/ActivityTopics";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { withActivityImages } from "@/lib/activity-images";
import { activities } from "@/lib/data/activities";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Activity",
  description:
    "Catatan teknis seputar pemilihan, penggunaan, dan perawatan alat laboratorium, serta rekam jejak kegiatan CV Artha Falah Utama.",
  path: "/activity",
  keywords: [
    "panduan alat laboratorium",
    "cara menggunakan alat laboratorium",
    "cara memilih alat laboratorium",
    "perawatan alat lab",
    "troubleshooting alat laboratorium",
    "penyimpanan reagen",
    "kegiatan perusahaan",
  ],
});

/**
 * Halaman Activity.
 *
 * Menampilkan catatan teknis dan kegiatan perusahaan
 * dalam bentuk card.
 */
export default function ActivityPage() {
  return (
    <>
      <PageHero
        eyebrow="Activity"
        // @ts-expect-error: PageHero aslinya menerima string, kita paksa kirim ReactNode agar bisa pakai warna
        title={
          <>
            Catatan Teknis <span className="text-brand-300">dan Kegiatan Kami</span>
          </>
        }
        description="Pertanyaan yang paling sering masuk ke tim kami soal pemilihan, penggunaan, dan perawatan alat laboratorium, kami tulis ulang di sini. Ditambah catatan kegiatan yang kami jalankan bersama klien dan mitra."
        actions={
          <>
            <Button href="#tulisan" variant="accent" size="lg">
              Jelajahi tulisan
            </Button>

            <Button href="/contact" variant="inverted" size="lg">
              Tanya tim kami
            </Button>
          </>
        }
        aside={<ActivityTopics />}
      />

      <Section id="tulisan" tone="soft" width="wide">
        {/* Gambar sampul dilengkapi di sini (Server Component - fs) sesuai urutan
            entri, lalu dioper ke bawah. Lihat src/lib/activity-images.ts. */}
        <ActivityGrid activities={withActivityImages(activities)} />
      </Section>
    </>
  );
}