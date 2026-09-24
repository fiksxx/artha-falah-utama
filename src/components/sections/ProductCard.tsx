import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons";
import { quoteHref } from "@/lib/quote";
import { cn, formatRupiah } from "@/lib/utils";
import type { Product } from "@/types";

/**
 * Fallback gambar bila src produk kosong atau tidak valid.
 *
 * Warna ditulis sebagai hex karena data URI tidak bisa membaca CSS variable.
 * Nilainya sengaja disamakan dengan token palet: %23EDF3EF = `surface-strong`,
 * %235F6C64 = `ink-subtle`. Bila token itu berubah, ubah juga dua nilai di sini.
 */
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23EDF3EF'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%235F6C64' font-family='sans-serif' font-size='14'>Gambar tidak tersedia</text></svg>";

function getSafeImageUrl(src?: string | null): string {
  if (!src || typeof src !== "string") {
    return PLACEHOLDER_IMAGE;
  }

  const clean = src.trim();
  if (!clean) {
    return PLACEHOLDER_IMAGE;
  }

  if (
    clean.startsWith("/") ||
    clean.startsWith("http://") ||
    clean.startsWith("https://") ||
    clean.startsWith("data:")
  ) {
    return clean;
  }

  // Menambahkan slash di awal jika path lokal ditulis tanpa '/' (misal: "images/...")
  return `/${clean}`;
}

type ProductCardProps = {
  product: Product;
  /** Muat gambar lebih awal untuk kartu yang tampil di viewport pertama. */
  eager?: boolean;
  sizes?: string;
  className?: string;
};

/**
 * Kartu produk katalog - dipakai di grid Artha Labs dan section Related Products.
 * Seluruh area kartu bisa diklik menuju halaman detail (overlay `after:` pada judul),
 * sementara CTA "Minta penawaran" tetap menjadi link terpisah di atasnya (z-10).
 */
export function ProductCard({
  product,
  eager = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  className,
}: ProductCardProps) {
  const safeImageSrc = getSafeImageUrl(product.image);

  return (
    <article
      className={cn(
        "group/card relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-card transition-all duration-300 ease-smooth hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover focus-within:border-brand-300 focus-within:shadow-card-hover motion-reduce:transform-none",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-strong">
        <Image
          src={safeImageSrc}
          alt={product.imageAlt || product.name || "Gambar produk"}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          className="object-cover transition-transform duration-500 ease-smooth group-hover/card:scale-[1.04] motion-reduce:transform-none"
        />
        {/* Badge kategori di atas gambar - hijau gelap + teks gold */}
        <span className="absolute left-3 top-3 inline-flex rounded-full bg-brand-900/85 px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-accent-300 backdrop-blur-sm">
          {product.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
          <span className="truncate">{product.brand}</span>
          <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-accent-400" />
          <span className="shrink-0 text-ink-subtle">{product.model}</span>
        </div>
        <p className="mt-1.5 text-xs text-ink-subtle">{product.subcategory}</p>

        <h3 className="mt-2.5 text-lg font-semibold text-ink">
          {/* Overlay link: membuat seluruh kartu clickable tanpa nested anchor */}
          <Link
            href={`/artha-labs/${product.slug}`}
            className="rounded transition-colors duration-200 after:absolute after:inset-0 after:content-[''] group-hover/card:text-brand-700"
          >
            {product.name}
          </Link>
        </h3>
        {/* HARGA - selalu dari data produk (field `price`), tidak pernah ditulis di komponen */}
        <p className="mt-2.5 text-lg font-bold text-brand-800">{formatRupiah(product.price)}</p>

        {/* Status stok - warna hanya pendukung, statusnya tetap tertulis sebagai teks */}
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted">
          <span
            aria-hidden="true"
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              product.availability === "Tersedia" ? "bg-brand-500" : "bg-accent-400",
            )}
          />
          {product.availability}
        </p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pt-5">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors duration-200 group-hover/card:text-brand-600">
            Lihat detail
            <ArrowRightIcon
              aria-hidden="true"
              className="transition-transform duration-200 ease-smooth group-hover/card:translate-x-1 motion-reduce:transform-none"
            />
          </span>
          {/* CTA tetap ada & tetap bisa diklik di atas overlay kartu */}
          <Link
            href={quoteHref(product)}
            aria-label={`Minta penawaran untuk ${product.name}`}
            className="relative z-10 inline-flex min-h-[40px] items-center text-sm font-semibold text-accent-700 underline-offset-4 transition-colors duration-200 hover:text-accent-600 hover:underline"
          >
            Minta penawaran
          </Link>
        </div>
      </div>
    </article>
  );
}