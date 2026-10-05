import Link from "next/link";

import { LoopCarousel } from "@/components/sections/LoopCarousel";
import { ProductCard } from "@/components/sections/ProductCard";
import { Section, SectionHeading } from "@/components/ui/Section";
import { catalogTotal, getInitialCatalogItems } from "@/lib/data/catalog-index";

/** Jumlah produk yang dirotasi di beranda (4 terlihat sekaligus di desktop). */
const ROW_SIZE = 8;

/** Setiap 3 detik deretan bergeser satu kartu ke kiri. */
const INTERVAL_MS = 3000;

/**
 * Beranda - cuplikan katalog (Tahap R2).
 *
 * Menampilkan beberapa produk PERTAMA dari urutan katalog yang sama dengan
 * halaman /artha-labs (getInitialCatalogItems), jadi tidak ada daftar "produk
 * unggulan" tersendiri yang harus dirawat. Memakai ProductCard yang sama.
 *
 * Tahap M4: deretan bergeser otomatis (LoopCarousel, pola "loop"). Carousel
 * berhenti saat kursor/fokus di atasnya dan menjadi deretan gulir manual bagi
 * pengguna "kurangi gerakan".
 */
export function HomeCatalogRow() {
  const items = getInitialCatalogItems().slice(0, ROW_SIZE);
  if (items.length === 0) return null;

  return (
    <Section id="dari-katalog" tone="muted" spacing="md" width="wide" className="border-y border-line">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading title="Dari katalog " />
        <Link
          href="/artha-labs"
          className="inline-flex min-h-[44px] shrink-0 items-center self-start text-base font-semibold text-brand-700 underline-offset-4 transition-colors duration-200 hover:text-brand-600 hover:underline sm:self-auto"
        >
          Lihat semua {catalogTotal} produk
        </Link>
      </div>

      <LoopCarousel
        label="Produk dari katalog"
        slides={items.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ))}
        visibleWide={4}
        mode="loop"
        intervalMs={INTERVAL_MS}
        transitionMs={800}
        className="mt-8"
      />
    </Section>
  );
}
