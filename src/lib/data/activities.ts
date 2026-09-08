import type { Activity, ActivityCategory } from "@/types";

/** Urutan filter kategori di halaman Aktivitas. */
export const activityCategories: ActivityCategory[] = ["Pameran", "Instalasi", "Lainnya"];

/**
 * Rekam jejak kegiatan perusahaan.
 * TODO: ganti dengan konten asli - tanggal memakai format ISO (YYYY-MM-DD) agar sorting akurat.
 */
export const activities: Activity[] = [
  {
    id: "activity-01",
    title: "Pameran Industri Laboratorium 2025",
    category: "Pameran",
    startDate: "2025-11-12",
    endDate: "2025-11-15",
    location: "Convention Center, Jakarta",
    description:
      "Partisipasi pada pameran industri laboratorium dengan demo produk unggulan dari berbagai kategori.",
    image: "/images/activities/activity-01.png",
    imageAlt: "Placeholder dokumentasi kegiatan pameran 01",
  },
  {
    id: "activity-02",
    title: "Instalasi Laboratorium Terpadu",
    category: "Instalasi",
    startDate: "2025-08-04",
    endDate: "2025-08-08",
    location: "Universitas, Bandung",
    description:
      "Instalasi dan commissioning peralatan laboratorium beserta pelatihan operator di lokasi klien.",
    image: "/images/activities/activity-02.png",
    imageAlt: "Placeholder dokumentasi kegiatan instalasi 02",
  },
  {
    id: "activity-03",
    title: "Health & Science Expo 2025",
    category: "Pameran",
    startDate: "2025-05-20",
    endDate: "2025-05-22",
    location: "Exhibition Hall, Surabaya",
    description:
      "Menampilkan lini alat kesehatan dan solusi pengadaan terintegrasi kepada peserta pameran.",
    image: "/images/activities/activity-03.png",
    imageAlt: "Placeholder dokumentasi kegiatan pameran 03",
  },
];

/** Kegiatan terurut dari tanggal terbaru ke terlama. */
export const sortedActivities = [...activities].sort(
  (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
);
