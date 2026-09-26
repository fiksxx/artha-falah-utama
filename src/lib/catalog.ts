import { productCategories } from "@/lib/data/categories";
import { compactText, normalizeText } from "@/lib/utils";
import type { Product, ProductAvailability, ProductCategory } from "@/types";

/**
 * LOGIKA KATALOG YANG AMAN DIPAKAI DI BROWSER
 * ===========================================
 *
 * CATATAN PERFORMA: file ini sengaja TIDAK mengimpor lib/data/products.ts.
 * Komponen katalog (ProductGrid) berjalan di browser; bila ia mengimpor data
 * produk, seluruh 884 produk beserta spesifikasi & informasi tambahannya
 * (±2 MB JavaScript) ikut diunduh setiap kali halaman /artha-labs dibuka.
 *
 * Sebagai gantinya, katalog memakai indeks ringan (/data/katalog.json) yang
 * hanya berisi kolom untuk kartu produk, filter, dan pencarian. Indeks itu
 * dibuat saat build oleh src/app/data/katalog.json/route.ts dari
 * lib/data/catalog-index.ts.
 */

/** Lokasi indeks katalog (JSON statis, dibuat saat build). */
export const CATALOG_INDEX_URL = "/data/katalog.json";

/**
 * Satu produk di indeks katalog: kolom yang dipakai kartu produk, filter, dan
 * urutan katalog. `searchText` = kata kunci + deskripsi produk (hanya untuk
 * pencarian); tidak diisi untuk kartu awal yang dirender di server.
 */
export type CatalogItem = Pick<
  Product,
  | "id"
  | "slug"
  | "name"
  | "brand"
  | "category"
  | "subcategory"
  | "productType"
  | "applications"
  | "model"
  | "price"
  | "availability"
  | "featured"
  | "image"
  | "imageAlt"
> & { searchText?: string };

/**
 * Pilihan filter katalog - dihitung di server dari data produk dan dikirim
 * bersama HTML. Pilihan "Aplikasi" TIDAK ikut di sini karena jumlahnya
 * ribuan (±144 KB); daftar itu dibentuk di browser dari indeks katalog
 * (lihat applicationOptionsOf).
 */
export type CatalogFacets = {
  categories: ProductCategory[];
  /** Subkategori (urut taksonomi) beserta kategori induk yang memakainya. */
  subcategories: Array<{ name: string; categories: ProductCategory[] }>;
  brands: string[];
  types: string[];
  availabilities: ProductAvailability[];
};

/**
 * Navigasi kategori di atas katalog (Tahap 5F): kategori yang memiliki produk,
 * beserta subkategorinya. Dihitung di server dari data produk; `href` hanya
 * diisi bila halaman kategori/subkategori itu memang ada, sehingga tautannya
 * tetap ada di HTML awal dan bisa dirayapi mesin pencari.
 */
export type CatalogCategoryNavItem = {
  /** Nilai kategori di data produk, mis. "Alat Lab". */
  category: ProductCategory;
  /** Nama tampilan, sama dengan halaman kategori, mis. "Alat Laboratorium". */
  label: string;
  href: string;
  count: number;
  /** Urut dari jumlah produk terbanyak. */
  subcategories: Array<{ name: string; count: number; href?: string }>;
};

/** Urutkan teks mengikuti aturan alfabet Indonesia. */
export const sortID = (values: string[]) => [...values].sort((a, b) => a.localeCompare(b, "id"));

/** Bidang penggunaan unik dari seluruh katalog (opsi filter "Aplikasi"). */
export function applicationOptionsOf(items: readonly Pick<Product, "applications">[]) {
  return sortID([...new Set(items.flatMap((item) => item.applications ?? []))]);
}

/* ==========================================================================
   URUTAN KATALOG
   ========================================================================== */

/**
 * Pengacak angka yang dapat diulang (mulberry32).
 * "Seeded" artinya: seed yang sama SELALU menghasilkan urutan yang sama.
 * Inilah yang membuat katalog terlihat acak, tetapi tidak berpindah-pindah
 * saat pengguna memfilter, mencari, atau menekan "Tampilkan lebih banyak".
 */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Urutan katalog: acak, TETAPI tiga produk teratas selalu mewakili tiga
 * kategori utama secara berurutan - Reagen, Alat Lab, lalu Alat Kesehatan.
 *
 * Wakil tiap kategori diambil dari produk `featured: true` lebih dahulu; bila
 * tidak ada yang ditandai, produk mana pun dari kategori itu dipakai. Jadi
 * Anda bisa mengatur "produk andalan" hanya dengan satu field di data.
 *
 * Dipakai di server (kartu awal) DAN di browser (setelah indeks dimuat), jadi
 * seed yang sama selalu menghasilkan urutan yang sama di keduanya.
 */
export function orderCatalog<T extends Pick<Product, "id" | "category" | "featured">>(
  seed: number,
  source: readonly T[],
  categoryOrder: readonly ProductCategory[] = productCategories,
): T[] {
  const shuffled = [...source];
  const random = mulberry32(seed);

  // Fisher-Yates: distribusi acak yang merata
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const a = shuffled[i] as T;
    const b = shuffled[j] as T;
    shuffled[i] = b;
    shuffled[j] = a;
  }

  const lead: T[] = [];
  categoryOrder.forEach((category) => {
    const inCategory = shuffled.filter((product) => product.category === category);
    const pick = inCategory.find((product) => product.featured) ?? inCategory[0];
    if (pick) lead.push(pick);
  });

  const leadIds = new Set(lead.map((product) => product.id));
  return [...lead, ...shuffled.filter((product) => !leadIds.has(product.id))];
}

/* ==========================================================================
   PENCARIAN & FILTER
   ========================================================================== */

/**
 * Teks tambahan khusus pencarian: kata kunci + paragraf deskripsi.
 * undefined bila produk tidak punya keduanya.
 */
export function searchTextOf(product: Pick<Product, "keywords" | "description">) {
  const parts = [...(product.keywords ?? []), ...(product.description ?? [])];
  return parts.length > 0 ? parts.join(" ") : undefined;
}

/** Semua teks produk yang ikut dicari oleh kolom pencarian. */
function haystackOf(item: CatalogItem) {
  return [
    item.name,
    item.model,
    item.brand,
    item.category,
    item.subcategory,
    item.productType,
    ...(item.applications ?? []),
    // Kata kunci + deskripsi lengkap, sehingga istilah teknis di dalam
    // deskripsi tetap bisa dicari.
    ...(item.searchText !== undefined ? [item.searchText] : []),
  ].join(" ");
}

export type CatalogSearchIndex = ReadonlyMap<string, { normalized: string; compact: string }>;

/**
 * Indeks pencarian, dibangun SEKALI setelah indeks katalog dimuat - bukan
 * pada setiap ketikan.
 */
export function buildSearchIndex(items: readonly CatalogItem[]): CatalogSearchIndex {
  return new Map(
    items.map((item) => {
      const haystack = haystackOf(item);
      return [item.id, { normalized: normalizeText(haystack), compact: compactText(haystack) }];
    }),
  );
}

export const catalogSortOptions = [
  { id: "katalog", label: "Urutan katalog" },
  { id: "nama-asc", label: "Nama A - Z" },
  { id: "nama-desc", label: "Nama Z - A" },
  { id: "harga-asc", label: "Harga terendah" },
  { id: "harga-desc", label: "Harga tertinggi" },
] as const;

export type CatalogSortId = (typeof catalogSortOptions)[number]["id"];

export type CatalogCriteria = {
  query: string;
  categories: string[];
  subcategories: string[];
  brands: string[];
  types: string[];
  applications: string[];
  availabilities: string[];
  sort: CatalogSortId;
};

/** Saring & urutkan katalog sesuai pilihan pengunjung. */
export function filterCatalog<T extends CatalogItem>(
  catalog: readonly T[],
  criteria: CatalogCriteria,
  searchIndex: CatalogSearchIndex,
): T[] {
  const needle = normalizeText(criteria.query);
  const needleCompact = compactText(criteria.query);
  const { categories, subcategories, brands, types, applications, availabilities, sort } =
    criteria;

  const result = catalog.filter((product) => {
    if (categories.length > 0 && !categories.includes(product.category)) return false;
    if (subcategories.length > 0 && !subcategories.includes(product.subcategory)) return false;
    if (brands.length > 0 && !brands.includes(product.brand)) return false;
    if (types.length > 0 && !types.includes(product.productType)) return false;
    if (availabilities.length > 0 && !availabilities.includes(product.availability)) return false;
    if (
      applications.length > 0 &&
      !(product.applications ?? []).some((item) => applications.includes(item))
    ) {
      return false;
    }

    if (needle === "") return true;

    const indexed = searchIndex.get(product.id);
    if (!indexed) return false;

    return indexed.normalized.includes(needle) || indexed.compact.includes(needleCompact);
  });

  if (sort === "katalog") return result;

  const sorted = [...result];
  sorted.sort((a, b) => {
    if (sort === "nama-asc") return a.name.localeCompare(b.name, "id");
    if (sort === "nama-desc") return b.name.localeCompare(a.name, "id");

    return sort === "harga-asc" ? a.price - b.price : b.price - a.price;
  });

  return sorted;
}

/** Subkategori yang tersedia untuk kategori terpilih (semua bila tidak ada). */
export function subcategoriesFor(facets: CatalogFacets, categories: readonly string[]) {
  return facets.subcategories
    .filter(
      (option) =>
        categories.length === 0 || option.categories.some((category) => categories.includes(category)),
    )
    .map((option) => option.name);
}
