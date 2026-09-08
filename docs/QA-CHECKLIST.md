# QA Checklist — CV Artha Falah Utama

Self-check terhadap **Kebutuhan Non-Fungsional** dan **Metrik Keberhasilan** dari brief.

Legenda: ✅ terpenuhi di kode · 🔎 perlu verifikasi runtime (butuh `npm install` + internet, belum bisa di sandbox)

---

## 1. Struktur & konten wajib

| Item | Status | Bukti |
| --- | --- | --- |
| Tepat 4 tab, urutan About → Artha Labs → Activity → Contact Us | ✅ | `src/lib/site.ts` → `navItems` (satu sumber untuk Navbar, Footer, sitemap) |
| Navbar sticky + active state | ✅ | `components/layout/Navbar.tsx` (`sticky top-0`, `usePathname`, `aria-current="page"`) |
| Footer: info perusahaan, quick links 5 tab, kontak singkat | ✅ | `components/layout/Footer.tsx` |
| About: visi & misi, sejarah, profil founder | ✅ | `src/app/page.tsx` + `lib/data/about.ts` |
| About: values (disarankan) + tim (opsional) | ✅ | 4 values, 3 anggota tim (tim otomatis tersembunyi jika array kosong) |
| Artha Labs: brand marquee di section paling atas | ✅ | `sections/BrandMarquee.tsx` di atas section produk |
| Marquee: otomatis, seamless, pause on hover | ✅ | Dua grup identik + `translate3d(0 → -50%)`, `hover:[animation-play-state:paused]` |
| Marquee: data brand mudah ditambah/kurang | ✅ | `lib/data/brands.ts` (durasi otomatis via prop `durationSeconds`) |
| Produk: grid + gambar, nama, kategori, deskripsi | ✅ | `sections/ProductGrid.tsx` + `lib/data/products.ts` (9 produk) |
| Produk: filter kategori (Semua/Reagen/Alat Lab/Alat Kesehatan) | ✅ | `ui/FilterTabs.tsx` + `AnimatePresence` |
| Activity: grid kegiatan (judul, tanggal, kategori, gambar, deskripsi) | ✅ | `sections/ActivityGrid.tsx` + `lib/data/activities.ts` (6 kegiatan) |
| Activity: urut terbaru → terlama + filter kategori | ✅ | `sortedActivities` + FilterTabs |
| CTA ke Contact Us di Labs, Exp, Activity | ✅ | `sections/CtaSection.tsx` |
| Contact: form nama, email, subjek, pesan | ✅ | `sections/ContactForm.tsx` |
| Contact: info alamat, email, telepon/WhatsApp, sosial, peta | ✅ | `sections/ContactInfo.tsx` (+ `MapEmbed` dengan fallback) |
| Semua teks lorem ipsum + placeholder image bertanda TODO | ✅ | 32 penanda `{/* TODO: ganti dengan konten asli */}` |

---

## 2. Performa

| Item | Status | Catatan |
| --- | --- | --- |
| `next/image` untuk semua gambar | ✅ | 6 pemakaian `<Image>`; format AVIF/WebP diaktifkan di `next.config.mjs` |
| Lazy-load default, `priority` hanya untuk LCP | ✅ | Hanya hero About memakai `priority`; sisanya lazy |
| `sizes` diisi agar srcset efisien | ✅ | Semua image responsif memakai `sizes` |
| JS client minimal | ✅ | Hanya Navbar, ProductGrid, ActivityGrid, ContactForm, template transition yang `"use client"`; 5 halaman tetap Server Component |
| Animasi murah (transform/opacity saja) | ✅ | Marquee pakai `translate3d`; Framer Motion hanya fade/slide pendek |
| Font dioptimasi | ✅ | `next/font` Inter + `display: swap`, self-hosted saat build |
| Page load < 3 detik | 🔎 | Ukur setelah deploy Vercel (static render + image CDN membuat target realistis) |

---

## 3. Responsif (mobile-first)

| Breakpoint | Status | Hasil visual QA |
| --- | --- | --- |
| 390px (≤375px sekelas) | ✅ | 5 halaman discreenshot: layout 1 kolom, tidak ada overflow horizontal, menu jadi tombol hamburger |
| 768px | ✅ | Grid produk/kegiatan jadi 2 kolom (`sm:grid-cols-2`) |
| 1024px | ✅ | Navbar penuh 5 tab muncul (`lg:flex`), grid jadi 3–4 kolom |
| ≥1440px | ✅ | Konten dibatasi `max-w-shell` (80rem) dan tetap terpusat |
| Target sentuh ≥44px | ✅ | Tombol `min-h-[48px]`, chip filter 40px, ikon sosial 44px |

> Catatan: verifikasi visual dilakukan lewat preview statis (HTML/CSS yang mereplikasi design token), karena `next dev` tidak bisa berjalan tanpa internet di sandbox ini.

---

## 4. SEO

| Item | Status | Bukti |
| --- | --- | --- |
| Title & description unik per halaman | ✅ | `createPageMetadata` dipakai di 4 halaman, judul: About, Artha Labs, Activity, Contact Us |
| Template judul + canonical per halaman | ✅ | `lib/seo.ts` (`alternates.canonical`) |
| Open Graph + Twitter card | ✅ | `lib/seo.ts` + `public/og-image.png` (1200×630) |
| sitemap.xml | ✅ | `src/app/sitemap.ts` (dibangun dari `navItems`) |
| robots.txt | ✅ | `src/app/robots.ts` (mengizinkan crawl, memblok `/api/`) |
| Structured data | ✅ | JSON-LD `Organization` di `layout.tsx` |
| Semantik heading h1→h3 konsisten | ✅ | Satu `<h1>` per halaman (PageHero), section pakai `<h2>`, kartu `<h3>` |
| `lang="id"` | ✅ | `layout.tsx` |
| Skor Lighthouse SEO ≥ 90 | 🔎 | Jalankan setelah deploy |

---

## 5. Aksesibilitas

| Item | Status | Bukti |
| --- | --- | --- |
| Semua gambar punya alt | ✅ | 6/6 `<Image>` beralt; logo duplikat marquee `aria-hidden` + `alt=""` (benar untuk dekoratif) |
| Navigasi keyboard penuh | ✅ | Semua interaktif berupa `<a>`/`<button>`; menu mobile bisa ditutup dengan Escape |
| Skip link | ✅ | `components/layout/SkipLink.tsx` → `#main` |
| Focus ring terlihat | ✅ | `focus-visible:ring-2` global di `globals.css` |
| Kontras WCAG AA | ✅ | Teks utama ink `#101828` di putih (≈16:1); tombol accent `#F2C356` + navy `#071120` (≈10:1); teks putih di navy-900 (≈14:1); teks muted `#475467` (≈7:1) |
| Status form diumumkan ke screen reader | ✅ | `role="status"` (sukses) & `role="alert"` (error), `aria-invalid` + `aria-describedby` per field |
| Filter dapat diakses | ✅ | `role="group"` + `aria-pressed`, hasil filter diumumkan lewat live region |
| `prefers-reduced-motion` dihormati | ✅ | Marquee & animasi dinonaktifkan di `globals.css` |
| Skor Lighthouse A11y ≥ 90 | 🔎 | Jalankan setelah deploy |

---

## 6. Keamanan

| Item | Status | Bukti |
| --- | --- | --- |
| Validasi client & server | ✅ | Skema Zod yang sama di `lib/validation/contact.ts` |
| Sanitasi input | ✅ | `sanitizeText()` + `escapeHtml()` sebelum template email |
| Anti-spam | ✅ | Honeypot `company` (respons sukses palsu, email tidak dikirim) |
| Rate limiting | ✅ | 5 request/IP/10 menit di `api/contact/route.ts` (in-memory — ganti ke Redis/KV bila multi-instance) |
| Validasi Content-Type & method | ✅ | 415 untuk non-JSON, 405 untuk selain POST |
| Paksa HTTPS | ✅ | Header HSTS `max-age=63072000; includeSubDomains; preload` di `next.config.mjs` |
| Header keamanan lain | ✅ | `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy` |
| Secret tidak bocor ke client | ✅ | `RESEND_API_KEY` hanya dipakai di route handler (server) |

---

## 7. Skalabilitas kode

| Item | Status |
| --- | --- |
| Struktur modular `app` / `components` (layout, sections, ui) / `lib` (data, validation, email) / `types` | ✅ |
| Konten terpisah dari presentasi (semua di `lib/data/*`) | ✅ |
| Komponen reusable: `Section`, `SectionHeading`, `Button`, `FilterTabs`, `PageHero`, `CtaSection` | ✅ |
| Design token terpusat (CSS variables + `tailwind.config.ts`) | ✅ |
| Tambah halaman baru = 1 file + 1 entri `navItems` (nav, footer, sitemap ikut otomatis) | ✅ |
| TypeScript strict + tipe bersama di `types/index.ts` | ✅ |

---

## 8. Browser support

| Item | Status | Catatan |
| --- | --- | --- |
| Chrome, Firefox, Safari, Edge (2 versi terakhir) | ✅ | Hanya CSS mainstream: flex/grid, custom properties, `aspect-ratio`, `backdrop-filter`, `mask-image` dengan prefiks `-webkit-`; Autoprefixer aktif |
| Fallback tanpa JS | ✅ | Halaman dirender server; hanya filter & submit form yang butuh JS |

---

## 9. Metrik keberhasilan

| Metrik | Status | Catatan |
| --- | --- | --- |
| Lighthouse ≥ 90 (Performance, SEO, A11y, Best Practices) | 🔎 | Semua prasyarat kode sudah dipenuhi; ukur di preview Vercel |
| Page load < 3 detik | 🔎 | Halaman statis + gambar CDN |
| 5 halaman responsif | ✅ | Terverifikasi lewat screenshot 390px & 1440px |
| Form end-to-end (submit → validasi → email → sukses) | 🔎 | Alur kode lengkap; butuh `RESEND_API_KEY` asli untuk uji kirim |

---

## 10. Revisi visual (palet hijau-emas, quick navigation, footer)

| Item | Status | Catatan |
| --- | --- | --- |
| Hijau sebagai primary, emas sebagai accent | ✅ | Token `--brand-*` (hijau) & `--accent-*` (emas) di `globals.css`; tidak ada hex hardcoded di komponen |
| Konsisten di button, navbar, heading, ikon, kartu, section accent, hover, link, footer | ✅ | Diverifikasi pada 5 halaman × 2 breakpoint |
| Netral tetap dominan (putih, off-white `#F6F9F7`, dark neutral) | ✅ | Emas hanya untuk button accent, garis aksen, eyebrow, ikon footer, hover kartu |
| Gradient hijau→emas terbatas | ✅ | Hanya `.rule-accent` (garis 2px) dan batas atas kartu quick nav saat hover |
| Kontras WCAG AA | ✅ | ink 15.8:1, ink-muted 7.2:1, `brand-700`/putih 8.9:1, `accent-300` + `brand-950` 7.7:1 |
| 4 kartu statistik diganti 3 kartu quick navigation | ✅ | `QuickNavCards.tsx`; masing-masing `<Link>` ke `/artha-labs`, `/activity`, `/contact` |
| Kartu compact + hover smooth | ✅ | `p-5`, elevasi + `-translate-y-1` + border hijau + ikon jadi emas, `motion-reduce:transform-none` |
| Section Sejarah, Founder, Tim dihapus dari struktur | ✅ | Section, data (`historyMilestones`, `founder`, `teamMembers`), tipe `TeamMember`, dan 4 file gambar dihapus |
| Spacing & alternasi tone setelah penghapusan | ✅ | Hero → quick nav (`spacing="sm"`) → Visi & Misi (muted) → Values (default) → CTA (brand) |
| Footer 4 kolom (Company, Navigation, Business, Contact) | ✅ | Dark green gradient + garis emas; data diambil dari `siteConfig`, `navItems`, `socialLinks`, `businessAreas` |
| Copyright | ✅ | © {tahun} CV Artha Falah Utama. All Rights Reserved. |
| Footer responsif | ✅ | 1 kolom (mobile) → 2 kolom (≥640px) → 4 kolom (≥1024px) |
| Quick nav card di mobile tidak sempit | ✅ | 1 kolom penuh di 390px, 2 kolom di tablet, 4 kolom di desktop |
| Tidak ada overflow horizontal / layout rusak | ✅ | Screenshot 390px & 1440px untuk kelima halaman |
| Fungsi lama tidak berubah | ✅ | Routing, marquee, filter kategori, validasi & API form, SEO/sitemap/robots tetap seperti semula |

---

## 11. Refinement premium (footer, palet, search & filter brand, product card)

| Item | Status | Catatan |
| --- | --- | --- |
| Segment CTA di atas footer dihapus seluruhnya | ✅ | `CtaSection.tsx` dihapus dari repo; tidak ada teks pengganti/lorem baru di keempat halaman |
| Spacing setelah penghapusan tetap rapi | ✅ | Halaman berakhir dengan section konten → footer; alternasi tone `default`/`soft` menjaga ritme |
| Footer satu segment, minimal & clean | ✅ | 3 kolom: Company (logo + deskripsi + sosial) / Navigation (4 tautan) / Contact (email, telepon, WhatsApp, alamat, jam kerja) + copyright |
| Footer responsif | ✅ | 1 kolom (390px) → 2 kolom (≥640px) → 3 kolom (≥1024px) |
| Dark green sedikit lebih terang, tetap dark | ✅ | `brand-700` `#165F44`, `brand-900` `#0B3929`; teks putih ≈7.6:1 dan ≈12.9:1 |
| Hierarki hijau (tint → secondary → primary → deep) | ✅ | 11 shade `brand-50` … `brand-950` dengan peran terdokumentasi di README |
| Gold lebih jelas sebagai gold (tidak beige/kuning terang) | ✅ | `accent-400` `#D6AF36`, `accent-300` `#EDC85E`; kontras dengan `brand-950` ≈7.5:1 |
| Gold hanya sebagai accent | ✅ | Button accent, divider hero, eyebrow rule, heading footer, ikon kontak, chip brand aktif, dot kartu |
| Filter brand memakai brand asli dari data | ✅ | `productBrands` diturunkan dari `brands.ts`; tidak ada nama brand fiktif tambahan |
| Filter brand: active state, hover, tidak overflow | ✅ | Chip gold saat aktif; mobile 1 baris `overflow-x-auto` + `scrollbar-soft`, wrap mulai ≥640px |
| Search real-time (nama, brand, model, kategori, deskripsi) | ✅ | Filter dijalankan di klien via `useMemo`; input `h-12` dengan tombol clear |
| Counter hasil | ✅ | "Menampilkan X dari 9 produk" dengan `aria-live="polite"` |
| Empty state profesional + Clear filters | ✅ | Ikon search, judul "Produk tidak ditemukan", saran, tombol reset; bukan gaya error |
| Product card lengkap | ✅ | Gambar, badge kategori, brand • model, nama, deskripsi singkat, CTA "Minta penawaran" |
| Hover card halus | ✅ | Elevasi `-translate-y-1`, border hijau, zoom gambar `scale-1.04`, CTA bergeser; `motion-reduce` aman |
| Button state lengkap | ✅ | default/hover/active/disabled untuk 5 varian (primary, secondary, accent, ghost, inverted) |
| Detail premium terukur | ✅ | Gold divider hero, gradient section `soft`, eyebrow rule, micro-interaction `active:translate-y-px` |
| Touch target mobile | ✅ | Chip & button minimal 40–48px, input 48px |
| Tidak ada overflow horizontal / layout rusak | ✅ | Screenshot 390px & 1440px untuk kelima halaman setelah revisi |
| Fungsi lama tidak berubah | ✅ | Routing 5 halaman, marquee, filter kategori, validasi & API form, SEO/sitemap/robots tetap sama |

---

## 12. Katalog interaktif & alur RFQ

- [x] Seluruh area product card clickable ke `/artha-labs/[slug]`, CTA "Minta penawaran" tetap berfungsi terpisah
- [x] Slug otomatis dari nama produk: lowercase, tanpa spasi/karakter aneh, unik (penanganan duplikat)
- [x] Halaman detail dinamis satu template (`generateStaticParams` + `generateMetadata`), tidak ada halaman hardcoded
- [x] Header detail: brand, nama, model, kategori, gambar, short description, CTA - desktop 2 kolom, mobile bertumpuk
- [x] Section "Deskripsi Produk" hanya memakai data yang tersedia (paragraf + bullet poin penting)
- [x] Section "Informasi Packaging" tampil sebagai tabel bila ada data; bila belum ada, catatan netral tanpa `Lorem ipsum`/`N/A`
- [x] Section "Informasi Tambahan" (spesifikasi + grup info) memakai tabel clean, terbaca di 390px tanpa scroll horizontal
- [x] CTA "Minta Penawaran" memakai design system (dark green + gold accent) dan ikon email
- [x] Query parameter `?product=&category=` + anchor `#contact-form`, satu logika untuk semua produk
- [x] Form Contact Us terisi otomatis (subject & message, tetap editable) + panel "Requesting a quote for"
- [x] Contact Us tanpa parameter tetap kosong dan berfungsi seperti sebelumnya (Normal Flow)
- [x] Breadcrumb `Home / Artha Labs / Product Name` + link "Back to Artha Labs", tidak dominan
- [x] Related products (kategori/brand sama) tidak menampilkan produk yang sedang dibuka; section disembunyikan bila kosong
- [x] `loading.tsx` skeleton & `not-found.tsx` "Product Not Found" + tombol kembali
- [x] Sitemap menambahkan seluruh route produk; JSON-LD `Product` hanya memakai data yang tersedia
- [x] Visual QA preview statis: `product-detail` 1440/390, `product-detail-filled` 1440/390, `contact-quote` 1440/390, `artha-labs` 1440/390 - tanpa horizontal overflow

## 13. Brosur PDF, tab produk, dan filter katalog v2

- [x] Tombol **Download Brochure** di Product Header (secondary) di samping CTA primary **Minta Penawaran**
- [x] Tombol brosur hanya muncul bila `brochureUrl` terisi; tanpa data, tombol disembunyikan (tanpa broken link / PDF dummy)
- [x] Tiga section digabung menjadi tab horizontal: Detail Produk / Spesifikasi Produk / Informasi Tambahan
- [x] Hanya konten tab aktif yang dirender sehingga halaman jauh lebih compact
- [x] Tab aktif jelas: dark green + teks gold + underline gold; transisi fade subtle dan hormati `prefers-reduced-motion`
- [x] Tab bisa dioperasikan dengan keyboard (panah kiri/kanan, Home, End) dengan `role="tablist"`/`tab`/`tabpanel`
- [x] Mobile: container tab memakai scroll horizontal, tab aktif tetap terlihat, tanpa layout berantakan
- [x] Spesifikasi wajib tabel (header dark green, header kolom nilai gold, zebra subtle, hover row), scroll terkendali di dalam tabel saja
- [x] Informasi Tambahan memakai tabel packaging + kartu informasi (bullet/key-value/note), tanpa placeholder
- [x] Filter Artha Labs terstruktur: Find your product -> Search -> Brand -> Category -> Active filters -> Counter -> Grid
- [x] Filter brand memakai dropdown searchable (active state, clear selection, tutup via klik luar/Escape)
- [x] Active filter chips bisa dihapus satu per satu + tombol `Clear all filters` yang subtle
- [x] Counter dinamis: `X products found` / `Showing X of Y products`
- [x] Search + brand + kategori bekerja bersamaan secara real-time
- [x] Empty state: `No products found` + tombol `Clear filters`
- [x] Mobile: filter di balik tombol **Filter** dengan badge jumlah filter aktif, target sentuh >= 40px
- [x] Product card tidak berubah desain; transisi muncul/hilang tetap halus (framer-motion layout)
- [x] Visual QA preview: `artha-labs`, `artha-labs-filtered`, `product-detail`, `product-detail-spec`, `product-detail-extra` pada 1440 & 390 - tanpa horizontal overflow

## 14. Yang harus dilakukan sebelum go-live

1. `npm install` → `npm run typecheck` → `npm run lint` → `npm run build` (belum pernah dijalankan; sandbox tanpa internet).
2. Isi environment variables di Vercel (lihat README).
3. Uji kirim form sungguhan ke `CONTACT_TO_EMAIL` dan verifikasi domain pengirim di Resend.
4. Ganti konten lorem ipsum + gambar placeholder (semua di `lib/data/*` dan `public/`).
5. Jalankan Lighthouse pada URL produksi, targetkan ≥ 90 di keempat kategori.
6. Ganti rate limit in-memory ke Vercel KV/Upstash jika trafik form tinggi.
