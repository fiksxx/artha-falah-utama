import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { Analytics } from "@/components/analytics/Analytics";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SkipLink } from "@/components/layout/SkipLink";
import { HOME_TITLE, TITLE_TEMPLATE, organizationJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  // Preload subset latin saja agar CLS & LCP tetap kecil
  fallback: ["system-ui", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  // Judul halaman = "<judul halaman> | Artha Labs" lewat `title.template`.
  // `default` dipakai bila sebuah route tidak menetapkan judulnya sendiri, dan
  // sama dengan judul beranda. Nilai keduanya diatur di satu tempat: lib/seo.ts.
  title: { default: HOME_TITLE, template: TITLE_TEMPLATE },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  generator: "Next.js",
  keywords: [
    "CV Artha Falah Utama",
    "Artha Labs",
    "distributor alat laboratorium",
    "alat laboratorium",
    "bahan laboratorium",
    "reagen",
    "alat kesehatan",
    "pengadaan barang",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: { telephone: true, email: true, address: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    url: siteConfig.url,
    title: HOME_TITLE,
    description: siteConfig.description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: siteConfig.description,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Nilai token `brand-900`. Meta tag browser tidak bisa membaca CSS variable,
  // jadi hex-nya ditulis langsung - perbarui bila warna brand di globals.css berubah.
  themeColor: "#0B3929",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="flex min-h-screen flex-col font-sans">
        <SkipLink />
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />

        {/* Structured data organisasi untuk SEO */}
        <script
          type="application/ld+json"
          // Konten JSON-LD dibuat di server dari konfigurasi internal (bukan input user)
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />

        {/* Seluruh script pengukuran dikumpulkan di satu komponen */}
        <Analytics />
      </body>
    </html>
  );
}
