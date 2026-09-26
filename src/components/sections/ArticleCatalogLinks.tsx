import Link from "next/link";

import { ProductCard } from "@/components/sections/ProductCard";
import { SectionHeading } from "@/components/ui/Section";
import { ArrowRightIcon } from "@/components/ui/icons";
import { getArticleCatalogBlock } from "@/lib/data/article-catalog-links";
import { categoryHref, subcategoryHref } from "@/lib/data/category-pages";

/**
 * Blok "Produk terkait di katalog" di halaman artikel.
 *
 * Menautkan artikel ke halaman subkategori (atau kategori) yang relevan, beserta
 * beberapa contoh produknya. Pasangan artikel -> katalog diatur di
 * lib/data/article-catalog-links.ts; artikel yang tidak dipasangkan tidak
 * menampilkan blok ini sama sekali.
 */
export function ArticleCatalogLinks({
  articleSlug,
  className,
}: {
  articleSlug: string;
  className?: string;
}) {
  const block = getArticleCatalogBlock(articleSlug);
  if (!block) return null;

  const { category, subcategory, products } = block;
  const target = subcategory
    ? {
        href: subcategoryHref(category, subcategory),
        label: subcategory.name,
        count: subcategory.products.length,
      }
    : { href: categoryHref(category), label: category.label, count: category.products.length };

  return (
    <section aria-labelledby="produk-terkait-katalog" className={className}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div id="produk-terkait-katalog">
          <SectionHeading title="Produk terkait di katalog" />
        </div>
        <Link
          href={target.href}
          className="group inline-flex min-h-[40px] items-center gap-2 self-start rounded-full border border-line-strong bg-surface px-4 text-sm font-medium text-ink-muted transition-all duration-200 ease-smooth hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 sm:self-auto"
        >
          Lihat semua {target.label.toLowerCase()}
          <span className="text-xs font-semibold tabular-nums text-ink-subtle">{target.count}</span>
          <ArrowRightIcon
            aria-hidden="true"
            width={16}
            height={16}
            className="transition-transform duration-200 ease-smooth group-hover:translate-x-1 motion-reduce:transform-none"
          />
        </Link>
      </div>

      {products.length > 0 ? (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li key={product.id} className="h-full">
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
