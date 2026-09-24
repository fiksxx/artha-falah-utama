import { GoogleAnalytics } from "@next/third-parties/google";

import { gaMeasurementId } from "@/lib/site";

/**
 * Titik pemasangan seluruh script analytics.
 *
 * Dipanggil sekali di `app/layout.tsx`. Bila nanti perlu menambah alat ukur
 * lain (mis. Search Console verification atau pixel iklan), tambahkan di sini
 * supaya layout tetap bersih dan mudah terlihat apa saja yang dimuat halaman.
 *
 * Script hanya dimuat bila `NEXT_PUBLIC_GA_MEASUREMENT_ID` terisi, jadi saat
 * pengembangan lokal tidak ada permintaan jaringan tambahan sama sekali.
 * `GoogleAnalytics` dari `@next/third-parties` memuat gtag.js setelah halaman
 * interaktif, sehingga tidak menghambat render awal maupun skor LCP.
 *
 * Pelacakan peristiwa (bukan kunjungan halaman) ada di `src/lib/analytics.ts`.
 */
export function Analytics() {
  if (!gaMeasurementId) return null;

  return <GoogleAnalytics gaId={gaMeasurementId} />;
}
