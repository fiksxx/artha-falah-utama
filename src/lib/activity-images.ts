import fs from "node:fs";
import path from "node:path";

import type { Activity } from "@/types";

/**
 * GAMBAR LOKAL UNTUK KARTU ACTIVITY
 * =================================
 *
 * Kartu Activity (daftar di /activity, header detail, tulisan terkait, dan
 * carousel Activity di halaman About) memakai foto lokal berdasarkan URUTAN,
 * bukan URL luar atau gambar acak:
 *
 *   Urutan ke-1 -> /images/activities/activity-01.png
 *   Urutan ke-2 -> /images/activities/activity-02.png
 *   Urutan ke-3 -> /images/activities/activity-03.png
 *   ... dan seterusnya (activity-04.png, activity-05.png, ...)
 *
 * MENGGANTI/MENAMBAH GAMBAR: cukup timpa atau tambahkan file di
 * `public/images/activities/` (nama file sama, rasio sekitar 3:2 - mis.
 * 1200 x 800 px). Tidak ada kode yang perlu diubah - kartu langsung memakainya
 * pada build/permintaan berikutnya. Bila filenya belum ada, kartu otomatis
 * memakai sampul bergaya brand (bukan gambar rusak atau kotak kosong).
 *
 * PENTING: fungsi di file ini memakai `fs`, jadi HANYA boleh dipakai dari
 * Server Component (mis. src/app/activity/page.tsx). Jangan diimpor dari
 * komponen "use client" seperti ActivityGrid.tsx - oper hasilnya lewat props.
 */
const IMAGE_DIR = "/images/activities";

/** Path publik gambar untuk urutan ke-`position` (mulai dari 1), atau undefined bila filenya belum ada. */
export function activityImageForPosition(position: number): string | undefined {
  const file = `activity-${String(position).padStart(2, "0")}.png`;
  const onDisk = path.join(process.cwd(), "public", IMAGE_DIR, file);
  return fs.existsSync(onDisk) ? `${IMAGE_DIR}/${file}` : undefined;
}

/**
 * Lengkapi setiap entri pada `list` dengan gambar lokal sesuai posisinya
 * (entri pertama -> activity-01.png, kedua -> activity-02.png, dst).
 *
 * Entri yang sudah punya `image` sendiri (foto asli yang ditulis manual di
 * lib/data/activities.ts) tidak ditimpa. Entri tanpa file yang sesuai tetap
 * memakai sampul bergaya brand seperti biasa.
 *
 * SELALU panggil dengan array `activities` PENUH (bukan hasil filter/pencarian)
 * agar penomoran tidak bergeser saat pengunjung memfilter atau mencari - itu
 * sebabnya fungsi ini dipanggil sekali di halaman (Server Component) lalu
 * hasilnya dioper ke bawah, bukan dihitung ulang dari daftar yang sudah disaring.
 */
export function withActivityImages(list: Activity[]): Activity[] {
  return list.map((activity, index) => {
    if (activity.image) return activity;
    const image = activityImageForPosition(index + 1);
    return image
      ? { ...activity, image, imageAlt: activity.imageAlt ?? `Dokumentasi: ${activity.title}` }
      : activity;
  });
}
