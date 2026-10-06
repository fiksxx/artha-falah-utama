import { products } from "@/lib/data/products";
import type { Product } from "@/types";

/**
 * PRODUK SATU SERI (Tahap S6)
 * ===========================
 *
 * Mengelompokkan produk yang merupakan model/varian dari seri yang sama, untuk
 * blok "Model lain dalam seri ini" di halaman detail produk.
 *
 * Aturannya sengaja ketat agar produk yang tidak berkerabat tidak ikut
 * tergabung. Dua produk dianggap satu seri bila KEEMPAT hal ini sama:
 *   - brand,
 *   - subkategori,
 *   - jenis produk (`productType`),
 *   - nama produk setelah semua angka diabaikan
 *     (mis. "... Pipette 10-100 µL" dan "... Pipette 100-1000 µL").
 *
 * Kelompok dihitung otomatis dari lib/data/products.ts; tidak ada daftar manual.
 * Produk baru yang memenuhi aturan otomatis ikut tertaut.
 */
function seriesKey(product: Product): string {
  const name = product.name
    .replace(/\d+(?:[.,]\d+)*/g, "#")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  return [product.brandId, product.subcategory, product.productType, name].join("|");
}

const seriesByKey = new Map<string, Product[]>();
for (const product of products) {
  const key = seriesKey(product);
  const group = seriesByKey.get(key);
  if (group) group.push(product);
  else seriesByKey.set(key, [product]);
}

/** Model lain dalam seri yang sama (tanpa produk itu sendiri), urutan data katalog. */
export function getSeriesSiblings(product: Product): Product[] {
  const group = seriesByKey.get(seriesKey(product)) ?? [];
  return group.length > 1 ? group.filter((item) => item.id !== product.id) : [];
}
