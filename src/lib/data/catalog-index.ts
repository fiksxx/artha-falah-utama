import {
  type CatalogCategoryNavItem,
  type CatalogFacets,
  type CatalogItem,
  orderCatalog,
  searchTextOf,
} from "@/lib/catalog";
import { categoryHref, categoryPages, subcategoryHref } from "@/lib/data/category-pages";
import { productCategories } from "@/lib/data/categories";
import {
  productAvailabilities,
  productBrands,
  productSubcategories,
  productTypes,
  products,
} from "@/lib/data/products";
import type { Product } from "@/types";

/**
 * INDEKS KATALOG (hanya dipakai di server / saat build)
 * =====================================================
 *
 * Mengubah data produk lengkap menjadi versi ringan untuk halaman katalog
 * /artha-labs. Spesifikasi, informasi tambahan, packaging, dan highlight
 * TIDAK disertakan - semua itu hanya tampil di halaman detail produk.
 *
 * Jangan impor file ini dari komponen "use client"; komponen browser cukup
 * memakai lib/catalog.ts.
 */

/** Jumlah kartu produk yang dirender di server (sama dengan 1 batch katalog). */
export const CATALOG_PAGE_SIZE = 24;

/** Seed urutan katalog saat render di server, agar HTML awal selalu sama. */
export const CATALOG_SSR_SEED = 1;

/**
 * Versi ringan satu produk. Field kosong tidak disertakan agar JSON tetap kecil.
 * `withSearch` = sertakan teks pencarian (kata kunci + deskripsi).
 */
export function toCatalogItem(product: Product, withSearch: boolean): CatalogItem {
  const item: CatalogItem = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    category: product.category,
    subcategory: product.subcategory,
    productType: product.productType,
    model: product.model,
    price: product.price,
    availability: product.availability,
    image: product.image,
    imageAlt: product.imageAlt,
  };

  if (product.applications) item.applications = product.applications;
  if (product.featured) item.featured = true;

  if (withSearch) {
    const searchText = searchTextOf(product);
    if (searchText !== undefined) item.searchText = searchText;
  }

  return item;
}

/** Seluruh katalog dalam urutan data - isi /data/katalog.json. */
export function getCatalogIndex(): CatalogItem[] {
  return products.map((product) => toCatalogItem(product, true));
}

/** Kartu yang dirender di server: batch pertama dengan urutan seed SSR. */
export function getInitialCatalogItems(): CatalogItem[] {
  return orderCatalog(CATALOG_SSR_SEED, products)
    .slice(0, CATALOG_PAGE_SIZE)
    .map((product) => toCatalogItem(product, false));
}

/** Pilihan filter katalog - semuanya dihitung dari data produk. */
export function getCatalogFacets(): CatalogFacets {
  return {
    categories: [...productCategories],
    subcategories: productSubcategories.map((name) => ({
      name,
      categories: productCategories.filter((category) =>
        products.some(
          (product) => product.subcategory === name && product.category === category,
        ),
      ),
    })),
    brands: productBrands.map((brand) => brand.name),
    types: [...productTypes],
    availabilities: [...productAvailabilities],
  };
}

/**
 * Navigasi kategori untuk katalog /artha-labs - kategori yang memiliki halaman
 * (berarti memiliki produk) beserta subkategorinya. Label, tautan, dan jumlah
 * produk diambil dari lib/data/category-pages.ts agar sama persis dengan
 * halaman kategori.
 */
export function getCatalogCategoryNav(): CatalogCategoryNavItem[] {
  return categoryPages.map((page) => ({
    category: page.category,
    label: page.label,
    href: categoryHref(page),
    count: page.products.length,
    subcategories: page.subcategories.map((entry) => ({
      name: entry.name,
      count: entry.products.length,
      ...(entry.hasPage ? { href: subcategoryHref(page, entry) } : {}),
    })),
  }));
}

/** Jumlah seluruh produk di katalog. */
export const catalogTotal = products.length;
