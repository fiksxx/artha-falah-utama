import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

type PageMetadataInput = {
  title: string;
  description: string;
  /** Path relatif, mis. "/artha-labs". Root pakai "/". */
  path: string;
  /** Override gambar Open Graph bila perlu. */
  image?: string;
  keywords?: string[];
};

/**
 * Helper metadata per halaman: canonical URL, Open Graph, dan Twitter card konsisten.
 * Menambah halaman baru cukup memanggil helper ini di file page.tsx-nya.
 */
export function createPageMetadata({
  title,
  description,
  path,
  image = "/og-image.png",
  keywords,
}: PageMetadataInput): Metadata {
  const url = path === "/" ? siteConfig.url : `${siteConfig.url}${path}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title: `${title} | ${siteConfig.name}`,
      description,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${title} - ${siteConfig.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
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
      addressLocality: siteConfig.contact.addressLines[1],
      addressCountry: "ID",
    },
  };
}
