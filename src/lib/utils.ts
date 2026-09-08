import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Gabungkan className kondisional + resolusi konflik utility Tailwind. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format tanggal ISO (YYYY-MM-DD) ke format Indonesia, mis. "12 Maret 2025". */
export function formatDateID(
  isoDate: string,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" },
) {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat("id-ID", { ...options, timeZone: "Asia/Jakarta" }).format(date);
}

/** Rentang tanggal untuk kartu Activity: "12 - 15 Maret 2025" atau tanggal tunggal. */
export function formatDateRangeID(startDate: string, endDate?: string) {
  if (!endDate || endDate === startDate) return formatDateID(startDate);
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return `${startDate} - ${endDate}`;
  }
  const sameMonth =
    start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth();
  if (sameMonth) {
    return `${start.getDate()} - ${formatDateID(endDate)}`;
  }
  const sameYear = start.getFullYear() === end.getFullYear();
  const startLabel = sameYear
    ? formatDateID(startDate, { day: "numeric", month: "long" })
    : formatDateID(startDate);
  return `${startLabel} - ${formatDateID(endDate)}`;
}

/** Buang karakter kontrol & rapikan whitespace dari input user (anti header/HTML injection). */
export function sanitizeText(value: string, maxLength = 5000) {
  return value
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\r\n/g, "\n")
    .trim()
    .slice(0, maxLength);
}

/** Escape HTML entity - dipakai saat menyusun body email HTML dari input user. */
export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Ubah teks jadi slug URL: lowercase, tanpa spasi, hanya huruf/angka/tanda hubung.
 * Dipakai untuk slug produk sehingga route detail dibuat otomatis dari data.
 */
export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Jumlah angka di belakang koma untuk harga.
 *
 * 0 -> Rp1          Rp250.000      Rp1.250.000
 * 2 -> Rp1,00       Rp250.000,00   Rp1.250.000,00
 *
 * Catatan format Indonesia: TITIK adalah pemisah ribuan dan KOMA adalah
 * pemisah desimal. Jadi "Rp1.00" bukan format rupiah yang sah - yang setara
 * dengan maksud itu adalah "Rp1,00", yang muncul bila nilai di bawah ini 2.
 * Cukup ubah satu angka ini untuk mengganti gaya harga di SELURUH website.
 */
export const PRICE_FRACTION_DIGITS = 0;

/**
 * Format angka rupiah untuk ditampilkan, mis. 1250000 -> "Rp1.250.000".
 * Satu-satunya tempat harga diformat, sehingga tampilannya pasti konsisten
 * di kartu produk, halaman detail, maupun tempat lain di masa depan.
 */
export function formatRupiah(value: number, fractionDigits = PRICE_FRACTION_DIGITS) {
  const amount = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);

  return `Rp${amount}`;
}

/**
 * Normalisasi teks untuk pencarian: huruf kecil, spasi tunggal.
 * Dipakai bersama `compactText` oleh pencarian katalog.
 */
export const normalizeText = (value: string) =>
  value.toLowerCase().replace(/\s+/g, " ").trim();

/**
 * Buang SEMUA karakter selain huruf & angka.
 * Inilah yang membuat pencarian "Z 216 M", "z216m", dan "Z-216-M" sama-sama
 * menemukan model "Z 216 M".
 */
export const compactText = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
