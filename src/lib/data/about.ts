import { brands } from "@/lib/data/brands";
import { products } from "@/lib/data/products";
import type { CompanyStat, CompanyValue, QuickNavCard } from "@/types";

/** TODO: ganti dengan konten asli - seluruh teks di file ini masih placeholder. */

export const vision =
  "Menjadi penyedia solusi alat dan bahan laboratorium terdepan di Indonesia yang unggul dalam kualitas produk dan layanan teknis.";

export const missions = [
  "Menyuplai alat dan reagen bersertifikasi resmi dari prinsipal global terpercaya.",
  "Memberikan rekomendasi teknis yang tepat sesuai kebutuhan pengujian klien.",
  "Menjamin pengiriman cepat dengan standar penanganan khusus (cold chain).",
  "Menyediakan dukungan instalasi, kalibrasi, garansi, dan ketersediaan suku cadang.",
];

/**
 * Quick navigation compact menuju halaman penting.
 * TODO: ganti dengan konten asli
 */
export const quickNavCards: QuickNavCard[] = [
  {
    id: "nav-artha-labs",
    title: "Artha Labs",
    href: "/artha-labs",
    description: "Solusi laboratorium: reagen, alat lab, dan alat kesehatan.",
    icon: "tools",
  },
  {
    id: "nav-activity",
    title: "Aktivitas",
    href: "/activity",
    description: "Rekam jejak pameran, instalasi, dan kegiatan terbaru kami.",
    icon: "spark",
  },
  {
    id: "nav-contact",
    title: "Hubungi Kami",
    href: "/contact",
    description: "Diskusikan kebutuhan dan peluang kerja sama dengan tim kami.",
    icon: "mail",
  },
];

/**
 * Trust & Company Statistics (halaman About).
 *
 * CARA MEMPERBARUI ANGKA:
 * - "Produk Tersedia" dan "Brand Mitra" TIDAK perlu disentuh. Keduanya
 *   dihitung otomatis dari data katalog, jadi setiap kali Anda menambah
 *   produk di `products.ts` atau brand di `brands.ts`, angka di website
 *   langsung ikut bertambah.
 * - "Klien Terlayani" dan "Kepuasan Pelanggan" tidak punya sumber data, jadi
 *   angkanya diisi manual di bawah ini. Cukup ubah nilai `value`.
 *
 * TODO WAJIB SEBELUM WEBSITE ONLINE: ganti `value` pada "stat-clients" dan
 * "stat-satisfaction" dengan angka asli perusahaan. Dua angka di bawah ini
 * masih contoh - menampilkan klaim yang tidak bisa dibuktikan berisiko
 * menurunkan kepercayaan calon klien.
 */
export const companyStats: CompanyStat[] = [
  {
    id: "stat-clients",
    label: "Klien Terlayani",
    value: 128, // TODO: ganti dengan jumlah klien asli
    suffix: "+",
    description: "Institusi pendidikan, industri, dan fasilitas kesehatan.",
    icon: "handshake",
  },
  {
    id: "stat-products",
    label: "Produk Tersedia",
    // Otomatis mengikuti jumlah entri di src/lib/data/products.ts
    value: products.length,
    description: "Reagen, alat laboratorium, dan alat kesehatan.",
    icon: "box",
  },
  {
    id: "stat-brands",
    label: "Brand Mitra",
    // Otomatis mengikuti jumlah entri di src/lib/data/brands.ts
    value: brands.length,
    description: "Merek prinsipal yang kami distribusikan.",
    icon: "tools",
  },
  {
    id: "stat-satisfaction",
    label: "Kepuasan Pelanggan",
    value: 100, // TODO: ganti dengan angka asli hasil survei/evaluasi layanan
    suffix: "%",
    description: "Berdasarkan evaluasi layanan dan pemesanan berulang.",
    icon: "check",
  },
];

export const companyValues: CompanyValue[] = [
  {
    id: "value-01",
    title: "Integritas",
    description: "Jujur dan transparan dalam setiap transaksi dan komunikasi dengan klien.",
    icon: "shield",
  },
  {
    id: "value-02",
    title: "Kemitraan",
    description: "Membangun kolaborasi jangka panjang yang saling menguntungkan dan berkelanjutan.",
    icon: "spark",
  },
  {
    id: "value-03",
    title: "Keandalan",
    description: "Sigap dalam melayani, merespons kendala, dan menepati komitmen waktu.",
    icon: "handshake",
  },
  {
    id: "value-04",
    title: "Inovasi",
    description: "Selalu mencari solusi terbaik dan produk terkini untuk kebutuhan klien.",
    icon: "clock",
  },
];
