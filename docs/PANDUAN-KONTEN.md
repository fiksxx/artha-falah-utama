# Panduan Mengelola Konten Website

**CV Artha Falah Utama** — manual pengelolaan produk, brand, kategori, gambar, dan konten halaman.

Dokumen ini ditulis agar bisa diikuti langkah demi langkah. Untuk deployment, lihat
`docs/PANDUAN-DEPLOYMENT.md`.

---

## 1. Audit Arsitektur Website

Hasil pemeriksaan struktur project yang sekarang ada.

### 1.1 Teknologi

| Aspek | Kondisi saat ini |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| Bahasa | TypeScript 5.7 (strict) |
| UI library | React 19 |
| Styling | Tailwind CSS 3.4 + CSS variables di `src/app/globals.css` |
| Animasi | Framer Motion 12 |
| Validasi | Zod 3.24 (dipakai di client dan server) |
| Email | Resend 4.1 |
| Analytics | `@next/third-parties` (Google Analytics) |
| Font | Inter via `next/font/google` (self-hosted otomatis) |
| Utility | `clsx` + `tailwind-merge` (helper `cn()`) |
| Node minimum | 18.18.0 (lihat `engines` di `package.json`) |

### 1.2 Frontend & backend

Website ini **hybrid**, bukan static murni:

- **Frontend (static)** — 5 halaman utama + 9 halaman detail produk dibuat saat build
  (Static Site Generation). Ini yang membuat website cepat.
- **Backend (serverless)** — hanya **satu** endpoint: `src/app/api/contact/route.ts`.
  Fungsinya menerima kiriman formulir kontak, memvalidasi, lalu mengirim email lewat Resend.

Artinya website **tidak bisa** di-host sebagai HTML statis biasa (shared hosting/cPanel),
karena formulir kontak butuh runtime Node.js. Hosting harus mendukung serverless function.

### 1.3 Database

**Tidak ada database.** Semua konten disimpan sebagai file TypeScript di `src/lib/data/`.
Data ini di-compile menjadi bagian dari website saat build. Konsekuensinya:

- Sangat cepat dan tidak ada biaya database.
- Tidak ada risiko SQL injection atau kebocoran kredensial database.
- Untuk mengubah konten harus mengedit file lalu deploy ulang (otomatis, ±2 menit).

### 1.4 Layanan pihak ketiga

| Layanan | Dipakai untuk | Wajib? |
| --- | --- | --- |
| Resend | Mengirim email dari formulir kontak | **Wajib** agar formulir berfungsi |
| Google Analytics | Statistik kunjungan | Opsional |
| Google Maps Embed | Peta lokasi di halaman kontak | Opsional |
| Vercel | Hosting + build + HTTPS | **Wajib** (atau setara) |

Semuanya punya paket gratis yang cukup untuk company profile.

### 1.5 Penyimpanan gambar & file

Semua aset disimpan **lokal di dalam repository**, folder `public/`:

```
public/
├── brands/            8 logo brand (brand-01.png … brand-08.png)
├── images/
│   ├── about/         company.png
│   ├── activities/    activity-01.png … activity-06.png
│   └── products/      product-01.png … product-09.png
├── brochures/         (folder brosur PDF — masih kosong)
└── og-image.png       gambar preview saat link dibagikan
```

Favicon ada di `src/app/icon.png` dan `src/app/apple-icon.png` (dikenali otomatis Next.js).

### 1.6 Sistem routing

Routing berbasis folder (App Router). Nama folder = URL.

| URL | File |
| --- | --- |
| `/` (About) | `src/app/page.tsx` |
| `/artha-labs` | `src/app/artha-labs/page.tsx` |
| `/artha-labs/[slug]` | `src/app/artha-labs/[slug]/page.tsx` |
| `/activity` | `src/app/activity/page.tsx` |
| `/contact` | `src/app/contact/page.tsx` |
| `/api/contact` | `src/app/api/contact/route.ts` |
| `/sitemap.xml` | `src/app/sitemap.ts` (otomatis) |
| `/robots.txt` | `src/app/robots.ts` (otomatis) |

URL produk dibuat otomatis dari nama produk. Contoh: `"Reagen Placeholder 01"` →
`/artha-labs/reagen-placeholder-01`.

### 1.7 Environment variables

Didefinisikan di `.env.example`. Untuk lokal, salin menjadi `.env.local`.

| Variabel | Wajib | Fungsi |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Ya | Basis canonical URL, sitemap, Open Graph |
| `RESEND_API_KEY` | Ya | Kunci API pengirim email |
| `CONTACT_FROM_EMAIL` | Ya | Alamat pengirim (domain harus terverifikasi di Resend) |
| `CONTACT_TO_EMAIL` | Ya | Tujuan notifikasi (boleh beberapa, pisahkan koma) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Tidak | ID Google Analytics; kosong = GA tidak dimuat |
| `NEXT_PUBLIC_MAPS_EMBED_SRC` | Tidak | URL embed Google Maps; kosong = tampil placeholder |

Awalan `NEXT_PUBLIC_` berarti nilainya terlihat di browser — **jangan** pakai awalan itu untuk
kunci rahasia. `RESEND_API_KEY` sengaja tanpa awalan tersebut agar tetap rahasia di server.

### 1.8 Build system

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Menjalankan di komputer sendiri (http://localhost:3000) |
| `npm run build` | Membuat versi produksi ke folder `.next` |
| `npm run start` | Menjalankan hasil build secara lokal |
| `npm run lint` | Memeriksa kualitas kode |
| `npm run typecheck` | Memeriksa kesalahan tipe TypeScript |

### 1.9 Yang masih perlu diperbaiki sebelum production

Daftar ini penting — semuanya soal **isi**, bukan kerusakan teknis.

| # | Temuan | Lokasi | Prioritas |
| --- | --- | --- | --- |
| 1 | 9 produk masih nama placeholder | `src/lib/data/products.ts` | **Kritis** |
| 2 | 8 brand masih "Brand Placeholder" + logo placeholder | `src/lib/data/brands.ts`, `public/brands/` | **Kritis** |
| 3 | Alamat, telepon, WhatsApp, email masih placeholder | `src/lib/site.ts` | **Kritis** |
| 4 | Link Instagram & LinkedIn masih generik | `src/lib/site.ts` → `socialLinks` | **Kritis** |
| 5 | Logo masih monogram SVG sementara | `src/components/layout/Logo.tsx` | Tinggi |
| 6 | Foto produk & kegiatan masih gambar placeholder | `public/images/` | Tinggi |
| 7 | Label navbar masih Inggris (`About`, `Activity`, `Contact Us`) padahal isi halaman sudah Indonesia | `src/lib/site.ts` → `navItems` | Tinggi |
| 8 | Visi, misi, values, kegiatan masih teks umum (bukan lorem, tapi belum data asli) | `src/lib/data/about.ts`, `activities.ts` | Sedang |
| 9 | Belum ada halaman Kebijakan Privasi | belum dibuat | Sedang |
| 10 | Belum ada brosur PDF | `public/brochures/` | Rendah |
| 11 | Rate limit formulir masih in-memory (reset tiap server idle) | `src/app/api/contact/route.ts` | Rendah |
| 12 | Belum pernah dijalankan `npm install` / `npm run build` | — | **Wajib dilakukan** |

Poin 12 penting: project ini dibuat di lingkungan tanpa akses internet, sehingga dependency
belum pernah benar-benar dipasang dan build produksi belum pernah diuji. Langkah pertama Anda
adalah menjalankan `npm install` lalu `npm run build` di komputer sendiri.

---

## 2. Peta File: Mana untuk Apa

Sebelum mengedit, kenali dulu tiga jenis file:

| Jenis | Lokasi | Aman diedit sendiri? |
| --- | --- | --- |
| **Data** (isi website) | `src/lib/data/` | Ya — ini yang paling sering Anda ubah |
| **Konfigurasi** (identitas & kontak) | `src/lib/site.ts` | Ya |
| **Komponen** (tampilan) | `src/components/` | Hati-hati — ubah hanya bila perlu ganti desain |

Untuk kebutuhan sehari-hari (tambah produk, ganti brand, ubah nomor telepon), Anda **hanya**
perlu menyentuh folder `src/lib/data/` dan file `src/lib/site.ts`.

### Aturan dasar mengedit file TypeScript

1. Teks selalu diapit tanda kutip: `"seperti ini"`.
2. Setiap baris dalam objek diakhiri koma.
3. Kurung kurawal `{ }` dan siku `[ ]` harus selalu berpasangan.
4. Jika teks Anda mengandung tanda kutip, gunakan kutip tunggal di luar:
   `'Ukuran 5" x 3"'`.
5. Setelah mengedit, jalankan `npm run typecheck`. Jika tidak ada pesan error, format Anda benar.

---

## 3. Mengelola Produk

### 3.1 Lokasi data

Semua produk ada di **satu file**: `src/lib/data/products.ts`, di dalam array bernama
`productSeeds`.

### 3.2 Daftar field lengkap

| Field | Wajib | Tipe | Keterangan |
| --- | --- | --- | --- |
| `id` | Ya | teks | Kode unik internal, mis. `"product-10"`. Tidak tampil di website |
| `name` | Ya | teks | Nama produk. URL dibuat otomatis dari sini |
| `brandId` | Ya | teks | Harus cocok dengan `id` di `brands.ts` |
| `category` | Ya | pilihan | `"Reagen"`, `"Alat Lab"`, atau `"Alat Kesehatan"` |
| `model` | Ya | teks | **Ini kolom SKU/kode produk Anda.** Ikut dicari oleh pencarian |
| `shortDescription` | Ya | teks | 1–2 baris untuk kartu katalog dan header detail |
| `image` | Ya | path | Mis. `"/images/products/product-10.png"` |
| `imageAlt` | Ya | teks | Deskripsi gambar untuk aksesibilitas & SEO |
| `description` | Tidak | daftar teks | Paragraf deskripsi lengkap (tab Detail Produk) |
| `highlights` | Tidak | daftar teks | Poin penting, tampil sebagai kartu bercentang |
| `specifications` | Tidak | daftar label/nilai | Tabel di tab Spesifikasi Produk |
| `packaging` | Tidak | daftar label/nilai | Tabel di tab Informasi Tambahan |
| `additionalInformation` | Tidak | daftar grup | Features, warranty, sertifikasi, dll |
| `brochureUrl` | Tidak | path | Mis. `"/brochures/nama.pdf"`. Kosong = tombol disembunyikan |
| `relatedProductIds` | Tidak | daftar id | Menentukan manual produk terkait |

Dua field dibuat **otomatis**, jangan diisi manual:

- `slug` — URL produk, dihitung dari `name`.
- `brand` — nama brand, diambil dari `brands.ts` lewat `brandId`.

### 3.3 Field yang ditanyakan tapi belum ada di sistem

| Yang Anda tanyakan | Status | Penjelasan |
| --- | --- | --- |
| **SKU / kode produk** | Sudah ada | Gunakan field `model` |
| **Harga** | Tidak ada | **Disengaja.** Website ini memakai model *Request for Quotation* — pembeli menekan "Minta Penawaran". Untuk B2B alat lab, harga biasanya nego per proyek, jadi tidak menampilkan harga adalah pilihan yang tepat |
| **Galeri produk** | Tidak ada | Saat ini 1 foto per produk. Butuh perubahan komponen bila ingin galeri — lihat 3.7 |
| **Link inquiry/contact** | Sudah otomatis | Tombol "Minta Penawaran" otomatis mengarah ke `/contact?product=<slug>&category=<kategori>#contact-form` dan mengisi subjek + pesan. Tidak perlu diisi manual |
| **Status produk** (aktif/nonaktif) | Tidak ada | Cara paling sederhana: hapus atau beri komentar `//` pada blok produknya |
| **Featured product** | Tidak ada | Produk paling atas di array tampil paling awal — itu sudah berfungsi seperti "featured" |
| **Urutan tampil** | Sudah ada | Urutan di array `productSeeds` = urutan di katalog. Pindahkan blok ke atas untuk menaikkan posisi |

### 3.4 Contoh konkret: menambah satu produk baru

Misalnya Anda ingin menambahkan **Spektrofotometer UV-Vis merek Shimadzu**.

**Langkah 1 — siapkan foto.** Simpan foto sebagai
`public/images/products/spektrofotometer-uv-vis.jpg` (rasio 4:3, sekitar 800×600 px).

**Langkah 2 — pastikan brand-nya sudah ada.** Buka `src/lib/data/brands.ts`. Kalau Shimadzu
belum ada, tambahkan dulu (lihat Bagian 4).

**Langkah 3 — buka `src/lib/data/products.ts`** dan tambahkan blok berikut di dalam
`productSeeds`. Letakkan di posisi mana pun sesuai urutan tampil yang diinginkan:

```ts
  {
    id: "product-10",
    name: "Spektrofotometer UV-Vis UV-1900i",
    brandId: "brand-shimadzu",
    category: "Alat Lab",
    model: "UV-1900i",
    shortDescription:
      "Spektrofotometer double beam dengan kecepatan scan 29.000 nm/menit untuk analisis rutin dan penelitian.",
    description: [
      "UV-1900i adalah spektrofotometer UV-Vis double beam yang dirancang untuk laboratorium dengan volume pengujian tinggi.",
      "Dilengkapi layar sentuh dan mode pengukuran yang dapat disimpan sehingga operator dapat mengulang metode yang sama secara konsisten.",
    ],
    highlights: [
      "Kecepatan scan hingga 29.000 nm/menit",
      "Layar sentuh berwarna 7 inci",
      "Mendukung koneksi ke PC dan printer",
    ],
    specifications: [
      { label: "Model", value: "UV-1900i" },
      { label: "Rentang panjang gelombang", value: "190 - 1100 nm" },
      { label: "Bandwidth", value: "1 nm" },
      { label: "Akurasi panjang gelombang", value: "+/- 0,1 nm" },
      { label: "Sumber cahaya", value: "Lampu deuterium dan halogen" },
      { label: "Dimensi", value: "450 x 490 x 220 mm" },
      { label: "Berat", value: "14 kg" },
    ],
    packaging: [
      { label: "Isi kemasan", value: "1 unit instrumen, 1 kabel daya, 1 set kuvet, buku manual" },
      { label: "Dimensi kemasan", value: "60 x 60 x 40 cm" },
      { label: "Berat kotor", value: "18 kg" },
    ],
    additionalInformation: [
      {
        id: "applications",
        title: "Aplikasi",
        bullets: [
          "Analisis kuantitatif larutan",
          "Uji kemurnian bahan baku farmasi",
          "Pengujian kualitas air",
        ],
      },
      {
        id: "warranty",
        title: "Garansi & Layanan",
        items: [
          { label: "Garansi unit", value: "12 bulan" },
          { label: "Instalasi", value: "Termasuk, oleh teknisi kami" },
          { label: "Pelatihan operator", value: "1 sesi di lokasi" },
        ],
      },
    ],
    brochureUrl: "/brochures/spektrofotometer-uv-1900i.pdf",
    image: "/images/products/spektrofotometer-uv-vis.jpg",
    imageAlt: "Spektrofotometer UV-Vis UV-1900i tampak depan",
  },
```

**Langkah 4 — simpan file, lalu jalankan:**

```bash
npm run dev
```

Buka http://localhost:3000/artha-labs. Produk baru langsung muncul di katalog, bisa dicari,
ikut filter brand dan kategori, punya halaman detail sendiri di
`/artha-labs/spektrofotometer-uv-vis-uv-1900i`, dan otomatis masuk sitemap.

**Penting:** kalau `brochureUrl` diisi, file PDF-nya **harus benar-benar ada** di
`public/brochures/`. Kalau belum ada, hapus baris `brochureUrl` — tombolnya akan otomatis
hilang, tanpa broken link.

### 3.5 Produk paling sederhana (data minimum)

Kalau data teknis belum lengkap, ini sudah cukup:

```ts
  {
    id: "product-11",
    name: "Mikroskop Binokuler CX23",
    brandId: "brand-olympus",
    category: "Alat Lab",
    model: "CX23",
    shortDescription: "Mikroskop binokuler untuk pemeriksaan rutin di laboratorium klinik dan pendidikan.",
    image: "/images/products/mikroskop-cx23.jpg",
    imageAlt: "Mikroskop binokuler CX23",
  },
```

Tab Spesifikasi dan Informasi Tambahan otomatis tidak menampilkan tabel kosong — hanya catatan
netral. Tidak akan ada tulisan "N/A" atau data karangan.

### 3.6 Mengubah dan menghapus produk

- **Mengubah** — edit nilainya langsung. Perhatian: mengubah `name` akan **mengubah URL**
  produk. Kalau halaman itu sudah diindeks Google atau linknya sudah disebar, sebaiknya nama
  jangan diubah, atau siapkan redirect.
- **Menghapus** — hapus seluruh blok `{ ... }` produk tersebut, termasuk koma penutupnya.
  Jangan lupa hapus juga id-nya dari `relatedProductIds` produk lain bila ada.
- **Menyembunyikan sementara** — beri komentar dengan `/*` di awal blok dan `*/` di akhir blok.

### 3.7 Bila nanti butuh galeri foto

Untuk saat ini satu foto per produk sudah memadai. Bila nanti perlu galeri, perubahannya:

1. Tambah field di `src/types/index.ts`: `gallery?: { src: string; alt: string }[];`
2. Isi field itu di produk yang relevan.
3. Ubah `src/components/sections/ProductHeader.tsx` untuk menampilkan thumbnail di bawah foto utama.

Ini pekerjaan pengembangan, bukan pengelolaan konten — sebaiknya dikerjakan setelah data asli
semua produk masuk.

---

## 4. Mengelola Brand

### 4.1 Lokasi data

`src/lib/data/brands.ts`.

### 4.2 Field yang tersedia

| Field | Wajib | Keterangan |
| --- | --- | --- |
| `id` | Ya | Kode unik. Dipakai produk lewat `brandId` |
| `name` | Ya | Nama brand. Tampil di filter, kartu produk, halaman detail |
| `logo` | Ya | Path logo di `public/brands/` |
| `website` | Tidak | URL resmi brand. **Field ini sudah tersedia tapi belum dipakai di tampilan** |

**Yang belum ada:** field `description` dan halaman brand tersendiri. Saat ini brand muncul di
tiga tempat: marquee berjalan di halaman Artha Labs, dropdown filter brand, dan label di kartu
serta halaman detail produk. **Belum ada halaman `/brands`.** Lihat 4.6 bila Anda
menginginkannya.

### 4.3 Contoh konkret: menambah satu brand baru

Menambahkan **Shimadzu**.

**Langkah 1 — siapkan logo.** Simpan sebagai `public/brands/shimadzu.png`. Idealnya PNG
transparan, sekitar 320×160 px, logo rata tengah dengan sedikit ruang kosong di tepi.

**Langkah 2 — buka `src/lib/data/brands.ts`** dan tambahkan satu baris di dalam array `brands`:

```ts
export const brands: Brand[] = [
  { id: "brand-01", name: "Brand Placeholder 01", logo: "/brands/brand-01.png" },
  // ... brand lain ...
  {
    id: "brand-shimadzu",
    name: "Shimadzu",
    logo: "/brands/shimadzu.png",
    website: "https://www.shimadzu.com",
  },
];
```

**Langkah 3 — hubungkan ke produk.** Pada produk yang relevan di `products.ts`, isi
`brandId: "brand-shimadzu"`. Selesai — nama brand otomatis ikut muncul di kartu produk dan
halaman detail.

### 4.4 Cara kerja hubungan brand dan produk

```
brands.ts                       products.ts
─────────                       ───────────
id: "brand-shimadzu"  ◄────────  brandId: "brand-shimadzu"
name: "Shimadzu"      ────────►  brand: "Shimadzu"  (otomatis)
```

Anda hanya menulis nama brand **sekali** di `brands.ts`. Semua produk mengambil namanya dari
situ, jadi tidak mungkin ada perbedaan ejaan antar halaman.

Dropdown filter brand juga cerdas: hanya brand yang **punya produk** ditampilkan sebagai
pilihan filter, jadi tidak ada filter yang hasilnya kosong.

### 4.5 Mengubah dan menghapus brand

- **Ganti nama** — ubah `name` saja. Semua produk ikut berubah otomatis.
- **Ganti logo** — timpa file di `public/brands/` dengan nama sama, atau ubah nilai `logo`.
- **Hapus brand** — hapus barisnya, **lalu pastikan tidak ada produk yang masih memakai
  `brandId` tersebut.** Kalau ada yang tertinggal, `npm run typecheck` tidak akan error tapi
  nama brand di kartu produk akan tampil sebagai kode id-nya. Cara cepat memeriksa:

  ```bash
  grep -n "brand-shimadzu" src/lib/data/products.ts
  ```

### 4.6 Bila nanti ingin halaman brand tersendiri

Langkah yang diperlukan (pekerjaan pengembangan):

1. Tambah field `description?: string` pada tipe `Brand` di `src/types/index.ts`.
2. Isi deskripsi tiap brand di `brands.ts`.
3. Buat `src/app/brands/page.tsx` (daftar semua brand) dan opsional
   `src/app/brands/[slug]/page.tsx` (detail brand + produknya).
4. Tambahkan entri baru di `navItems` (`src/lib/site.ts`) — navbar, footer, dan sitemap ikut
   otomatis.

Saran: kerjakan ini hanya bila jumlah brand sudah di atas 15 dan masing-masing punya cerita
yang layak ditampilkan. Untuk sekarang marquee + filter sudah cukup.

---

## 5. Mengelola Kategori Produk

### 5.1 Kategori bersifat terkunci (dan itu bagus)

Kategori didefinisikan di **dua tempat** yang harus selalu sinkron:

1. `src/types/index.ts`:

   ```ts
   export type ProductCategory = "Reagen" | "Alat Lab" | "Alat Kesehatan";
   ```

2. `src/lib/data/products.ts`:

   ```ts
   export const productCategories: ProductCategory[] = ["Reagen", "Alat Lab", "Alat Kesehatan"];
   ```

Tempat pertama membuat TypeScript **menolak** kategori yang salah tulis. Kalau Anda mengetik
`category: "Alat lab"` (huruf kecil), `npm run typecheck` langsung memberi tahu. Ini pengaman
yang mencegah produk hilang dari filter karena salah ejaan.

### 5.2 Contoh: menambah kategori "Consumable"

**Langkah 1** — buka `src/types/index.ts`, ubah menjadi:

```ts
export type ProductCategory = "Reagen" | "Alat Lab" | "Alat Kesehatan" | "Consumable";
```

**Langkah 2** — buka `src/lib/data/products.ts`, ubah menjadi:

```ts
export const productCategories: ProductCategory[] = [
  "Reagen",
  "Alat Lab",
  "Alat Kesehatan",
  "Consumable",
];
```

**Langkah 3** — pakai di produk: `category: "Consumable"`.

Selesai. Tombol filter "Consumable" otomatis muncul di halaman Artha Labs. Urutan tombol filter
mengikuti urutan array pada langkah 2.

### 5.3 Mengubah nama kategori

Ubah di **kedua** file di atas, lalu perbarui semua produk yang memakainya. Jalankan
`npm run typecheck` — TypeScript akan menunjukkan setiap baris yang masih memakai nama lama.

### 5.4 Menghapus kategori

Hapus dari kedua file, lalu pindahkan produk yang terdampak ke kategori lain. Jangan hapus
kategori yang masih punya produk.

### 5.5 Subkategori

**Belum didukung.** Sistem filter saat ini satu tingkat. Untuk katalog dengan 9–50 produk,
kombinasi *pencarian + filter brand + filter kategori* sudah lebih efektif daripada subkategori
berjenjang. Pertimbangkan subkategori hanya bila produk sudah lewat 100 item.

Alternatif tanpa mengubah kode: manfaatkan field `model` dan `shortDescription`. Keduanya ikut
dicari oleh pencarian, jadi mengetik "centrifuge" akan menemukan semua produk yang menyebut kata
itu, lintas kategori.

---

## 6. Mengelola Gambar dan File

### 6.1 Lokasi tiap jenis aset

| Jenis | Folder | Path yang ditulis di kode |
| --- | --- | --- |
| Foto produk | `public/images/products/` | `/images/products/nama.jpg` |
| Logo brand | `public/brands/` | `/brands/nama.png` |
| Foto kegiatan | `public/images/activities/` | `/images/activities/nama.jpg` |
| Foto perusahaan | `public/images/about/` | `/images/about/nama.jpg` |
| Brosur PDF | `public/brochures/` | `/brochures/nama.pdf` |
| Gambar preview link | `public/og-image.png` | `/og-image.png` |
| Favicon | `src/app/icon.png` | otomatis |

**Aturan mutlak:** path di kode **tidak pernah** menyertakan kata `public`. File
`public/images/products/foo.jpg` ditulis sebagai `/images/products/foo.jpg`.

### 6.2 Format dan ukuran yang disarankan

| Jenis | Format | Ukuran | Rasio |
| --- | --- | --- | --- |
| Foto produk | JPG (foto) / PNG (perlu transparan) | 800×600 px | 4:3 |
| Logo brand | PNG transparan atau SVG | 320×160 px | 2:1 |
| Foto kegiatan | JPG | 1200×800 px | 3:2 |
| Foto perusahaan | JPG | 1200×900 px | 4:3 |
| OG image | PNG | 1200×630 px | tetap |

Usahakan tiap file di bawah **300 KB**. Jangan mengunggah foto 5 MB langsung dari kamera.

### 6.3 Soal WebP dan AVIF — tidak perlu Anda pikirkan

Anda **tidak perlu** mengonversi gambar ke WebP/AVIF secara manual. `next.config.mjs` sudah
diatur:

```js
images: {
  formats: ["image/avif", "image/webp"],
  ...
}
```

Next.js otomatis mengubah JPG/PNG Anda menjadi AVIF atau WebP sesuai kemampuan browser
pengunjung, sekaligus membuat beberapa ukuran untuk ponsel dan desktop. Cukup unggah JPG atau
PNG berkualitas baik.

### 6.4 Mengompres gambar sebelum diunggah

Cara termudah tanpa aplikasi: buka <https://squoosh.app>, tarik gambar ke sana, pilih kualitas
sekitar 80%, unduh hasilnya.

Bila punya akses terminal dan ImageMagick:

```bash
# Ubah ukuran ke lebar 800 px dan kompres
magick input.jpg -resize 800x600^ -gravity center -extent 800x600 -quality 82 output.jpg
```

### 6.5 Penamaan file

Gunakan huruf kecil, tanda hubung, tanpa spasi, tanpa karakter khusus:

| Benar | Salah |
| --- | --- |
| `spektrofotometer-uv-1900i.jpg` | `Spektrofotometer UV 1900i.JPG` |
| `shimadzu.png` | `logo shimadzu (final).png` |

Nama berspasi atau berhuruf kapital sering bekerja di Windows tapi **gagal setelah deployment**,
karena server Linux membedakan huruf besar-kecil. Ini penyebab nomor satu gambar hilang di
production.

### 6.6 Mengganti gambar yang sudah ada

**Cara paling aman** — timpa file dengan nama yang persis sama. Tidak perlu mengubah kode sama
sekali.

Kalau nama file berubah, perbarui juga nilai `image` di `products.ts` (atau `logo` di
`brands.ts`).

### 6.7 Menambahkan brosur PDF

1. Simpan file di `public/brochures/`, mis. `uv-1900i.pdf`.
2. Isi pada produk terkait: `brochureUrl: "/brochures/uv-1900i.pdf"`.
3. Buka halaman detail produk — tombol **Download Brochure** muncul di sebelah **Minta
   Penawaran**.

Bila produk belum punya brosur, **jangan** isi `brochureUrl`. Tombolnya otomatis disembunyikan.
Jangan pernah mengarahkan ke file yang tidak ada.

### 6.8 Memastikan gambar tidak rusak setelah deployment

Empat pemeriksaan sebelum deploy:

```bash
# 1. Semua file gambar yang disebut di data benar-benar ada
grep -oh '"/images/[^"]*"' src/lib/data/*.ts | tr -d '"' | while read p; do
  [ -f "public$p" ] || echo "HILANG: $p"
done

# 2. Logo brand
grep -oh '"/brands/[^"]*"' src/lib/data/*.ts | tr -d '"' | while read p; do
  [ -f "public$p" ] || echo "HILANG: $p"
done

# 3. Brosur PDF
grep -oh '"/brochures/[^"]*"' src/lib/data/*.ts | tr -d '"' | while read p; do
  [ -f "public$p" ] || echo "HILANG: $p"
done

# 4. Nama file berhuruf kapital atau berspasi (berisiko di server Linux)
find public -name "* *" -o -name "*[A-Z]*"
```

Kalau tidak ada keluaran, aman. Simpan blok ini — jalankan setiap kali menambah produk.

### 6.9 Aset lokal atau cloud storage?

**Rekomendasi: tetap gunakan aset lokal di folder `public/`.**

| | Aset lokal (sekarang) | Cloud storage |
| --- | --- | --- |
| Biaya | Gratis | Ada biaya penyimpanan & bandwidth |
| Kecepatan | Sangat cepat (ikut CDN Vercel) | Cepat, tapi satu lompatan tambahan |
| Kerumitan | Tarik file ke folder, selesai | Perlu akun, kunci API, konfigurasi |
| Riwayat versi | Ikut Git — bisa dikembalikan | Perlu diatur sendiri |
| Cocok untuk | Ratusan gambar | Ribuan gambar, atau upload oleh pengguna |

Dengan 9 produk dan 8 brand — bahkan sampai 300 produk — aset lokal jauh lebih sederhana dan
tidak berbiaya. Pertimbangkan cloud storage (Cloudinary/Vercel Blob) hanya bila total folder
`public/` melewati ±100 MB atau Anda ingin mengunggah gambar tanpa menyentuh Git.

---

## 7. Mengelola Konten Halaman

### 7.1 Tabel rujukan cepat

| Yang ingin diubah | File |
| --- | --- |
| Nama, tagline, deskripsi perusahaan | `src/lib/site.ts` → `siteConfig` |
| **Alamat, email, telepon, WhatsApp, jam kerja** | `src/lib/site.ts` → `siteConfig.contact` |
| Link media sosial | `src/lib/site.ts` → `socialLinks` |
| Label & urutan menu navbar | `src/lib/site.ts` → `navItems` |
| Visi, misi | `src/lib/data/about.ts` → `vision`, `missions` |
| Nilai perusahaan (Values) | `src/lib/data/about.ts` → `companyValues` |
| Kartu navigasi cepat di halaman About | `src/lib/data/about.ts` → `quickNavCards` |
| Produk | `src/lib/data/products.ts` |
| Brand | `src/lib/data/brands.ts` |
| Daftar kegiatan | `src/lib/data/activities.ts` |
| Judul & teks hero tiap halaman | `src/app/<halaman>/page.tsx` → komponen `PageHero` |
| Teks tombol CTA | `src/app/<halaman>/page.tsx` → komponen `Button` |
| Isi footer | `src/components/layout/Footer.tsx` |
| Logo | `src/components/layout/Logo.tsx` |
| Judul & deskripsi SEO per halaman | `src/app/<halaman>/page.tsx` → `createPageMetadata` |
| SEO global & kata kunci | `src/app/layout.tsx` |
| Warna tema | `src/app/globals.css` (variabel CSS di bagian atas) |

### 7.2 Contoh: mengganti nomor WhatsApp dan email

Buka `src/lib/site.ts`, ubah bagian `contact`:

```ts
  contact: {
    addressLines: [
      "Jl. Contoh Raya No. 12, Kel. Sukamaju, Kec. Cilandak",
      "Jakarta Selatan, DKI Jakarta 12430",
    ],
    addressInline: "Jl. Contoh Raya No. 12, Jakarta Selatan, DKI Jakarta 12430",
    email: "info@arthafalahutama.co.id",
    phoneDisplay: "+62 21 1234 5678",
    phoneHref: "+622112345678",
    whatsappDisplay: "+62 812-3456-7890",
    whatsappNumber: "6281234567890",
    officeHours: "Senin - Jumat, 08.00 - 17.00 WIB",
    mapsEmbedSrc: process.env.NEXT_PUBLIC_MAPS_EMBED_SRC ?? "",
    mapsLink: "https://maps.google.com/?q=CV+Artha+Falah+Utama",
  },
```

Aturan format:

- `phoneHref` dan `whatsappNumber`: **hanya angka**, tanpa spasi, tanda hubung, atau `+` untuk
  WhatsApp. Awali `62`, bukan `0`. Nomor `0812-3456-7890` menjadi `6281234567890`.
- `phoneDisplay` dan `whatsappDisplay`: format bebas, ini yang dibaca pengunjung.

Satu perubahan ini otomatis berlaku di halaman kontak, footer, tombol WhatsApp, dan structured
data SEO.

### 7.3 Contoh: memperbaiki label navbar agar konsisten Indonesia

Ini salah satu temuan audit (poin 7). Buka `src/lib/site.ts`:

```ts
export const navItems: NavItem[] = [
  { label: "Tentang Kami", href: "/", description: "Profil, visi misi, dan nilai perusahaan" },
  { label: "Artha Labs", href: "/artha-labs", description: "Brand & produk laboratorium" },
  { label: "Aktivitas", href: "/activity", description: "Rekam jejak kegiatan perusahaan" },
  { label: "Hubungi Kami", href: "/contact", description: "Hubungi tim kami" },
];
```

Navbar, footer, dan sitemap semuanya membaca array ini, jadi cukup diubah di satu tempat.
Perhatikan: ubah hanya `label`, **jangan** ubah `href` — itu akan mengubah URL dan memutus link
yang sudah ada.

### 7.4 Contoh: mengubah SEO satu halaman

Di bagian atas tiap `page.tsx`:

```ts
export const metadata = createPageMetadata({
  title: "Artha Labs",
  description:
    "Distributor reagen, alat laboratorium, dan alat kesehatan di Jakarta. Dukungan teknis, instalasi, dan purna jual.",
  path: "/artha-labs",
  keywords: ["reagen", "alat laboratorium", "alat kesehatan", "supplier lab jakarta"],
});
```

Panduan: `title` maksimal 60 karakter, `description` 120–160 karakter dan sebaiknya menyebut
kota atau wilayah layanan. Canonical URL, Open Graph, dan Twitter card dibuat otomatis dari
nilai-nilai ini.

### 7.5 Konten yang masih hard-coded

Bagian berikut masih tertulis langsung di dalam komponen. Kalau sering berubah, sebaiknya
dipindahkan ke `src/lib/data/`:

| Konten | Lokasi sekarang | Saran |
| --- | --- | --- |
| Judul & deskripsi hero tiap halaman | masing-masing `page.tsx` | Biarkan — jarang berubah, dan lebih mudah dilihat konteksnya di halaman |
| Placeholder photo frame Artha Labs | `artha-labs/page.tsx` | Ganti dengan `next/image` begitu foto asli tersedia |
| Label & teks bantuan formulir | `ContactForm.tsx` | Biarkan |
| Deskripsi kolom footer | `Footer.tsx` | Biarkan |
| Wordmark "Artha Falah Utama / Labs & Exp" | `Logo.tsx` | Ganti bersamaan dengan file logo asli |

Saran jujur: **jangan** memindahkan semuanya ke file data. Teks yang berubah setahun sekali
lebih mudah dirawat bila tetap di tempatnya. Yang benar-benar penting sudah terpusat: identitas
perusahaan, kontak, sosial media, menu, produk, brand, kategori, dan kegiatan.

### 7.6 Halaman yang belum ada

| Halaman | Status | Saran |
| --- | --- | --- |
| Services | Belum ada | Tidak perlu — layanan sudah tercakup di Artha Labs |
| FAQ | Belum ada | Buat bila pertanyaan yang masuk lewat formulir mulai berulang |
| Kebijakan Privasi | Belum ada | **Sebaiknya dibuat** karena formulir mengumpulkan nama & email |
| Syarat & Ketentuan | Belum ada | Opsional untuk company profile tanpa transaksi online |

Cara membuat halaman baru (mis. Kebijakan Privasi):

1. Buat `src/app/kebijakan-privasi/page.tsx`.
2. Salin pola dari `src/app/activity/page.tsx` sebagai kerangka.
3. Panggil `createPageMetadata({ ..., path: "/kebijakan-privasi" })`.
4. Tambahkan link di `Footer.tsx`. Kalau ingin masuk navbar utama, tambahkan ke `navItems`.

---

## 8. Perlukah CMS atau Admin Panel?

### 8.1 Rekomendasi: belum perlu — tetap gunakan data statis

Alasannya konkret:

1. **Skala kecil.** 9 produk dan 8 brand. CMS mulai masuk akal di atas ±200 item atau bila ada
   beberapa orang yang mengedit bersamaan.
2. **Frekuensi perubahan rendah.** Katalog alat lab B2B biasanya berubah bulanan, bukan harian.
3. **Anda seorang programmer.** Mengedit file TypeScript jelas lebih cepat bagi Anda daripada
   membuka dasbor, login, mengisi form, lalu menunggu webhook.
4. **Kecepatan dan biaya.** Data statis menjadi bagian dari HTML saat build: tanpa panggilan
   database, tanpa biaya bulanan, dan skor Lighthouse maksimal.
5. **Keamanan.** Tidak ada panel login berarti tidak ada halaman admin untuk diserang, tidak ada
   kata sandi bocor, tidak ada database terekspos.
6. **Riwayat versi gratis.** Setiap perubahan tercatat di Git. Salah edit? `git revert` dan
   website kembali seperti semula.

### 8.2 Perbandingan bila nanti dibutuhkan

| Opsi | Biaya | Kerumitan | Kapan layak dipilih |
| --- | --- | --- | --- |
| **Data statis** (sekarang) | Gratis | Sangat rendah | Sampai ±200 produk, editor teknis |
| **Headless CMS** (Sanity, Contentful) | Gratis–$99/bln | Sedang | Ada staf non-teknis yang perlu mengedit rutin |
| **Database** (Postgres + Prisma) | $0–25/bln | Tinggi | Butuh stok, harga dinamis, pencarian kompleks |
| **Admin panel custom** | Waktu pengembangan | Sangat tinggi | Hampir tidak pernah sepadan untuk company profile |

Bila suatu hari benar-benar butuh CMS, **Sanity** paling cocok karena struktur datanya bisa
dibuat mengikuti tipe `Product` yang sudah ada, dan cukup mengganti isi `products.ts` dengan
pemanggilan API — komponen tampilan tidak perlu diubah sama sekali.

### 8.3 Alternatif paling sederhana: alur kerja Git + GitHub

Untuk mengelola produk dan brand tanpa infrastruktur tambahan:

**Untuk Anda (pemilik, programmer):**

```bash
code src/lib/data/products.ts   # edit
npm run dev                     # periksa di localhost:3000
npm run typecheck               # pastikan format benar
git add -A && git commit -m "produk: tambah spektrofotometer UV-1900i"
git push                        # Vercel deploy otomatis
```

**Untuk staf non-teknis, bila nanti diperlukan:** GitHub bisa diedit langsung dari browser.
Buka `src/lib/data/products.ts` di GitHub, klik ikon pensil, salin blok produk yang sudah ada,
ubah isinya, lalu klik *Commit changes*. Vercel akan otomatis membangun dan menerbitkan.
Cukup latih satu kali dan beri mereka contoh blok produk untuk disalin.

Saran praktis: buat file `docs/CONTOH-PRODUK.md` berisi blok produk lengkap yang siap disalin,
agar tidak perlu mengingat nama field.

---

## 9. Struktur Pengelolaan yang Direkomendasikan

```
Website CV Artha Falah Utama
│
├── Products ........... src/lib/data/products.ts
│                        + foto di public/images/products/
│
├── Brands ............. src/lib/data/brands.ts
│                        + logo di public/brands/
│
├── Categories ......... src/types/index.ts        (daftar kategori yang sah)
│                        src/lib/data/products.ts  (urutan tombol filter)
│
├── Images ............. public/images/products/     foto produk
│                        public/images/activities/   foto kegiatan
│                        public/images/about/        foto perusahaan
│                        public/brands/              logo brand
│                        public/og-image.png         preview link
│                        src/app/icon.png            favicon
│
├── Documents .......... public/brochures/         brosur PDF produk
│
├── Pages .............. src/app/page.tsx                  About
│                        src/app/artha-labs/page.tsx       Katalog
│                        src/app/artha-labs/[slug]/        Detail produk
│                        src/app/activity/page.tsx         Aktivitas
│                        src/app/contact/page.tsx          Kontak
│
├── Content ............ src/lib/data/about.ts           visi, misi, values
│                        src/lib/data/activities.ts      kegiatan
│
├── Configuration ...... src/lib/site.ts        identitas, kontak, menu, sosial
│                        .env.local             kunci rahasia (tidak masuk Git)
│                        next.config.mjs        gambar & security header
│                        tailwind.config.ts     token desain
│                        src/app/globals.css    variabel warna
│
├── SEO ................ src/lib/seo.ts         helper metadata + JSON-LD
│                        src/app/layout.tsx     metadata global
│                        src/app/sitemap.ts     sitemap otomatis
│                        src/app/robots.ts      robots.txt otomatis
│
└── Deployment ......... package.json           perintah build
                         Vercel dashboard       env vars, domain, log
                         docs/PANDUAN-DEPLOYMENT.md
```

### Ringkasan: 90% pekerjaan Anda ada di lima file

| Sering diedit | File |
| --- | --- |
| 1 | `src/lib/data/products.ts` |
| 2 | `src/lib/data/brands.ts` |
| 3 | `src/lib/data/activities.ts` |
| 4 | `src/lib/site.ts` |
| 5 | `src/lib/data/about.ts` |

Sisanya jarang atau tidak perlu disentuh.

---

Langkah selanjutnya: `docs/PANDUAN-DEPLOYMENT.md`.

---

## 10. Halaman About versi baru

Susunan halaman About sekarang, dari atas ke bawah:

```
1. Hero            -> foto gedung full-width      HomeHero.tsx
2. Visi & Misi     -> teks dari about.ts          page.tsx
3. Values          -> 4 kartu nilai perusahaan    page.tsx
4. Statistik       -> 4 kartu angka + counter     CompanyStats.tsx
5. Marquee brand   -> logo berjalan horizontal    BrandMarquee.tsx
6. Kartu navigasi  -> 3 kartu ke halaman lain     QuickNavCards.tsx
7. Footer          -> global dari layout.tsx      Footer.tsx
```

### 10.1 Mengganti foto gedung pada hero

Hanya satu langkah, tanpa menyentuh kode:

1. Siapkan foto tampak depan gedung, rasio 16:9 (mis. 2000 x 1125 px), maksimal sekitar 500 KB.
2. Beri nama `building.png`.
3. Timpa file `public/images/about/building.png`.

Catatan penting:

- Foto saat ini masih PLACEHOLDER (kotak hijau bertuliskan keterangan). Wajib diganti sebelum website online.
- Di atas foto sudah ada overlay gelap otomatis, jadi foto yang agak terang pun teksnya tetap terbaca.
- Hindari foto yang sisi kirinya sangat ramai, karena teks hero berada di sisi kiri.
- Jangan mengubah nama file. Bila namanya berbeda, ubah juga baris `src="/images/about/building.png"` di `src/components/sections/HomeHero.tsx`.

### 10.2 Memperbarui angka statistik

File: `src/lib/data/about.ts`, array `companyStats`.

| Kartu | Sumber angka | Perlu diubah manual? |
| --- | --- | --- |
| Klien Terlayani | ditulis manual | YA |
| Produk Tersedia | otomatis dari jumlah produk | tidak |
| Brand Mitra | otomatis dari jumlah brand | tidak |
| Kepuasan Pelanggan | ditulis manual | YA |

Setiap kali Anda menambah produk di `products.ts` atau brand di `brands.ts`, angka di halaman About ikut bertambah sendiri. Tidak ada yang perlu diedit dua kali.

Contoh mengubah jumlah klien menjadi 250, cukup ubah satu angka:

```ts
{
  id: "stat-clients",
  label: "Klien Terlayani",
  value: 250,
  suffix: "+",
  description: "Institusi pendidikan, industri, dan fasilitas kesehatan.",
  icon: "handshake",
},
```

Arti tiap kolom:

- `label` tulisan di bawah angka.
- `value` angka tujuan animasi. Harus angka, bukan teks. Tulis 250, bukan "250" atau "250+".
- `suffix` tambahan di belakang angka, misalnya "+" atau "%". Kosongkan bila tidak perlu.
- `prefix` tambahan di depan angka. Jarang dipakai.
- `description` satu baris keterangan. Boleh dihapus.
- `icon` pilih salah satu: handshake, box, tools, check, shield, spark.

Menambah atau mengurangi kartu cukup menambah atau menghapus satu objek di array. Tata letak menyesuaikan sendiri: 4 kartu satu baris di desktop, 2 per baris di tablet, 1 per baris di ponsel.

PENTING soal kredibilitas: angka Klien Terlayani dan Kepuasan Pelanggan saat ini masih contoh. Isi dengan angka yang benar-benar bisa dipertanggungjawabkan. Klaim yang tidak terbukti justru menurunkan kepercayaan calon klien, terutama pada tender atau pengadaan institusi.

### 10.3 Marquee brand di halaman About

Marquee di About memakai daftar brand YANG SAMA dengan halaman Artha Labs, yaitu `src/lib/data/brands.ts`. Menambah satu logo brand otomatis muncul di dua halaman sekaligus, jadi Anda tidak perlu membuat daftar brand terpisah.

Bila ingin mengubah judulnya, edit pemakaiannya di `src/app/page.tsx`:

```tsx
<BrandMarquee title="Brand mitra Artha Labs" headingId="brand-marquee-about" />
```

Opsi yang tersedia:

- `title` judul di atas marquee.
- `description` keterangan di bawah marquee. Bila tidak diisi, bagian ini tidak muncul sama sekali.
- `durationSeconds` lama satu putaran penuh. Angka lebih besar berarti jalan lebih lambat. Default 45.
- `headingId` wajib berbeda bila suatu saat ada dua marquee di satu halaman.

Marquee berhenti saat kursor diarahkan ke atasnya, dan otomatis tidak bergerak bagi pengguna yang mematikan animasi di pengaturan perangkatnya.

### 10.4 Lini Artha Exp sudah dihapus

Yang dihapus dari project:

| Yang dihapus | Keterangan |
| --- | --- |
| `src/app/artha-exp/page.tsx` | halaman Artha Exp |
| `src/lib/data/exp-categories.ts` | data kategori barang |
| `src/components/sections/ExpCategoryGrid.tsx` | komponen grid kategori |
| Entri di `src/lib/site.ts` | menu navbar, kini 4 tab |
| Kartu di `src/lib/data/about.ts` | kartu navigasi, kini 3 kartu |

Sebagai jaring aman, `next.config.mjs` berisi redirect permanen dari `/artha-exp` ke `/artha-labs`. Gunanya: tautan lama atau hasil pencarian Google yang masih mengarah ke halaman itu tidak berujung 404, tetapi dialihkan ke katalog. Redirect ini boleh dihapus beberapa bulan setelah website online, saat Google Search Console sudah tidak lagi melaporkan URL tersebut.

---

## 11. Katalog Artha Labs versi baru (kategori, filter, harga, urutan)

Bagian ini menggantikan cara kerja lama katalog. Baca bagian ini lebih dahulu
sebelum menambah produk.

### 11.1 Struktur kategori dua lapis

Kategori sekarang punya dua lapis:

1. **Kategori induk** - tetap 3: `Reagen`, `Alat Lab`, `Alat Kesehatan`.
2. **Subkategori** - lapisan baru yang jauh lebih spesifik, misalnya
   `Sentrifugasi`, `Spektroskopi`, `Buffer & Larutan`.

Semuanya didefinisikan di SATU file: `src/lib/data/categories.ts`.

**Menambah subkategori baru** (contoh: ingin menambah `Inkubator`):

1. Buka `src/lib/data/categories.ts`.
2. Cari kategori induk `"Alat Lab"`.
3. Tambahkan satu baris di dalam daftarnya: `"Inkubator",`
4. Simpan. Selesai - tidak ada file lain yang perlu diubah.

**Dua hal penting yang sering disalahpahami:**

- Menulis subkategori di file itu TIDAK langsung membuatnya muncul sebagai
  filter di website. Filter hanya menampilkan subkategori yang dipakai minimal
  satu produk. Jadi daftar boleh lebih panjang dari katalog Anda tanpa membuat
  filter kosong yang membingungkan pengunjung.
- Kalau Anda salah menulis nama subkategori di data produk (misal `Sentrifugas`),
  website akan GAGAL dibuild dengan pesan error yang menunjuk baris itu. Ini
  disengaja: lebih baik ketahuan saat build daripada produk hilang dari filter
  tanpa Anda sadari.

### 11.2 Menambah satu produk baru (contoh lengkap)

Buka `src/lib/data/products.ts`, salin satu blok produk yang sudah ada, lalu
ubah isinya. Contoh produk nyata:

```ts
  {
    id: "product-10",
    name: "DLAB Micropipette",
    brandId: "brand-01",
    category: "Alat Lab",
    subcategory: "Alat Laboratorium Umum",
    productType: "Mikropipet Variabel",
    applications: ["Persiapan Sampel", "Laboratorium Klinik"],
    model: "RE100-Pro",
    keywords: ["micropipette", "mikropipet", "pipet"],
    price: 1250000,
    availability: "Tersedia",
    featured: false,
    shortDescription: "Mikropipet variabel dengan akurasi tinggi untuk pekerjaan rutin laboratorium.",
    description: [
      "Paragraf pertama penjelasan produk.",
      "Paragraf kedua, misalnya keunggulan atau catatan pemakaian.",
    ],
    image: "/images/products/product-10.png",
    imageAlt: "Mikropipet DLAB RE100-Pro",
  },
```

Arti setiap kolom:

| Kolom | Wajib | Keterangan |
| --- | --- | --- |
| `id` | Ya | Unik, tidak boleh sama dengan produk lain |
| `name` | Ya | Nama produk yang tampil di kartu dan judul halaman |
| `brandId` | Ya | Harus salah satu `id` di `src/lib/data/brands.ts` |
| `category` | Ya | Salah satu dari 3 kategori induk |
| `subcategory` | Ya | Harus terdaftar di `categories.ts` |
| `productType` | Ya | Teks bebas. Otomatis jadi opsi filter "Jenis produk" |
| `applications` | Tidak | Teks bebas. Otomatis jadi opsi filter "Aplikasi" |
| `model` | Ya | Kode model, ikut dicari pencarian |
| `keywords` | Tidak | Sinonim / istilah Inggris agar tetap ditemukan |
| `price` | Tidak | Angka murni. Hapus kolomnya bila harga on-request |
| `availability` | Ya | `Tersedia`, `Pre-Order`, atau `Indent` |
| `featured` | Tidak | `true` untuk produk andalan (lihat 11.5) |
| `shortDescription` | Ya | 1-2 baris, tampil di kartu produk |
| `description` | Tidak | Array paragraf untuk halaman detail |
| `image` | Ya | Path file di `public/images/products/` |
| `imageAlt` | Ya | Deskripsi gambar untuk pembaca layar |

Setelah menyimpan, produk otomatis muncul di katalog, punya halaman detail
sendiri, masuk sitemap, dan menambah angka "Produk Tersedia" di halaman About.

### 11.3 Harga produk

Harga adalah kolom data (`price`), bukan teks di dalam desain. Anda hanya perlu
mengubah angkanya di `products.ts` dan harga otomatis berubah di kartu produk
maupun halaman detail.

Aturan menulis harga:

- Tulis ANGKA MURNI: `1250000`. Jangan `"Rp1.250.000"`, jangan pakai titik.
- Website yang mengurus formatnya: `1250000` tampil sebagai `Rp1.250.000`.
- Untuk produk yang harganya hanya diberikan atas permintaan, HAPUS baris
  `price` pada produk itu. Website otomatis menulis "Harga atas permintaan" -
  jauh lebih baik daripada memasang angka yang tidak benar.

**Catatan penting soal format `Rp1.00`:** dalam penulisan angka Indonesia, titik
adalah pemisah ribuan dan koma adalah pemisah desimal. Jadi `Rp1.00` bukan
format yang sah. Saat ini website menampilkan harga tanpa desimal (`Rp1`,
`Rp250.000`, `Rp1.250.000`). Bila Anda memang ingin dua angka desimal
(`Rp1,00`), ubah satu baris di `src/lib/utils.ts`:

```ts
export const PRICE_FRACTION_DIGITS = 0;   // ubah 0 menjadi 2
```

Satu perubahan itu berlaku untuk seluruh website.

### 11.4 Sistem filter katalog

Halaman `/artha-labs` sekarang menyediakan filter berikut:

| Filter | Bentuk | Sumber opsi |
| --- | --- | --- |
| Pencarian | kolom teks | seluruh teks produk |
| Kategori | chip, bisa pilih banyak | `categories.ts` |
| Subkategori | dropdown, bisa pilih banyak | `categories.ts` |
| Brand | dropdown, bisa pilih banyak | `brands.ts` |
| Jenis produk | dropdown, bisa pilih banyak | kolom `productType` |
| Aplikasi | dropdown, bisa pilih banyak | kolom `applications` |
| Ketersediaan | chip, bisa pilih banyak | kolom `availability` |
| Urutkan | dropdown | urutan katalog, nama, harga |

Yang perlu Anda ketahui:

- **Semua opsi filter dibuat otomatis dari data produk.** Anda tidak pernah
  perlu menyentuh kode komponen untuk menambah pilihan filter. Menambah produk
  dengan `productType: "Inkubator CO2"` otomatis menambah pilihan itu.
- **Filter tidak pernah menawarkan pilihan yang nol hasil.** Brand, subkategori,
  jenis, aplikasi, dan ketersediaan yang tidak dipakai produk mana pun tidak
  ditampilkan.
- **Antar filter bersifat DAN, di dalam satu filter bersifat ATAU.** Memilih
  Kategori = Alat Lab, Brand = A dan B, Ketersediaan = Tersedia berarti:
  "produk Alat Lab, dari brand A atau B, yang statusnya Tersedia".
- **Subkategori mengikuti kategori.** Bila Anda memilih kategori Reagen,
  pilihan subkategori menyempit hanya ke subkategori milik Reagen, dan pilihan
  subkategori lain yang tidak relevan dibuang otomatis agar hasil tidak kosong
  tanpa alasan.
- **Chip "Filter aktif"** menampilkan seluruh filter yang sedang berjalan. Tiap
  chip bisa dihapus satu per satu, atau semua sekaligus lewat "Hapus semua filter".
- Di layar mobile, filter rinci disembunyikan di balik tombol **Filter** dengan
  penanda angka, sedangkan pencarian dan urutan tetap terlihat.

**Membuat produk lebih mudah ditemukan pencarian.** Pencarian membaca nama,
model, brand, kategori, subkategori, jenis produk, aplikasi, kata kunci, dan
deskripsi singkat. Dua hal yang membantu:

- Isi `keywords` dengan istilah Inggris dan sinonim. Contoh: produk bernama
  "Sentrifus Klinik" sebaiknya punya `keywords: ["centrifuge"]` agar pelanggan
  yang mengetik "centrifuge" tetap menemukannya.
- Pencarian mengabaikan spasi dan tanda hubung pada model, sehingga
  "Z 216 M", "z216m", dan "Z-216-M" menemukan produk yang sama.

### 11.5 Urutan katalog yang diacak

Katalog tidak lagi tampil urut nomor produk.

- **Tiga kartu teratas selalu mewakili tiga kategori utama** secara berurutan:
  Reagen, lalu Alat Lab, lalu Alat Kesehatan.
- Sisanya diacak.
- Untuk menentukan produk mana yang mewakili sebuah kategori di tiga slot
  teratas, beri `featured: true` pada produk andalan Anda. Bila tidak ada yang
  ditandai, sistem memilih sendiri.

**Urutannya tidak berubah-ubah saat dipakai.** Pengacakan memakai "seed" yang
disimpan selama satu sesi kunjungan, sehingga:

- saat halaman pertama dibuka, katalog tampil teracak;
- saat pengguna memfilter, mencari, atau menekan "Tampilkan lebih banyak",
  posisi produk tetap stabil;
- saat pengguna membuka detail produk lalu menekan tombol kembali, urutan yang
  dilihat sebelumnya masih sama;
- pada kunjungan baru, katalog diacak ulang.

Untuk sementara semua produk dirender 24 kartu per batch dengan tombol
"Tampilkan lebih banyak". Pencarian dan filter tetap dijalankan pada seluruh
data produk, jadi hasilnya selalu lengkap.

### 11.6 Foto perusahaan pada semua header

Seluruh header halaman (About, Artha Labs, Aktivitas, Hubungi Kami, dan halaman
detail produk) sekarang memakai satu foto gedung perusahaan yang sama, dengan
lapisan gelap di atasnya agar teks tetap terbaca.

**Cara mengganti fotonya:** timpa satu file berikut dengan foto asli.

```
public/images/about/building.png
```

Saran ukuran: rasio 16:9, minimal 2000 x 1125 piksel, ukuran file di bawah
500 KB. Tidak ada kode yang perlu diubah - seluruh halaman langsung ikut
berubah. Bila Anda ingin memakai nama file lain, ubah satu baris di
`src/lib/images.ts`.

Foto saat ini masih placeholder buatan, jadi ini termasuk pekerjaan wajib
sebelum website online.

### 11.7 Urutan section halaman About dan cara menggantinya

Urutan section halaman About sekarang:

1. Hero / perkenalan perusahaan (foto gedung full-width)
2. Brand Mitra Artha Labs (marquee logo berjalan)
3. Navigation Cards (Artha Labs, Aktivitas, Hubungi Kami)
4. Artha Labs dalam Angka (statistik dengan counter)
5. Visi & Misi
6. Values

Seluruh urutan itu ditentukan oleh satu file: `src/app/page.tsx`. Di dalamnya
setiap section ditulis berurutan dari atas ke bawah dan sudah diberi nomor pada
komentarnya, misalnya `{/* 3. Navigation Cards */}`.

**Menukar posisi dua section:** potong satu blok section (dari komentar
nomornya sampai penutup `</Section>`) lalu tempel di posisi yang Anda inginkan.
Tidak ada pengaturan lain yang perlu diubah.

**Menyembunyikan sebuah section:** hapus blok section tersebut, atau bungkus
dengan tanda komentar. Sebaiknya jangan menghapus section Visi & Misi atau
Values bila isinya masih ingin dipakai nanti.

**Mengubah isi teksnya:** teks TIDAK ditulis di `page.tsx`, melainkan di
`src/lib/data/about.ts`:

| Yang ingin diubah | Ubah di `about.ts` |
| --- | --- |
| Kalimat visi | `vision` |
| Daftar misi | `missions` |
| Judul & deskripsi navigation cards | `quickNavCards` |
| Angka statistik | `companyStats` |
| Nilai perusahaan | `companyValues` |

Ingat: angka "Produk Tersedia" dan "Brand Mitra" dihitung otomatis dan tidak
perlu disentuh, sedangkan "Klien Terlayani" dan "Kepuasan Pelanggan" masih
angka contoh yang wajib Anda ganti sebelum website online.
