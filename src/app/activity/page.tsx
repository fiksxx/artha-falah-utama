import { ActivityGrid } from "@/components/sections/ActivityGrid";
import { ActivityTopics } from "@/components/sections/ActivityTopics";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { toActivityListItem } from "@/lib/activity-meta";
import { withActivityImages } from "@/lib/activity-images";
import { activities } from "@/lib/data/activities";
import { createPageMetadata, jsonLdScript, pageJsonLd } from "@/lib/seo";

/** Dipakai meta description dan JSON-LD halaman agar keduanya selalu sama. */
const PAGE_DESCRIPTION =
  "Catatan teknis seputar pemilihan, penggunaan, dan perawatan alat laboratorium, serta rekam jejak kegiatan CV Artha Falah Utama.";

export const metadata = createPageMetadata({
  title: "Panduan & Artikel Alat Laboratorium",
  description: PAGE_DESCRIPTION,
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
  const pageSchema = pageJsonLd({
    type: "CollectionPage",
    path: "/activity",
    // Sama dengan teks H1 halaman ini.
    name: "Catatan Teknis dan Kegiatan Kami",
    description: PAGE_DESCRIPTION,
  });

  return (
    <>
      {/* Jenis halaman untuk mesin pencari (Tahap S4) - tidak menampilkan apa pun. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(pageSchema) }}
      />

      <PageHero
        eyebrow="Aktivitas"
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
        // Latar sama dengan halaman /artha-labs (Tahap R5A), bukan foto gedung.
        backgroundSrc="/images/artha-labs-hero.png"
      />

      <Section id="tulisan" tone="soft" width="wide">
        {/* Gambar sampul dilengkapi di sini (Server Component - fs) sesuai urutan
            entri, lalu dioper ke bawah. Lihat src/lib/activity-images.ts.
            Isi artikel (body) dibuang dulu: daftar hanya butuh data kartu. */}
        <ActivityGrid activities={withActivityImages(activities).map(toActivityListItem)} />
      </Section>
    </>
  );
}