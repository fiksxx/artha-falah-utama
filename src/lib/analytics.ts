/**
 * PELACAKAN PERISTIWA (ANALYTICS)
 * ===============================
 *
 * Lapisan tipis di atas Google Analytics yang sudah dipasang lewat
 * `@next/third-parties`. Tidak ada library tambahan dan tidak ada script kedua
 * yang dimuat - fungsi di bawah hanya menitipkan peristiwa ke gtag yang sudah
 * ada di halaman.
 *
 * Tiga aturan yang dipegang file ini:
 *
 * 1. AMAN SAAT GA TIDAK AKTIF. Bila `NEXT_PUBLIC_GA_MEASUREMENT_ID` kosong,
 *    `window.gtag` tidak pernah ada dan seluruh pemanggilan di bawah berhenti
 *    diam-diam. Tidak ada error di console, tidak ada permintaan jaringan.
 *
 * 2. DAFTAR PERISTIWA TERTUTUP. Nama dan parameter peristiwa didefinisikan
 *    sebagai union di bawah, sehingga salah ketik nama peristiwa menggagalkan
 *    build, bukan diam-diam mengirim data yang tidak pernah terbaca di laporan.
 *
 * 3. HANYA YANG DIPAKAI. Peristiwa di bawah dipilih karena masing-masing
 *    menjawab satu pertanyaan bisnis yang nyata. Jangan menambah peristiwa
 *    tanpa tahu laporan apa yang akan dibaca darinya.
 *
 * Kunjungan halaman TIDAK perlu dilacak di sini - GA4 sudah mencatatnya sendiri.
 */

/**
 * Peristiwa yang dilacak, beserta alasannya:
 *
 * - `catalog_search`      : kata kunci apa yang dicari pengunjung, dan berapa
 *                           hasilnya. Pencarian yang menghasilkan nol produk
 *                           adalah petunjuk paling berguna untuk menambah
 *                           katalog atau kata kunci produk.
 * - `quote_request_start` : pengunjung membuka form penawaran dari satu produk.
 *                           Menunjukkan produk mana yang paling diminati,
 *                           termasuk yang akhirnya tidak jadi dikirim.
 * - `contact_form_submit` : pesan berhasil terkirim. Dibandingkan dengan
 *                           `quote_request_start`, angkanya memperlihatkan
 *                           berapa banyak permintaan yang berhenti di tengah.
 */
export type AnalyticsEventMap = {
  catalog_search: { search_term: string; result_count: number };
  quote_request_start: { product_slug: string; category?: string };
  contact_form_submit: { is_quote_request: boolean };
};

type GtagFunction = (
  command: "event",
  eventName: string,
  eventParams?: Record<string, unknown>,
) => void;

declare global {
  interface Window {
    gtag?: GtagFunction;
  }
}

/**
 * Kirim satu peristiwa ke Google Analytics.
 * Tidak melakukan apa-apa di server maupun saat GA tidak dipasang.
 */
export function trackEvent<K extends keyof AnalyticsEventMap>(
  name: K,
  params: AnalyticsEventMap[K],
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
