import { getCatalogIndex } from "@/lib/data/catalog-index";

/**
 * /data/katalog.json - indeks katalog ringan (dibuat saat build), dipakai
 * halaman /artha-labs untuk filter, pencarian, dan "Tampilkan lebih banyak"
 * tanpa mengunduh seluruh data produk sebagai JavaScript.
 *
 * Diberi header X-Robots-Tag: noindex karena ini data teknis, bukan halaman.
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json(getCatalogIndex(), {
    headers: { "X-Robots-Tag": "noindex" },
  });
}
