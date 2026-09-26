import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SubcategoryLinks } from "@/components/sections/CategoryLinks";
import { PageHero } from "@/components/sections/PageHero";
import { ProductCard } from "@/components/sections/ProductCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import {
  brandsOf,
  categoryHref,
  getSubcategoryPage,
  joinIndonesian,
  subcategoryHref,
  subcategoryPages,
} from "@/lib/data/category-pages";
import { createPageMetadata } from "@/lib/seo";

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

export async function generateMetadata({ params }: SubcategoryPageProps): Promise<Metadata> {
  const { category, subcategory } = await params;
  const page = getSubcategoryPage(category, subcategory);
  if (!page) return {};

  const brands = joinIndonesian(brandsOf(page.products));

  return createPageMetadata({
    title: `${page.name} – Katalog ${page.category.label}`,
    description: `Katalog ${page.name.toLowerCase()} Artha Labs: ${page.products.length} produk dari ${brands}, lengkap dengan spesifikasi. Minta penawaran langsung dari halaman produk.`,
    path: subcategoryHref(page.category, page),
  });
}

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  const { category, subcategory } = await params;
  const page = getSubcategoryPage(category, subcategory);
  if (!page) notFound();

  const brands = brandsOf(page.products);

  return (
    <>
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
      />

      <Section id="produk" width="wide" className="scroll-mt-20">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
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

      <Section tone="muted" width="wide" spacing="sm">
        <SectionHeading title={`Subkategori ${page.category.label} lainnya`} />
        <SubcategoryLinks category={page.category} currentSlug={page.slug} className="mt-6" />
      </Section>
    </>
  );
}
