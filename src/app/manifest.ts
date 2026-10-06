import type { MetadataRoute } from "next";

import { TITLE_BRAND } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

/**
 * Web manifest (Tahap S2) - dilayani di /manifest.webmanifest dan ditautkan
 * otomatis oleh Next.js lewat <link rel="manifest">.
 *
 * Hanya memakai data yang sudah ada: nama situs, deskripsi, warna tema (sama
 * dengan `themeColor` di layout.tsx), dan ikon yang sudah ada di proyek.
 * Ukuran ikon sesuai berkas aslinya: logo-square.png 512x512, apple-icon.png 180x180.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${TITLE_BRAND} - ${siteConfig.name}`,
    short_name: TITLE_BRAND,
    description: siteConfig.description,
    start_url: "/",
    display: "browser",
    lang: "id",
    background_color: "#ffffff",
    theme_color: "#0B3929",
    icons: [
      { src: "/logo-square.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
