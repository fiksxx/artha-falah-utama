import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { ArrowLeftIcon, DownloadIcon, MailIcon } from "@/components/ui/icons";
import {
  categoryHref,
  getProductCategoryTrail,
  subcategoryHref,
} from "@/lib/data/category-pages";
import { quoteHref } from "@/lib/quote";
import { cn, formatRupiah } from "@/lib/utils";
import type { Product } from "@/types";

/**
 * Header halaman detail produk (Tahap R4): latar terang, tanpa foto gedung.
 * Fokusnya foto produk dan tombol penawaran; gayanya mengikuti kartu produk
 * (foto utuh di ubin abu muda, brand hijau, model huruf mono).
 * Desktop: [ gambar ] | [ informasi ]. Mobile: gambar -> informasi -> CTA.
 */
export function ProductHeader({ product }: { product: Product }) {
  const trail = getProductCategoryTrail(product);

  // Ringkasan spesifikasi kunci. Semuanya dari data produk, tidak ada teks tetap.
  const meta = [
    { label: "Brand", value: product.brand },
    { label: "Model", value: product.model, mono: true },
    { label: "Kategori", value: product.category },
    { label: "Subkategori", value: product.subcategory },
    { label: "Jenis Produk", value: product.productType },
    { label: "Ketersediaan", value: product.availability },
  ];

  return (
    <section className="border-b border-line bg-surface">
      <Container width="wide" className="py-8 lg:py-12">
        {/* Breadcrumb: Home / Artha Labs / Kategori / Subkategori / Produk.
            Kategori & subkategori hanya ditautkan bila halamannya ada
            (lihat lib/data/category-pages.ts). */}
        <Breadcrumb
          items={[
            { label: "Beranda", href: "/" },
            { label: "Artha Labs", href: "/artha-labs" },
            ...(trail.category
              ? [{ label: trail.category.label, href: categoryHref(trail.category) }]
              : []),
            ...(trail.category && trail.subcategory
              ? [
                  {
                    label: trail.subcategory.name,
                    href: subcategoryHref(trail.category, trail.subcategory),
                  },
                ]
              : []),
            { label: product.name },
          ]}
        />

        <Link
          href="/artha-labs#katalog"
          className="mt-3 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-brand-700 transition-colors duration-200 hover:text-brand-600"
        >
          <ArrowLeftIcon aria-hidden="true" />
          Kembali ke Artha Labs
        </Link>

        <div className="mt-4 grid items-start gap-8 lg:grid-cols-12 lg:gap-14">
          {/* Gambar produk - tampil utuh (object-contain) di ubin abu muda */}
          <div className="lg:col-span-6">
            <div className="aspect-[4/3] rounded-xl bg-surface-muted p-6 sm:p-10">
              <div className="relative h-full w-full">
                {/* TODO: ganti dengan konten asli */}
                <Image
                  src={product.image}
                  alt={product.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain mix-blend-multiply"
                />
              </div>
            </div>
          </div>

          {/* Informasi produk + CTA */}
          <div className="lg:col-span-6">
            <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[0.9375rem]">
              <span className="font-semibold text-brand-700">{product.brand}</span>
              <span className="break-words font-mono text-sm text-ink-subtle">{product.model}</span>
            </p>

            <h1 className="mt-3 text-[clamp(1.75rem,1.1rem+2.2vw,2.75rem)] font-semibold leading-[1.12] tracking-[-0.025em] text-ink">
              {product.name}
            </h1>

            <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
              {/* HARGA - bersumber dari field `price` di data produk, bukan ditulis di sini */}
              <span className="text-2xl font-semibold text-ink">{formatRupiah(product.price)}</span>
              {/* Status stok - warna hanya pendukung, statusnya tetap tertulis */}
              <span className="inline-flex items-center gap-2 text-[0.9375rem] text-ink-muted">
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-2 w-2 rounded-full",
                    product.availability === "Tersedia" ? "bg-brand-500" : "bg-accent-500",
                  )}
                />
                {product.availability}
              </span>
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={quoteHref(product)} variant="primary" size="lg">
                <MailIcon aria-hidden="true" width={18} height={18} />
                Minta Penawaran
              </Button>
              {/* Tombol brosur hanya tampil bila produk benar-benar punya file PDF */}
              {product.brochureUrl ? (
                <Button
                  href={product.brochureUrl}
                  variant="secondary"
                  size="lg"
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  <DownloadIcon aria-hidden="true" width={18} height={18} />
                  Download Brochure
                </Button>
              ) : (
                <Button href="/artha-labs#katalog" variant="secondary" size="lg">
                  Lihat Katalog
                </Button>
              )}
            </div>

            <dl className="mt-8 grid gap-x-10 border-t border-line sm:grid-cols-2">
              {meta.map((item) => (
                <div
                  key={item.label}
                  className="flex items-baseline justify-between gap-4 border-b border-line py-3"
                >
                  <dt className="shrink-0 text-sm text-ink-subtle">{item.label}</dt>
                  <dd
                    className={cn(
                      "min-w-0 break-words text-right text-sm font-medium text-ink",
                      item.mono && "font-mono font-normal",
                    )}
                  >
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
