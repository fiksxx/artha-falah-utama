import type { MetadataRoute } from "next";

import { activities } from "@/lib/data/activities";
import {
  categoryHref,
  categoryPages,
  subcategoryHref,
  subcategoryPages,
} from "@/lib/data/category-pages";
import { products } from "@/lib/data/products";
import { navItems, siteConfig } from "@/lib/site";

/**
 * Sitemap otomatis: halaman utama dari `navItems`, halaman kategori &
 * subkategori katalog, halaman detail produk dari data katalog, dan halaman
 * tulisan dari data Activity.
 * Menambah produk atau tulisan baru otomatis menambah entri sitemap-nya.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const pages: MetadataRoute.Sitemap = navItems.map((item) => ({
    url: item.href === "/" ? siteConfig.url : `${siteConfig.url}${item.href}`,
    lastModified,
    changeFrequency: "monthly",
    priority: item.href === "/" ? 1 : 0.8,
  }));

  /** Halaman kategori & subkategori - hanya yang benar-benar dibuat (lihat lib/data/category-pages.ts). */
  const categoryUrls: MetadataRoute.Sitemap = [
    ...categoryPages.map((page) => ({
      url: `${siteConfig.url}${categoryHref(page)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...subcategoryPages.map((page) => ({
      url: `${siteConfig.url}${subcategoryHref(page.category, page)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteConfig.url}/artha-labs/${product.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  /** Tanggal terbit dipakai sebagai lastModified agar lebih akurat daripada tanggal build. */
  const articlePages: MetadataRoute.Sitemap = activities.map((activity) => ({
    url: `${siteConfig.url}/activity/${activity.slug}`,
    lastModified: new Date(`${activity.date}T00:00:00+07:00`),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...pages, ...categoryUrls, ...productPages, ...articlePages];
}
