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
  categoryPages,
  getCategoryPage,
  joinIndonesian,
} from "@/lib/data/category-pages";
import { createPageMetadata, jsonLdScript, pageJsonLd } from "@/lib/seo";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

/**
 * Batas jumlah produk agar seluruh produk kategori ditampilkan langsung di
 * halaman ini. Kategori yang lebih besar (mis. Alat Laboratorium, ratusan
 * produk) cukup menautkan subkategorinya - produk tampil di halaman subkategori.
 */
const MAX_PRODUCTS_ON_CATEGORY_PAGE = 60;

/** Hanya kategori yang benar-benar memiliki produk yang dibuat halamannya. */
export const dynamicParams = false;

export function generateStaticParams() {
  return categoryPages.map((page) => ({ category: page.slug }));
}

/** Meta description kategori - dipakai juga oleh JSON-LD halaman agar keduanya selalu sama. */
function categoryDescription(page: NonNullable<ReturnType<typeof getCategoryPage>>) {
  const brands = joinIndonesian(brandsOf(page.products));
  return `Katalog ${page.label.toLowerCase()} Artha Labs: ${page.products.length} produk dari ${brands}, lengkap dengan spesifikasi. Minta penawaran langsung dari halaman produk.`;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const page = getCategoryPage(slug);
  if (!page) return {};

  return createPageMetadata({
    title: `Katalog ${page.label}`,
    description: categoryDescription(page),
    path: categoryHref(page),
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const page = getCategoryPage(slug);
  if (!page) notFound();

  const brands = brandsOf(page.products);
  const showProducts = page.products.length <= MAX_PRODUCTS_ON_CATEGORY_PAGE;
  const hasSubcategoryPages = page.subcategories.some((entry) => entry.hasPage);
  /**
   * Produk dari subkategori kecil (tanpa halaman sendiri). Bila seluruh produk
   * kategori tidak ditampilkan, produk ini tetap ditampilkan di sini agar setiap
   * produk selalu tertaut dari halaman kategori atau subkategorinya.
   */
  const productsWithoutSubcategoryPage = page.subcategories
    .filter((entry) => !entry.hasPage)
    .flatMap((entry) => entry.products);
  const listedProducts = showProducts ? page.products : productsWithoutSubcategoryPage;

  const pageSchema = pageJsonLd({
    type: "CollectionPage",
    path: categoryHref(page),
    // Sama dengan teks H1 halaman ini.
    name: page.label,
    description: categoryDescription(page),
  });

  return (
    <>
      {/* Jenis halaman untuk mesin pencari (Tahap S4) - tidak menampilkan apa pun. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(pageSchema) }}
      />

      <PageHero
        eyebrow="Katalog Artha Labs"
        title={page.label}
        description={page.intro}
        actions={
          <>
            <Button href="/artha-labs#katalog" variant="accent" size="lg">
              Cari di katalog
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

      <Section width="wide">
        <Breadcrumb
          items={[
            { label: "Beranda", href: "/" },
            { label: "Artha Labs", href: "/artha-labs" },
            { label: page.label },
          ]}
        />

        <p className="mt-6 max-w-content text-base leading-relaxed text-ink-muted">
          {page.products.length} produk dalam {page.subcategories.length} subkategori, dari brand{" "}
          {joinIndonesian(brands)}.
        </p>

        {hasSubcategoryPages ? (
          <div className="mt-10">
            <SectionHeading title="Subkategori" />
            <SubcategoryLinks category={page} className="mt-6" />
          </div>
        ) : null}

        {listedProducts.length > 0 ? (
          <div className="mt-14">
            <SectionHeading
              title={showProducts ? `Semua produk ${page.label.toLowerCase()}` : "Produk lainnya"}
            />
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listedProducts.map((product, index) => (
                <li key={product.id} className="h-full">
                  <ProductCard product={product} eager={index < 3} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Section>
    </>
  );
}
