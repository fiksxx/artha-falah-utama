import Image from "next/image";
import { BrandMarquee } from "@/components/sections/BrandMarquee";
import { PageHero } from "@/components/sections/PageHero";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Artha Labs",
  description:
    "Artha Labs menyediakan reagen, alat laboratorium, dan alat kesehatan dari brand mitra terpercaya, lengkap dengan dukungan teknis dan purna jual.",
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

      {/* Overlay gradasi supaya label tetap terbaca di atas foto */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
      />

      {/* Label */}
      <div className="absolute bottom-0 w-full border-t border-white/10 bg-black/20 px-5 py-3">
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
        title="Reagen, alat lab, dan alat kesehatan"
        description="Lini bisnis Artha Labs menangani kebutuhan laboratorium: dari bahan habis pakai hingga instrumen presisi dan alat kesehatan."
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
        <h2 className="text-display font-bold uppercase tracking-[0.06em] text-brand-900">
          Katalog Produk Artha Labs
        </h2>
        <span aria-hidden="true" className="mt-3 block h-1 w-16 rounded-full bg-accent-400" />
        <div className="mt-10">
          <ProductGrid />
        </div>
      </Section>
    </>
  );
}