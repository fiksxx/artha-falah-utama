/**
 * Token gerak Artha Labs (Tahap M1).
 * Satu sumber untuk durasi, easing, jarak, dan stagger agar animasi
 * Framer Motion di seluruh situs konsisten. Nilai kurva sama dengan
 * `ease-smooth` di tailwind.config.ts.
 */

/** Kurva keluar yang lembut: cepat di awal, melambat di akhir. */
export const EASE_SMOOTH: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Durasi dalam detik. */
export const DURATION = {
  /** Umpan balik langsung: tab, chip, menu. */
  fast: 0.2,
  /** Transisi umum: pergantian halaman, kartu masuk. */
  base: 0.3,
  /** Reveal section saat masuk layar. */
  slow: 0.4,
} as const;

/** Jarak geser vertikal (px) untuk gerakan masuk. */
export const REVEAL_DISTANCE = 12;

/** Jeda antar-anak (detik) pada kelompok yang muncul berurutan. */
export const STAGGER = 0.07;

/** Bagian elemen yang harus terlihat sebelum reveal dijalankan. */
export const REVEAL_AMOUNT = 0.2;
