import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { ArrowLeftIcon, DownloadIcon, MailIcon } from "@/components/ui/icons";
import { COMPANY_PHOTO } from "@/lib/images";
import { quoteHref } from "@/lib/quote";
import { formatRupiah } from "@/lib/utils";
import type { Product } from "@/types";

/**
 * Header halaman detail produk: gaya sama dengan PageHero (dark green + aksen gold)
 * agar halaman baru terasa satu kesatuan dengan Artha Labs.
 * Desktop: [ gambar ] | [ informasi ]. Mobile: gambar -> informasi -> CTA.
 */
export function ProductHeader({ product }: { product: Product }) {
  // Ringkasan spesifikasi kunci. Semuanya dari data produk, tidak ada teks tetap.
  const meta = [
    { label: "Brand", value: product.brand },
    { label: "Model", value: product.model },
    { label: "Kategori", value: product.category },
    { label: "Subkategori", value: product.subcategory },
    { label: "Jenis Produk", value: product.productType },
    { label: "Ketersediaan", value: product.availability },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-brand-900 text-white">
      {/* Latar foto perusahaan - sama dengan header halaman lain agar konsisten */}
      <Image
        src={COMPANY_PHOTO}
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      <div aria-hidden="true" className="hero-scrim absolute inset-0 -z-10" />
      <div aria-hidden="true" className="divider-gold absolute inset-x-0 bottom-0 h-px" />

      <Container width="wide" className="relative py-10 lg:py-14">
        <Breadcrumb
          tone="invert"
          items={[
            { label: "Home", href: "/" },
            { label: "Artha Labs", href: "/artha-labs" },
            { label: product.name },
          ]}
        />

        <Link
          href="/artha-labs#katalog"
          className="mt-5 inline-flex min-h-[40px] items-center gap-2 text-sm font-semibold text-white/80 transition-colors duration-200 hover:text-accent-300"
        >
          <ArrowLeftIcon aria-hidden="true" />
          Kembali ke Artha Labs
        </Link>

        <div className="mt-6 grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Gambar produk - rasio tetap agar tidak terpotong di mobile */}
          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-xl border border-white/15 bg-white/95 p-2.5 shadow-card">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface-strong">
                {/* TODO: ganti dengan konten asli */}
                <Image
                  src={product.image}
                  alt={product.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Informasi produk + CTA */}
          <div className="lg:col-span-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-accent-400/50 bg-accent-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent-300">
                {product.category}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
                {product.brand}
              </span>
            </div>

            <h1 className="mt-4 text-display text-white">{product.name}</h1>
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-accent-300">
              {product.model}
            </p>

            {/* HARGA - bersumber dari field `price` di data produk, bukan ditulis di sini */}
            <p className="mt-4 text-3xl font-bold text-white">
              {typeof product.price === "number" ? (
                formatRupiah(product.price)
              ) : (
                <span className="text-xl font-semibold text-white/80">Harga atas permintaan</span>
              )}
            </p>

            <p className="mt-4 max-w-content text-base leading-relaxed text-white/75">
              {product.shortDescription}
            </p>

            <dl className="mt-7 grid gap-4 border-t border-white/15 pt-6 sm:grid-cols-3">
              {meta.map((item) => (
                <div key={item.label}>
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-300">
                    {item.label}
                  </dt>
                  <dd className="mt-1.5 text-sm text-white">{item.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={quoteHref(product)} variant="accent" size="lg">
                <MailIcon aria-hidden="true" width={18} height={18} />
                Minta Penawaran
              </Button>
              {/* Tombol brosur hanya tampil bila produk benar-benar punya file PDF */}
              {product.brochureUrl ? (
                <Button
                  href={product.brochureUrl}
                  variant="inverted"
                  size="lg"
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  <DownloadIcon aria-hidden="true" width={18} height={18} />
                  Download Brochure
                </Button>
              ) : (
                <Button href="/artha-labs#katalog" variant="inverted" size="lg">
                  Lihat Katalog
                </Button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
