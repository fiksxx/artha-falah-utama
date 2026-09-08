import type { ProductAvailability, ProductCategory } from "@/types";

/**
 * TAKSONOMI KATEGORI PRODUK ARTHA LABS
 * ====================================
 *
 * Ini adalah SATU-SATUNYA tempat daftar kategori & subkategori didefinisikan.
 * Filter di halaman katalog dibangun otomatis dari file ini, jadi Anda tidak
 * pernah perlu menyentuh kode komponen saat menambah kategori baru.
 *
 * CARA MENAMBAH SUBKATEGORI BARU:
 *   1. Tambahkan satu baris teks di dalam kategori induk yang sesuai di bawah.
 *   2. Pakai nama itu pada field `subcategory` produk di products.ts.
 *   Selesai. Filter, chip, dan hitungan produk menyesuaikan sendiri.
 *
 * PENTING - subkategori TIDAK otomatis muncul sebagai filter hanya karena
 * ditulis di sini. Filter hanya menampilkan subkategori yang benar-benar
 * dipakai minimal satu produk. Jadi daftar di bawah boleh lebih panjang dari
 * katalog Anda saat ini tanpa membuat filter kosong di website.
 */
export const categoryTree = {
  Reagen: [
    "Reagen Analitik",
    "Bahan Kimia Laboratorium",
    "Reagen Mikrobiologi",
    "Reagen Biologi Molekuler",
    "Reagen Diagnostik",
    "Buffer & Larutan",
    "Larutan Standar",
    "Reagen Pewarnaan",
    "Media Kultur",
  ],
  "Alat Lab": [
    "Instrumen Analitik",
    "Alat Laboratorium Umum",
    "Spektroskopi",
    "Mikroskopi",
    "Sentrifugasi",
    "Alat Pemanas",
    "Alat Pencampur",
    "Sterilisasi",
    "Alat Timbang",
    "Persiapan Sampel",
    "Uji Kualitas Air",
    "Pendinginan & Penyimpanan",
    "Keselamatan Laboratorium",
    "Water Bath",
    "Alat Pendingin & Pengering Beku",
    "Alat Penanganan Cairan",
    "Biosafety & Laminar Flow",
    "Peralatan Keselamatan Kerja",
    "Inkubator",
    "Pemurnian Air",
    "Pengujian Farmasi",
  ],
  "Alat Kesehatan": [
    "Alat Diagnostik",
    "Alat Laboratorium Klinik",
    "Alat Pemantauan Pasien",
    "Alat Sterilisasi Medis",
    "Peralatan Bedah Minor",
    "Alat Habis Pakai Medis",
    "Alat Bantu & Rehabilitasi",
  ],
} as const satisfies Record<ProductCategory, readonly string[]>;

/**
 * Union semua nama subkategori yang valid, dihitung otomatis dari categoryTree.
 * Ini yang membuat salah tulis subkategori di products.ts langsung ditolak
 * TypeScript sebelum website dibuild - bukan baru ketahuan setelah online.
 */
export type ProductSubcategory = (typeof categoryTree)[ProductCategory][number];

/** Urutan kategori induk. Dipakai filter dan aturan 3 produk teratas katalog. */
export const productCategories = Object.keys(categoryTree) as ProductCategory[];

/** Semua subkategori dalam urutan taksonomi (Reagen -> Alat Lab -> Alat Kesehatan). */
export const allSubcategories = productCategories.flatMap(
  (category) => categoryTree[category] as readonly ProductSubcategory[],
);

/** Cari kategori induk dari sebuah subkategori. */
export function categoryOfSubcategory(
  subcategory: ProductSubcategory,
): ProductCategory | undefined {
  return productCategories.find((category) =>
    (categoryTree[category] as readonly string[]).includes(subcategory),
  );
}

/**
 * Pilihan status ketersediaan.
 * Ubah teksnya di sini bila istilah yang dipakai perusahaan berbeda
 * (mis. "Ready Stock" alih-alih "Tersedia") - tipe di types/index.ts
 * akan memaksa seluruh data produk ikut diperbarui, jadi tidak ada yang terlewat.
 */
export const availabilityOptions = [
  "Tersedia",
  "Pre-Order",
  "Indent",
] as const satisfies readonly ProductAvailability[];
