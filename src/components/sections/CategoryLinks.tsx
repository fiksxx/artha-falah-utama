import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons";
import {
  categoryHref,
  categoryPages,
  subcategoryHref,
  type CategoryPage,
} from "@/lib/data/category-pages";
import { cn } from "@/lib/utils";

/** Gaya chip yang sama dengan tombol filter katalog (ProductGrid) dalam keadaan tidak aktif. */
const chipClass =
  "inline-flex min-h-[40px] items-center gap-2 whitespace-nowrap rounded-full border border-line-strong bg-surface px-4 text-sm font-medium text-ink-muted transition-all duration-200 ease-smooth hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700";

/**
 * Daftar tautan subkategori sebuah kategori (chip + jumlah produk).
 * Hanya subkategori yang memiliki halaman sendiri yang ditautkan; subkategori
 * kecil tetap bisa ditemukan melalui halaman kategorinya.
 */
export function SubcategoryLinks({
  category,
  currentSlug,
  className,
}: {
  category: CategoryPage;
  /** Slug subkategori yang sedang dibuka - ditandai dan tidak ditautkan. */
  currentSlug?: string;
  className?: string;
}) {
  const linked = category.subcategories.filter((entry) => entry.hasPage);
  if (linked.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {linked.map((entry) => {
        const count = (
          <span className="text-xs font-semibold tabular-nums text-ink-subtle">
            {entry.products.length}
          </span>
        );

        return (
          <li key={entry.slug}>
            {entry.slug === currentSlug ? (
              <span
                aria-current="page"
                className={cn(chipClass, "border-brand-700 bg-brand-700 text-white hover:bg-brand-700 hover:text-white")}
              >
                {entry.name}
              </span>
            ) : (
              <Link href={subcategoryHref(category, entry)} className={chipClass}>
                {entry.name}
                {count}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Section "Jelajahi per kategori" di halaman /artha-labs.
 * Dirender di server sehingga setiap tautan kategori dan subkategori ada di HTML
 * awal dan dapat dirayapi mesin pencari.
 */
export function CategoryLinks() {
  if (categoryPages.length === 0) return null;

  return (
    <div className="space-y-8">
      {categoryPages.map((category) => (
        <div key={category.slug}>
          <h3 className="text-base font-semibold text-ink">
            <Link
              href={categoryHref(category)}
              className="group inline-flex items-center gap-2 transition-colors duration-200 hover:text-brand-700"
            >
              {category.label}
              <span className="text-sm font-medium text-ink-subtle">
                {category.products.length} produk
              </span>
              <ArrowRightIcon
                aria-hidden="true"
                width={16}
                height={16}
                className="text-brand-700 transition-transform duration-200 ease-smooth group-hover:translate-x-1 motion-reduce:transform-none"
              />
            </Link>
          </h3>
          <SubcategoryLinks category={category} className="mt-3" />
        </div>
      ))}
    </div>
  );
}
