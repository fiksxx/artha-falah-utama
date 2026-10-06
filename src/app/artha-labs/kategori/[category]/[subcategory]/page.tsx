import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SubcategoryLinks } from "@/components/sections/CategoryLinks";
import { PageHero } from "@/components/sections/PageHero";
import { ProductCard } from "@/components/sections/ProductCard";
import { RelatedGuides } from "@/components/sections/RelatedGuides";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getGuidesForSubcategory } from "@/lib/data/article-catalog-links";
import {
  brandsOf,
  categoryHref,
  getSubcategoryPage,
  joinIndonesian,
  subcategoryHref,
  subcategoryPages,
} from "@/lib/data/category-pages";
import { createPageMetadata, jsonLdScript, pageJsonLd } from "@/lib/seo";

type SubcategoryPageProps = {
  params: Promise<{ category: string; subcategory: string }>;
};

/** Hanya subkategori yang memenuhi jumlah produk minimal yang dibuat halamannya. */
export const dynamicParams = false;

export function generateStaticParams() {
  return subcategoryPages.map((page) => ({
    category: page.category.slug,
    subcategory: page.slug,
  }));
}

/** Meta description subkategori - dipakai juga oleh JSON-LD halaman agar keduanya selalu sama. */
function subcategoryDescription(page: NonNullable<ReturnType<typeof getSubcategoryPage>>) {
  const brands = joinIndonesian(brandsOf(page.products));
  return `Katalog ${page.name.toLowerCase()} Artha Labs: ${page.products.length} produk dari ${brands}, lengkap dengan spesifikasi. Minta penawaran langsung dari halaman produk.`;
}

export async function generateMetadata({ params }: SubcategoryPageProps): Promise<Metadata> {
  const { category, subcategory } = await params;
  const page = getSubcategoryPage(category, subcategory);
  if (!page) return {};

  return createPageMetadata({
    title: `${page.name} – Katalog ${page.category.label}`,
    description: subcategoryDescription(page),
    path: subcategoryHref(page.category, page),
  });
}

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  const { category, subcategory } = await params;
  const page = getSubcategoryPage(category, subcategory);
  if (!page) notFound();

  const brands = brandsOf(page.products);
  /** Artikel panduan yang dipasangkan dengan subkategori ini (Tahap S5). */
  const guides = getGuidesForSubcategory(page.category.category, page.name);

  const pageSchema = pageJsonLd({
    type: "CollectionPage",
    path: subcategoryHref(page.category, page),
    // Sama dengan teks H1 halaman ini.
    name: page.name,
    description: subcategoryDescription(page),
  });

  return (
    <>
      {/* Jenis halaman untuk mesin pencari (Tahap S4) - tidak menampilkan apa pun. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(pageSchema) }}
      />

      <PageHero
        eyebrow={page.category.label}
        title={page.name}
        description={page.intro}
        actions={
          <>
            <Button href="#produk" variant="accent" size="lg">
              Lihat {page.products.length} produk
            </Button>
            <Button href="/contact" variant="inverted" size="lg">
              Minta Penawaran
            </Button>
          </>
        }
        // Latar & lebar teks sama dengan halaman /artha-labs (Tahap R3C).
        backgroundSrc="/images/artha-labs-hero.png"
        textWidth="wide"
      />

      <Section id="produk" width="wide" className="scroll-mt-20">
        <Breadcrumb
          items={[
            { label: "Beranda", href: "/" },
            { label: "Artha Labs", href: "/artha-labs" },
            { label: page.category.label, href: categoryHref(page.category) },
            { label: page.name },
          ]}
        />

        <p className="mt-6 max-w-content text-base leading-relaxed text-ink-muted">
          {page.products.length} produk {page.name.toLowerCase()} dari brand {joinIndonesian(brands)}.
          Buka halaman produk untuk melihat spesifikasi lengkap atau meminta penawaran.
        </p>

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {page.products.map((product, index) => (
            <li key={product.id} className="h-full">
              <ProductCard product={product} eager={index < 3} />
            </li>
          ))}
        </ul>
      </Section>

      {/* PANDUAN TERKAIT - hanya tampil bila ada artikel untuk subkategori ini */}
      {guides.length > 0 ? (
        <Section width="wide" spacing="sm" className="border-t border-line">
          <SectionHeading title="Panduan terkait" />
          <RelatedGuides guides={guides} className="mt-6 max-w-4xl" />
        </Section>
      ) : null}

      <Section tone="muted" width="wide" spacing="sm">
        <SectionHeading title={`Subkategori ${page.category.label} lainnya`} />
        <SubcategoryLinks category={page.category} currentSlug={page.slug} className="mt-6" />
      </Section>
    </>
  );
}
