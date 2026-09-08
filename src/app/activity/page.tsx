import { ActivityGrid } from "@/components/sections/ActivityGrid";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Aktivitas",
  description:
    "Rekam jejak kegiatan CV Artha Falah Utama: partisipasi pameran industri, pekerjaan instalasi laboratorium, dan kegiatan pendukung lainnya.",
  path: "/activity",
  keywords: ["pameran", "instalasi laboratorium", "kegiatan perusahaan"],
});

export default function ActivityPage() {
  return (
    <>
      <PageHero
        eyebrow="Aktivitas"
        title="Rekam jejak kegiatan kami"
        description="Dokumentasi pameran, instalasi, dan kegiatan lain yang telah kami jalankan bersama klien dan mitra."
      />

      <Section width="wide">
        <ActivityGrid />
      </Section>
    </>
  );
}
