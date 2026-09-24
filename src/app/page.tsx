import { ActivityCarousel } from "@/components/sections/ActivityCarousel";
import { BrandMarquee } from "@/components/sections/BrandMarquee";
import { BusinessScope } from "@/components/sections/BusinessScope";
import { HomeHero } from "@/components/sections/HomeHero";
import { QuickNavCards } from "@/components/sections/QuickNavCards";
import { TestimonialCarousel } from "@/components/sections/TestimonialCarousel";
import { Section, SectionHeading } from "@/components/ui/Section";
import { testimonials } from "@/lib/data/testimonials";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "About",
  description:
    "Profil CV Artha Falah Utama: pemasok reagen, alat laboratorium, dan alat kesehatan melalui Artha Labs untuk institusi, industri, dan fasilitas kesehatan.",
  path: "/",
  keywords: [
    "profil perusahaan",
    "Artha Labs",
    "distributor alat laboratorium",
    "reagen",
    "alat kesehatan",
  ],
});

/**
 * Halaman About.
 *
 * Header (hero) tidak diubah. Section navigasi, testimoni, dan Activity dibuat ringkas
 * (`spacing="sm"`); section Lini bisnis sengaja lega dan panjang (`spacing="md"`).
 *
 *   1. Hero              : perkenalan + foto gedung (full-width)
 *   2. Brand Mitra       : bukti sosial paling cepat dicerna (marquee logo)
 *   3. Navigation Cards  : arahkan pengunjung ke halaman tujuan
 *   4. Lini bisnis       : blok editorial selang-seling (gambar kiri/kanan) yang panjang ke bawah
 *   5. Testimoni         : 3 kartu terlihat, bergeser satu kartu tiap 4 detik
 *   6. Activity          : 3 kartu terlihat, bergeser satu kartu tiap 3 detik (bolak-balik)
 *   7. Footer            : dirender global di layout.tsx
 *
 * Seluruh judul section memakai komponen `SectionHeading` - jangan menulis
 * ulang pola judul + garis emas secara manual di sini.
 */
export default function AboutPage() {
  return (
    <>
      {/* 1. Hero / Company Introduction */}
      <HomeHero />

      {/* 2. Brand Mitra Artha Labs - daftar brand yang sama dengan halaman Artha Labs */}
      <BrandMarquee
        title="Brand mitra Artha Labs"
        headingId="brand-marquee-about"
        className="py-7 lg:py-8"
      />

      {/* 3. Navigation Cards */}
      <Section id="navigasi" spacing="sm" width="wide">
        <SectionHeading
          title="Apa yang bisa Anda temukan"
        />
        <div className="mt-6">
          <QuickNavCards />
        </div>
      </Section>

      {/* 4. Lini bisnis & cakupan produk - teks bersumber dari lib/data/about.ts */}
      <BusinessScope />

      {/* 5. Testimoni Pelanggan - data di lib/data/testimonials.ts (saat ini dummy) */}
      {testimonials.length > 0 ? (
        <Section id="testimoni" tone="soft" spacing="sm" width="wide">
          <SectionHeading
            title="Testimoni Pelanggan"
            description="Pengalaman pelanggan yang bekerja sama dengan kami."
          />
          <div className="mt-6">
            <TestimonialCarousel />
          </div>
        </Section>
      ) : null}

      {/* 6. Activity - 3 kartu terlihat, bergeser satu kartu tiap 3 detik */}
      <ActivityCarousel />
    </>
  );
}
