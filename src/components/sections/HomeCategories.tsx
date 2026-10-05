import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { categoryHref, categoryPages, subcategoryHref } from "@/lib/data/category-pages";
import { cn } from "@/lib/utils";

/** Jumlah subkategori yang ditampilkan sebagai jalan pintas di tiap panel. */
const SUBCATEGORY_PREVIEW = 4;

/**
 * Foto panel per kategori (kunci = slug halaman kategori). File lokal yang
 * sudah ada di /public/images. Kategori tanpa entri tampil tanpa foto.
 */
const PANEL_PHOTO: Record<string, { src: string; alt: string; position: string }> = {
  "alat-laboratorium": {
    src: "/images/activities/activity-15.png",
    alt: "Teknisi bersarung tangan menyetel komponen instrumen laboratorium",
    position: "object-[38%_50%]",
  },
  reagen: {
    src: "/images/gambar-reagen.png",
    alt: "Botol reagen dan bahan kimia laboratorium",
    position: "object-[50%_60%]",
  },
};

/**
 * Beranda - "Jual Reagen, Alat Laboratorium, dan Alat Kesehatan" (Tahap R2).
 *
 * Menggantikan kartu navigasi dan pita hijau lini bisnis yang lama:
 *   1. Judul + deskripsi (teks yang sama dengan sebelumnya).
 *   2. Satu panel per kategori katalog: kategori dengan produk terbanyak tampil
 *      lebar dan gelap, lainnya terang. Jumlah produk, teks pengantar, dan
 *      tautan subkategori diambil dari lib/data/category-pages.ts, jadi selalu
 *      sama dengan halaman kategori.
 *
 * Tahap P1: tiga blok lini bisnis dihapus dari beranda atas permintaan pemilik;
 * datanya (lib/data/about.ts) tidak dihapus.
 */
export function HomeCategories() {
  // Kategori dengan produk terbanyak tampil lebih dulu (panel lebar di kiri).
  const pages = [...categoryPages].sort((a, b) => b.products.length - a.products.length);
  const largest = pages[0]?.products.length ?? 0;

  return (
    <Section id="lini-bisnis" spacing="md" width="wide">
      <SectionHeading
        title="Jual Reagen, Alat Laboratorium, dan Alat Kesehatan"
        description="Artha Labs menyediakan kebutuhan laboratorium, dari reagen dan bahan habis pakai hingga instrumen dan peralatan, untuk penelitian, pendidikan, pengujian, dan kegiatan operasional."
      />

      <Reveal stagger className="mt-9 grid gap-6 lg:grid-cols-12">
        {pages.map((page) => {
          const primary = page.products.length === largest;
          const photo = PANEL_PHOTO[page.slug];
          const shortcuts = page.subcategories
            .filter((entry) => entry.hasPage)
            .slice(0, SUBCATEGORY_PREVIEW);
          const subcategoryCount = page.subcategories.length;

          return (
            <RevealItem
              key={page.slug}
              className={cn(primary ? "lg:col-span-8" : "lg:col-span-4")}
            >
              <article
                className={cn(
                  "flex h-full overflow-hidden rounded-2xl",
                  primary
                    ? "flex-col bg-brand-900 text-white md:flex-row"
                    : "flex-col border border-line bg-surface-muted",
                )}
              >
                {photo && !primary ? (
                  <div className="relative h-52 shrink-0">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className={cn("object-cover", photo.position)}
                    />
                  </div>
                ) : null}

                <div className={cn("flex flex-1 flex-col p-7", primary && "md:basis-[58%] md:p-10")}>
                  <p className={cn("text-[0.9375rem]", primary ? "text-white/85" : "text-ink-muted")}>
                    <span
                      className={cn("font-mono", primary ? "text-accent-300" : "text-brand-700")}
                    >
                      {page.products.length}
                    </span>{" "}
                    produk
                    {subcategoryCount > 1 ? ` dalam ${subcategoryCount} subkategori` : ""}
                  </p>
                  <h3
                    className={cn(
                      "mt-2.5 text-2xl font-semibold leading-[1.15] tracking-[-0.02em]",
                      primary ? "text-white" : "text-ink",
                    )}
                  >
                    {page.label}
                  </h3>
                  <p
                    className={cn(
                      "mt-3 text-[0.9375rem] leading-[1.6]",
                      primary ? "text-white/85" : "text-ink-muted",
                    )}
                  >
                    {page.intro}
                  </p>

                  {shortcuts.length > 0 ? (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {shortcuts.map((entry) => (
                        <li key={entry.slug}>
                          <Link
                            href={subcategoryHref(page, entry)}
                            className={cn(
                              "inline-flex min-h-[44px] items-center gap-2.5 rounded-lg border px-3.5 text-[0.9375rem] font-medium transition-colors duration-200 ease-smooth",
                              primary
                                ? "border-white/30 text-white hover:border-accent-300 hover:bg-white/10"
                                : "border-line-strong bg-surface text-ink hover:border-brand-300 hover:text-brand-700",
                            )}
                          >
                            {entry.name}
                            <span
                              className={cn(
                                "font-mono text-[0.8125rem]",
                                primary ? "text-accent-300" : "text-ink-subtle",
                              )}
                            >
                              {entry.products.length}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <div className="mt-auto pt-7">
                    <Button
                      href={categoryHref(page)}
                      variant={primary ? "accent" : "secondary"}
                      size="md"
                      className="text-center"
                    >
                      Buka kategori {page.label}
                    </Button>
                  </div>
                </div>

                {photo && primary ? (
                  <div className="relative min-h-[190px] md:min-h-[260px] md:basis-[42%]">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={cn("object-cover", photo.position)}
                    />
                  </div>
                ) : null}
              </article>
            </RevealItem>
          );
        })}
      </Reveal>
    </Section>
  );
}
