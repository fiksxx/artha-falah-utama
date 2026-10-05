import { BrandMarquee } from "@/components/sections/BrandMarquee";
import { PageHero } from "@/components/sections/PageHero";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import {
  catalogTotal,
  getCatalogCategoryNav,
  getCatalogFacets,
  getInitialCatalogItems,
} from "@/lib/data/catalog-index";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Katalog Reagen & Alat Laboratorium",
  description:
    "Katalog Artha Labs: reagen, alat laboratorium, dan alat kesehatan dari brand mitra, lengkap dengan dukungan teknis dan layanan purna jual.",
  path: "/artha-labs",
  keywords: ["reagen", "alat laboratorium", "alat kesehatan", "supplier lab"],
});

export default function ArthaLabsPage() {
  return (
    <>
      <PageHero
        eyebrow="Artha Labs"
        // @ts-expect-error: PageHero aslinya menerima string, kita paksa kirim ReactNode agar bisa pakai warna
        title={
          <>
            Reagen, Alat Laboratorium,{" "}
            <span className="text-brand-300">dan Alat Kesehatan</span>
          </>
        }
        description="Kebutuhan laboratorium sehari-hari, dari bahan habis pakai hingga instrumen dan alat kesehatan. Jelajahi katalog atau kirimkan daftar kebutuhan Anda."
        actions={
          <>
            <Button href="#katalog" variant="accent" size="lg">
              Lihat katalog
            </Button>
            <Button href="/contact" variant="inverted" size="lg">
              Minta Penawaran
            </Button>
          </>
        }
        // Latar: foto showroom Artha Labs (bukan foto gedung), tanpa foto pendamping.
        backgroundSrc="/images/artha-labs-hero.png"
        textWidth="wide"
      />

      <BrandMarquee />

      {/* Satu section katalog (Tahap 5F): navigasi kategori ada di dalam panel
          katalog. Tautan kategori & subkategori tetap dirender di server agar
          setiap halaman kategori dapat ditemukan mesin pencari. */}
      <Section id="katalog" width="wide">
        <SectionHeading size="display" title="Katalog Produk Artha Labs" />
        <div className="mt-8">
          {/* Batch pertama & pilihan filter dihitung di server; katalog lengkap
              diunduh sebagai JSON ringan oleh ProductGrid (lihat lib/catalog.ts). */}
          <ProductGrid
            initialItems={getInitialCatalogItems()}
            facets={getCatalogFacets()}
            categoryNav={getCatalogCategoryNav()}
            total={catalogTotal}
          />
        </div>
      </Section>
    </>
  );
}