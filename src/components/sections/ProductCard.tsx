import Image from "next/image";
import Link from "next/link";

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

/**
 * Kolom produk yang dipakai kartu. Sengaja dipersempit (bukan `Product` penuh)
 * agar katalog bisa memakai indeks ringan tanpa spesifikasi & deskripsi.
 */
export type ProductCardData = Pick<
  Product,
  | "slug"
  | "name"
  | "brand"
  | "model"
  | "category"
  | "subcategory"
  | "price"
  | "availability"
  | "image"
  | "imageAlt"
>;

type ProductCardProps = {
  product: ProductCardData;
  /** Muat gambar lebih awal untuk kartu yang tampil di viewport pertama. */
  eager?: boolean;
  sizes?: string;
  className?: string;
};

/**
 * Kartu produk katalog - dipakai di beranda, grid Artha Labs, halaman kategori,
 * dan section Produk Terkait. Tampilan sejak Tahap R3A: border tipis tanpa
 * bayangan, foto utuh di ubin abu muda, model memakai huruf mono, harga dan
 * status dalam satu baris.
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
        "group/card relative flex h-full flex-col overflow-hidden rounded-xl border border-brand-200/80 bg-brand-50 transition duration-300 ease-smooth hover:-translate-y-[3px] hover:border-brand-300 focus-within:border-brand-300 motion-reduce:transform-none",
        className,
      )}
    >
      {/* Ubin gambar: foto produk tampil UTUH (object-contain) di atas latar abu
          muda. mix-blend-multiply membuat latar putih foto menyatu dengan ubin. */}
      <div className="aspect-[4/3] bg-surface p-5">
        <div className="relative h-full w-full">
          <Image
            src={safeImageSrc}
            alt={product.imageAlt || product.name || "Gambar produk"}
            fill
            sizes={sizes}
            loading={eager ? "eager" : "lazy"}
            className="object-contain mix-blend-multiply transition-transform duration-300 ease-smooth group-hover/card:scale-[1.02] motion-reduce:transform-none"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-2 pt-4">
        <p className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-[0.8125rem]">
          <span className="font-semibold text-brand-700">{product.brand}</span>
          {/* Nomor model / katalog memakai huruf mono agar mudah dibandingkan */}
          <span className="break-words font-mono text-ink-subtle">{product.model}</span>
        </p>

        <h3 className="mt-2 text-[1.0625rem] font-semibold leading-snug text-ink">
          {/* Overlay link: membuat seluruh kartu clickable tanpa nested anchor */}
          <Link
            href={`/artha-labs/${product.slug}`}
            className="rounded transition-colors duration-200 after:absolute after:inset-0 after:content-[''] group-hover/card:text-brand-700"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-1.5 text-sm text-ink-subtle">{product.subcategory}</p>

        <div className="mt-auto pt-4">
          <div className="flex flex-wrap items-center justify-between gap-x-4 border-t border-brand-100 pt-1.5">
            <p className="flex items-center gap-3 text-sm">
              {/* HARGA - selalu dari data produk (field `price`), tidak pernah ditulis di komponen */}
              <span className="font-semibold text-ink">{formatRupiah(product.price)}</span>
              {/* Status stok - warna hanya pendukung, statusnya tetap tertulis sebagai teks */}
              <span className="inline-flex items-center gap-1.5 text-ink-muted">
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
            {/* CTA tetap ada & tetap bisa diklik di atas overlay kartu */}
            <Link
              href={quoteHref(product)}
              aria-label={`Minta penawaran untuk ${product.name}`}
              className="relative z-10 inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-700 underline-offset-4 transition-colors duration-200 hover:text-brand-600 hover:underline"
            >
              Minta penawaran
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
