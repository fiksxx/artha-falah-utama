import { products } from "@/lib/data/products";
import type { ProductNameMap } from "@/lib/quote";

/**
 * /data/nama-produk.json - JSON statis (dibuat saat build) berisi nama & kategori
 * setiap produk, dipakai formulir Contact Us untuk mengisi subjek & pesan
 * "Minta Penawaran" tanpa harus mengunduh seluruh data katalog.
 *
 * Diberi header X-Robots-Tag: noindex karena ini data teknis, bukan halaman.
 */
export const dynamic = "force-static";

export function GET() {
  const names: ProductNameMap = Object.fromEntries(
    products.map((product) => [product.slug, { name: product.name, category: product.category }]),
  );

  return Response.json(names, {
    headers: { "X-Robots-Tag": "noindex" },
  });
}
