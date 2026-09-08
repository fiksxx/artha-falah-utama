/**
 * Next.js configuration - CV Artha Falah Utama
 * Target hosting: Vercel
 */

/** Security headers (dipakai di semua route). */
const securityHeaders = [
  // Paksa HTTPS (HSTS). Vercel sudah auto-redirect http -> https, header ini mengunci di sisi browser.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    // Format modern otomatis + lazy-load bawaan next/image
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 640, 768, 1024, 1280, 1440, 1920],
    imageSizes: [96, 128, 256, 384],
  },
  /**
   * Jaring aman SEO: halaman /artha-exp sudah DIHAPUS dari project (bukan
   * disembunyikan). Redirect permanen (308) ini hanya menangkap tautan lama
   * atau hasil pencarian Google yang masih mengarah ke sana, lalu
   * mengarahkannya ke katalog Artha Labs supaya pengunjung tidak menemui 404.
   * Boleh dihapus setelah beberapa bulan bila Search Console sudah bersih.
   */
  async redirects() {
    return [
      { source: "/artha-exp", destination: "/artha-labs", permanent: true },
      { source: "/artha-exp/:path*", destination: "/artha-labs", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
