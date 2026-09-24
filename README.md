# CV Artha Falah Utama — Company Profile Website

Website company profile 4 halaman untuk **CV Artha Falah Utama**, distributor alat dan bahan laboratorium melalui lini bisnis **Artha Labs** (reagen, alat lab, alat kesehatan).

Struktur kode sudah final. Data produk, brand, kegiatan, dan informasi kontak masih berisi
placeholder yang ditandai komentar `TODO: ganti dengan konten asli` — tinggal diganti dengan data asli.

---

## 📘 Dokumentasi

Baca dua dokumen ini sebelum mulai mengelola atau men-deploy website:

| Dokumen | Isi |
| --- | --- |
| **[docs/PANDUAN-KONTEN.md](docs/PANDUAN-KONTEN.md)** | Audit arsitektur, cara menambah produk & brand, mengelola kategori, gambar & brosur PDF, mengubah konten halaman dan SEO, rekomendasi CMS, struktur pengelolaan |
| **[docs/PANDUAN-DEPLOYMENT.md](docs/PANDUAN-DEPLOYMENT.md)** | Checklist pra-deployment, perbandingan hosting, 20 langkah deployment ke Vercel, langkah setelah online, workflow update aman, troubleshooting, Master Checklist peluncuran |
| **[docs/QA-CHECKLIST.md](docs/QA-CHECKLIST.md)** | Pengujian rinci per fitur & per breakpoint |

**Tiga perintah pertama Anda** (dependency belum pernah dipasang di lingkungan ini):

```bash
npm install
npm run typecheck
npm run build
```

---

## Tech stack

| Layer | Pilihan |
| --- | --- |
| Framework | Next.js 15 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS 3 + CSS variables (design token terpusat) |
| Animasi | Framer Motion (dipakai seperlunya) + CSS keyframes untuk marquee |
| Form backend | Next.js Route Handler `POST /api/contact` → Resend |
| Validasi | Zod (dipakai bersama di client & server) |
| Analytics | Google Analytics via `@next/third-parties` (aktif jika env di-set) |
| Hosting target | Vercel |

---

## Struktur folder

```
src/
├── app/
│   ├── page.tsx                # About (route "/")
│   ├── artha-labs/page.tsx     # Brand marquee + katalog produk
│   ├── artha-labs/[slug]/      # Halaman detail produk (page, loading, not-found)
│   ├── activity/page.tsx       # Daftar tulisan & kegiatan
│   ├── activity/[slug]/        # Halaman detail tulisan (page, loading, not-found)
│   ├── contact/page.tsx        # Form + info kontak + peta
│   ├── api/contact/route.ts    # Handler form → email
│   ├── layout.tsx, template.tsx, not-found.tsx
│   ├── sitemap.ts, robots.ts, globals.css
├── components/
│   ├── analytics/Analytics.tsx # Titik pemasangan seluruh script pengukuran
│   ├── layout/                 # Navbar, Footer, Container, Logo, SkipLink
│   ├── sections/               # HomeHero, PageHero, BusinessScope, LoopCarousel,
│   │                           # TestimonialCarousel, ActivityCarousel, BrandMarquee,
│   │                           # ProductGrid/Card/Header/Tabs, ActivityGrid/Card,
│   │                           # ArticleBody, ContactForm, ContactInfo, QuickNavCards
│   └── ui/                     # Button, Section, Breadcrumb, DetailTable,
│                               # FilterTabs, MultiSelect, icons
├── lib/
│   ├── data/                   # about, activities, brands, categories, products
│   ├── validation/contact.ts   # skema Zod
│   ├── email/resend.ts         # klien email
│   ├── analytics.ts            # trackEvent() - peristiwa yang dikirim ke GA
│   ├── site.ts                 # nama, kontak, nav, sosial media, GA id
│   ├── images.ts                # path foto perusahaan (semua header)
│   ├── seo.ts                  # helper metadata + JSON-LD
│   └── utils.ts                # cn(), formatRupiah, tanggal, sanitasi
└── types/index.ts              # tipe bersama
```

### Aturan yang dipegang saat menambah kode

- **Judul section selalu lewat `SectionHeading`** (`components/ui/Section.tsx`),
  jangan menulis ulang pola `h2` + garis emas secara manual. Satu komponen ini
  yang menjaga tracking huruf, panjang garis, dan jaraknya tetap sama di seluruh
  halaman.
- **Warna selalu lewat token** (`brand-*`, `accent-*`, `ink*`, `surface*`,
  `line*`, `danger-*`). Jangan memakai palet bawaan Tailwind seperti `red-500`
  atau `green-900`. Dua tempat yang WAJIB memakai hex literal karena tidak bisa
  membaca CSS variable sudah diberi komentar: template email
  (`lib/email/resend.ts`) dan `themeColor` di `app/layout.tsx`.
- **Jangan menaruh `console.log` di komponen.** Logging hanya untuk jalur error
  di sisi server (lihat `app/api/contact/route.ts`); console browser harus
  bersih saat website berjalan normal.

---

## Menjalankan project

```bash
npm install
cp .env.example .env.local   # isi variabel di bawah
npm run dev                  # http://localhost:3000
npm run typecheck            # cek TypeScript
npm run lint
npm run build && npm start   # produksi
```

> **Catatan penting:** project ini ditulis di sandbox **tanpa akses internet**, sehingga `npm install` dan `next build` belum pernah dijalankan di sini. Jalankan `npm install` + `npm run typecheck` + `npm run build` di mesin Anda sebelum deploy pertama.

### Variabel environment

| Variabel | Wajib | Keterangan |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | ya | Base URL produksi, mis. `https://arthafalahutama.co.id` (untuk metadata, OG, sitemap) |
| `RESEND_API_KEY` | ya | API key Resend untuk pengiriman email form |
| `CONTACT_FROM_EMAIL` | ya | Pengirim terverifikasi di Resend, mis. `website@arthafalahutama.co.id` |
| `CONTACT_TO_EMAIL` | ya | Tujuan notifikasi form |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | opsional | ID Google Analytics (`G-XXXXXXX`); GA tidak dimuat jika kosong |
| `NEXT_PUBLIC_MAPS_EMBED_SRC` | opsional | URL embed Google Maps; jika kosong, tampil kartu fallback |

Form tetap aman jika `RESEND_API_KEY` kosong: API mengembalikan pesan error yang jelas, bukan crash.

---

## Cara mengganti konten placeholder

Semua konten hidup di `src/lib/data/` — **tidak perlu menyentuh komponen**.

| Yang ingin diubah | File |
| --- | --- |
| Logo brand di marquee | `src/lib/data/brands.ts` + file di `public/brands/` |
| Produk & kategori Artha Labs | `src/lib/data/products.ts` + `public/images/products/` |
| Blok lini bisnis (About) | `src/lib/data/about.ts` -> `businessBlocks` |
| Gambar Activity di About | `public/images/activities/activity-01.png` dst. (urutan kartu) |
| Tulisan & kegiatan di halaman Activity | `src/lib/data/activities.ts` + `public/images/activities/` |
| Lini bisnis (About), quick navigation cards | `src/lib/data/about.ts` + `public/images/about/` |
| Testimoni pelanggan (dummy) | `src/lib/data/testimonials.ts` |
| Alamat, email, telepon, WhatsApp, sosial media, jam kerja | `src/lib/site.ts` |
| Warna & tipografi | CSS variables di `src/app/globals.css` + `tailwind.config.ts` |

Menambah brand/produk/kegiatan cukup menambah satu objek di array; grid, filter, dan marquee otomatis menyesuaikan.

Setiap produk di `products.ts` memiliki `brandId` (harus ada di `brands.ts`), `brand`, dan `model`. Nilai `brand` diisi otomatis oleh helper `brandName(brandId)`, dan `productBrands` hanya memuat brand yang benar-benar punya produk — jadi chip **Filter by brand** di halaman Artha Labs tidak pernah berisi brand kosong. Pencarian real-time mencocokkan nama, brand, model, kategori, dan deskripsi produk.

### Mengganti palet warna

Warna disimpan sebagai channel RGB di `globals.css` (`--brand-50` … `--brand-950`, `--accent-*`, `--ink*`, `--surface*`, `--line*`). Ganti nilainya sekali, seluruh situs ikut berubah — Tailwind memakai token yang sama lewat `rgb(var(--brand-700) / <alpha-value>)`.

Palet aktif mengikuti logo perusahaan: **dark green sebagai primary**, **premium gold sebagai accent**, sisanya netral putih/off-white. Hierarki hijau dibuat bertingkat agar visual tidak flat: *Light Green Tint* (`brand-50`/`brand-100`) → *Secondary Green* (`brand-500`/`brand-600`) → *Primary Dark Green* (`brand-700`/`brand-800`) → *Deep* (`brand-900`/`brand-950`).

| Token | Hex | Dipakai untuk |
| --- | --- | --- |
| `brand-50` / `brand-100` | `#F0F9F4` / `#D6EEE2` | Light green tint: latar ikon, badge kategori, hover chip |
| `brand-500` / `brand-600` | `#2A8C65` / `#1E7654` | Secondary green: eyebrow, ikon, tanggal, hover button primary |
| `brand-700` | `#165F44` | Primary: button primary, teks link, state aktif navbar |
| `brand-800` | `#104C37` | Border kartu gelap, monogram logo, state aktif button |
| `brand-900` | `#0B3929` | Dasar hero & footer, `themeColor`, badge kategori di atas gambar |
| `brand-950` | `#07281D` | Titik awal gradient gelap, teks di atas latar emas |
| `accent-300` | `#EDC85E` | Gold terang: eyebrow & heading footer di latar gelap, hover button accent |
| `accent-400` | `#D6AF36` | Gold utama: button accent, divider, ikon kontak footer, dot pada kartu |
| `accent-100` / `accent-500` | `#FAEEC8` / `#BA9120` | Latar & border chip brand saat aktif |
| `accent-700` | `#7A5C12` | Teks di atas latar emas muda |
| `ink` / `ink-muted` | `#101B17` / `#4A5A52` | Teks utama / sekunder (15.8:1 dan 7.2:1) |
| `surface-muted` | `#F6F9F7` | Latar section alternatif (off-white kehijauan) |
| `line` | `#E2E9E4` | Border kartu dan pemisah |

Dua utility gradient terpusat di `globals.css`:

- `.surface-brand-deep` — gradient 135° `brand-950 → brand-900 → brand-800` untuk hero, section Lini bisnis, dan footer.
- `.surface-soft` — gradient vertikal putih → off-white untuk `Section tone="soft"`, dipakai sebagai transisi halus antar section.
- `.rule-accent` — garis hijau→emas untuk aksen tipis (batas atas footer, eyebrow section, kartu quick navigation saat hover).
- `.divider-gold` — garis emas 1px yang memudar di kedua ujung; dipakai sebagai penutup bawah hero.
- `.scrollbar-soft` — scrollbar tipis untuk baris chip brand yang dapat di-scroll di mobile.

Semua kombinasi teks/latar minimal 4.5:1 (WCAG AA): teks putih di atas `brand-700` ≈7.6:1 dan di atas `brand-900` ≈12.9:1, button accent `accent-400` dengan teks `brand-950` ≈7.5:1, `ink` 15.8:1, `ink-muted` 7.2:1.

---

## Katalog interaktif Artha Labs & alur Request for Quotation (RFQ)

### Route

| Route | Isi |
| --- | --- |
| `/artha-labs` | Katalog: brand marquee, search real-time, filter kategori & brand, grid product card |
| `/artha-labs/[slug]` | Halaman detail produk (dibuat otomatis dari data, `generateStaticParams`) |
| `/contact?product=<slug>&category=<kategori>#contact-form` | Contact Us dengan form terisi otomatis (RFQ) |

### Struktur data produk (`src/lib/data/products.ts`)

Satu file data menjadi sumber tunggal untuk katalog, halaman detail, sitemap, dan related products.

```ts
{
  id: "product-04",
  name: "Alat Lab Placeholder 04",
  brandId: "brand-04",
  category: "Alat Lab",
  model: "AL-2400",
  description: ["...", "..."],  // paragraf di tab "Detail Produk" (di atas tabel spesifikasi)
  highlights: ["..."],          // opsional, bullet "Poin penting"
  packaging: [{ label: "Package contents", value: "..." }],       // opsional
  specifications: [{ label: "Power supply", value: "220 V" }],     // tabel di tab "Detail Produk"
  additionalInformation: [{ id: "warranty", title: "Warranty", bullets: ["..."] }], // opsional
  relatedProductIds: ["product-05"], // opsional, default: kategori/brand sama
  image: "/images/products/product-04.png",
  imageAlt: "...",
}
```

- `slug` dan `brand` **dihasilkan otomatis** (`slugify(name)`, dengan penanganan duplikat) sehingga tidak perlu diisi manual.
- Menambah produk baru = menambah satu objek pada `productSeeds`. Halaman detail, entri sitemap, filter brand, dan related products otomatis mengikuti.
- Field `packaging`, `specifications`, dan `additionalInformation` **sengaja dibiarkan kosong** karena data asli belum tersedia; halaman detail hanya menampilkan section yang datanya ada dan menampilkan catatan netral (bukan `Lorem ipsum` / `N/A`) bila belum ada.

### Brosur PDF per produk

- Field opsional `brochureUrl` pada data produk, mis. `brochureUrl: "/brochures/alat-lab-04.pdf"` dengan file di `public/brochures/`.
- Tombol **Download Brochure** (secondary, di samping CTA **Minta Penawaran**) hanya dirender bila field ini terisi. Bila kosong, tombol disembunyikan dan digantikan tautan "Lihat katalog" - tidak ada broken link atau PDF dummy.

### Tab informasi produk

`src/components/sections/ProductTabs.tsx` menampilkan dua tab horizontal compact:

| Tab | Isi |
| --- | --- |
| Detail Produk | Paragraf `description`, disusul tabel `specifications` (Specification / Details); kartu `highlights` di sisi kanan bila ada |
| Informasi Tambahan | Tabel `packaging` + grup `additionalInformation` (bullet/key-value/note) |

- Hanya konten tab aktif yang dirender, dengan transisi fade halus (framer-motion, otomatis nonaktif pada `prefers-reduced-motion`).
- Tab aktif memakai dark green + teks gold + underline gold; mobile memakai scroll horizontal pada container tab.
- Navigasi keyboard mengikuti pola tablist: panah kiri/kanan, Home, End.
- Bila sebuah field data belum tersedia, tab menampilkan catatan netral - bukan `Lorem ipsum` / `N/A`.

### Filter katalog Artha Labs

Hierarki panel filter: **Find your product** -> Search products -> Filter by brand -> Filter by category -> Active filters -> product counter -> grid.

- Search, brand, dan kategori digabung dalam satu logika (`Search Query + Brand + Category -> Filtered Products`) dan diperbarui real-time.
- Brand memakai `src/components/ui/MultiSelect.tsx        # filter multi-pilih (checkbox + pencarian)
- Active filter chips menampilkan filter yang sedang aktif dan bisa dihapus satu per satu, plus `Clear all filters`.
- Counter: `X products found` tanpa filter, `Showing X of Y products` saat terfilter.
- Mobile: panel brand + kategori disembunyikan di balik tombol **Filter** (dengan badge jumlah filter aktif); search selalu terlihat.

### Alur RFQ

1. `ProductCard` (`src/components/sections/ProductCard.tsx`) - seluruh kartu clickable ke `/artha-labs/[slug]` (overlay `after:` pada link judul), CTA "Minta penawaran" tetap ada di atasnya (`z-10`).
2. Halaman detail menampilkan header (`[ gambar ] | [ informasi ]`), Deskripsi Produk, Informasi Packaging, Informasi Tambahan, CTA, dan Related Products.
3. `quoteHref(product)` di `src/lib/quote.ts` membangun `\/contact?product=<slug>&category=<kategori>#contact-form` - satu logika untuk berapa pun jumlah produk.
4. `ContactForm` membaca query parameter via `useSearchParams`, lalu `resolveQuoteRequest()` mengisi:
   - Subject: `Permintaan Penawaran — [Category]`
   - Message: `Berikan saya penawaran terkait produk [Product Name]`
   Keduanya tetap bisa diedit user. Tanpa parameter, form tetap kosong seperti biasa.
5. Panel "Requesting a quote for" muncul di atas form sebagai konfirmasi produk, dan anchor `#contact-form` membuat form langsung terlihat (smooth scroll dari `globals.css`).

> Catatan: `ContactForm` memakai `useSearchParams`, sehingga di `src/app/contact/page.tsx` komponen dibungkus `<Suspense>`. Jangan hapus pembungkus ini atau `next build` akan gagal.

### State halaman detail

- `loading.tsx` - skeleton mengikuti layout header & section.
- `not-found.tsx` - "Product Not Found" + tombol "Back to Artha Labs" (dipicu `notFound()` bila slug tidak dikenal).

---

## Activity: knowledge hub perusahaan

Halaman Activity bukan sekadar galeri kegiatan. Strukturnya dirancang untuk
menampung tulisan yang jumlahnya terus bertambah: catatan teknis, panduan
penggunaan alat, sampai dokumentasi kegiatan.

### Route

| Route | Isi |
| --- | --- |
| `/activity` | Satu tulisan sorotan + filter kategori + grid seluruh tulisan |
| `/activity/[slug]` | Halaman baca (dibuat otomatis dari data, `generateStaticParams`) |

### Menambah tulisan baru

Cukup tambahkan **satu objek** pada `activitySeeds` di
`src/lib/data/activities.ts`, lalu letakkan gambarnya di
`public/images/activities/`. URL, filter, kartu, daftar isi, estimasi waktu
baca, artikel terkait, dan entri sitemap menyesuaikan sendiri.

`slug` dan `readingMinutes` **tidak perlu ditulis** - keduanya dihasilkan
otomatis, pola yang sama dengan data produk.

### Isi artikel ditulis sebagai blok, bukan HTML

Field `body` berisi daftar blok berjenis, sehingga penulis konten tidak pernah
menyentuh markup dan tampilannya dijamin konsisten:

```ts
body: [
  { type: "paragraph", text: "..." },
  { type: "heading", text: "..." },              // otomatis masuk daftar isi
  { type: "list", items: ["..."], ordered: true },
  { type: "table", items: [{ label: "...", value: "..." }], caption: "..." },
  { type: "callout", title: "...", text: "..." },
]
```

Menambah jenis blok baru: tambahkan di union `ArticleBlock`
(`src/types/index.ts`), lalu beri tampilannya di
`src/components/sections/ArticleBody.tsx`. TypeScript akan menandai bila ada
jenis blok yang belum diberi tampilan.

### Kategori

Tiga kategori (`Insight`, `Panduan`, `Kegiatan`) didefinisikan di
`ActivityCategory`. Filter hanya menampilkan kategori yang benar-benar dipakai
minimal satu tulisan, jadi tidak pernah ada filter yang nol hasil.

---

## Analytics

Google Analytics dipasang lewat `@next/third-parties` dan **hanya dimuat bila
`NEXT_PUBLIC_GA_MEASUREMENT_ID` terisi**. Seluruh script pengukuran dikumpulkan
di satu komponen, `src/components/analytics/Analytics.tsx`, supaya mudah
terlihat apa saja yang dimuat halaman.

Kunjungan halaman dicatat otomatis oleh GA4. Di luar itu, hanya tiga peristiwa
yang dilacak - masing-masing menjawab satu pertanyaan yang nyata:

| Peristiwa | Dikirim dari | Menjawab |
| --- | --- | --- |
| `catalog_search` | `ProductGrid` | Kata kunci apa yang dicari, dan berapa hasilnya. **Pencarian ber-hasil nol adalah petunjuk paling berguna** untuk menambah produk atau kata kunci. |
| `quote_request_start` | `ContactForm` | Produk mana yang paling sering dibawa ke form penawaran. |
| `contact_form_submit` | `ContactForm` | Berapa banyak permintaan yang benar-benar terkirim, dibanding yang berhenti di tengah. |

Menambah peristiwa: daftarkan nama dan parameternya di `AnalyticsEventMap`
(`src/lib/analytics.ts`), lalu panggil `trackEvent("nama", { ... })`. Nama yang
tidak terdaftar akan menggagalkan build, bukan diam-diam terkirim. Bila GA tidak
dipasang, seluruh pemanggilan berhenti diam-diam tanpa error.

---

## Deploy ke Vercel

1. Push repo ke GitHub/GitLab.
2. Import project di Vercel (framework Next.js terdeteksi otomatis).
3. Tambahkan environment variables di atas untuk environment Production & Preview.
4. Deploy. HTTPS + HSTS sudah dipaksa lewat header di `next.config.mjs`.
5. Setelah domain aktif, set `NEXT_PUBLIC_SITE_URL` ke domain final agar `sitemap.xml`, `robots.txt`, dan Open Graph memakai URL yang benar.

### Catatan build offline

`src/app/layout.tsx` memakai `next/font/google` (Inter) yang mengunduh font saat build. Jika Anda perlu build tanpa internet, unduh Inter ke `src/app/fonts/` lalu ganti ke `next/font/local`.

---

## Keamanan form kontak

- Validasi Zod di client **dan** server (skema yang sama).
- Honeypot field `company` — bot yang mengisinya dapat respons sukses palsu, email tidak dikirim.
- Rate limit in-memory: 5 permintaan per IP per 10 menit. Untuk multi-instance di Vercel, ganti dengan Upstash Redis / Vercel KV.
- Sanitasi teks + escape HTML sebelum masuk template email.
- Content-Type divalidasi (415), method selain POST ditolak (405).
- Header keamanan (HSTS, X-Content-Type-Options, Referrer-Policy, X-Frame-Options) di `next.config.mjs`.

---

## Menambah halaman baru (mis. Blog)

1. Buat `src/app/<slug>/page.tsx`, ekspor `metadata` lewat `createPageMetadata({ title, description, path })`.
2. Tambah entri ke `navItems` di `src/lib/site.ts` — Navbar, Footer, dan sitemap ikut otomatis.
3. Gunakan `PageHero`, `Section` (`tone="default" | "soft" | "muted" | "brand"`), dan `SectionHeading` agar konsisten.

---

## Lisensi

Proprietary © CV Artha Falah Utama.

## Katalog Artha Labs: kategori, filter, harga, urutan

Ringkasan teknis. Panduan langkah demi langkah untuk pengelola konten ada di
`docs/PANDUAN-KONTEN.md` bagian 11.

### File yang menentukan katalog

| File | Peran |
| --- | --- |
| `src/lib/data/categories.ts` | Taksonomi kategori induk + subkategori, opsi ketersediaan |
| `src/lib/data/products.ts` | Data produk, opsi filter turunan, urutan katalog ber-seed |
| `src/lib/utils.ts` | `formatRupiah`, `PRICE_FRACTION_DIGITS`, helper pencarian |
| `src/lib/images.ts` | Path foto perusahaan untuk seluruh header |
| `src/components/ui/MultiSelect.tsx` | Dropdown filter multi-pilih |
| `src/components/sections/ProductGrid.tsx` | Perakit filter, pencarian, urutan, dan paginasi |

### Prinsip yang dipakai

- **Opsi filter diturunkan dari data, bukan didaftar manual.** `productBrands`,
  `productSubcategories`, `productTypes`, `productApplications`, dan
  `productAvailabilities` dihitung dari `products`, sehingga tidak ada pilihan
  filter yang nol hasil dan menambah produk otomatis menambah opsinya.
- **Subkategori diketik-aman.** `ProductSubcategory` diturunkan dari
  `categoryTree` dengan `as const satisfies`, jadi salah tulis subkategori
  menggagalkan build alih-alih diam-diam menghilangkan produk dari filter.
- **Harga adalah data, bukan tampilan.** Komponen hanya memanggil
  `formatRupiah(product.price)`; tidak ada string harga di JSX.
  Field `price` wajib diisi, dan konstanta `DEFAULT_PRICE` di `products.ts`
  bernilai `1`, sehingga semua produk yang belum diberi harga asli tampil
  sebagai **"Rp1"** (tidak ada lagi teks "Harga atas permintaan"). Untuk mengisi
  harga asli, ganti `price: DEFAULT_PRICE` pada produk terkait dengan angka
  murni (`price: 1250000`, tanpa titik dan tanpa "Rp").
- **Pengacakan katalog memakai seeded PRNG (mulberry32).** Server merender
  dengan seed tetap agar tidak terjadi hydration mismatch, lalu browser
  mengambil seed sesi dari `sessionStorage`. Filter diterapkan SETELAH urutan
  dibentuk, sehingga posisi produk tidak bergeser saat difilter atau saat
  batch berikutnya dimuat.
- **Tiga kartu teratas** dipaksa mewakili Reagen, Alat Lab, dan Alat Kesehatan;
  wakilnya diambil dari produk `featured: true` lebih dahulu.

### Filter dan pencarian

Antar filter bersifat DAN, di dalam satu filter bersifat ATAU. Pencarian
membaca nama, model, brand, kategori, subkategori, jenis produk, aplikasi,
`keywords`, dan deskripsi singkat; pencocokan kedua dilakukan pada teks yang
dipadatkan (`compactText`) sehingga `Z 216 M`, `z216m`, dan `Z-216-M` setara.
