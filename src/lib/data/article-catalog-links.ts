import { activities } from "@/lib/data/activities";
import {
  categoryPages,
  subcategoryPages,
  type CategoryPage,
  type SubcategoryPage,
} from "@/lib/data/category-pages";
import type { Activity, Product, ProductCategory } from "@/types";

/**
 * PRODUK TERKAIT DI KATALOG (halaman artikel Activity)
 * ====================================================
 *
 * Menentukan artikel mana yang menampilkan blok "Produk terkait di katalog",
 * dan ke subkategori mana blok itu mengarah. Pasangan ditulis EKSPLISIT (bukan
 * ditebak otomatis) agar hanya artikel yang topiknya memang berkaitan langsung
 * dengan produk di katalog yang diberi tautan. Artikel yang tidak ada di daftar
 * ini (mis. panduan pembelian umum) sengaja tidak menampilkan blok.
 *
 * Kunci  = slug artikel (lihat URL /activity/<slug>).
 * category / subcategory = nama persis seperti di lib/data/categories.ts.
 * productType = pola (regex) jenis produk untuk memilih kartu produk yang paling
 *   relevan, mis. /pH/ untuk artikel pH meter. Kosong = semua produk subkategori.
 * Tanpa `subcategory` -> blok hanya menautkan halaman kategori (tanpa kartu produk).
 */
type ArticleCatalogLink = {
  category: ProductCategory;
  subcategory?: string;
  productType?: RegExp;
};

const PIPETTE: ArticleCatalogLink = {
  category: "Alat Lab",
  subcategory: "Alat Penanganan Cairan",
  productType: /pipet/i,
};
const PH_METER: ArticleCatalogLink = {
  category: "Alat Lab",
  subcategory: "Uji Kualitas Air",
  // Hanya pH meter & pH tester (bukan controller/online industri).
  productType: /\bpH\b.*(Meter|Tester)/,
};
const BALANCE: ArticleCatalogLink = { category: "Alat Lab", subcategory: "Alat Timbang" };
const UV_VIS: ArticleCatalogLink = {
  category: "Alat Lab",
  subcategory: "Spektroskopi",
  productType: /UV-Vis/i,
};
const CENTRIFUGE: ArticleCatalogLink = { category: "Alat Lab", subcategory: "Sentrifugasi" };
const MICROSCOPE: ArticleCatalogLink = { category: "Alat Lab", subcategory: "Mikroskopi" };
const AUTOCLAVE: ArticleCatalogLink = {
  category: "Alat Lab",
  subcategory: "Sterilisasi",
  productType: /autoclave/i,
};
const WATER_BATH: ArticleCatalogLink = { category: "Alat Lab", subcategory: "Water Bath" };
const INCUBATOR: ArticleCatalogLink = {
  category: "Alat Lab",
  subcategory: "Inkubator",
  // Inkubator laboratorium umum (bukan climate chamber / platelet incubator).
  productType: /Biochemical|Bacteriological|CO2|Constant Temperature Incubator/i,
};

const articleCatalogLinks: Record<string, ArticleCatalogLink> = {
  // Micropipette
  "cara-menggunakan-micropipette-dengan-benar": PIPETTE,
  "cara-memilih-micropipette": PIPETTE,
  "micropipette-tidak-memberi-volume-yang-sesuai-atau-menetes": PIPETTE,
  "single-channel-atau-multi-channel": PIPETTE,
  "merawat-micropipette": PIPETTE,
  // pH meter, conductivity meter, DO meter
  "cara-menggunakan-ph-meter": PH_METER,
  "cara-memilih-ph-meter": PH_METER,
  "fungsi-dan-prinsip-kerja-ph-meter": PH_METER,
  "ph-meter-sulit-dikalibrasi-atau-pembacaannya-tidak-stabil": PH_METER,
  "cara-menggunakan-conductivity-meter": {
    category: "Alat Lab",
    subcategory: "Uji Kualitas Air",
    productType: /conductivity/i,
  },
  "cara-menggunakan-dissolved-oxygen-do-meter": {
    category: "Alat Lab",
    subcategory: "Uji Kualitas Air",
    productType: /dissolved oxygen/i,
  },
  // Timbangan
  "cara-menggunakan-timbangan-analitik": BALANCE,
  "analytical-balance-atau-precision-balance": BALANCE,
  "timbangan-tidak-stabil-atau-angkanya-terus-bergerak": BALANCE,
  // Spektrofotometer UV-Vis
  "fungsi-spektrofotometer-uv-vis": UV_VIS,
  "cara-menggunakan-spektrofotometer-uv-vis": UV_VIS,
  // Sentrifus
  "cara-menggunakan-centrifuge": CENTRIFUGE,
  "centrifuge-bergetar-atau-tidak-seimbang": CENTRIFUGE,
  "memilih-sentrifus-rcf-jenis-rotor-dan-kapasitas": CENTRIFUGE,
  // Mikroskop
  "cara-menggunakan-mikroskop-cahaya": MICROSCOPE,
  "fungsi-mikroskop-cahaya": MICROSCOPE,
  // Autoklaf
  "cara-menggunakan-autoklaf": AUTOCLAVE,
  "perawatan-rutin-autoklaf-agar-hasil-sterilisasi-konsisten": AUTOCLAVE,
  // Water bath & inkubator
  "cara-menggunakan-water-bath": WATER_BATH,
  "cara-memilih-water-bath": WATER_BATH,
  "cara-menggunakan-incubator": INCUBATOR,
  "cara-memilih-incubator": INCUBATOR,
  // Alat pencampur
  "cara-menggunakan-hotplate-stirrer-dengan-aman": {
    category: "Alat Lab",
    subcategory: "Alat Pencampur",
    productType: /magnetic stirrer/i,
  },
  "cara-menggunakan-vortex-mixer-dan-shaker": {
    category: "Alat Lab",
    subcategory: "Alat Pencampur",
    productType: /vortex|shaker/i,
  },
  // Lain-lain
  "cara-menggunakan-moisture-analyzer": {
    category: "Alat Lab",
    subcategory: "Instrumen Analitik",
    productType: /moisture (analyzer|balance)/i,
  },
  "air-untuk-laboratorium": { category: "Alat Lab", subcategory: "Pemurnian Air" },
  "menyimpan-reagen-suhu-cahaya-dan-masa-simpan": { category: "Reagen" },
};

/** Jumlah kartu produk yang ditampilkan di blok. */
const PRODUCTS_PER_ARTICLE = 3;

export type ArticleCatalogBlock = {
  category: CategoryPage;
  /** Halaman subkategori tujuan (kosong bila blok hanya menautkan kategori). */
  subcategory?: SubcategoryPage;
  products: Product[];
};

/**
 * Data blok "Produk terkait di katalog" untuk satu artikel, atau undefined bila
 * artikel tidak dipasangkan atau halaman tujuannya tidak ada.
 * Produk dipilih secara pasti (tidak acak): produk `featured` lebih dahulu, lalu
 * urutan data katalog.
 */
export function getArticleCatalogBlock(articleSlug: string): ArticleCatalogBlock | undefined {
  const link = articleCatalogLinks[articleSlug];
  if (!link) return undefined;

  const category = categoryPages.find((page) => page.category === link.category);
  if (!category) return undefined;

  if (!link.subcategory) return { category, products: [] };

  const subcategory = subcategoryPages.find(
    (page) => page.category.slug === category.slug && page.name === link.subcategory,
  );
  if (!subcategory) return { category, products: [] };

  const pattern = link.productType;
  const matching = pattern
    ? subcategory.products.filter((product) => pattern.test(product.productType))
    : subcategory.products;
  const pool = matching.length > 0 ? matching : subcategory.products;
  const products = [
    ...pool.filter((product) => product.featured),
    ...pool.filter((product) => !product.featured),
  ].slice(0, PRODUCTS_PER_ARTICLE);

  return { category, subcategory, products };
}

/** Slug seluruh artikel yang dipasangkan - dipakai untuk pemeriksaan data. */
export const linkedArticleSlugs = Object.keys(articleCatalogLinks);

/**
 * ARAH SEBALIKNYA: PANDUAN TERKAIT DI HALAMAN KATALOG (Tahap S5)
 * ==============================================================
 *
 * Pasangan di `articleCatalogLinks` dibaca terbalik: dari produk atau
 * subkategori ke artikelnya. Tidak ada daftar tautan baru yang harus dirawat -
 * menambah pasangan artikel di atas otomatis menambah tautan di halaman produk
 * dan subkategori yang cocok.
 */

/** Jumlah tautan panduan yang ditampilkan di satu halaman produk. */
const GUIDES_PER_PRODUCT = 3;

/**
 * Apakah sebuah pasangan artikel berlaku untuk produk ini.
 * Lebih ketat daripada blok di halaman artikel: bila pasangan punya pola
 * `productType`, jenis produk HARUS cocok (pH meter mendapat artikel pH meter,
 * conductivity meter di subkategori yang sama tidak). Pasangan tanpa
 * subkategori (mis. artikel penyimpanan reagen) berlaku untuk seluruh kategori.
 */
function linkMatchesProduct(
  link: ArticleCatalogLink,
  product: Pick<Product, "category" | "subcategory" | "productType">,
): boolean {
  if (link.category !== product.category) return false;
  if (!link.subcategory) return true;
  if (link.subcategory !== product.subcategory) return false;
  return link.productType ? link.productType.test(product.productType) : true;
}

/** Artikel panduan untuk satu produk, urutan terbaru lebih dulu (urutan `activities`). */
export function getGuidesForProduct(
  product: Pick<Product, "category" | "subcategory" | "productType">,
  limit = GUIDES_PER_PRODUCT,
): Activity[] {
  return activities
    .filter((activity) => {
      const link = articleCatalogLinks[activity.slug];
      return link ? linkMatchesProduct(link, product) : false;
    })
    .slice(0, limit);
}

/**
 * Artikel panduan untuk satu halaman subkategori: semua artikel yang
 * dipasangkan dengan subkategori itu, ditambah artikel tingkat kategorinya.
 */
export function getGuidesForSubcategory(category: ProductCategory, subcategory: string): Activity[] {
  return activities.filter((activity) => {
    const link = articleCatalogLinks[activity.slug];
    if (!link || link.category !== category) return false;
    return !link.subcategory || link.subcategory === subcategory;
  });
}
