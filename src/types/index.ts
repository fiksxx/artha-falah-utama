/** Tipe data bersama untuk seluruh situs. */

export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export type SocialIcon = "instagram" | "linkedin" | "whatsapp" | "mail" | "facebook";

export type SocialLink = {
  label: string;
  href: string;
  icon: SocialIcon;
};

/** Logo brand pada marquee Artha Labs. */
export type Brand = {
  id: string;
  name: string;
  /** Path logo di /public. Ganti file-nya saja saat logo asli tersedia. */
  logo: string;
  website?: string;
};

export type ProductCategory = "Reagen" | "Alat Lab" | "Alat Kesehatan";

/**
 * Status ketersediaan produk - dipakai filter "Ketersediaan" di katalog.
 * Daftar pilihannya ada di lib/data/categories.ts (availabilityOptions).
 */
export type ProductAvailability = "Tersedia" | "Pre-Order" | "Indent";

/** Satu baris tabel label/nilai (packaging & spesifikasi). */
export type ProductDetailItem = {
  label: string;
  value: string;
};

/**
 * Blok "Informasi Tambahan" pada halaman detail produk.
 * Isi salah satu (atau keduanya): `items` untuk tabel, `bullets` untuk daftar.
 */
export type ProductInfoGroup = {
  id: string;
  title: string;
  items?: ProductDetailItem[];
  bullets?: string[];
  note?: string;
};

export type Product = {
  id: string;
  /** Slug URL unik: lowercase, tanpa spasi/karakter aneh. Dibuat otomatis dari nama produk. */
  slug: string;
  name: string;
  /** Nama brand - diambil dari data brands agar konsisten dengan marquee. */
  brand: string;
  /** Relasi ke `Brand.id` di lib/data/brands.ts - dipakai untuk filter brand. */
  brandId: string;
  category: ProductCategory;
  /**
   * Subkategori spesifik, mis. "Sentrifugasi".
   * Nilainya WAJIB ada di categoryTree (lib/data/categories.ts) - TypeScript
   * akan menolak nama yang tidak terdaftar saat Anda mengisi data produk.
   */
  subcategory: string;
  /**
   * Jenis produk yang lebih sempit dari subkategori, mis. "Sentrifus Benchtop".
   * Bebas diisi teks apa pun - opsi filternya dibuat otomatis dari data produk,
   * jadi tidak perlu didaftarkan di mana pun.
   */
  productType: string;
  /** Bidang penggunaan, mis. ["Laboratorium Klinik", "Uji Kualitas Air"]. */
  applications?: string[];
  /** Kode model/tipe produk - ikut dicari oleh search. */
  model: string;
  /**
   * Kata kunci tambahan khusus pencarian: sinonim, istilah Inggris, singkatan.
   * Tidak ditampilkan di halaman - gunanya agar pelanggan yang mencari
   * "centrifuge" tetap menemukan produk yang Anda beri nama "sentrifus".
   */
  keywords?: string[];
  /**
   * Harga dalam rupiah sebagai ANGKA, mis. 1250000 (tanpa titik, tanpa "Rp").
   * Format tampilan diurus otomatis oleh formatRupiah() di lib/utils.ts.
   * Biarkan kosong bila harga hanya diberikan atas permintaan - kartu produk
   * otomatis menampilkan "Harga atas permintaan", bukan angka palsu.
   */
  price?: number;
  /** Status stok. Dipakai filter ketersediaan dan badge di kartu produk. */
  availability: ProductAvailability;
  /**
   * Produk unggulan. Dipakai untuk memilih wakil tiap kategori pada 3 slot
   * teratas katalog - bukan sebagai badge visual.
   */
  featured?: boolean;
  /** Ringkasan 1-2 baris untuk kartu katalog & header detail. */
  shortDescription: string;
  /** Paragraf deskripsi lengkap untuk section "Deskripsi Produk". */
  description?: string[];
  /** Poin penting deskripsi (bullet) - opsional. */
  highlights?: string[];
  /** Section "Informasi Packaging". Isi hanya field yang datanya benar-benar ada. */
  packaging?: ProductDetailItem[];
  /** Tabel spesifikasi teknis. Kosongkan bila data belum tersedia. */
  specifications?: ProductDetailItem[];
  /** Blok informasi tambahan lain (features, applications, warranty, sertifikasi, dll). */
  additionalInformation?: ProductInfoGroup[];
  /** Override produk terkait. Bila kosong, dihitung otomatis dari kategori & brand. */
  relatedProductIds?: string[];
  /**
   * Path brosur PDF produk, mis. "/brochures/nama-produk.pdf".
   * Biarkan kosong bila brosur belum tersedia - tombol Download Brochure otomatis disembunyikan.
   */
  brochureUrl?: string;
  image: string;
  imageAlt: string;
};

export type ActivityCategory = "Pameran" | "Instalasi" | "Lainnya";

export type Activity = {
  id: string;
  title: string;
  category: ActivityCategory;
  /** ISO date (YYYY-MM-DD) - dipakai untuk sorting terbaru ke terlama. */
  startDate: string;
  endDate?: string;
  location?: string;
  description: string;
  image: string;
  imageAlt: string;
};

export type CompanyValue = {
  id: string;
  title: string;
  description: string;
  icon: "shield" | "spark" | "handshake" | "clock";
};

/**
 * Satu kartu statistik perusahaan (section Trust & Company Statistics).
 * `value` adalah angka final yang dituju animasi counter.
 */
export type CompanyStat = {
  id: string;
  /** Label kartu, mis. "Klien Terlayani". */
  label: string;
  /** Angka final. Ambil dari data (mis. products.length) bila memungkinkan. */
  value: number;
  /** Teks di depan angka, mis. "Rp". */
  prefix?: string;
  /** Teks di belakang angka, mis. "+" atau "%". */
  suffix?: string;
  /** Keterangan singkat satu baris di bawah label. */
  description?: string;
  icon: "handshake" | "box" | "tools" | "check" | "shield" | "spark";
};

/** Kartu quick navigation di halaman About. */
export type QuickNavCard = {
  id: string;
  title: string;
  href: string;
  description: string;
  icon: "tools" | "box" | "spark" | "mail";
};

/** Payload form kontak (dipakai client & API route). */
export type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot anti-spam - harus selalu kosong. */
  company?: string;
};

export type ContactApiResponse = {
  ok: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof ContactFormValues, string>>;
};
