import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { ProductCard } from "@/components/sections/ProductCard";
import { ProductHeader } from "@/components/sections/ProductHeader";
import { ProductTabs, type ProductTab } from "@/components/sections/ProductTabs";
import { Button } from "@/components/ui/Button";
import { DetailTable } from "@/components/ui/DetailTable";
import { Section, SectionHeading } from "@/components/ui/Section";
import { BoxIcon, CheckIcon, MailIcon } from "@/components/ui/icons";
import { getProductBySlug, getRelatedProducts, products } from "@/lib/data/products";
import { quoteHref } from "@/lib/quote";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

/** Semua halaman detail dibuat otomatis dari data - tidak ada halaman hardcoded. */
export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return createPageMetadata({
      title: "Produk tidak ditemukan",
      description: "Produk yang Anda cari tidak tersedia di katalog Artha Labs.",
      path: `/artha-labs/${slug}`,
    });
  }

  return createPageMetadata({
    title: product.name,
    description: `${product.name} dari ${product.brand}, model ${product.model}. Kategori ${product.category}. Minta Penawaran melalui Artha Labs.`,
    path: `/artha-labs/${product.slug}`,
    image: product.image,
    keywords: [product.name, product.brand, product.model, product.category],
  });
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const paragraphs = product.description ?? [];
  const highlights = product.highlights ?? [];
  const packaging = product.packaging ?? [];
  const specifications = product.specifications ?? [];
  const additionalGroups = product.additionalInformation ?? [];
  const relatedProducts = getRelatedProducts(product);

  /** JSON-LD produk: hanya field yang datanya benar-benar tersedia. */
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.model,
    category: product.category,
    ...(paragraphs[0] ? { description: paragraphs[0] } : {}),
    image: `${siteConfig.url}${product.image}`,
    brand: { "@type": "Brand", name: product.brand },
    url: `${siteConfig.url}/artha-labs/${product.slug}`,
  };

  /*
   * TAB 1 - Detail Produk: deskripsi, poin penting, dan tabel spesifikasi.
   * Spesifikasi tidak lagi menjadi tab tersendiri: pengunjung langsung melihat
   * deskripsi lalu tabel spesifikasinya dalam satu layar gulir.
   */
  const hasHighlights = highlights.length > 0;
  const detailPanel = (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <div className={hasHighlights ? "lg:col-span-8" : "lg:col-span-12"}>
        {paragraphs.length > 0 ? (
          <div className="max-w-content space-y-4">
            {/* TODO: ganti dengan konten asli */}
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="text-base leading-relaxed text-ink-muted">
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          <InfoNote>
            Deskripsi lengkap produk ini belum tersedia di katalog. Tim kami dapat mengirimkan
            penjelasan produk bersama penawaran.
          </InfoNote>
        )}

        {/* Spesifikasi - tabel wajib, tampil langsung di bawah deskripsi */}
        <div className="mt-10 max-w-4xl border-t border-line pt-8">
          <h3 className="text-heading font-semibold text-ink">Spesifikasi</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Data teknis lengkap produk ini.
          </p>
          {specifications.length > 0 ? (
            <div className="mt-4">
              <DetailTable
                items={specifications}
                caption={`Spesifikasi Teknis ${product.name}`}
                labelHeader="Specification"
                valueHeader="Details"
              />
            </div>
          ) : (
            <InfoNote>
              Spesifikasi Teknis produk ini belum tercatat di katalog, sehingga tidak kami tampilkan
              agar informasinya tetap akurat. Kirim permintaan penawaran dan tim kami akan
              melampirkan datasheet resmi dari brand.
            </InfoNote>
          )}
        </div>
      </div>

      {hasHighlights ? (
        <aside className="lg:col-span-4">
          <div className="rounded-xl border border-line bg-surface p-6 shadow-card">
            <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-600">
              Poin Penting
            </h4>
            <ul className="mt-4 space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                  <span aria-hidden="true" className="mt-0.5 shrink-0 text-accent-500">
                    <CheckIcon width={18} height={18} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      ) : null}
    </div>
  );

  /* TAB 2 - Informasi Tambahan: packaging + grup informasi lain */
  const hasAdditional = packaging.length > 0 || additionalGroups.length > 0;
  const additionalPanel = hasAdditional ? (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      {packaging.length > 0 ? (
        <div className="lg:col-span-7">
          <h3 className="text-heading font-semibold text-ink">Informasi packaging</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Rincian isi kemasan, dimensi, dan bobot pengiriman produk ini.
          </p>
          <div className="mt-4">
            <DetailTable
              items={packaging}
              caption={`Informasi packaging ${product.name}`}
              labelHeader="Packaging"
              valueHeader="Detail"
            />
          </div>
        </div>
      ) : null}

      {additionalGroups.length > 0 ? (
        <div className={packaging.length > 0 ? "space-y-6 lg:col-span-5" : "space-y-6 lg:col-span-8"}>
          {additionalGroups.map((group) => (
            <div key={group.id} className="rounded-xl border border-line bg-surface p-6 shadow-card">
              <h3 className="text-base font-semibold text-ink">{group.title}</h3>
              {group.bullets && group.bullets.length > 0 ? (
                <ul className="mt-3 space-y-2.5">
                  {group.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                      <span aria-hidden="true" className="mt-0.5 shrink-0 text-accent-500">
                        <CheckIcon width={18} height={18} />
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
              {group.items && group.items.length > 0 ? (
                <dl className="mt-3 divide-y divide-line">
                  {group.items.map((item) => (
                    <div key={item.label} className="grid gap-1 py-2.5 sm:grid-cols-2">
                      <dt className="text-sm font-semibold text-ink">{item.label}</dt>
                      <dd className="text-sm leading-relaxed text-ink-muted">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {group.note ? (
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{group.note}</p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  ) : (
    <div className="max-w-3xl">
      <InfoNote>
        Informasi packaging, fitur, garansi, dan sertifikasi produk ini belum tersedia di katalog.
        Kami akan melampirkan keterangan lengkapnya pada dokumen penawaran.
      </InfoNote>
    </div>
  );

  const tabs: ProductTab[] = [
    { id: "detail", label: "Detail Produk", content: detailPanel },
    { id: "tambahan", label: "Informasi Tambahan", content: additionalPanel },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <ProductHeader product={product} />

      {/* INFORMASI PRODUK - 2 tab compact: detail (deskripsi + spesifikasi) dan informasi tambahan */}
      <Section width="wide">
        <SectionHeading title="Informasi Produk" />
        <ProductTabs tabs={tabs} className="mt-8" />

        {/* CTA ringkas - tetap satu design system, tidak memakai banner besar */}
        <div className="mt-10 flex flex-col gap-4 rounded-xl border border-accent-200 bg-accent-50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-ink">Butuh penawaran produk ini?</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">
              Subjek dan pesan akan otomatis terisi sesuai produk yang Anda buka.
            </p>
          </div>
          <Button href={quoteHref(product)} size="lg" className="shrink-0">
            <MailIcon aria-hidden="true" width={18} height={18} />
            Minta Penawaran
          </Button>
        </div>
      </Section>

      {/* RELATED PRODUCTS - hanya tampil bila ada produk lain yang relevan */}
      {relatedProducts.length > 0 ? (
        <Section tone="muted" width="wide" spacing="sm">
          <SectionHeading title="Produk Terkait" />
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((item) => (
              <li key={item.id} className="h-full">
                <ProductCard product={item} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );
}

/** Catatan netral saat sebuah field data belum tersedia - bukan pesan error. */
function InfoNote({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 flex items-start gap-3.5 rounded-xl border border-line bg-surface p-5 shadow-card">
      <span
        aria-hidden="true"
        className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700"
      >
        <BoxIcon width={18} height={18} />
      </span>
      <p className="text-sm leading-relaxed text-ink-muted">{children}</p>
    </div>
  );
}