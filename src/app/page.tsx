import { BrandMarquee } from "@/components/sections/BrandMarquee";
import { CtaBand } from "@/components/sections/CtaBand";
import { HomeCatalogRow } from "@/components/sections/HomeCatalogRow";
import { HomeCategories } from "@/components/sections/HomeCategories";
import { HomeGuides } from "@/components/sections/HomeGuides";
import { HomeHero } from "@/components/sections/HomeHero";
import { TestimonialCarousel } from "@/components/sections/TestimonialCarousel";
import { Section, SectionHeading } from "@/components/ui/Section";
import { testimonials } from "@/lib/data/testimonials";
import { HOME_TITLE, TITLE_BRAND, createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = createPageMetadata({
  // Beranda memakai judul lengkap (sudah memuat brand) - lihat HOME_TITLE di lib/seo.ts.
  title: TITLE_BRAND,
  absoluteTitle: HOME_TITLE,
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
 * Structured data WebSite - hanya di beranda. Membantu Google menentukan nama
 * situs di hasil pencarian. Semua nilai sudah tampil di situs (tidak ada klaim
 * baru). Sengaja TANPA SearchAction: fitur kotak pencarian sitelinks sudah
 * dihentikan Google.
 */
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: TITLE_BRAND,
  alternateName: siteConfig.name,
  url: siteConfig.url,
  inLanguage: "id-ID",
};

/**
 * Halaman About.
 *
 * Susunan sejak Tahap R2 (redesign beranda):
 *
 *   1. Hero              : perkenalan + foto gedung (struktur tidak diubah)
 *   2. Brand Mitra       : marquee logo (tidak diubah)
 *   3. Kategori          : dua panel kategori katalog + lini bisnis ringkas
 *   4. Dari katalog      : 4 produk pertama urutan katalog
 *   5. Testimoni         : hanya tampil bila datanya ada
 *   6. Panduan           : 1 tulisan utama + daftar tulisan terbaru
 *   7. Pita ajakan       : menuju halaman Kontak / WhatsApp
 *   8. Footer            : dirender global di layout.tsx
 *
 * Section di bawah hero muncul halus saat masuk layar lewat komponen `Reveal`
 * (lihat catatan di components/ui/Reveal.tsx: isi tidak pernah tersembunyi di
 * HTML dari server).
 */
export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      {/* 1. Hero / Company Introduction */}
      <HomeHero />

      {/* 2. Brand Mitra Artha Labs - daftar brand yang sama dengan halaman Artha Labs */}
      <BrandMarquee
        title="Brand yang kami sediakan"
        headingId="brand-marquee-about"
        className="py-7 lg:py-8"
      />

      {/* 3. Kategori katalog + lini bisnis - teks dari category-pages.ts & about.ts */}
      <HomeCategories />

      {/* 4. Cuplikan katalog */}
      <HomeCatalogRow />

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

      {/* 6. Tulisan terbaru (menggantikan carousel Activity) */}
      <HomeGuides />

      {/* 7. Pita ajakan */}
      <CtaBand />
    </>
  );
}
