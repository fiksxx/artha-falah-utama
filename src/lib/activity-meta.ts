import type { Activity, ActivityCategory, ActivityTopic } from "@/types";

/**
 * INFORMASI KATEGORI & TOPIK ACTIVITY (tanpa isi artikel)
 * =======================================================
 *
 * CATATAN PERFORMA: file ini sengaja TIDAK mengimpor lib/data/activities.ts.
 * Komponen daftar Activity (ActivityGrid, ActivityCard) berjalan di browser;
 * bila mengimpor data artikel, isi lengkap seluruh artikel (±170 KB) ikut
 * diunduh sebagai JavaScript. Data yang dibutuhkan daftar dioper lewat props
 * dalam bentuk ringkas (ActivityListItem).
 *
 * lib/data/activities.ts mengekspor ulang semua nama di bawah, jadi file lain
 * tetap boleh mengimpornya dari sana.
 */

/** Urutan kategori pada filter halaman Activity. */
export const activityCategories: ActivityCategory[] = ["Insight", "Panduan", "Kegiatan"];

/** Keterangan singkat tiap kategori - tampil sebagai penjelasan filter. */
export const activityCategoryDescription: Record<ActivityCategory, string> = {
  Insight: "Pembahasan teknologi, tren, dan perbandingan alat laboratorium.",
  Panduan: "Langkah praktis penggunaan, perawatan, dan penyimpanan.",
  Kegiatan: "Rekam jejak pameran, instalasi, dan kunjungan teknis kami.",
};

/**
 * Urutan topik Panduan pada filter tingkat dua. Urutannya mengikuti perjalanan
 * pembaca: kenali dasarnya, pilih alatnya, pahami cara kerjanya, pakai dengan
 * benar, rawat, atasi masalah, lalu bersiap membeli.
 */
export const guideTopics: ActivityTopic[] = [
  "Laboratorium Dasar",
  "Memilih Alat",
  "Fungsi & Prinsip Kerja",
  "Cara Penggunaan",
  "Tips & Perawatan",
  "Troubleshooting",
  "Panduan Pembelian",
];

/** Keterangan singkat tiap topik - tampil sebagai penjelasan filter. */
export const guideTopicDescription: Record<ActivityTopic, string> = {
  "Laboratorium Dasar": "Bekal dasar bekerja di laboratorium: air, alat gelas, dan penyimpanan bahan.",
  "Memilih Alat": "Cara menentukan jenis, kapasitas, dan spesifikasi alat sesuai kebutuhan.",
  "Fungsi & Prinsip Kerja": "Apa fungsi sebuah alat dan bagaimana cara kerjanya, dijelaskan sederhana.",
  "Cara Penggunaan": "Langkah demi langkah memakai alat dengan benar dan aman.",
  "Tips & Perawatan": "Membersihkan, menyimpan, dan menjaga alat agar hasilnya tetap dapat dipercaya.",
  Troubleshooting: "Masalah umum saat memakai alat, beserta pemeriksaan yang aman dilakukan sendiri.",
  "Panduan Pembelian": "Hal yang perlu dipahami dan ditanyakan sebelum membeli alat laboratorium.",
};

/**
 * Kegiatan (pameran, instalasi, kunjungan) dibaca sebagai peristiwa: yang
 * relevan adalah tanggal dan lokasinya, bukan estimasi waktu baca.
 */
export function isEventActivity(activity: Pick<Activity, "category">): boolean {
  return activity.category === "Kegiatan";
}

/**
 * Satu entri Activity untuk kartu & daftar: semua field KECUALI isi artikel
 * (`body`) dan daftar artikel terkait (`relatedIds`), yang hanya dipakai di
 * halaman detail.
 */
export type ActivityListItem = Omit<Activity, "body" | "relatedIds">;

/** Buang isi artikel sebelum entri dioper ke komponen browser. */
export function toActivityListItem(activity: Activity): ActivityListItem {
  const item = { ...activity };
  delete item.body;
  delete item.relatedIds;
  return item;
}
