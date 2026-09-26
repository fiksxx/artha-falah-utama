import type { NavItem, SocialLink } from "@/types";

/**
 * Konfigurasi global situs.
 * TODO: ganti dengan konten asli - seluruh data kontak & sosial media di bawah masih placeholder.
 */
export const siteConfig = {
  name: "CV Artha Falah Utama",
  shortName: "Artha Falah Utama",
  legalName: "CV Artha Falah Utama",
  tagline: "Penyedia alat dan bahan laboratorium untuk institusi, industri, dan fasilitas kesehatan",
  description:
    "CV Artha Falah Utama adalah perusahaan penyedia alat dan bahan laboratorium melalui Artha Labs: reagen, alat laboratorium, dan alat kesehatan untuk institusi, industri, dan fasilitas kesehatan di Indonesia.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://arthalabs.id",
  locale: "id_ID",
  founded: "2020", // TODO: ganti dengan konten asli
  contact: {
    // TODO: ganti dengan konten asli
    addressLines: ["Jl. Kelapa Gading Perum Yasmin F No.1, Bumi Harapan, Kec. Bacukiki Bar., Kota Parepare, Sulawesi Selatan 91121"],
    addressInline: "Jl. Kelapa Gading Perum Yasmin F No.1, Bumi Harapan, Kec. Bacukiki Bar., Kota Parepare, Sulawesi Selatan 91121",
    email: "arthafalahutama@gmail.com",
    phoneDisplay: "+62 895-8010-44763",
    phoneHref: "+62895801044763",
    whatsappDisplay: "+62 895-8010-44763",
    whatsappNumber: "62895801044763",
    officeHours: "Senin - Sabtu, 08.00 - 17.00 WIB",
    /** Isi NEXT_PUBLIC_MAPS_EMBED_SRC di .env.local agar peta tampil. */
    mapsEmbedSrc: process.env.NEXT_PUBLIC_MAPS_EMBED_SRC ?? "",
    mapsLink: "https://maps.app.goo.gl/BLhYFkBZ9bnJp3qL6",
  },
} as const;

/**
 * 4 tab navigasi utama - URUTAN: About, Artha Labs, Activity, Contact Us.
 * Menambah halaman baru cukup menambah entri di sini (navbar, footer, dan sitemap ikut otomatis).
 */
export const navItems: NavItem[] = [
  { label: "About", href: "/", description: "Profil, visi misi, dan sejarah perusahaan" },
  { label: "Artha Labs", href: "/artha-labs", description: "Brand & produk laboratorium" },
  { label: "Activity", href: "/activity", description: "Rekam jejak kegiatan perusahaan" },
  { label: "Contact Us", href: "/contact", description: "Hubungi tim kami" },
];

/**
 * Tautan sosial media di footer dan halaman Contact Us.
 * Hanya cantumkan profil yang benar-benar ada. LinkedIn sengaja tidak dicantumkan
 * karena perusahaan belum memiliki halaman LinkedIn; bila nanti ada, tambahkan
 * kembali `{ label: "LinkedIn", href: "<URL halaman perusahaan>", icon: "linkedin" }`.
 */
export const socialLinks: SocialLink[] = [
  { label: "Instagram", href: "https://www.instagram.com/artha.falah/", icon: "instagram" },
  { label: "WhatsApp", href: `https://wa.me/${siteConfig.contact.whatsappNumber}`, icon: "whatsapp" },
  { label: "Email", href: `mailto:${siteConfig.contact.email}`, icon: "mail" },
];

export const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";
