import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

/** Gambar Open Graph bawaan - satu-satunya gambar yang ukurannya dijamin 1200x630. */
const DEFAULT_OG_IMAGE = "/og-image.png";

type PageMetadataInput = {
  title: string;
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
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  keywords,
  type = "website",
  publishedTime,
}: PageMetadataInput): Metadata {
  const url = path === "/" ? siteConfig.url : `${siteConfig.url}${path}`;
  const fullTitle = `${title} | ${siteConfig.name}`;

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
    title,
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

/** JSON-LD Organization untuk rich result. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/og-image.png`,
    description: siteConfig.description,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phoneHref,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.addressLines[0],
      addressLocality: "Kota Parepare",
      addressRegion: "Sulawesi Selatan",
      postalCode: "91121",
      addressCountry: "ID",
    },
  };
}
