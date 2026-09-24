import Image from "next/image";
import { BrandMarquee } from "@/components/sections/BrandMarquee";
import { PageHero } from "@/components/sections/PageHero";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Artha Labs",
  description:
    "Katalog Artha Labs: reagen, alat laboratorium, dan alat kesehatan dari brand mitra, lengkap dengan dukungan teknis dan layanan purna jual.",
  path: "/artha-labs",
  keywords: ["reagen", "alat laboratorium", "alat kesehatan", "supplier lab"],
});

/** Photo frame dengan foto asli Artha Labs (1024x549). */
function PhotoFrame({ className }: { className?: string }) {
  return (
    <div
      className={`relative flex overflow-hidden rounded-xl border border-accent-400/30 bg-brand-950 ${className ?? ""}`}
    >
      <Image
        src="/images/artha-labs-hero.png"
        alt="Fasilitas dan produk Artha Labs"
        width={1024}
        height={549}
        priority
        className="h-auto w-full object-cover opacity-60"
        sizes="(min-width: 1024px) 50vw, 100vw"
      />

      {/* Overlay gradasi supaya label tetap terbaca di atas foto.
          Memakai token brand-950, bukan hitam murni, agar menyatu dengan palet. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-brand-950/15 to-transparent"
      />

      {/* Label */}
      <div className="absolute bottom-0 w-full border-t border-white/10 bg-brand-950/30 px-5 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-300">Artha Labs</p>
      </div>
    </div>
  );
}

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
        aside={<PhotoFrame />}
      />

      <BrandMarquee />

      <Section id="katalog" width="wide">
        <SectionHeading size="display" title="Katalog Produk Artha Labs" />
        <div className="mt-10">
          <ProductGrid />
        </div>
      </Section>
    </>
  );
}