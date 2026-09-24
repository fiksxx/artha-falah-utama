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
   * WAJIB diisi: setiap produk selalu menampilkan harga (saat ini Rp1 untuk
   * semua produk lewat `DEFAULT_PRICE` di lib/data/products.ts).
   */
  price: number;
  /** Status stok. Dipakai filter ketersediaan dan badge di kartu produk. */
  availability: ProductAvailability;
  /**
   * Produk unggulan. Dipakai untuk memilih wakil tiap kategori pada 3 slot
   * teratas katalog - bukan sebagai badge visual.
   */
  featured?: boolean;
  /** Paragraf deskripsi lengkap - bagian atas tab "Detail Produk". */
  description?: string[];
  /** Poin penting deskripsi (bullet) - opsional. */
  highlights?: string[];
  /** Section "Informasi Packaging". Isi hanya field yang datanya benar-benar ada. */
  packaging?: ProductDetailItem[];
  /**
   * Tabel spesifikasi teknis - tampil di bawah deskripsi pada tab "Detail Produk".
   * Kosongkan bila data belum tersedia.
   */
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

/**
 * Kategori konten Activity.
 *
 * Activity bukan hanya galeri kegiatan: halaman ini adalah knowledge hub
 * perusahaan. Tiga kategori di bawah sengaja dibuat sedikit agar filter tetap
 * mudah dibaca, tetapi cukup luas untuk menampung semua rencana konten:
 *
 * - "Insight"  : pembahasan teknologi, tren, dan perbandingan alat.
 * - "Panduan"  : langkah praktis - cara pakai, perawatan, penyimpanan.
 * - "Kegiatan" : rekam jejak perusahaan (pameran, instalasi, kunjungan).
 *
 * Menambah kategori baru: tambahkan di union ini, lalu daftarkan label dan
 * gayanya di `activityCategories` (lib/data/activities.ts).
 */
export type ActivityCategory = "Insight" | "Panduan" | "Kegiatan";

/**
 * Topik di dalam kategori "Panduan" - lapisan kedua knowledge hub.
 *
 * Kategori menjawab "jenis tulisan apa ini", topik menjawab "pembaca sedang
 * butuh apa": ingin tahu cara memakai alat, memilih alat, memahami fungsinya,
 * merawatnya, memecahkan masalahnya, atau bersiap membelinya. Dengan dua
 * lapis ini, Panduan bisa tumbuh sampai puluhan artikel tanpa menjadi daftar
 * panjang yang tak terarah.
 *
 * Menambah topik baru: tambahkan di union ini, lalu daftarkan urutan dan
 * keterangannya di `lib/data/activities.ts` (`guideTopics`, `guideTopicDescription`).
 * Tipe `Record` di sana membuat TypeScript menolak build bila ada yang terlewat.
 */
export type ActivityTopic =
  | "Cara Penggunaan"
  | "Memilih Alat"
  | "Fungsi & Prinsip Kerja"
  | "Tips & Perawatan"
  | "Troubleshooting"
  | "Laboratorium Dasar"
  | "Panduan Pembelian";

/**
 * Satu blok isi artikel.
 *
 * Isi artikel disimpan sebagai daftar blok berjenis, bukan satu string HTML.
 * Konsekuensinya: penulis konten tidak perlu menulis markup, tampilan setiap
 * blok dijamin konsisten dengan design system, dan tidak ada HTML mentah yang
 * masuk ke halaman. Blok baru cukup ditambahkan di union ini lalu diberi
 * tampilannya di `components/sections/ArticleBody.tsx`.
 */
export type ArticleBlock =
  /** Paragraf biasa. */
  | { type: "paragraph"; text: string }
  /** Sub-judul di dalam artikel. Otomatis masuk daftar isi. */
  | { type: "heading"; text: string }
  /** Daftar poin. `ordered: true` untuk langkah bernomor. */
  | { type: "list"; items: string[]; ordered?: boolean }
  /** Tabel dua kolom - memakai komponen DetailTable yang sama dengan halaman produk. */
  | { type: "table"; items: ProductDetailItem[]; caption?: string; labelHeader?: string; valueHeader?: string }
  /**
   * Langkah kerja berurutan, tiap langkah punya judul singkat + penjelasan.
   * Dipakai untuk panduan cara penggunaan alat.
   */
  | { type: "steps"; items: Array<{ title: string; text: string }> }
  /**
   * Kotak catatan. Dipakai hemat, maksimal dua atau tiga per artikel.
   * - "note"    (bawaan): informasi tambahan penting
   * - "tip"     : cara kerja yang lebih baik
   * - "warning" : risiko keselamatan atau kerusakan alat
   */
  | { type: "callout"; text: string; title?: string; tone?: "note" | "tip" | "warning" };

/**
 * Satu entri Activity - artikel, panduan, atau catatan kegiatan.
 *
 * `slug` dan `readingMinutes` TIDAK diisi manual: keduanya dihasilkan otomatis
 * di lib/data/activities.ts, sama seperti pola pada data produk.
 */
export type Activity = {
  id: string;
  /** Slug URL - dibuat otomatis dari judul. */
  slug: string;
  title: string;
  category: ActivityCategory;
  /** Topik - hanya untuk kategori "Panduan". */
  topic?: ActivityTopic;
  /** Tanggal publikasi, format ISO (YYYY-MM-DD). Dipakai untuk urutan terbaru. */
  date: string;
  /** Tanggal akhir - hanya relevan untuk kegiatan yang berlangsung beberapa hari. */
  endDate?: string;
  /** Lokasi kegiatan. Kosongkan untuk artikel. */
  location?: string;
  /** Ringkasan 1-2 kalimat: dipakai di kartu, meta description, dan Open Graph. */
  excerpt: string;
  /** Isi artikel. Kosongkan bila entri hanya berupa catatan singkat. */
  body?: ArticleBlock[];
  /** Estimasi waktu baca (menit) - dihitung otomatis dari `body`. */
  readingMinutes: number;
  /** Kata kunci topik, tampil di halaman detail. */
  tags?: string[];
  /** Tandai satu artikel sebagai sorotan utama di halaman Activity. */
  featured?: boolean;
  /** Override artikel terkait. Bila kosong, dihitung dari kategori & tag. */
  relatedIds?: string[];
  /**
   * Foto/gambar sampul. OPSIONAL: bila dikosongkan, kartu dan header artikel
   * otomatis memakai sampul bergaya brand (lihat ActivityCover). Cocok untuk
   * artikel teknis yang belum punya foto sendiri.
   */
  image?: string;
  /** Deskripsi gambar untuk pembaca layar. Wajib diisi bila `image` diisi. */
  imageAlt?: string;
};

/**
 * Bentuk data artikel yang ditulis manual - `slug` dan `readingMinutes` dihitung
 * otomatis. `slug` boleh diisi untuk mengunci URL yang sudah terlanjur dipakai
 * (mis. sudah terindeks mesin pencari), walaupun judulnya kemudian diubah.
 */
export type ActivitySeed = Omit<Activity, "slug" | "readingMinutes"> & { slug?: string };

/**
 * Satu testimoni pelanggan (section Testimoni Pelanggan di halaman About).
 * Data ada di lib/data/testimonials.ts.
 */
export type Testimonial = {
  id: string;
  /** Kutipan pelanggan. Ringkas: 1-3 kalimat. */
  quote: string;
  /** Nama pelanggan. */
  name: string;
  /** Instansi/perusahaan (opsional), mis. "Klinik Pratama". Bukan jabatan. */
  organization?: string;
  /** Rating 1-5, boleh desimal satu angka (mis. 4.9). Tampil sebagai angka di samping bintang. */
  rating: number;
  /**
   * true = data dummy (bukan pelanggan sungguhan). Hapus field ini setelah testimoni
   * asli dipasang dan disetujui pelanggan.
   */
  placeholder?: boolean;
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
  phone: string;
  /** Honeypot anti-spam - harus selalu kosong. */
  company?: string;
};

export type ContactApiResponse = {
  ok: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof ContactFormValues, string>>;
};
