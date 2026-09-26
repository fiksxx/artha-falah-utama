import type { Metadata } from "next";

import { siteConfig, socialLinks } from "@/lib/site";

/** Gambar Open Graph bawaan - satu-satunya gambar yang ukurannya dijamin 1200x630. */
const DEFAULT_OG_IMAGE = "/og-image.png";

/**
 * JUDUL HALAMAN (tag <title>)
 * ===========================
 *
 * Setiap halaman berjudul "<judul halaman> | Artha Labs". Akhiran ditempel
 * otomatis oleh `title.template` di app/layout.tsx, jadi page.tsx cukup menulis
 * judul halamannya saja (mis. "Hubungi Kami").
 *
 * Akhiran memakai nama brand "Artha Labs" (sesuai domain arthalabs.id) karena
 * lebih pendek dari nama badan usaha; nama "CV Artha Falah Utama" tetap muncul
 * di judul beranda, og:site_name, dan structured data Organization.
 *
 * Judul beranda sengaja tidak memuat lokasi atau klaim yang belum dikonfirmasi.
 */
export const TITLE_BRAND = "Artha Labs";
export const TITLE_TEMPLATE = `%s | ${TITLE_BRAND}`;
export const HOME_TITLE = `${TITLE_BRAND} – Supplier Reagen & Alat Laboratorium | ${siteConfig.name}`;

/**
 * META DESCRIPTION
 * ================
 *
 * Batas panjang meta description. Cuplikan di hasil pencarian umumnya terpotong
 * di sekitar panjang ini, jadi teks yang lebih panjang dipendekkan lebih dulu
 * agar kalimatnya tidak terpotong sembarangan.
 */
export const META_DESCRIPTION_MAX = 160;

/**
 * Pendekkan teks menjadi paling banyak `max` karakter, dipotong di batas kata
 * dan diberi "…" bila memang terpotong. Spasi ganda/baris baru dirapikan.
 */
export function truncateAtWord(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;

  // Sisakan satu karakter untuk "…".
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > 0 ? cut.slice(0, lastSpace) : cut;

  // Jangan akhiri dengan tanda baca menggantung, mis. "kontrol digital, …".
  return `${base.replace(/[\s,;:.(\-–—]+$/, "")}…`;
}

type PageMetadataInput = {
  /** Judul halaman tanpa akhiran brand, mis. "Hubungi Kami". */
  title: string;
  /**
   * Judul lengkap yang dipakai apa adanya, TANPA akhiran " | Artha Labs".
   * Hanya untuk halaman yang judulnya sudah memuat brand (beranda).
   */
  absoluteTitle?: string;
  description: string;
  /** Path relatif, mis. "/artha-labs". Root pakai "/". */
  path: string;
  /** Override gambar Open Graph bila perlu. */
  image?: string;
  keywords?: string[];
  /** "article" untuk halaman tulisan di Activity. Default "website". */
  type?: "website" | "article";
  /** Tanggal terbit (ISO) - hanya dipakai bila `type` bernilai "article". */
  publishedTime?: string;
};

/**
 * Helper metadata per halaman: canonical URL, Open Graph, dan Twitter card konsisten.
 * Menambah halaman baru cukup memanggil helper ini di file page.tsx-nya.
 */
export function createPageMetadata({
  title,
  absoluteTitle,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  keywords,
  type = "website",
  publishedTime,
}: PageMetadataInput): Metadata {
  const url = path === "/" ? siteConfig.url : `${siteConfig.url}${path}`;
  /** Teks yang sama persis dengan <title> - dipakai juga untuk Open Graph & Twitter. */
  const fullTitle = absoluteTitle ?? TITLE_TEMPLATE.replace("%s", title);

  /**
   * Dimensi hanya dicantumkan untuk gambar OG bawaan, karena hanya gambar itu
   * yang dipastikan berukuran 1200x630. Menuliskan ukuran yang salah untuk foto
   * produk atau artikel justru membuat pratinjau tautan terpotong.
   */
  const images =
    image === DEFAULT_OG_IMAGE
      ? [{ url: image, width: 1200, height: 630, alt: `${title} - ${siteConfig.name}` }]
      : [{ url: image, alt: `${title} - ${siteConfig.name}` }];

  const sharedOpenGraph = {
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: fullTitle,
    description,
    url,
    images,
  };

  return {
    // String biasa -> akhiran dari title.template ditempel Next.js.
    // `absolute` -> dipakai apa adanya (tanpa akhiran ganda).
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    keywords,
    alternates: { canonical: path },
    // Dipisah dua cabang agar TypeScript dapat mencocokkan bentuk metadata
    // Open Graph yang berbeda antara "website" dan "article".
    openGraph:
      type === "article"
        ? { ...sharedOpenGraph, type: "article", publishedTime }
        : { ...sharedOpenGraph, type: "website" },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

/**
 * Bagian jalan dari alamat kantor. Kota, provinsi, dan kode pos diisi di field
 * masing-masing di bawah, jadi tidak diulang di sini. Bila alamat di
 * lib/site.ts berubah, perbarui juga nilai ini.
 */
const STREET_ADDRESS = "Jl. Kelapa Gading Perum Yasmin F No.1, Bumi Harapan, Kec. Bacukiki Bar.";

/**
 * Profil media sosial resmi perusahaan (bukan WhatsApp/email) untuk `sameAs`.
 * Diambil dari socialLinks agar sama dengan tautan di footer. Instagram
 * dikonfirmasi pemilik sebagai akun resmi (25 Sep 2026).
 */
const SAME_AS_ICONS = new Set(["instagram"]);

/** JSON-LD Organization untuk rich result. */
export function organizationJsonLd() {
  const sameAs = socialLinks
    .filter((link) => SAME_AS_ICONS.has(link.icon))
    .map((link) => link.href);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    // Logo persegi 512x512 (public/logo-square.png), bukan gambar Open Graph.
    logo: `${siteConfig.url}/logo-square.png`,
    description: siteConfig.description,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phoneHref,
    // Data kontak dikonfirmasi pemilik sebagai data asli (25 Sep 2026).
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: siteConfig.contact.phoneHref,
      email: siteConfig.contact.email,
      availableLanguage: ["id"],
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: STREET_ADDRESS,
      addressLocality: "Kota Parepare",
      addressRegion: "Sulawesi Selatan",
      postalCode: "91121",
      addressCountry: "ID",
    },
  };
}
