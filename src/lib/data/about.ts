import { products } from "@/lib/data/products";
import type { QuickNavCard } from "@/types";

/** TODO: ganti dengan konten asli - seluruh teks di file ini masih placeholder. */

/**
 * Quick navigation compact menuju halaman penting.
 * TODO: ganti dengan konten asli
 */
export const quickNavCards: QuickNavCard[] = [
  {
    id: "nav-artha-labs",
    title: "Artha Labs",
    href: "/artha-labs",
    description: "Katalog reagen, alat laboratorium, dan alat kesehatan yang kami sediakan.",
    icon: "tools",
  },
  {
    id: "nav-activity",
    title: "Activity",
    href: "/activity",
    description: "Catatan teknis dan panduan penggunaan alat, serta kegiatan perusahaan.",
    icon: "spark",
  },
  {
    id: "nav-contact",
    title: "Contact Us",
    href: "/contact",
    description: "Kirim permintaan penawaran atau pertanyaan teknis kepada tim kami.",
    icon: "mail",
  },
];

/**
 * LINI BISNIS & CAKUPAN PRODUK (section "Jual Reagen, Alat Laboratorium, dan Alat Kesehatan").
 *
 * Section ini berbentuk blok editorial yang panjang ke bawah: satu blok = satu gambar +
 * satu kelompok teks, dan posisi gambar bergantian kiri/kanan sesuai urutan array.
 * Menambah atau mengurangi blok cukup dengan menyunting `businessBlocks`.
 *
 * Fokus isi: kebutuhan laboratorium (reagen, bahan habis pakai, alat, instrumen, dan
 * alat kesehatan yang relevan) untuk penelitian, pendidikan, pengujian, dan operasional.
 * Sektor industri lain tidak dijadikan fokus. Aturan isi: tanpa klaim yang tidak dapat
 * dibuktikan ("terbaik", "terlengkap", "nomor satu", dan sejenisnya).
 */

export type BusinessBlock = {
  id: string;
  /** Label kecil di atas judul. */
  eyebrow: string;
  title: string;
  text: string;
  /** Butir informasi. Daftar panjang (kategori, industri) memakai dua kolom. */
  points: string[];
  columns: 1 | 2;
  image: { src: string; alt: string };
};

/**
 * Foto produk nyata dari katalog untuk satu subkategori (yang bertanda `featured` lebih dulu).
 * Gambar selalu file lokal di /public/images/products - bukan URL luar.
 */
function productPhoto(subcategory: string, fallbackAlt: string) {
  const inGroup = products.filter((product) => product.subcategory === subcategory);
  const pick = inGroup.find((product) => product.featured) ?? inGroup[0];
  return pick
    ? { src: pick.image, alt: pick.imageAlt || pick.name }
    : { src: "/images/artha-labs-hero.png", alt: fallbackAlt };
}

export const businessBlocks: BusinessBlock[] = [
  {
    id: "block-kebutuhan-lab",
    eyebrow: "Kebutuhan laboratorium",
    title: "Dari reagen hingga instrumen, disiapkan untuk laboratorium Anda",
    text: "Artha Labs membantu institusi dan perusahaan menyediakan kebutuhan laboratorium: mulai dari reagen dan bahan habis pakai untuk pekerjaan sehari-hari, sampai instrumen dan peralatan untuk penelitian, pendidikan, dan pengujian. Katalog kami disusun per kategori dan brand mitra agar mudah ditelusuri dan dibandingkan.",
    points: [
      "Reagen dan bahan kimia laboratorium.",
      "Bahan habis pakai (consumable) untuk kegiatan rutin.",
      "Alat, instrumen, dan peralatan laboratorium.",
      "Alat kesehatan yang relevan dengan kebutuhan laboratorium.",
    ],
    columns: 1,
    image: { src: "/images/artha-labs-hero.png", alt: "Fasilitas dan produk Artha Labs" },
  },
  {
    id: "block-reagen",
    eyebrow: "Reagen dan bahan habis pakai",
    title: "Bahan yang dipakai setiap hari di laboratorium",
    text: "Hasil kerja laboratorium bergantung pada bahan yang dipakai. Kami menyediakan reagen dan bahan habis pakai dari brand mitra, dengan informasi produk yang dapat Anda cocokkan dengan metode dan kebutuhan kerja Anda.",
    points: [
      "Reagen analitik",
      "Bahan kimia laboratorium",
      "Buffer dan larutan standar",
      "Bahan habis pakai untuk kerja rutin",
      "Reagen untuk kebutuhan khusus: tanyakan ke tim kami",
    ],
    columns: 2,
    image: { src: "/images/gambar-reagen.png", alt: "Produk Reagen ArthaLabs" },
  },
  {
    id: "block-alat",
    eyebrow: "Alat, instrumen, dan peralatan",
    title: "Peralatan untuk analisis, preparasi, dan operasional harian",
    text: "Dari instrumen analitik sampai peralatan pendukung yang dipakai setiap hari. Kami juga menyediakan alat kesehatan yang relevan dengan kebutuhan laboratorium, misalnya untuk laboratorium klinik dan fasilitas kesehatan.",
    points: [
      "Instrumen analitik dan spektroskopi",
      "Mikroskop",
      "Sentrifuge",
      "Inkubator, oven, dan alat pemanas",
      "Autoklaf dan alat sterilisasi",
      "Timbangan analitik",
      "Alat uji kualitas air",
      "Biosafety cabinet dan fume hood",
    ],
    columns: 2,
    image: { src: "/images/gambar-alat.png", alt: "Produk Alat ArthaLabs" },
  },
];
