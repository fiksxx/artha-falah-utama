import { products } from "@/lib/data/products";
import { slugify } from "@/lib/utils";
import type { Product, ProductCategory } from "@/types";

/**
 * HALAMAN KATEGORI & SUBKATEGORI KATALOG
 * ======================================
 *
 * Sumber data untuk:
 *   /artha-labs/kategori/[category]                 -> halaman kategori
 *   /artha-labs/kategori/[category]/[subcategory]   -> halaman subkategori
 * serta section "Jelajahi per kategori" di /artha-labs dan entri sitemap.
 *
 * ATURAN HALAMAN (agar tidak ada halaman kosong atau tipis):
 * - Kategori hanya dibuatkan halaman bila memiliki minimal satu produk dan
 *   terdaftar di `categoryPageInfo` di bawah. "Alat Kesehatan" sengaja belum
 *   didaftarkan karena belum ada produknya.
 * - Subkategori hanya dibuatkan halaman bila memiliki minimal
 *   MIN_PRODUCTS_FOR_SUBCATEGORY_PAGE produk. Subkategori yang lebih kecil tetap
 *   tampil dan tertaut dari halaman kategorinya.
 *
 * Seluruh angka (jumlah produk, brand) dihitung otomatis dari lib/data/products.ts,
 * jadi tidak pernah perlu diperbarui manual. Teks pengantar di bawah hanya
 * menjelaskan apa isi kategori itu - tanpa klaim harga, stok, atau status
 * distributor.
 */

/** Jumlah produk minimal agar sebuah subkategori mendapat halaman sendiri. */
export const MIN_PRODUCTS_FOR_SUBCATEGORY_PAGE = 5;

type CategoryInfo = {
  /** Segmen URL, mis. "alat-laboratorium". Jangan diubah setelah terindeks Google. */
  slug: string;
  /** Nama yang ditampilkan di halaman, mis. "Alat Laboratorium". */
  label: string;
  intro: string;
};

/** Kategori yang dibuatkan halaman. Tambahkan "Alat Kesehatan" di sini setelah produknya tersedia. */
const categoryPageInfo: Partial<Record<ProductCategory, CategoryInfo>> = {
  Reagen: {
    slug: "reagen",
    label: "Reagen",
    intro:
      "Bahan kimia dan reagen untuk analisis, titrasi, preparasi sampel, dan kromatografi di laboratorium. Katalog mencakup asam, basa, garam anorganik, pelarut analitik hingga grade HPLC dan LC-MS, indikator pH, serta bahan buffer fosfat.",
  },
  "Alat Lab": {
    slug: "alat-laboratorium",
    label: "Alat Laboratorium",
    intro:
      "Instrumen dan peralatan untuk analisis, preparasi sampel, pemanasan, pencampuran, sterilisasi, hingga keselamatan kerja di laboratorium. Pilih subkategori di bawah untuk melihat seluruh produknya beserta spesifikasi.",
  },
};

/**
 * Teks pengantar halaman subkategori (kunci = nama subkategori persis seperti di
 * categories.ts). Subkategori tanpa teks di sini tetap mendapat halaman dengan
 * pengantar singkat otomatis.
 */
const subcategoryIntro: Record<string, string> = {
  "Instrumen Analitik":
    "Instrumen untuk pengukuran dan analisis kuantitatif di laboratorium klinik, riset, dan industri. Termasuk biochemistry analyzer, microplate reader, Kjeldahl analyzer, thermal cycler dan real-time PCR, hematology analyzer, Karl Fischer titrator, serta viscometer dan particle size analyzer.",
  "Persiapan Sampel":
    "Peralatan untuk menyiapkan sampel sebelum dianalisis, dari penguapan pelarut hingga pemrosesan jaringan. Tersedia nitrogen evaporator, rotary evaporator, tissue processor, microtome, fat analyzer, ultrasonic sonicator, slide stainer, dan nucleic acid extractor.",
  "Uji Kualitas Air":
    "Alat ukur parameter air seperti pH, konduktivitas, TDS, dan oksigen terlarut (DO), untuk pengujian di laboratorium maupun di lapangan. Pilihan meliputi model benchtop, portable, dan pocket tester, termasuk multi-parameter analyzer.",
  "Alat Pemanas":
    "Peralatan pemanas untuk pengeringan, pengabuan, digesti, dan inkubasi pada suhu terkontrol. Termasuk dry bath incubator, drying oven dan vacuum oven, muffle furnace dan tube furnace, heating mantle, hot plate, microwave digestion system, serta Kjeldahl digester.",
  "Reagen Analitik":
    "Reagen dan bahan kimia untuk analisis kuantitatif, titrasi, dan kromatografi. Meliputi asam, basa, dan garam anorganik, pelarut analitik, pelarut HPLC gradient grade dan LC-MS grade, reagen titrasi, serta indikator pH.",
  Spektroskopi:
    "Spektrofotometer untuk mengukur serapan atau emisi cahaya oleh sampel, dari analisis rutin hingga penentuan logam. Tersedia UV-Vis single beam dan double beam, visible, fluorescence, atomic absorption (AAS), NIR, flame photometer, serta spektrofotometer portable.",
  "Alat Laboratorium Umum":
    "Peralatan pendukung pekerjaan harian di laboratorium. Termasuk filtration manifold, pompa vakum, ultrasonic cleaner, glassware washer, colony counter, dan vacuum aspiration system.",
  "Alat Pencampur":
    "Alat untuk mencampur, mengaduk, dan menghomogenkan sampel atau larutan. Pilihan meliputi magnetic stirrer dan hotplate magnetic stirrer, overhead stirrer, vortex mixer, orbital dan rocker shaker, homogenizer, rotator, serta microplate shaker.",
  Sterilisasi:
    "Peralatan untuk sterilisasi alat dan media laboratorium. Tersedia autoklaf vertikal, horizontal, portable, dan benchtop (kelas N dan kelas B), hot air sterilizer, glass bead sterilizer, bacti-cinerator, plasma sterilizer, serta medical sealer.",
  Sentrifugasi:
    "Sentrifus untuk memisahkan komponen sampel dengan gaya sentrifugal. Pilihan meliputi refrigerated, low speed, high speed, dan clinical centrifuge, microcentrifuge, microhematocrit centrifuge, cytocentrifuge, hingga microplate centrifuge.",
  "Pengujian Farmasi":
    "Alat uji mutu sediaan farmasi, terutama tablet dan kapsul. Termasuk dissolution tester, disintegration tester, tablet hardness tester, friability tester, dan thickness tester.",
  Inkubator:
    "Inkubator untuk menjaga suhu dan kondisi lingkungan sampel atau kultur. Tersedia inkubator biokimia dan bakteriologi, CO2 incubator, shaking incubator, anaerobic incubator, microplate incubator, platelet incubator, dan climate chamber.",
  "Alat Penanganan Cairan":
    "Alat untuk memindahkan dan menakar cairan secara presisi. Termasuk mikropipet manual dan elektronik (single dan multi-channel), pipette controller, bottle-top dispenser, peristaltic pump, dan microplate washer.",
  Mikroskopi:
    "Mikroskop untuk pengamatan biologi, material, dan pendidikan. Pilihan meliputi mikroskop biologi, stereo, metalurgi, fluoresensi, polarisasi, inverted, mikroskop pendidikan, dan mikroskop video digital.",
  "Alat Pendingin & Pengering Beku":
    "Peralatan pendingin dan pengering beku untuk laboratorium. Termasuk freeze dryer, ice maker, serta chiller dan circulator suhu rendah.",
  "Biosafety & Laminar Flow":
    "Kabinet kerja untuk melindungi sampel, pengguna, dan lingkungan. Tersedia laminar flow cabinet, biological safety cabinet, PCR cabinet, fume hood (berducting dan ductless), serta fume extractor.",
  "Water Bath":
    "Water bath untuk memanaskan sampel secara merata pada suhu terkontrol. Pilihan meliputi water bath standar, shaking water bath, dan circulating water bath.",
  "Alat Timbang":
    "Timbangan laboratorium untuk menimbang bahan dan sampel. Tersedia analytical balance, precision balance, serta density balance dan hydrostatic balance.",
  "Peralatan Keselamatan Kerja":
    "Peralatan keselamatan untuk area kerja laboratorium. Termasuk emergency eye wash dan shower, portable eye wash, serta lemari penyimpanan bahan kimia.",
  "Pemurnian Air":
    "Sistem pemurnian air untuk kebutuhan laboratorium, dari air deionisasi hingga air ultra murni.",
};

export type SubcategoryEntry = {
  name: string;
  slug: string;
  products: Product[];
  /** true bila subkategori ini memiliki halaman sendiri. */
  hasPage: boolean;
};

export type CategoryPage = {
  category: ProductCategory;
  slug: string;
  label: string;
  intro: string;
  products: Product[];
  subcategories: SubcategoryEntry[];
};

export type SubcategoryPage = SubcategoryEntry & {
  intro: string;
  category: CategoryPage;
};

/** Urutan subkategori: yang produknya paling banyak lebih dulu, lalu alfabetis. */
const bySizeThenName = (a: SubcategoryEntry, b: SubcategoryEntry) =>
  b.products.length - a.products.length || a.name.localeCompare(b.name, "id");

function buildCategoryPages(): CategoryPage[] {
  const pages: CategoryPage[] = [];

  (Object.keys(categoryPageInfo) as ProductCategory[]).forEach((category) => {
    const info = categoryPageInfo[category];
    const inCategory = products.filter((product) => product.category === category);
    if (!info || inCategory.length === 0) return;

    const groups = new Map<string, Product[]>();
    inCategory.forEach((product) => {
      const group = groups.get(product.subcategory);
      if (group) group.push(product);
      else groups.set(product.subcategory, [product]);
    });

    const subcategories: SubcategoryEntry[] = [...groups.entries()]
      .map(([name, items]) => ({
        name,
        slug: slugify(name),
        products: items,
        hasPage: items.length >= MIN_PRODUCTS_FOR_SUBCATEGORY_PAGE,
      }))
      .sort(bySizeThenName);

    pages.push({ category, ...info, products: inCategory, subcategories });
  });

  return pages;
}

/** Semua halaman kategori - dihitung sekali saat modul dimuat. */
export const categoryPages: CategoryPage[] = buildCategoryPages();

/** Semua halaman subkategori (hanya yang memenuhi jumlah produk minimal). */
export const subcategoryPages: SubcategoryPage[] = categoryPages.flatMap((category) =>
  category.subcategories
    .filter((entry) => entry.hasPage)
    .map((entry) => ({
      ...entry,
      category,
      intro:
        subcategoryIntro[entry.name] ??
        `Katalog ${entry.name.toLowerCase()} untuk kebutuhan laboratorium, lengkap dengan spesifikasi setiap produk.`,
    })),
);

export function categoryHref(category: Pick<CategoryPage, "slug">) {
  return `/artha-labs/kategori/${category.slug}`;
}

export function subcategoryHref(
  category: Pick<CategoryPage, "slug">,
  subcategory: Pick<SubcategoryEntry, "slug">,
) {
  return `/artha-labs/kategori/${category.slug}/${subcategory.slug}`;
}

export function getCategoryPage(slug: string) {
  return categoryPages.find((page) => page.slug === slug);
}

export function getSubcategoryPage(categorySlug: string, subcategorySlug: string) {
  return subcategoryPages.find(
    (page) => page.category.slug === categorySlug && page.slug === subcategorySlug,
  );
}

/**
 * Halaman kategori dan subkategori tempat sebuah produk berada - dipakai
 * breadcrumb halaman detail produk. `subcategory` kosong bila subkategori produk
 * itu tidak memiliki halaman sendiri (kurang dari batas jumlah produk minimal);
 * `category` kosong bila kategorinya belum dibuatkan halaman.
 */
export function getProductCategoryTrail(product: Pick<Product, "category" | "subcategory">): {
  category?: CategoryPage;
  subcategory?: SubcategoryPage;
} {
  const category = categoryPages.find((page) => page.category === product.category);
  if (!category) return {};

  const subcategory = subcategoryPages.find(
    (page) => page.category.slug === category.slug && page.name === product.subcategory,
  );
  return { category, subcategory };
}

/** Daftar brand unik (urutan kemunculan) dari sekumpulan produk. */
export function brandsOf(items: Product[]): string[] {
  return [...new Set(items.map((product) => product.brand))];
}

/** Gabungkan daftar menjadi kalimat: "A", "A dan B", "A, B, dan C". */
export function joinIndonesian(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} dan ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, dan ${items[items.length - 1]}`;
}
